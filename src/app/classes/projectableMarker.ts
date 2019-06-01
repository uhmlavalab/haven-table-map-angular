import { _ } from 'underscore';
import { MapDataService } from '../services/map-data.service';
import { SoundsService } from '../services/sounds.service';

/** Represents a projectable marker.  These are the tangibles that control
*   The user interaction with the table.  Each projectable marker is connected
*   to a arucojs marker by the markerId number */
export class ProjectableMarker {

  /* private static variables */
  private static MAX_ACTIVE_TIMER = 600;
  private static MAX_ADD_REMOVE_TIMER = 1000;
  private static MAX_TIME_ROTATION = 100;
  private static projectableMarkers: object = {};
  private static projectableMarkerArray: ProjectableMarker[] = []

  /* private member variables */
  private markerId: number; // Id that cooresponds to arucojs marker
  private job: string; // Job that cooresponds to job objects
  private icon: string; // Icon file name
  private live: boolean; // Live when marker is detected on the table
  private detectionStartTime: number; // Time when marker was detected on table
  private rotationStartTime: number; // Last time rotation was checked
  private addRemoveStartTime: number; // Last time add and remove executed
  private corners: object; // Holds x and y positions of the tangible
  private prevCorners: number[]; // Holds x and y of previous position.
  private rotation: number; // Current Rotation
  private rotationSum: number; // Combined Rotation amounts
  private rotationMax: number; // When rotation sum hits this, rotate.
  private _mapdataservice: MapDataService;
  private _soundsservice: SoundsService;

  constructor(id: number, job: string, icon: string, rotationMax: number, _mapdataservice: MapDataService, _soundsservice: SoundsService) {
    this.markerId = id;
    this.job = job;
    this.icon = icon;
    this.live = false;
    this.detectionStartTime = this.getCurrentTime();
    this.rotationStartTime = this.getCurrentTime();
    this.addRemoveStartTime = this.getCurrentTime();
    this.corners = null;
    this.prevCorners = null;
    this.rotation = 0;
    this.rotationMax = rotationMax;
    this._mapdataservice = _mapdataservice;
    this._soundsservice = _soundsservice;
    ProjectableMarker.projectableMarkers[`${id}`] = this;
    ProjectableMarker.projectableMarkerArray.push(this);
  }


  /** Gets an array of all markers whose live state is true.
  * @return Array of live markers.
  */
  public static getLiveProjectableMarkers(): ProjectableMarker[] {
    return _.filter(ProjectableMarker.projectableMarkerArray, marker => marker.live === true);
  }

  /** Returns a single projectable marker object
  * @param id => The id of the marker to return
  * @return the marker whose id matches
  */
  public static getProjectableMarkerById(id: number) {
    return ProjectableMarker.projectableMarkers[`${id}`];
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
    this.setDetectionStartTime(); // Reset detection timer
    this.goLive();

    if (this.corners === null) {
      this.updatePosition(corners);
      this.updatePrevPosition(corners);
    }
    // Has the marker moved at all?
    if (this.wasMoved(corners)) {
      this.doJob(videoId);
    } else {
      // Wasnt moved, dont do shit.
    }
    return true;
  }

  /** This function analyzes each of the live markers with each tick.
  * @return true if successful, false if did not work
  */
  public analyzeMarkerData(): boolean {
    // Is the marker still active?
    if (this.checkDetectionTimer()) {
      this.die();
    }
    return true;
  }

  /** When the marker is moved, do job is called.  Each marker has a specific Job
  * associated with it.  This function is called from here.
  */
  private doJob(id: number) {
    const direction = this.calcDirection();
    switch (this.job) {
      case 'year':
        this.changeYear(direction);
        break;
      case 'layer':
        this.changeLayer(direction, id);
        break;
      default:
        // Do nothing
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
        this._mapdataservice.decrementCurrentYear();
        break;
      case 'right':
        this._mapdataservice.incrementCurrentYear();
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
      switch (direction) {
        case 'left':
          this._mapdataservice.decrementNextLayer();
          break;
        case 'right':
          this._mapdataservice.incrementNextLayer();
          break;
        default:
          // do nothing
          break;
      }
    } else {
      if (this.checkaddRemoveTimer()) {
        this._mapdataservice.addRemoveLayer();
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
    if (this.corners[0].x != corners[0].x) {
      moved = true;
      this.updatePrevPosition(this.corners);
      this.updatePosition(corners);
    }
    return moved;
  }

  /** Kills marker.  ie no longer active */
  private die(): void {
    this.live = false;
  }

  /** Sets live to true */
  private goLive(): void {
    this.live = true;
  }

  /** Checks to see if the marker has not been detected for a specific amount of time.
  * @param startTime => the time the marker was last detected.
  * @return true if time has expired, false if time has not expired.
  */
  private checkDetectionTimer(): boolean {
    const difference = this.getCurrentTime() - this.detectionStartTime;
    return difference > ProjectableMarker.MAX_ACTIVE_TIMER;
  }

  /** Gets the markerId number
  * @param id => the new Id number
  * @return the markerId number
  */
  public getMarkerId(id) {
    this.markerId = id;
  }

  /** Sets the detection start time
  */
  private setDetectionStartTime() {
    this.detectionStartTime = this.getCurrentTime();
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
 * Gets the center X position of the marker.
 * @return x center.
 */
  private getCenterX() {
    const corners = this.corners;
    return (corners[0].x + corners[2].x) * 0.5;
  }


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  private getCenterY() {
    const corners = this.corners;
    return (corners[0].y + corners[2].y) * 0.5;
  }

  /** Calculates the rotation of the marker
  * @return the rotation in degrees
  */
  private calcRotation() {
    const x = this.corners[0].x;
    const y = this.corners[0].y;
    const cX = this.getCenterX();
    const cY = this.getCenterY();
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
  private resetRotationTimer(marker) {
    this.rotationStartTime = this.getCurrentTime();
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

    /* A change of more than 100 degrees means somethign went wrong.*/
    if (Math.abs(diff) <= 100 && Math.abs(diff) > 0) {
      this.rotationSum += diff;
    } else {
      this.rotationSum = 0;
    }

    /*  Check rotation sum.  If it is positive, rotation is right.  If it is
    *   negative, rotation is left.  Otherwise no rotation */
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
}