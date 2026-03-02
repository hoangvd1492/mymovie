"use client";

import { useState, useTransition } from "react";
import { Plus, Check, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { toggleFavorite } from "@/lib/action/favorites";

export function SaveButton({
  slug,
  isFavorite,
}: {
  slug: string;
  isFavorite: boolean;
}) {
  const [saved, setSaved] = useState(isFavorite);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleFavorite(slug);
      alert(result.message);
      setSaved((prev) => !prev);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-semibold"
    >
      <div className="flex flex-row gap-2">
        {saved ? <BookmarkCheck className="text-primary" /> : <BookmarkPlus />}
      </div>
    </button>
  );
}
