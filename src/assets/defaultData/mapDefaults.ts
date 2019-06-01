import { Layer } from 'src/app/interfaces/layer';

export const mapDefaults = {
  oahu: {
    scale: 0.237,
    imageWidth: 3613,
    imageHeight: 2794,
    bounds: [[-158.281, 21.710], [-157.647, 21.252]],
    imageName: 'oahu.png',
    layers: [
      {
        name: 'solar',
        displayName: 'Solar Energy',
        colorName: 'Solar',
        active: false,
        icon: 'solar-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/solar.json'
      } as Layer,
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        colorName: 'Transmission',
        active: false,
        icon: 'transmission-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/transmission.json'
      } as Layer,
      {
        name: 'dod',
        displayName: 'DOD Lands',
        colorName: 'Dod',
        active: false,
        icon: 'dod-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/dod.json'
      } as Layer,
      {
        name: 'parks',
        displayName: 'Park Lands',
        colorName: 'Parks',
        active: false,
        icon: 'parks-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/parks.json'
      } as Layer,
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        colorName: 'Existing_RE',
        active: false,
        icon: 'existing_re-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/existing_re_2.json'
      } as Layer,
      {
        name: 'wind',
        displayName: 'Wind Energy',
        colorName: 'Wind',
        active: false,
        icon: 'wind-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/wind_2.json'
      } as Layer,
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        colorName: 'Agriculture',
        active: false,
        icon: 'agriculture-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/oahu/agriculture.json'
      } as Layer,
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        colorName: 'Ial',
        active: false,
        icon: 'ial-icon.png',
        included: false,
        color: '',
        fileUrl: null
      } as Layer
    ]
  },
  maui: {
    scale: 0.258,
    imageWidth: 3613,
    imageHeight: 2794,
    bounds: [[-156.6969, 21.0316], [-155.9788, 20.3738]],
    imageName: '../basemaps/maui.png',
    layers: [
      {
        name: 'solar',
        displayName: 'Solar Energy',
        colorName: 'Solar',
        active: false,
        icon: 'solar-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/solar.json'
      } as Layer,
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        colorName: 'Transmission',
        active: false,
        icon: 'transmission-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/transmission.json'
      } as Layer,
      {
        name: 'dod',
        displayName: 'DOD Lands',
        colorName: 'Dod',
        active: false,
        icon: 'dod-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/dod.json'
      } as Layer,
      {
        name: 'parks',
        displayName: 'Park Lands',
        colorName: 'Parks',
        active: false,
        icon: 'parks-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/parks.json'
      } as Layer,
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        colorName: 'Existing_RE',
        active: false,
        icon: 'existing_re-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/existing_re_2.json'
      } as Layer,
      {
        name: 'wind',
        displayName: 'Wind Energy',
        colorName: 'Wind',
        active: false,
        icon: 'wind-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/wind_2.json'
      } as Layer,
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        colorName: 'Agriculture',
        active: false,
        icon: 'agriculture-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/maui/agriculture.json'
      } as Layer,
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        colorName: 'Ial',
        active: false,
        icon: 'ial-icon.png',
        included: false,
        color: '',
        fileUrl: null
      } as Layer
    ]
  },
  bigisland: {
    scale: 0.267,
    imageWidth: 2179,
    imageHeight: 2479,
    bounds: [[-156.0618, 20.2696], [-154.8067, 18.9105]],
    imageName: 'bigisland.png',
    layers: [
      {
        name: 'solar',
        displayName: 'Solar Energy',
        colorName: 'Solar',
        active: false,
        icon: 'solar-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/solar.json'
      } as Layer,
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        colorName: 'Transmission',
        active: false,
        icon: 'transmission-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/transmission.json'
      } as Layer,
      {
        name: 'dod',
        displayName: 'DOD Lands',
        colorName: 'Dod',
        active: false,
        icon: 'dod-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/dod.json'
      } as Layer,
      {
        name: 'parks',
        displayName: 'Park Lands',
        colorName: 'Parks',
        active: false,
        icon: 'parks-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/parks.json'
      } as Layer,
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        colorName: 'Existing_RE',
        active: false,
        icon: 'existing_re-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/existing_re_2.json'
      } as Layer,
      {
        name: 'wind',
        displayName: 'Wind Energy',
        colorName: 'Wind',
        active: false,
        icon: 'wind-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/wind_2.json'
      } as Layer,
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        colorName: 'Agriculture',
        active: false,
        icon: 'agriculture-icon.png',
        included: false,
        color: '',
        fileUrl: 'assets/layers/bigisland/agriculture.json'
      } as Layer,
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        colorName: 'Ial',
        active: false,
        icon: 'ial-icon.png',
        included: false,
        color: '',
        fileUrl: null
      } as Layer
    ]
  }
};
