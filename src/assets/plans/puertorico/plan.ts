import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';
import { ConvertPropertyBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';

export const PuertoRico: Plan = {
  name: 'puertorico',
  displayName: 'Puerto Rico',
  landingImagePath: 'assets/plans/puertorico/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/puertorico/images/second-screen-images/backgrounds/oahu-renewable-background.jpg',
  includeSecondScreen: false,
  selectedPlan: false,
  minYear: 2019,
  maxYear: 2019,
  scenarios: [
    {
      name: 'puertoricoscenario',
      displayName: 'Puerto Rico',
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
    capacityPath: 'assets/plans/puertorico/data/capacity.csv',
    generationPath: 'assets/plans/puertorico/data/generation.csv',
    batteryPath: 'assets/plans/opuertoricoahu/data/battery.csv',
    curtailmentPath: 'assets/plans/puertorico/data/curtailment.csv',
    colors: chartColors
  },
  map: {
    scale: 0.235,
    width: 3613,
    height: 2794,
    bounds: [[-67.2714, 18.5161], [-65.5898, 17.9267]],
    baseMapPath: 'assets/plans/puertorico/images/puertorico-base.png',
    mapLayers: [
      {
        name: 'agriculture',
        displayName: 'Agriculture',
        active: false,
        included: true,
        iconPath: 'assets/plans/puertorico/images/icons/agriculture-icon.png',
        secondScreenImagePath: 'assets/plans/oahu/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'This layer depicts the available locational capacity for distributed energy resources. The layer changes to red as DER from the PSIP plan is added to the available capacity.',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/puertorico/layers/agriculture.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'rustic',
        displayName: 'Rustic',
        active: false,
        included: true,
        iconPath: 'assets/plans/puertorico/images/icons/existing_re-icon.png',
        secondScreenImagePath: 'assets/plans/oahu/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'This layer depicts the available locational capacity for distributed energy resources. The layer changes to red as DER from the PSIP plan is added to the available capacity.',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/puertorico/layers/rustic.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'developable_pv',
        displayName: 'PV Potential',
        active: false,
        included: true,
        iconPath: 'assets/plans/puertorico/images/icons/solar-icon.png',
        secondScreenImagePath: 'assets/plans/oahu/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'This layer depicts the available locational capacity for distributed energy resources. The layer changes to red as DER from the PSIP plan is added to the available capacity.',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        borderWidth: 0.5,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/puertorico/layers/developable.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'protected',
        displayName: 'Protected',
        active: false,
        included: true,
        iconPath: 'assets/plans/puertorico/images/icons/dod-icon.png',
        secondScreenImagePath: 'assets/plans/oahu/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'This layer depicts the available locational capacity for distributed energy resources. The layer changes to red as DER from the PSIP plan is added to the available capacity.',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/puertorico/layers/protected.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },      {
        name: 'transmission',
        displayName: 'Transmission',
        active: false,
        included: true,
        iconPath: 'assets/plans/puertorico/images/icons/transmission-icon.png',
        secondScreenImagePath: 'assets/plans/oahu/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'This layer depicts the available locational capacity for distributed energy resources. The layer changes to red as DER from the PSIP plan is added to the available capacity.',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Transmission.fill,
        filePath: 'assets/plans/puertorico/layers/transmission.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      }
    ],
  }
};
