import { Play } from "lucide-react";
import Link from "next/link";

export const MovieCard: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div className="movie-card relative ">
      <div className="w-full aspect-2/3 overflow-hidden mb-4 rounded">
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

      <Link href={`/${item.slug}`}>
        <div className="text-sm font-semibold hover:underline hover:text-secondary">
          <span className="line-clamp-2">{item.title}</span>
        </div>
      </Link>

      <div className="text-[10px] absolute top-[8px]  left-[8px] bg-secondary text-background px-2 py-1 rounded-sm">
        <span>{item.duration}</span>
      </div>
    </div>
  );
};
