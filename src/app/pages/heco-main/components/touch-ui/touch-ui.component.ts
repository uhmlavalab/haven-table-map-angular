import { Component, AfterViewInit } from '@angular/core';
import { TouchService } from '@app/services/touch.service';
import { PlanService } from '@app/services/plan.service';
import { Plan } from '@app/interfaces/plan';

@Component({
  selector: 'app-touch-ui',
  templateUrl: './touch-ui.component.html',
  styleUrls: ['./touch-ui.component.css']
})
export class TouchUiComponent implements AfterViewInit {

  private test: string;
  private layers: any;
  private messageCheckInterval: any;

  constructor(private touchService: TouchService,
    private planService: PlanService,
    private window: Window) {
    this.test = 'testing';

  }

  ngAfterViewInit() {
    this.messageCheckInterval = setInterval(() => {
      try {
        this.reviewMessage(this.window.opener.localStorage.getItem('ui-msg'));
      } catch(err) {
        console.log('Failed to revieve a new message');
      }
    }, 500);
  }

  private reviewMessage(msg): void {
    const data = JSON.parse(msg);
    //this.window.opener.localStorage.clear();

    if (data.type === 'plan') {
      this.setupUI(this.touchService.setCurrentPlan(data.data));
    }
  }

  private setupUI(plan: Plan): void {
    this.test = plan.displayName;
    this.layers = plan.map.mapLayers;
  } 
}
