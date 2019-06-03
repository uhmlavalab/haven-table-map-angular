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
        icon: 'transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        fileUrl: 'assets/plans/maui/layers/transmission.json'
      },
      {
        name: 'dod',
        displayName: 'DOD Lands',
        active: false,
        included: true,
        icon: 'dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        fileUrl: 'assets/plans/maui/layers/dod.json'
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        included: true,
        icon: 'parks-icon.png',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        fileUrl: 'assets/plans/maui/layers/parks.json'
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        icon: 'wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        fileUrl: 'assets/plans/maui/layers/wind_2.json'
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        icon: 'agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        fileUrl: 'assets/plans/maui/layers/agriculture.json'
      }
    ],
  }
}
