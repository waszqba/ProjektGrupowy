import {
  RestrictionInterface,
  RestrictionsCollectionInterface,
} from '@/types/restrictions.interface';
import { StatsResponseInterface } from '@/types/stats-response.interface';
import { StatsInterface } from '@/types/stats.interface';

export default class CovidInfoService {
  static async restrictions(): Promise<RestrictionsCollectionInterface> {
    return (await import('./data.json')).default;
  }

  static async countryRestrictions(countryId: number): Promise<RestrictionInterface> {
    return (await this.restrictions())[countryId];
  }

  static async countryStats(countrySlug: string): Promise<StatsInterface> {
    const response: StatsResponseInterface[] = await (await fetch(`http://localhost:8010/proxy/${
      countrySlug
    }?from=${this.byDay}&to=${this.today}`, {
      method: 'GET',
    })).json();
    const latest = response.pop() as StatsResponseInterface;
    const recent = response.pop() as StatsResponseInterface;
    return {
      active: latest.Active,
      confirmed: latest.Confirmed,
      deaths: latest.Deaths,
      recovered: latest.Recovered,
      latestChange: {
        active: recent.Active,
        confirmed: recent.Confirmed,
        deaths: recent.Deaths,
        recovered: recent.Recovered,
      },
    };
  }

  static get today(): string {
    return this.dateString();
  }

  static get byDay(): string {
    return this.dateString(2);
  }

  private static dateString(daysBack = 0): string {
    const DAY = (36 * 24 * (10 ** 5));
    return new Date(Date.now() - daysBack * DAY)
      .toISOString()
      .split('T')
      .shift() as string;
  }
}
