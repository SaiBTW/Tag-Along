"use client";

import { PostCard, audienceLabel } from "@/components/post-card";
import { Notice, PageTitle } from "@/components/ui";
import { ME_ID, api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useApi } from "@/lib/use-api";

async function loadFeed() {
  const [posts, people, groups] = await Promise.all([
    api.listPosts(),
    api.listPeople(),
    api.listGroups(),
  ]);
  const responses = await Promise.all(posts.map((post) => api.listResponses(post.id)));
  return { posts, people, groups, responses };
}

export function Feed() {
  const feed = useApi(loadFeed);
  const me = useSession()?.user;

  return (
    <>
      <PageTitle>Happening now</PageTitle>
      {feed.status === "loading" && <Notice>Loading posts…</Notice>}
      {feed.status === "error" && <Notice>Couldn&apos;t load posts. Reload to try again.</Notice>}
      {feed.status === "ready" &&
        (feed.data.posts.length === 0 ? (
          <Notice>Nobody&apos;s heading anywhere right now.</Notice>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {feed.data.posts.map((post, i) => {
              const isMine = post.posterId === ME_ID;
              return (
                <li key={post.id}>
                  <PostCard
                    post={post}
                    poster={isMine ? me : feed.data.people.find((p) => p.id === post.posterId)}
                    isMine={isMine}
                    audience={audienceLabel(post, feed.data.groups)}
                    responses={feed.data.responses[i]}
                  />
                </li>
              );
            })}
          </ul>
        ))}
    </>
  );
}
