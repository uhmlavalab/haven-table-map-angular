import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';

export const OahuPlan: Plan = {
  name: 'oahu',
  displayName: 'Oahu',
  landingImagePath: 'assets/plans/oahu/images/landing-image.jpg',
  secondScreenImagePath: '',
  includeSecondScreen: true,
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
      left: '28vw',
      top: '2vh'
    },
    title: {
      left: '91vw',
      top: '52vh'
    },
    scenario: {
      left: '66vw',
      top: '86vh'
    },
    charts: {
      pie: {
        left: '28vw',
        top: '64vh'
      },
      line: {
        left: 'calc(100vw - 325px)',
        top: 0
      }
    }
  },
  data: {
    capacityPath: 'assets/plans/oahu/data/capacity.csv',
    generationPath: 'assets/plans/oahu/data/generation.csv',
    batteryPath: 'assets/plans/oahu/data/battery.csv',
    colors: chartColors
  },
  map: {
    scale: 0.237,
    width: 3613,
    height: 2794,
    bounds: [[-158.281, 21.710], [-157.647, 21.252]],
    baseMapPath: 'assets/plans/oahu/images/base-map.png',
    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/oahu/layers/transmission.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'dod',
        displayName: 'DOD Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/oahu/layers/dod.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/parks-icon.png',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/oahu/layers/parks.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/existing_re-icon.png',
        fillColor: mapLayerColors.Existing_RE.fill,
        borderColor: mapLayerColors.Existing_RE.border,
        legendColor: mapLayerColors.Existing_RE.fill,
        filePath: 'assets/plans/oahu/layers/existing_re_2.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/oahu/layers/wind_2.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'solar',
        displayName: 'Solar',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/solar-icon.png',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/oahu/layers/solar.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/oahu/layers/agriculture.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      },
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/ial-icon.png',
        fillColor: mapLayerColors.Ial.fill,
        borderColor: mapLayerColors.Ial.border,
        legendColor: mapLayerColors.Ial.fill,
        filePath: null,
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          console.log('Just Ignore Me');
        }
      }
    ],
  }
}
