"use client";

import { Card, Notice, PageTitle } from "@/components/ui";
import { ME_ID, api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

async function loadGroups() {
  const [groups, people] = await Promise.all([api.listGroups(), api.listPeople()]);
  return { groups, people };
}

export function Groups() {
  const state = useApi(loadGroups);

  return (
    <>
      <PageTitle>Groups</PageTitle>
      {state.status === "loading" && <Notice>Loading groups…</Notice>}
      {state.status === "error" && <Notice>Couldn&apos;t load groups. Reload to try again.</Notice>}
      {state.status === "ready" &&
        (state.data.groups.length === 0 ? (
          <Notice>You&apos;re not in any groups yet.</Notice>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {state.data.groups.map((group) => {
              const names = group.members.map((member) =>
                member.userId === ME_ID
                  ? "You"
                  : (state.data.people.find((p) => p.id === member.userId)?.displayName ??
                    "Someone"),
              );
              const isAdmin = group.members.some(
                (member) => member.userId === ME_ID && member.role === "ADMIN",
              );
              return (
                <li key={group.id}>
                  <Card className="flex flex-col gap-1">
                    <p className="font-semibold">
                      {group.name}
                      {isAdmin && (
                        <span className="ml-2 text-sm font-normal text-muted">Admin</span>
                      )}
                    </p>
                    <p className="text-sm text-muted">
                      {group.members.length} members · {names.join(", ")}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        ))}
    </>
  );
}
