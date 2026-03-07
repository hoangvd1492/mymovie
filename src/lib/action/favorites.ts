"use server";

import { MovieService } from "@/service/movie_tp.service";
import { getCurrentUser } from "../supabase/getCurrentUser";
import { createClient } from "../supabase/server";

type ActionResponse = {
  error: boolean;
  message?: string;
};

export async function toggleFavorite(
  movieSlug: string,
): Promise<ActionResponse> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "Bạn chưa đăng nhập!" };
  }

  // Kiểm tra đã tồn tại chưa
  const { data: existing, error: fetchError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_slug", movieSlug)
    .maybeSingle();

  if (fetchError) {
    return { error: true, message: "Không thể kiểm tra trạng thái." };
  }

  // Nếu đã tồn tại → xoá
  if (existing) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return { error: true, message: "Không thể xoá khỏi danh sách." };
    }

    return { error: false, message: "Đã xoá khỏi danh sách xem sau!" };
  }

  // Nếu chưa tồn tại → thêm
  const { error: insertError } = await supabase.from("favorites").insert({
    user_id: user.id,
    movie_slug: movieSlug,
  });

  if (insertError) {
    return { error: true, message: "Không thể thêm vào danh sách." };
  }

  return { error: false, message: "Đã thêm vào danh sách xem sau!" };
}

export async function isFavorite(movieSlug: string): Promise<boolean> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_slug", movieSlug)
    .maybeSingle();

  return !!data;
}

export async function getFavorites() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("favorites")
    .select("movie_slug")
    .eq("user_id", user.id);

  if (error || !data) return [];

  const slugArr = data.map((d) => d.movie_slug);

  if (slugArr.length === 0) return [];

  return await MovieService.getBySlugArr(slugArr);
}
