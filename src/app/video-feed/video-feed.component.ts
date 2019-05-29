import { Component, OnInit, ViewChild } from '@angular/core';
import { ArService } from '../services/ar.service';

@Component({
  selector: 'app-video-feed',
  templateUrl: './video-feed.component.html',
  styleUrls: ['./video-feed.component.css']
})
export class VideoFeedComponent implements OnInit {
  @ViewChild('videoElement') videoElement: any;
  @ViewChild('videoElement1') videoElement1: any;
  @ViewChild('videoCanvas1') videoCanvas1: any;
  @ViewChild('videoCanvas2') videoCanvas2: any;

  devices: any[] = [];
  videoArray: any[] = [];
  canvasWidth: number;
  canvasHeight: number;

  private static numberOfFeeds: number = 0;
  private static MAX_FEEDS: number = 2;

  constructor(private _arservice: ArService) {
    this.canvasWidth = 300;
    this.canvasHeight = 300;
  }

  ngOnInit() {
    this.videoArray = [
      {
        video: this.videoElement.nativeElement,
        canvas: {
          element: this.videoCanvas1.nativeElement,
          width: this.canvasWidth,
          height: this.canvasHeight,
          ctx: this.videoCanvas1.nativeElement.getContext("2d")
        },
      },
      {
        video: this.videoElement1.nativeElement,
        canvas: {
          element: this.videoCanvas2.nativeElement,
          width: this.canvasWidth,
          height: this.canvasHeight,
          ctx: this.videoCanvas2.nativeElement.getContext("2d")
        },
      }];

    /* Set Up the Video Feeds */
    navigator.mediaDevices.enumerateDevices().then(this.getDevices)
      .then(feeds => {
        feeds.forEach(feed => {
          if (VideoFeedComponent.numberOfFeeds < VideoFeedComponent.MAX_FEEDS) {
            this.initCamera(feed, this.videoArray[VideoFeedComponent.numberOfFeeds++].video);
          }
        })
      })
      .then(this._arservice.runApplication(this.videoArray));
  }


  /** Initializes the camera
  * @param feed => The id of the video feed to connect to the video element
  * @param vid => The html video element
  * @return true when completed.
  */
  initCamera(feed, vid) {
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: feed }
      }
    }).then(stream => {
      vid.srcObject = stream;
      vid.play();
    });
    return true;
  }

  /** This function detects the videoinput elements connected to the
  * machine.
  * @param devices => a list of all devices;
  * @return an array of only videoinput devices.
  */
  getDevices(devices): any[] {
    const videoFeeds: any[] = [];
    devices.forEach(device => {
      if (device.kind === 'videoinput') {
        videoFeeds.push(device.deviceId);
      }
    });
    return videoFeeds;
  }


}
