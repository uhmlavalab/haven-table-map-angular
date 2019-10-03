import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInputService {

  public incYearSubject = new Subject<string>();
  public decYearSubject = new Subject<string>();
  public incScenarioSubject = new Subject<string>();
  public decScenarioSubject = new Subject<string>();
  public incMapLayerSubject = new Subject<string>();
  public decMapLayerSubject = new Subject<string>();
  public toggleMapLayerSubject = new Subject<string>();

  constructor() { }

  public event(name: string) {
    this.inputEvent().next(name);
  }
  public incrementYear() {
    this.incYearSubject.next('Increase Year.');
  }

  public decrementYear() {
    this.decYearSubject.next('Decrease Year.');
  }

  public incrementScenario() {
    this.incScenarioSubject.next('Increase Scenario.');
  }

  public decrementScenario() {
    this.decScenarioSubject.next('Decrease Scenario.');
  }

  public incrementMapLayer() {
    this.incScenarioSubject.next('Increase MapLayer.');
  }

  public decrementMapLayer() {
    this.decScenarioSubject.next('Decrease MapLayer.');
  }

  public toggleMapLayer() {
    this.toggleMapLayerSubject.next('Toggle Selected Layer');
  }

}
