import type { Metadata } from "next";
import { Feed } from "./feed";

export const metadata: Metadata = { title: "Feed" };

export default function FeedPage() {
  return <Feed />;
}
