import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MultiWindowService, Message } from 'ngx-multi-window';
import { Plan } from '../interfaces/plan';
import { OahuPlan } from '../../assets/plans/oahu/plan';
import { MauiPlan } from '../../assets/plans/maui/plan';
import { BigIslandPlan } from '../../assets/plans/bigisland/plan';
import * as d3 from 'd3';

import { MapLayer, Parcel } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';


@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})

/** This component controls the second monitor.  It is a second DOM so all of the data has to be
 * on this page because the main application cannot communicate with it in the same way that it
 * communicates with other components.
 */
export class SecondScreenComponent implements AfterViewInit, OnDestroy {

  private currentYear: number;
  private displayName: string;
  private secondScreenImagePath: string;
  private nextLayer: string;
  private plan: Plan;
  private mapLayers: { text: string, color: string, active: boolean }[] = [];

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  @ViewChild('mapDiv', { static: false }) mapDiv: ElementRef;

  constructor(private multiWindowService: MultiWindowService, private detectorRef: ChangeDetectorRef, private planService: PlanService) {
    multiWindowService.name = 'secondScreen';
    this.planService.secondScreen = true;
  }

  ngAfterViewInit(): void {

    this.multiWindowService.onMessage().subscribe((value: Message) => {
      const data = JSON.parse(value.data);
      if (data.type === 'setup') {
        this.setupSecondScreen(data);
        this.setupMap();
      } else if (data.type === 'year') {
        this.currentYear = data.year;
        this.yearUpdate();
        console.log(this.currentYear);
      } else if (data.type === 'layer') {
        this.nextLayer = data.name;
      } else if (data.type === 'map') {
        this.updateMap(data);
      } else if (data.type === 'toggleLayer') {
        this.layerToggle(data.name);
      }
    });
  }

  ngOnDestroy(): void {
    this.multiWindowService.name = 'dead';
  }

  /** Initializes the second screen when it is opened.  Since data cannot be passed, the possible maps have to be
   * hard coded into the logic.
   * @param data => The setup object
   */
  private setupSecondScreen(data: any): void {
    this.currentYear = data.currentYear;
    switch (data.name) {
      case 'oahu':
        this.plan = OahuPlan;
        break;
      case 'maui':
        this.plan = MauiPlan;
        break;
      case 'bigisland':
        this.plan = BigIslandPlan;
        break;
      default:
        this.plan = OahuPlan;
        break;
    }
    this.detectorRef.detectChanges();
    this.nextLayer = this.plan.map.mapLayers[0].name;
    this.plan.map.mapLayers.forEach(layer => {
      this.mapLayers.push({ text: layer.displayName, color: layer.fillColor, active: false });
    });
  }

  updateMap(data: any) {
    this.width = this.mapDiv.nativeElement.offsetWidth;
    this.height = this.mapDiv.nativeElement.offsetHeight;
    const trans = this.projection(data.center);
    const scaleX = (Math.abs(this.plan.map.bounds[1][1] - this.plan.map.bounds[0][1])) / (Math.abs(data.corners[0][1] - data.corners[2][1]));
    const scaleY = (Math.abs(this.plan.map.bounds[1][0] - this.plan.map.bounds[0][0])) / (Math.abs(data.corners[0][0] - data.corners[1][0]));
    const scale = Math.max(scaleX, scaleY);
    const t = [(-trans[0] + this.width / 2) * scale, (-trans[1] + this.height / 2) * scale] as [number, number];
    this.map.transition()
      .duration(500).attr('transform', 'translate(' + (t[0] + ',' + t[1]) + ') scale(' + scale + ')');
  }


  setupMap() {
    this.planService.setupSelectedPlan(this.plan);
    this.scale = this.planService.getMapScale();
    this.width = this.mapDiv.nativeElement.offsetWidth;
    this.height = this.mapDiv.nativeElement.offsetHeight;
    this.rasterBounds = this.planService.getMapBounds();
    this.baseMapImagePath = this.planService.getBaseMapPath();

    this.projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.map.append('image')
      .attr('xlink:href', `${this.baseMapImagePath}`)
      .attr('width', this.width)
      .attr('height', this.height);

    const bounds = [this.projection(this.rasterBounds[0]), this.projection(this.rasterBounds[1])];
    const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
    const transform = [
      (this.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2
    ] as [number, number];

    this.projection = d3.geo.mercator()
      .scale(scale)
      .translate(transform);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.planService.getLayers().forEach(layer => {
      if (layer.filePath === null) {
        return;
      }
      d3.json(`${layer.filePath}`, (error, geoData) => {
        this.map.selectAll(layer.name)
          .data(geoData.features)
          .enter().append('path')
          .attr('d', this.path)
          .attr('class', layer.name)
          .each(function (d) {
            layer.parcels.push({ path: this, properties: (d.hasOwnProperty(`properties`)) ? d[`properties`] : null } as Parcel);
          }).call(() => {
            if (layer.setupFunction !== null) {
              layer.setupFunction(this.planService);
            } else {
              this.defaultFill(layer);
            }
          });
      });
    });
  }

  defaultFill(layer: MapLayer) {
    layer.parcels.forEach(el => {
      d3.select(el.path)
        .style('fill', layer.fillColor)
        .style('opacity', layer.active ? 0.85 : 0.0)
        .style('stroke', layer.borderColor)
        .style('stroke-width', layer.borderWidth + 'px');
    });
  }

  layerToggle(layername: string) {
    const layer = this.planService.getLayers().find(el => el.name === layername);
    layer.active = !layer.active;
    console.log(layer);
    if (layer.updateFunction !== null) {
      layer.updateFunction(this.planService);
    } else {
      this.defaultFill(layer);
    }
  }

  layerUpdate(layer: MapLayer) {
    if (layer.updateFunction !== null) {
      layer.updateFunction(this.planService);
    } else {
      // this.defaultFill(layer);
    }
  }

  yearUpdate() {
    const layers = this.planService.getLayers();
    this.planService.setCurrentYear(this.currentYear);
    layers.forEach(layer => {
      if (layer.updateFunction !== null && layer.active) {
        layer.updateFunction(this.planService);
      } else {
        // this.defaultFill(layer);
      }
    });
  }


}
