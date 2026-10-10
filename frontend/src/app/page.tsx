import Link from "next/link";
import { Brand, buttonClass } from "@/components/ui";

const steps = [
  {
    title: "Post where you're heading",
    body: "Pick the place, say when you'll get there, and choose who sees it: all your friends, a few of them, or one group.",
  },
  {
    title: "They reply in one tap",
    body: "Going, maybe, or can't. You see who's on the way and who has arrived.",
  },
  {
    title: "It expires on its own",
    body: "Every post has an end time. After that it's gone, so nothing builds up into a history of where you've been.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4">
      <header className="flex h-14 items-center justify-between">
        <Brand />
        <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
          Log in
        </Link>
      </header>

      <main className="flex flex-1 flex-col gap-12 py-12 sm:py-20">
        <section className="flex flex-col gap-5">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Heading somewhere? Let your people tag along.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Tell the friends you choose where you&apos;re going and when. They say whether
            they&apos;re coming. No feed to scroll and no profile to keep up.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className={buttonClass()}>
              Create an account
            </Link>
            <Link href="/login" className={buttonClass("secondary")}>
              Log in
            </Link>
          </div>
        </section>

        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
