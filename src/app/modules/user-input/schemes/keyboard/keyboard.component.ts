import { Component, HostListener } from '@angular/core';
import { UserInputService } from '../../services/user-input.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent {

  // KEYBOARD CONTROLS
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'q':
        this.userInputService.incrementScenario();
        break;
      case 'w':
        this.userInputService.decrementScenario();
        break;
      case 's':
        this.userInputService.incrementYear();
        break;
      case 'a':
        this.userInputService.decrementYear();
        break;
      case 'x':
        this.userInputService.incrementMapLayer();
        break;
      case 'z':
        this.userInputService.decrementMapLayer();
        break;
      case 'Enter':
        this.userInputService.toggleMapLayer();
        break;
    }
  }

  constructor(private userInputService: UserInputService) { }


}

