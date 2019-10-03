import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MultiWindowService, Message } from 'ngx-multi-window';
import { Plan } from '../interfaces/plan';
import { OahuPlan } from '../../assets/plans/oahu/plan';
import { MauiPlan } from '../../assets/plans/maui/plan';
import { BigIslandPlan } from '../../assets/plans/bigisland/plan';
import * as d3 from 'd3';

import { MapLayer, Parcel, Scenario } from '@app/interfaces';
import { PlanSecondScreenService } from '@app/services/plan-second-screen.service';


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
  private plan: Plan;
  private currentScenario: Scenario;

  selectedLayer: MapLayer;

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  legendLeft = '5vw';
  legendTop = '100px';
  legendWidth = '90vw';
  legendHeight = '10vh';


  @ViewChild('mapDiv', { static: false }) mapDiv: ElementRef;

  constructor(private multiWindowService: MultiWindowService, private detectorRef: ChangeDetectorRef, private planService: PlanSecondScreenService) {
    multiWindowService.name = 'secondScreen';
  }

  ngAfterViewInit(): void {

    this.multiWindowService.onMessage().subscribe((value: Message) => {
      const data = JSON.parse(value.data);
      switch (data.type) {
        case 'setup':
          this.setupSecondScreen(data);
          break;
        case 'year':
          this.planService.setCurrentYear(data.year);
          this.yearUpdate();
          break;
        case 'layer':
          this.planService.setLayer(data.name);
          break;
        case 'map':
          this.updateMap(data);
          break;
        case 'toggleLayer':
          this.planService.toggleLayer(data.name);
          this.layerToggle();
          break;
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
    this.currentYear = this.plan.minYear;
    this.currentScenario = this.plan.scenarios[0];
    this.selectedLayer = this.plan.map.mapLayers[0];
    this.setupMap();

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
      .duration(200).attr('transform', 'translate(' + (t[0] + ',' + t[1]) + ') scale(' + scale + ')');
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

  layerToggle() {
    const layer = this.planService.getSelectedLayer();
    if (layer.updateFunction !== null) {
      layer.updateFunction(this.planService);
    } else {
      this.defaultFill(layer);
    }
  }

  yearUpdate() {
    this.currentYear = this.planService.getCurrentYear();
    const layers = this.planService.getLayers();
    layers.forEach(layer => {
      if (layer.updateFunction !== null && layer.active) {
        layer.updateFunction(this.planService);
      }
    });
  }

  scenarioUpdate() {
    this.currentScenario = this.planService.getCurrentScenario();
  }

  layerUpdate(layer: MapLayer) {
    this.selectedLayer = this.planService.getSelectedLayer();
  }


}
