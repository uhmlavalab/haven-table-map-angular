import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-feed',
  templateUrl: './video-feed.component.html',
  styleUrls: ['./video-feed.component.css']
})
export class VideoFeedComponent implements OnInit {
  @ViewChild('videoElement') videoElement: any;
  video: any;
  constructor() {
  }

  ngOnInit() {
    this.video = this.videoElement.nativeElement;
    this.start();
  }

  /** Starts the video feed */
  start(): void {
    this.initCamera({ video: true, audio: false });
  }

  /** Includes Sound from the video feed */
  sound(): void {
    this.initCamera({ video: true, audio: true });
  }

  /** Initializes the camera
  * @param config => JSON object containing configuration options
  */
  initCamera(config: any) {
    const browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      this.video.play();
    });
  }
}
