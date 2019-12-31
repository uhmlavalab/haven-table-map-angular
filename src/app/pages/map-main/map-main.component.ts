import { Component, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { WindowRefService } from '../../services/window-ref.service';
import { ArService } from '../../services/ar.service';
import { Router } from '@angular/router';
import { Plan } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';
import { ProjectableMarker } from '@app/classes/projectableMarker';
import { ContentDeliveryService } from '@app/services/content-delivery.service';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
 * And the display components of the table.
 */
export class MapMainComponent implements AfterViewInit {

  /* HTML elements that are projected onto the pucks */
  @ViewChild('trackingDotYear', { static: false }) trackingDotYear;
  @ViewChild('trackingDotLayer', { static: false }) trackingDotLayer;
  @ViewChild('trackingDotScenario', { static: false }) trackingDotScenario;
  @ViewChild('trackingDotAdd', { static: false }) trackingDotAdd;
  @ViewChild('connectingLine', { static: false }) connectingLine; // The line that connects the Layer and Add pucks.
  @ViewChild('legend', { static: false, read: ElementRef }) legend; // The legend element
  @ViewChild('map', {static:false, read: ElementRef}) mapElement; // The custom Map component.
  @ViewChild('pieChart', {static:false, read: ElementRef}) pieChart; // The custom Map component.
  @ViewChild('lineChart', {static:false, read: ElementRef}) lineChart; // The custom Map component.
  private plan: Plan;                   // The current Plan

  /* Tracking Puck and other Data Related Variables */
  private trackingDots: any[] = [];     // Holds the view children
  private currentYear: number;          // Current Year
  private nextLayer: string;            // The next layer that will be added or removed.
  private addColor: string;             // What color is the next layer associated with.
  private currentScenario: string;      // Current scenario.

  constructor(
    private planService: PlanService,
    private arService: ArService,
    private router: Router,
    private windowRefService: WindowRefService, 
    private contentDeliveryService: ContentDeliveryService) {

    this.plan = this.planService.getCurrentPlan();

    // if the plan is undefined, then the application will go back to the landing page.
    try {
      this.currentYear = this.planService.getMinimumYear();
      this.addColor = this.planService.getSelectedLayer().legendColor;
      this.currentScenario = this.planService.getCurrentScenario().displayName;
    } catch (error) {
      this.router.navigateByUrl('');
      this.planService.setState('landing');
      console.log('No Plan Found --> Route to setup');
    } finally {
      
    }
  }

  ngAfterViewInit() {
    this.positionLegend();
    this.positionMap();
    this.positionLineChart();
    this.positionPieChart();
    this.trackingDots = [this.trackingDotYear, this.trackingDotLayer, this.trackingDotScenario, this.trackingDotAdd];

    // Push Year Data to Second Screen
    this.planService.yearSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'year',
            year: value
          }));
        this.currentYear = value;
      }
    });

    // Push Year Data to Second Screen
    this.planService.selectedLayerSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'layer',
            name: value.name
          }));
        this.nextLayer = value.displayName;
        this.addColor = value.legendColor;
        this.connectLayerAndAdd(this.trackingDotLayer.nativeElement, this.trackingDotAdd.nativeElement);
      }
    });

    this.arService.trackingSubject.subscribe({
      next: value => {
        this.trackingDots.forEach(dot => dot.nativeElement.style.opacity = 0);
        value.forEach(marker => this.track(marker));
      }
    });

    this.planService.scenarioSubject.subscribe(scenario => this.currentScenario = scenario.displayName);
  }

  /** Tracks the marker on the table
   * @param marker The marker to be tracked.
   */
  private track(marker: ProjectableMarker) {

    try {

      const dataPoint = { x: null, y: null };
      dataPoint.x = marker.getMostRecentCenterX();
      dataPoint.y = marker.getMostRecentCenterY();

      let element = null;

      if (dataPoint.x !== null) {
        switch (marker.getJob()) {
          case 'year':
            element = this.trackingDotYear.nativeElement;
            break;
          case 'layer':
            element = this.trackingDotLayer.nativeElement;
            break;
          case 'scenario':
            element = this.trackingDotScenario.nativeElement;
            break;
          case 'add':
            element = this.trackingDotAdd.nativeElement;
            break;
        }
        element.style.opacity = 1;
        element.style.left = dataPoint.x + 25 + 'px';
        element.style.top = dataPoint.y + 25 + 'px';

      }

    } catch (error) {
      //undefined marker
      console.log(error);
    }
  }

  /** Draws a line between the layer puck element and the add puck element.
   * Both of the pucks have to be detected and live for the line to be drawn.
   * @param layer the native element of the layer puck
   * @param add the native element of the add puck.
   */
  private connectLayerAndAdd(layer, add) {

    const layerMarker = ProjectableMarker.getProjectableMarkerByJob('layer');
    const addMarker = ProjectableMarker.getProjectableMarkerByJob('add');

    const layerRect = layer.getBoundingClientRect();
    const xOffset = layerRect.width / 2;
    const yOffset = layerRect.height / 2;

    const layerPosition = { x: layerMarker.getMostRecentCenterX(), y: layerMarker.getMostRecentCenterY() };
    const addPosition = { x: addMarker.getMostRecentCenterX(), y: addMarker.getMostRecentCenterY() };

    if (layerPosition.x === null || addPosition.x === null) {
      this.connectingLine.nativeElement.style.opacity = 0;
    } else {
      const adjacent = this.contentDeliveryService.getAdjacent(addPosition.x, layerPosition.x);
      const opposite = this.contentDeliveryService.getOpposite(addPosition.y, layerPosition.y);
      const hypotenuse = this.contentDeliveryService.getHypotenuse(adjacent, opposite); // This is the width of the div
      let theta = this.contentDeliveryService.getTheta(opposite, adjacent);
      theta = this.contentDeliveryService.convertRadsToDegrees(theta);
      const quadrant = this.contentDeliveryService.getQuadrant(addPosition.x - layerPosition.x, addPosition.y - layerPosition.y);
      theta = this.contentDeliveryService.adjustTheta(theta, quadrant);
      this.moveLine(this.connectingLine.nativeElement, theta, hypotenuse, layerPosition.x + xOffset + 25, layerPosition.y + 25);
    }
  }

  /** Moves the line that connects the layer select and activate pucks.
   * @param element The line element
   * @param theta The theta angle of the triangle.
   * @param width the length of the line (width of the triangle)
   * @param x starting point x position
   * @param y starting point y position
   */
  private moveLine(element, theta, width, x, y) {
    element.style.opacity = 1;
    element.style.width = `${width}px`;
    element.style.left = `${x + 15}px`;
    element.style.top = `${y}px`;
    element.style.transform = `rotate(-${theta}deg)`;
    element.style.backgroundColor = this.planService.getSelectedLayer().legendColor;
    setTimeout(() => {
      element.style.opacity = 0;
    }, 500);
  }

  


  /**
   * This function gets the css class name to apply to the legend based
   * on the map that is selected.
   * @return the name of the css class
   */
  private getIslandName(): string {
    return this.plan.name;
  }

  /** These functions apply styles from the PLAN */
  private positionLegend(): void {
    // Select legend element from viewchild.
    const e = this.legend.nativeElement;
    // Get styles from the plan
    const styles = this.planService.getCss();
    const layout = styles.legend.defaultLayout;
    // Apply selected styles to the legend element.
    e.style.left = styles.legend[layout].left;
    e.style.top = styles.legend[layout].top;
    e.style.width = styles.legend[layout].width;
    e.style.display = styles.legend.display;
  }

  private positionMap(): void {
    //Select map element from viewchild
    const e = this.mapElement.nativeElement;
    // Get styles from the plan service.
    const styles = this.planService.getCss();
    e.style.left = styles.map.left;
    e.style.top = styles.map.top;
  }

  private positionLineChart(): void {
    //Select map element from viewchild
    const e = this.lineChart.nativeElement;
    // Get styles from the plan service.
    const styles = this.planService.getCss();
    e.style.left = styles.charts.line.left;
    e.style.top = styles.charts.line.top;
  }

  private positionPieChart(): void {
    //Select map element from viewchild
    const e = this.pieChart.nativeElement;
    // Get styles from the plan service.
    const styles = this.planService.getCss();
    e.style.left = styles.charts.pie.left;
    e.style.top = styles.charts.pie.top;
  }

  // KEYBOARD CONTROLS
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      if (event.shiftKey) {
        this.arService.incrementYOffset2();
      } else {
        this.arService.incrementYOffset();
      }
    } else if (event.key === 'ArrowDown') {
      if (event.shiftKey) {
        this.arService.decrementYOffset2();
      } else {
        this.arService.decrementYOffset();
      }
    } else if (event.key === 'ArrowLeft') {
      if (event.shiftKey) {
        this.arService.incrementXOffset2();
      }
      else {
        this.arService.incrementXOffset();
      }
    } else if (event.key === 'ArrowRight') {
      if (event.shiftKey) {
        this.arService.decrementXOffset2();
      } else {
        this.arService.decrementXOffset();
      }
    } else if (event.key === 'l') {
      this.planService.changeCurrentLegendLayout();
    } else if (event.key === 'q') {
      this.planService.incrementScenario();
    } else if (event.key === 'w') {
      this.planService.decrementScenario();
    } else if (event.key === 's') {
      this.planService.incrementCurrentYear();
    } else if (event.key === 'a') {
      this.planService.decrementCurrentYear();
    } else if (event.key === 'x') {
      this.planService.incrementNextLayer();
    } else if (event.key === 'z') {
      this.planService.decrementNextLayer();
    } else if (event.key === 'Enter') {
      this.planService.addLayer();
    } else if (event.key === 'k') {
      this.planService.removeLayer();
    } else if (event.key === 'p') {
      this.planService.resetPlan();
      this.router.navigateByUrl('');
      this.planService.setState('landing');
    }
  }

}
