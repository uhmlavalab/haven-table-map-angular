import { Injectable } from '@angular/core';

import { Marker } from '@app/interfaces';

import { markers } from '../../assets/defaultData/markers';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private markers: Marker[];           // Array holding all marker data.

  constructor() {
    this.markers = markers;
  }

  /** Gets the array of markers
   * @return the array of Markers
   */
  getMarkers(): Marker[] {
    return this.markers;
  }

}
