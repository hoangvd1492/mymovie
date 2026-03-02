import { MovieCard } from "./MovieCard";

export const ListCardGrid: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-8">
      {data.map((item: any, i: number) => (
        <MovieCard key={i} item={item} />
      ))}
    </div>
  );
};
