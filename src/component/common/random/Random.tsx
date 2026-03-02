import { Shuffle } from "lucide-react";
import Link from "next/link";

export function RandomMovie() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="text-secondary text-xl font-bold">
        <span>Không biết xem gì?</span>
      </div>
      <Link
        href="/ngau-nhien"
        className="flex items-center gap-2 w-fit px-4 py-2 border-2 text-secondary border-secondary hover:opacity-80 transition"
      >
        <Shuffle size={18} />
        <span>Xem phim ngẫu nhiên</span>
      </Link>
    </div>
  );
}
