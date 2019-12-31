import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Plan } from '@app/interfaces/plan';
import { Plans } from '../../assets/plans/plans';

@Injectable({
  providedIn: 'root'
})
export class TouchService {

  // Constants //
  private POINT_HISTORY_MAX: number;
  private MIN_CLUSTER_SIZE: number;
  private MAX_CLUSTER_SIZE: number;
  private CLUSTER_RADIUS: number;
  private CLICK_MAX: number;
  private MIN_DRAG_TIME: number;
  private PIXEL_MOVEMENT_THRESHOLD: number;
  private THROW_THRESHOLD: number;

  private clusterKey: number; // Holds the current key value.

  public testSubject = new Subject<string>();     // Plan Publisher
  private uiWindow: Window;
  private plans: Plan[];
  private currentPlan: Plan;

  constructor(private window: Window) {
    this.plans = Plans;
    this.POINT_HISTORY_MAX = 5;
    this.MIN_CLUSTER_SIZE = 1;
    this.MAX_CLUSTER_SIZE = 16;
    this.CLUSTER_RADIUS = 600;
    this.CLICK_MAX = 200;
    this.MIN_DRAG_TIME = 20;
    this.PIXEL_MOVEMENT_THRESHOLD = 6;
    this.THROW_THRESHOLD = 120;
    this.clusterKey = 0;
  }

  public setCurrentPlan(planName: string): Plan {
    this.plans.forEach(plan => {
      if (plan.name === planName) {
        this.currentPlan = plan;
      }
    });
    return this.currentPlan;
  }

  public openUIWindow(): void {
    this.uiWindow = this.window.open('/heco-main/touch-ui', 'touch-ui');
  }

  public readMessage(): string {
     const message = this.uiWindow.localStorage.getItem('map-msg');
     return message;
  }

  public messageUI(msg): void {
    this.uiWindow.localStorage.setItem('ui-msg', JSON.stringify(msg));
  }

  public clearMessages(): void {
    this.window.localStorage.clear();
  }

  /** Takes any array of any size and will trim it
   * to the desired length.
   * @param array the array to trim.
   * @param size the new length of the array.
   * @return the trimmed array.
   */
  public trimArray(array: any[], size: number): any[] {
    while (array.length > size) {
      array.pop();
    }
    return array;
  }

  // GETTERS  and SETTERS //
  public getPointHistoryMax(): number {
    return this.POINT_HISTORY_MAX;
  }

  public getMaxClusterSize(): number {
    return this.MAX_CLUSTER_SIZE;
  }

  public getMinClusterSize(): number {
    return this.MIN_CLUSTER_SIZE;
  }

  public getClusterRadius(): number {
    return this.CLUSTER_RADIUS;
  }

  public getClickMax(): number {
    return this.CLICK_MAX;
  }

  public getMinDragTime(): number {
    return this.MIN_DRAG_TIME;
  }

  public getPixelMovementThreshold(): number {
    return this.PIXEL_MOVEMENT_THRESHOLD;
  }

  public getThrowThreshold(): number {
    return this.THROW_THRESHOLD;
  }

  /** This method is called when a new cluster is created.
   * The clusterKey is incremented and returned.
   * @return unique key for a cluster.
   */
  public createNewClusterKey(): number {
    this.clusterKey++;
    return this.clusterKey;
  }
}
