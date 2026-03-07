"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState } from "react";
import { Popcorn } from "lucide-react";
import Link from "next/link";

export const Banner: React.FC<{ data: any[] }> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentItem = data[currentSlide] ?? null;
  return (
    <div className="banner relative w-full h-[50vh] md:h-[90vh]">
      <Swiper
        className=" h-full w-full"
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".banner .content #pagination",
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex);
        }}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <img
              src={item.poster}
              className="banner-image w-full h-full object-cover object-[50%_0%]"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="content flex flex-col xl:flex-row justify-between items-center gap-8 xl:items-end w-full px-8">
        <div className="xl:w-1/2 w-full flex flex-col max-xl:items-center text-center xl:text-start">
          <div className=" mt-2 mb-2 lg:text-2xl font-[700]  text-md capitalize text-secondary">
            <span> {currentItem?.title}</span>
          </div>
          {currentItem?.alias && (
            <div className="mb-2 lg:text-sm font-[300]  text-md capitalize text-secondary">
              <span> {currentItem?.alias}</span>
            </div>
          )}
          <Link
            className="bg-primary w-fit px-4 py-2 mt-6 rounded-[30px] flex flex-row gap-1 items-center"
            href={`/${currentItem?.slug}`}
          >
            <Popcorn size={16} />
            Xem ngay
          </Link>
        </div>
        <div id="pagination"></div>
      </div>
    </div>
  );
};
