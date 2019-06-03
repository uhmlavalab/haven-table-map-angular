import { Component, OnInit } from '@angular/core';
import { Chart } from '../interfaces/chart';
import { PlanService } from '@app/services/plan.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  constructor(private planService: PlanService) {

  }

  ngOnInit() {

  }


}
