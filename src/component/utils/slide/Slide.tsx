"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface SlideProps<T> {
  slideKey: string;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  breakpoints?: any;
}

export default function Slide<T>({
  slideKey,
  data,
  renderItem,
  breakpoints,
}: SlideProps<T>) {
  return (
    <div id={slideKey} className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `#${slideKey} .slide-prev`,
          nextEl: `#${slideKey} .slide-next`,
        }}
        breakpoints={
          breakpoints ?? {
            0: { slidesPerView: 2, spaceBetween: 8 },
            640: { slidesPerView: 3, spaceBetween: 12 },
            768: { slidesPerView: 4, spaceBetween: 14 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
          }
        }
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>{renderItem(item)}</SwiperSlide>
        ))}
      </Swiper>

      {/* Prev */}
      <button className="hidden xl:block slide-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
        <ChevronLeft size={32} />
      </button>

      {/* Next */}
      <button className="hidden xl:block slide-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
