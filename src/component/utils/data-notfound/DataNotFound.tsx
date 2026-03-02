"use client";

import Image from "next/image";
import Link from "next/link";

export function DataNotFound() {
  return (
    <div className="relative h-full text-white overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
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

        <div className="text-2xl font-bold tracking-wide mb-3">
          Data Not Found!!
        </div>
      </div>
    </div>
  );
}
