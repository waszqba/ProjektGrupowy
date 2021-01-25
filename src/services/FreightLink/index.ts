import { ResponseInterface } from '@/services/FreightLink/response.interface';

export default class FreightLinkService {
  static async FeaturizePorts() {
    const ports = await this.getPorts();
    return ports.map((port) => ({
      type: 'Feature',
      properties: {
        Port: port.name,
        Kraj: 'Polska',
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

  private static async getPorts(): Promise<ResponseInterface[]> {
    return (await import('./data.json')).default;
  }
}
