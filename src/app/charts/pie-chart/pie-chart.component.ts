import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '@app/services/plan.service';

import { Scenario } from '@app/interfaces';

import { chartColors } from '../../../assets/plans/defaultColors';
import { createPipe } from '@angular/compiler/src/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @ViewChild('pieDiv', { static: true }) chartDiv: ElementRef;
  ctx: any;
  myChart: any;

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
      this.generationData = null;
      this.data = null;
      this.ctx = null;
      this.myChart = null;
      this.fetchData();
    });

    this.planService.scenarioSubject.subscribe(scenario => {
      this.scenario = scenario;
      this.updateScenario(this.scenario.name);
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
    this.planService.getGenerationData().then(genData => {

      this.generationData = genData;
      this.data = {};
      this.data.generation = {};

      Object.keys(this.generationData).forEach(scenario => {
        this.data.generation[scenario] = {
          data: {
            labels: [],
            datasets: [{
              label: 'Generation MWh',
              data: [],
              backgroundColor: [],
              borderColor: [],
              borderWidth: 4
            }]
          },
          yearlyData: {}
        };

        Object.keys(this.generationData[scenario]).forEach(tech => {

          this.data.generation[scenario].data.labels.push(tech);
          this.data.generation[scenario].data.datasets[0].backgroundColor.push(chartColors[tech]);
          this.data.generation[scenario].data.datasets[0].borderColor.push('rgba(255,255,255,1)');

          Object.keys(this.generationData[scenario][tech]).forEach(el => {
            const year = this.generationData[scenario][tech][el].year;
            const value = this.generationData[scenario][tech][el].value;
            if (!this.data.generation[scenario].yearlyData.hasOwnProperty(year)) {
              this.data.generation[scenario].yearlyData[year] = [];
            }
            this.data.generation[scenario].yearlyData[year].push(value);
          });
        });
      });
      this.createChart();
    });

  }

  createChart() {
    console.log(this.data);
    const data = this.data.generation[this.scenario.name].data;
    data.datasets[0].data = this.data.generation[this.scenario.name].yearlyData[this.year];
    this.createPieChart(data);
  }

  createPieChart(data: any) {
    this.ctx = this.chartDiv.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      options: {
        legend: {
          display: false,
          labels: {
            fontColor: 'white',
            fontStyle: 'bold',
            fontSize: 14,
          }
        },
        responsive: false,
        plugins: {
          labels: [{
            render: 'label',
            position: 'border',
            fontSize: 10,
            overlap: false,
            fontStyle: 'bold',
            fontColor: 'white'
          },
          {
            render: 'percentage',
            fontColor: 'white',
            fontSize: 8,
            fontStyle: 'bold',
            overlap: false,
          }]
        },
      },
      data
    });
  }

  updateYear(year: number) {
    const data = this.data.generation[this.scenario.name].data;
    data.datasets[0].data = this.data.generation[this.scenario.name].yearlyData[this.year];
    this.myChart.data = data;
    this.myChart.update();
  }

  updateScenario(scenarioName: string) {
    const data = this.data.generation[scenarioName].data;
    data.datasets[0].data = this.data.generation[scenarioName].yearlyData[this.year];
    this.myChart.data = data;
    this.myChart.update();
  }

}

