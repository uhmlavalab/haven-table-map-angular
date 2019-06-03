import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';

export const BigIslandPlan: Plan = {
  name: 'bigisland',
  displayName: 'Big Island',
  landingImagePath: 'assets/plans/bigisland/images/landing-image.jpg',
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
    }
  ],
  data: {
    capacityPath: 'assets/plans/bigisland/data/capacity.csv',
    generationPath: 'assets/plans/bigisland/data/generation.csv',
    batteryPath: 'assets/plans/bigisland/data/battery.csv',
    colors: chartColors
  },
  map: {
    scale: 0.26,
    width: 2179,
    height: 2479,
    bounds: [[-156.0618, 20.2696], [-154.8067, 18.9105]],
    baseMapPath: 'assets/plans/bigisland/images/base-map.png',
    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/bigisland/layers/transmission.json',
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
        iconPath: 'assets/plans/bigisland/images/icons/dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/bigisland/layers/dod.json',
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
        iconPath: 'assets/plans/bigisland/images/icons/solar-icon.png',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/bigisland/layers/solar.json',
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
        iconPath: 'assets/plans/bigisland/images/icons/wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/bigisland/layers/wind_2.json',
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
        iconPath: 'assets/plans/bigisland/images/icons/agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/bigisland/layers/agriculture.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      }
    ],
  }
}
