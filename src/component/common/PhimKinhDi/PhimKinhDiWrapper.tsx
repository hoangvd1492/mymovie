import { MovieService } from "@/service/movie.service";
import { PhimKinhDi } from "./PhimKinhDi";

export async function PhimKinhDiWrapper() {
  const data = await MovieService.getMovieByGenres("kinh-di");

  return <PhimKinhDi data={data.results} />;
}
