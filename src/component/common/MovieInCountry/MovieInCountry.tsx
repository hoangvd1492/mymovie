import { ListCardGrid } from "@/component/utils/card/ListCardGrid";
import { Pagination } from "@/component/utils/pagination/Pagination";
import { MovieService } from "@/service/movie.service";

export async function MovieInCountry({
  slug,
  currentPage,
}: {
  slug: string;
  currentPage: number;
}) {
  const data = await MovieService.getMovieByCountry(slug, currentPage);
  return (
    <div>
      <ListCardGrid data={data.results} />
      <div className="flex justify-center mt-8">
        <Pagination cur={data.current} total={data.totalPage} />
      </div>
    </div>
  );
}
