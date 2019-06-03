import { Injectable } from '@angular/core';
import { Chart } from '@app/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {


  private currentChart: number;
  private charts: Chart[] = [];
  public chartSubject = new Subject<Chart>();

  constructor() { }

  /** Gets the currently selected chart
 * @return the current chart
 */
  public getCurrentChart(): Chart {
    return this.charts[this.currentChart];
  }

  /** Gets the array of charts.
   * @return the array of charts
   */
  public getCharts(): Chart[] {
    return this.charts;
  }

  /** Cycles through the various optional charts
 * publishes changes to all subscribers.
 */
  public incrementChart(): void {
    this.currentChart = (this.currentChart + 1) % this.charts.length;
    this.publishCurrentChart();
  }

  /** Cycles through the various optional charts
   * publishes changes to all subscribers.
   */
  public decrementChart(): void {
    if (this.currentChart === 0) {
      this.currentChart = this.charts.length - 1;
    } else {
      this.currentChart--;
    }
    this.publishCurrentChart();
  }

    /* Publishes the current Chart to display to all subscribers */
    private publishCurrentChart(): void {
      this.chartSubject.next(this.charts[this.currentChart]);
    }

}
