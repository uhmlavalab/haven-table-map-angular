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
  minYear: 2016,
  maxYear: 2045,
  scenarios: [
    {
      name: 'postapril',
      displayName: 'Post April',
    },
    {
      name: 'e3',
      displayName: 'E3'
    },
    {
      name: 'e3genmod',
      displayName: 'E3 Gen Mod'
    }
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
    baseMapPath: 'assets/plans/alpha/images/base-1991.png',
    mapLayers: [
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/parks-icon.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/alpha/layers/parks.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/existing_re-icon.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/existing_re.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Existing_RE.fill,
        borderColor: mapLayerColors.Existing_RE.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Existing_RE.fill,
        filePath: 'assets/plans/alpha/layers/existing_re.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/agriculture-icon.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/agriculture.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/alpha/layers/agriculture.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'der',
        displayName: 'DER',
        active: false,
        included: true,
        iconPath: 'assets/plans/alpha/images/icons/skull.png',
        secondScreenImagePath: 'assets/plans/alpha/images/second-screen-images/layer-images/agriculture.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: 'orange',
        borderColor: 'orange',
        borderWidth: .1,
        legendColor: 'orange',
        filePath: 'assets/plans/alpha/layers/HECODER.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      }
    ],
  }
};
