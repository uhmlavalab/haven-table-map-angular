import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { Scenario } from '@app/interfaces';

@Component({
  selector: 'app-offshore-wind',
  templateUrl: './offshore-wind.component.html',
  styleUrls: ['./offshore-wind.component.css']
})
export class OffshoreWindComponent implements OnInit {

  year: number;
  scenario: Scenario;
  windmills = [];

  constructor(private planService: PlanService) {

  }

  ngOnInit() {
    this.year = this.planService.getCurrentYear();
    this.planService.getCapacityData().then(value => {
      this.planService.yearSubject.subscribe(year => {
        this.year = year;
        this.updateWindmills();
      });
      this.planService.scenarioSubject.subscribe(scenario => {
        this.scenario = scenario;
        this.updateWindmills();
      });
    });
  }
  updateWindmills() {
    const cap = this.planService.getCapacityTotalForCurrentYear(['Offshore']);
    this.windmills = [];
    for (let i = 0; i < cap; i += 20) {
      this.windmills.push({ icon: 'windmill' });
    }
  }
}
