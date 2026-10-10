"use client";

import Link from "next/link";
import { use, useCallback } from "react";
import { PostHeader, PostTiming, audienceLabel } from "@/components/post-card";
import { Avatar, Card, Notice, ResponseLabel } from "@/components/ui";
import { ME_ID, api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useApi } from "@/lib/use-api";

export function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const load = useCallback(async () => {
    const [post, responses, people, groups] = await Promise.all([
      api.getPost(id),
      api.listResponses(id),
      api.listPeople(),
      api.listGroups(),
    ]);
    return { post, responses, people, groups };
  }, [id]);
  const detail = useApi(load);
  const me = useSession()?.user;

  if (detail.status === "loading") return <Notice>Loading post…</Notice>;
  if (detail.status === "error") {
    return <Notice>Couldn&apos;t load this post. Reload to try again.</Notice>;
  }

  const { post, responses, people, groups } = detail.data;
  if (!post) {
    return (
      <Notice>
        This post isn&apos;t available. It may have expired, been cancelled, or not been shared
        with you.{" "}
        <Link href="/feed" className="font-medium text-foreground underline underline-offset-4">
          Back to the feed
        </Link>
      </Notice>
    );
  }

  const isMine = post.posterId === ME_ID;

  return (
    <div className="flex flex-col gap-4">
      <Link href="/feed" className="text-sm text-muted hover:text-foreground">
        ← Feed
      </Link>

      <Card className="flex flex-col gap-3">
        <PostHeader
          post={post}
          poster={isMine ? me : people.find((p) => p.id === post.posterId)}
          isMine={isMine}
          audience={audienceLabel(post, groups)}
        />
        {post.note && <p>{post.note}</p>}
        <PostTiming post={post} />
      </Card>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">Replies</h2>
        {responses.length === 0 ? (
          <Notice>No replies yet.</Notice>
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-border">
              {responses.map((response) => {
                const person = people.find((p) => p.id === response.userId);
                return (
                  <li key={response.id} className="flex items-center gap-3 px-4 py-3">
                    <Avatar user={person} size="sm" />
                    <span className="min-w-0 flex-1 truncate">
                      {person?.displayName ?? "Someone"}
                    </span>
                    {response.eta && (
                      <span className="text-sm text-muted">{response.eta} away</span>
                    )}
                    <ResponseLabel status={response.status} />
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
        {isMine && (
          <p className="text-sm text-muted">
            Only you see how far away someone is, and only if they chose to share it.
          </p>
        )}
      </section>
    </div>
  );
}
