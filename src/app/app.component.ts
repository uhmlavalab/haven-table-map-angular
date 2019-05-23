import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  // Holds the current state of the application
  private static state: string = 'setup';

  /** Gets the current state of the machine
  * 'setup' => Displays the landing-home
  * 'run' => Displays the map-main
  * @return => The state of the machine
  */
  public getState(): string {
    return AppComponent.state;
  }

  /** Sets the state of the machine
  * @param setState => The current state of the machine.
  * @return none
  */
  public setState(state: string): void {
    AppComponent.state = state;
  }

  // Static method that does the same thing as above
  public static setState(state: string): void {
    AppComponent.state = state;
  }
}
