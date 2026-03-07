import { Comment } from "@/component/utils/comment/Comment";
import { ListCardCol } from "@/component/utils/card/ListCardCol";
import { SaveButton } from "@/component/utils/save-button/SaveButton";
import { isFavorite } from "@/lib/action/favorites";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { MovieService } from "@/service/movie_tp.service";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await MovieService.getDetail(slug);

  if (!movie) {
    return {
      title: "Không tìm thấy phim",
      description: "Phim không tồn tại hoặc đã bị xóa",
    };
  }

  return {
    title: `Phim ${movie.title}`,
    description: `Tổng hợp phim ${movie.title} hay nhất, cập nhật liên tục.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const movie = await MovieService.getDetail(slug);

  if (!movie) return notFound();

  const user = await getCurrentUser();

  const isFav = user ? await isFavorite(slug) : false;

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        <div
          className="
      absolute inset-0
      bg-center bg-cover
      grayscale blur-md scale-110
    "
          style={{ backgroundImage: `url(${movie.poster})` }}
        />

        {/* Overlay tối */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Content */}
        <div className="relative z-20 container px-6 py-12">
          <div className="flex flex-col md:items-start items-center  md:flex-row gap-8 text-white">
            {/* Poster */}
            <div className="w-[200px] shrink-0">
              <img
                src={movie.thumbnail ?? movie.poster}
                alt={movie.title}
                className="w-full rounded shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="text-2xl text-secondary font-bold leading-tight text-center md:text-start">
                {movie.title}
              </div>
              {movie.alias && (
                <p className="text-gray-200 leading-relaxed text-justify text-sm ">
                  {movie.alias}
                </p>
              )}
              {/* Meta */}

              {movie.tags && (
                <div className="flex flex-row gap-2 flex-wrap">
                  {movie.tags.map((g: string, i: number) => {
                    return (
                      <div
                        key={i}
                        className="text-sm font-[700] bg-secondary text-background w-fit py-1 px-4 rounded-xl"
                      >
                        {g}
                      </div>
                    );
                  })}
                </div>
              )}

              {movie.genres && (
                <div className="flex flex-row gap-2 flex-wrap">
                  {movie.genres.map((g: string, i: number) => {
                    return (
                      <div
                        key={i}
                        className="text-sm font-[700] bg-background/70 w-fit py-1 px-4 rounded-xl"
                      >
                        {g}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-gray-200 leading-relaxed text-justify text-sm">
                <span className="font-[300]"> Thời lượng: </span>{" "}
                {movie.duration}
              </p>
              <p className="text-gray-200 leading-relaxed text-justify text-sm">
                <span className="font-[300]"> Đạo diễn: </span> {movie.director}
              </p>
              <p className="text-gray-200 leading-relaxed text-justify text-sm">
                <span className="font-[300]"> Diễn viên: </span>{" "}
                {movie.actors.join(", ")}
              </p>

              <div className="whitespace-pre-wrap text-justify text-[12px] font-thin">
                {movie.description}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Link
                  href={
                    movie.episodes?.length
                      ? `/${slug}/watch?ep=${movie.episodes[0].slug}`
                      : `/${slug}/watch`
                  }
                >
                  <div className="px-4 py-2 bg-primary/80 hover:bg-primary rounded font-semibold">
                    <div className="flex flex-row gap-2">
                      <Play /> Xem ngay
                    </div>
                  </div>
                </Link>
                {user && <SaveButton slug={slug} isFavorite={isFav} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-16">
        {movie.episodes && !!movie.episodes.length && (
          <>
            <div className="text-secondary text-xl font-bold">
              <span>Danh sách tập phim:</span>
            </div>
            <div className="flex flex-row gap-2 flex-wrap my-4">
              {movie.episodes.map((ep: any) => {
                return (
                  <Link key={ep.slug} href={`/${slug}/watch?ep=${ep.slug}`}>
                    <div className="bg-secondary/80 hover:bg-secondary text-center w-[100px] py-1 px-3 rounded text-background font-[700]">
                      {ep.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="container">
        <div className="mt-16 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4 ">
            <Comment slug={slug} />
          </div>
          <div>
            <div className="text-secondary text-xl font-bold mb-8">
              <span>Có thể bạn cũng muốn xem:</span>
            </div>
            <div className="bg-background p-4 rounded-[4px]">
              <ListCardCol data={movie.recommend} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
