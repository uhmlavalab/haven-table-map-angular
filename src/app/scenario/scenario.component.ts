import { Component, OnInit } from '@angular/core';
import { MapDataService } from '../services/map-data.service';
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

  constructor(private _mapdataservice: MapDataService) {
    this.scenarios = this._mapdataservice.getScenarios();
    this.scenarioIndex = 0;
    this.scenario = this.scenarios[this.scenarioIndex];
  }

  ngOnInit() {
    this._mapdataservice.currentScenarioSubject.subscribe({
      next: value => {
        this.scenarioIndex = <number>value;
        this.scenario = this.scenarios[<number>value];
      }
    });
  }

}
