import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UiServiceService } from '@app/services/ui-service.service';
import { PlanService } from '@app/services/plan.service';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.css']
})
export class YearComponent implements AfterViewInit {

  @ViewChild('wrapper', {static: false}) wrapperElement: ElementRef;
  private year: number;

  constructor(private planService: PlanService) {
    this.year = 2016;
  }

  ngAfterViewInit() {

    this.planService.yearSubject.subscribe( year => {
      if (year) {
        this.year = year;
      }
    });
  }
}
