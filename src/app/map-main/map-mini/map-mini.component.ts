import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlanService } from '../../services/plan.service';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/interfaces';

@Component({
  selector: 'app-map-mini',
  templateUrl: './map-mini.component.html',
  styleUrls: ['./map-mini.component.css']
})
export class MapMiniComponent implements OnInit {

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  circlePos = [-158.00, 21.42];

  @ViewChild('miniMapDiv', { static: true }) mapDiv: ElementRef;

  constructor(private mapService: MapService, private planService: PlanService) {
    this.scale = mapService.getMapScale();
    this.width = 1400 * this.scale;
    this.height = 1400 * this.scale;
    this.rasterBounds = mapService.getMapBounds();
    this.baseMapImagePath = mapService.getBaseMapPath();
  }

  ngOnInit() {
    const projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

    const path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const bounds = [projection(this.rasterBounds[0]), projection(this.rasterBounds[1])];
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

    d3.json(`assets/plans/oahu/layers/coastline.json`, (error, geoData) => {
      this.map.selectAll('outline')
        .data(geoData.features)
        .enter().append('path')
        .attr('d', this.path)
        .attr('class', 'coastline')
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
      this.map.selectAll('circle')
        .data([this.circlePos as [number, number]]).enter()
        .append('circle')
        .attr('cx', (d) => this.projection(d)[0])
        .attr('cy', (d) => this.projection(d)[1])
        .attr('r', '4px')
        .attr('fill', 'red');
      const x = 5;
     //  d3.select('svg').on('mousemove', this.fuckme(x, this));
    });
    this.mapService.circlePositionSub.subscribe(pos => {
      console.log(pos);
    });

  }

  fuckme(x: number, y) {
    console.log(x);
    console.log(d3.mouse(y));
  }


}
