import { Injectable } from '@angular/core';
import { ProjectableMarker } from '../classes/projectableMarker';
import { PlanService } from './plan.service';
import { SoundsService } from './sounds.service';
import { markers } from '../../assets/defaultData/markers';
import { _ } from 'underscore';
import AR from 'js-aruco';
import { Subject } from 'rxjs';
import { TrackingPoint } from '../classes/trackingPoint';
import { defaultTrackingPoints } from '../../assets/defaultData/defaultTrackingPoints.js'

@Injectable({
  providedIn: 'root'
})

/* This servce contains all the functions and data that controls
* the ar interaction with the pucks and markers */
export class ArService {

  private detector: any; // Aruco JS detector object
  private tickFunction = null; // Tick function bound to this variable.

  /* State Variables */
  private calibrating: boolean; // Is the table in calibration mode?

  /* Subjects */
  public markerSubject = new Subject<ProjectableMarker[]>();
  public calibrationSubject = new Subject<any>();
  public trackingSubject = new Subject<any>();

  /* Tracking Variables */
  private trackingPoints: TrackingPoint[] = [];
  private camWidth: number;
  private camHeight: number;
  private camWidth2: number;
  private camHeight2: number;
  private mapWidth: number;
  private mapHeight: number;
  private mapWidth2: number;
  private mapHeight2: number;
  private yOffset: number;
  private xOffset: number;
  private yOffset2: number;
  private xOffset2: number;
  private trackingIsSet: boolean;

  /* The array holding the video feeds is created by the video feed components.
  * The tick cannot be started until there is at least one video element */
  private videoFeedArray: any[] = [];

  constructor(private planService: PlanService,
    private soundsservice: SoundsService) {

    /* Aruco Js library requires AR.AR. for access */
    this.detector = new AR.AR.Detector();
    this.tickFunction = this.tick.bind(this);

    // Create the projectable markers from the default data.
    markers.forEach(marker => new ProjectableMarker(
      marker.markerId,
      marker.job,
      marker.minRotation,
      marker.delay,
      marker.rotateLeft,
      marker.rotateRight,
      this.planService,
      this));

    this.trackingIsSet = true; // Tracking is always set.

    try {
      this.createDefaultTrackingPoints();
    } catch (error) {
      console.log('No Default Data File Found, cannot create tracking points.')
    }

    this.completeCalibration(false);  // Set up tracking without generating a new file.

  }

  /******************************************************************************************************************************* 
  ***************** Detects the Markers and makes the changes in the program.  This is the Main Loop that runs the table. ********
  ****************************************************************************************************************************** */
  private tick(): void {

    /* Holds the raw aruco marker data from each camera */
    const tempMarkerData = [];

    this.videoFeedArray.forEach(videoFeed => {
      if (videoFeed.video.readyState === videoFeed.video.HAVE_ENOUGH_DATA) {

        // Collect the Image data for the detector
        const imageData = this.snapshot(videoFeed);

        // Returns an array of active arucojs markers.
        const arucoMarkers = this.detector.detect(imageData);
        // Run detect marker for each one

        arucoMarkers.forEach(marker => {
          if (ProjectableMarker.isValidMarker(marker.id)) {
            tempMarkerData.push({
              marker: ProjectableMarker.getProjectableMarkerById(marker.id),
              corners: marker.corners,
              camera: videoFeed.id
            });
          } else {
            console.log(`Undefined Marker: ID -> ${marker.id}`);
          }
        });
      }
    });

    // Handle the data differently if running or calibrating.
    if (this.calibrating) {
      this.decodeCalibrationData(tempMarkerData);
    } else {
      this.unpackData(tempMarkerData);
    }
  }

  /** Takes the raw data for the markers and runs the calibration loop
   * @param data marker detected data 
   */
  private decodeCalibrationData(data) {

    this.calibrationSubject.next(data);
    requestAnimationFrame(this.tickFunction);
  }

  /** Takes all captured marker data that was collected by arucojs detector object.  All marker location
   * data is in the coordinates generated by the video feed canvas and it must be converted to the map
   * coordinates before it is stored and the tracking is done.
   * @param markerData Raw data collected from the arucojs detector.
   */
  private unpackData(markerData) {

    ProjectableMarker.getAllProjectableMarkersArray().forEach(pm => {
      const dataPoint = _.find(markerData, m => m.marker.markerId === pm.markerId);
      pm.addDataPoint(dataPoint);
    });

    // Publish the locations for tracking.
    this.trackingSubject.next(ProjectableMarker.getAllProjectableMarkersArray());
    this.runMarkers();
  }

  /** Checks to see if the markers were moved and if they were rotated.  If they were moved 
   * and rotated, they are loaded into a queue and their jobs are executed before the next frame is captured.
  */
  private runMarkers() {
    if (this.planService.getState() === 'run') {
      ProjectableMarker.getAllProjectableMarkersArray().forEach(pm => {
        if (pm.wasMoved()) {
          pm.wasRotated();
        }
      });
    }
    requestAnimationFrame(this.tickFunction);
  }

  /**
   * Creates an image from the video feed so that the app can look for markers.
   * @param videoElement Object containing the video and the canvas for each video input.
   * @return Returns the image data to be analyzed by the AR library
   */
  private snapshot(videoElement): any {
    videoElement.canvas.ctx.drawImage(videoElement.video, 0, 0, videoElement.canvas.width, videoElement.canvas.height);
    return videoElement.canvas.ctx.getImageData(0, 0, videoElement.canvas.width, videoElement.canvas.height);
  }

  /**
   * Starts the recursive animation loop that feeds the arucojs Detector
   * with images from the cameras.  Only starts if at least one videoFeed
   * component has been created.
   * @param videoFeeds => An array holding all instantiated video feeds.  They
   *                      contain a video element and a canavas element.
   */
  public runApplication(videoFeeds: any): any {
    this.videoFeedArray = videoFeeds;
    if (this.videoFeedArray.length === 0) {
      console.log('Video Elements Not Instantiated');
    } else {
      requestAnimationFrame(this.tickFunction);
    }
  }

  /** Begins the calibration process. */
  public startCalibration(): void {
    this.calibrating = true;
    this.trackingPoints = []; // Clear the tracking points.
  }

  /** Creates tracking point data from the default data file. */
  private createDefaultTrackingPoints(): void {
    defaultTrackingPoints.trackingPoints.forEach(point => {
      this.createTrackingPoint(point.camX, point.camY, point.cam2X, point.cam2Y, point.mapX, point.mapY);
    });

    // The offsets are the x and y adjustments to the tracking that allow for more precise tracking.
    this.xOffset = defaultTrackingPoints.offsets.xOffset;
    this.yOffset = defaultTrackingPoints.offsets.yOffset;
    this.xOffset2 = defaultTrackingPoints.offsets.xOffset2;
    this.yOffset2 = defaultTrackingPoints.offsets.yOffset2;
  }

  /** Finishes the calibration process
   * @param createFile If true, it means that a manual calibration of the table was done and all data needs to be stored
   *                   in a file for future use.
   * @return true when finished calibrating.
   */
  public completeCalibration(createFile: boolean): boolean {

    /* The x and y points generated by the camera are upside down and reversed
    *  from the ones generated by the map.  Therefore, it is necessary to convert them
    *  to get an accurate picture of the x and y to allow tracking. */
    this.mapHeight = this.trackingPoints[5].getMapY() - this.trackingPoints[3].getMapY();
    this.mapWidth = this.trackingPoints[3].getMapX() - this.trackingPoints[2].getMapX();
    this.camHeight = this.trackingPoints[4].getCamX() - this.trackingPoints[3].getCamX();
    this.camWidth = this.trackingPoints[5].getCamY() - this.trackingPoints[4].getCamY();
    this.mapHeight2 = this.trackingPoints[3].getMapY() - this.trackingPoints[1].getMapY();
    this.mapWidth2 = this.trackingPoints[1].getMapX() - this.trackingPoints[0].getMapX();
    this.camHeight2 = this.trackingPoints[2].getCam2X() - this.trackingPoints[1].getCam2X();
    this.camWidth2 = this.trackingPoints[3].getCam2Y() - this.trackingPoints[2].getCam2Y();
    return true;
  }

  /** Creates a new tracking point based
   * @param camX -> cam 1 x position
   * @param camY -> cam 1 y position
   * @param cam2X -> cam 2 x position
   * @param cam2Y -> cam 2 y position.
   * Only points that overlap the two cameras will have data for both camX and cam2X.  Otherwise
   * One set of cam points will be 0.
   * @param mapX -> The x position on the map
   * @param mapY -> the y position on the map
   */
  public createTrackingPoint(camX: number, camY: number, cam2X: number, cam2Y: number, mapX: number, mapY: number) {
    this.trackingPoints.push(new TrackingPoint(camX, camY, cam2X, cam2Y, mapX, mapY));
  }

  /** Uses the track method to convert any point to map coordinates.
   * @param dataPoint Camera coordinates and cam id.
   * @return the map coordinates.
   */
  public convertCamCoordinatesToMapCoordinates(dataPoint) {
    return this.track(this.getCenterX(dataPoint.corners), this.getCenterY(dataPoint.corners), dataPoint.camera);
  }

  /**
* Gets the center X position of the marker.
* @return x center.
*/
  private getCenterX(corners) {
    return (corners[0].x + corners[2].x) * 0.5;
  }


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  private getCenterY(corners) {
    return (corners[0].y + corners[2].y) * 0.5;
  }

  /** This routine tracks the marker on the table by converting the data returned by
   * the camera into coordinates of the overall map.  
   * @param x X position in the camera.
   * @param y Y position in the camera.
   * @param camId Id of the camera (top or bottom camera)
   * @return the x and y position marker in map coordinates.
   */
  public track(x: number, y: number, camId: number): { x: number, y: number } {
    if (camId === 1) {
      // First Get the actualy X Position
      const cameraX = this.camHeight - y;
      const cameraY = this.camWidth - x;
      const camXPercentage = 1 - cameraX / this.camWidth;
      const camYPercentage = 1 - cameraY / this.camHeight;
      const actualXDistance = camXPercentage * this.mapWidth - this.xOffset;
      let actualYDistance = camYPercentage * this.mapHeight;
      actualYDistance += this.trackingPoints[5].getMapY() / 2 - this.yOffset;
      return { x: actualXDistance, y: actualYDistance };
    } else {
      // First Get the actualy X Position
      const cameraX = this.camHeight2 - y;
      const cameraY = this.camWidth2 - x;
      const camXPercentage = 1 - cameraX / this.camWidth2;
      const camYPercentage = 1 - cameraY / this.camHeight2;
      const actualXDistance = camXPercentage * this.mapWidth2 - this.xOffset2;
      let actualYDistance = camYPercentage * this.mapHeight2 - this.yOffset2;
      return { x: actualXDistance, y: actualYDistance };
    }

  }

  public incrementXOffset(): void {
    this.xOffset++;
  }

  public incrementYOffset(): void {
    this.yOffset++;
  }

  public decrementXOffset(): void {
    this.xOffset--;
  }

  public decrementYOffset(): void {
    this.yOffset--;
  }

  public incrementXOffset2(): void {
    this.xOffset2++;
  }

  public incrementYOffset2(): void {
    this.yOffset2++;
  }

  public decrementXOffset2(): void {
    this.xOffset2--;
  }

  public decrementYOffset2(): void {
    this.yOffset2--;
  }

  public stopCalibration(): void {
    this.calibrating = false;
  }

  public isTrackingSet(): boolean {
    return this.trackingIsSet;
  }

  /** Generates a configuration file after the table is calibrated manually.
   * File needs to go into the assets folder.
   */
  public generateFile(): void {
    const filename = 'defaultTrackingPoints.js';
    const text = this.getText();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /** Generates text for the calibration config file from the tracking point array
   * @return the string to print to the file
   */
  private getText(): any {
    let text = '';
    text += `export const defaultTrackingPoints = {\r\n`;
    text += `offsets: {\r\n`;
    text += `xOffset: ${this.xOffset},\r\n`;
    text += `yOffset: ${this.yOffset},\r\n`;
    text += `xOffset2: ${this.xOffset2},\r\n`;
    text += `yOffset2: ${this.yOffset2},\r\n`;
    text += `},\r\n`;
    text += `trackingPoints: [\r\n`;
    this.trackingPoints.forEach(point => {
      text += `{\r\n`;
      text += `cam2X: ${point.getCam2X()},\r\n`;
      text += `cam2Y: ${point.getCam2Y()},\r\n`;
      text += `camX: ${point.getCamX()},\r\n`;
      text += `camY: ${point.getCamY()},\r\n`;
      text += `mapX: ${point.getMapX()},\r\n`;
      text += `mapY: ${point.getMapY()},\r\n`;
      text += `},\r\n`;
    });
    text += `]\r\n`;
    text += `};`;
    return text;
  }

  /**
   * Returns the current tracking point that is being set up.
   * @return The current tracking point index.
   */
  public getTrackingPointId(): number {
    return this.trackingPoints.length;
  }
}

