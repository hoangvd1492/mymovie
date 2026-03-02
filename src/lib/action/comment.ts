"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { revalidatePath } from "next/cache";

/* =========================
   CREATE COMMENT
========================= */
export async function createComment(slug: string, content: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "Unauthorized" };
  }

  if (!content.trim()) {
    return { error: true, message: "Comment cannot be empty" };
  }

  if (content.length > 500) {
    return { error: true, message: "Comment tối đa 500 ký tự" };
  }

  const { error } = await supabase.from("comments").insert({
    content, // giữ nguyên không trim
    movie_slug: slug,
    user_id: user.id,
  });

  if (error) {
    console.log("Create comment error:", error);
    return { error: true, message: error.message };
  }

  revalidatePath(`/movie/${slug}`);

  return { error: false };
}

/* =========================
   GET COMMENT
========================= */
export async function getComment(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      profiles (
        display_name
      )
    `,
    )
    .eq("movie_slug", slug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get comment error:", error);
    return { error: true, message: error.message };
  }

  return {
    error: false,
    data: data ?? [],
  };
}
