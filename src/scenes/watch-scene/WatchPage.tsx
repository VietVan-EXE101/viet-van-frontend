"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import {
  getPlaybackBySlug,
  type PlaybackData,
  type PlaybackMode,
} from "@/lib/api/playback";

type WatchPageProps = {
  slug: string;
  mode: PlaybackMode;
};

const PREVIEW_LIMIT_SECONDS = 120;
const PREVIEW_MAX_SEGMENTS = 4;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function WatchPage({ slug, mode }: WatchPageProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playback, setPlayback] = useState<PlaybackData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingAudio, setMissingAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [complete, setComplete] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsVisibleRef = useRef(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (mode !== "full") {
      return;
    }

    const selectedPlan = localStorage.getItem("selectedPlan");
    if (selectedPlan !== "plus" && selectedPlan !== "pro") {
      router.replace(`/plans?story=${encodeURIComponent(slug)}`);
    }
  }, [mode, router, slug]);

  const loadPlayback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMissingAudio(null);
      setComplete(false);
      setPreviewEnded(false);
      setCurrentIndex(0);
      setPlayedSeconds(0);

      const data = await getPlaybackBySlug(slug, mode);
      setPlayback(data);
    } catch (err) {
      console.error("Watch playback failed:", err);
      setPlayback(null);
      setError("Khong the tai du lieu phat tac pham. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  }, [mode, slug]);

  useEffect(() => {
    const loadTask = Promise.resolve().then(() => loadPlayback());
    void loadTask;
  }, [loadPlayback]);

  const scenes = playback?.scenes ?? [];
  const currentScene = scenes[currentIndex] ?? null;
  const isPreview = mode === "preview";
  const canGoPrevious = mode === "full" && currentIndex > 0;
  const canGoNext = mode === "full" && currentIndex < scenes.length - 1;
  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const modeLabel = useMemo(() => {
    return isPreview ? "Preview" : "Full experience";
  }, [isPreview]);

  const setControlsVisibility = useCallback((visible: boolean) => {
    if (controlsVisibleRef.current === visible) {
      return;
    }

    controlsVisibleRef.current = visible;
    setControlsVisible(visible);
  }, []);

  const clearControlsTimeout = useCallback(() => {
    if (!controlsTimeoutRef.current) {
      return;
    }

    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = null;
  }, []);

  const showControls = useCallback(() => {
    setControlsVisibility(true);
    clearControlsTimeout();

    if (isPlaying && !complete) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisibility(false);
        controlsTimeoutRef.current = null;
      }, 2500);
    }
  }, [clearControlsTimeout, complete, isPlaying, setControlsVisibility]);

  const holdControlsVisible = useCallback(() => {
    setControlsVisibility(true);
    clearControlsTimeout();
  }, [clearControlsTimeout, setControlsVisibility]);

  useEffect(() => {
    const visibilityTask = setTimeout(() => {
      if (!isPlaying || complete) {
        setControlsVisibility(true);
        clearControlsTimeout();
        return;
      }

      showControls();
    }, 0);

    return () => {
      clearTimeout(visibilityTask);
      clearControlsTimeout();
    };
  }, [
    clearControlsTimeout,
    complete,
    isPlaying,
    setControlsVisibility,
    showControls,
  ]);

  function resetAudioState(shouldPlay = false) {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    setCurrentTime(0);
    setDuration(0);
    setMissingAudio(null);
    setIsPlaying(shouldPlay);
  }

  function goToIndex(nextIndex: number, shouldPlay = false) {
    setCurrentIndex(nextIndex);
    setComplete(false);
    resetAudioState(shouldPlay);
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !currentScene || missingAudio) {
      return;
    }

    if (audio.paused) {
      await audio.play();
      void videoRef.current?.play().catch(() => undefined);
      setIsPlaying(true);
      return;
    }

    audio.pause();
    videoRef.current?.pause();
    setIsPlaying(false);
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    setDuration(audio?.duration ?? 0);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    setCurrentTime(audio?.currentTime ?? 0);
  }

  function handleEnded() {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    const segmentDuration = duration || audioRef.current?.duration || 0;
    const totalPlayed = playedSeconds + segmentDuration;
    setPlayedSeconds(totalPlayed);
    setIsPlaying(false);

    if (isPreview) {
      const reachedTimeLimit = totalPlayed >= PREVIEW_LIMIT_SECONDS;
      const reachedSegmentLimit = currentIndex + 1 >= PREVIEW_MAX_SEGMENTS;
      const reachedEnd = currentIndex >= scenes.length - 1;

      if (reachedTimeLimit || reachedSegmentLimit || reachedEnd) {
        setPreviewEnded(true);
        setComplete(true);
        return;
      }

      goToIndex(currentIndex + 1, true);
      return;
    }

    if (currentIndex < scenes.length - 1) {
      goToIndex(currentIndex + 1, true);
      return;
    }

    setComplete(true);
  }

  function handleAudioError() {
    setIsPlaying(false);
    videoRef.current?.pause();
    setMissingAudio(currentScene?.audioUrl ?? "unknown audio file");
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying || !currentScene || missingAudio) {
      return;
    }

    void audio.play().catch(() => setIsPlaying(false));
    void videoRef.current?.play().catch(() => undefined);
  }, [currentIndex, currentScene, isPlaying, missingAudio]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-body antialiased">
      <Navbar />

      <main className="relative px-3 pt-24 pb-10 sm:px-5 md:px-8 md:pt-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <Link
            href={`/library/${encodeURIComponent(slug)}`}
            className="mb-4 inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70"
          >
            <span aria-hidden="true">←</span>
            Back to Detail
          </Link>

          {loading && (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
              <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest text-white/40">
                Loading playback...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-xl border border-red-900/30 bg-red-950/10 p-8 text-center">
              <p className="mb-6 text-sm font-light text-red-300">{error}</p>
              <button
                type="button"
                onClick={loadPlayback}
                className="min-h-11 border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (!playback || scenes.length === 0) && (
            <div className="my-6 border border-dashed border-white/10 py-24 text-center">
              <p className="font-mono text-xs font-light tracking-wide text-white/30">
                No playable dialogue found.
              </p>
            </div>
          )}

          {!loading && !error && playback && currentScene && (
            <section className="w-full">
              <div
                className="relative aspect-video max-h-[calc(100vh-15rem)] min-h-[220px] w-full overflow-hidden bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:min-h-[340px] lg:min-h-[min(64vh,760px)]"
                onPointerMove={showControls}
                onPointerDown={showControls}
                onMouseEnter={showControls}
                onFocusCapture={holdControlsVisible}
                onBlurCapture={() => {
                  if (isPlaying && !complete) {
                    showControls();
                  }
                }}
                tabIndex={0}
              >
                <audio
                  ref={audioRef}
                  src={currentScene.audioUrl}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onError={handleAudioError}
                />

                {currentScene.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={currentScene.videoUrl}
                    muted
                    playsInline
                    loop
                    className="absolute inset-0 h-full w-full bg-black object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/[0.08] to-transparent px-6 text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
                      Hình ảnh phân cảnh đang được hoàn thiện
                    </p>
                  </div>
                )}

                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/75 via-black/30 to-transparent px-3 pb-10 pt-3 transition-[opacity,transform] duration-300 ease-out sm:px-5 sm:pt-5 ${
                    controlsVisible
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/60 sm:text-[10px]">
                        {modeLabel}
                      </p>
                      <h1 className="mt-1 truncate font-heading text-base font-semibold uppercase tracking-[0.12em] text-white sm:text-xl md:text-2xl">
                        {playback.workTitle} · {playback.sceneTitle}
                      </h1>
                    </div>
                    <p className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-white/70 sm:text-xs">
                      {String(currentIndex + 1).padStart(2, "0")} /{" "}
                      {String(scenes.length).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                {missingAudio && (
                  <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] border border-red-400/25 bg-red-950/55 px-3 py-2 text-xs text-red-100 backdrop-blur-sm sm:left-5 sm:top-5 sm:max-w-md">
                    Missing audio file: {missingAudio}
                  </div>
                )}

                {complete && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2px]">
                    <div className="max-w-md border border-white/15 bg-black/65 px-5 py-4 text-center shadow-2xl sm:px-7 sm:py-6">
                      <p className="text-sm font-light text-white/85 sm:text-base">
                        Hoàn thành phân cảnh
                      </p>
                      {previewEnded && (
                        <Link
                          href={`/plans?story=${encodeURIComponent(slug)}`}
                          className="mt-4 inline-flex min-h-11 items-center justify-center border border-white bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                        >
                          Chọn gói để xem đầy đủ
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                <div
                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-16 transition-[opacity,transform] duration-300 ease-out sm:px-5 sm:pb-5 sm:pt-20 ${
                    controlsVisible
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-2 opacity-0"
                  }`}
                >
                  <div className="mb-2 h-[3px] bg-white/20">
                    <div
                      className="h-full bg-[#f3dfad] transition-[width]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="w-12 font-mono text-[11px] text-white/65 sm:w-16 sm:text-xs">
                      {formatTime(currentTime)}
                    </span>
                    <span className="w-12 text-right font-mono text-[11px] text-white/65 sm:w-16 sm:text-xs">
                      {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
                    {mode === "full" && (
                      <button
                        type="button"
                        onClick={() => {
                          showControls();
                          goToIndex(currentIndex - 1);
                        }}
                        onFocus={holdControlsVisible}
                        onBlur={() => {
                          if (isPlaying && !complete) {
                            showControls();
                          }
                        }}
                        disabled={!canGoPrevious}
                        aria-label="Previous scene"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-white/70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 5v14M18 6.5 9.5 12 18 17.5V6.5Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        showControls();
                        void togglePlayback();
                      }}
                      onFocus={holdControlsVisible}
                      onBlur={() => {
                        if (isPlaying && !complete) {
                          showControls();
                        }
                      }}
                      disabled={!currentScene || Boolean(missingAudio)}
                      aria-label={isPlaying ? "Pause playback" : "Play playback"}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20 hover:text-white disabled:opacity-35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                    >
                      {isPlaying ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M9 6v12M15 6v12"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M9 6.75v10.5L17 12 9 6.75Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </button>

                    {mode === "full" && (
                      <button
                        type="button"
                        onClick={() => {
                          showControls();
                          goToIndex(currentIndex + 1);
                        }}
                        onFocus={holdControlsVisible}
                        onBlur={() => {
                          if (isPlaying && !complete) {
                            showControls();
                          }
                        }}
                        disabled={!canGoNext}
                        aria-label="Next scene"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-white/70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M18 5v14M6 6.5 14.5 12 6 17.5V6.5Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-y border-white/[0.06] bg-[#050505] px-4 py-5 text-center sm:px-6 md:min-h-[150px] md:py-7">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f3dfad]/75 sm:text-xs">
                  {currentScene.character}
                </p>
                <p className="mx-auto max-w-[1100px] whitespace-pre-line text-base font-light leading-[1.6] text-[#f5f0e6] sm:text-lg md:text-xl lg:text-2xl">
                  {currentScene.dialogue}
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
