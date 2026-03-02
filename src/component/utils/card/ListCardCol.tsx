import { MovieCard2 } from "./MovieCard2";

export const ListCardCol: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="flex flex-col">
      {data.map((item: any, i: number) => (
        <MovieCard2 key={i} item={item} />
      ))}
    </div>
  );
};
