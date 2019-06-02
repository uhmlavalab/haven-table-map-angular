import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';

export const MauiPlan: Plan = {
  name: 'maui',
  displayName: 'Maui',
  landingImagePath: './images/landing-image.jpg',
  secondScreenImagePath: '',
  includeSecondScreen: true,
  selectedIsland: false,
  minYear: 2016,
  maxYear: 2045,
  data: {
    capacityPath: './data/capacity.csv',
    generationPath: './data/generation.csv',
    batteryPath: './data/battery.csv',
    colors: chartColors
  },
  map: {
    scale: 0.237,
    width: 3613,
    height: 2794,
    bounds: [[-158.281, 21.710], [-157.647, 21.252]],
    baseMapPath: './images/base-map.png',
    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        icon: 'transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        fileUrl: './layers/oahu/transmission.json'
      },
      {
        name: 'dod',
        displayName: 'DOD Lands',
        active: false,
        icon: 'dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        fileUrl: './/layers/oahu/dod.json'
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        icon: 'parks-icon.png',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        fileUrl: './layers/oahu/parks.json'
      },
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        active: false,
        icon: 'existing_re-icon.png',
        fillColor: mapLayerColors.Existing_RE.fill,
        borderColor: mapLayerColors.Existing_RE.border,
        fileUrl: './layers/oahu/existing_re_2.json'
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        icon: 'wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        fileUrl: './layers/oahu/wind_2.json'
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        icon: 'agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        fileUrl: './layers/oahu/agriculture.json'
      },
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        active: false,
        icon: 'ial-icon.png',
        fillColor: mapLayerColors.Ial.fill,
        borderColor: mapLayerColors.Ial.border,
        fileUrl: null
      }
    ],
  }
}
