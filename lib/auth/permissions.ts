import { db } from "@/lib/db";
import { userModules, modules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserModules(userId: string): Promise<string[]> {
  const userModulesList = await db
    .select({ code: modules.code })
    .from(userModules)
    .innerJoin(modules, eq(userModules.moduleId, modules.id))
    .where(eq(userModules.userId, userId));

  return userModulesList.map((um) => um.code);
}

export async function hasModuleAccess(
  userId: string,
  moduleCode: string
): Promise<boolean> {
  const userModulesList = await getUserModules(userId);
  return userModulesList.includes(moduleCode);
}

export const MODULE_CODES = {
  NEWS_MANAGE: "NEWS_MANAGE",
  USER_MANAGE: "USER_MANAGE",
  TAG_MANAGE: "TAG_MANAGE",
} as const;
