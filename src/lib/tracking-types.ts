export interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
}

export interface StatusEvent {
  timestamp: string;
  description: string;
  location: string;
  status: "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "customs" | "processing";
}

export interface TrackingData {
  trackingId: string;
  carrier: string;
  origin: GeoPoint;
  current: GeoPoint;
  destination: GeoPoint;
  estimatedDelivery: string;
  currentStatus: string;
  statusHistory: StatusEvent[];
  progress: number; // 0-100
}

export interface TrackingService {
  name: string;
  track(trackingId: string): Promise<TrackingData>;
  canHandle(trackingId: string): boolean;
}
