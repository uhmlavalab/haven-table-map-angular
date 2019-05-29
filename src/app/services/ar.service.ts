import { Injectable } from '@angular/core';
import { Marker } from '../interfaces/marker';
import { markers } from '../../assets/defaultData/markers';
import AR from 'js-aruco';

@Injectable({
  providedIn: 'root'
})

/* This servce contains all the functions and data that controls
* the ar interaction with the pucks and markers */
export class ArService {

  detector: any; // Aruco JS detector object
  tickFunction = null;
  width: number;
  height: number;

  /* The array holding the video feeds is created by the video feed components.
  * The tick cannot be started until there is at least one video element */
  videoFeedArray: any[] = [];

  /* Array holding all of the projectable marker data and objects.
  * These objects are referenced against the data that is collected from the
  * arucojs marker data.  The detector object. */
  markerArray: Marker[] = [];

  constructor() {
    /* Aruco Js library requires AR.AR. for access */
    this.detector = new AR.AR.Detector();
    this.tickFunction = this.tick.bind(this);

    // Load Markers With Default data
    this.markerArray = markers;
    console.log(this.markerArray);

  }

  /* Detects the Markers and makes the changes in the program */
  tick(): void {
    setTimeout(() => requestAnimationFrame(this.tickFunction), 200);
    this.videoFeedArray.forEach(videoFeed => {
      if (videoFeed.video.readyState === videoFeed.video.HAVE_ENOUGH_DATA) {
        const imageData = this.snapshot(videoFeed);
        const markers = this.detector.detect(imageData);
      }
    });
  }

  /**
 * Creates an image from the video feed so that the app can look for markers.
 * @param videoElement Object containing the video and the canvas for each video input.
 * @return Returns the image data to be analyzed by the AR library
 */
  snapshot(videoElement): any {
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
  runApplication(videoFeeds: any[]): boolean {
    this.videoFeedArray = videoFeeds;
    if (this.videoFeedArray.length === 0) {
      console.log("Video Elements Not Instantiated");
      return false;
    } else {
      requestAnimationFrame(this.tickFunction);
      return true;
    }
  }
}