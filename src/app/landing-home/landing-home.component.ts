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
import { ArService } from '../services/ar.service';
import { WindowRefService } from '../services/window-ref.service';
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
  private islands: Island[] = [];
  private activePanel: string;
  private markers: Marker[] = [];
  private layers: Layer[] = [];
  private buttons: LandingButton[] = [];
  private panels: Panel[];
  private nativeWindow: any;
  private help: string;
  private changingMarkerJob: string;

  constructor(private _arservice: ArService, private _mapdataservice: MapDataService, private _windowrefservice: WindowRefService) {
    this.activePanel = 'maps';
    this.markers = this._mapdataservice.getMarkers();
    this.layers = this._mapdataservice.getLayers();
    this.buttons = landingButtons; // Imported from Default Data
    this.panels = panels; // Imported from default data
    this.nativeWindow = this._windowrefservice.getNativeWindow();
    this.help = 'keyboard';
    this.changingMarkerJob = 'none';
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
    this._arservice.killTick();
    if (this._mapdataservice.setSelectedIsland()) {
      this._mapdataservice.setupSelectedIsland();
      this._mapdataservice.setState('run');
      if (island.includeSecondScreen) {
        this.openSecondScreen();
      }
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
  private handleIncludeSecondScreenCheckboxChange(island: Island, isChecked: boolean): void {
    island.secondScreenCheck = isChecked ? 'checked' : '';
    island.includeSecondScreen = isChecked;
  }

  /**
  * This function handles the clicks on the buttons that select which element
  * of the table to configure/setup.  It identifies which child element of the
  * directive slideDirective has been clicked and moves all elements accordingly.
  * @param targetElement => The element that was clicked.
  */
  private handleSelectButtonClick(targetElement: any): void {
    this.activePanel = targetElement.id;
  }

  /**
  * This function adds and removes layers during setup when the checkbox is changed.
  * @param layer => the layer that was changed.
  * @param checked => true if checked, false if not checked.
  */
  private handleLayerSetupCheck(layer: Layer, checked: boolean): void {
    layer.included = checked;
    layer.checked = checked ? 'checked' : '';
    checked ? this._mapdataservice.addIncludedLayer(layer) : this._mapdataservice.removeIncludedLayer(layer);
  }

  /** Opens a second screen as long as there isnt one opened already.
  * @return true if scucessful, false if not opened
  */
  private openSecondScreen(): boolean {
    if (!(this._windowrefservice.secondScreenIsSet())) {
      this._windowrefservice.setSecondSceenObject(this.nativeWindow.open('second-screen'));
      return true;
    } else {
      return false;
    }
  }

  /**
   * This function is called when user clicks on one of the help navigation buttons.  It changes the
   * class of the button that was clicked to active, reverts the previous to normal and swaps the view of
   * the content container.
   * @param event => The mouseclick event.
   * @param tag => The string that identifies the button that was clicked.
   */
  private handleHelpNavClick(event: any, tag: string): void {
    this.help = tag;
  }

  /**
   * This function is called when user clicks on change a marker during setup.  The user will be shown a
   * list of active markers and they can choose from those markers and assign it to this job.
   * @param event => The click event
   * @param tag => The job that is being changed.
   */
  private handleChangeMarker(event: any, tag: string): void {
    this.changingMarkerJob = tag;
  }

  /**
   * Confirms changes made to the markers.
   * @param event => The click event
   * @param tag => The job tag
   */
  private handleConfirmMarkerChange(event: any, tag: string): void {
    this.changingMarkerJob = 'none';
  }
}
