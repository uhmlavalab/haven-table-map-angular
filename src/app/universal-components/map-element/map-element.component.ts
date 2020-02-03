import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/interfaces';

import { loadModules } from "esri-loader";

@Component({
  selector: 'app-map-element',
  templateUrl: './map-element.component.html',
  styleUrls: ['./map-element.component.css']
})

export class MapElementComponent implements OnInit, OnDestroy {

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;


  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;
  view: any;

  constructor(private planService: PlanService) {

    // this.scale = this.planService.getMain() ? planService.getMapScale() : planService.getMiniMapScale();
    // this.width = planService.getMapImageWidth() * this.scale;
    // this.height = planService.getMapImageHeight() * this.scale;
    // this.rasterBounds = planService.getMapBounds();
    // this.baseMapImagePath = planService.getBaseMapPath();
  }

  ngOnInit() {

    document.addEventListener('keypress', (event) => this.logKey(event));


    this.initializeMap();
    // this.projection = d3.geo.mercator()
    //   .scale(1)
    //   .translate([0, 0]);

    // this.path = d3.geo.path()
    //   .projection(this.projection);

    // this.map = d3.select(this.mapDiv.nativeElement).append('svg')
    //   .attr('width', this.width)
    //   .attr('height', this.height);

    // this.map.append('image')
    //   .attr('xlink:href', `${this.baseMapImagePath}`)
    //   .attr('width', this.width)
    //   .attr('height', this.height);

    // this.planService.getLayers().forEach(layer => {
    //   if (layer.filePath === null) {
    //     return;
    //   }
    //   d3.json(`${layer.filePath}`, (error, geoData) => {
    //     const bounds = [this.projection(this.rasterBounds[0]), this.projection(this.rasterBounds[1])];
    //     const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
    //     const transform = [
    //       (this.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
    //       (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2
    //     ] as [number, number];

    //     const proj = d3.geo.mercator()
    //       .scale(scale)
    //       .translate(transform);

    //     const path = d3.geo.path()
    //       .projection(proj);

    //     this.map.selectAll(layer.name)
    //       .data(geoData.features)
    //       .enter().append('path')
    //       .attr('d', path)
    //       .attr('class', layer.name)
    //       .each(function (d) {
    //         layer.parcels.push({ path: this, properties: (d.hasOwnProperty(`properties`)) ? d[`properties`] : null } as Parcel);
    //       }).call(() => {
    //         if (layer.setupFunction !== null) {
    //           layer.setupFunction(this.planService);
    //         } else {
    //           this.defaultFill(layer);
    //         }
    //       });
    //   });
    // });

    // // Subscribe to layer toggling
    this.planService.toggleLayerSubject.subscribe(layer => {
      console.log(layer);
      // if (layer) {
      //   if (layer.updateFunction !== null) {
      //     layer.updateFunction(this.planService);
      //   } else {
      //     this.defaultFill(layer);
      //   }
      // }
    });

    this.planService.updateLayerSubject.subscribe(layer => {
      console.log(layer);
      // if (layer) {
      //   if (layer.updateFunction !== null && this.planService.getCurrentPlan()) {
      //     layer.updateFunction(this.planService);
      //   } else {
      //     //this.defaultFill(layer);
      //   }
      // }
    });

    this.planService.yearSubject.subscribe(year => {
      console.log(year);
      // if (year) {
      //   const layers = this.planService.getLayers();
      //   layers.forEach(layer => {
      //     if (layer.updateFunction !== null && layer.active) {
      //       layer.updateFunction(this.planService);
      //     }
      //   });
      // }
    });
  }

  logKey(e) {
    let cam = this.view.camera.clone()
    switch (e.code) {
      case "Numpad4":
        cam.position.longitude = this.view.camera.position.longitude - 0.001;
        this.view.goTo(cam);
        break;
      case "Numpad8":
        cam.position.latitude = this.view.camera.position.latitude + 0.001;
        this.view.goTo(cam);
        break;
      case "Numpad6":
        cam.position.longitude = this.view.camera.position.longitude + 0.001;
        this.view.goTo(cam);
        break;
      case "Numpad2":
        cam.position.latitude = this.view.camera.position.latitude - 0.001;
        this.view.goTo(cam);
        break;
      case "Numpad7":
        cam.heading = this.view.camera.heading - 0.25;
        this.view.goTo(cam);
        break;
      case "Numpad9":
        cam.heading = this.view.camera.heading + 0.25;
        this.view.goTo(cam);
        break;
      case "NumpadAdd":
        cam.position.z = this.view.camera.position.z - 1000;
        this.view.goTo(cam);
        break;
      case "NumpadSubtract":
        cam.position.z = this.view.camera.position.z + 1000;
        this.view.goTo(cam);
        break;

    }
  }

  async initializeMap() {
    try {
      const [WebMap, SceneView, MapImageLayer] = await loadModules([
        "esri/WebMap",
        "esri/views/SceneView",
        "esri/layers/MapImageLayer",
        "esri/layers/MapImage"
      ]);

      var webmap = new WebMap({
        portalItem: {
          id: "2d7ddfbe1b854b12877fcd96ea3f5b1c"
        },
        displayLevels: [1, 2]
      })
      webmap.when(function () {
        // This function will execute once the promise is resolved
        setTimeout(function () {
          console.log(webmap);
          // webmap.basemap.baseLayers.items[0].tileInfo.lods[16].resolution = 0.018;
          // webmap.basemap.baseLayers.items[0].tileInfo.lods[16].scale = 70.52;
        }, 1000);


      })
        .catch(function (error) {
          // This function will execute if the promise is rejected
          console.log("error: ", error);
        });
      var view = new SceneView({
        container: this.mapDiv.nativeElement,
        map: webmap,
        camera: {
          position: { // observation point
            x: -157.987207,
            y: 21.449828,
            z: 70000 // altitude in meters
          },
          tilt: 0 // perspective in degrees
        }
      });

      this.view = view;
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
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
