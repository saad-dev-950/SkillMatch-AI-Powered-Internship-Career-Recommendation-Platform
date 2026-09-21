import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { profile: true },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordsMatch) {
          return null;
        }

        const fullName = user.profile
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : user.email.split("@")[0];

        return {
          id: user.id,
          email: user.email,
          role: user.role as "STUDENT" | "ADMIN",
          name: fullName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "STUDENT" | "ADMIN";
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "skillmatch-dev-secret-key-32-characters-minimum-length-for-security",
});
