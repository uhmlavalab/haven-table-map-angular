import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ArService } from '@app/services/ar.service';
import { ProjectableMarker } from '@app/classes/projectableMarker';
import { _ } from 'underscore';
import { ContentDeliveryService } from '@app/services/content-delivery.service';

@Component({
  selector: 'app-tracking-test',
  templateUrl: './tracking-test.component.html',
  styleUrls: ['./tracking-test.component.css']
})
export class TrackingTestComponent implements OnInit {

  @ViewChild('trackingDot', { static: false }) trackingDot;

  constructor(private arservice: ArService, private contentDeliveryService: ContentDeliveryService) { }

  ngOnInit() {
    this.arservice.calibrationSubject.subscribe({
      next: value => {
        this.track(value);
      }
    });
  }

  /** Tracks the marker on the table.  Uses the same algorithm as the map-main */
  private track(data) {
    if (data != undefined) {
      try {

        ProjectableMarker.getAllProjectableMarkersArray().forEach(pm => {
          const dataPoint = _.find(data, m => m.marker.markerId === pm.markerId);
          pm.addDataPoint(dataPoint);
        });

        const dataPoint = { x: data[0].marker.getMostRecentCenterX(), y: data[0].marker.getMostRecentCenterY() };
        this.trackingDot.nativeElement.style.left = dataPoint.x + 25 + 'px';
        this.trackingDot.nativeElement.style.top = dataPoint.y + 25 + 'px';


      } catch (error) {
        //undefined marker
      }
    }
  }

    /** This ends the final adjustment process of calibration. */
    private completeTrackTesting(): void {
      this.arservice.stopCalibration(); // Stop Calibrating in the service.
      this.arservice.generateFile(); // Create the new calibration File for download.
      this.contentDeliveryService.routeLanding('maps');
      
    }

    
  /* KEYBOARD CONTROLS */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.arservice.incrementYOffset();
    } else if (event.key === 'ArrowDown') {
      this.arservice.decrementYOffset();
    } else if (event.key === 'ArrowLeft') {
      this.arservice.incrementXOffset();
    } else if (event.key === 'ArrowRight') {
      this.arservice.decrementXOffset();
    } else if (event.key === 'w') {
      this.arservice.incrementYOffset2();
    } else if (event.key === 's') {
      this.arservice.decrementYOffset2();
    } else if (event.key === 'a') {
      this.arservice.incrementXOffset2();
    } else if (event.key === 'd') {
      this.arservice.decrementXOffset2();
    }
  }


}
