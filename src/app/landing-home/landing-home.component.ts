import { Component, OnInit, ViewChildren } from '@angular/core';
import { MapSelectionDirectiveDirective } from './map-selection-directive.directive';
import { landingButtons } from '../../assets/defaultData/landingButtons';
import { panels } from '../../assets/defaultData/landingPanels';
import { Plan, Marker, Panel, LandingButton, MapLayer } from '@app/interfaces';
import { ArService } from '../services/ar.service';
import { PlanService } from '../services/plan.service';
import { WindowRefService } from '../services/window-ref.service';
import { MarkerService } from '@app/services/marker.service';
import { ProjectableMarker } from '../classes/projectableMarker';
import { TrackingPoint } from '../classes/trackingPoint';


@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.css']
})

/** This class represents the landing screen of the projectable project */
export class LandingHomeComponent implements OnInit {

  // Create an array of the children tagged with MapSelectionDirectiveDirective
  @ViewChildren(MapSelectionDirectiveDirective) slideDirective;

  private nativeWindow: any;
  private markers: ProjectableMarker[];
  private help: string;
  private changingMarkerJob: string;
  private activePanel: string;
  private panels: Panel;
  private plans: Plan[];
  private buttons: LandingButton;
  private loading: boolean;
  private settingMarkers: boolean;
  private liveMarkers: ProjectableMarker[] = [];
  private tempMarkerChange: { id: number, job: string };
  private markerIcons: { year: string, chart: string, scenario: string, layer: string, unassigned: string };
  private jobs: any[];
  private calibrating: boolean;
  private activeCalibrationMarker: number;
  private trackingPoints: TrackingPoint[] = [];
  private calibrationDetectedMarker: any;
  private numberOfCalibrationMarkers: number;
  private calibrationIndex: number;

  constructor(private arservice: ArService,
    private planService: PlanService,
    private windowRefservice: WindowRefService,
    private markerService: MarkerService) {
    this.activePanel = 'maps';
    this.buttons = landingButtons; // Imported from Default Data
    this.panels = panels; // Imported from default data
    this.nativeWindow = this.windowRefservice.getNativeWindow();
    this.help = 'keyboard';
    this.changingMarkerJob = 'none';
    this.loading = this.windowRefservice.getLoadingStatus();
    this.settingMarkers = false;
    this.tempMarkerChange = {
      id: -1,
      job: ''
    }
    this.markerIcons = {
      year: 'layers-01.png',
      chart: 'pie-01.png',
      layer: 'layers-01.png',
      scenario: 'scenario-01.png',
      unassigned: ''
    }
    this.jobs = this.setJobsArray();
    this.calibrating = false;
    this.numberOfCalibrationMarkers = 105;
    for (let i = 0; i < this.numberOfCalibrationMarkers; i++) {
      this.trackingPoints.push(new TrackingPoint());
    }
  }

  ngOnInit() {
    this.plans = this.planService.getPlans();

    this.windowRefservice.loadingSubject.subscribe({
      next: value => {
        this.loading = value;
      }
    });

    this.arservice.markerSubject.subscribe({
      next: value => {
        this.liveMarkers = value;
      }
    });

    this.arservice.calibrationSubject.subscribe({
      next: value => {
        this.calibrationDetected(value);
      }
    });
  }
  
  private startCalibration(): void {
    this.calibrating = true;
    this.arservice.startCalibration();
    this.calibrationIndex = 0;
    this.recursiveCalibrate(0);
  }

  private recursiveCalibrate(index: number) {
    console.log(index);
    if (index >= this.numberOfCalibrationMarkers) {
      return;
    } else {
      this.calibrationIndex = index;
      setTimeout(() => {
        this.calibrationIndex = -1;
      }, 300);
      setTimeout(() => {
        this.recursiveCalibrate(index + 1);
      }, 350);
    }

  }

  private calibrationDetected(marker: any) {
    this.trackingPoints[this.calibrationIndex].detect();
  }

  private setJobsArray(): any[] {
    const jobsList = ['year', 'layer', 'chart', 'scenario'];
    const resultsArray = [];
    jobsList.forEach(jobText => {
      const marker = ProjectableMarker.getProjectableMarkerByJob(jobText);
      const iconText = marker ? marker.icon : null;
      const id = marker ? marker.markerId : null;
      resultsArray.push({job: jobText, icon: this.markerIcons[jobText], markerId: id});
    });
    return resultsArray;
  }

  /**
   * This function handles the clicks on the start buttons.  When the button is
   * clicked, the state of the application is changed from setup to run.  The Data
   * necessary to start the program correctly is passed through here.
   * @param island => Contains the island that will be used for this program.
   * @return none
   */
  handleStartButtonClick(plan: Plan): void {
    this.plans.forEach(el => el.selectedPlan = false);
    plan.selectedPlan = true;
    this.arservice.killTick();
    this.planService.setupSelectedPlan(plan);
    this.planService.setState('run');
    if (plan.includeSecondScreen) {
      if (this.openSecondScreen()) {
        const planLayerData = [];
        plan.map.mapLayers.forEach(layer => planLayerData.push({
          name: layer.name,
          displayName: layer.displayName,
          iconPath: layer.iconPath
        }));

        this.startSecondScreen(plan);
      }
    }
  }

  private startSecondScreen(plan: Plan): void {
    if (this.windowRefservice.secondScreenExists()) {
      this.windowRefservice.notifySecondScreen(JSON.stringify(
        {
          type: 'setup',
          name: plan.name,
          currentYear: this.planService.getCurrentYear(),
        }));
    } else {
      setTimeout(() => {
        this.startSecondScreen(plan);
      }, 1000);
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
  private handleLayerSetupCheck(layer: MapLayer, checked: boolean): void {
    layer.included = checked;
  }

  /** Opens a second screen as long as there isnt one opened already.
   * @return true if scucessful, false if not opened
   */
  private openSecondScreen(): boolean {
    if (!(this.windowRefservice.secondScreenIsSet())) {
      this.windowRefservice.setSecondSceenObject(this.nativeWindow.open('second-screen', 'secondScreen'));
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

    const newId = this.tempMarkerChange.id;
    const newJob = this.tempMarkerChange.job;
    const markers = ProjectableMarker.getAllProjectableMarkers();

    if (ProjectableMarker.getProjectableMarkerByJob(newJob) === undefined) {
      markers[newId].setJob(newJob);
      markers[newId].setIcon(this.markerIcons[newJob]);
    } else {
      const oldMarker = ProjectableMarker.getProjectableMarkerByJob(newJob);
      const oldId = oldMarker.markerId;
      oldMarker.setJob('unassigned');
      oldMarker.setIcon(this.markerIcons['unassigned']);
      markers[newId].setJob(newJob);
      markers[newId].setIcon(this.markerIcons[newJob]);
    }
    this.changingMarkerJob = 'none';
    this.jobs = this.setJobsArray();
  }

  private handleCancelMarkerChange(): void {
    this.tempMarkerChange.id = -1;
    this.tempMarkerChange.job = '';
    this.changingMarkerJob = 'none';
  }

  private reassignMarker(job: string, id: number) {
    this.tempMarkerChange.id = id;
    this.tempMarkerChange.job = job;
  }
}