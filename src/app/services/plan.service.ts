import { Injectable } from '@angular/core';
import { _ } from 'underscore';

import { Plan } from '@app/interfaces/plan';

import { Plans } from '../../assets/plans/plans';
import { MapLayer, Scenario } from '@app/interfaces';
import { SoundsService } from './sounds.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private state: string;                  // Current state of the machine

  private plans: Plan[];
  private currentPlan: Plan;
  public planSubject = new Subject<Plan>();

  private scenarios: Scenario[];
  private currentScenario: Scenario;
  public scenarioSubject = new Subject<Scenario>();

  private currentYear: number;
  public yearSubject = new Subject<number>();

  constructor(private soundsService: SoundsService) {
    this.plans = Plans;
    this.state = 'landing';
  }

  setupSelectedPlan(plan: Plan) {
    this.currentPlan = plan;
    this.currentYear = this.currentPlan.minYear;
    this.scenarios = this.currentPlan.scenarios;
    this.currentScenario = this.scenarios[0];

    this.planSubject.next(this.currentPlan);
    this.yearSubject.next(this.currentYear);
    this.scenarioSubject.next(this.currentScenario);
  }

  getCurrentPlan(): Plan {
    return this.currentPlan;
  }

  getPlans(): Plan[] {
    return this.plans;
  }

  getCurrentYear(): number {
    return this.currentYear;
  }

  /** Adds 1 year to the current year
   * @return publish change
   */
  public incrementCurrentYear(): void {
    if (this.currentYear < this.currentPlan.maxYear) {
      this.currentYear++;
      this.soundsService.click();
    }
    this.yearSubject.next(this.currentYear);
  }

  /** Subtracts 1 from the current year
   * @return publish change
   */
  public decrementCurrentYear(): void {
    if (this.currentYear > this.currentPlan.minYear) {
      this.currentYear--;
      this.soundsService.click();
    }
    this.yearSubject.next(this.currentYear);
  }


  /** Sets the current year
   * @return publis the change
   */
  public setCurrentYear(year): void {
    if (year >= this.currentPlan.minYear && year <= this.currentPlan.maxYear) {
      this.currentYear = year;
    }
    this.yearSubject.next(this.currentYear);
  }


  /** Gets the currently selected Scenario
   * @return the current scenario
   */
  public getCurrentScenario(): Scenario {
    return this.currentScenario;
  }

  /** Gets the array of scenarios.
   * @return the array of scenarios
   */
  public getScenarios(): Scenario[] {
    return this.scenarios;
  }

  /** Cycles through the optional scenarios
 * publishes changes to all subscribers.
 */
  public incrementScenario(): void {
    const index = this.scenarios.indexOf(this.currentScenario) + 1;
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
  }

  /** Cycles through the optional scenarios
   * publishes changes to all subscribers.
   */
  public decrementScenario(): void {
    const index = this.scenarios.indexOf(this.currentScenario) - 1;
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
  }

  /** Sets the state of the machine
  * @param state => The new state
  */
  public setState(state): void {
    this.state = state;
  }

  /** Gets the state of the machine
  * @return the current state
  */
  public getState(): string {
    return this.state;
  }


}
