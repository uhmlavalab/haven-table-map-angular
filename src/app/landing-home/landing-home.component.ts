import { Component, OnInit, ViewChildren } from '@angular/core';
import { AppComponent } from '../app.component';
import { Panel } from '../interfaces/panel';
import { Island } from '../interfaces/island';
import { LandingButton } from '../interfaces/landing-button';
import { Marker } from '../interfaces/marker';
import { Layer } from '../interfaces/layer';
import { VideoFeeds } from '../interfaces/video-feeds';
import { MapSelectionDirectiveDirective } from './map-selection-directive.directive';
import { MapDataService } from '../services/map-data.service';
import { landingButtons } from '../../assets/defaultData/landingButtons';
import { panels } from '../../assets/defaultData/landingPanels';

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
  activePanel: string;
  markers: Marker[] = [];
  layers: Layer[] = [];
  buttons: LandingButton[] = [];
  panels: Panel[];

  constructor(private _mapdataservice: MapDataService) {
    this.activePanel = 'maps';
    this.markers = this._mapdataservice.getMarkers();
    this.layers = this._mapdataservice.getLayers();
    this.buttons = landingButtons; // Imported from Default Data
    this.panels = panels; // Imported from default data
  }

  ngOnInit() {
    this.islands = this._mapdataservice.getIslandData();
  }

  /**
  * This function handles the clicks on the start buttons.  When the button is
  * clicked, the state of the application is changed from setup to run.  The Data
  * necessary to start the program correctly is passed through here.
  * @param island => Contains the island that will be used for this program.
  * @return none
  */
  handleStartButtonClick(island: Island): void {
    this.islands.forEach(island => island.selectedIsland = false);
    island.selectedIsland = true;
    if (this._mapdataservice.setSelectedIsland()) {
      this._mapdataservice.setupSelectedIsland();
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
  */
  handleIncludeSecondScreenCheckboxChange(island: Island, isChecked: boolean): void {
    island.includeSecondScreen = isChecked;
  }

  /**
  * This function handles the clicks on the buttons that select which element
  * of the table to configure/setup.  It identifies which child element of the
  * directive slideDirective has been clicked and moves all elements accordingly.
  * @param targetElement => The element that was clicked.
  */
  handleSelectButtonClick(targetElement: any): void {
    this.activePanel = targetElement.id;
  }

  /**
  * This function adds and removes layers during setup when the checkbox is changed.
  * @param layer => the layer that was changed.
  * @param checked => true if checked, false if not checked.
  */
  handleLayerSetupCheck(layer: Layer, checked: boolean):void {
    layer.included = checked;
    checked ? this._mapdataservice.addIncludedLayer(layer) : this._mapdataservice.removeIncludedLayer(layer);
  }
}
