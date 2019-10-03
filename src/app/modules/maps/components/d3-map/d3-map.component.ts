import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/modules/data/interfaces/plan';

@Component({
  selector: 'app-d3-map',
  templateUrl: './d3-map.component.html',
  styleUrls: ['./d3-map.component.css']
})
export class D3MapComponent implements OnInit {

  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;
  @Input() baseImagePath: string;
  @Input() bounds: [[number, number], [number, number]];
  @Input() layers: MapLayer[];

  private baseImage: HTMLImageElement;
  private imageWidth: number;
  private imageHeight: number;
  private divWidth: number;
  private divHeight: number;
  private scale: number;

  private projection: d3.geo.Projection;
  private path: d3.geo.Path;
  private map: d3.Selection<any>;

  constructor() { }

  ngOnInit() {
    this.baseImage = new Image();
    const that = this;
    this.baseImage.addEventListener('load', function () {
      that.imageWidth = this.naturalWidth;
      that.imageHeight = this.naturalHeight;
      that.divWidth = that.mapDiv.nativeElement.offsetWidth;
      that.divHeight = that.mapDiv.nativeElement.offsetHieght;
      that.setupMap();
    });
    this.baseImage.src = this.baseImagePath;
  }

  setupMap() {
    this.projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.divWidth)
      .attr('height', this.divHeight);

    this.map.append('image')
      .attr('xlink:href', `${this.baseImagePath}`)
      .attr('width', this.divWidth)
      .attr('height', this.divHeight);

    const bounds = [this.projection(this.bounds[0]), this.projection(this.bounds[1])];
    this.scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.divWidth, (bounds[1][1] - bounds[0][1]) / this.divHeight);
    const transform = [
      (this.divWidth - this.scale * (bounds[1][0] + bounds[0][0])) / 2,
      (this.divHeight - this.scale * (bounds[1][1] + bounds[0][1])) / 2
    ] as [number, number];

    this.projection = d3.geo.mercator()
      .scale(this.scale)
      .translate(transform);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.layers.forEach(layer => {
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
              layer.setupFunction();
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


}
