import type { Metadata } from "next";
import { Friends } from "./friends";

export const metadata: Metadata = { title: "Friends" };

export default function FriendsPage() {
  return <Friends />;
}
