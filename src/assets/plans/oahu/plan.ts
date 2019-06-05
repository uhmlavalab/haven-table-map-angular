import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';
import { ConvertPropertyBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';

export const OahuPlan: Plan = {
  name: 'oahu',
  displayName: 'Oahu',
  landingImagePath: 'assets/plans/oahu/images/landing-image.jpg',
  secondScreenImagePath: '',
  includeSecondScreen: false,
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
        iconPath: 'assets/plans/oahu/images/icons/transmission-icon.png',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        borderWidth: 0.02,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/oahu/layers/transmission.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', this.fillColor)
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      },
      {
        name: 'dod',
        displayName: 'DOD Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/dod-icon.png',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/oahu/layers/dod.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/parks-icon.png',
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        filePath: 'assets/plans/oahu/layers/parks.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/existing_re-icon.png',
        fillColor: mapLayerColors.Existing_RE.fill,
        borderColor: mapLayerColors.Existing_RE.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Existing_RE.fill,
        filePath: 'assets/plans/oahu/layers/existing_re.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/wind-icon.png',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        borderWidth: 0.5,
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/oahu/layers/wind.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          let windTotal = planService.getCapacityTotalForCurrentYear(['Wind']);
          this.parcels.sort((a, b) => parseFloat(b.properties.MWac) - parseFloat(a.properties.MWac));
          this.parcels.forEach(parcel => {
            if (windTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
              windTotal -= (parcel.properties.MWac * 0.2283 * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
            }
          });
        },
        updateFunction(planService: PlanService) {
          let windTotal = planService.getGenerationTotalForCurrentYear(['Wind']);
          this.parcels.forEach(parcel => {
            if (windTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0);
              windTotal -= (parcel.properties.MWac * 0.2283 * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0);
            }
          });
        },
      },
      {
        name: 'solar',
        displayName: 'Solar',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/solar-icon.png',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        borderWidth: 0.35,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/oahu/layers/solar.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          let solarTotal = planService.getGenerationTotalForCurrentYear(['PV']);
          this.parcels.sort((a, b) => parseFloat(b.properties.cf_1) - parseFloat(a.properties.cf_1));
          this.parcels.forEach(parcel => {
            if (solarTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
              solarTotal -= (parcel.properties.cf_1 * parcel.properties.capacity * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
            }
          });
        },
        updateFunction(planService: PlanService) {
          let solarTotal = planService.getGenerationTotalForCurrentYear(['PV']);
          this.parcels.forEach(parcel => {
            if (solarTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0);
              solarTotal -= (parcel.properties.cf_1 * parcel.properties.capacity * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0);
            }
          });
        },
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/oahu/images/icons/agriculture-icon.png',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/oahu/layers/agriculture.json',
        parcels: [],
        setupFunction: null,
        updateFunction: null,
      }
    ],
  }
};
