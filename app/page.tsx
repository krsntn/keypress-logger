import KeypressLogger from "@/components/keypress-logger";

export default function Home() {
  return (
    <main className="flex min-h-screen w-[90vw] max-w-xl flex-col items-center justify-between p-16 m-auto">
      <KeypressLogger />
    </main>
  );
}
