"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative h-full text-white overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* 404 image */}
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

        {/* text */}
        <div className="text-2xl font-bold tracking-wide mb-3">
          Page Lost In The Multiverse 👀
        </div>

        {/* actions */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded bg-primary/80 text-foreground font-semibold hover:bg-primary transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => history.back()}
            className="px-4 py-2 rounded border border-white/30 hover:bg-white/10 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
