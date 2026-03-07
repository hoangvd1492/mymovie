import { ListCardGrid } from "@/component/utils/card/ListCardGrid";
import { DataNotFound } from "@/component/utils/data-notfound/DataNotFound";
import { MovieService } from "@/service/movie_tp.service";

export async function Search({ query }: { query: string }) {
  const data = await MovieService.search(query);

  console.log(data);

  if (query && !data.length) return <DataNotFound />;

  return <ListCardGrid data={data} />;
}
