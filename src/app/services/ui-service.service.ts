import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor(private window: Window) { 
    console.log(window);
  }

  public messageMap(msg): void {
    this.window.opener.localStorage.setItem('map-msg', JSON.stringify(msg));
    
  }
}
