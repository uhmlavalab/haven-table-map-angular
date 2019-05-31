import { Component, OnInit } from '@angular/core';
import { MapDataService } from '../../services/map-data.service';
import { Island } from '../../interfaces/island';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.css']
})
export class InsideComponent implements OnInit {

  public island: Island;
  year: number;

  constructor(private _mapdataservice: MapDataService) {
    this.year = this._mapdataservice.getCurrentYear();

  }

  ngOnInit() {
    this._mapdataservice.yearSubject.subscribe({
      next: value => {
        this.year = <number>value;
      }
    });
  }

}
