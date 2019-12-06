import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ArService } from '@app/services/ar.service';
import { _ } from 'underscore';
import { ContentDeliveryService } from '@app/services/content-delivery.service';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.css']
})
export class CalibrationComponent implements OnInit {
  
  // Create an array of the children tagged with MapSelectionDirectiveDirective
  @ViewChild('manualPoint', { static: false }) manualPoint;

  /* Calibration */
  private calibrating: boolean;                 // Is the map in a calibrating state.
  private detectionWarning: boolean;            // True when user tries to store a data point and marker is not detected.
  private markerDetected: boolean;              // If marker is detected on the table during calibration, then this is true.  Otherwise false.
  private manualPosition: number;               // Identifies which location to place the dot during calibration.

  /* Data For Calibration */
  private centerX: number;                      // Top Camera X
  private centerY: number;                      // Top Camera Y
  private centerX2: number;                     // Bottom Camera X
  private centerY2: number;                     // Bottom Camera Y

  constructor(private arservice: ArService, private contentDeliveryService: ContentDeliveryService) {
    this.setupCalibrationData();
   }

  ngOnInit() {
    this.arservice.calibrationSubject.subscribe({
      next: value => {
        this.calibrationDetected(value);
      }
    });
  }

   /** Initializes the data used for calibrating the pucks */
   private setupCalibrationData(): void {
    this.calibrating = false;
    this.detectionWarning = false;
    this.markerDetected = false;
    this.manualPosition = -1;
    this.centerX = 0;
    this.centerY = 0;
    this.centerX2 = 0;
    this.centerY2 = 0;
  }

  /*****************************************************************************************************
   * ***************************************************************************************************
   * ************************* Calibration Related Functions *******************************************
   * ***************************************************************************************************
   * ***************************************************************************************************
   */

  

  /** Starts the Calibration process.  This is called from the HTML button */
  private startCalibration(): void {
    this.calibrating = true; // Update State
    this.arservice.startCalibration(); // Update the state in the service
    this.manualPosition = 0; // Position 0
    this.manualCalibration(this.manualPosition); // Begin Calibration
  }

  /** The manual Calibration function determines where to place the dot on the map.  This is the dot
   * that tells the user where to place the puck during calibration.
   * @param position A number between 0 - 5.
   */
  private manualCalibration(position: number): void {
    const element = this.manualPoint.nativeElement; // Dot that tells user where to place puck for calibration
    let left = '0';
    let top = '0';

    switch (position) {
      case 0: {
        break;
      }
      case 1: {
        left = 'calc(22vw - 50px)';
        break;
      }
      case 2: {
        top = '50vh';
        break;
      }
      case 3: {
        left = 'calc(22vw - 50px)';
        top = '50vh';
        break;
      }
      case 4: {
        top = 'calc(96% - 50px)';
        break;
      }
      case 5: {
        left = 'calc(22vw - 50px)';
        top = 'calc(96% - 50px)';
        break;
      }
      default: { // When index hits 6, the function is finished
        this.calibrating = false;
        this.arservice.completeCalibration(true);
        this.testTracking(); // Begin the offset adjustment process
        break;
      }
    }
    
    /** Move the dot */
    element.style.left = left;
    element.style.top = top;
  }

  /** Tells HMTL template to display a warning */
  private displayCalibrationWarning(): void {
    this.detectionWarning = true;
    setTimeout(() => {
      this.detectionWarning = false;
    }, 2000);
  }

  /** Confirms a marker position and stores the data as a tracking point. It validates that
   * the correct data has been collected before storing anything.
  */
  private confirmPosition(): void {

    // Check to make certain the marker is detected and on the table.
    if (!this.markerDetected) {
      this.displayCalibrationWarning();
      return;
    }

    // Validate data
    if (this.arservice.getTrackingPointId() === 0 || this.arservice.getTrackingPointId() === 1) {
      if (this.centerX2 === 0 || this.centerY2 === 0) {
        alert('Top Camera did not capture any location Data.  Please try again.');
        return;
      }
    } else if (this.arservice.getTrackingPointId() === 2 || this.arservice.getTrackingPointId() === 3) {
      if (this.centerX2 === 0 || this.centerY2 === 0 || this.centerX === 0 || this.centerY === 0) {
        alert('At least one data point was not captured.  Please Try Again');
        return;
      }
    } else {
      if (this.centerX === 0 || this.centerY === 0) {
        alert('Bottom Camera did not capture any location Data.  Please Try Again.');
        return;
      }
    }

    const element = this.manualPoint.nativeElement.getBoundingClientRect();
    const mapX = (element.right + element.left) / 2;
    const mapY = (element.top + element.bottom) / 2;
    this.arservice.createTrackingPoint(this.centerX, this.centerY, this.centerX2, this.centerY2, mapX, mapY);
    this.manualPosition++;
    this.manualCalibration(this.manualPosition); // Continue to next position.
  }

  /** Calibration data is displayed at the top of the screen.  Data is passed from the subscription to the arservice.
   * @param calibrationData marker data.
   */
  private calibrationDetected(calibrationData: any): void {

    if (calibrationData.length > 0) {
      this.markerDetected = true;
      calibrationData.forEach(pm => {
        if (pm.camera === 1) {
          this.centerX = pm.marker.getCenterX(pm.corners);
          this.centerY = pm.marker.getCenterY(pm.corners);
        }

        if (pm.camera === 2) {
          this.centerX2 = pm.marker.getCenterX(pm.corners);
          this.centerY2 = pm.marker.getCenterY(pm.corners);
        }
      });
    } else {
      this.markerDetected = false;
      this.centerX = 0;
      this.centerY = 0;
      this.centerX2 = 0;
      this.centerY2 = 0;
    }
  }

  /** Begins the process of fine tuning the x and y offests.*/
  private testTracking(): void {
    this.contentDeliveryService.routeLanding('testTracking');
  }

}
