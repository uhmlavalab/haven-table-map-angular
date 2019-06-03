import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';

export const MauiPlan: Plan = {
  name: 'maui',
  displayName: 'Maui',
  landingImagePath: 'assets/plans/maui/images/landing-image.jpg',
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
    capacityPath: 'assets/plans/maui/data/capacity.csv',
    generationPath: 'assets/plans/maui/data/generation.csv',
    batteryPath: 'assets/plans/maui/data/battery.csv',
    colors: chartColors
  },
  map: {
    scale: 0.258,
    width: 3613,
    height: 2794,
    bounds: [[-156.6969, 21.03142], [-155.9788, 20.5746]],
    baseMapPath: 'assets/plans/maui/images/base-map.png',
    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        included: true,
        iconPath: 'assets/plans/maui/images/icons/transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/maui/layers/transmission.json',
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
        iconPath: 'assets/plans/maui/images/icons/dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/maui/layers/dod.json',
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
        iconPath: 'assets/plans/maui/images/icons/parks-icon.png',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/maui/layers/parks.json',
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
        iconPath: 'assets/plans/maui/images/icons/wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/maui/layers/wind_2.json',
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
        iconPath: 'assets/plans/maui/images/icons/solar-icon.png',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/maui/layers/solar.json',
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
        iconPath: 'assets/plans/maui/images/icons/agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/maui/layers/agriculture.json',
        fillFunction: (d3: any, parcels: any[], active: boolean) => {
          parcels.forEach(el => {
            d3.select(el.path).style('opacity', active ? 0.5 : 0.0);
          });
        }
      }
    ],
  }
}
