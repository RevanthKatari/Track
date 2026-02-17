import { TrackingData, TrackingService } from "./tracking-types";
import { FedExProvider } from "@/providers/fedex-provider";

class TrackingRegistry {
  private providers: TrackingService[] = [];

  register(provider: TrackingService) {
    this.providers.push(provider);
    return this;
  }

  async track(trackingId: string): Promise<TrackingData> {
    const provider = this.providers.find((p) => p.canHandle(trackingId));
    if (!provider) {
      throw new Error(`No provider found for tracking ID: ${trackingId}`);
    }
    return provider.track(trackingId);
  }
}

const registry = new TrackingRegistry();
registry.register(new FedExProvider());

export { registry };
