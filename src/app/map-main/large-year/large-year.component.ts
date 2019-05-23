import { Component, OnInit } from '@angular/core';
import { MapDataService } from '../../services/map-data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-large-year',
  templateUrl: './large-year.component.html',
  styleUrls: ['./large-year.component.css']
})
export class LargeYearComponent implements OnInit {

  currentYear: number;

  constructor(private _mapdataservice: MapDataService) {
    this.currentYear = _mapdataservice.getCurrentYear();
  }

  ngOnInit() {
      this._mapdataservice.yearSubject.subscribe({
        next: value => {
          this.currentYear = <number>value;
        }
      });
  }

}
