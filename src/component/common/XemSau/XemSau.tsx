import { ListCardGrid } from "@/component/utils/card/ListCardGrid";
import { getFavorites } from "@/lib/action/favorites";

export async function XemSauList() {
  const data = await getFavorites();

  return <ListCardGrid data={data} />;
}
