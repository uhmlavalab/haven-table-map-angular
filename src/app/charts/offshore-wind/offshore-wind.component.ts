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
  capacity = 0;
  windmills = [];

  img1 = 'assets/images/wind.gif';
  img2 = 'assets/images/windmill.png';

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
    this.capacity = this.planService.getCapacityTotalForCurrentYear(['Offshore']);
    this.windmills = [];
    for (let i = 0; i < this.capacity; i += 10) {
      this.windmills.push({ src: this.img2 });
    }
  }
}
