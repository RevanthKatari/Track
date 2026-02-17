"use client";

import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { TrackingData } from "@/lib/tracking-types";
import * as THREE from "three";

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

const GLOBE_IMAGE = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMAGE = "//unpkg.com/three-globe/example/img/earth-topology.png";

export default function GlobeViz({ trackingData, isVisible }: GlobeVizProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);

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
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
      controls.minDistance = 200;
      controls.maxDistance = 500;
    }

    const scene = globe.scene();
    if (scene) {
      scene.fog = null;
      const ambientLight = new THREE.AmbientLight(0x334455, 1.5);
      scene.add(ambientLight);
    }

    const renderer = globe.renderer();
    if (renderer) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
    }
  }, [globeReady]);

  useEffect(() => {
    if (!globeRef.current || !trackingData || !globeReady) return;
    const globe = globeRef.current;

    const midLat = (trackingData.origin.lat + trackingData.destination.lat) / 2;
    const midLng = (trackingData.origin.lng + trackingData.destination.lng) / 2;

    globe.pointOfView(
      { lat: midLat, lng: midLng, altitude: 2.2 },
      2000
    );
  }, [trackingData, globeReady]);

  const arcsData: ArcData[] = useMemo(() => {
    if (!trackingData) return [];
    return [
      {
        startLat: trackingData.origin.lat,
        startLng: trackingData.origin.lng,
        endLat: trackingData.current.lat,
        endLng: trackingData.current.lng,
        color: ["#06b6d4", "#8b5cf6"] as [string, string],
        stroke: 1.2,
        dashLength: 0.6,
        dashGap: 0.3,
        dashAnimateTime: 4000,
      },
      {
        startLat: trackingData.current.lat,
        startLng: trackingData.current.lng,
        endLat: trackingData.destination.lat,
        endLng: trackingData.destination.lng,
        color: ["#8b5cf6", "#ec4899"] as [string, string],
        stroke: 0.8,
        dashLength: 0.3,
        dashGap: 0.5,
        dashAnimateTime: 5000,
      },
    ];
  }, [trackingData]);

  const ringsData: RingData[] = useMemo(() => {
    if (!trackingData) return [];
    return [
      {
        lat: trackingData.current.lat,
        lng: trackingData.current.lng,
        maxR: 6,
        propagationSpeed: 3,
        repeatPeriod: 1200,
        color: "#06b6d4",
      },
      {
        lat: trackingData.origin.lat,
        lng: trackingData.origin.lng,
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 2000,
        color: "#22d3ee",
      },
      {
        lat: trackingData.destination.lat,
        lng: trackingData.destination.lng,
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 2000,
        color: "#ec4899",
      },
    ];
  }, [trackingData]);

  const labelsData: LabelData[] = useMemo(() => {
    if (!trackingData) return [];
    return [
      {
        lat: trackingData.origin.lat,
        lng: trackingData.origin.lng,
        text: trackingData.origin.label,
        color: "#22d3ee",
        size: 0.8,
        dotRadius: 0.4,
      },
      {
        lat: trackingData.current.lat,
        lng: trackingData.current.lng,
        text: `📦 ${trackingData.current.label}`,
        color: "#06b6d4",
        size: 1.0,
        dotRadius: 0.6,
      },
      {
        lat: trackingData.destination.lat,
        lng: trackingData.destination.lng,
        text: trackingData.destination.label,
        color: "#ec4899",
        size: 0.8,
        dotRadius: 0.4,
      },
    ];
  }, [trackingData]);

  const globeCustomMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      bumpScale: 10,
      specular: new THREE.Color("#111827"),
      shininess: 8,
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={GLOBE_IMAGE}
          bumpImageUrl={BUMP_IMAGE}
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          globeMaterial={globeCustomMaterial}
          atmosphereColor="#06b6d4"
          atmosphereAltitude={0.25}
          arcsData={arcsData}
          arcColor={"color" as unknown as string}
          arcStroke={"stroke" as unknown as number}
          arcDashLength={"dashLength" as unknown as number}
          arcDashGap={"dashGap" as unknown as number}
          arcDashAnimateTime={"dashAnimateTime" as unknown as number}
          arcAltitudeAutoScale={0.4}
          ringsData={ringsData}
          ringColor={"color" as unknown as string}
          ringMaxRadius={"maxR" as unknown as number}
          ringPropagationSpeed={"propagationSpeed" as unknown as number}
          ringRepeatPeriod={"repeatPeriod" as unknown as number}
          labelsData={labelsData}
          labelText={"text" as unknown as string}
          labelColor={"color" as unknown as string}
          labelSize={"size" as unknown as number}
          labelDotRadius={"dotRadius" as unknown as number}
          labelAltitude={0.02}
          labelResolution={2}
          animateIn={true}
          onGlobeReady={onGlobeReady}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />
    </div>
  );
}
