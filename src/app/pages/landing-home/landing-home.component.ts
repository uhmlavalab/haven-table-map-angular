import { Component, OnInit, ViewChild } from '@angular/core';;
import { _ } from 'underscore';
import { ContentDeliveryService } from '@app/services/content-delivery.service';


@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.css']
})

/** This class represents the landing screen of the projectable project */
export class LandingHomeComponent implements OnInit {

  /* Components that show the various views for the landing page. */
  @ViewChild('cams', { static: false}) camView;
  @ViewChild('calibration', { static: false}) calibrationView;
  @ViewChild('markerSelector', { static: false}) markerView;
  @ViewChild('testTracking', { static: false}) testTrackingView;
  @ViewChild('help', { static: false}) helpView;
  @ViewChild('mapSelector', { static: false}) mapView;
  @ViewChild('buttons', { static: false}) buttonView;
  
  private routeArray: any;

  constructor(private contentDeliveryService: ContentDeliveryService) {

    this.routeArray = {
      cams: {
        view: this.camView,
        active: false,
        visible: false
      },
      markers: {
        view: this.markerView,
        active: false,
        visible: false
      },
      maps: {
        view: this.mapView,
        active: true,
        visible: true
      },
      help: {
        view: this.helpView,
        active: false,
        visible: false
      },
      buttons: {
        view: this.buttonView,
        active: true,
        visible: true
      },
      testTracking: {
        view: this.testTrackingView,
        active: false,
        visible: false
      },
      calibrating: {
        view: this.calibrationView,
        active: false,
        visible: false
      }
    }

  }

  ngOnInit() {

    this.contentDeliveryService.landingRouteSubject.subscribe({
      next: value => {
        this.route(value);
      }
    });
  }

  private route(route): void {
    // Loop through the array of views and turn on the correct view.
    Object.keys(this.routeArray).forEach(e => {
      if (e === route) {
        this.routeArray[e].visible = true;
        this.routeArray[e].active = true;
      } else {
        this.routeArray[e].visible = false;
        this.routeArray[e].active = false;
      }
    });
  }
}