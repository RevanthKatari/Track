"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Signal, Cpu, Zap, Radio } from "lucide-react";

interface HudOverlayProps {
  isActive: boolean;
}

export default function HudOverlay({ isActive }: HudOverlayProps) {
  const [time, setTime] = useState("");
  const [uplink, setUplink] = useState(98);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setUplink(95 + Math.floor(Math.random() * 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* === Mobile: minimal top-right HUD (icons + time only) === */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="fixed right-3 top-4 z-30 flex items-center gap-2.5 font-mono text-[9px] tracking-wider text-neutral-600 md:hidden"
          >
            <span className="flex items-center gap-1">
              <Wifi className="h-2.5 w-2.5 text-emerald-500/40" />
            </span>
            <span className="flex items-center gap-1">
              <Signal className="h-2.5 w-2.5 text-violet-500/40" />
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-2.5 w-2.5 text-neutral-600" />
              <span className="tabular-nums">{time}</span>
            </span>
          </motion.div>

          {/* === Desktop: full top-right HUD cluster (unchanged) === */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="fixed right-6 top-5 z-30 hidden items-center gap-5 font-mono text-[10px] tracking-wider text-neutral-600 md:flex"
          >
            <span className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-cyan-500/40" />
              <span className="text-cyan-600/60">UPLINK {uplink}%</span>
            </span>
            <span className="h-3 w-px bg-neutral-800" />
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3 text-emerald-500/40" />
              <span className="text-emerald-600/60">CONNECTED</span>
            </span>
            <span className="h-3 w-px bg-neutral-800" />
            <span className="flex items-center gap-1.5">
              <Signal className="h-3 w-3 text-violet-500/40" />
              <span className="text-violet-600/60">SAT-7</span>
            </span>
            <span className="h-3 w-px bg-neutral-800" />
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-neutral-600" />
              <span className="tabular-nums">{time}</span>
            </span>
          </motion.div>

          {/* Bottom-left system info — hidden on small mobile, shown sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="fixed bottom-6 left-4 z-30 hidden font-mono text-[9px] tracking-widest text-neutral-700/70 sm:block md:left-6"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-cyan-500/20" />
              <span>SYS.ORBITAL_TRACK v2.4.1</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/30" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
              </span>
              <span>ALL SYSTEMS NOMINAL</span>
            </div>
          </motion.div>

          {/* Corner bracket decorations — desktop only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="pointer-events-none fixed inset-0 z-20 hidden md:block"
          >
            <div className="absolute left-3 top-3 h-6 w-6 border-l border-t border-cyan-500/[0.08]" />
            <div className="absolute right-3 top-3 h-6 w-6 border-r border-t border-cyan-500/[0.08]" />
            <div className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-cyan-500/[0.08]" />
            <div className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-cyan-500/[0.08]" />

            {/* Cross-hairs at center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-px w-6 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
              <div className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
            </div>
          </motion.div>

          {/* Bottom center coordinate display — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-neutral-800 md:block"
          >
            ORBITAL COMMAND // GLOBAL TRACKING NETWORK
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
