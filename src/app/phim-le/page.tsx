import { PhimLe } from "@/component/common/PhimLe/PhimLe";
import { Loading } from "@/component/utils/loading/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Remine - Phim lẻ",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  return (
    <div className="container mt-16">
      <div className="font-bold text-lg text-secondary mb-8">
        Danh sách phim lẻ:
      </div>

      <Suspense fallback={<Loading />}>
        <PhimLe currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
