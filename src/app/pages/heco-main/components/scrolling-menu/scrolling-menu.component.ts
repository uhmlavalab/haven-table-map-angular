import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, ViewChild, Input } from '@angular/core';
import { PlanService } from '@app/services/plan.service';
import { Plan } from '@app/interfaces';

@Component({
  selector: 'app-scrolling-menu',
  templateUrl: './scrolling-menu.component.html',
  styleUrls: ['./scrolling-menu.component.css']
})
/** Scrolling Menu is a touch enabled component that displays options in a curved format.  If there
 * are more options than are currently shown on the screen, the options can be scrolled endlessly.
 * You can select the direction of the curve, either right or left.
 */
export class ScrollingMenuComponent implements AfterViewInit {

  @Input() type;
  @ViewChildren('menuOption', { read: ElementRef }) menuOptions: QueryList<ElementRef>
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChild('touchOverlay', { static: false }) overlay: ElementRef;

  private options: any[]; // Array holding all menu options.
  private numberVisible: number; // How many options are visible at one time on the screen.  The rest are hidden.
  private curveLeft: boolean;
  private dragging: boolean; // True if elements are being dragged.  False if not.
  private optionArray: any[];

  private positionHistory: any[];
  private heightOfOption: number;
  private runningTotal: number;

  private speed: number;
  private speedDecayRate: number;
  private speedInterval: any;
  private repeatRate: number;

  private center: number;

  constructor(private el: ElementRef, private planService: PlanService) {
    this.curveLeft = false;
    this.numberVisible = 10;

    this.options = [];
    this.setYears();
    this.dragging = false;
    this.positionHistory = [];
    this.heightOfOption = -1;
    this.runningTotal = 0;
    this.optionArray = [];
    this.speed = 0;
    this.speedDecayRate = 0.80;
    this.repeatRate = 30;
  }

  ngAfterViewInit() {
    this.center = this.findCenter();
    console.log(this.center);
    this.positionOptions(this.numberVisible);
    this.toggleBackgroundColors();
    this.overlay.nativeElement.style.top = '0';

    this.overlay.nativeElement.addEventListener('mousedown', () => this.startDrag());
    this.overlay.nativeElement.addEventListener('mouseup', () => this.stopDragging());
    this.overlay.nativeElement.addEventListener('mouseleave', () => {
      if (this.dragging) {
        this.stopDragging()
      }
    });
    this.overlay.nativeElement.addEventListener('mousemove', event => {
      if (this.dragging) {
        this.drag(event, this.container);
      }
    });

    this.overlay.nativeElement.addEventListener('touchstart', () => {
      this.startDrag();
    }, { passive: false });
    this.overlay.nativeElement.addEventListener('touchend', () => {
      this.stopDragging();
    }, { passive: false });
    this.overlay.nativeElement.addEventListener('touchmove', event => {
      if (this.dragging) {
        this.drag(event, this.container);
      }
    }, { passive: false });

  }

  setYears(): void {
    for (let i = 2016; i < 2046; i++) {
      this.options.push(i);
    }
  }

  setScenarios(): void {
    //console.log(this.planService.getScenarios());
  }

  /** Calculates the space needed for each element based on the number of elements and the
   * size of the container.  Then positions the elements accordingly.
   * @param num the number of elements visible at one time.
   */
  private positionOptions(num: number): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dividedHeight = height / this.numberVisible;

    this.menuOptions.forEach((option, index) => {
      option.nativeElement.style.height = `${dividedHeight}px`;
      option.nativeElement.style.top = `${dividedHeight * index - height * 1.5}px`;
      this.optionArray.push(option.nativeElement);
    });
    this.heightOfOption = dividedHeight;
  }

  private findCenter():number {
    return this.container.nativeElement.getBoundingClientRect().height / 2 + this.container.nativeElement.getBoundingClientRect().top;
  }

  toggleBackgroundColors(): void {
    this.optionArray.forEach(e => {
      if (this.isCenter(e)) {
        e.style.opacity = 1;
 
      } else {
        e.style.opacity = 0.3;

      }
    });
  }

  isCenter(e):boolean {
    const rect = e.getBoundingClientRect();
    if (this.center > rect.top && this.center < rect.bottom) {
      return true;
    }else {
      return false;
    }
  }

  private startDrag(): void {
    try {
      clearInterval(this.speedInterval);
    } catch (err) {
      console.log(err);
    }
    this.dragging = true;
  }

  private stopDragging(): void {
    this.dragging = false;
    if (Math.abs(this.speed) > 1) {
      this.speedInterval = setInterval(() => {
        this.decaySpeed();
      }, this.repeatRate);
    } else {
      this.positionHistory = [];
      this.speed = 0;
    }

  }

  private drag(event, e): number {
    try {
      // Capture Y position of mouse or touch
      let mouseY = event.screenY;
      if (mouseY === undefined) {
        Object.values(event.touches).forEach((touch: Touch) => {
          if (touch.target === this.overlay.nativeElement) {
            mouseY = touch.screenY;
          }
        });
      }

      if (mouseY) {
        this.positionHistory.push({ pos: mouseY, time: new Date().getTime() });
        if (this.positionHistory.length > 3) {
          let sum = this.getSum();
            this.moveEachOption(Math.round(sum));
            this.toggleBackgroundColors();
            this.getSpeed();
            this.positionHistory = [];
            this.runningTotal = this.checkRunningTotal(sum);
  
        }
      }

    } catch (error) {
      console.log(error);
      console.log('Error Dragging Menu object');
    } finally {
      return 0;
    }
  }

  private checkRunningTotal(sum: number): number {
    const total = sum + this.runningTotal;
    if (Math.abs(total) > this.heightOfOption) {
      const sign = Math.sign(total);
      this.switchOptions(sign);
      const newTotal = sign * (Math.abs(total) - this.heightOfOption);
      return newTotal;
    } else {
      return total;
    }
  }

  private moveEachOption(distance: number): void {
    this.optionArray.forEach(e => {
      e.style.top = `${this.getTopInt(e) + distance}px`;
    });
  }

  private switchOptions(sign: number): void {
    const firstOption = this.optionArray[0];
    const lastOption = this.optionArray[this.optionArray.length - 1];
    const firstTop = this.getTopInt(firstOption);
    const lastTop = this.getTopInt(lastOption);

    if (sign > 0) {
      lastOption.style.top = `${firstTop - this.heightOfOption}px`;
      const first = this.optionArray.pop();
      this.optionArray.unshift(first);
    } else if (sign < 0) {
      firstOption.style.top = `${lastTop + this.heightOfOption}px`;
      const last = this.optionArray.shift();
      this.optionArray.push(last);
    } else {
      // Do nothing at all.
    }
  }

  private getTopInt(element): number {
    let top = element.style.top;
    top = top.split('p');
    top = top[0];
    top = parseInt(top, 10);
    return top;
  }

  private getSum(): number {
    let sum = 0;
    this.positionHistory.forEach((point, index) => {
      if (index > 0) {
        sum += point.pos - this.positionHistory[index - 1].pos;
      }
    });
    return sum;
  }

  private getSpeed(): void {
    const sum = this.getSum();
    const speed = sum / (this.positionHistory[this.positionHistory.length - 1].time - this.positionHistory[0].time);
    this.speed = Math.floor(speed * this.repeatRate);
  }

  private decaySpeed(): void {

    if (Math.abs(this.speed) <  1 || this.speed === 0) {
      console.log(this.speedInterval);
      clearInterval(this.speedInterval);
      this.toggleBackgroundColors();
      this.positionHistory = [];
      this.speed = 0;
    } else {
      const sign = Math.sign(this.speed);
      this.speed = Math.floor(Math.abs(this.speed * this.speedDecayRate)) * sign;
      this.moveEachOption(this.speed);
      this.runningTotal = this.checkRunningTotal(this.speed);
      this.toggleBackgroundColors();
    }
  }
}
