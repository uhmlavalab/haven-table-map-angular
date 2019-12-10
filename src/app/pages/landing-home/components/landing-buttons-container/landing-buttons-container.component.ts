import { Component, OnInit } from '@angular/core';
import { LandingButton } from '@app/interfaces/landing-button';
import { ContentDeliveryService } from '@app/services/content-delivery.service';


@Component({
  selector: 'app-landing-buttons-container',
  templateUrl: './landing-buttons-container.component.html',
  styleUrls: ['./landing-buttons-container.component.css']
})
export class LandingButtonsContainerComponent implements OnInit {

  private buttons: LandingButton;               // Button array used to load html elements
  
  constructor(private contentDeliveryService: ContentDeliveryService) {
    this.buttons = contentDeliveryService.getLandingButtonContent();
   }

  ngOnInit() {
  }

  handleClick(route): void {
    this.contentDeliveryService.routeLanding(route);
  }

}
