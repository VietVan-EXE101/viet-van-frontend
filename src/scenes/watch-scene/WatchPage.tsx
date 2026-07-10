"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    void loadPlayback();
  }, [loadPlayback]);

  const scenes = playback?.scenes ?? [];
  const currentScene = scenes[currentIndex] ?? null;
  const isPreview = mode === "preview";
  const canGoPrevious = mode === "full" && currentIndex > 0;
  const canGoNext = mode === "full" && currentIndex < scenes.length - 1;
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const modeLabel = useMemo(() => {
    return isPreview ? "Preview" : "Full experience";
  }, [isPreview]);

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
    <div className="bg-black min-h-screen text-white flex flex-col selection:bg-white/20 font-body antialiased">
      <Navbar />

      <main className="relative flex-1 overflow-hidden px-6 md:px-16 pt-32 pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-72 max-w-3xl bg-white/[0.06] blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <Link
            href={`/library/${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-3 text-xs text-white/45 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 tracking-[0.2em] uppercase font-mono transition-colors mb-10"
          >
            <span aria-hidden="true">←</span>
            Back to Detail
          </Link>

          {loading && (
            <div className="py-32 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
                Loading playback...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="py-20 text-center border border-red-900/20 bg-red-950/5 p-8 max-w-xl mx-auto">
              <p className="text-sm text-red-400 font-light mb-6">{error}</p>
              <button
                type="button"
                onClick={loadPlayback}
                className="border border-white/20 px-5 py-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (!playback || scenes.length === 0) && (
            <div className="py-24 text-center border border-dashed border-white/10 my-6">
              <p className="text-xs text-white/30 font-light tracking-wide font-mono">
                No playable dialogue found.
              </p>
            </div>
          )}

          {!loading && !error && playback && currentScene && (
            <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)] gap-6 lg:gap-8 items-start">
              <div className="min-w-0 flex flex-col gap-3">
                <div className="relative border border-white/10 bg-[#050505] px-6 py-4 md:px-7 md:py-5">
                  <span className="absolute right-6 top-5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono md:right-7">
                    {currentIndex + 1}/{scenes.length}
                  </span>

                  <p className="mb-3 pr-16 text-[10px] uppercase tracking-[0.34em] text-white/45 font-mono">
                    {modeLabel}
                  </p>

                  <h1 className="pr-16 font-heading text-3xl md:text-4xl font-semibold tracking-tight leading-none text-white">
                    {playback.workTitle}
                  </h1>

                  <div className="mt-3 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                    <p className="text-sm md:text-base uppercase tracking-[0.1em] text-white/70">
                      {playback.sceneTitle}
                    </p>
                    {playback.background && (
                      <>
                        <span className="hidden text-white/20 md:inline">—</span>
                        <p className="text-xs font-light leading-relaxed text-white/40 line-clamp-2 md:block md:truncate md:text-sm">
                          {playback.background}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
                  {currentScene.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={currentScene.videoUrl}
                      muted
                      playsInline
                      loop
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-white/[0.08] to-transparent px-6 text-center">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/35 font-mono">
                        Hình ảnh phân cảnh đang được hoàn thiện
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-[320px] max-h-[calc(100vh-10rem)] overflow-y-auto border border-white/10 bg-white/[0.03] p-6">
                <audio
                  ref={audioRef}
                  src={currentScene.audioUrl}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onError={handleAudioError}
                />

                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35 font-mono mb-3">
                    Now speaking
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
                    {currentScene.character}
                  </h2>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                    {currentScene.emotion}
                  </p>
                  {currentScene.action && (
                    <p className="mt-4 text-sm text-white/50 italic">
                      {currentScene.action}
                    </p>
                  )}
                </div>

                <p className="min-h-28 whitespace-pre-line text-lg lg:text-xl leading-relaxed text-white/85 font-light">
                  {currentScene.dialogue}
                </p>

                {missingAudio && (
                  <div className="mt-6 border border-red-900/30 bg-red-950/10 px-4 py-3 text-sm text-red-300">
                    Missing audio file: {missingAudio}
                  </div>
                )}

                {complete && (
                  <div className="mt-6 border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
                    Hoàn thành phân cảnh
                    {previewEnded && (
                      <div className="mt-4">
                        <Link
                          href={`/plans?story=${encodeURIComponent(slug)}`}
                          className="inline-flex border border-white bg-white text-black px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-white/90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
                        >
                          Chọn gói để xem đầy đủ
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8">
                  <div className="h-1 bg-white/10 mb-3">
                    <div
                      className="h-full bg-white transition-[width]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/45 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  {mode === "full" && (
                    <button
                      type="button"
                      onClick={() => goToIndex(currentIndex - 1)}
                      disabled={!canGoPrevious}
                      className="border border-white/20 px-5 py-3 text-xs tracking-[0.18em] uppercase text-white/80 hover:border-white disabled:opacity-30 disabled:hover:border-white/20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={togglePlayback}
                    disabled={!currentScene || Boolean(missingAudio)}
                    className="border border-white bg-white text-black px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium hover:bg-white/90 disabled:opacity-40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>

                  {mode === "full" && (
                    <button
                      type="button"
                      onClick={() => goToIndex(currentIndex + 1)}
                      disabled={!canGoNext}
                      className="border border-white/20 px-5 py-3 text-xs tracking-[0.18em] uppercase text-white/80 hover:border-white disabled:opacity-30 disabled:hover:border-white/20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
