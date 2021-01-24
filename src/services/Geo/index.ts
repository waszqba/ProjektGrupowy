import { CountryInterface } from '@/services/Geo/country.interface';
import { PortInterface } from '@/services/Geo/port.interface';

export default class GeoService {
  static async FeaturizePorts() {
    const ports = await this.getPorts();
    const countries = await this.getCountries();
    return ports.map((port) => ({
      type: 'Feature',
      properties: {
        Port: port.name,
        Kraj: countries[port.country_id],
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

  private static async getCountries(): Promise<CountryInterface> {
    return (await import('./countries.json')).default;
  }
}
