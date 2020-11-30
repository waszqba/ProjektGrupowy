import { ResponseInterface } from '@/services/FreightLink/response.interface';

export class FreightLinkService {
  static async getPorts(): Promise<ResponseInterface[]> {
    return (await fetch('https://www.freightlink.pl/api/f2f2/ports', {
      method: 'GET',
    })).json();
  }
}
