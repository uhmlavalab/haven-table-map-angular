import { Component, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-layer-puck',
  templateUrl: './layer-puck.component.html',
  styleUrls: ['./layer-puck.component.css']
})
export class LayerPuckComponent implements AfterViewInit {

  @ViewChildren('iconContainer') icons;
  @ViewChild('iconContainer', { static: false }) iconContainer;

  private numberOfIcons: number;
  private iconImages: { icon: string, text: string }[] = [];
  private currentIcon: {icon: string, text: string};
  private currentIconIndex: number;
  private iconElements: any[] = [];
  private currentPosition: number;
  private angle: number;

  constructor(private planService: PlanService, private mapService: MapService) {

    this.planService.getCurrentPlan().map.mapLayers.forEach(layer => {
      this.iconImages.push({
        icon: layer.iconPath,
        text: layer.displayName
      });
    });
   }

  ngAfterViewInit() {
    this.iconElements = this.icons.first.nativeElement.children;
    this.positionElements(this.iconElements);

    this.mapService.layerChangeSubject.subscribe(direction => {
      this.cycle(direction);
    });
  }

  private positionElements(elements) {
    const iconCount = elements.length;
    this.angle = 360 / iconCount;
    this.currentPosition = 0;

    for (const e of elements) {
      e.style.transform = `rotate(${this.currentPosition}deg) translate(65px) rotate(90deg)`;
      this.currentPosition += this.angle;
    }

    this.iconContainer.nativeElement.style.transform = 'rotate(-90deg)';
    this.currentPosition = -90;
  }

  private cycle(direction: string) {
    if (direction === 'increment') {
      this.iconContainer.nativeElement.style.transform = `rotate(${this.currentPosition + this.angle}deg)`;
      this.currentPosition += this.angle;
      this.incrementCurrentIconIndex();
    } else {
      this.iconContainer.nativeElement.style.transform = `rotate(${this.currentPosition - this.angle}deg)`;
      this.currentPosition -= this.angle;
      this.decrementCurrentIconIndex();
    }
  }

  private incrementCurrentIconIndex() {
    if (this.currentIconIndex === 0) {
      this.currentIconIndex = this.iconImages.length - 1;
    } else {
      this.currentIconIndex--;
    }
    this.currentIcon = this.iconImages[this.currentIconIndex];
  }

  private decrementCurrentIconIndex() {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.iconImages.length;
    this.currentIcon = this.iconImages[this.currentIconIndex];
  }
}
