"use server";

import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementViews(postId: string) {
  try {
    await db
      .update(posts)
      .set({
        views: sql`${posts.views} + 1`,
      })
      .where(eq(posts.id, postId));
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}
