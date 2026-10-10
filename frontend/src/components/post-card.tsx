"use client";

import Link from "next/link";
import type { Group, Post, PostResponse, PublicUser } from "@/lib/api";
import { formatClock, formatRelative, useNow } from "@/lib/time";
import { Avatar, Card } from "./ui";

export function audienceLabel(post: Post, groups: Group[]): string {
  if (post.visibilityScope === "ALL_FRIENDS") return "All friends";
  if (post.visibilityScope === "SPECIFIC_FRIENDS") return "Specific friends";
  return groups.find((g) => g.id === post.groupId)?.name ?? "Group";
}

export function PostTiming({ post }: { post: Post }) {
  const now = useNow();
  const rel = (iso: string) => (now === null ? "" : ` · ${formatRelative(iso, now)}`);

  return (
    <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
      <div className="flex gap-1.5">
        <dt className="text-muted">{post.etaMode === "LIVE" ? "Live location" : "ETA"}</dt>
        <dd className="font-medium">
          {post.etaMode === "LIVE"
            ? post.posterLastLocationAt && now !== null
              ? `updated ${formatRelative(post.posterLastLocationAt, now)}`
              : "on"
            : post.declaredEta
              ? `${formatClock(post.declaredEta)}${rel(post.declaredEta)}`
              : "not set"}
        </dd>
      </div>
      <div className="flex gap-1.5">
        <dt className="text-muted">Expires</dt>
        <dd className="font-medium">
          {formatClock(post.expiresAt)}
          {rel(post.expiresAt)}
        </dd>
      </div>
    </dl>
  );
}

export function PostHeader({
  post,
  poster,
  isMine,
  audience,
}: {
  post: Post;
  poster?: PublicUser;
  isMine: boolean;
  audience: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Avatar user={poster} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">
          {isMine ? "You" : (poster?.displayName ?? "Someone")} · {audience}
        </p>
        <p className="text-lg font-semibold leading-snug">{post.placeName}</p>
      </div>
    </div>
  );
}

function responseSummary(responses: PostResponse[]): string {
  const count = (status: PostResponse["status"]) =>
    responses.filter((r) => r.status === status).length;
  const parts = [
    [count("GOING"), "going"],
    [count("ARRIVED"), "arrived"],
    [count("MAYBE"), "maybe"],
  ] as const;
  const text = parts
    .filter(([n]) => n > 0)
    .map(([n, label]) => `${n} ${label}`)
    .join(" · ");
  return text || "No replies yet";
}

export function PostCard({
  post,
  poster,
  isMine,
  audience,
  responses,
}: {
  post: Post;
  poster?: PublicUser;
  isMine: boolean;
  audience: string;
  responses: PostResponse[];
}) {
  return (
    <Link href={`/posts/${post.id}`} className="block rounded-2xl">
      <Card className="flex flex-col gap-3 transition hover:border-foreground/30">
        <PostHeader post={post} poster={poster} isMine={isMine} audience={audience} />
        {post.note && <p>{post.note}</p>}
        <PostTiming post={post} />
        <p className="border-t border-border pt-3 text-sm text-muted">
          {responseSummary(responses)}
        </p>
      </Card>
    </Link>
  );
}
