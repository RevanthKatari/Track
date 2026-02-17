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
      <div className="relative">
        <div className="h-40 w-40 animate-pulse rounded-full bg-cyan-500/5 ring-1 ring-cyan-500/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-cyan-500/30" />
        </div>
      </div>
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
      {/* Noise texture overlay */}
      <NoiseTexture />

      {/* Floating particle field */}
      <ParticleField />

      {/* Subtle background glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-[150px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/[0.03] blur-[130px]"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-pink-500/[0.02] blur-[100px]"
          animate={{
            x: [0, 15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid overlay for idle state */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none fixed inset-0 z-[1] grid-overlay"
          />
        )}
      </AnimatePresence>

      {/* 3D Globe */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="h-40 w-40 animate-pulse rounded-full bg-cyan-500/5 ring-1 ring-cyan-500/10" />
            </div>
          </div>
        }
      >
        <GlobeViz
          trackingData={trackingData}
          isVisible={phase === "loading" || phase === "tracking"}
        />
      </Suspense>

      {/* HUD overlay */}
      <HudOverlay isActive={isCompact} />

      {/* Main UI Layer */}
      <div className="relative z-10 flex h-full flex-col">
        <LayoutGroup>
          {/* Search region */}
          <motion.div
            layout
            className={
              isCompact
                ? "flex items-start justify-start p-6 pt-5"
                : "flex flex-1 items-center justify-center px-6"
            }
            transition={{
              layout: {
                type: "spring",
                stiffness: 180,
                damping: 26,
                mass: 0.9,
              },
            }}
          >
            <SearchInput
              onSearch={handleSearch}
              isLoading={isLoading}
              isCompact={isCompact}
            />
          </motion.div>

          {/* Status Panel (right side) */}
          <AnimatePresence>
            {phase === "tracking" && trackingData && (
              <motion.div
                initial={{ opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 120 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  mass: 0.8,
                }}
                className="fixed right-0 top-0 z-20 h-full w-full max-w-[380px] p-5 pt-5"
              >
                <StatusPanel trackingData={trackingData} isVisible={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* Scan line animation during loading */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 0.8, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="pointer-events-none fixed left-0 z-40 h-[1px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(139,92,246,0.4), transparent)",
              boxShadow:
                "0 0 30px 6px rgba(6,182,212,0.15), 0 0 60px 10px rgba(6,182,212,0.05)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </main>
  );
}
