import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  await prisma.application.deleteMany();
  await prisma.internshipSkill.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.category.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create Passwords
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 10);
  const studentPasswordHash = await bcrypt.hash("StudentPassword123!", 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@skillmatch.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create Student User & Profile
  const student = await prisma.user.create({
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
    include: {
      profile: true,
    },
  });
  console.log(`✅ Student created: ${student.email}`);

  // 3. Create Base Skills
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

  const createdSkills: Record<string, string> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    createdSkills[s.name] = created.id;
  }
  console.log(`✅ ${skillsData.length} skills created.`);

  // Link skills to student
  if (student.profile) {
    await prisma.studentSkill.createMany({
      data: [
        { profileId: student.profile.id, skillId: createdSkills["TypeScript"], level: "ADVANCED" },
        { profileId: student.profile.id, skillId: createdSkills["React"], level: "ADVANCED" },
        { profileId: student.profile.id, skillId: createdSkills["Next.js"], level: "INTERMEDIATE" },
        { profileId: student.profile.id, skillId: createdSkills["Node.js"], level: "INTERMEDIATE" },
        { profileId: student.profile.id, skillId: createdSkills["PostgreSQL"], level: "INTERMEDIATE" },
      ],
    });
  }

  // 4. Create Job Categories
  const categoriesData = [
    { name: "Software Engineering", slug: "software-engineering" },
    { name: "Data Science & AI", slug: "data-science-ai" },
    { name: "UI/UX Design", slug: "ui-ux-design" },
    { name: "Product Management", slug: "product-management" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c });
    createdCategories[c.slug] = created.id;
  }
  console.log(`✅ ${categoriesData.length} categories created.`);

  // 5. Create Sample Internships
  const internship1 = await prisma.internship.create({
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
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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

  const internship2 = await prisma.internship.create({
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

  console.log(`✅ Sample internships created (${internship1.title}, ${internship2.title}).`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
