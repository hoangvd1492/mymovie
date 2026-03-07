import { Play } from "lucide-react";
import Link from "next/link";

export const MovieCard2: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div className="movie-card-2 relative">
      <div className="flex flex-row gap-4">
        <div className="w-[96px] flex-shrink-0 aspect-4/5 overflow-hidden mb-4 rounded">
          <Link href={`/${item.slug}`}>
            <img
              src={item.thumbnail}
              className="
              w-full h-full object-cover
              transition-all duration-300 ease-out
             hover:scale-120
            "
            />
          </Link>
        </div>

        <div>
          <Link href={`/${item.slug}`}>
            <div className="text-sm font-semibold hover:underline text-secondary">
              <span className="line-clamp-2">{item.title}</span>
            </div>
          </Link>
          <div className="text-[12px]">
            <span>{item.alias}</span>
          </div>
          <div className="text-[8px] font-[300] text-white/80">
            <span>{item.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
