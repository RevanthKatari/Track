import { TrackingData, TrackingService, StatusEvent, GeoPoint } from "@/lib/tracking-types";

const ROUTES: Record<string, { origin: GeoPoint; waypoints: GeoPoint[]; destination: GeoPoint }> = {
  default: {
    origin: { lat: 31.2304, lng: 121.4737, label: "Shanghai, China" },
    waypoints: [
      { lat: 61.2181, lng: -149.9003, label: "Anchorage, AK" },
    ],
    destination: { lat: 35.1495, lng: -90.0490, label: "Memphis, TN" },
  },
  route2: {
    origin: { lat: 51.5074, lng: -0.1278, label: "London, UK" },
    waypoints: [
      { lat: 48.8566, lng: 2.3522, label: "Paris, France" },
    ],
    destination: { lat: 40.7128, lng: -74.0060, label: "New York, NY" },
  },
  route3: {
    origin: { lat: 35.6762, lng: 139.6503, label: "Tokyo, Japan" },
    waypoints: [
      { lat: 21.3069, lng: -157.8583, label: "Honolulu, HI" },
    ],
    destination: { lat: 34.0522, lng: -118.2437, label: "Los Angeles, CA" },
  },
  route4: {
    origin: { lat: -33.8688, lng: 151.2093, label: "Sydney, Australia" },
    waypoints: [
      { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    ],
    destination: { lat: 25.2048, lng: 55.2708, label: "Dubai, UAE" },
  },
  route5: {
    origin: { lat: 19.0760, lng: 72.8777, label: "Mumbai, India" },
    waypoints: [
      { lat: 50.1109, lng: 8.6821, label: "Frankfurt, Germany" },
    ],
    destination: { lat: 41.8781, lng: -87.6298, label: "Chicago, IL" },
  },
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateStatusHistory(route: { origin: GeoPoint; waypoints: GeoPoint[]; destination: GeoPoint }): StatusEvent[] {
  const now = new Date();
  return [
    {
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Package picked up",
      location: route.origin.label,
      status: "picked_up",
    },
    {
      timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Departed facility",
      location: route.origin.label,
      status: "in_transit",
    },
    {
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Customs clearance completed",
      location: route.origin.label,
      status: "customs",
    },
    {
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "In transit — international shipment",
      location: "In Transit",
      status: "in_transit",
    },
    {
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Arrived at sort facility",
      location: route.waypoints[0].label,
      status: "processing",
    },
    {
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      description: "Departed sort facility",
      location: route.waypoints[0].label,
      status: "in_transit",
    },
    {
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      description: "Package is in transit to destination",
      location: "In Transit",
      status: "in_transit",
    },
  ];
}

export class FedExProvider implements TrackingService {
  name = "FedEx";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canHandle(_trackingId: string): boolean {
    return true;
  }

  async track(trackingId: string): Promise<TrackingData> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const routeKeys = Object.keys(ROUTES);
    const hash = hashString(trackingId);
    const routeKey = routeKeys[hash % routeKeys.length];
    const route = ROUTES[routeKey];
    const progress = 30 + (hash % 50);

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 2 + (hash % 3));

    return {
      trackingId,
      carrier: "FedEx",
      origin: route.origin,
      current: route.waypoints[0],
      destination: route.destination,
      estimatedDelivery: estimatedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      currentStatus: "In Transit",
      statusHistory: generateStatusHistory(route),
      progress,
    };
  }
}
