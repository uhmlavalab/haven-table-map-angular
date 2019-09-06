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
  corners = [[0, 0], [0, 0], [0, 0], [0, 0]];

  zoomLvl = 10;

  line1SVG: any;
  line2SVG: any;
  line3SVG: any;
  line4SVG: any;

  @ViewChild('miniMapDiv', { static: true }) mapDiv: ElementRef;

  constructor(private mapService: MapService, private planService: PlanService) {
    this.corners = this.boundingCoordinates(this.circlePos[1], this.circlePos[0], this.zoomLvl);
    window.addEventListener('wheel', event => {
      const zoom = (event.deltaY > 0) ? 1 : -1;
      this.zoom(zoom);
    });
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
          const boundingCoords = that.boundingCoordinates(coords[1], coords[0], that.zoomLvl);
          that.mapService.updateCirclePosition(coords, boundingCoords);
        });


      const line1 = [this.corners[0], this.corners[1]];
      const line2 = [this.corners[1], this.corners[3]];
      const line3 = [this.corners[2], this.corners[3]];
      const line4 = [this.corners[2], this.corners[0]];
      this.line1SVG = this.map.selectAll('line1')
        .data([line1])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line2SVG = this.map.selectAll('line2')
        .data([line2])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line3SVG = this.map.selectAll('line3')
        .data([line3])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line4SVG = this.map.selectAll('line4')
        .data([line4])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
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
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line2SVG = this.map.selectAll('line2')
        .data([line2])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line3SVG = this.map.selectAll('line3')
        .data([line3])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
      this.line4SVG = this.map.selectAll('line4')
        .data([line4])
        .enter()
        .append('line')
        .attr('x1', d => this.projection(d[0])[0])
        .attr('y1', (d) => this.projection(d[0])[1])
        .attr('x2', (d) => this.projection(d[1])[0])
        .attr('y2', (d) => this.projection(d[1])[1])
        .attr('stroke-width', 2)
        .attr('stroke', 'red');
    });


  }

  clicked(d) {
    // Compute centroid of the selected path

    // const centroid = this.path.centroid(d);
    console.log(d);

  }


  boundingCoordinates(lat, lon, distance) {
    const RADIUS = 6371.01;
    const MAX_LAT = Math.PI / 2; // 90 degrees
    const MIN_LAT = -MAX_LAT; // -90 degrees
    const MAX_LON = Math.PI; // 180 degrees
    const MIN_LON = -MAX_LON; // -180 degrees
    const FULL_CIRCLE_RAD = Math.PI * 2;
    const radDist = distance / RADIUS;

    const latRad = (lat) * (Math.PI / 180);
    const lonRad = (lon) * (Math.PI / 180);

    let minLat = latRad - radDist;
    let maxLat = latRad + radDist;

    let minLon = 0;
    let maxLon = 0;

    if (minLat > MIN_LAT && maxLat < MAX_LAT) {
      const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(latRad));
      minLon = lonRad - deltaLon;
      if (minLon < MIN_LON) {
        minLon += FULL_CIRCLE_RAD;
      }
      maxLon = lonRad + deltaLon;
      if (maxLon > MAX_LON) {
        maxLon -= FULL_CIRCLE_RAD;
      }
    } else {
      minLat = Math.max(minLat, MIN_LAT);
      maxLat = Math.min(maxLat, MAX_LAT);
      minLon = MIN_LON;
      maxLon = MAX_LON;
    }
    maxLat *= (180 / Math.PI);
    minLat *= (180 / Math.PI);
    maxLon *= (180 / Math.PI);
    minLon *= (180 / Math.PI);
    const pt1 = [minLon, maxLat];
    const pt2 = [maxLon, maxLat];
    const pt3 = [minLon, minLat];
    const pt4 = [maxLon, minLat];

    return [pt1, pt2, pt3, pt4];
  };

  zoom(zoom: number) {
    this.zoomLvl += zoom;
    this.zoomLvl = Math.max(1, this.zoomLvl);
    const boundingCoords = this.boundingCoordinates(this.circlePos[1], this.circlePos[0], this.zoomLvl);
    this.mapService.updateCirclePosition(this.circlePos, boundingCoords);
  }

}
