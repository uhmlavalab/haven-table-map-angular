import { KeyboardInput } from '@app/modules/input/schemes/keyboard/keyboard.component';

export interface Map {
  baseImagePath: string;
  bounds: [[number, number], [number, number]];
  mapLayers: MapLayer[];
}

export interface MapLayer {
  name: string;
  displayName: string;
  filePath: string;
  iconPath: string;
  imagePath: string;
  description: string;
  active: boolean;
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  features: MapFeature[];
  setupFunction(): any | null;
  updateFunction(): any | null;
}

export interface MapFeature {
  path: any;
  properties: any;
}

export interface CSVData {
  name: string;
  filePath: string;
  data: any[];
}

export interface Input {
  keyboard: KeyboardInput[];
}

export interface Scenario {
  name: string;
  displayName: string;
}

export enum Component {
  Map,
  MiniMap,
  ZoomableMap,
  LinChart,
  PieChart,
}

export interface Plan {
  name: string;
  displayName: string;
  landingImagePath: string;
  secondScreenImagePath: string;
  includeSecondScreen: boolean;
  minYear: number;
  maxYear: number;
  scenarios: Scenario[];
  csvData: CSVData[];
  map: Map;
  secondScreenComponents: {position: number; component: Component;  inputs: any};
  input: {
    scheme: string;
    properties: any;
  };
}
