import { PlanService } from '@app/services/plan.service';

export interface Marker {
  markerId: number;
  secondId: number;
  job: string;
  delay: number;
  minRotation: number;
  layerIndex: number;
  layerId: number;
  rotateLeft(service: any): void;
  rotateRight(service: any): void;
}