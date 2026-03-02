"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  cur: number;
  total: number;
}

export const Pagination = ({ cur, total }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const hasPrevPage = cur > 1;
  const hasNextPage = cur < total;

  return (
    <div className="flex items-center gap-4 w-fit">
      {hasPrevPage && (
        <button
          className="bg-secondary p-2 rounded text-background font-bold"
          onClick={() => goToPage(cur - 1)}
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <span>
        {cur} / {total}
      </span>

      {hasNextPage && (
        <button
          className="bg-secondary p-2 rounded text-background font-bold"
          onClick={() => goToPage(cur + 1)}
        >
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
};
