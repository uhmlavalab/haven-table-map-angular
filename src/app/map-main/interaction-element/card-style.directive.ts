import { Directive, ElementRef } from '@angular/core';
import { mapLayerColors } from '../../../assets/defaultData/colors';

@Directive({
  selector: '[appCardStyle]'
})

export class CardStyleDirective {

  constructor(private element: ElementRef) {
  }

  /** Changes the background color of the mini-card
  * @param color the new background color
  **/
  changeBackgroundColor(color): void {
    this.element.nativeElement.style.backgroundColor = color;
  }

}
