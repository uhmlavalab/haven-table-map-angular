import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInputService } from './services/input.service';

// Keyboard Input
import { KeyboardComponent } from './schemes/keyboard/keyboard.component';

// Video Puck Input
import { VideoFeedComponent  } from './schemes/video-pucks';
import { ArService } from './schemes/video-pucks';
import { PuckCalibrationComponent } from './schemes/video-pucks/components/puck-calibration/puck-calibration.component'

@NgModule({
  declarations: [
    KeyboardComponent,
    VideoFeedComponent,
    PuckCalibrationComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    UserInputService,
    ArService
  ]
})
export class UserInputModule { }
