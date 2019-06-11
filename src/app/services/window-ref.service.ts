import { Injectable } from '@angular/core';
import { PlanService } from './plan.service';

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  private secondScreenObject: any; // Stores the object of the second window
  private secondScreenSet: boolean; // True if the screen his open, false if not.

  constructor(private planService: PlanService) {
    this.secondScreenObject = null;
    this.secondScreenSet = false;
  }

  getNativeWindow() {
    return window;
  }

  /** This function sets the object for a second screen.
   * @param object => The second screen object
   */
  public setSecondSceenObject(object: any): void {
    this.secondScreenSet = true;
    this.secondScreenObject = object;
  }

  /** Checks to see if the second screen has already been created.
   * @return true if set, false if not
   */
  public secondScreenIsSet(): boolean {
    return this.secondScreenSet;
  }

  /** Closes the second screen
   */
  public closeSecondScreen(): void {
    if (this.secondScreenIsSet) {
      this.secondScreenSet = false;
      this.secondScreenObject.close();
    }
  }

}
