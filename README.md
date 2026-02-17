# ORBITAL TRACK — Sci-Fi Package Tracking Dashboard

A cinematic, "Orbital Command" style package tracking dashboard built with Next.js 14, featuring an interactive 3D globe visualization, glassmorphism UI, and smooth Framer Motion animations.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (Deep Space Dark Mode)
- **Framer Motion** (Spring physics, AnimatePresence, layout animations)
- **react-globe.gl** / Three.js (3D globe with arcs, rings, labels)
- **Lucide React** (Icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **3D Globe**: Interactive globe with animated arcs connecting origin → current → destination, pulsing rings at key locations, and auto-rotation.
- **Search**: A glowing, monospaced search input that transitions from center screen to top-left upon tracking.
- **Status Panel**: HUD-style cards with shipment intel, route map, progress bar, and activity timeline.
- **Glassmorphism**: Translucent cards with blur filters, thin borders, and noise textures.
- **Mock Tracking**: Strategy Pattern architecture with FedEx mock provider — ready for DHL/UPS extension.

## Architecture

```
src/
├── app/
│   ├── page.tsx          # Main orchestrator (search state, layout transitions)
│   ├── layout.tsx        # Root layout with dark theme
│   └── globals.css       # Tailwind + custom glassmorphism + animations
├── components/
│   ├── GlobeViz.tsx      # 3D globe (react-globe.gl) with arcs, rings, labels
│   ├── SearchInput.tsx   # Hero search bar with animations
│   ├── StatusPanel.tsx   # Right-side tracking info cards
│   ├── HudOverlay.tsx    # Sci-fi HUD elements (time, status, brackets)
│   ├── NoiseTexture.tsx  # Subtle noise grain overlay
│   └── ParticleField.tsx # Floating particle background
├── lib/
│   ├── tracking-types.ts     # TypeScript interfaces
│   ├── tracking-registry.ts  # Provider registry (Strategy Pattern)
│   └── utils.ts              # cn() utility
└── providers/
    └── fedex-provider.ts     # Mock FedEx tracking data
```

## Adding New Carriers

1. Create a new file in `src/providers/` (e.g., `dhl-provider.ts`)
2. Implement the `TrackingService` interface
3. Register it in `src/lib/tracking-registry.ts`
