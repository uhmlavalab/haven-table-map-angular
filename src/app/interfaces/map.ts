export interface MapLayer {
  name: string;
  displayName: string;
  filePath: string;
  iconPath: string;
  active: boolean;
  included: boolean;
  fillColor: string;
  borderColor: string;
  legendColor: string;
  fillFunction(d3: any, parcels: any[], active: boolean): any;
}

export interface Map {
  scale: number;
  width: number;
  height: number;
  bounds: [[number, number], [number, number]];
  baseMapPath: string;
  mapLayers: MapLayer[];
}
