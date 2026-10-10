import type { Metadata } from "next";
import { Suspense } from "react";
import { PostDetail } from "./post-detail";

export const metadata: Metadata = { title: "Post" };

export default function PostPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <Suspense>
      <PostDetail params={params} />
    </Suspense>
  );
}
