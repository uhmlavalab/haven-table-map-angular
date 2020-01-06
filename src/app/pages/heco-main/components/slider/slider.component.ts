import { Component, AfterViewInit, Input, ViewChild, ElementRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { UiServiceService } from '@app/services/ui-service.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements AfterViewInit {

  @ViewChild('slideElement', {static: false}) slideElement;

  @Input() type: string;

  private dragging: boolean;

  constructor(private uiService: UiServiceService) {

   }

  ngAfterViewInit() {
    this.slideElement.nativeElement.addEventListener('mousedown', this.startDrag);
    this.slideElement.nativeElement.addEventListener('mouseup', this.stopDragging);
    this.slideElement.nativeElement.addEventListener('mousemove', (event) => {
        this.drag(event, this.slideElement);
    });

    this.slideElement.nativeElement.addEventListener('touchstart', this.startDrag);
    this.slideElement.nativeElement.addEventListener('touchend', this.stopDragging);
    this.slideElement.nativeElement.addEventListener('touchmove', (event) => {
      if (this.dragging) {
        this.drag(event, this.slideElement);
      }
    });
  }

  incrementYear() {
    this.uiService.incrementYear();
  }

  decrementYear() {
    this.uiService.decrementYear();
  }

  private startDrag(): void {
    this.dragging = true;
  }

  private stopDragging(): void {
    this.dragging = false;

  }

  private drag(event, e): void {
    const mousex = event.screenX;
    const eWidth = e.nativeElement.getBoundingClientRect().width;
    const parentx = e.nativeElement.parentElement.getBoundingClientRect().left;
    const parentWidth = e.nativeElement.parentElement.getBoundingClientRect().width;

    const left = mousex - parentx;
    if (left > 0 && mousex < parentx + parentWidth ) {
      e.nativeElement.style.left = `${left - eWidth/2}px`;
    }
  }

}
