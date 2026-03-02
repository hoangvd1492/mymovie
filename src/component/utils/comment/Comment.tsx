import { CommentForm } from "@/component/utils/comment/CommentForm";
import { CommentList } from "./CommentList";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { AuthForm } from "@/component/common/AuthForm/AuthForm";

export const Comment = async ({ slug }: { slug: string }) => {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="text-secondary text-xl font-bold mb-8">Bình luận</div>
      <div className="bg-background p-4 rounded-[4px] space-y-2">
        {user ? (
          <CommentForm slug={slug} />
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <p className="text-muted-foreground my-2">
              Đăng nhập để bình luận.
            </p>
            <AuthForm
              trigger={
                <span className="cursor-pointer text-secondary font-bold">
                  Đăng nhập ngay!
                </span>
              }
            />
          </div>
        )}
        <Suspense>
          <CommentList slug={slug} />
        </Suspense>
      </div>
    </div>
  );
};
