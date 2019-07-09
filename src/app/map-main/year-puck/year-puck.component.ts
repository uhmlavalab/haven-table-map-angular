import { Component, HostListener, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';

@Component({
  selector: 'app-year-puck',
  templateUrl: './year-puck.component.html',
  styleUrls: ['./year-puck.component.css']
})
export class YearPuckComponent implements AfterViewInit {

  @ViewChildren('yearBoxWrapper') yearBoxes;
  @ViewChild('yearBoxWrapper', {static: false}) yearBoxWrapper;

  private numberOfYears: number;
  private years: {year: number, filled: boolean}[] = [];
  private currentYear: number;
  private angle: number;
  private yearBoxElements: any[];
  private currentPosition: number;

  constructor() {
    this.currentPosition = 0;
    this.currentYear = 2016;
    this.numberOfYears = 30;
    for (let i = 0; i < this.numberOfYears; i++) {
      this.years.push({year: i + 2016, filled: false});
    }
   }

  ngAfterViewInit() {
    this.yearBoxElements = this.yearBoxes.first.nativeElement.children;
    this.positionElements(this.yearBoxElements);
    this.colorNodes();
  }

  private colorNodes() {
    for (let index = 0; index < 30; index++) {
      if (index <= this.currentYear - 2016) {
        this.yearBoxElements[index].style.backgroundColor = 'rgb(104, 10, 112)';
      } else {
        this.yearBoxElements[index].style.backgroundColor = 'transparent';
      }
    }
  }

  private positionElements(elements) {
    this.angle = 360 / elements.length;
    this.currentPosition = 0;

    for (const e of elements) {
      e.style.transform = `rotate(${this.currentPosition}deg) translate(65px)`;
      this.currentPosition += this.angle;
    }

    this.yearBoxWrapper.nativeElement.style.transform = 'rotate(-90deg)';
  }


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.incrementYear();
      this.colorNodes();
    } else if (event.key === 'ArrowLeft') {
      this.decrementYear();
      this.colorNodes();
    }
  }

  private incrementYear() {
    if (this.currentYear >= 2016 && this.currentYear < 2045) {
      this.currentYear++;
    }
  }
  private decrementYear() {
    if (this.currentYear <= 2045 && this.currentYear > 2016) {
      this.currentYear--;
    }
  }
}
