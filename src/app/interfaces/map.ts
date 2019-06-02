export interface MapLayer {
  name: string;
  displayName: string;
  fileUrl: string;
  icon: string;
  active: boolean;
  fillColor: string;
  borderColor: string;
}

export interface Map {
  scale: number;
  width: number;
  height: number;
  bounds: [[number, number], [number, number]];
  baseMapPath: string;
  mapLayers: MapLayer[];
}
