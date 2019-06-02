import { Injectable } from '@angular/core';

import { Plan } from '@app/interfaces/plan';


@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private selectedPlan: Plan;

  constructor() { }

  setPlan(plan: Plan) {
    this.selectedPlan = plan;
  }

  getPlan() {
    return this.selectedPlan;
  }

}
