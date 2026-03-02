import { MovieInTopic } from "@/component/common/MovieInTopic/MovieInTopic";
import { Loading } from "@/component/utils/loading/Loading";
import { MovieService } from "@/service/movie.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const countries = await MovieService.getTopics();
  const cur = countries.find((c) => c.slug === slug);

  if (!cur) {
    return {
      title: "Không tìm thấy danh mục",
      description: "Danh mục không tồn tại",
    };
  }

  return {
    title: `Phim ${cur.title}`,
    description: `Tổng hợp phim ${cur.title} hay nhất, cập nhật liên tục.`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const topics = await MovieService.getTopics();
  const cur = topics.find((c) => c.slug === slug);

  if (!cur) return notFound();

  return (
    <div className="container mt-16">
      <div className="font-bold text-lg text-secondary mb-8">
        Kết quả tìm kiếm cho: <i>{cur.title}</i>
      </div>

      <Suspense fallback={<Loading />}>
        <MovieInTopic slug={slug} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
