/** Represents a projectable marker.  These are the tangibles that control
*   The user interaction with the table.  Each projectable marker is connected
*   to a arucojs marker by the markerId number */
export class ProjectableMarker {

  /* private static variables */
  private static MAX_ACTIVE_TIMER = 600;
  private static projectableMarkers: object = {};

  /* private member variables */
  private markerId: number; // Id that cooresponds to arucojs marker
  private job: string; // Job that cooresponds to job objects
  private icon: string; // Icon file name
  private live: boolean; // Live when marker is detected on the table
  private detectionStartTime: number; // Time when marker was detected on table
  private rotationStartTime: number; // Last time rotation was checked
  private corners: object; // Holds x and y positions of the tangible
  private prevCorners: number[]; // Holds x and y of previous position.
  private rotation: number; // Current Rotation
  private rotationSum: number; // Combined Rotation amounts
  private rotationMax: number; // When rotation sum hits this, rotate.

  constructor(id: number, job: string, icon: string, rotationMax: number) {
    this.markerId = id;
    this.job = job;
    this.icon = icon;
    this.live = false;
    this.detectionStartTime = 0;
    this.rotationStartTime = 0;
    this.corners = null;
    this.prevCorners = null;
    this.rotation = 0;
    this.rotationMax = rotationMax;
    ProjectableMarker.projectableMarkers[`${id}`] = this;
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
  * @param corners => Array holding the positons of the corners of the arucojs marker
  * @return true if no issues, false if marker has errors.
  */
  public detectMarker(corners): boolean {
    this.setDetectionStartTime(); // Reset detection timer
    this.goLive();
    this.updatePrevPosition(this.corners);
    this.updatePosition(corners);
    return true;
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
    return difference > 20;
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
  private calcDirection(marker) {

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
      } else if (marker.rotationSum > 0) {
        direction = 'right';
      } else {
        direction = 'none';
      }
      this.rotationSum = 0;  // Reset rotationSum if there was a rotation
    }
    return direction;
  }
}
