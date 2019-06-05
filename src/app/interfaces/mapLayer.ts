import { PlanService } from '@app/services/plan.service';

export interface MapLayer {
  name: string;
  displayName: string;
  filePath: string;
  iconPath: string;
  active: boolean;
  included: boolean;
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  legendColor: string;
  parcels: Parcel[];
  setupFunction(planService: PlanService): any | null;
  updateFunction(planService: PlanService): any | null;
}

export interface Parcel {
  path: any;
  properties: any;
}
