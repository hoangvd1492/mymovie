import { MovieService } from "@/service/movie.service";
import { PhimHan } from "./PhimHan";

export async function PhimHanWrapper() {
  const data = await MovieService.getMovieByCountry("han-quoc");

  return <PhimHan data={data.results} />;
}
