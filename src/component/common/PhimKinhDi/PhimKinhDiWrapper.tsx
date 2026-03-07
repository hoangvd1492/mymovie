import { MovieService } from "@/service/movie_tp.service";
import { PhimKinhDi } from "./PhimKinhDi";

export async function PhimKinhDiWrapper() {
  const data = await MovieService.getMovieByGenres("kinh-di");

  return <PhimKinhDi data={data.results} />;
}
