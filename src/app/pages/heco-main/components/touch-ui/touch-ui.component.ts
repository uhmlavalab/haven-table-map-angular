import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '@app/services/plan.service';
import { Plan } from '@app/interfaces/plan';
import { UiServiceService } from '@app/services/ui-service.service';

@Component({
  selector: 'app-touch-ui',
  templateUrl: './touch-ui.component.html',
  styleUrls: ['./touch-ui.component.css']
})
export class TouchUiComponent implements AfterViewInit {

  @ViewChild('year', {static: false, read: ElementRef}) yearElement: ElementRef;

  private test: string;
  private layers: any;
  private messageCheckInterval: any;
  private year: number;

  constructor(private uiService: UiServiceService,
    private planService: PlanService,
    private window: Window) {
    this.test = 'testing';
    this.year = 9999;
  }

  ngAfterViewInit() {
    this.setYearHeight();
    // Checks for new messages on a selected time interval.  The faster the interval, less lag between windows.
    this.messageCheckInterval = setInterval(() => {
      try {
        this.reviewMessage(this.uiService.readMessage());
      } catch (err) {
        console.log('Failed to revieve a new message');
      }
    }, 20);

    this.uiService.yearSubject.subscribe({
      next: value => {
        this.year = value;
      }
    });
  }

  /** When a new message is received by a component, it is decoded here
   * @param msg the message that was received.  It is a string is must be parsed to
   * JSON format.
   */
  private reviewMessage(msg: string): void {
    const data = JSON.parse(msg);
    // If there is a new message, the newMsg value will be true.  Otherwise it is 'false'.
    if (data.newMsg = 'true') {
      if (data.type === 'plan') {  // Only called when the map is changed.
        this.setupUI(this.uiService.setCurrentPlan(data.data));
      } else if (data.type === 'year') {
        this.year = data.data;
      }
      this.uiService.clearMessages(); // Always set newMsg to 'false' after reading it.
    }
  }

  private setupUI(plan: Plan): void {
    this.test = plan.displayName;
    this.layers = plan.map.mapLayers;
  }

  private setYearHeight(): void {
    this.yearElement.nativeElement.style.height =`${this.yearElement.nativeElement.getBoundingClientRect().width}px`;
  }

}