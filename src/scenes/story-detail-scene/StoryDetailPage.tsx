"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getLocalStoryBySlug } from "@/data/stories.local";
import type { Story } from "@/lib/api/stories";

type StoryDetailPageProps = {
  slug: string;
};

function formatGenre(genre: Story["genre"]) {
  switch (genre) {
    case "truyen-co-tich":
      return "Co tich";
    case "truyen-truyen-thuyet":
      return "Truyen thuyet";
    case "truyen-ngu-ngon":
      return "Ngu ngon";
    case "truyen-cuoi":
      return "Truyen cuoi";
    default:
      return null;
  }
}

export function StoryDetailPage({ slug }: StoryDetailPageProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStory = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      setStory(getLocalStoryBySlug(slug) ?? null);
    } catch (err) {
      console.error("Story detail local catalog failed:", err);
      setStory(null);
      setError(
        "Khong the tai du lieu tac pham local. Vui long thu lai.",
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  const genreLabel = formatGenre(story?.genre);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col selection:bg-white/20 font-body antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-16 pt-32 pb-28">
        <Link
          href="/library"
          className="inline-flex items-center gap-3 text-xs text-white/45 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 tracking-[0.2em] uppercase font-mono transition-colors mb-12"
        >
          <span aria-hidden="true">←</span>
          Back to Library
        </Link>

        {loading && (
          <div className="py-32 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
              Loading story...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center border border-red-900/20 bg-red-950/5 p-8 max-w-xl mx-auto rounded-none">
            <p className="text-sm text-red-400 font-light mb-6">{error}</p>
            <button
              type="button"
              onClick={loadStory}
              className="border border-white/20 px-5 py-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !story && (
          <div className="py-24 text-center border border-dashed border-white/10 my-6 rounded-none">
            <p className="text-xs text-white/30 font-light tracking-wide font-mono">
              Story not found.
            </p>
          </div>
        )}

        {!loading && !error && story && (
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-start">
            {story.coverUrl && (
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#050505]">
                <Image
                  src={story.coverUrl}
                  alt={story.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover opacity-85"
                />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-6 text-[10px] uppercase tracking-[0.22em] font-mono text-white/40">
                {genreLabel && <span>{genreLabel}</span>}
                {genreLabel && story.readingTimeMinutes && (
                  <span className="text-white/15">/</span>
                )}
                {story.readingTimeMinutes && (
                  <span>{story.readingTimeMinutes} min read</span>
                )}
              </div>

              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-white mb-6">
                {story.title}
              </h1>

              {story.author && (
                <p className="text-sm text-white/45 font-light italic mb-8">
                  By {story.author}
                </p>
              )}

              {story.shortDescription && (
                <p className="max-w-2xl text-base md:text-lg text-white/65 font-light leading-relaxed mb-10">
                  {story.shortDescription}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href={`/watch/${encodeURIComponent(story.slug)}?mode=preview`}
                  className="border border-white bg-white text-black px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium hover:bg-white/90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
                >
                  Xem thử 1–2 phút
                </Link>

                <Link
                  href={`/plans?story=${encodeURIComponent(story.slug)}`}
                  className="border border-white/20 px-6 py-3 text-xs tracking-[0.18em] uppercase text-white/80 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
                >
                  Chọn gói để xem đầy đủ
                </Link>
              </div>

              <p className="max-w-2xl border-t border-white/10 pt-5 text-xs md:text-sm text-white/45 font-light leading-relaxed">
                Gói Free được xem preview. Plus và Pro mở khóa toàn bộ tác
                phẩm.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
