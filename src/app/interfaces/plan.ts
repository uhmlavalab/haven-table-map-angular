import { Map } from './map';

export interface Plan {
  name: string;
  displayName: string;
  landingImagePath: string;
  secondScreenImagePath: string;
  includeSecondScreen: boolean;
  selectedIsland: boolean;
  minYear: number;
  maxYear: number;
  data: {
    capacityPath: string;
    generationPath: string;
    batteryPath: string;
    colors: object;
  };
  map: Map;
}
