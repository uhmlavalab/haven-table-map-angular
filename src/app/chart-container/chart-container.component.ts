import { Component, OnInit } from '@angular/core';
import { Chart } from '../interfaces/chart';
import { MapDataService } from '../services/map-data.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  private chartIndex: number;
  private chart: Chart;
  private chartArray: Chart[] = [];

  constructor(private _mapdataservice: MapDataService) {
    this.chartArray = this._mapdataservice.getCharts();
    this.chartIndex = 0;
    this.chart = this.chartArray[this.chartIndex];
  }

  ngOnInit() {
    this._mapdataservice.currentChartSubject.subscribe({
      next: value => {
        this.chartIndex = <number>value;
        this.chart = this.chartArray[<number>value];
      }
    });
  }

  
}
