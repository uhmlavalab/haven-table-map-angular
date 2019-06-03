import { Component, OnInit } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { Scenario } from '../interfaces/scenario';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {

  private scenarios: Scenario[] = [];
  private scenario: Scenario;
  private scenarioIndex: number;

  constructor(private planService: PlanService) {
    this.scenarios = this.planService.getScenarios();
    this.scenarioIndex = 0;
    this.scenario = this.scenarios[this.scenarioIndex];
  }

  ngOnInit() {
    this.planService.scenarioSubject.subscribe({
      next: value => {
        this.scenario = value;
        this.scenarioIndex = this.scenarios.indexOf(this.scenario);
      }
    });
  }

}
