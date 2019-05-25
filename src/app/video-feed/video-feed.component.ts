import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-feed',
  templateUrl: './video-feed.component.html',
  styleUrls: ['./video-feed.component.css']
})
export class VideoFeedComponent implements OnInit {
  @ViewChild('videoElement') videoElement: any;
  @ViewChild('videoElement1') videoElement1: any;

  devices: any[] = [];
  videoArray: any[] = [];

  private static numberOfFeeds: number = 0;
  private static MAX_FEEDS: number = 2;

  constructor() {
  }

  ngOnInit() {
    this.videoArray = [this.videoElement.nativeElement, this.videoElement1.nativeElement];
    /* Set Up the Video Feeds */
    navigator.mediaDevices.enumerateDevices().then(this.getDevices).then(feeds => {
      feeds.forEach(feed => {
        if (VideoFeedComponent.numberOfFeeds < VideoFeedComponent.MAX_FEEDS) {
          this.initCamera(feed, this.videoArray[VideoFeedComponent.numberOfFeeds++]);
        }
      });
    });
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
