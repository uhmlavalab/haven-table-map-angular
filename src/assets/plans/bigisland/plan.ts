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
    scale: 0.32,
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
      {  //Begin Test Layer 1 (2019)
        name: 'testlayer',  //Internal layer name
        displayName: 'Test Layer 2019[Rain Gauge Status]',  //Display name (on the table.)
        active: false,  //Default for active (visible) status
        included: true,   //Default for inclusion in the layer list
        iconPath: 'assets/plans/bigisland/images/icons/hourglass.png',  //Icon path for table.
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',    //Background image for second screen, image path.
        secondScreenText: 'Slide the Layer Puck to add or remove this layer',  //Instructional/information text on second screen.
        fillColor: mapLayerColors.Test2019.fill,     //See defaultColors.ts.
        borderColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
        borderWidth: 0.04,  //Border width, default is set here.
        legendColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
        filePath: 'assets/plans/bigisland/layers/test2019.json',
        parcels: [],  //Empty list of parcels, gets populated by setupFunction()
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

          if(year >= Number(parcel.properties.maxYear + 100) && layerattribute == 'Current')
          {
            d3.select(parcel.path)
            .style('fill', colors[parcel.properties.stationsta])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'black')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');            
          }
          else
          {
            d3.select(parcel.path)
            .style('fill', colors[parcel.properties.stationsta])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'black')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');   
          }

          });
        },
      },  //End Test Layer 1 (2019)
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

            if((year <= 2019) && (layerattribute == 'O'))
            {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.density])//needed to fill multi-color by density
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2019) && (year <= 2021) && (layerattribute == 'L'))
            {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.density])//needed to fill multi-color by density
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2021) && (year <= 2023) && (layerattribute == 'M'))
            {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.density])//needed to fill multi-color by density
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2023) && (year <= 2025) && (layerattribute == 'H'))
            {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.density])//needed to fill multi-color by density
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2025) && (layerattribute == 'VH'))
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
 //Test Layer 3  Dynamic datalayer using lines -using merged shapefiles
      {  
        name: 'testlayer3', 
        displayName: 'voting precincts 02,06,10,14,16', 
        active: false,  
        included: true,   
        iconPath: 'assets/plans/bigisland/images/icons/hourglass.png',  
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',  
        secondScreenText: 'Slide the Layer Puck to add or remove this layer',
        fillColor: mapLayerColors.Test1992.fill,
        borderColor: mapLayerColors.Test1992.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Test1992.border,
        filePath: 'assets/plans/bigisland/layers/voting2.json',
        parcels: [],
        setupFunction(planService: PlanService) {
        
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
            .style('fill', 'transparent')//set to transparent
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'transparent')//change to color if want default layer to be shown, otherwise transparent
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          });
        },

        updateFunction(planService: PlanService) {
          let year = planService.getCurrentYear();

          
          this.parcels.forEach(parcel => {

            let layerattribute = parcel.properties.layer;//divide based on layer attribute 

            const borderColors = {
              'Historical_Voting_Precincts__2002': '#33fff3',//look at json file for names
              'Historical_Voting_Precincts__2006': '#33fff3',
              'Historical_Voting_Precincts__2010': '#33fff3',
              'Historical_Voting_Precincts__2014': '#33fff3',
              'Historical_Voting_Precincts__2016': '#33fff3',
            }

            if((year <= 2019) && (layerattribute == 'Historical_Voting_Precincts__2002'))
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.layer])//set to borderColors if borders wanted otherwise this.bordercolor
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2019) && (year <= 2023) && (layerattribute == 'Historical_Voting_Precincts__2006'))
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.layer])
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2023) && (year <= 2027) && (layerattribute == 'Historical_Voting_Precincts__2010'))
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.layer])
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2027) && (year <= 2031) && (layerattribute == 'Historical_Voting_Precincts__2014'))
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.layer])
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if((year > 2031) && (layerattribute == 'Historical_Voting_Precincts__2016'))
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.layer])
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else{
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', this.active ? 0.85 : 0.0)
                .style('stroke', 'transparent')
                .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }

          });

        },
      },  //End Test Layer 3 (2019)
      {  //Begin Test Layer 4 (2020)
        name: 'testlayer4',  //Internal layer name
        displayName: 'Elevation Ranges',  //Display name (on the table.)
        active: false,  //Default for active (visible) status
        included: true,   //Default for inclusion in the layer list
        iconPath: 'assets/plans/bigisland/images/icons/hourglass.png',  //Icon path for table.
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',    //Background image for second screen, image path.
        secondScreenText: 'Slide the Layer Puck to add or remove this layer',  //Instructional/information text on second screen.
        fillColor: mapLayerColors.Test2019.fill,     //See defaultColors.ts.
        borderColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
        borderWidth: 0.04,  //Border width, default is set here.
        legendColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
        filePath: 'assets/plans/bigisland/layers/Elevation_Ranges.json',
        parcels: [],  //Empty list of parcels, gets populated by setupFunction()
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
          
          let high_elev = parcel.properties.highelev;
          let low_elev = parcel.properties.lowelev;

          const colours = {  //Colours, constant.  Gradient from blue(low) to red(high)
            '0-500'       : '#0500fa',  
            '500-1000'    : '#0e00f0',
            '1000-1500'   : '#1800e6',
            '1500-2000'   : '#2100dd',
            '2000-2500'   : '#2b00d3',
            '2500-3000'   : '#3400c9',
            '3000-3500'   : '#3e00c0',
            '3500-4000'   : '#4800b6',
            '4000-4500'   : '#5100ad',
            '4500-5000'   : '#5b00a3',
            '5000-5500'   : '#640099',
            '5500-6000'   : '#6e0090',
            '6000-6500'   : '#770086',
            '6500-7000'   : '#81007d',
            '7000-7500'   : '#8b0073',
            '7500-8000'   : '#940069',
            '8000-8500'   : '#9e0060',
            '8500-9000'   : '#a70056',
            '9000-9500'   : '#b1004c',
            '9500-10000'  : '#ba0043',
            '10000-10500' : '#c31438',
            '10500-11000' : '#cc152e',
            '11000-11500' : '#ba1341',
            '11500-12000' : '#c31438',
            '12000-12500' : '#cc152e',
            '12500-13000' : '#d51625',
            '13000-13500' : '#de171c',
            '13500-14000' : '#e71813',
            '14000-14500' : '#f1190a'
          }

          if(low_elev == 0 && high_elev == 500 && year == 2016)  //0-500ft
          {
            d3.select(parcel.path)
            .style('fill', colours['0-500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke','white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }
          else if(low_elev == 500 && high_elev == 1000 && year == 2017)  //500-1000ft
          {
            d3.select(parcel.path)
            .style('fill', colours['500-1000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }
          else if(low_elev == 1000 && high_elev == 1500 && year == 2018)
          {
            d3.select(parcel.path)
            .style('fill', colours['1000-1500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }
          else if(low_elev == 1500 && high_elev == 2000 && year == 2019)
          {
            d3.select(parcel.path)
            .style('fill', colours['1500-2000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }     
          else if(low_elev == 2000 && high_elev == 2500 && year == 2020)
          {
            d3.select(parcel.path)
            .style('fill', colours['2000-2500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }                            
          else if(low_elev == 2500 && high_elev == 3000 && year == 2021)
          {
            d3.select(parcel.path)
            .style('fill', colours['2500-3000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 3000 && high_elev == 3500 && year == 2022)
          {
            d3.select(parcel.path)
            .style('fill', colours['3000-3500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 3500 && high_elev == 4000 && year == 2023)
          {
            d3.select(parcel.path)
            .style('fill', colours['3500-4000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 4000 && high_elev == 4500 && year == 2024)
          {
            d3.select(parcel.path)
            .style('fill', colours['4000-4500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }  
          else if(low_elev == 4500 && high_elev == 5000 && year == 2025)
          {
            d3.select(parcel.path)
            .style('fill', colours['4500-5000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 5000 && high_elev == 5500 && year == 2026)
          {
            d3.select(parcel.path)
            .style('fill', colours['5000-5500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 5500 && high_elev == 6000 && year == 2027)
          {
            d3.select(parcel.path)
            .style('fill', colours['5500-6000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 6000 && high_elev == 6500 && year == 2028)
          {
            d3.select(parcel.path)
            .style('fill', colours['6000-6500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 6500 && high_elev == 7000 && year == 2029)
          {
            d3.select(parcel.path)
            .style('fill', colours['6500-7000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 7000 && high_elev == 7500 && year == 2030)
          {
            d3.select(parcel.path)
            .style('fill', colours['7000-7500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 7500 && high_elev == 8000 && year == 2031)
          {
            d3.select(parcel.path)
            .style('fill', colours['7500-8000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 8000 && high_elev == 8500 && year == 2032)
          {
            d3.select(parcel.path)
            .style('fill', colours['8000-8500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 8500 && high_elev == 9000 && year == 2033)
          {
            d3.select(parcel.path)
            .style('fill', colours['8500-9000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 9000 && high_elev == 9500 && year == 2034)
          {
            d3.select(parcel.path)
            .style('fill', colours['9000-9500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }    
          else if(low_elev == 9500 && high_elev == 10000 && year == 2035)
          {
            d3.select(parcel.path)
            .style('fill', colours['9500-10000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 10000 && high_elev == 10500 && year == 2036)
          {
            d3.select(parcel.path)
            .style('fill', colours['10000-10500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 10500 && high_elev == 11000 && year == 2037)
          {
            d3.select(parcel.path)
            .style('fill', '#c40039')
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 11000 && high_elev == 11500 && year == 2038)
          {
            d3.select(parcel.path)
            .style('fill', '#ce0030')
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 11500 && high_elev == 12000 && year == 2039)
          {
            d3.select(parcel.path)
            .style('fill', colours['11500-12000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 12000 && high_elev == 12500 && year == 2040)
          {
            d3.select(parcel.path)
            .style('fill', colours['12000-12500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 12500 && high_elev == 13000 && year == 2041)
          {
            d3.select(parcel.path)
            .style('fill', colours['12500-13000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 13000 && high_elev == 13500 && year == 2042)
          {
            d3.select(parcel.path)
            .style('fill', colours['13000-13500'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }   
          else if(low_elev == 13500 && high_elev == 14000 && year == 2043)
          {
            d3.select(parcel.path)
            .style('fill',colours['13500-14000'])
            .style('opacity', this.active ? 0.85 : 0.0)
            .style('stroke', 'white')
            .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          }  
          else  //Fallback, disable any visible parcels.
            d3.select(parcel.path)
            .style('opacity',0.0)
          });
        },
      },
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
      {//start placeholder layer
        name: 'Moisture Zones',
        displayName: 'Moisture Zones',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/dod-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/bigisland/layers/moisture.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          const colors = {
            '1': '#e60000',
            '2': '#ff7f7f',
            '3': '#895a44',
            '4': '#00c5ff',
            '5': '#037ffc',
            '6': '#031cfc',
            '7': '#1302d1',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.zone])//change from type to attribute name
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
      },//end placeholder layer
    ],
  }
}
