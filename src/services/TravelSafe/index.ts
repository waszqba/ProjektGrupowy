import { CountryCodesEnum } from '@/services/TravelSafe/countryCodes';
import { RestrictionInterface } from '@/services/TravelSafe/restriction.interface';

export class TravelSafeService {
  static async getRestrictions(origin: CountryCodesEnum, destination: CountryCodesEnum, date?: string): Promise<RestrictionInterface> {
    return (await fetch(`https://api.travelperk.com/travelsafe/restrictions?origin=${
      origin
    }&destination=${
      destination
    }&origin_type=country_code&destination_type=country_code&date=${
      date}` || new Date().toISOString().split('T').shift() as string, {
      method: 'GET',
      headers: {
        'Api-Version': '1',
        Authorization: `ApiKey ${process.env.VUE_APP_STK}`,
        'Accept-Language': 'en',
      },
    })).json();
  }
}
