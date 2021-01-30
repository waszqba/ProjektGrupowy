import { CountryCodesEnum } from '@/services/TravelSafe/countryCodes.enum';
import { RestrictionInterface } from '@/services/TravelSafe/restriction.interface';

export default class TravelSafeService {
  static async getRestrictions(
    origin: CountryCodesEnum, destination: CountryCodesEnum, date?: string,
  ): Promise<RestrictionInterface> {
    return (await fetch(`http://localhost:8010/proxy/travelsafe/restrictions?origin=${
      origin
    }&destination=${
      destination
    }&origin_type=country_code&destination_type=country_code&date=${
      date || new Date().toISOString().split('T').shift() as string}`, {
      method: 'GET',
      headers: {
        'Api-Version': '1',
        Authorization: `ApiKey ${process.env.VUE_APP_STK}`,
        'Accept-Language': 'en',
      },
    })).json();
  }
}
