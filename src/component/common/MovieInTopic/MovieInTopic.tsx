import { ListCardGrid } from "@/component/utils/card/ListCardGrid";
import { Pagination } from "@/component/utils/pagination/Pagination";
import { MovieService } from "@/service/movie_tp.service";

export async function MovieInTopic({
  slug,
  currentPage,
}: {
  slug: string;
  currentPage: number;
}) {
  const data = await MovieService.getMovieByGenres(slug, currentPage);
  return (
    <div>
      <ListCardGrid data={data.results} />
      <div className="flex justify-center mt-8">
        <Pagination cur={data.current} total={data.totalPage} />
      </div>
    </div>
  );
}
