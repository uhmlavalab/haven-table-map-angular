import { Component, OnInit } from '@angular/core';
import { Plan } from '@app/interfaces/plan';
import { ContentDeliveryService } from '@app/services/content-delivery.service';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements OnInit {

  private plans: Plan[];                        // Array of all possible Plans
  
  constructor(private contentDeliveryService: ContentDeliveryService) {
    this.plans = this.contentDeliveryService.getPlans();  // Initialize the plans. 
  }

  ngOnInit() {
  }

}
