import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-feed',
  templateUrl: './video-feed.component.html',
  styleUrls: ['./video-feed.component.css']
})
export class VideoFeedComponent implements OnInit {
  @ViewChild('videoElement') videoElement: any;
  @ViewChild('videoElement1') videoElement1: any;

  video: any;
  video2: any;
  video3: any;
  devices: any[] = [];

  constructor() {
  }

  ngOnInit() {

    this.video = this.videoElement.nativeElement;
    this.video2 = this.videoElement1.nativeElement;

    navigator.mediaDevices.enumerateDevices().then(this.getDevices).then(feeds => {
      let counter = 0;
      feeds.forEach(feed => {
        if(counter === 0) {
          this.initCamera(feed, this.video);
        } else if ( counter === 1) {
          this.initCamera(feed, this.video2);
        }
        counter++;
      });
    });

  }


  /** Initializes the camera
  * @param config => JSON object containing configuration options
  */
  initCamera(feed, vid) {
    console.log(feed);
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
