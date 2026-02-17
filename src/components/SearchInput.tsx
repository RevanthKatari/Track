"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Satellite, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (trackingId: string) => void;
  isLoading: boolean;
  isCompact: boolean;
}

export default function SearchInput({ onSearch, isLoading, isCompact }: SearchInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isCompact && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 800);
      return () => clearTimeout(timer);
    }
  }, [isCompact]);

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
        isCompact ? "max-w-full md:max-w-md" : "max-w-2xl"
      )}
    >
      {/* Hero area (only in idle state) */}
      <AnimatePresence>
        {!isCompact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 text-center md:mb-10"
          >
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="mb-5 flex justify-center md:mb-7"
            >
              <div className="relative">
                <div className="absolute -inset-3 animate-ping rounded-full bg-cyan-500/10" />
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-md" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-neutral-950/80 shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)] backdrop-blur-sm md:h-16 md:w-16">
                  <Satellite className="h-5 w-5 text-cyan-400 md:h-7 md:w-7" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span className="text-glow">ORBITAL</span>
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                {" "}TRACK
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-2 font-mono text-[9px] tracking-[0.2em] text-neutral-600 uppercase sm:text-[10px] sm:tracking-[0.25em] md:mt-3 md:text-[11px] md:tracking-[0.35em]"
            >
              Global Package Intelligence System
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent sm:w-32 md:mt-5 md:w-40"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search input */}
      <form onSubmit={handleSubmit}>
        <motion.div
          layout
          className={cn(
            "group relative overflow-hidden rounded-xl md:rounded-2xl",
            "border bg-neutral-950/60 backdrop-blur-xl",
            "transition-all duration-500",
            isFocused || isLoading
              ? "border-cyan-500/20 shadow-[0_0_60px_-8px_rgba(6,182,212,0.2)]"
              : "border-white/[0.06] shadow-[0_0_40px_-12px_rgba(6,182,212,0.1)]",
            "hover:border-cyan-500/15 hover:shadow-[0_0_50px_-8px_rgba(6,182,212,0.15)]"
          )}
        >
          {/* Top glow line */}
          <div
            className={cn(
              "absolute inset-x-0 -top-px h-px transition-opacity duration-500",
              isFocused ? "opacity-100" : "opacity-50"
            )}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(139,92,246,0.3), transparent)",
            }}
          />

          {/* Inner gradient tint */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/[0.02] via-transparent to-violet-500/[0.02]" />

          <div className={cn(
            "relative flex items-center gap-2 sm:gap-3",
            isCompact ? "px-3 py-2.5 md:px-4 md:py-3" : "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 md:py-4"
          )}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-400 md:h-5 md:w-5" />
            ) : (
              <Search
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-300 md:h-5 md:w-5",
                  isFocused ? "text-cyan-400" : "text-neutral-600"
                )}
              />
            )}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isCompact ? "Track another..." : "Enter tracking ID"}
              disabled={isLoading}
              className={cn(
                "w-full min-w-0 bg-transparent font-mono text-white outline-none",
                "placeholder:text-neutral-700",
                "disabled:opacity-50",
                isCompact
                  ? "text-xs sm:text-sm"
                  : "text-sm sm:text-base md:text-lg"
              )}
            />
            <motion.button
              type="submit"
              disabled={!value.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2 md:px-5 md:py-2.5 md:text-xs",
                "bg-gradient-to-r from-cyan-500 to-violet-500",
                "text-white shadow-lg shadow-cyan-500/20",
                "transition-all duration-300",
                "hover:shadow-cyan-500/30",
                "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:shadow-none",
                isCompact && "px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2"
              )}
            >
              <Crosshair className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span className="hidden sm:inline">{isLoading ? "Scanning..." : "Track"}</span>
            </motion.button>
          </div>

          {/* Loading progress bar */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-[2px] origin-left bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Provider badges (only in idle) */}
      <AnimatePresence>
        {!isCompact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-4 flex items-center justify-center gap-4 font-mono text-[9px] tracking-wider text-neutral-600 uppercase sm:gap-6 sm:text-[10px] md:mt-5"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/60 shadow-[0_0_6px_rgba(6,182,212,0.4)]" />
              FedEx
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-700/50" />
              <span className="text-neutral-700">DHL</span>
              <span className="hidden text-neutral-700 sm:inline">(Soon)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-700/50" />
              <span className="text-neutral-700">UPS</span>
              <span className="hidden text-neutral-700 sm:inline">(Soon)</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
