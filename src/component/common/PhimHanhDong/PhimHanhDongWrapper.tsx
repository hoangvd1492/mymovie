import { MovieService } from "@/service/movie_tp.service";
import { PhimHanhDong } from "./PhimHanhDong";

export async function PhimHanhDongWrapper() {
  const data = await MovieService.getMovieByGenres("hanh-dong");

  return <PhimHanhDong data={data.results} />;
}
