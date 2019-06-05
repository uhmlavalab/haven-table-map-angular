import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlanService } from '../../services/plan.service';
import { MapDirective } from './map.directive';
import * as d3 from 'd3/d3.min';

@Component({
  selector: 'app-map-element',
  templateUrl: './map-element.component.html',
  styleUrls: ['./map-element.component.css']
})

export class MapElementComponent implements OnInit, OnDestroy {

  /* These properties are set in the map-data service */
  scale: number;  // The scale of the map
  width: number; // Width of the image
  height: number; // Height of the image
  rasterBounds: any[]; // Bounds of the map
  currentYear: number; // The current year displayed on the map
  currentScenario: string; // The current scenario displayed on the map
  layers: any;
  IAL: boolean;
  projection: any;
  mapImageUrl: string;
  path: any;
  map: any;


  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;

  @ViewChild(MapDirective, { static: true }) mapElement;

  constructor(private mapService: MapService, private planService: PlanService) {
    try {
      this.currentYear = planService.getCurrentPlan().minYear;
      this.scale = mapService.getMapScale();
      this.width = mapService.getMapImageWidth() * this.scale;
      this.height = mapService.getMapImageHeight() * this.scale;
      this.rasterBounds = mapService.getMapBounds();
      this.currentScenario = null;
      this.mapImageUrl = planService.getCurrentPlan().map.baseMapPath;
    } catch (errpr) {
      console.log("No Current Plan Found");
    }

    this.layers = {};
    this.IAL = false;

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
      .attr('xlink:href', `${this.mapImageUrl}`)
      .attr('width', this.width)
      .attr('height', this.height);

    this.mapService.getLayers().forEach(layerElement => {
      if (layerElement.filePath === null) {
        return;
      }
      d3.json(`${layerElement.filePath}`, (error, geoData) => {
        const bounds = [this.projection(this.rasterBounds[0]), this.projection(this.rasterBounds[1])];
        const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
        const transform = [
          (this.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
          (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2
        ];

        const proj = d3.geo.mercator()
          .scale(scale)
          .translate(transform);

        const path = d3.geo.path()
          .projection(proj);

        const layer = {
          enabled: true,
          parcels: [],
          fillColor: layerElement.fillColor,
          lineColor: layerElement.borderColor,
          lineWidth: '1px',
          year: this.currentYear
        };

        this.map.selectAll(layerElement.name)
          .data(geoData.features)
          .enter().append('path')
          .attr('d', path)
          .attr('class', layerElement.name)
          .each(function (d) {
            layer.parcels.push({ path: this });
            d3.select(this)
              .style('fill', layer.fillColor)
              .style('opacity', layerElement.active ? 0.5 : 0.0)
              .style('stroke', layer.lineColor)
              .style('stroke-width', layer.lineWidth);
          }).call(() => {
            this.layers[layerElement.name] = layer;
          });
      });
    });

    // Subscribe to current year
    this.planService.yearSubject.subscribe({
      next: value => {
        this.currentYear = value as number;
      }
    });

    this.mapService.toggleLayerSubject.subscribe((layer) => {
      if (layer.filePath !== null) {
        layer.fillFunction(d3, this.layers[layer.name].parcels, layer.active);
      }
    });

  }
  ngOnDestroy(): void {
    console.log('Map Destroy');
  }

  // addGeoJsonLayer(layer:)

  /*
      addGeoJsonLayer(fileUrl, layerName, year, fillColor, lineColor, lineWidth) {
        d3.json(`${fileUrl}`, (error, geoData) => {
          const bounds = [this.projection(this.rasterBounds[0]), this.projection(this.rasterBounds[1])];
          const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
          const transform = [(this.width - scale * (bounds[1][0] + bounds[0][0])) / 2, (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2];

          const proj = d3.geo.mercator()
            .scale(scale)
            .translate(transform)

          const path = d3.geo.path()
            .projection(proj)

          const layer = {
            enabled: true,
            parcels: [],
            fillColor: fillColor,
            lineColor: lineColor,
            lineWidth: lineWidth,
            year: year
          }

          this.map.selectAll(layerName)
            .data(geoData.features)
            .enter().append('path')
            .attr("d", path)
            .attr('class', layerName)
            .each(function (d) {
              if (layerName == 'solar') {
                const cf = d.properties.cf_1;
                const capacity = d.properties.capacity;
                const value = cf * capacity * 8760;
                const ial = (d.properties.IAL == "Y") ? true : false;
                layer.parcels.push({ 'path': this, 'value': value, 'ial': ial });
              }
              else if (layerName == 'wind') {
                const cf = 0.2283942;
                const capacity = d.properties.MWac;
                const value = cf * capacity * 8760;
                const type = d.properties.type;
                layer.parcels.push({ 'path': this, 'value': capacity, 'type': type });
              }
              else {
                d3.select(this)
                  .style('fill', fillColor)
                  .style('opacity', 0.5)
                  .style('stroke', lineColor)
                  .style('stroke-width', lineWidth + 'px')
              }
            }).call(() => {
              this.layers[layerName] = layer;
              if (layerName == 'solar') {
                this.layers[layerName].parcels.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
                this.setSolarParcelsColor(year, 'postapril');
              }
              if (layerName == 'wind') {
                this.layers[layerName].parcels.sort((a, b) => parseFloat(b.type) - parseFloat(a.type) || parseFloat(b.value) - parseFloat(a.value));
                this.setWindParcelsColor(year, 'postapril');
              }
            })
        });
      }

      /*

      setSolarParcelsColor(year, scenario) {
        this.currentYear = year;
        this.currentScenario = scenario;
        this.layers['solar'].year = year;
        if (this.layers['solar'].enabled) {
          let solarTotal = 0;
          solarGenYearly.forEach(el => {
            if (el.year == year) {
              solarTotal = el[scenario];
            }
          });
          this.layers['solar'].parcels.forEach(el => {
            if (el.ial && this.IAL) {
              d3.select(el.path)
              .style('fill', "#000000")
              .style('opacity', 1.0)
              .style('stroke', "#000000")// this.layers['solar'].lineColor)
              .style('stroke-width', this.layers['solar'].lineWidth + 'px');
            }
            else if (solarTotal > 0) {
              d3.select(el.path)
                .style('fill', this.layers['solar'].fillColor)
                .style('opacity', 0.5)
                .style('stroke', this.layers['solar'].lineColor)
                .style('stroke-width', this.layers['solar'].lineWidth + 'px');
              solarTotal -= el.value;
            } else {
              d3.select(el.path)
                .style('fill', 'transparent')
                .style('opacity', 0.5)
                .style('stroke', this.layers['solar'].lineColor)
                .style('stroke-width', this.layers['solar'].lineWidth + 'px');
            }
          })
        }
      }

      toggleIAL() {
        this.IAL = !this.IAL;
        this.setSolarParcelsColor(this.currentYear, this.currentScenario);
      }

      setWindParcelsColor(year, scenario) {
        this.layers['wind'].year = year;
        if (this.layers['wind'].enabled) {
          let windTotal = 0;
          windGenYearly.forEach(el => {
            if (el.year == year) {
              windTotal = el[scenario] - 99;

            }
          });
          this.layers['wind'].parcels.forEach(el => {
            if (windTotal > 0) {
              d3.select(el.path)
                .style('fill', this.layers['wind'].fillColor)
                .style('opacity', 1.0)
                .style('stroke', this.layers['wind'].lineColor)
                .style('stroke-width', this.layers['wind'].lineWidth + 'px');
                windTotal -= el.value;
            } else {
              d3.select(el.path)
                .style('fill', 'transparent')
                .style('opacity', 0.5)
                .style('stroke', this.layers['wind'].lineColor)
                .style('stroke-width', this.layers['wind'].lineWidth + 'px');
            }
          })
        }
      }

      toggleLayer(layerName) {
        this.layers[layerName].enabled = !this.layers[layerName].enabled;
        if (layerName == 'solar') {
          this.setSolarParcelsColor(this.layers['solar'].year);
        }
        if (layerName == 'wind') {
          this.setWindParcelsColor(this.layers['wind'].year);
        }
        if (!this.layers[layerName].enabled) {
          this.map.selectAll(`.${layerName}`).style('opacity', 0.0);
        } else {
          this.map.selectAll(`.${layerName}`).style('opacity', 0.5);
        }

      }

      hideLayer(layerName) {
        this.layers[layerName].enabled = false;
        if (layerName == 'solar') {
          this.setSolarParcelsColor(this.layers['solar'].year);
        }
        if (layerName == 'wind') {
          this.setWindParcelsColor(this.layers['wind'].year);
        }
          this.map.selectAll(`.${layerName}`).style('opacity', 0.0);
      }

      showLayer(layerName) {
        this.layers[layerName].enabled = true;
        if (layerName == 'solar') {
          this.setSolarParcelsColor(this.layers['solar'].year);
        }
        if (layerName == 'wind') {
          this.setWindParcelsColor(this.layers['wind'].year);
        }
          this.map.selectAll(`.${layerName}`).style('opacity', 0.5);
      }

      removeLayer(layerName) {
        this.map.selectAll(`.${layerName}`).remove();
      }
      */
}
