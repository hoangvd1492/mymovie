import { Banner } from "@/component/common/banner/Banner";
import { PhimVietNamWrapper } from "@/component/common/PhimVietNam/PhimVietNamWrapper";
import { PhimHanWrapper } from "@/component/common/PhimHan/PhimHanWrapper";
import { Loading } from "@/component/utils/loading/Loading";

import { MovieService } from "@/service/movie.service";
import { ChevronsRight, Shuffle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PhimHanhDongWrapper } from "@/component/common/PhimHanhDong/PhimHanhDongWrapper";
import { PhimHocDuongWrapper } from "@/component/common/PhimHocDuong/PhimHocDuongWrapper";
import { PhimKinhDiWrapper } from "@/component/common/PhimKinhDi/PhimKinhDiWrapper";
import { RandomMovie } from "@/component/common/random/Random";

export default async function Home() {
  const banner = await MovieService.getBanner();

  return (
    <>
      <Banner data={banner} />
      <div className="container mt-16">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <div className="text-secondary text-xl font-bold">
              <span>Phim Việt Nam</span>
            </div>
            <Suspense fallback={<Loading />}>
              <PhimVietNamWrapper />
            </Suspense>
            <Link
              href="country/viet-nam"
              className="self-end  group inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition"
            >
              <span>Xem thêm</span>
              <ChevronsRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-secondary text-xl font-bold">
              <span>Phim Hàn Quốc</span>
            </div>
            <Suspense fallback={<Loading />}>
              <PhimHanWrapper />
            </Suspense>
            <Link
              href="/country/han-quoc"
              className="self-end  group inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition"
            >
              <span>Xem thêm</span>
              <ChevronsRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-secondary text-xl font-bold">
              <span>Phim Hành Động</span>
            </div>
            <Suspense fallback={<Loading />}>
              <PhimHanhDongWrapper />
            </Suspense>
            <Link
              href="/explore/hanh-dong"
              className="self-end  group inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition"
            >
              <span>Xem thêm</span>
              <ChevronsRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-secondary text-xl font-bold">
              <span>Phim Học Đường</span>
            </div>
            <Suspense fallback={<Loading />}>
              <PhimHocDuongWrapper />
            </Suspense>
            <Link
              href="/expore/hoc-duong"
              className="self-end  group inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition"
            >
              <span>Xem thêm</span>
              <ChevronsRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-secondary text-xl font-bold">
              <span>Phim Kinh Dị</span>
            </div>
            <Suspense fallback={<Loading />}>
              <PhimKinhDiWrapper />
            </Suspense>
            <Link
              href="/explore/kinh-di"
              className="self-end  group inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition"
            >
              <span>Xem thêm</span>
              <ChevronsRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <RandomMovie />
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: "Remine - Trang chủ",
};
