import { Component, OnInit, HostListener } from '@angular/core';
import { MapService } from '../services/map.service';
import { WindowRefService } from '../services/window-ref.service';
import { MultiWindowService, Message } from 'ngx-multi-window';
import { Router } from '@angular/router';
import { Plan } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';
import { _ } from 'underscore';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
 * And the display components of the table.
 */
export class MapMainComponent implements OnInit {

  plan: Plan;
  private top: string;
  private left: string;
  private width: string;
  private legendClass: string;

  constructor(
    private planService: PlanService,
    private mapService: MapService,
    private router: Router,
    private windowRefService: WindowRefService,
    private multiWindowService: MultiWindowService) {
      this.plan = this.planService.getCurrentPlan();
      this.legendClass = this.planService.getCurrentLegendLayout();

      // If no plan has been selected, route back to setup
      if (this.plan == null) {
        this.router.navigateByUrl('');
        this.planService.setState('landing');
        console.log('No Plan Found --> Route to setup');
      }

      this.top = this.plan.css.legend[this.legendClass].top;
      this.left = this.plan.css.legend[this.legendClass].left;
      this.width = this.plan.css.legend[this.legendClass].width;

  }

  ngOnInit() {

    this.planService.legendSubject.subscribe({
      next: value => {
        this.top = this.plan.css.legend[value].top;
        this.left = this.plan.css.legend[value].left;
        this.width = this.plan.css.legend[value].width;
      }
    });

    // Push Year Data to Second Screen
    this.planService.yearSubject.subscribe({
      next: value => {
        const recipient = _.filter(this.multiWindowService.getKnownWindows(), window => window.name === 'secondScreen');
        if (recipient.length === 1) {
            this.sendMessageToSecondScreen(recipient[0].id, JSON.stringify({year: value}));
        }
      }
    });

    // Push Year Data to Second Screen
    this.mapService.selectedLayerSubject.subscribe({
      next: value => {
        const recipient = _.filter(this.multiWindowService.getKnownWindows(), window => window.name === 'secondScreen');
        if (recipient.length === 1) {
            this.sendMessageToSecondScreen(recipient[0].id, JSON.stringify({layer: value}));
        }
      }
    });
  }

  private sendMessageToSecondScreen(screenId, messageData) {
      this.multiWindowService.sendMessage(screenId, 'customEvent', messageData).subscribe(
        (messageId: string) => {
          console.log('Message send, ID is ' + messageId);
        },
        (error) => {
          console.log('Message sending failed, error: ' + error);
        },
        () => {
          console.log('Message successfully delivered');
        });
  }
  /**
   * This function gets the css class name to apply to the legend based
   * on the map that is selected.
   * @return the name of the css class
   */
  private getIslandName(): string {
    return this.plan.name;
  }

  /* KEYBOARD CONTROLS */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.planService.incrementCurrentYear();
    } else if (event.key === 'ArrowLeft') {
      this.planService.decrementCurrentYear();
    } else if (event.key === 'ArrowUp') {
      this.mapService.incrementNextLayer();
    } else if (event.key === 'ArrowDown') {
      this.mapService.decrementNextLayer();
    } else if (event.key === 'Enter') {
      this.mapService.addRemoveLayer();
    } else if (event.key === 'p') {
      this.router.navigateByUrl('');
      this.planService.setState('landing');
      this.windowRefService.closeSecondScreen();
    } else if (event.key === 'r') {
      this.mapService.resetMap();
    } else if (event.key === 'a') {
      // this.chartService.incrementChart();
    } else if (event.key === 's') {
      // this.chartService.decrementChart();
    } else if (event.key === 'q') {
      this.planService.incrementScenario();
    } else if (event.key === 'w') {
      this.planService.decrementScenario();
    } else if (event.key === 'l') {
      this.planService.changeCurrentLegendLayout();
    }
  }
}
