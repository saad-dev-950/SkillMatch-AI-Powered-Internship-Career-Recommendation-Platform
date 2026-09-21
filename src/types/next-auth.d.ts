import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: "STUDENT" | "ADMIN";
    name?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "ADMIN";
  }
}
