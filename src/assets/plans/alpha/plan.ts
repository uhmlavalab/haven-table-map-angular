import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';

export const AlphaPlan: Plan = {
  name: 'alpha',
  displayName: 'Alpha',
  landingImagePath: 'assets/plans/alpha/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/backgrounds/alpha-renewable-background.jpg',
  includeSecondScreen: false,
  selectedPlan: false,
  minYear: 1991,
  maxYear: 2000,
  scenarios: [
    {
      name: 'alpha',
      displayName: 'Alpha Scenario',
    },
  ],
  css: {
    map: {
      left: '27.5vw',
      top: '3vh'
    },
    legend: {
      defaultLayout: 'vertical',
      grid: {
        left: '28vw',
        top: '2vh',
        width: '26vw'
      },
      vertical: {
        left: '26vw',
        top: '3vh',
        width: '10vw'
      }
    },
    title: {
      left: '91vw',
      top: '57vh'
    },
    scenario: {
      left: '58vw',
      top: '88vh'
    },
    charts: {
      pie: {
        left: '30.5vw',
        top: '66vh'
      },
      line: {
        left: 'calc(100vw - 325px)',
        top: '0vh'
      }
    }
  },
  data: {
    capacityPath: 'assets/plans/alpha/data/capacity.csv',
    generationPath: 'assets/plans/alpha/data/generation.csv',
    batteryPath: 'assets/plans/alpha/data/battery.csv',
    curtailmentPath: 'assets/plans/alpha/data/curtailment.csv',
    colors: chartColors
  },
  map: {
    scale: 0.265,
    width: 3613,
    height: 2794,
    bounds: [[-158.281, 21.710], [-157.647, 21.252]],
    baseMapPath: 'assets/plans/alpha/images/base-map.png',
    mapLayers: [
      {
        name: 'casinos',
        displayName: 'Casinos',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/casinos.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          for (let i = AlphaPlan.minYear; i <= AlphaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/alpha/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          console.log(planservice.getCurrentYear());
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'climbing',
        displayName: 'Climbing',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/climbing.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          for (let i = AlphaPlan.minYear; i <= AlphaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/alpha/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          console.log(planservice.getCurrentYear());
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'forested',
        displayName: 'Forests',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/forests.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          for (let i = AlphaPlan.minYear; i <= AlphaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/alpha/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          console.log(planservice.getCurrentYear());
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'population',
        displayName: 'Population',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/population.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          for (let i = AlphaPlan.minYear; i <= AlphaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/alpha/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          console.log(planservice.getCurrentYear());
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'regions',
        displayName: 'Regions',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/regions.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          this.layers.push({ year: 1991, path: `assets/plans/alpha/layers/${this.name}/${this.name}-allyears.png` });
          this.imageref.attr('xlink:href', this.layers[0].path);
        },
        updateFunction(planservice: PlanService) {
        },
      },
      {
        name: 'roads',
        displayName: 'Roads',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/roads.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          for (let i = AlphaPlan.minYear; i <= AlphaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/alpha/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          console.log(planservice.getCurrentYear());
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'transport',
        displayName: 'Transport',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/transport.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
          for (let i = AlphaPlan.minYear; i <= AlphaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/alpha/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          console.log(planservice.getCurrentYear());
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
    ],
  }
};
