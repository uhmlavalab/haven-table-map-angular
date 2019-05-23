import { Component, OnInit, ViewChildren } from '@angular/core';
import { AppComponent } from '../app.component';
import { Panel } from '../interfaces/panel';
import { Island } from '../interfaces/island';
import { LandingButton } from '../interfaces/landing-button';
import { VideoFeeds } from '../interfaces/video-feeds';
import { MapSelectionDirectiveDirective } from './map-selection-directive.directive';
import { MapDataService } from '../services/map-data.service';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.css']
})

/** This class represents the landing screen of the projectable project */
export class LandingHomeComponent implements OnInit {

  // Create an array of the children tagged with MapSelectionDirectiveDirective
  @ViewChildren(MapSelectionDirectiveDirective) slideDirective;
  islands: Island[] = [];

  constructor(private _mapdataservice:MapDataService) { }

  ngOnInit() {
    this.islands = this._mapdataservice.getIslandData();
  }

  // Data for the setup Panels
  panels: Panel[] = [{
    name: 'start',
    active: true
  }, {
    name: 'cams',
    active: false
  }, {
    name: 'markers',
    active: false
  }, {
    name: 'layers',
    active: false
  }];

  // Initialize the active panel to the map selection boxes.
  activePanel: string = 'map-selector-container';

  // Data for the Setup Buttons
  buttons: LandingButton[] = [{
    text: 'Setup Cameras',
    id: 'cams'
  }, {
    text: 'Setup Markers',
    id: 'markers'
  }, {
    text: 'Setup Layers',
    id: 'layers'
  }];


  /**
  * This function handles the clicks on the start buttons.  When the button is
  * clicked, the state of the application is changed from setup to run.  The Data
  * necessary to start the program correctly is passed through here.
  * @param island => Contains the island that will be used for this program.
  * @return none
  */
  handleStartButtonClick(island: Island): void {
    island.selectedIsland = true;
    if (this._mapdataservice.setSelectedIsland()) {
      this._mapdataservice.setState('run');

    } else {
      // TODO: implement error handling
    }

  }

  /**
  * This function handles changes to the add 2nd screen checkbox.  Updates the variable
  * In the island object.
  * @param island => The island that will be used to start the program.
  * @param isChecked => true if checked, false if unchecked.
  * @return none
  */
  handleIncludeSecondScreenCheckboxChange(island:Island, isChecked): void {
    island.includeSecondScreen = isChecked;
  }

  /**
  * This function handles the clicks on the buttons that select which element
  * of the table to configure/setup.  It identifies which child element of the
  * directive slideDirective has been clicked and moves all elements accordingly.
  * @param targetElement => The element that was clicked.
  * @return void.
  */
  handleSelectButtonClick(targetElement: any): void {

    let targetId = null;

    switch (targetElement.id) {
      case 'cams':
        targetId = 'camera-selector-container';
        break;
      case 'markers':
        targetId = 'marker-selector-container';
        break;
      case 'layers':
        targetId = 'layer-selector-container';
        break;
      default:
        targetId = null;
        break;
    }

    // If nothing has changed.  Exit function with no changes.
    if (this.activePanel === targetId) {
      return;
    }

    // If there is a new active element, move panels accordingly.
    this.slideDirective.forEach((e) => {
      if (e.element.nativeElement.id === targetId) {
        e.elementalSlide(25, e.element.nativeElement);
      } else {
        e.elementalSlide(100, e.element.nativeElement);
      }
    });
  }

}
