import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';

export const BetaPlan: Plan = {
  name: 'beta',
  displayName: 'Beta',
  landingImagePath: 'assets/plans/beta/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/beta/images/second-screen-images/backgrounds/bigIsland.jpg',
  includeSecondScreen: false,
  selectedPlan: false,
  minYear: 1991,
  maxYear: 2000,
  scenarios: [
    {
      name: 'postapril',
      displayName: 'Post April',
    },
    {
      name: 'e3',
      displayName: 'E3'
    }
  ],
  data: {
    capacityPath: 'assets/plans/beta/data/capacity.csv',
    generationPath: 'assets/plans/beta/data/generation.csv',
    batteryPath: 'assets/plans/beta/data/battery.csv',
    curtailmentPath: 'assets/plans/oahu/data/curtailment.csv',
    colors: chartColors
  },
  css: {
    map: {
      left: '24.5vw',
      top: '-30vh'
    },
    legend: {
      defaultLayout: 'grid',
      grid: {
        left: '27vw',
        top: '5vh',
        width: '21vw'
      },
      vertical: {
        left: '25vw',
        top: '11vh',
        width: '10vw'
      }
    },
    title: {
      left: '64vw',
      top: '82vh'
    },
    scenario: {
      left: '27vw',
      top: '6vh'
    },
    charts: {
      pie: {
        left: '27vw',
        top: '61vh'
      },
      line: {
        left: 'calc(100vw - 325px)',
        top: '0vh'
      }

    }
  },
  map: {
    scale: 0.44,
    width: 2179,
    height: 2479,
    bounds: [[-156.0618, 20.2696], [-154.8067, 18.9105]],
    baseMapPath: 'assets/plans/beta/images/base-map.png',
    mapLayers: [
      {
        name: 'off',
        displayName: 'No Layer',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/no-stopping.png',
        secondScreenImagePath: 'assets/plans/beta/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
        legendColor: 'black',
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        imageref: null,
        layers: [],
        setupFunction(planservice: PlanService) {
        },
        updateFunction(planservice: PlanService) {}
      },
      {
        name: 'attractions',
        displayName: 'Attractions',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/attractions.png',
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
          for (let i = BetaPlan.minYear; i <= BetaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/beta/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'forests',
        displayName: 'Forests',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/forests.png',
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
          for (let i = BetaPlan.minYear; i <= BetaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/beta/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'golf',
        displayName: 'Golf',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/golf.png',
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
          for (let i = BetaPlan.minYear; i <= BetaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/beta/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'population',
        displayName: 'Population',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/population.png',
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
          for (let i = BetaPlan.minYear; i <= BetaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/beta/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'regions',
        displayName: 'Regions',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/regions.png',
        secondScreenImagePath: 'assets/plans/beta/images/second-screen-images/layer-images/parks.jpg',
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
          this.layers.push({ year: 1991, path: `assets/plans/beta/layers/${this.name}/${this.name}-allyears.png` });
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
        iconPath: 'assets/plans/beta/images/icons/roads.png',
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
          for (let i = BetaPlan.minYear; i <= BetaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/beta/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
      {
        name: 'transport',
        displayName: 'Transport',
        active: false,
        included: true,
        iconPath: 'assets/plans/beta/images/icons/transport.png',
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
          for (let i = BetaPlan.minYear; i <= BetaPlan.maxYear; i++) {
            this.layers.push({ year: i, path: `assets/plans/beta/layers/${this.name}/${this.name}-${i}.png` });
          }
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
        updateFunction(planservice: PlanService) {
          this.imageref.attr('xlink:href', this.layers.find(el => el.year === planservice.getCurrentYear()).path);
        },
      },
    ],
  }
}
