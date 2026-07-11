import { getChiPheoPlayback } from "@/data/chi-pheo.playback";

export type PlaybackMode = "preview" | "full";

export interface PlaybackScene {
  id: string;
  order: number;
  character: string;
  emotion: string;
  dialogue: string;
  action?: string;
  audioUrl: string;
  videoUrl?: string;
  frameUrls?: string[];
}

export interface PlaybackData {
  workId: string;
  workTitle: string;
  sceneId: string;
  sceneTitle: string;
  background?: string;
  scenes: PlaybackScene[];
}

export async function getPlaybackBySlug(
  slug: string,
  mode: PlaybackMode,
): Promise<PlaybackData | null> {
  if (slug !== "chi-pheo") {
    return null;
  }

  const playback = getChiPheoPlayback();

  if (mode === "preview") {
    return {
      ...playback,
      scenes: playback.scenes.slice(0, 4),
    };
  }

  return playback;
}
