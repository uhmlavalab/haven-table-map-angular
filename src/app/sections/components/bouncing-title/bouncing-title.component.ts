import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Tile } from './tile';

@Component({
  selector: 'app-bouncing-title',
  templateUrl: './bouncing-title.component.html',
  styleUrls: ['./bouncing-title.component.css']
})

export class BouncingTitleComponent implements OnInit {

  @Input() title: string;
  tileArray: Tile[];
  bounceId: number;
  normal = 'normal-style';
  active = 'bounce-style';

  constructor() {
    for (let i = 0; i < this.title.length; i++) {
      const tile = {
        id: i,
        text: this.title.charAt(i),
      } as Tile;
      this.tileArray.push(tile);
    }
    this.bounceId = -1;
  }

  ngOnInit() {
    // Call Bounce Animation once, then repea at an interval.
    this.bounce(-1);
    setInterval(() => { this.bounce(-1); }, 8000);
  }

  /**
   * This function cycles through the letters of the title changing their
   * font size to create a simple animation.
   * @param index => The index of the letter that is set to active
   * @return => None
   */
  bounce(index): void {
    if (index >= this.tileArray.length) {
      this.bounceId = -1;
      return;
    } else {
      this.bounceId = index;
      index++;
      setTimeout(() => { this.bounce(index); }, 75);
    }
  }


}
