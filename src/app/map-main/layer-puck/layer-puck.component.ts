import { Component, AfterViewInit, ViewChildren, ViewChild, HostListener } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-layer-puck',
  templateUrl: './layer-puck.component.html',
  styleUrls: ['./layer-puck.component.css']
})
export class LayerPuckComponent implements AfterViewInit {

  @ViewChildren('iconContainer') icons;
  @ViewChildren('slideIconContainer') slideIcons;
  @ViewChild('iconContainer', { static: false }) iconContainer;
  @ViewChild('layerPuckContainer', { static: false }) puckContainer;

  private numberOfIcons: number;
  private iconImages: { icon: string, text: string, image: string, active: boolean}[] = [];
  private currentIcon: { icon: string, text: string, image: string, active: boolean};
  private currentIconIndex: number;
  private iconElements: any[] = [];
  private currentPosition: number;
  private angle: number;
  private slideImages: { icon: string, text: string, active: boolean }[] = [];
  private slideIconElements: any[] = [];

  constructor(private planService: PlanService, private mapService: MapService) {

    this.planService.getCurrentPlan().map.mapLayers.forEach(layer => {
      this.iconImages.push({
        icon: layer.iconPath,
        text: layer.displayName,
        image: layer.iconPath,
        active: false
      });
    });

  // Subscribe to layer toggling
  this.mapService.toggleLayerSubject.subscribe((layer) => {
    if (!layer.active) {
      setTimeout(() => {
        this.iconElements[this.currentIconIndex].style.opacity = 1;
        this.slideIconElements[this.currentIconIndex].style.opacity = 0;
      }, 600);
      this.repositionSlideIcon();
    } else {
      this.repositionSlideIcon();
      this.slideUp();
    }
  });

    this.currentIconIndex = 0;
    this.currentIcon = this.iconImages[this.currentIconIndex];
   }

  ngAfterViewInit() {
    this.iconElements = this.icons.first.nativeElement.children;
    this.slideIconElements = this.slideIcons.first.nativeElement.children;
    this.positionElements(this.iconElements);

    this.mapService.layerChangeSubject.subscribe(direction => {
      this.cycle(direction);
    });
    this.repositionSlideIcon();
  }

  private positionElements(elements) {
    const iconCount = elements.length;
    this.angle = 360 / iconCount;
    this.currentPosition = 0;

    for (const e of elements) {
      e.style.transform = `rotate(-${this.currentPosition}deg) translate(65px) rotate(90deg)`;
      this.currentPosition += this.angle;
    };

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

  private decrementCurrentIconIndex() {
    if (this.currentIconIndex === 0) {
      this.currentIconIndex = this.iconImages.length - 1;
    } else {
      this.currentIconIndex--;
    }
    this.currentIcon = this.iconImages[this.currentIconIndex];
  }

  private incrementCurrentIconIndex() {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.iconImages.length;
    this.currentIcon = this.iconImages[this.currentIconIndex];
  }

  private repositionSlideIcon() {
    const puckIcon = this.iconElements[this.currentIconIndex];
    const slideIcon = this.slideIconElements[this.currentIconIndex];

    const viewPortOffset = puckIcon.getBoundingClientRect();
    const offsetLeft = viewPortOffset.left;
    const offsetTop = viewPortOffset.top;

    const puckViewPortOffset = this.puckContainer.nativeElement.getBoundingClientRect();
    slideIcon.style.left = `${offsetLeft - puckViewPortOffset.left}px`;
    slideIcon.style.top = `${offsetTop - puckViewPortOffset.top}px`;
  }



  private slideUp() {
    this.repositionSlideIcon();
    const puckIcon = this.iconElements[this.currentIconIndex];
    const slideIcon = this.slideIconElements[this.currentIconIndex];

    this.currentIcon.active = true;
    puckIcon.style.opacity = 0;
    slideIcon.style.opacity = 1;
    slideIcon.style.top = '-1000px';
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'u') {
      if (this.currentIcon.active) {
        this.currentIcon.active = false;
        setTimeout(() => {
          this.iconElements[this.currentIconIndex].style.opacity = 1;
          this.slideIconElements[this.currentIconIndex].style.opacity = 0;
        }, 600);
        this.repositionSlideIcon();
      } else {
        this.repositionSlideIcon();
        this.slideUp();
      }
    }
  }
}
