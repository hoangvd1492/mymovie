"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchBar: React.FC<{ value: string }> = ({ value }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [input, setInput] = useState(value ?? "");

  useEffect(() => {
    setInput(value ?? "");
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!input) return;
      const params = new URLSearchParams(searchParams.toString());

      if (input) {
        params.set("query", input);
      } else {
        params.delete("query");
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div className="relative">
      <input
        className="w-full bg-background py-3 pl-12 pr-4 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search..."
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <Search />
      </div>
    </div>
  );
};
