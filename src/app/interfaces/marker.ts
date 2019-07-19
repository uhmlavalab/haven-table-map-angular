import { NumberSymbol } from '@angular/common';

export interface Marker {
  markerId: number;
  job: string;
  icon: string;
  live: boolean;
  startTime: number;
  rotationStartTime: number;
  corners: number[];
  prevCorners: number[];
  rotation: number;
  rotationSum: number;
  rotationMax: number;
  slideEvents: boolean;
}
