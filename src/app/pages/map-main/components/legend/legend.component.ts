import { Component, ViewChildren, AfterViewInit } from '@angular/core';
import { MapLayer } from '@app/interfaces';
import { _ } from 'underscore';
import { PlanService } from '@app/services/plan.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements AfterViewInit {

  layers: MapLayer[];
  width: number;
  private legendClass: string;

  @ViewChildren('legendCards') legendElements;
  

  constructor(private planService: PlanService) {
    this.layers = this.planService.getLayers();
  }

  ngAfterViewInit() {
    this.planService.toggleLayerSubject.subscribe({
      next: value => {
        const active = value.active;
        const color = value.legendColor;
        const name = value.name;
        this.toggleLegendColor(active, color, name);
      }
    });
    this.arrangeCards();
  }

  private arrangeCards() {
    const cardSpacing = 10;
    const numLayers = this.layers.length > 8 ? this.layers.length : 8;
    const windowHeight = window.innerHeight;
    const cardHeight = Math.floor(windowHeight / numLayers);
    this.legendElements.forEach(element => {
      element.nativeElement.style.height = `${cardHeight - 4 * cardSpacing }px`;
      element.nativeElement.style.marginTop = `${cardSpacing * 1.5}px`;
      element.nativeElement.style.marginBottom = `${cardSpacing * 1.5}px`;
      element.nativeElement.style.padding = `${cardSpacing }px`;
      element.nativeElement.style.width = `${cardHeight - 4 * cardSpacing }px`;
    });
  }

  private toggleLegendColor(active, color, name): void {
    this.legendElements.forEach(e => {
      if (e.nativeElement.id === name) {
        e.nativeElement.style.backgroundColor = active ? color : 'black';
      }
    })
  }
}