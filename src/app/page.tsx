"use client";

import React, { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import SearchInput from "@/components/SearchInput";
import StatusPanel from "@/components/StatusPanel";
import HudOverlay from "@/components/HudOverlay";
import NoiseTexture from "@/components/NoiseTexture";
import ParticleField from "@/components/ParticleField";
import { TrackingData } from "@/lib/tracking-types";
import { registry } from "@/lib/tracking-registry";

const GlobeViz = dynamic(() => import("@/components/GlobeViz"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-full bg-cyan-500/5 ring-1 ring-cyan-500/10" />
    </div>
  ),
});

type AppPhase = "idle" | "loading" | "tracking";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (trackingId: string) => {
    setIsLoading(true);
    setPhase("loading");

    try {
      const data = await registry.track(trackingId);
      setTrackingData(data);
      setPhase("tracking");
    } catch (err) {
      console.error("Tracking error:", err);
      setPhase("idle");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isCompact = phase === "loading" || phase === "tracking";

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-neutral-950">
      <NoiseTexture />
      <ParticleField />

      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/[0.02] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-500/[0.02] blur-[120px]" />
      </div>

      {/* Globe (always mounted for smooth transition, visibility controlled) */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-cyan-500/5 ring-1 ring-cyan-500/10" />
          </div>
        }
      >
        <GlobeViz
          trackingData={trackingData}
          isVisible={phase === "loading" || phase === "tracking"}
        />
      </Suspense>

      {/* HUD overlay elements */}
      <HudOverlay isActive={isCompact} />

      {/* Main UI Layer */}
      <div className="relative z-10 flex h-full flex-col">
        <LayoutGroup>
          {/* Search area — centered when idle, top-left when tracking */}
          <motion.div
            layout
            className={isCompact
              ? "flex items-start justify-start p-6"
              : "flex flex-1 items-center justify-center p-6"
            }
            transition={{
              layout: {
                type: "spring",
                stiffness: 200,
                damping: 28,
                mass: 1,
              },
            }}
          >
            <SearchInput
              onSearch={handleSearch}
              isLoading={isLoading}
              isCompact={isCompact}
            />
          </motion.div>

          {/* Status Panel — right side overlay */}
          <AnimatePresence>
            {phase === "tracking" && trackingData && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 24,
                  mass: 1,
                }}
                className="fixed right-0 top-0 z-20 h-full w-full max-w-sm p-6 pt-6"
              >
                <StatusPanel trackingData={trackingData} isVisible={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* Scan line effect on loading */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="pointer-events-none fixed left-0 z-40 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_4px_rgba(6,182,212,0.3)]"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
