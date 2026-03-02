import { getComment } from "@/lib/action/comment";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock } from "lucide-react";

export async function CommentList({ slug }: { slug: string }) {
  const res = await getComment(slug);

  if (res.error) {
    return <p className="text-red-500 text-sm">Lỗi tải bình luận</p>;
  }

  if (!res.data || res.data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm mt-4">Chưa có bình luận</p>
    );
  }

  return (
    <div className="space-y-6 mt-12 max-h-[500px] overflow-y-auto">
      {res.data.map((comment) => (
        <div key={comment.id} className="space-y-2">
          {/* Header */}
          <div className="flex gap-2 items-center justify-between">
            <p className="font-semibold text-secondary">
              {(comment.profiles as any).display_name}
            </p>
            <span className="text-[10px] text-muted-foreground">
              <Clock className="inline me-1" size={12} />
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
