import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInputService } from './services/user-input.service';
import { KeyboardComponent } from './schemes/keyboard/keyboard.component';

@NgModule({
  declarations: [KeyboardComponent],
  imports: [
    CommonModule
  ],
  providers: [
    UserInputService
  ]
})
export class UserInputModule { }
