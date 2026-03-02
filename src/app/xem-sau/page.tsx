import { AuthForm } from "@/component/common/AuthForm/AuthForm";
import { XemSauList } from "@/component/common/XemSau/XemSau";
import { ListCardGrid } from "@/component/utils/card/ListCardGrid";
import { Loading } from "@/component/utils/loading/Loading";
import { getFavorites } from "@/lib/action/favorites";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import Image from "next/image";
import { Suspense } from "react";

export const metadata = {
  title: "Remine - Phim đã lưu",
};

export default async function Page() {
  const user = await getCurrentUser();

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

  return (
    <div className="container mt-16">
      <div className="font-bold text-lg text-secondary mb-8">
        Danh sách phim xem sau:
      </div>
      <Suspense fallback={<Loading />}>
        <XemSauList />
      </Suspense>
    </div>
  );
}
