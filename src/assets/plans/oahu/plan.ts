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
        icon: 'transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        fileUrl: 'assets/plans/oahu/layers/transmission.json'
      },
      {
        name: 'dod',
        displayName: 'DOD Lands',
        active: false,
        included: true,
        icon: 'dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        fileUrl: 'assets/plans/oahu/layers/dod.json'
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        included: true,
        icon: 'parks-icon.png',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        fileUrl: 'assets/plans/oahu/layers/parks.json'
      },
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        active: false,
        included: true,
        icon: 'existing_re-icon.png',
        fillColor: mapLayerColors.Existing_RE.fill,
        borderColor: mapLayerColors.Existing_RE.border,
        fileUrl: 'assets/plans/oahu/layers/existing_re_2.json'
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        icon: 'wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        fileUrl: 'assets/plans/oahu/layers/wind_2.json'
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        icon: 'agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        fileUrl: 'assets/plans/oahu/layers/agriculture.json'
      },
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        active: false,
        included: true,
        icon: 'ial-icon.png',
        fillColor: mapLayerColors.Ial.fill,
        borderColor: mapLayerColors.Ial.border,
        fileUrl: null
      }
    ],
  }
}
