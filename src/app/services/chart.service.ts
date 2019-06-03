import { Injectable } from '@angular/core';
import { Chart, Scenario } from '@app/interfaces';
import { Subject } from 'rxjs';
import { PlanService } from './plan.service';
import * as d3 from 'd3/d3.min';


@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private currentData: any;

  private currentScenario: Scenario;
  private currentYear: number;

  private generationData = {};
  private capacityData = {};

  constructor(private planService: PlanService) {
    this.planService.planSubject.subscribe(plan => {
      this.currentData = plan.data;
    });

    this.planService.scenarioSubject.subscribe(scenario => {
      this.currentScenario = scenario;
    });

    this.planService.yearSubject.subscribe(year => {
      this.currentYear = year;
    });
  }

}
