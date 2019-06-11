import { Injectable, ɵbypassSanitizationTrustStyle } from '@angular/core';
import { PlanService } from './plan.service';
import { MultiWindowService } from 'ngx-multi-window';
import { _ } from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  private secondScreenObject: any; // Stores the object of the second window
  private secondScreenSet: boolean; // True if the screen his open, false if not.

  constructor(private planService: PlanService, private multiWindowService: MultiWindowService) {
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

  /** This function recieves the message.  Can be called from anywhere.  Forwards message
   * to the second screen.
   * @param message => the json object string
   * @return true if successful, false if failed.
   */
  public notifySecondScreen(message: string): boolean {
    try {
      this.sendMessageToSecondScreen(this.getSecondScreenId(), message);
      return true;
    } catch (error) {
      return false;
    }
  }
  /** Searches through the known windows and finds the second screen window.
   * @return the id of the window
   */
  private getSecondScreenId(): string {
    const recipient = _.filter(this.multiWindowService.getKnownWindows(), window => window.name === 'secondScreen');

    return recipient[0].id;
  }

  /** Sends data to the second screen component when changes are made to the main application
   * @param screenId => The multi window screen id of second screen
   * @param messageData => The data
   */
  private sendMessageToSecondScreen(screenId, messageData): void {
    this.multiWindowService.sendMessage(screenId, 'customEvent', messageData).subscribe(
      (messageId: string) => {
        console.log('Message send, ID is ' + messageId);
      },
      (error) => {
        console.log('Message sending failed, error: ' + error);
        this.sendMessageToSecondScreen(screenId, messageData);
      },
      () => {
        console.log('Message successfully delivered');
      });
  }

}
