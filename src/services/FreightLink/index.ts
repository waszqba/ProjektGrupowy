import { CountryInterface } from '@/services/FreightLink/country.interface';
import { PortInterface } from '@/services/FreightLink/port.interface';

export default class FreightLinkService {
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
