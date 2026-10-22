const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting idempotent database seeding...");

  // Passwords
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 10);
  const studentPasswordHash = await bcrypt.hash("StudentPassword123!", 10);

  // 1. Create or ensure Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@skillmatch.com" },
    update: {},
    create: {
      email: "admin@skillmatch.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin ready: ${admin.email}`);

  // 2. Create or ensure Student User & Profile
  let student = await prisma.user.findUnique({
    where: { email: "student@skillmatch.com" },
    include: { profile: true },
  });

  if (!student) {
    student = await prisma.user.create({
      data: {
        email: "student@skillmatch.com",
        passwordHash: studentPasswordHash,
        role: "STUDENT",
        profile: {
          create: {
            firstName: "Alex",
            lastName: "Rivera",
            phone: "+1 (555) 234-5678",
            bio: "Passionate Senior Computer Science student at Stanford specializing in full-stack web engineering, AI applications, and cloud architecture.",
            location: "San Francisco, CA",
            targetRole: "Full-Stack Software Engineering Intern",
            preferredWorkMode: "REMOTE",
            educations: {
              create: {
                institution: "Stanford University",
                degree: "Bachelor of Science",
                fieldOfStudy: "Computer Science",
                startDate: new Date("2021-09-01"),
                isCurrent: true,
                gpa: 3.85,
              },
            },
          },
        },
      },
      include: { profile: true },
    });
    console.log(`✅ Student created: ${student.email}`);
  } else {
    console.log(`✅ Student ready: ${student.email}`);
  }

  // 3. Create or ensure Base Skills
  const skillsData = [
    { name: "TypeScript", category: "Frontend" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Prisma", category: "Database" },
    { name: "Docker", category: "DevOps" },
    { name: "Machine Learning", category: "AI / Data" },
  ];

  const createdSkills = {};
  for (const s of skillsData) {
    const created = await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
    createdSkills[s.name] = created.id;
  }
  console.log(`✅ ${skillsData.length} skills verified.`);

  // Link skills to student if profile exists
  if (student.profile) {
    const studentSkillLinks = [
      { skillId: createdSkills["TypeScript"], level: "ADVANCED" },
      { skillId: createdSkills["React"], level: "ADVANCED" },
      { skillId: createdSkills["Next.js"], level: "INTERMEDIATE" },
      { skillId: createdSkills["Node.js"], level: "INTERMEDIATE" },
      { skillId: createdSkills["PostgreSQL"], level: "INTERMEDIATE" },
    ];
    for (const link of studentSkillLinks) {
      if (link.skillId) {
        await prisma.studentSkill.upsert({
          where: {
            profileId_skillId: {
              profileId: student.profile.id,
              skillId: link.skillId,
            },
          },
          update: {},
          create: {
            profileId: student.profile.id,
            skillId: link.skillId,
            level: link.level,
          },
        });
      }
    }
  }

  // 4. Create or ensure Job Categories
  const categoriesData = [
    { name: "Software Engineering", slug: "software-engineering" },
    { name: "Data Science & AI", slug: "data-science-ai" },
    { name: "UI/UX Design", slug: "ui-ux-design" },
    { name: "Product Management", slug: "product-management" },
  ];

  const createdCategories = {};
  for (const c of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    createdCategories[c.slug] = created.id;
  }
  console.log(`✅ ${categoriesData.length} categories verified.`);

  // 5. Create Sample Internships if not present
  const existingJob1 = await prisma.internship.findFirst({
    where: { title: "Frontend Engineering Intern (Next.js)" },
  });
  if (!existingJob1) {
    await prisma.internship.create({
      data: {
        title: "Frontend Engineering Intern (Next.js)",
        companyName: "Vercel Innovation Labs",
        location: "San Francisco, CA",
        workMode: "REMOTE",
        type: "INTERNSHIP",
        stipend: 4500,
        description: "Join our core web experience team to build high-performance React components and Next.js applications.",
        responsibilities: "Develop reusable UI components, optimize Core Web Vitals, write unit and integration tests.",
        requirements: "Proficiency in React, TypeScript, and modern CSS frameworks.",
        categoryId: createdCategories["software-engineering"],
        status: "PUBLISHED",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        requiredSkills: {
          create: [
            { skillId: createdSkills["React"], isRequired: true },
            { skillId: createdSkills["TypeScript"], isRequired: true },
            { skillId: createdSkills["Next.js"], isRequired: true },
            { skillId: createdSkills["Tailwind CSS"], isRequired: false },
          ],
        },
      },
    });
    console.log("✅ Frontend Engineering Intern listing created.");
  }

  const existingJob2 = await prisma.internship.findFirst({
    where: { title: "Full-Stack Software Developer Intern" },
  });
  if (!existingJob2) {
    await prisma.internship.create({
      data: {
        title: "Full-Stack Software Developer Intern",
        companyName: "Stripe",
        location: "Seattle, WA",
        workMode: "HYBRID",
        type: "INTERNSHIP",
        stipend: 5200,
        description: "Help build scalable payment APIs and dashboard interfaces used by millions of global businesses.",
        responsibilities: "Design REST APIs, build frontend interfaces, write clean database queries.",
        requirements: "Experience with Node.js, TypeScript, PostgreSQL, and modern web application development.",
        categoryId: createdCategories["software-engineering"],
        status: "PUBLISHED",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        requiredSkills: {
          create: [
            { skillId: createdSkills["Node.js"], isRequired: true },
            { skillId: createdSkills["TypeScript"], isRequired: true },
            { skillId: createdSkills["PostgreSQL"], isRequired: true },
            { skillId: createdSkills["Docker"], isRequired: false },
          ],
        },
      },
    });
    console.log("✅ Full-Stack Software Developer Intern listing created.");
  }

  console.log("🎉 Database seeding completed safely and successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
