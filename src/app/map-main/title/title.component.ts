import { Component, OnInit } from '@angular/core';
import { MapDataService } from '../../services/map-data.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  constructor(private _mapdataservice: MapDataService) { }

  ngOnInit() {
  }

  /** Gets the title of the map
  * @return the name of the map
  */
  getTitle(): string {
    return this._mapdataservice.getSelectedIsland().text;
  }
}
