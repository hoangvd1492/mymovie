import { RandomMovie } from "@/component/common/random/Random";
import { Search } from "@/component/common/search/Search";
import { Loading } from "@/component/utils/loading/Loading";
import { SearchBar } from "@/component/utils/search-bar/SearchBar";
import { Suspense } from "react";
export const metadata = {
  title: "Remine - Tìm kiếm",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query = "" } = await searchParams;

  return (
    <div className="container">
      <div className="my-8">
        <div className="my-4">
          <SearchBar value={query} />
        </div>
        <div className="my-16">
          <Suspense key={query} fallback={<Loading />}>
            <Search query={query} />
          </Suspense>
        </div>
      </div>
      <RandomMovie />
    </div>
  );
}
