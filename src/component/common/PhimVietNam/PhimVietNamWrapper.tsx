import { MovieService } from "@/service/movie_tp.service";
import { PhimVietNam } from "./PhimVietNam";

export async function PhimVietNamWrapper() {
  const data = await MovieService.getMovieByCountry("viet-nam");

  return <PhimVietNam data={data.results.slice(0, 15)} />;
}
