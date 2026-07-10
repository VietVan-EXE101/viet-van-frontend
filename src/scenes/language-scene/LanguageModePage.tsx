"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getLanguageSceneById,
  type LanguageHotspot,
  type LanguageScene,
} from "@/lib/api/language";

type LanguageModePageProps = {
  sceneId: string;
};

function HotspotCard({ hotspot }: { hotspot: LanguageHotspot }) {
  return (
    <div
      aria-live="polite"
      className="border border-white/15 bg-black/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    >
      {hotspot.category && (
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
          {hotspot.category}
        </p>
      )}
      <h2 className="text-2xl font-semibold text-white leading-tight">
        {hotspot.termVi}
      </h2>
      {hotspot.translationEn && (
        <p className="mt-1 text-sm text-white/55 font-light">
          {hotspot.translationEn}
        </p>
      )}
      {hotspot.description && (
        <p className="mt-4 text-sm text-white/70 font-light leading-relaxed">
          {hotspot.description}
        </p>
      )}
    </div>
  );
}

export function LanguageModePage({ sceneId }: LanguageModePageProps) {
  const [scene, setScene] = useState<LanguageScene | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScene = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLanguageSceneById(sceneId);
      setScene(data);
    } catch (err) {
      console.error("Language scene failed:", err);
      setScene(null);
      setError("Không thể tải dữ liệu Language Mode. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [sceneId]);

  useEffect(() => {
    void loadScene();
  }, [loadScene]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeHotspot = useMemo(() => {
    return scene?.hotspots.find((hotspot) => hotspot.id === activeId) ?? null;
  }, [activeId, scene]);

  function handleHotspotClick(hotspot: LanguageHotspot) {
    setActiveId((currentId) => (currentId === hotspot.id ? null : hotspot.id));
    setDiscoveredIds((current) => {
      const next = new Set(current);
      next.add(hotspot.id);
      return next;
    });
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col selection:bg-white/20 font-body antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-16 pt-32 pb-28">
        {loading && (
          <div className="py-32 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
              Loading language scene...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center border border-red-900/20 bg-red-950/5 p-8 max-w-xl mx-auto">
            <p className="text-sm text-red-400 font-light mb-6">{error}</p>
            <button
              type="button"
              onClick={loadScene}
              className="border border-white/20 px-5 py-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !scene && (
          <div className="py-24 text-center border border-dashed border-white/10 my-6">
            <p className="text-xs text-white/30 font-light tracking-wide font-mono">
              Không tìm thấy phân cảnh Language Mode.
            </p>
          </div>
        )}

        {!loading && !error && scene && (
          <>
            <section className="mb-10 md:mb-12">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/35 font-mono">
                Language Mode / Interactive Scene
              </p>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white mb-5">
                    {scene.title}
                  </h1>
                  <p className="text-sm md:text-base text-white/65 font-light leading-relaxed">
                    {scene.description}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45 font-mono">
                  Đã khám phá {discoveredIds.size}/{scene.hotspots.length} từ
                </p>
              </div>
            </section>

            <section className="mx-auto max-w-5xl">
              <div
                className="relative w-full overflow-visible border border-white/10 bg-[#050505]"
                style={{ aspectRatio: scene.imageAspectRatio }}
              >
                <Image
                  src={scene.imageUrl}
                  alt={scene.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                />

                <div className="absolute inset-0">
                  {scene.hotspots.map((hotspot) => {
                    const isActive = activeId === hotspot.id;
                    const placeRight = hotspot.xPercent < 62;
                    const placeBelow = hotspot.yPercent < 48;
                    const zIndex = isActive
                      ? 30
                      : hotspot.id === "bat-chao-hanh"
                        ? 20
                        : 10;

                    return (
                      <div
                        key={hotspot.id}
                        className="absolute"
                        style={{
                          left: `${hotspot.xPercent}%`,
                          top: `${hotspot.yPercent}%`,
                          width: `${hotspot.widthPercent}%`,
                          height: `${hotspot.heightPercent}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex,
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`Khám phá từ: ${hotspot.termVi}`}
                          onClick={() => handleHotspotClick(hotspot)}
                          className="block h-full min-h-11 w-full min-w-11 cursor-pointer border-0 bg-transparent p-0 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/80 focus-visible:outline-offset-1"
                        />

                        {isActive && (
                          <div
                            className={`absolute z-40 hidden w-72 md:block ${
                              placeRight ? "left-12" : "right-12"
                            } ${placeBelow ? "top-0" : "bottom-0"}`}
                          >
                            <HotspotCard hotspot={hotspot} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeHotspot && (
                <div className="mt-5 md:hidden">
                  <HotspotCard hotspot={activeHotspot} />
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
