import { Layer } from 'src/app/interfaces/layer';

export const layers = {
  oahu: [
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
  ],
  maui: [],
  bigisland: []

}
