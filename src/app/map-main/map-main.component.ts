import { Component, OnInit, HostListener } from '@angular/core';
import { MapDataService } from '../services/map-data.service';
import { Island } from '../interfaces/island';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
* And the display components of the table. */
export class MapMainComponent implements OnInit {

  island: Island;

  constructor(private _mapdataservice: MapDataService) {
    this.island = this._mapdataservice.getSelectedIsland();
  }

  ngOnInit() {
  }

  /** KEYBOARD CONTROLS **/
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this._mapdataservice.incrementCurrentYear();
    } else if (event.key === 'ArrowLeft') {
      this._mapdataservice.decrementCurrentYear();
    } else if (event.key === 'ArrowUp') {
      this._mapdataservice.incrementNextLayer();
    } else if (event.key === 'ArrowDown') {
      this._mapdataservice.decrementNextLayer();
    } else if (event.key === 'Enter') {
      this._mapdataservice.addRemoveLayer();
    }
  }
}
