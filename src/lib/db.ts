import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import zlib from "zlib";
import { SEED_DB_GZIP_BASE64 } from "./seedDbBackup";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function ensureVercelDatabase(): string {
  const tmpDbPath = path.join("/tmp", "dev.db");

  // Check if /tmp/dev.db is already present and valid
  if (fs.existsSync(tmpDbPath)) {
    try {
      const stats = fs.statSync(tmpDbPath);
      if (stats.size > 1000) {
        return `file:${tmpDbPath}`;
      }
    } catch {}
  }

  // 1. Try copying from disk candidates
  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
    path.join(__dirname, "prisma", "dev.db"),
    path.resolve("prisma", "dev.db"),
  ];

  let copied = false;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        fs.copyFileSync(candidate, tmpDbPath);
        copied = true;
        break;
      } catch (e) {
        console.error("[SkillMatch DB] Failed to copy candidate to /tmp:", e);
      }
    }
  }

  // 2. If disk copy failed or file wasn't bundled, unpack from embedded gzip seed
  if (!copied || !fs.existsSync(tmpDbPath)) {
    try {
      const gzippedBuffer = Buffer.from(SEED_DB_GZIP_BASE64, "base64");
      const unzipped = zlib.gunzipSync(gzippedBuffer);
      fs.writeFileSync(tmpDbPath, unzipped);
      console.log(`[SkillMatch DB] Initialized seed database in /tmp/dev.db (${unzipped.length} bytes)`);
    } catch (err) {
      console.error("[SkillMatch DB] Failed to unpack seed database to /tmp:", err);
    }
  }

  return `file:${tmpDbPath}`;
}

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // If user configured a cloud database (PostgreSQL, Supabase, Neon, etc.)
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // When deployed to Vercel serverless environment
  if (process.env.VERCEL) {
    return ensureVercelDatabase();
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
