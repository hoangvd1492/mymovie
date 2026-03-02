import { MovieService } from "@/service/movie.service";
import { PhimVietNam } from "./PhimVietNam";

export async function PhimVietNamWrapper() {
  const data = await MovieService.getMovieByCountry("viet-nam");

  return <PhimVietNam data={data.results} />;
}
