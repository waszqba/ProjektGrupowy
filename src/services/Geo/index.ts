import { CountryInterface } from '@/services/Geo/country.interface';
import { PortInterface } from '@/services/Geo/port.interface';
import { FeatureInterface } from '@/types/feature.interface';

export default class GeoService {
  static async FeaturizePorts(): Promise<FeatureInterface[]> {
    const ports = await this.getPorts();
    return ports.map((port) => ({
      type: 'Feature',
      properties: {
        Port: port.name,
        Kraj: port.country_id,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          port.lon,
          port.lat,
        ],
      },
    }));
  }

  private static async getPorts(): Promise<PortInterface[]> {
    return (await import('./ports.json')).default;
  }

  static async getCountries(): Promise<CountryInterface> {
    return (await import('./countries.json')).default;
  }
}
