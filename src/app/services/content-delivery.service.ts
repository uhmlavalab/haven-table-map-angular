import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { landingButtons } from '../../assets/defaultData/content/landingButtons.js';
import { Plans } from '../../assets/plans/plans';
import { Plan } from '@app/interfaces/plan.js';
import { helpButtons, keyboardControls } from '../../assets/defaultData/content/helpContent.js';

@Injectable({
  providedIn: 'root'
})
export class ContentDeliveryService {

  // Content Delivery Publishers
  public landingRouteSubject = new Subject<any>(); // Determines which content is displayed
  constructor() { }

  /** Returns content for the landing buttons */
  getLandingButtonContent(): any {
    return landingButtons;
  }

  routeLanding(route): void {
    this.landingRouteSubject.next(route);  // Publish route to display
  }
  
  /** Gets all plans
   * @return array of all plans
   */
  public getPlans(): Plan[] {
    return Plans;
  }

  public getKeyboardControls(): any {
    return keyboardControls;
  }

  public getHelpButtons(): any {
    return helpButtons;
  }
}
