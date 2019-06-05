import { Injectable } from '@angular/core';
import { _ } from 'underscore';

import { Plan } from '@app/interfaces/plan';

import { Plans } from '../../assets/plans/plans';
import { Scenario } from '@app/interfaces';
import { SoundsService } from './sounds.service';
import { Subject } from 'rxjs';

import * as d3 from 'd3/d3.min';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private state: string;  // Current state of the machine

  private plans: Plan[];
  private currentPlan: Plan;
  public planSubject = new Subject<Plan>();

  private scenarios: Scenario[];
  private currentScenario: Scenario;
  public scenarioSubject = new Subject<Scenario>();

  private currentYear: number;
  public yearSubject = new Subject<number>();

  private capacityData = {};
  private generationData = {};

  constructor(private soundsService: SoundsService) {
    this.plans = Plans;
    this.state = 'landing';
  }

  public setupSelectedPlan(plan: Plan) {
    this.currentPlan = plan;
    this.currentYear = this.currentPlan.minYear;
    this.scenarios = this.currentPlan.scenarios;
    this.currentScenario = this.scenarios[0];
    this.planSubject.next(this.currentPlan);
    this.yearSubject.next(this.currentYear);
    this.scenarioSubject.next(this.currentScenario);
    this.getCapacityData();
    this.getCapacityData();
  }

  public getGenerationTotalForCurrentYear(technologies: string[]): number {
    let generationTotal = 0;
    technologies.forEach(tech => {
      this.generationData[this.currentScenario.name][tech].forEach(el => {
        if (el.year === this.currentYear) {
          generationTotal += el.value;
        }
      });
    });
    return generationTotal;
  }

  public getCapacityTotalForCurrentYear(technologies: string[]): number {
    let capacityTotal = 0;
    technologies.forEach(tech => {
      this.capacityData[this.currentScenario.name][tech].forEach(el => {
        if (el.year === this.currentYear) {
          capacityTotal += el.value;
        }
      });
    });
    return capacityTotal;
  }

  public getGenerationData(): Promise<any> {
    this.generationData = {};
    return new Promise((resolve, error) => {
      d3.csv(this.currentPlan.data.generationPath, (data) => {
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.generationData.hasOwnProperty(scenario)) {
            this.generationData[scenario] = {};
          }
          if (!this.generationData[scenario].hasOwnProperty(technology)) {
            this.generationData[scenario][technology] = [];
          }
          this.generationData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.generationData);
      });

    });

  }

  public getCapacityData(): Promise<any> {
    this.capacityData = {};
    return new Promise((resolve, error) => {
      this.capacityData = {};
      d3.csv(this.currentPlan.data.capacityPath, (data) => {
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.capacityData.hasOwnProperty(scenario)) {
            this.capacityData[scenario] = {};
          }
          if (!this.capacityData[scenario].hasOwnProperty(technology)) {
            this.capacityData[scenario][technology] = [];
          }
          this.capacityData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.capacityData);
      });
    });
  }



  public getCurrentPlan(): Plan {
    return this.currentPlan;
  }

  public getPlans(): Plan[] {
    return this.plans;
  }

  public getCurrentYear(): number {
    return this.currentYear;
  }

  public incrementCurrentYear(): void {
    if (this.currentYear < this.currentPlan.maxYear) {
      this.currentYear++;
      this.soundsService.click();
    }
    this.yearSubject.next(this.currentYear);
  }

  public decrementCurrentYear(): void {
    if (this.currentYear > this.currentPlan.minYear) {
      this.currentYear--;
      this.soundsService.click();
    }
    this.yearSubject.next(this.currentYear);
  }

  public setCurrentYear(year): void {
    if (year >= this.currentPlan.minYear && year <= this.currentPlan.maxYear) {
      this.currentYear = year;
    }
    this.yearSubject.next(this.currentYear);
  }

  public getCurrentScenario(): Scenario {
    return this.currentScenario;
  }

  public getScenarios(): Scenario[] {
    return this.scenarios;
  }

  public incrementScenario(): void {
    const index = this.scenarios.indexOf(this.currentScenario) + 1;
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
  }

  public decrementScenario(): void {
    let index = this.scenarios.indexOf(this.currentScenario) - 1;
    if (index === -1) {
      index = this.scenarios.length - 1;
    }
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
  }

  public setState(state): void {
    this.state = state;
    if (this.state === 'landing') {
      this.resetPlan();
    }
  }

  public getState(): string {
    return this.state;
  }

  public resetPlan() {
    this.currentPlan = null;
    this.currentYear = null;
    this.scenarios = null;
    this.currentScenario = null;
    this.planSubject.next(this.currentPlan);
    this.yearSubject.next(this.currentYear);
    this.scenarioSubject.next(this.currentScenario);
  }


}