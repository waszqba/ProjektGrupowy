export interface StatsInterface {
  confirmed: number;
  deaths: number;
  recovered: number;
  active: number;
  latestChange?: {
    confirmed: number;
    deaths: number;
    recovered: number;
    active: number;
  };
}
