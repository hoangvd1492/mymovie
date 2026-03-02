import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm } from "@/component/common/AuthForm/ResetPasswordForm";
import { ProfileForm } from "@/component/common/AuthForm/ProfileForm";
import Image from "next/image";
import { AuthForm } from "@/component/common/AuthForm/AuthForm";

export const metadata = {
  title: "Remine - Người dùng",
};

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className=" flex flex-col items-center justify-center text-center">
        <div className="mb-6 animate-fade-in">
          <Image
            src="/404.png"
            alt="404 Not Found"
            width={260}
            height={260}
            priority
            className="mx-auto mb-6 opacity-90"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Bạn chưa đăng nhập!</h1>
          <AuthForm
            trigger={
              <button className="bg-secondary px-4 py-1 rounded text-background font-bold">
                Đăng nhập
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <p className="text-red-500">Không thể tải thông tin tài khoản</p>
      </div>
    );
  }

  return (
    <div className=" container  py-10 space-y-8">
      <h1 className="text-2xl font-bold text-secondary">Cài đặt tài khoản</h1>

      <ProfileForm currentName={profile.display_name} />

      <ChangePasswordForm />
    </div>
  );
}
