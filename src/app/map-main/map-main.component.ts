import { Component, OnInit, HostListener } from '@angular/core';
import { MapService } from '../services/map.service';
import { WindowRefService } from '../services/window-ref.service';
import { Router } from '@angular/router';
import { Plan } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';
import { ChartService } from '@app/services/chart.service';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
* And the display components of the table. */
export class MapMainComponent implements OnInit {

  plan: Plan;

  constructor(
    private planService: PlanService,
    private mapService: MapService,
    private chartService: ChartService,
    private router: Router,
    private windowRefService: WindowRefService) {

    this.plan = this.planService.getCurrentPlan();
  }

  ngOnInit() {
  }

  /**
  * This function gets the css class name to apply to the legend based
  * on the map that is selected.
  * @return the name of the css class
  */
  getIslandName(): string {
    return this.plan.name;
  }

  /** KEYBOARD CONTROLS **/
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
    }
  }

  /** Handles the mouse down over elements on the screen.  These elements can be
   * dragged and dropped to different locations on the screen (at this point).
   */
  private handleMouseDown(target: any) {
    console.log(target);
  }
}
