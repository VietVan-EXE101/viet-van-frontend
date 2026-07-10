"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getLocalStories } from "@/data/stories.local";
import type { Story } from "@/lib/api/stories";

const FILTER_TABS = [
  { id: "all", label: "All works" },
] as const;

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

export function LibraryPage() {
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const loadStories = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      setItems(getLocalStories());
    } catch (err) {
      console.error("Library local catalog failed:", err);
      setItems([]);
      setError(
        "Khong the tai du lieu thu vien local. Vui long thu lai.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.author?.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "all" || item.genre === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col selection:bg-white/20 font-body antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-16 pt-36 pb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-[11px] tracking-[0.25em] text-white/40 uppercase block mb-3 font-mono font-light">
              Collection / Archive
            </span>
            <h1 className="font-body text-4xl md:text-[56px] font-bold tracking-tight text-white mb-6 leading-[1.15] max-w-3xl">
              Library
            </h1>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search literature, plays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/15 text-white pl-4 pr-10 py-2 text-xs rounded-none outline-none focus:border-white/50 transition-colors placeholder:text-white/25 font-light"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-x-8 gap-y-4 flex-wrap mb-14 text-xs tracking-wide text-white/50 border-b border-white/5 pb-4">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`pb-4 -mb-[17px] transition-all relative rounded-none cursor-pointer hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 ${
                activeCategory === tab.id
                  ? "text-white font-medium"
                  : "font-light"
              }`}
            >
              {tab.label}
              {activeCategory === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-32 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
              Connecting to database...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center border border-red-900/20 bg-red-950/5 p-8 max-w-xl mx-auto rounded-none">
            <p className="text-sm text-red-400 font-light mb-6">{error}</p>
            <button
              type="button"
              onClick={loadStories}
              className="border border-white/20 px-5 py-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          (filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {filteredItems.map((item, idx) => {
                const genreLabel = formatGenre(item.genre);

                return (
                  <Link
                    key={item.id}
                    href={`/library/${item.slug}`}
                    className="group flex flex-col border border-white/5 bg-[#050505] hover:border-white/20 focus-visible:border-white/60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-all duration-300 p-5 rounded-none relative"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black mb-6 border border-white/5">
                      {item.coverUrl && (
                        <Image
                          src={item.coverUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      )}

                      {!item.coverUrl && (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-zinc-950 opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out" />
                      )}

                      <div className="absolute top-4 left-4 text-[10px] tracking-widest text-white/20 font-mono">
                        NO.{String(idx + 1).padStart(2, "0")}
                      </div>

                      {genreLabel && (
                        <div className="absolute bottom-4 left-4 bg-black/70 border border-white/10 px-2 py-0.5 text-[10px] text-white/60 tracking-wider uppercase font-light rounded-none">
                          {genreLabel}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-white/90 group-hover:text-white transition-colors font-heading tracking-tight leading-tight">
                          {item.title}
                        </h3>
                        {item.readingTimeMinutes && (
                          <span className="text-[10px] font-mono text-white/30 tracking-wider uppercase shrink-0">
                            {item.readingTimeMinutes} min
                          </span>
                        )}
                      </div>

                      {item.author && (
                        <p className="text-xs text-white/40 mb-4 font-light italic">
                          By {item.author}
                        </p>
                      )}

                      {item.shortDescription && (
                        <p className="text-xs md:text-[13px] text-white/60 font-light leading-relaxed mb-8 line-clamp-3">
                          {item.shortDescription}
                        </p>
                      )}

                      <div className="mt-auto pt-4 flex items-center justify-between text-xs font-light tracking-wider text-white/30 group-hover:text-white transition-colors border-t border-white/5">
                        <span className="text-[11px] uppercase tracking-widest font-mono">
                          Explore Stage
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="transform group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-white/10 my-6 rounded-none">
              <p className="text-xs text-white/30 font-light tracking-wide font-mono">
                No matching literary works found.
              </p>
            </div>
          ))}
      </main>

      <Footer />
    </div>
  );
}
