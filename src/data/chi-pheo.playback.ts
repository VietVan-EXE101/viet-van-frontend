import chiPheoData from "./chi_pheo.json";
import type { PlaybackData, PlaybackScene } from "@/lib/api/playback";

type ChiPheoEvent = {
  event_id?: string;
  event_type?: string;
  character?: string;
  emotion?: string;
  action?: string;
  dialogue?: string;
  audio_file?: string;
};

function toAudioUrl(audioFile: string): string {
  return `/${["audio", audioFile].join("/")}`;
}

export function getChiPheoPlayback(): PlaybackData {
  const scene = chiPheoData.scenes[0];
  const events = scene.events as ChiPheoEvent[];

  const playbackScenes: PlaybackScene[] = events.flatMap((event, index) => {
    if (event.event_type !== "CharacterDialogue" || !event.audio_file) {
      return [];
    }

    return [
      {
        id: event.event_id ?? `event-${index + 1}`,
        order: index + 1,
        character: event.character ?? "",
        emotion: event.emotion ?? "",
        dialogue: event.dialogue ?? "",
        action: event.action,
        audioUrl: toAudioUrl(event.audio_file),
        videoUrl:
          event.event_id === "scene01_intro_narration"
            ? "/videos/chi-pheo/scene01/scene01_opening.mp4"
            : undefined,
      },
    ];
  });

  return {
    workId: "chi-pheo",
    workTitle: chiPheoData.work.title,
    sceneId: scene.id,
    sceneTitle: scene.title,
    background: scene.background,
    scenes: playbackScenes,
  };
}
