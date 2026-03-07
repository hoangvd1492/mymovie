import { MovieService } from "@/service/movie_tp.service";
import { PhimHocDuong } from "./PhimHocDuong";

export async function PhimHocDuongWrapper() {
  const data = await MovieService.getMovieByGenres("hoc-duong");

  return <PhimHocDuong data={data.results} />;
}
