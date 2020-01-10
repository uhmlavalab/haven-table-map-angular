import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UiServiceService } from '@app/services/ui-service.service';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.css']
})
export class YearComponent implements AfterViewInit {

  @ViewChild('wrapper', {static: false}) wrapperElement: ElementRef;
  private year: number;

  constructor(private uiService: UiServiceService) {
    this.year = 2016;
  }

  ngAfterViewInit() {

    this.uiService.yearSubject.subscribe({
      next: value => {
        this.year = value;
      }
    });
  }
}
