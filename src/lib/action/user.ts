"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";

export async function updateProfile(displayName: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "Unauthorized" };
  }

  // ===== SERVER VALIDATION =====
  const name = displayName?.trim();

  if (!name) {
    return { error: true, message: "Tên hiển thị không được để trống" };
  }

  if (name.length < 2) {
    return { error: true, message: "Tên phải có ít nhất 2 ký tự" };
  }

  if (name.length > 50) {
    return { error: true, message: "Tên không được quá 50 ký tự" };
  }

  const nameRegex = /^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF ]+$/;

  if (!nameRegex.test(name)) {
    return {
      error: true,
      message: "Tên chỉ được chứa chữ cái, số, dấu gạch dưới và khoảng trắng",
    };
  }

  // ===== UPDATE DATABASE =====
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: name })
    .eq("id", user.id);

  if (error) {
    return { error: true, message: error.message };
  }

  return { error: false };
}
export async function changePassword(newPassword: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "Unauthorized" };
  }

  const password = newPassword?.trim();

  if (!password) {
    return { error: true, message: "Mật khẩu không được để trống" };
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return {
      error: true,
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: true, message: error.message };
  }

  return { error: false };
}
