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
  private icon: string; // Icon file name
  private live: boolean; // Live when marker is detected on the table on camera 1 -- bottom camera
  private live2: boolean; // Live when marker is detected in camera 2. -- top camera
  private detectionStartTime: number; // Time when marker was detected on table
  private detectionStartTimeCam2: number;
  private rotationStartTime: number; // Last time rotation was checked
  private addRemoveStartTime: number; // Last time add and remove executed
  private corners: object; // Holds x and y positions of the tangible
  private cornersCam2: object; // Holds x and y positions of the tangible when in camera 2
  private prevCorners: object; // Holds x and y of previous position.
  private prevCornersCam2: object; // Holds x and y of previous position.
  private rotation: number; // Current Rotation
  private rotationSum: number; // Combined Rotation amounts
  private rotationMax: number; // When rotation sum hits this, rotate.
  private planService: PlanService;
  private soundsService: SoundsService;
  private mapService: MapService;
  private arService: ArService;
  private slideEvents: boolean;  // Does this marker have a slide event?
  private lastRotation: number;
  private dataPoints = [];

  constructor(id: number,
    job: string,
    icon: string,
    rotationMax: number,
    planService: PlanService,
    soundsService: SoundsService,
    arService: ArService,
    mapService: MapService,
    slideEvents: boolean) {
    this.markerId = id;
    this.job = job;
    this.rotation = 0;
    this.rotationMax = rotationMax;
    this.planService = planService;
    this.soundsService = soundsService;
    this.mapService = mapService;
    this.arService = arService;
    this.lastRotation = this.getCurrentTime();
    ProjectableMarker.projectableMarkers[`${id}`] = this;
    ProjectableMarker.projectableMarkerArray.push(this);
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


  public liveIn(): number {
    if (this.live) {
      return 1;
    } else if (this.live2) {
      return 2;
    } else {
      return 0;
    }
  }

  public setIcon(icon: string): void {
    this.icon = icon;
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
     this.calcDirection(movementData[0].corners, movementData[1].corners);
    }

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
  private calcRotation(corners, previousCorners) {

    let cX = this.getCenterX(corners);
    let cY = this.getCenterY(corners);

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

    let direction = 'none'; // initialize direction
    const oldRotation = this.rotation;
    const newRotation = this.calcRotation();
    this.rotation = newRotation; // Update rotation
    let diff = oldRotation - newRotation; // Change in rotation
    // Minimum change is 2 degrees 
    if (Math.abs(diff) < 2) {
      diff = 0;
    }

    // A change of more than 70 degrees means somethign went wrong.
    if (Math.abs(diff) <= 70 && Math.abs(diff) > 0) {
      this.rotationSum += diff;
    } else {
      this.rotationSum = 0;
    }

    // Check rotation sum.  If it is positive, rotation is right.  If it is
    //  negative, rotation is left.  Otherwise no rotation 
    if (Math.abs(this.rotationSum) > this.rotationMax) {
      if (this.rotationSum < 0) {
        direction = 'left';
      } else if (this.rotationSum > 0) {
        direction = 'right';
      } else {
        direction = 'none';
      }
      this.rotationSum = 0;  // Reset rotationSum if there was a rotation
    }
    return direction;
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
