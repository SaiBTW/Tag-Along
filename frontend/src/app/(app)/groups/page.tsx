import type { Metadata } from "next";
import { Groups } from "./groups";

export const metadata: Metadata = { title: "Groups" };

export default function GroupsPage() {
  return <Groups />;
}
