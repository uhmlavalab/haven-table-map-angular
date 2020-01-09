import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiWindowModule } from 'ngx-multi-window';

// Pages
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { MapMainComponent } from './pages/map-main/map-main.component';

// Components
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BouncingTitleComponent } from './pages/landing-home/components/bouncing-title/bouncing-title.component';
import { VideoFeedComponent } from './universal-components/video-feed/video-feed.component';
import { MapElementComponent } from './universal-components/map-element/map-element.component';
import { LargeYearComponent } from './pages/map-main/components/large-year/large-year.component';
import { LegendComponent } from './pages/map-main/components/legend/legend.component';
import { TitleComponent } from './pages/map-main/components/title/title.component';
import { SecondScreenComponent } from './pages/second-screen/second-screen.component';
import { LineChartComponent } from './universal-components/charts/line-chart/line-chart.component';
import { PieChartComponent } from './universal-components/charts/pie-chart/pie-chart.component';
import { LayerPuckComponent } from './pages/map-main/components/puck-overlays/layer-puck/layer-puck.component';
import { YearPuckComponent } from './pages/map-main/components/puck-overlays/year-puck/year-puck.component';
import { AddPuckComponent } from './pages/map-main/components/puck-overlays/add-puck/add-puck.component';
import { ScenarioComponent } from './scenario/scenario.component';

// Directives
import { MapDirective } from './universal-components/map-element/map.directive';
import { MapLayerDirective } from './universal-components/map-element/map-layer.directive';
import { LegendDirective } from './pages/map-main/components/legend/legend.directive';


// Services
import { ArService } from './services/ar.service';
import { PlanService } from './services/plan.service';
import { SoundsService } from './services/sounds.service';
import { WindowRefService } from './services/window-ref.service';
import { LoadingComponent } from './pages/landing-home/components/loading/loading.component';
import { TrackingTestComponent } from './pages/landing-home/components/tracking-test/tracking-test.component';
import { CalibrationComponent } from './pages/landing-home/components/calibration/calibration.component';
import { LandingButtonsContainerComponent } from './pages/landing-home/components/landing-buttons-container/landing-buttons-container.component';
import { MapSelectorComponent } from './pages/landing-home/components/map-selector/map-selector.component';
import { HelpComponent } from './pages/landing-home/components/help/help.component';
import { CamBoxesComponent } from './pages/landing-home/components/cam-boxes/cam-boxes.component';
import { CameraSelectorComponent } from './pages/landing-home/components/camera-selector/camera-selector.component';
import { MarkerSelectionComponent } from './pages/landing-home/components/marker-selection/marker-selection.component';
import { LegendCardComponent } from './pages/map-main/components/legend/components/legend-card/legend-card.component';
import { HecoMainComponent } from './pages/heco-main/heco-main.component';
import { TouchUiComponent } from './pages/heco-main/components/touch-ui/touch-ui.component';
import { LayerButtonComponent } from './pages/heco-main/components/layer-button/layer-button.component';
import { SliderComponent } from './pages/heco-main/components/slider/slider.component';
import { YearComponent } from './pages/heco-main/components/year/year.component';
import { BorderLineComponent } from './universal-components/border-line/border-line.component';


@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    BouncingTitleComponent,
    VideoFeedComponent,
    MapElementComponent,
    LargeYearComponent,
    MapDirective,
    MapLayerDirective,
    LegendComponent,
    LegendDirective,
    TitleComponent,
    SecondScreenComponent,
    LineChartComponent,
    PieChartComponent,
    ScenarioComponent,
    LayerPuckComponent,
    YearPuckComponent,
    AddPuckComponent,
    LoadingComponent,
    TrackingTestComponent,
    CalibrationComponent,
    LandingButtonsContainerComponent,
    MapSelectorComponent,
    HelpComponent,
    CamBoxesComponent,
    CameraSelectorComponent,
    MarkerSelectionComponent,
    LandingHomeComponent,
    MapMainComponent,
    LegendCardComponent,
    HecoMainComponent, TouchUiComponent, LayerButtonComponent, SliderComponent, YearComponent, BorderLineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    MultiWindowModule
  ],
  providers: [
    ArService,
    PlanService,
    SoundsService,
    WindowRefService,
    { provide: Window, useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
