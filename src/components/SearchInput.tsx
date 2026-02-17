"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Satellite } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (trackingId: string) => void;
  isLoading: boolean;
  isCompact: boolean;
}

export default function SearchInput({ onSearch, isLoading, isCompact }: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSearch(value.trim());
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "w-full",
        isCompact ? "max-w-md" : "max-w-2xl"
      )}
    >
      {!isCompact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
                <Satellite className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-mono text-4xl font-bold tracking-tight text-white md:text-5xl"
          >
            ORBITAL
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              {" "}TRACK
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-3 font-mono text-sm tracking-widest text-neutral-500 uppercase"
          >
            Global Package Intelligence System
          </motion.p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <motion.div
          layout
          className={cn(
            "group relative overflow-hidden rounded-2xl",
            "border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
            "shadow-[0_0_40px_-12px_rgba(6,182,212,0.15)]",
            "transition-all duration-500",
            "hover:border-cyan-500/20 hover:shadow-[0_0_60px_-12px_rgba(6,182,212,0.25)]",
            "focus-within:border-cyan-500/30 focus-within:shadow-[0_0_80px_-12px_rgba(6,182,212,0.35)]"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] via-transparent to-violet-500/[0.03]" />
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          <div className="relative flex items-center gap-3 px-5 py-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-cyan-400" />
            ) : (
              <Search className="h-5 w-5 shrink-0 text-neutral-500 transition-colors group-focus-within:text-cyan-400" />
            )}
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isCompact ? "Track another..." : "Enter tracking ID — e.g. 7489 2034 5621"}
              disabled={isLoading}
              className={cn(
                "w-full bg-transparent font-mono text-base text-white outline-none",
                "placeholder:text-neutral-600",
                "disabled:opacity-50",
                isCompact ? "text-sm" : "text-base md:text-lg"
              )}
            />
            <motion.button
              type="submit"
              disabled={!value.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "shrink-0 rounded-xl px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider",
                "bg-gradient-to-r from-cyan-500 to-violet-500",
                "text-white shadow-lg shadow-cyan-500/25",
                "transition-all duration-300",
                "hover:shadow-cyan-500/40",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              )}
            >
              {isLoading ? "Scanning..." : "Track"}
            </motion.button>
          </div>

          {isLoading && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-[2px] origin-left bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"
            />
          )}
        </motion.div>
      </form>

      {!isCompact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-4 flex items-center justify-center gap-6 font-mono text-[10px] tracking-wider text-neutral-600 uppercase"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50" />
            FedEx
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
            DHL (Soon)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
            UPS (Soon)
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
