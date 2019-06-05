import { Map } from './map';
import { Scenario } from './scenario';

export interface Plan {
  name: string;
  displayName: string;
  landingImagePath: string;
  secondScreenImagePath: string;
  includeSecondScreen: boolean;
  selectedPlan: boolean;
  minYear: number;
  maxYear: number;
  scenarios: Scenario[];
  css: {
    map: object;
    legend: object;
    title: object;
    scenario: object;
    charts: {
      pie: object;
      line: object;
    }
  }
  data: {
    capacityPath: string;
    generationPath: string;
    batteryPath: string;
    colors: object;
  };
  map: Map;
}
