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
  private static MAX_HISTORY = 40;
  private static MAX_ROTATION_DEGREES = 120;

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

  
  /** Checks to see if the maker has been rotated. 
   * @return true if rotated, false if not.
  */
  public wasRotated(): boolean {
    const data = this.getMovementData();

    if (data.length < 2) {
      return false;
    } else {
      const movementData = this.getDistanceMoved(data);
      const y = movementData.y;
      const x = movementData.x;

      if (y > 1 && x > 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  /** Each marker has a job that it does based on the direction of the rotation.
   */
  public doJob() {
    const movementData = this.getMovementData();
    const direction = this.calcDirection(movementData[0].corners, movementData[1].corners);
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
    } else if (this.job === 'add' && this.enabled) {
      if (direction === 'right') {
        this.mapService.addLayer();;
        this.disable();
      } else if (direction === 'left') {
        this.mapService.removeLayer();
        this.disable();
      }
    }
  }


  /** Disables the rotation function for a psecified amount of time to prevent mutiple
   * actions in a row.
   */
  private disable(): void {
    this.enabled = false;
    setTimeout(() => {
      this.enabled = true;
    }, this.delay);
  }

  /** Checks to see if a marker has been moved since the last check
   * @return true if the marker was moved, false if not.
   */
  public wasMoved(): boolean {
    const movementData = this.getMovementData();

    // Check to see if there is a previous to compare data with.  If not, couldn't have moved.
    if (movementData.length < 2) {
      return false;
    } else {
      if (movementData[0].corners[0].x !== movementData[1].corners[0].x) {
        if (!this.wasRepositioned(movementData)) {
          return true;
        }
      }
    }
  }

  /** Checks to see if the marker was repositioned. Max movement of 4 is allowed. 
   * @param data The movement data in map coordinates.
   * @return false if not repositioned, true if repositioned.
   */
  private wasRepositioned(data: any[]): boolean {
    const movementData = this.getDistanceMoved(data);
    const y = movementData.y;
    const x = movementData.x;

    if ((x > 1 && x < 4) || (y > 1 && y < 4)) {
      return false;
    }
    else {
      return true;
    }
  }

  private getDistanceMoved(data: any[]): {x: number, y: number} {
    return {x: Math.abs(data[0].corners[0].y - data[1].corners[0].y), y: Math.abs(data[0].corners[0].y - data[1].corners[0].y)};
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

  /** Calculate the direction that the marker was turned.
      * @return the direction that it was turned
  */
  private calcDirection(corners, previousCorners) {

    const oldRotation = this.calcRotation(previousCorners);
    const newRotation = this.calcRotation(corners);
    let diff = oldRotation - newRotation; // Change in rotation

    if (diff > this.minRotation && Math.abs(diff) < ProjectableMarker.MAX_ROTATION_DEGREES) {
      return 'left';
    } else if (diff < -this.minRotation&& Math.abs(diff) < ProjectableMarker.MAX_ROTATION_DEGREES) {
      return 'right';
    } else {
      return 'none;'
    }
  }

  /** Adds a data point to the array of data.  If the marker was not detected, a null is added.
   * @param point The location and camera data for the marker.
   */
  public addDataPoint(point) {
    if (!(point === undefined)) {
      this.dataPoints.unshift(this.convertPointToMap(point));
    } else {
      this.dataPoints.unshift(null);
    }

    // Remove the last point when you fill the array.
    if (this.dataPoints.length > ProjectableMarker.MAX_HISTORY) {
      this.dataPoints.pop();
    }

  }

  /** Converts data points from the camera location coordinates to the map coordinates
   * @param point the data in cam coordinates
   * @return the converted coordinates.
   */
  private convertPointToMap(point) {
    const convertedPoints = [];
    point.corners.forEach(corner => {
      convertedPoints.unshift(this.arService.track(corner.x, corner.y, point.camera));
    });
    return convertedPoints;
  }

  /**  Finds the most recent location coordinates and returns the x position of the center of the marker.
   * @return the x coordinate of the marker.
  */
  public getMostRecentCenterX() {
    const corners = _.find(this.dataPoints, point => point !== null);
    return this.getCenterX(corners);
  }

  /**Finds the most recent location coordinates and returns the center y position
   * @return the y position of the marker in map coordinates.
   */
  public getMostRecentCenterY() {
    const corners = _.find(this.dataPoints, point => point !== null);
    return this.getCenterY(corners);
  }

}
