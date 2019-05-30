import { Component, OnInit, HostListener } from '@angular/core';
import { MapDataService } from '../services/map-data.service';
import { ArService } from '../services/ar.service';
import { Island } from '../interfaces/island';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
* And the display components of the table. */
export class MapMainComponent implements OnInit {

  island: Island;

  constructor(private _arservice: ArService, private _mapdataservice: MapDataService, private router: Router) {
    this.island = this._mapdataservice.getSelectedIsland();
  }

  ngOnInit() {
  }

  /**
  * This function gets the css class name to apply to the legend based
  * on the map that is selected.
  * @return the name of the css class
  */
  getLegendClassName(): string {
    return this.island.islandName;
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
    } else if (event.key === 'p') {
      this.router.navigateByUrl('');
      this._mapdataservice.setState('landing');
    }
  }
}
