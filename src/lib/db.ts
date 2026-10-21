import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // If user configured a cloud database (PostgreSQL, Supabase, Neon, etc.)
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // When deployed to Vercel serverless environment
  if (process.env.VERCEL) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    // Copy bundled seed database into writable /tmp on cold start
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        path.join(__dirname, "prisma", "dev.db"),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          } catch (e) {
            console.error("[SkillMatch DB] Failed to copy seed sqlite db to /tmp:", e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Local development: resolve to absolute path
  if (envUrl && envUrl.startsWith("file:")) {
    const rawPath = envUrl.replace("file:", "");
    if (!path.isAbsolute(rawPath)) {
      const candidatePaths = [
        path.resolve(process.cwd(), "prisma", rawPath.replace(/^\.\//, "")),
        path.resolve(process.cwd(), rawPath),
        path.resolve("prisma", "dev.db"),
      ];
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          return `file:${p}`;
        }
      }
    }
  }

  return envUrl;
}

const resolvedUrl = getDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedUrl
      ? {
          db: {
            url: resolvedUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
