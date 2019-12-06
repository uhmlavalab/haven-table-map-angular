import { Component, OnInit } from '@angular/core';
import { Plan } from '@app/interfaces/plan';
import { PlanService } from '@app/services/plan.service';
import { ContentDeliveryService } from '@app/services/content-delivery.service';
import { WindowRefService } from '@app/services/window-ref.service';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements OnInit {

  private plans: Plan[];                        // Array of all possible Plans
  
  constructor(private contentDeliveryService: ContentDeliveryService,
    private planService: PlanService,
    private windowRefservice: WindowRefService) {
    this.plans = this.contentDeliveryService.getPlans();  // Initialize the plans. 
  }

  ngOnInit() {
  }

  /**
   * This function handles the clicks on the start buttons.  When the button is
   * clicked, the state of the application is changed from setup to run.  The Data
   * necessary to start the program correctly is passed through here.
   * @param island => Contains the island that will be used for this program.
   */
  handleStartButtonClick(plan: Plan): void {
    const curYear = this.planService.startTheMap(plan);
    if (plan.includeSecondScreen) {
      if (this.windowRefservice.openSecondScreen()) {
        const planLayerData = [];
        plan.map.mapLayers.forEach(layer => planLayerData.push({
          name: layer.name,
          displayName: layer.displayName,
          iconPath: layer.iconPath
        }));
        this.windowRefservice.startSecondScreen(plan, curYear);
      }
    }
  }


  /**
   * This function handles changes to the add 2nd screen checkbox.  Updates the variable
   * In the island object.
   * @param island => The island that will be used to start the program.
   * @param isChecked => true if checked, false if unchecked.
   */
  private handleIncludeSecondScreenCheckboxChange(island: Plan, isChecked: boolean): void {
    island.includeSecondScreen = isChecked;
  }


}
