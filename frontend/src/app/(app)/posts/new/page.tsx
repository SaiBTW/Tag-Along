import type { Metadata } from "next";
import { Notice, PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <>
      <PageTitle>New post</PageTitle>
      <Notice>
        The composer isn&apos;t built yet. It comes with the place picker and visibility
        settings in Phase 4.
      </Notice>
    </>
  );
}
