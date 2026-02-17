"use client";

import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { TrackingData } from "@/lib/tracking-types";
import * as THREE from "three";
import { motion } from "framer-motion";

interface GlobeVizProps {
  trackingData: TrackingData | null;
  isVisible: boolean;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  stroke: number;
  dashLength: number;
  dashGap: number;
  dashAnimateTime: number;
}

interface RingData {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
  color: string;
}

interface LabelData {
  lat: number;
  lng: number;
  text: string;
  color: string;
  size: number;
  dotRadius: number;
}

interface PointData {
  lat: number;
  lng: number;
  size: number;
  color: string;
}

const GLOBE_IMAGE_DARK = "//unpkg.com/three-globe/example/img/earth-night.jpg";
const GLOBE_IMAGE_BLUE = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMAGE = "//unpkg.com/three-globe/example/img/earth-topology.png";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function GlobeViz({ trackingData, isVisible }: GlobeVizProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const onGlobeReady = useCallback(() => {
    setGlobeReady(true);
  }, []);

  useEffect(() => {
    if (!globeRef.current || !globeReady) return;
    const globe = globeRef.current;

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = !isMobile;
      controls.minDistance = isMobile ? 220 : 180;
      controls.maxDistance = 500;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
    }

    const scene = globe.scene();
    if (scene) {
      scene.fog = null;

      const directionalLight = new THREE.DirectionalLight(0x0891b2, 0.3);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const ambientLight = new THREE.AmbientLight(0x1e293b, 2.0);
      scene.add(ambientLight);
    }

    const renderer = globe.renderer();
    if (renderer) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      if (isMobile) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    }
  }, [globeReady, isMobile]);

  useEffect(() => {
    if (!globeRef.current || !trackingData || !globeReady) return;
    const globe = globeRef.current;

    const midLat = (trackingData.origin.lat + trackingData.destination.lat + trackingData.current.lat) / 3;
    const midLng = (trackingData.origin.lng + trackingData.destination.lng + trackingData.current.lng) / 3;

    globe.pointOfView(
      { lat: midLat, lng: midLng, altitude: isMobile ? 2.8 : 2.0 },
      2500
    );

    const controls = globe.controls();
    if (controls) {
      controls.autoRotateSpeed = 0.15;
    }
  }, [trackingData, globeReady, isMobile]);

  const arcsData: ArcData[] = useMemo(() => {
    if (!trackingData) return [];
    return [
      {
        startLat: trackingData.origin.lat,
        startLng: trackingData.origin.lng,
        endLat: trackingData.current.lat,
        endLng: trackingData.current.lng,
        color: ["#06b6d4", "#8b5cf6"] as [string, string],
        stroke: isMobile ? 1.0 : 1.4,
        dashLength: 0.5,
        dashGap: 0.2,
        dashAnimateTime: 3000,
      },
      {
        startLat: trackingData.current.lat,
        startLng: trackingData.current.lng,
        endLat: trackingData.destination.lat,
        endLng: trackingData.destination.lng,
        color: ["#8b5cf6", "#ec4899"] as [string, string],
        stroke: isMobile ? 0.6 : 0.8,
        dashLength: 0.3,
        dashGap: 0.4,
        dashAnimateTime: 4000,
      },
    ];
  }, [trackingData, isMobile]);

  const ringsData: RingData[] = useMemo(() => {
    if (!trackingData) return [];
    return [
      {
        lat: trackingData.current.lat,
        lng: trackingData.current.lng,
        maxR: isMobile ? 4 : 5,
        propagationSpeed: 2.5,
        repeatPeriod: 1000,
        color: "#06b6d4",
      },
      {
        lat: trackingData.origin.lat,
        lng: trackingData.origin.lng,
        maxR: isMobile ? 2 : 2.5,
        propagationSpeed: 1.5,
        repeatPeriod: 1800,
        color: "#22d3ee",
      },
      {
        lat: trackingData.destination.lat,
        lng: trackingData.destination.lng,
        maxR: isMobile ? 2 : 2.5,
        propagationSpeed: 1.5,
        repeatPeriod: 1800,
        color: "#ec4899",
      },
    ];
  }, [trackingData, isMobile]);

  const pointsData: PointData[] = useMemo(() => {
    if (!trackingData) return [];
    return [
      { lat: trackingData.origin.lat, lng: trackingData.origin.lng, size: 0.5, color: "#22d3ee" },
      { lat: trackingData.current.lat, lng: trackingData.current.lng, size: 0.8, color: "#06b6d4" },
      { lat: trackingData.destination.lat, lng: trackingData.destination.lng, size: 0.5, color: "#ec4899" },
    ];
  }, [trackingData]);

  const labelsData: LabelData[] = useMemo(() => {
    if (!trackingData) return [];
    const sz = isMobile ? 0.5 : 0.7;
    const szCurrent = isMobile ? 0.65 : 0.9;
    const dot = isMobile ? 0.25 : 0.35;
    const dotCurrent = isMobile ? 0.35 : 0.5;
    return [
      {
        lat: trackingData.origin.lat,
        lng: trackingData.origin.lng,
        text: isMobile ? trackingData.origin.label : `ORIGIN: ${trackingData.origin.label}`,
        color: "rgba(34, 211, 238, 0.9)",
        size: sz,
        dotRadius: dot,
      },
      {
        lat: trackingData.current.lat,
        lng: trackingData.current.lng,
        text: isMobile ? trackingData.current.label : `CURRENT: ${trackingData.current.label}`,
        color: "rgba(6, 182, 212, 1)",
        size: szCurrent,
        dotRadius: dotCurrent,
      },
      {
        lat: trackingData.destination.lat,
        lng: trackingData.destination.lng,
        text: isMobile ? trackingData.destination.label : `DEST: ${trackingData.destination.label}`,
        color: "rgba(236, 72, 153, 0.9)",
        size: sz,
        dotRadius: dot,
      },
    ];
  }, [trackingData, isMobile]);

  const globeCustomMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      bumpScale: 8,
      specular: new THREE.Color("#0c1322"),
      shininess: 6,
    });
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-0"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={trackingData ? GLOBE_IMAGE_BLUE : GLOBE_IMAGE_DARK}
          bumpImageUrl={BUMP_IMAGE}
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          globeMaterial={globeCustomMaterial}
          atmosphereColor="#0891b2"
          atmosphereAltitude={0.2}
          arcsData={arcsData}
          arcColor={"color" as unknown as string}
          arcStroke={"stroke" as unknown as number}
          arcDashLength={"dashLength" as unknown as number}
          arcDashGap={"dashGap" as unknown as number}
          arcDashAnimateTime={"dashAnimateTime" as unknown as number}
          arcAltitudeAutoScale={0.45}
          ringsData={ringsData}
          ringColor={"color" as unknown as string}
          ringMaxRadius={"maxR" as unknown as number}
          ringPropagationSpeed={"propagationSpeed" as unknown as number}
          ringRepeatPeriod={"repeatPeriod" as unknown as number}
          pointsData={pointsData}
          pointColor={"color" as unknown as string}
          pointAltitude={0.01}
          pointRadius={"size" as unknown as number}
          labelsData={labelsData}
          labelText={"text" as unknown as string}
          labelColor={"color" as unknown as string}
          labelSize={"size" as unknown as number}
          labelDotRadius={"dotRadius" as unknown as number}
          labelAltitude={0.015}
          labelResolution={2}
          animateIn={true}
          onGlobeReady={onGlobeReady}
        />
      )}
      {/* Gradient overlays for immersion */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/80" />
    </motion.div>
  );
}
