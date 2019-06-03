import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '@app/services/plan.service';

// import * as Chart from 'chart.js';
// import 'chartjs-plugin-datalabels';
// import 'chartjs-plugin-labels';

import { Scenario } from '@app/interfaces';

import { chartColors } from '../../assets/plans/defaultColors';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  @ViewChild('chartDiv', { static: true }) chartDiv: ElementRef;
  ctx: any;
  myChart: any;

  capacityData: any;
  generationData: any;
  scenario: Scenario;
  year: number;

  data: any;
  labels: any;
  chartMax: number;

  constructor(private planService: PlanService) {

  }

  ngOnInit() {
    this.planService.planSubject.subscribe(plan => {
      this.fetchData();
    });

    this.planService.scenarioSubject.subscribe(scenario => {
      this.scenario = scenario;
      this.updateScenario(scenario.name);
    });

    this.planService.yearSubject.subscribe(year => {
      this.year = year;
      this.updateYear(this.year);
    });

    this.scenario = this.planService.getCurrentScenario();
    this.year = this.planService.getCurrentYear();
    this.fetchData();
  }

  fetchData() {
    this.planService.getCapacityData().then(capData => {
      this.capacityData = capData;
      this.data = {};
      this.data.capacity = {};
      const valueArray = [];
      Object.keys(this.capacityData).forEach(scenario => {
        this.data.capacity[scenario] = {};
        this.data.capacity[scenario].labels = [];
        this.data.capacity[scenario].datasets = [];

        Object.keys(this.capacityData[scenario]).forEach(tech => {
          const dataset = {
            label: tech,
            backgroundColor: chartColors[tech],
            borderColor: chartColors[tech],
            pointRadius: 0,
            fill: false,
            data: [],
          };
          Object.keys(this.capacityData[scenario][tech]).forEach(el => {
            const year = this.capacityData[scenario][tech][el].year;
            const value = this.capacityData[scenario][tech][el].value;
            this.data.capacity[scenario].labels.push(year);
            dataset.data.push(value);
            valueArray.push(value);
          });
          this.data.capacity[scenario].datasets.push(dataset);
        });
        this.data.capacity[scenario].labels = [...new Set(this.data.capacity[scenario].labels)];
      });
      this.chartMax = Math.ceil(Math.max(...valueArray) / 100) * 100;
      this.createChart();
    });

  }

  createChart() {
    const labels = this.data.capacity[this.scenario.name].labels;
    const datasets = this.data.capacity[this.scenario.name].datasets;
    this.createLineChart(labels, datasets);
  }

  createLineChart(labels: any[], datasets: any[]) {
    this.ctx = this.chartDiv.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      options: {
        responsive: false,
        annotation: {
          annotations: [
            {
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: this.year,
              borderWidth: 3,
              borderColor: 'white',
              borderDash: [5, 5],
              label: {
                content: this.year,
                enabled: true,
                position: 'top'
              }
            }
          ]
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontStyle: 'bold',
            fontSize: 14
          }
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false,
              color: '#FFFFFF',
            },
            ticks: {
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: 'white',
            },
            scaleLabel: {
              display: true,
              fontSize: 18,
              fontStyle: 'bold',
              fontColor: '#FFFFFF',
              labelString: 'Year'
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: '#FFFFFF',
            },
            ticks: {
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: 'white',
              max: this.chartMax
            },
            scaleLabel: {
              display: true,
              fontSize: 18,
              fontStyle: 'bold',
              fontColor: '#FFFFFF',
              labelString: 'Capacity (MW)'
            }
          }]
        }
      },
      data: {
        labels,
        datasets
      },
    });
  }

  updateYear(year: number) {
    this.myChart.options.annotation.annotations[0].value = year;
    this.myChart.options.annotation.annotations[0].label.content = year;
    this.myChart.update();
  }

  updateScenario(scenarioName: string) {
    this.myChart.data.datasets = this.data.capacity[scenarioName].datasets;
    this.myChart.update();
  }


}

