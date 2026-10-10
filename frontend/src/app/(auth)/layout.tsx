import { Brand } from "@/components/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-8 px-4 py-10">
      <Brand />
      {children}
    </div>
  );
}
