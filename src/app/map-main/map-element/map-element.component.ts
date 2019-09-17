import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { MapService } from '../../services/map.service';
import { MapDirective } from './map.directive';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/interfaces';
import { WindowRefService } from '@app/services/window-ref.service';

@Component({
  selector: 'app-map-element',
  templateUrl: './map-element.component.html',
  styleUrls: ['./map-element.component.css']
})

export class MapElementComponent implements OnInit {

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  circlePos = [-158.00, 21.42] as [number, number];
  corners = [[0, 0], [0, 0], [0, 0], [0, 0]];

  centerSVG: any;
  line1SVG: any;
  line2SVG: any;
  line3SVG: any;
  line4SVG: any;


  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;

  @ViewChild(MapDirective, { static: true }) mapElement;

  constructor(private planService: PlanService, private mapService: MapService, private secondScreen: WindowRefService) {
    this.scale = planService.getMapScale();
    this.width = planService.getMapImageWidth() * this.scale;
    this.height = planService.getMapImageHeight() * this.scale;
    this.rasterBounds = planService.getMapBounds();
    this.baseMapImagePath = planService.getBaseMapPath();
  }

  ngOnInit() {
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


    this.line1SVG = this.map.selectAll('line1');
    this.line2SVG = this.map.selectAll('line2');
    this.line3SVG = this.map.selectAll('line3');
    this.line4SVG = this.map.selectAll('line4');


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
          .each(function(d) {
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

    this.mapService.circlePositionSub.subscribe(pos => {
      this.circlePos = pos[0];
      this.corners = pos[1];

      this.line1SVG.remove();
      this.line2SVG.remove();
      this.line3SVG.remove();
      this.line4SVG.remove();

      const line1 = [this.corners[0], this.corners[1]];
      const line2 = [this.corners[1], this.corners[3]];
      const line3 = [this.corners[2], this.corners[3]];
      const line4 = [this.corners[2], this.corners[0]];

      this.line1SVG = this.map.selectAll('line1')
        .data([line1])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0] as any)[0])
        .attr('y1', (d) => this.projection(d[0] as any)[1])
        .attr('x2', (d) => this.projection(d[1] as any)[0])
        .attr('y2', (d) => this.projection(d[1] as any)[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line2SVG = this.map.selectAll('line2')
        .data([line2])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0] as any)[0])
        .attr('y1', (d) => this.projection(d[0] as any)[1])
        .attr('x2', (d) => this.projection(d[1] as any)[0])
        .attr('y2', (d) => this.projection(d[1] as any)[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line3SVG = this.map.selectAll('line3')
        .data([line3])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0] as any)[0])
        .attr('y1', (d) => this.projection(d[0] as any)[1])
        .attr('x2', (d) => this.projection(d[1] as any)[0])
        .attr('y2', (d) => this.projection(d[1] as any)[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line4SVG = this.map.selectAll('line4')
        .data([line4])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0] as any)[0])
        .attr('y1', (d) => this.projection(d[0] as any)[1])
        .attr('x2', (d) => this.projection(d[1] as any)[0])
        .attr('y2', (d) => this.projection(d[1] as any)[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
    });


    // Subscribe to layer toggling
    this.planService.toggleLayerSubject.subscribe((layer) => {
<<<<<<< HEAD
      const secondScreenUpdate = {
        type: 'toggleLayer',
        name: layer.name
      };

      this.secondScreen.notifySecondScreen(JSON.stringify(secondScreenUpdate));
      if (layer.updateFunction !== null) {
        layer.updateFunction(this.planService);
      } else {
       this.defaultFill(layer);
=======

      if (layer.updateFunction !== null) {
        layer.updateFunction(this.planService);
      } else {
        this.defaultFill(layer);
>>>>>>> master
      }

    });

    this.planService.updateLayerSubject.subscribe((layer) => {
      if (layer.updateFunction !== null) {
        layer.updateFunction(this.planService);
      } else {
        // this.defaultFill(layer);
      }
    });

    this.planService.yearSubject.subscribe((year) => {
<<<<<<< HEAD
      const layers = this.planService.getLayers();
      layers.forEach(layer => {
        if (layer.updateFunction !== null && layer.active) {
          layer.updateFunction(this.planService);
        } else {
         // this.defaultFill(layer);
=======
      setTimeout(() => {
        if (this.planService.okToUpdate()) {
          const layers = this.planService.getLayers();
          layers.forEach(layer => {
            if (layer.updateFunction !== null && layer.active) {
              layer.updateFunction(this.planService);
            }
          });
>>>>>>> master
        }
      }, 700);
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


}
