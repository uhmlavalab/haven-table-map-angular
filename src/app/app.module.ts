import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiWindowModule } from 'ngx-multi-window';

// Modules
import { ChartsModule } from '@app/charts';
import { SoundsModule } from '@app/sounds';
import { DataModule } from '@app/data';
import { PagesModule } from '@app/pages';
import { MapsModule } from '@app/maps';
import { UserInputModule } from '@app/input';

// Components
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    MultiWindowModule,
    ChartsModule,
    DataModule,
    PagesModule,
    MapsModule,
    SoundsModule,
    UserInputModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
