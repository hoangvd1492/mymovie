"use client";

import { useState, useTransition } from "react";
import { createComment } from "@/lib/action/comment";

const MAX_LENGTH = 500;

export function CommentForm({ slug }: { slug: string }) {
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await createComment(slug, content);

      if (!res?.error) {
        setContent("");
      } else {
        alert(res.message);
      }
    });
  };

  const remaining = MAX_LENGTH - content.length;

  return (
    <div className="space-y-2">
      <textarea
        maxLength={MAX_LENGTH}
        className="w-full border rounded-lg p-3 field-sizing-content min-h-[128px]"
        placeholder="Viết bình luận..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Counter */}
      <div className="flex justify-between text-[12px] text-muted-foreground">
        <span>Tối đa 500 ký tự</span>
        <span className={remaining < 50 ? "text-red-500" : ""}>
          {content.length}/{MAX_LENGTH}
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={pending || content.length === 0}
        className="px-4 py-2 bg-secondary text-sm text-background font-semibold rounded disabled:opacity-50"
      >
        {pending ? "Đang gửi..." : "Gửi bình luận"}
      </button>
    </div>
  );
}
