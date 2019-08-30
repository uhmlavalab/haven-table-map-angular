import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlanService } from '../../services/plan.service';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/interfaces';

@Component({
  selector: 'app-map-mini',
  templateUrl: './map-mini.component.html',
  styleUrls: ['./map-mini.component.css']
})
export class MapMiniComponent implements AfterViewInit {

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: any;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  circlePos = [-158.00, 21.42] as [number, number];

  @ViewChild('miniMapDiv', { static: true }) mapDiv: ElementRef;

  constructor(private mapService: MapService, private planService: PlanService) {

  }

  ngAfterViewInit() {
    this.scale = this.planService.getCurrentPlan().map.scale;
    this.width = 1400 * this.scale;
    this.height = 1400 * this.scale;
    this.rasterBounds = this.planService.getCurrentPlan().map.bounds;
    this.baseMapImagePath = this.planService.getCurrentPlan().map.baseMapPath;

    this.projection = d3.geo.mercator()
      .scale(25000)
      .center(this.circlePos)
      .translate([this.width / 2, this.height / 2]) as any;

    const path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.path = d3.geo.path()
      .projection(this.projection);
    d3.json(`assets/plans/oahu/layers/coastline.json`, (error, geoData) => {

      const that = this;
      this.map.selectAll('outline')
        .data(geoData.features)
        .enter().append('path')
        .attr('d', this.path)
        .attr('class', 'coastline')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .on('mousemove', function () {
          const pos = d3.mouse(this);
          const px = pos[0];
          const py = pos[1];
          const coords = that.projection.invert([px, py]);
          that.mapService.updateCirclePosition(coords);
        });

      this.map.selectAll('circle')
        .data([this.circlePos]).enter()
        .append('circle')
        .attr('cx', (d) => this.projection(d)[0])
        .attr('cy', (d) => this.projection(d)[1])
        .attr('r', '4px')
        .attr('fill', 'red');
      const x = 5;
    });


    this.mapService.circlePositionSub.subscribe(pos => {
      this.circlePos = pos;
      console.log(pos);
      this.map.selectAll('circle')
        .data([this.circlePos])
        .attr('cx', (d) => this.projection(d)[0])
        .attr('cy', (d) => this.projection(d)[1])
        .attr('r', '4px')
        .attr('fill', 'red');
    });


  }

  clicked(d) {
    // Compute centroid of the selected path

    // const centroid = this.path.centroid(d);
    console.log(d);

  }



}
