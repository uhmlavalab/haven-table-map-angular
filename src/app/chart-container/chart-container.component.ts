import { Component, OnInit } from '@angular/core';
import { Chart } from '../interfaces/chart';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  private chartIndex: number;
  private chart: Chart;
  private chartArray: Chart[] = [];

  constructor(private chartService: ChartService) {
    this.chartArray = this.chartService.getCharts();
    this.chartIndex = 0;
    this.chart = this.chartArray[this.chartIndex];
  }

  ngOnInit() {
    this.chartService.chartSubject.subscribe(value => {
      console.log(value);
    });
  }


}
