import { MovieService } from "@/service/movie.service";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const genres = await MovieService.getTopics();

  const countries = await MovieService.getCountries();

  return <Header genres={genres} countries={countries} />;
}
