export const layers = [
  {
    name: 'solar',
    displayName: 'Solar Energy',
    colorName: 'Solar',
    active: false,
    icon: 'solar-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //  createFn: () => map.addGeoJsonLayer(`../layers/${island}/solar.json`, 'solar', 2020, mapLayerColors.Solar.fill, mapLayerColors.Solar.border, 0.2)
  },
  {
    name: 'transmission',
    displayName: 'Transmission Lines',
    colorName: 'Transmission',
    active: false,
    icon: 'transmission-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //createFn: () => map.addGeoJsonLayer(`../layers/${island}/transmission.json`, 'transmission', null, mapLayerColors.Transmission.fill, mapLayerColors.Transmission.border, 1.0)
  },
  {
    name: 'dod',
    displayName: 'DOD Lands',
    colorName: 'Dod',
    active: false,
    icon: 'dod-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //createFn: () => map.addGeoJsonLayer(`../layers/${island}/dod.json`, 'dod', null, mapLayerColors.Dod.fill, mapLayerColors.Dod.border, 0.5)
  },
  {
    name: 'parks',
    displayName: 'Park Lands',
    colorName: 'Parks',
    active: false,
    icon: 'parks-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //createFn: () => map.addGeoJsonLayer(`../layers/${island}/parks.json`, 'parks', null, mapLayerColors.Parks.fill, mapLayerColors.Parks.border, 0.5)
  },
  {
    name: 'existing_re',
    displayName: 'Existing Renewables',
    colorName: 'Existing_RE',
    active: false,
    icon: 'existing_re-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //createFn: () => map.addGeoJsonLayer(`../layers/${island}/existing_re_2.json`, 'existing_re', null, mapLayerColors.Existing_RE.fill, mapLayerColors.Existing_RE.border, 0.5)
  },
  {
    name: 'wind',
    displayName: 'Wind Energy',
    colorName: 'Wind',
    active: false,
    icon: 'wind-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //createFn: () => map.addGeoJsonLayer(`../layers/${island}/wind_2.json`, 'wind', 2020, mapLayerColors.Wind.fill, mapLayerColors.Wind.border, 0.25)
  },
  {
    name: 'agriculture',
    displayName: 'Ag Lands',
    colorName: 'Agriculture',
    active: false,
    icon: 'agriculture-icon.png',
    included: false,
    checked: 'checked',
    color: ''
    //createFn: () => map.addGeoJsonLayer(`../layers/${island}/agriculture.json`, 'agriculture', null, mapLayerColors.Agriculture.fill, mapLayerColors.Agriculture.border, 0.5)
  },
  {
    name: 'ial',
    displayName: 'Important Ag Lands',
    colorName: 'Ial',
    active: false,
    icon: 'ial-icon.png',
    included: false,
    checked: 'checked',
    color: ''
  }];
