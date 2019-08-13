import { _ } from 'underscore';
import { PlanService } from '../services/plan.service';
import { SoundsService } from '../services/sounds.service';
import { MapService } from '../services/map.service';
import { Numeric } from 'd3';
import { ArService } from '@app/services/ar.service';


/** Represents a projectable marker.  These are the tangibles that control
*   The user interaction with the table.  Each projectable marker is connected
*   to a arucojs marker by the markerId number */
export class ProjectableMarker {

  /* private static variables */
  private static projectableMarkers: object = {};
  private static projectableMarkerArray: ProjectableMarker[] = [];


  /* private member variables */
  private markerId: number; // Id that cooresponds to arucojs marker
  private job: string; // Job that cooresponds to job objects
  private delay: number;
  private minRotation: number;
  private planService: PlanService;
  private soundsService: SoundsService;
  private mapService: MapService;
  private arService: ArService;
  private dataPoints = [];
  private enabled: boolean;

  constructor(id: number,
    job: string,
    minRotation: number,
    delay: number,
    planService: PlanService,
    soundsService: SoundsService,
    arService: ArService,
    mapService: MapService) {
    this.markerId = id;
    this.job = job;
    this.minRotation = minRotation;
    this.delay = delay;
    this.planService = planService;
    this.soundsService = soundsService;
    this.mapService = mapService;
    this.arService = arService;
    ProjectableMarker.projectableMarkers[`${id}`] = this;
    ProjectableMarker.projectableMarkerArray.push(this);
    this.enabled = true;
  }


  /** Gets an array of all markers whose live state is true.
  * @return Array of live markers.
  */
  public static getLiveProjectableMarkers(): ProjectableMarker[] {
    return _.filter(ProjectableMarker.projectableMarkerArray, marker => (marker.live === true || marker.live2 === true));
  }

  public static getAllProjectableMarkersArray(): any[] {
    return ProjectableMarker.projectableMarkerArray;
  }

  /** Returns a single projectable marker object
  * @param id => The id of the marker to return
  * @return the marker whose id matches
  */
  public static getProjectableMarkerById(id: number) {
    return ProjectableMarker.projectableMarkers[`${id}`];
  }

  /** Returns a single projectable marker object
  * @param id => The id of the marker to return
  * @return the marker whose id matches
  */
  public static getProjectableMarkerByJob(job: string) {
    const marker = _.filter(ProjectableMarker.projectableMarkers, marker => marker.job === job);
    return marker[0];
  }

  /** Gets all projectable markers.  Key is the marker id
  * @return all markers
  */
  public static getAllProjectableMarkers() {
    return ProjectableMarker.projectableMarkers;
  }

  public setJob(job: string): void {
    this.job = job;
  }

  public getJob(): string {
    return this.job;
  }

  private getMovementData() {
    const movementData = [];
    this.dataPoints.forEach((point, index) => {
      if (point !== null) {
        movementData.push({
          corners: point,
          location: index
        });
      }
    });
    return movementData;
  }

  public wasRotated(): boolean {

    const movementData = this.getMovementData();

    if (movementData.length < 2) {
      return false;
    } else {
      this.doJob(this.calcDirection(movementData[0].corners, movementData[1].corners));
    }

  }

  private doJob(direction: string) {
    if (this.job === 'year' && this.enabled) {
      if (direction === 'right') {
        this.planService.incrementCurrentYear();
        this.disable();
      } else if (direction === 'left') {
        this.planService.decrementCurrentYear();
        this.disable();
      }
    } else if (this.job === 'scenario' && this.enabled) {
      if (direction === 'right') {
        this.planService.incrementScenario();
        this.disable();
      } else if (direction === 'left') {
        this.planService.decrementScenario();
        this.disable();
      }
    } else if (this.job === 'layer' && this.enabled) {
      if (direction === 'right') {
        this.mapService.incrementNextLayer();;
        this.disable();
      } else if (direction === 'left') {
        this.mapService.decrementNextLayer();
        this.disable();
      }
    }
  }

  private disable() {
    this.enabled = false;
    setTimeout(() => {
      this.enabled = true;
    }, this.delay);
  }

  public wasMoved(): boolean {
    const movementData = this.getMovementData();


    if (movementData.length < 2) {
      return false;
    } else {
      if (movementData[0].corners[0].x !== movementData[1].corners[0].x) {
        if (movementData)
          return true;
      }
    }
  }



  /** Sets the markerId number
  * @param id => the new Id number
  * @return the markerId number
  */
  public setMarkerId(id) {
    this.markerId = id;
  }

  /**
 * Gets the center X position of the marker.
 * @return x center.
 */
  public getCenterX(corners) {
    if (corners !== undefined) {
      return (corners[0].x + corners[2].x) * 0.5;
    } else {
      return null;
    }
  }


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  public getCenterY(corners) {
    if (corners !== undefined) {
      return (corners[0].y + corners[2].y) * 0.5;
    } else {
      return null;
    }
  }


  /** Calculates the rotation of the marker
  * @return the rotation in degrees
  */
  private calcRotation(corners) {

    let cX = this.getCenterX(corners);
    let cY = this.getCenterY(corners);

    const x = corners[0].x;
    const y = corners[0].y;

    let rotation = Math.atan((cY - y) / (x - cX));

    // If rotation is a negative number and x is positive, then we are dealing with Q4 
    if (rotation < 0 && y > cY) {
      rotation = (2 * Math.PI + rotation);
    } else if (x < cX && y < cY) { // Q II
      if (rotation < 0) rotation = (rotation + Math.PI);
      else rotation = rotation + Math.PI / 2;
    } else if (x < cX && y > cY) { // Q III
      if (rotation < 0) rotation = (rotation + 3 * Math.PI / 2);
      else rotation = rotation + Math.PI;
    }
    rotation -= Math.PI * 2;
    // Rotation is reversed.  To calculate correct rotation
    return -this.convertRadiansToDegrees(rotation);
  }

  /** Converts Radians to degrees
  * @param angle => The angle to convert in radians
  * @return the angle in degrees
  */
  private convertRadiansToDegrees(angle) {
    return angle * 180 / Math.PI;
  }


  /** gets the current time of the system in milliseconds
  * @return the current time
  */
  private getCurrentTime() {
    const date = new Date();
    return date.getTime();
  }

  private distanceMovedX(prev: {}, current: {}): number {
    return Math.abs(prev[0].x - current[0].x);
  }

  private distanceMovedY(prev: {}, current: {}): number {
    return Math.abs(prev[0].y - current[0].y);
  }

  /** Calculate the direction that the marker was turned.
      * @return the direction that it was turned
  */
  private calcDirection(corners, previousCorners) {

    const oldRotation = this.calcRotation(previousCorners);
    const newRotation = this.calcRotation(corners);
    let diff = oldRotation - newRotation; // Change in rotation

    if (diff > this.minRotation) {
      return 'left';
    } else if (diff < -this.minRotation) {
      return 'right';
    } else {
      return 'none;'
    }
  }


  public addDataPoint(point) {
    if (!(point === undefined)) {
      this.dataPoints.unshift(this.convertPointToMap(point));
    } else {
      this.dataPoints.unshift(null);
    }

    if (this.dataPoints.length > 300) {
      this.dataPoints.pop();
    }

  }

  private convertPointToMap(point) {
    const convertedPoints = [];
    point.corners.forEach(corner => {
      convertedPoints.unshift(this.arService.track(corner.x, corner.y, point.camera));
    });
    return convertedPoints;
  }

  public getMostRecentCenterX() {
    const corners = _.find(this.dataPoints, point => point !== null);
    return this.getCenterX(corners);
  }

  public getMostRecentCenterY() {
    const corners = _.find(this.dataPoints, point => point !== null);
    return this.getCenterY(corners);
  }

}
