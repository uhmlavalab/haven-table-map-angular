import { Injectable } from '@angular/core';
import { Plans } from '../../assets/plans/plans';
import { Plan } from '@app/interfaces/plan';
import { Subject } from 'rxjs';
import { PlanService } from './plan.service';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  private plans: Plan[];
  private currentPlan: Plan;
  public scenarioListSubject = new Subject<any[]>();

  constructor(private window: Window, private planService: PlanService) { 
    this.planService.setMain(false); // Let this plan service know that it is not the main map service.
    this.plans = Plans; // All Plans
  }

  /** Sends a message to the local storage to be read by the map window.
   * @param msg The message to send.  JSON Object.
   */
  public messageMap(msg): void {
    this.window.opener.localStorage.setItem('map-msg', JSON.stringify(msg));
  }

  /** Reads a message from the local storage.  This message came from another window.
   * @return The message in string form.  Must be parsed to be used.
   */
  public readMessage(): string {
    const message = this.window.opener.localStorage.getItem('ui-msg');
    return message;
 }

 /** Clears the messages on the local storage after it is ready by THIS window.
  * It is cleared by setting type and data to none, and newMsg is set to false.
  */
  public clearMessages(): void {
    const msg = {
      type: 'none',
      data: 'none',
      newMsg: 'false'
    };
    this.window.localStorage.setItem('ui-msg', JSON.stringify(msg));
  }

  /** Sets the current plan.  This is called when reading a message.  All Plans
   * are already in this service but they need to be set.
   */
  public setCurrentPlan(planName: string): Plan {
    this.plans.forEach(plan => {
      if (plan.name === planName) {
        this.currentPlan = plan;
      }
    });
    return this.currentPlan;
  }

  /** Increments the year on the map. */
  public incrementYear() {
    const year = this.planService.incrementCurrentYear();
    this.notifyMap('change year', year);
  }

  /** Decrements current Year and notifies the map of the change */
  public decrementYear() {
    const year = this.planService.decrementCurrentYear();
    this.notifyMap('change year', year);
  }

  /** Changes year based on the data passed by the slider.  This is the percent
   * distance from the left side of the slider.
   * @param percent the percent distance from the left side of the slider component.
   */
  public changeYear(percent: number) {
    const max = this.currentPlan.maxYear;
    const min = this.currentPlan.minYear;
    const totalYears = max - min + 1;
    const currentNumber = Math.trunc(Math.round(totalYears * percent + min));
    const year = this.planService.setCurrentYear(currentNumber);
    this.notifyMap('change year', year);
  }

  /** The scrollable menu passes data and type to this function and the UI and Map
   * are notified of the change.
   * @param type the type of change
   * @param data the value of the change.
   */
  public handleMenuChange(type: string, data: any): void {
    if (type === 'year') {
      this.setYear(data);
    } else if (type === 'scenario') {
      const val = this.planService.getScenarioNameFromDisplayName(data);
      console.log(val);
      this.changeScenario(val);
    }
  }

  public setYear(year: number): void {
    this.notifyMap('change year', year);
    this.planService.setCurrentYear(year);
  }

  /** Changes the scenario when a scenario button is clicked.
   * @param scenarioName The name of the new scenario.
   */
  public changeScenario(scenarioName: string) {
    this.planService.setScenario(scenarioName);
    this.notifyMap('change scenario', scenarioName);
  }

  /** Sends a message to the map.
   * @param idString A string that tells the map what the data will be.
   * @param data the actual data.
   */
  private notifyMap(idString: string, data: any): void {
    const msg = {
      type: idString,
      data: data, 
      newMsg: 'true'
    }
    this.messageMap(msg);
  }
}
