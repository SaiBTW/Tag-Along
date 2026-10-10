"use client";

import { Avatar, Card, Notice, PageTitle } from "@/components/ui";
import { api, type PublicUser } from "@/lib/api";
import { useApi } from "@/lib/use-api";

async function loadFriends() {
  const [friends, requests, people] = await Promise.all([
    api.listFriends(),
    api.listFriendRequests(),
    api.listPeople(),
  ]);
  return { friends, requests, people };
}

function PersonList({ people }: { people: (PublicUser | undefined)[] }) {
  return (
    <Card className="p-0">
      <ul className="divide-y divide-border">
        {people.map((person, i) => (
          <li key={person?.id ?? i} className="flex items-center gap-3 px-4 py-3">
            <Avatar user={person} />
            <div className="min-w-0">
              <p className="truncate font-medium">{person?.displayName ?? "Someone"}</p>
              {person && <p className="truncate text-sm text-muted">@{person.username}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function Friends() {
  const state = useApi(loadFriends);

  return (
    <>
      <PageTitle>Friends</PageTitle>
      {state.status === "loading" && <Notice>Loading friends…</Notice>}
      {state.status === "error" && <Notice>Couldn&apos;t load friends. Reload to try again.</Notice>}
      {state.status === "ready" && (
        <div className="mt-5 flex flex-col gap-6">
          {state.data.requests.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-muted">Requests</h2>
              <PersonList
                people={state.data.requests.map((request) =>
                  state.data.people.find((p) => p.id === request.requesterId),
                )}
              />
            </section>
          )}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-muted">Your friends</h2>
            {state.data.friends.length === 0 ? (
              <Notice>No friends added yet.</Notice>
            ) : (
              <PersonList people={state.data.friends} />
            )}
          </section>
        </div>
      )}
    </>
  );
}
