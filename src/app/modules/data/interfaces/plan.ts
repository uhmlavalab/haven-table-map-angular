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
  parcels: Parcel[];
  setupFunction(): any | null;
  updateFunction(): any | null;
}

export interface Parcel {
  path: any;
  properties: any;
}

export interface CSVData {
  name: string;
  filePath: string;
  data: any[];
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
