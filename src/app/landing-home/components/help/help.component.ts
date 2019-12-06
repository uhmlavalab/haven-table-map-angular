import { Component, OnInit } from '@angular/core';
import { ContentDeliveryService } from '@app/services/content-delivery.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  buttons: any;
  keys: any;
  private help: string;                         // Determines which help menu to display


  constructor(private contentDeliveryService: ContentDeliveryService) { 
    this.help = 'keyboard';                     // Show keyboard shortcut controls as first help view.
    this.buttons = contentDeliveryService.getHelpButtons();
    this.keys = contentDeliveryService.getKeyboardControls();
  }

  ngOnInit() {
  }

  
  /**
   * This function is called when user clicks on one of the help navigation buttons.  It changes the
   * class of the button that was clicked to active, reverts the previous to normal and swaps the view of
   * the content container.
   * @param event => The mouseclick event.
   * @param tag => The string that identifies the button that was clicked.
   */
  private handleHelpNavClick(event: any, tag: string): void {
    this.help = tag;
  }

}
