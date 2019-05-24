import { Injectable, ViewChildren } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private numberOfFeedsUsed: number = 0; // Tells the video component which video feed to access.


  constructor() {

  }


  /** Gets the number of video feeds used.
  * @return the number of feeds used
  */
  public getVideoFeedsUsed(): number {
    return this.numberOfFeedsUsed;
  }

  /** Increments number of feeds used.  When a video feed component accesses a video feed,
  * it will then call this function so that the next feed component accesses the next input.
  */
  public incrementVideoFeedUsed(): void {
    this.numberOfFeedsUsed++;
  }
}
