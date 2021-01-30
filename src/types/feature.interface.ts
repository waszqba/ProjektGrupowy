export interface FeatureInterface {
  type: 'Feature';
  properties: {
    Port: string;
    Kraj: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}
