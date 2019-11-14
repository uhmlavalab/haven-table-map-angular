import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';
import { ParseSourceFile } from '@angular/compiler';

export const BigIslandPlan: Plan = {
  name: 'bigisland',
  displayName: 'Big Island',
  landingImagePath: 'assets/plans/bigisland/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/backgrounds/bigIsland.jpg',
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
    }
  ],
  data: {
    capacityPath: 'assets/plans/bigisland/data/capacity.csv',
    generationPath: 'assets/plans/bigisland/data/generation.csv',
    batteryPath: 'assets/plans/bigisland/data/battery.csv',
    curtailmentPath: 'assets/plans/oahu/data/curtailment.csv',
    colors: chartColors
  },
  css: {
    map: {
      left: '24.5vw',
      top: '5vh'
    },
    legend: {
      defaultLayout: 'grid',
      grid: {
        left: '27vw',
        top: '15vh',
        width: '21vw'
      },
      vertical: {
        left: '25vw',
        top: '11vh',
        width: '10vw'
      }
    },
    title: {
      left: '64vw',
      top: '82vh'
    },
    scenario: {
      left: '27vw',
      top: '6vh'
    },
    charts: {
      pie: {
        left: '27vw',
        top: '61vh'
      },
      line: {
        left: 'calc(100vw - 325px)',
        top: '0vh'
      }

    }
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
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/transmission.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/bigisland/layers/transmission.json',
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
      {  //Begin Test Layer (2019)
        name: 'testlayer',  //Internal layer name
        displayName: 'Test Layer 2019[Rain Gauge Status]',  //Display name (on the table.)
        active: false,  //Default for active (visible) status
        included: true,   //Default for inclusion in the layer list
        iconPath: 'assets/plans/bigisland/images/icons/hourglass.png',  //Icon path for table.
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',    //Background image for second screen, image path.
        secondScreenText: 'Slide the Layer Puck to add or remove this layer',  //Instructional/information text on second screen.
        fillColor: mapLayerColors.Test2019.fill,
        borderColor: mapLayerColors.Test2019.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Test2019.border,
        filePath: 'assets/plans/bigisland/layers/test2019.json',
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

          let year = planService.getCurrentYear();

          this.parcels.forEach(parcel => 
          {

          let layerattribute = parcel.properties.stationsta;

          const colors = {
            'Discontinued' : '#ff0000',
            'Current'       : '#00ff00'
          }

          if(year >= parcel.properties.maxYear + 100 && layerattribute == 'Current')
          {
            d3.select(parcel.path)
            .style('fill', colors[parcel.properties.stationsta])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', this.borderColor)
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');            
          }
          else
          {
            d3.select(parcel.path)
            .style('fill', colors[parcel.properties.stationsta])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', this.borderColor)
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');   
          }

          });
        },
      },  //End Test Layer (2019)
      {  
        name: 'testlayer2',  //Internal layer name
        displayName: 'Test Layer [TE Plants,1992]',  //Display name (on the table.)
        active: false,  
        included: true,   
        iconPath: 'assets/plans/bigisland/images/icons/hourglass.png',  
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',  
        secondScreenText: 'Slide the Layer Puck to add or remove this layer',
        fillColor: mapLayerColors.Test1992.fill,
        borderColor: mapLayerColors.Test1992.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Test1992.border,
        filePath: 'assets/plans/bigisland/layers/test1992.json',
        parcels: [],
        setupFunction(planService: PlanService) {
        
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('transparent', this.fillColor)
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          });
        },

        updateFunction(planService: PlanService) {
          let year = planService.getCurrentYear();

          
          this.parcels.forEach(parcel => {

            let layerattribute = parcel.properties.density;

            const colors = {
              'O': 'white',//look at json file for density names
              'L': '#ffdbdb',
              'M': '#ff8080',
              'H': '#ff4242',
              'VH': '#ff0000',
            }

            if((year <= 2019) && (layerattribute == 'L'))
            {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.density])//needed to fill multi-color by density
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if(((year <= 2022)) && (year > 2019) && (layerattribute == 'M'))
            {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.density])//needed to fill multi-color by density
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else{
              d3.select(parcel.path)
                .style('fill', 'transparent')//needed to fill multi-color by density
                .style('opacity', this.active ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }

          });

        },
      },  //End Test Layer 2 (2019)
      {
        name: 'dod',
        displayName: 'Government Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/dod-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/bigisland/layers/government.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          const colors = {
            'Public-Federal': '#e60000',
            'Public-State': '#ff7f7f',
            'Public-State DHHL': '#895a44',
            'Public-County': '#00c5ff',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.type])
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth + 'px');
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
        name: 'solar', //layer noted to break in firefox
        displayName: 'Solar',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/solar-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        borderWidth: 0.5,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/bigisland/layers/solar.json',
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
          console.log(solarTotal);
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
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/wind-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/wind.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        borderWidth: 0.1,//.05
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/bigisland/layers/wind.json',
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
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/agriculture-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/agriculture.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/bigisland/layers/agriculture.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          const colors = {
            A: '#267300' + 'aa',
            B: '#4ce600' + 'aa',
            C: '#ffaa00' + 'aa',
            D: '#a87000' + 'aa',
            E: '#895a44' + 'aa',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.type])
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      }
    ],
  }
}
