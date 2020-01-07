import { Injectable } from '@angular/core';
import { Plans } from '../../assets/plans/plans';
import { Plan } from '@app/interfaces/plan';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  private plans: Plan[];
  private currentPlan: Plan;
  public yearSubject = new Subject<number>();

  constructor(private window: Window) { 
    this.plans = Plans;
  }

  public messageMap(msg): void {
    this.window.opener.localStorage.setItem('map-msg', JSON.stringify(msg));
  }

  public readMessage(): string {
    const message = this.window.opener.localStorage.getItem('ui-msg');
    return message;
 }

  public clearMessages(): void {
    const msg = {
      type: 'none',
      data: 'none',
      newMsg: 'false'
    };
    this.window.localStorage.setItem('ui-msg', JSON.stringify(msg));
  }

  public setCurrentPlan(planName: string): Plan {
    this.plans.forEach(plan => {
      if (plan.name === planName) {
        this.currentPlan = plan;
      }
    });

    return this.currentPlan;
  }

  public incrementYear() {
    const msg = {
      type: 'change year',
      data: 'increment',
      newMsg: 'true'
    }
    this.messageMap(msg);
  }

  public decrementYear() {
    const msg = {
      type: 'change year',
      data: 'decrement',
      newMsg: 'true'
    }
    this.messageMap(msg);
  }

  public changeYear(percent: number) {
    const max = this.currentPlan.maxYear;
    const min = this.currentPlan.minYear;
    const totalYears = max - min + 1;
    const currentNumber = Math.trunc(Math.round(totalYears * percent + min));
    this.yearSubject.next(currentNumber);
    const msg = {
      type: 'change year',
      data: currentNumber, 
      newMsg: 'true'
    }
    this.messageMap(msg);
  }
}
