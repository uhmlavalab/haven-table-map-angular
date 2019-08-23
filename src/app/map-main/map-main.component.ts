import { Component, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { MapService } from '../services/map.service';
import { WindowRefService } from '../services/window-ref.service';
import { ArService } from '../services/ar.service';
import { Router } from '@angular/router';
import { Plan } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';
import { AddRemoveLayersComponent } from './interaction-element/add-remove-layers/add-remove-layers.component';
import { ProjectableMarker } from '@app/classes/projectableMarker';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
 * And the display components of the table.
 */
export class MapMainComponent implements AfterViewInit {

  @ViewChild('trackingDotYear', { static: false }) trackingDotYear;
  @ViewChild('trackingDotLayer', { static: false }) trackingDotLayer;
  @ViewChild('trackingDotScenario', { static: false }) trackingDotScenario;
  @ViewChild('trackingDotAdd', { static: false }) trackingDotAdd;
  @ViewChild('connectingLine', { static: false }) connectingLine;

  plan: Plan;
  private top: string;
  private left: string;
  private width: string;
  private legendClass: string;
  private currentYear: number;
  private nextLayer: string;
  private addColor: string;
  trackingDots: any[] = [];
  private currentScenario: string;

  constructor(
    private planService: PlanService,
    private mapService: MapService,
    private arService: ArService,
    private router: Router,
    private windowRefService: WindowRefService) {
    this.plan = this.planService.getCurrentPlan();
    try {
      this.legendClass = this.planService.getCurrentLegendLayout();
      this.currentYear = 2016;
      this.addColor = this.mapService.getSelectedLayer().legendColor;
      this.currentScenario = this.planService.getCurrentScenario().displayName;
    } catch(error) {
      console.log("No Plan Set");
    }


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

  ngAfterViewInit() {
    this.trackingDots = [this.trackingDotYear, this.trackingDotLayer, this.trackingDotScenario, this.trackingDotAdd];
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
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'year',
            year: value
          }));
        this.currentYear = value;
      }
    });

    // Push Year Data to Second Screen
    this.mapService.selectedLayerSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'layer',
            name: value.name
          }));
          this.nextLayer = value.displayName;
          this.addColor = value.legendColor;
      }
    });

    this.arService.trackingSubject.subscribe({
      next: value => {
        this.trackingDots.forEach(dot => dot.nativeElement.style.opacity = 0);
        value.forEach(marker => this.track(marker));
        this.connectLayerAndAdd(this.trackingDotLayer.nativeElement, this.trackingDotAdd.nativeElement);
      }
    });
    
    this.planService.scenarioSubject.subscribe(scenario => this.currentScenario = scenario.displayName);
  }

  /** Tracks the marker on the table
   * @param marker The marker to be tracked.
   */
  private track(marker: ProjectableMarker) {
    try {
      const dataPoint = {x: null, y: null};

      dataPoint.x = marker.getMostRecentCenterX();
      dataPoint.y = marker.getMostRecentCenterY();
      
      if (dataPoint.x !== null) {
      switch (marker.getJob()) {
        case 'year':
          this.trackingDotYear.nativeElement.style.opacity = 1;
          this.trackingDotYear.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotYear.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;
        case 'layer':
          this.trackingDotLayer.nativeElement.style.opacity = 1;
          this.trackingDotLayer.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotLayer.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;
          case 'scenario':
          this.trackingDotScenario.nativeElement.style.opacity = 1;
          this.trackingDotScenario.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotScenario.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;
          case 'add':
          this.trackingDotAdd.nativeElement.style.opacity = 1;
          this.trackingDotAdd.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotAdd.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;
      }
    }

    } catch (error) {;
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

    const layerPosition = {x: layerMarker.getMostRecentCenterX(), y: layerMarker.getMostRecentCenterY()};
    const addPosition = {x: addMarker.getMostRecentCenterX(), y: addMarker.getMostRecentCenterY()};

    if (layerPosition.x === null || addPosition.x === null) {
      this.connectingLine.nativeElement.style.opacity = 0;
    } else {
      const adjacent = this.getAdjacent(addPosition.x, layerPosition.x);
      const opposite = this.getOpposite(addPosition.y, layerPosition.y);
      const hypotenuse = this.getHypotenuse(adjacent, opposite); // This is the width of the div
      let theta = this.getTheta(opposite, adjacent);
      theta = this.convertRadsToDegrees(theta);
      const quadrant = this.getQuadrant(addPosition.x - layerPosition.x, addPosition.y - layerPosition.y);
      theta = this.adjustTheta(theta, quadrant);
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
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.transform = `rotate(-${theta}deg)`;
    element.style.backgroundColor = this.mapService.getSelectedLayer().legendColor;
  }

  /** Adjusts the angle calculation depending on quadrant
   * @theta the angle as calculated by the arc tan function
   * @quadrant the quadrant of the unit circle
   */
  private adjustTheta(theta, quadrant) {
    theta = theta;
    if (quadrant === 2) {
      theta = 180 - theta;
    } else if (quadrant === 3) {
      theta = 180 + theta;
    } else if (quadrant === 4) {
      theta = 360 - theta;
    }
    return theta;
  }

  /** Get the quadrant of the unit circle
   * @param x the distance from the origin along x axis
   * @param y the distance from the origin along the y axis
   */
  private getQuadrant(x: number, y: number) {
    let quadrant = 0;
    if (x <= 0 && y <= 0) {
      quadrant = 2;
    } else if (x > 0 && y <= 0) {
      quadrant = 1;
    } else if (x >= 0 && y > 0) {
      quadrant = 4;
    } else {
      quadrant = 3;
    }
    return quadrant;
  }
  private convertRadsToDegrees(theta): number {
    return theta * (180/Math.PI);
  }

  private getTheta(opposite: number, adjacent: number): number {
    return Math.atan(opposite/adjacent);
  } 

  private getAdjacent(a: number, b: number): number {
    return Math.abs(a - b);
  }

  private getOpposite(a: number, b: number): number {
    return Math.abs(a - b);
  }

  private getHypotenuse(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }


  /**
   * This function gets the css class name to apply to the legend based
   * on the map that is selected.
   * @return the name of the css class
   */
  private getIslandName(): string {
    return this.plan.name;
  }

  /*
  //KEYBOARD CONTROLS 
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
      this.mapService.addLayer();
    } else if (event.key === 'k') {
      this.mapService.removeLayer();
    }else if (event.key === 'p') {
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
    } else if (event.key === 'f') {
      console.log('second => ' + this.windowRefService.secondScreenExists());
    }
  }
  */
  /* KEYBOARD CONTROLS */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.arService.incrementYOffset();
    } else if (event.key === 'ArrowDown') {
      this.arService.decrementYOffset();
    } else if (event.key === 'ArrowLeft') {
      this.arService.incrementXOffset();
    } else if (event.key === 'ArrowRight') {
      this.arService.decrementXOffset();
    } else if (event.key === 'w') {
      this.arService.incrementYOffset2();
    } else if (event.key === 's') {
      this.arService.decrementYOffset2();
    } else if (event.key === 'a') {
      this.arService.incrementXOffset2();
    } else if (event.key === 'd') {
      this.arService.decrementXOffset2();
    }
  }

}
