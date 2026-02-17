"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Shield,
  Activity,
  Navigation,
} from "lucide-react";
import { TrackingData, StatusEvent } from "@/lib/tracking-types";
import { cn } from "@/lib/utils";

interface StatusPanelProps {
  trackingData: TrackingData | null;
  isVisible: boolean;
}

function getStatusIcon(status: StatusEvent["status"]) {
  switch (status) {
    case "picked_up":
      return <Package className="h-3 w-3" />;
    case "in_transit":
      return <Truck className="h-3 w-3" />;
    case "customs":
      return <Shield className="h-3 w-3" />;
    case "processing":
      return <Activity className="h-3 w-3" />;
    case "out_for_delivery":
      return <Navigation className="h-3 w-3" />;
    case "delivered":
      return <CheckCircle2 className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.15 },
  },
};

export default function StatusPanel({ trackingData, isVisible }: StatusPanelProps) {
  if (!trackingData || !isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={trackingData.trackingId}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex h-full flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin md:gap-3"
      >
        {/* Header Card */}
        <motion.div variants={cardVariants} className="glass-card p-3 md:p-4">
          <div className="mb-2.5 flex items-center gap-2 md:mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 ring-1 ring-cyan-500/20 md:h-6 md:w-6">
              <Package className="h-3 w-3 text-cyan-400 md:h-3.5 md:w-3.5" />
            </div>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-400 md:text-[10px]">
              Shipment Intel
            </span>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 md:text-[10px]">
                Tracking ID
              </span>
              <span className="max-w-[55%] truncate font-mono text-[11px] font-medium text-white md:text-xs">
                {trackingData.trackingId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 md:text-[10px]">
                Carrier
              </span>
              <span className="font-mono text-[11px] font-medium text-violet-400 md:text-xs">
                {trackingData.carrier}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 md:text-[10px]">
                Status
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-emerald-400 md:text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {trackingData.currentStatus}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Route Card */}
        <motion.div variants={cardVariants} className="glass-card p-3 md:p-4">
          <div className="mb-2.5 flex items-center gap-2 md:mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/10 ring-1 ring-violet-500/20 md:h-6 md:w-6">
              <MapPin className="h-3 w-3 text-violet-400 md:h-3.5 md:w-3.5" />
            </div>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400 md:text-[10px]">
              Route Map
            </span>
          </div>

          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-1.5 md:hidden">
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-2">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[8px] uppercase tracking-wider text-neutral-500">Origin</div>
                <div className="truncate font-mono text-[11px] font-medium text-cyan-300">
                  {trackingData.origin.label}
                </div>
              </div>
              <ArrowDown className="h-3 w-3 shrink-0 text-neutral-600" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-violet-500/10 bg-violet-500/5 p-2">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[8px] uppercase tracking-wider text-neutral-500">Current</div>
                <div className="truncate font-mono text-[11px] font-medium text-violet-300">
                  {trackingData.current.label}
                </div>
              </div>
              <ArrowDown className="h-3 w-3 shrink-0 text-neutral-600" />
            </div>
            <div className="rounded-lg border border-pink-500/10 bg-pink-500/5 p-2">
              <div className="font-mono text-[8px] uppercase tracking-wider text-neutral-500">Destination</div>
              <div className="truncate font-mono text-[11px] font-medium text-pink-300">
                {trackingData.destination.label}
              </div>
            </div>
          </div>

          {/* Desktop: horizontal row (unchanged) */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex-1 space-y-1 rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-2">
              <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Origin</div>
              <div className="font-mono text-[11px] font-medium text-cyan-300">
                {trackingData.origin.label}
              </div>
            </div>
            <ArrowRight className="h-3 w-3 shrink-0 text-neutral-600" />
            <div className="flex-1 space-y-1 rounded-lg border border-violet-500/10 bg-violet-500/5 p-2">
              <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Current</div>
              <div className="font-mono text-[11px] font-medium text-violet-300">
                {trackingData.current.label}
              </div>
            </div>
            <ArrowRight className="h-3 w-3 shrink-0 text-neutral-600" />
            <div className="flex-1 space-y-1 rounded-lg border border-pink-500/10 bg-pink-500/5 p-2">
              <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Destination</div>
              <div className="font-mono text-[11px] font-medium text-pink-300">
                {trackingData.destination.label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ETA Card */}
        <motion.div variants={cardVariants} className="glass-card p-3 md:p-4">
          <div className="mb-2.5 flex items-center gap-2 md:mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-pink-500/10 ring-1 ring-pink-500/20 md:h-6 md:w-6">
              <Clock className="h-3 w-3 text-pink-400 md:h-3.5 md:w-3.5" />
            </div>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-pink-400 md:text-[10px]">
              Estimated Delivery
            </span>
          </div>
          <div className="font-mono text-base font-bold text-white md:text-lg">
            {trackingData.estimatedDelivery}
          </div>
          {/* Progress bar */}
          <div className="mt-2.5 space-y-1 md:mt-3">
            <div className="flex justify-between font-mono text-[8px] uppercase tracking-wider text-neutral-500 md:text-[9px]">
              <span>Progress</span>
              <span className="text-cyan-400">{trackingData.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trackingData.progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Timeline Card */}
        <motion.div variants={cardVariants} className="glass-card p-3 md:p-4">
          <div className="mb-2.5 flex items-center gap-2 md:mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20 md:h-6 md:w-6">
              <Activity className="h-3 w-3 text-emerald-400 md:h-3.5 md:w-3.5" />
            </div>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400 md:text-[10px]">
              Activity Log
            </span>
          </div>
          <div className="space-y-0">
            {[...trackingData.statusHistory].reverse().map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                className={cn(
                  "relative flex gap-3 py-1.5 md:py-2",
                  index < trackingData.statusHistory.length - 1 &&
                    "border-l border-white/[0.06] ml-[7px] pl-[15px]",
                  index === trackingData.statusHistory.length - 1 && "ml-[7px] pl-[15px]"
                )}
              >
                <div
                  className={cn(
                    "absolute -left-[4.5px] top-2 flex h-[9px] w-[9px] items-center justify-center rounded-full md:top-2.5",
                    index === 0
                      ? "bg-cyan-400 ring-2 ring-cyan-400/30"
                      : "bg-neutral-700 ring-1 ring-neutral-600"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "font-mono text-[10px]",
                        index === 0 ? "text-cyan-400" : "text-neutral-500"
                      )}
                    >
                      {getStatusIcon(event.status)}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[10px] font-medium leading-tight md:text-[11px]",
                        index === 0 ? "text-white" : "text-neutral-400"
                      )}
                    >
                      {event.description}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 font-mono text-[8px] text-neutral-600 md:text-[9px]">
                    <span>{formatTimestamp(event.timestamp)}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
