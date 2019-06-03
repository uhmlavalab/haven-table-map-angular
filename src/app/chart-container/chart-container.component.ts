import { Component, OnInit } from '@angular/core';
import { Chart } from '../interfaces/chart';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  constructor(private chartService: ChartService) {

  }

  ngOnInit() {

  }


}
