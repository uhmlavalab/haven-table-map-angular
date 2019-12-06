import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marker-selection',
  templateUrl: './marker-selection.component.html',
  styleUrls: ['./marker-selection.component.css']
})
export class MarkerSelectionComponent implements OnInit {

    /* Marker Change Variables */
    private tempMarkerChange: { id: number, job: string };  // Holds the data temporarily when reassigning a marker's job and id.
    private markerIcons: { year: string, chart: string, scenario: string, layer: string, unassigned: string }; // Icons used for marker change routine.
  
  constructor() {
  }

  ngOnInit() {
  }
}