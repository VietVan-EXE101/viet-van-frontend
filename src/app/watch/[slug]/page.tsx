import { WatchPage } from "@/scenes/watch-scene/WatchPage";
import type { PlaybackMode } from "@/lib/api/playback";

type WatchRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export default async function Page({ params, searchParams }: WatchRouteProps) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const playbackMode: PlaybackMode = mode === "full" ? "full" : "preview";

  return <WatchPage slug={slug} mode={playbackMode} />;
}
