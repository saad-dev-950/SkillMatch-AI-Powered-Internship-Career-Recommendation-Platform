"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { signOut } from "@/lib/auth";

export async function registerStudentAction(input: RegisterInput) {
  try {
    const validated = registerSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid form data",
      };
    }

    const { firstName, lastName, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase();

    // Check existing user
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create User & Profile transactionally
    await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: "STUDENT",
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
    });

    return {
      success: true,
      message: "Account created successfully! You can now log in.",
    };
  } catch (error: any) {
    console.error("Error in registerStudentAction:", error);
    const errorMsg = error?.message || "An unexpected server error occurred. Please try again.";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
