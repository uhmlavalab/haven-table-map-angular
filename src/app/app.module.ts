import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LandingHomeComponent } from './landing-home/landing-home.component';
import { BouncingTitleComponent } from './landing-home/bouncing-title/bouncing-title.component';
import { MapSelectionDirectiveDirective } from './landing-home/map-selection-directive.directive';
import { VideoFeedComponent } from './video-feed/video-feed.component';
import { InteractionElementComponent } from './map-main/interaction-element/interaction-element.component';
import { MapElementComponent } from './map-main/map-element/map-element.component';
import { MapMainComponent } from './map-main/map-main.component';
import { AddRemoveLayersComponent } from './map-main/interaction-element/add-remove-layers/add-remove-layers.component';
import { MapDataService } from './services/map-data.service';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { LargeYearComponent } from './map-main/large-year/large-year.component';
import { CardStyleDirective } from './map-main/interaction-element/card-style.directive';
import { MapDirective } from './map-main/map-element/map.directive';
import { MapLayerDirective } from './map-main/map-element/map-layer.directive';
import { LegendComponent } from './map-main/legend/legend.component';
import { LegendDirective } from './map-main/legend/legend.directive';
import { TitleComponent } from './map-main/title/title.component';

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    BouncingTitleComponent,
    MapSelectionDirectiveDirective,
    VideoFeedComponent,
    InteractionElementComponent,
    MapElementComponent,
    AddRemoveLayersComponent,
    LargeYearComponent,
    CardStyleDirective,
    MapDirective,
    MapLayerDirective,
    LegendComponent,
    LegendDirective,
    TitleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [MapDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
