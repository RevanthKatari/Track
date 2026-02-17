"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Signal, Cpu, Zap } from "lucide-react";

interface HudOverlayProps {
  isActive: boolean;
}

export default function HudOverlay({ isActive }: HudOverlayProps) {
  const [time, setTime] = useState("");

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
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Top-right HUD */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="fixed right-6 top-6 z-30 flex items-center gap-4 font-mono text-[10px] tracking-wider text-neutral-600"
          >
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3 text-cyan-500/50" />
              CONNECTED
            </span>
            <span className="flex items-center gap-1.5">
              <Signal className="h-3 w-3 text-emerald-500/50" />
              SAT-7
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-violet-500/50" />
              {time}
            </span>
          </motion.div>

          {/* Bottom-left system status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="fixed bottom-6 left-6 z-30 font-mono text-[9px] tracking-wider text-neutral-700"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-cyan-500/30" />
              <span>SYS.ORBITAL_TRACK v2.4.1</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-neutral-800">
              <span className="h-1 w-1 rounded-full bg-emerald-500/50" />
              <span>ALL SYSTEMS NOMINAL</span>
            </div>
          </motion.div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="pointer-events-none fixed inset-0 z-20"
          >
            {/* Top-left corner bracket */}
            <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-cyan-500/10" />
            {/* Top-right corner bracket */}
            <div className="absolute right-4 top-4 h-8 w-8 border-r border-t border-cyan-500/10" />
            {/* Bottom-left corner bracket */}
            <div className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-cyan-500/10" />
            {/* Bottom-right corner bracket */}
            <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-cyan-500/10" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
