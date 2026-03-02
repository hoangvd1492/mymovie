"use client";
import dynamic from "next/dynamic";

import { MovieCard } from "@/component/utils/card/MovieCard";
const Slide = dynamic(() => import("@/component/utils/slide/Slide"), {
  ssr: false,
});

export const PhimHan: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div>
      <Slide
        slideKey="PhimHan"
        data={data}
        renderItem={(item) => <MovieCard item={item} />}
      />
    </div>
  );
};
