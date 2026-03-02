import { ListCardGrid } from "@/component/utils/card/ListCardGrid";
import { DataNotFound } from "@/component/utils/data-notfound/DataNotFound";
import { MovieService } from "@/service/movie.service";

export async function Search({ query }: { query: string }) {
  const data = await MovieService.search(query);

  if (query && !data.length) return <DataNotFound />;

  return <ListCardGrid data={data} />;
}
