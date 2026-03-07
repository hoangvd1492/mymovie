import { MovieService } from "@/service/movie_tp.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Remine - Phim ngẫu nhiên",
};

export default async function Page() {
  const randomSlug = await MovieService.getRandom();
  if (!randomSlug) redirect("/");

  redirect(`/${randomSlug}`);
}
