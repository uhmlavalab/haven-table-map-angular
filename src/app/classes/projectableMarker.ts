import { _ } from 'underscore';
import { PlanService } from '../services/plan.service';
import { SoundsService } from '../services/sounds.service';
import { MapService } from '../services/map.service';
import { Numeric } from 'd3';


/** Represents a projectable marker.  These are the tangibles that control
*   The user interaction with the table.  Each projectable marker is connected
*   to a arucojs marker by the markerId number */
export class ProjectableMarker {

  /* private static variables */
  private static MAX_ACTIVE_TIMER = 600;
  private static MAX_ADD_REMOVE_TIMER = 1000;
  private static MAX_TIME_ROTATION = 40;
  private static projectableMarkers: object = {};
  private static projectableMarkerArray: ProjectableMarker[] = [];
  private static maxMovement: number;
  private static resetRotationMax = 500;



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
  private slideEvents: boolean;  // Does this marker have a slide event?
  private lastRotation: number;

  constructor(id: number,
    job: string,
    icon: string,
    rotationMax: number,
    planService: PlanService,
    soundsService: SoundsService,
    mapService: MapService,
    slideEvents: boolean) {
    this.markerId = id;
    this.job = job;
    this.icon = icon;
    this.live = false;
    this.live2 = false;
    this.slideEvents = slideEvents;
    this.detectionStartTime = this.getCurrentTime();
    this.rotationStartTime = this.getCurrentTime();
    this.addRemoveStartTime = this.getCurrentTime();
    this.corners = null;
    this.prevCorners = null;
    this.cornersCam2 = null;
    this.prevCornersCam2 = null;
    this.rotation = 0;
    this.rotationMax = rotationMax;
    this.planService = planService;
    this.soundsService = soundsService;
    this.mapService = mapService;
    this.lastRotation = this.getCurrentTime();
    ProjectableMarker.projectableMarkers[`${id}`] = this;
    ProjectableMarker.projectableMarkerArray.push(this);
    ProjectableMarker.maxMovement = 4;
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

  /** This function is called when a marker is detected by a video feed.
  * @param corners => object holding the positons of the corners of the arucojs marker
  * @return true if no issues, false if marker has errors.
  */
  public detectMarker(corners: object, videoId: number): boolean {
    // Video id 2 = top camera
    // Video id 1 = bottom camera
    if (videoId === 2 && this.live) {
      return;
    }

    if (this.checkClearRotation()) {
      this.resetClearRotation();
    }

    switch (videoId) {
      case 1:
        this.setDetectionStartTime(); // Reset detection timer
        this.goLive();
        if (this.corners === null) {
          this.updatePosition(corners);
          this.updatePrevPosition(corners);
          return;
        }
        // Has the marker moved at all?
        if (this.wasMoved(corners)) {
          if (this.slideEvents && this.wasSlid(corners)) {
            this.doJob(0);
          } else {
            if ((this.distanceMovedY(this.corners, corners) < ProjectableMarker.maxMovement) && (this.distanceMovedX(this.corners, corners) < ProjectableMarker.maxMovement)) {
              this.doJob(1);
            }
          }
          this.updatePrevPosition(this.corners);
          this.updatePosition(corners);
        } else {
          // Wasnt moved, dont do shit.
        }
        break;
      case 2:
        this.setDetectionStartTime2(); // Reset detection timer
        this.goLive2();
        if (this.cornersCam2 === null) {
          this.updatePosition2(corners);
          this.updatePrevPosition2(corners);
          return;
        }
        // Has the marker moved at all?
        if (this.wasMoved(corners)) {
          if (this.slideEvents && this.wasSlid(corners)) {
            this.doJob(0);
          } else {
            if ((this.distanceMovedY(this.cornersCam2, corners) < ProjectableMarker.maxMovement) && (this.distanceMovedX(this.cornersCam2, corners) < ProjectableMarker.maxMovement)) {
              this.doJob(1);
            }
          }
          this.updatePrevPosition2(this.cornersCam2);
          this.updatePosition2(corners);
        } else {
          // Wasnt moved, dont do shit.
        }
        break;
    }
    return true;
  }

  /** Checks to see if the marker was slid up or down by seeing if the y distance was moved 
   * within a certain threshold and if the x remained within a certain threshold.
   * @param corners => the current position.
   */
  private wasSlid(corners: any): boolean {
    let slid = false;
    const yThreshold = 15; // Maximum distance the marker can move left or right and still be considered
    // as a slide.
    const xMinimum = 10;   // Marker must move at least this distance to be a slide.
    const xMaximum = 120;  // Maximum y distance.  Anything greater is considered something other than a slide.
    let prevCorners = this.prevCorners;
    if (this.live2) {
      prevCorners = this.prevCornersCam2;
    }

    const previousX = prevCorners[0].x;
    const previousY = prevCorners[0].y;
    const currentX = corners[0].x;
    const currentY = corners[0].y;
    const up = (previousX - currentX) > 0 ? true : false;

    const xDifference = Math.abs(previousX - currentX);
    const yDifference = Math.abs(previousY - currentY);
    if ((yDifference <= yThreshold) && (xDifference > xMinimum) && (xDifference <= xMaximum)) {
      if (up && !this.mapService.getSelectedLayer().active) {
        slid = true;
      } else if (!up && this.mapService.getSelectedLayer().active) {
        slid = true;
      }
    }
    return slid;
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

  /** This function analyzes each of the live markers with each tick.
  * @return true if successful, false if did not work
  */
  public analyzeMarkerData(): boolean {
    // Is the marker still active?
    if (this.live) {
      if (this.checkDetectionTimer()) {
        this.die();
      }
    }

    if (this.live2) {
      if (this.checkDetectionTimer2()) {
        this.die2();
      }
    }
    return true;
  }

  /** When the marker is moved, do job is called.  Each marker has a specific Job
  * associated with it.  This function is called from here.
  */
  private doJob(id: number) {
    if (this.checkDetectionTimer) {
      const direction = this.calcDirection();
      switch (this.job) {
        case 'year':
          this.changeYear(direction);
          break;
        case 'layer':
          this.changeLayer(direction, id);
          break;
        case 'scenario':
          this.changeScenario(direction);
          break;
        case 'chart':
          this.changeChart(direction);
          break;
        default:
          // Do nothing
          break;
      }
    }
  }

  /** Changes the scenario of the map based on the direction that the marker was turned.
  * Connects to the map data service for the function and stores all year data there.
  * @param direction => The direction the marker was turned.
  */
  changeScenario(direction) {
    switch (direction) {
      case 'left':
        this.planService.decrementScenario();
        break;
      case 'right':
        this.planService.incrementScenario();
        break;
      default:
        // do nothing
        break;
    }
  }

  /** Changes the Chart that is displayed on the direction that the marker was turned.
  * Connects to the map data service for the function and stores all year data there.
  * @param direction => The direction the marker was turned.
  */
  changeChart(direction) {
    switch (direction) {
      case 'left':
        // this.chartService.decrementChart();
        break;
      case 'right':
        // this.chartService.incrementChart();
        break;
      default:
        // do nothing
        break;
    }
  }

  /** Changes the year of the map based on the direction that the marker was turned.
  * Connects to the map data service for the function and stores all year data there.
  * @param direction => The direction the marker was turned.
  */
  changeYear(direction) {
    switch (direction) {
      case 'left':
        this.planService.decrementCurrentYear();
        break;
      case 'right':
        this.planService.incrementCurrentYear();
        break;
      default:
        // do nothing
        break;
    }
  }

  /** Changes the layer of the map based on the direction that the marker was turned.
  * Connects to the map data service for the function and stores all year data there.
  * Depending on which camera feed has spotted this marker, it will either advance the
  * layer selection elements or add/remove an element
  * @param direction => The direction the marker was turned.
  */
  changeLayer(direction, id) {
    if (id === 1) {
      if (this.checkaddRemoveTimer()) {
        switch (direction) {
          case 'left':
            this.mapService.decrementNextLayer();
            break;
          case 'right':
            this.mapService.incrementNextLayer();
            break;
          default:
            // do nothing
            break;
        }
      }
    } else {
      if (this.checkaddRemoveTimer()) {
        this.mapService.addRemoveLayer();
        this.addRemoveStartTime = this.getCurrentTime();
      }
    }
  }

  /** checks to see if the marker has been moved at all or if it was stationary
* on the table between detections.
* @param corners => The current location of the marker
* @return true if moved, false if stationary.
*/
  private wasMoved(corners: object): boolean {
    let moved = false;
    if (this.live) {
      if (this.corners[0].x != corners[0].x) {
        moved = true;
      }
    } else if (this.live2) {
      if (this.cornersCam2[0].x != corners[0].x) {
        moved = true;
      }
    }
    return moved;
  }

  private goodToRotate(): boolean {
    return true;
  }

  /** Kills marker.  ie no longer active */
  private die(): void {
    this.live = false;
    this.corners = null;
    this.prevCorners = null;
  }

  /** Sets live to true */
  private goLive(): void {
    this.live = true;
  }

  /** live in camera 2 */
  private goLive2(): void {
    this.live2 = true;
  }

  private die2(): void {
    this.live2 = false;
    this.cornersCam2 = null;
    this.prevCornersCam2 = null;
  }

  /** Checks to see if the marker has not been detected for a specific amount of time.
  * @return true if time has expired, false if time has not expired.
  */
  private checkDetectionTimer(): boolean {
    const difference = this.getCurrentTime() - this.detectionStartTime;
    return difference > ProjectableMarker.MAX_ACTIVE_TIMER;
  }

  /** Checks to see if the marker has not been detected for a specific amount of time.
  * @return true if time has expired, false if time has not expired.
  */
  private checkDetectionTimer2(): boolean {
    const difference = this.getCurrentTime() - this.detectionStartTimeCam2;
    return difference > ProjectableMarker.MAX_ACTIVE_TIMER;
  }


  /** Sets the markerId number
  * @param id => the new Id number
  * @return the markerId number
  */
  public setMarkerId(id) {
    this.markerId = id;
  }

  /** Sets the detection start time
  */
  private setDetectionStartTime() {
    this.detectionStartTime = this.getCurrentTime();
  }

  /** Sets the detection start time
  */
  private setDetectionStartTime2() {
    this.detectionStartTimeCam2 = this.getCurrentTime();
  }

  /**
 * Updates the position of the marker on the map.  Does deep copy of the
 * corners from the aruco.js object to the marker object.
 * @param corners Corners to update.
 */
  private updatePosition(corners) {
    /* Execute deep copy of the corners array */
    this.corners = Object.assign({}, corners);
  };

  /**
   * Updates the position of the marker on the map.  Does deep copy of the
   * corners from the aruco.js object to the marker object.
   * @param corners Corners to update.
   */
  private updatePrevPosition(corners) {
    /* Execute deep copy of the corners array */
    this.prevCorners = Object.assign({}, corners);
  };

  /**
* Updates the position of the marker on the map.  Does deep copy of the
* corners from the aruco.js object to the marker object.
* @param corners Corners to update.
*/
  private updatePosition2(corners) {
    /* Execute deep copy of the corners array */
    this.cornersCam2 = Object.assign({}, corners);
  };

  /**
   * Updates the position of the marker on the map.  Does deep copy of the
   * corners from the aruco.js object to the marker object.
   * @param corners Corners to update.
   */
  private updatePrevPosition2(corners) {
    /* Execute deep copy of the corners array */
    this.prevCornersCam2 = Object.assign({}, corners);
  };


  /**
 * Gets the center X position of the marker.
 * @return x center.
 */
  public getCenterX() {
    if (this.corners === null) {
      return -1;
    }
    const corners = this.corners;
    return (corners[0].x + corners[2].x) * 0.5;
  }


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  public getCenterY() {
    if (this.corners === null) {
      return -1;
    }
    const corners = this.corners;
    return (corners[0].y + corners[2].y) * 0.5;
  }


  /**
 * Gets the center X position of the marker.
 * @return x center.
 */
  public getCenterX2() {
    if (this.cornersCam2 === null) {
      return -1;
    }
    const corners = this.cornersCam2;
    if (corners === null) {
      return -1;
    }
    return (corners[0].x + corners[2].x) * 0.5;
  }


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  public getCenterY2() {
    if (this.cornersCam2 === null) {
      return -1;
    }
    const corners = this.cornersCam2;
    if (corners === null) {
      return -1;
    }
    return (corners[0].y + corners[2].y) * 0.5;
  }

  /** Calculates the rotation of the marker
  * @return the rotation in degrees
  */
  private calcRotation() {
    let prevCorners = this.prevCorners;
    if (this.live2) {
      prevCorners = this.prevCornersCam2;
    }
    const x = prevCorners[0].x;
    const y = prevCorners[0].y;

    let cX = this.getCenterX();
    let cY = this.getCenterY();

    if (this.live2) {
      cX = this.getCenterX2();
      cY = this.getCenterY2();
    }

    let rotation = Math.atan((cY - y) / (x - cX));

    /* If rotation is a negative number and x is positive, then we are dealing with Q4 */
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

  /** Checks the rotation timer.  If the rotation timer is greater than the
  * MAX_ROTATION_TIME, check the rotation.
  * @return true if time is up, false if time is not up.
  */
  private checkRotationTimer() {
    const difference = this.getCurrentTime() - this.rotationStartTime;
    return difference > ProjectableMarker.MAX_TIME_ROTATION;
  }

  /** Checks the add remove timer.  If the rotation timer is greater than the
  * MAX_ROTATION_TIME, check the rotation.
  * @return true if time is up, false if time is not up.
  */
  private checkaddRemoveTimer() {
    const difference = this.getCurrentTime() - this.addRemoveStartTime;
    return difference > ProjectableMarker.MAX_ADD_REMOVE_TIMER;
  }

  /** Resets the rotation timer to the current system time
  */
  private resetRotationTimer() {
    this.rotationStartTime = this.getCurrentTime();
  }

  /** Resets the rotation timer to the current system time
  */
 private resetClearRotation() {
  this.lastRotation = this.getCurrentTime();
}

private checkClearRotation() {
  return this.getCurrentTime() - this.lastRotation > ProjectableMarker.resetRotationMax;
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
  private calcDirection() {

    let direction = 'none'; // initialize direction
    const oldRotation = this.rotation;
    const newRotation = this.calcRotation();
    this.rotation = newRotation; // Update rotation
    let diff = oldRotation - newRotation; // Change in rotation
    /* Minimum change is 2 degrees */
    if (Math.abs(diff) < 2) {
      diff = 0;
    }

    /* A change of more than 70 degrees means somethign went wrong.*/
    if (Math.abs(diff) <= 70 && Math.abs(diff) > 0) {
      this.rotationSum += diff;
    } else {
      this.rotationSum = 0;
    }

    /*  Check rotation sum.  If it is positive, rotation is right.  If it is
    *   negative, rotation is left.  Otherwise no rotation */
    if (Math.abs(this.rotationSum) > this.rotationMax) {
      if (this.rotationSum < 0) {
        direction = 'left';
        this.resetRotationTimer();
      } else if (this.rotationSum > 0) {
        direction = 'right';
        this.resetRotationTimer();
      } else {
        direction = 'none';
      }
      this.rotationSum = 0;  // Reset rotationSum if there was a rotation
    }
    return direction;
  }
}
