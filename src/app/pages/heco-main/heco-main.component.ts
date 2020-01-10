import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { PlanService } from '@app/services/plan.service';
import { TouchService } from '@app/services/touch.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-heco-main',
  templateUrl: './heco-main.component.html',
  styleUrls: ['./heco-main.component.css']
})
export class HecoMainComponent implements AfterViewInit {

  @ViewChild('map', { static: false, read: ElementRef }) mapElement;
  @ViewChild('pieChart', { static: false, read: ElementRef }) pieChart; // The custom Map component.
  @ViewChild('lineChart', { static: false, read: ElementRef }) lineChart; // The custom Map component.

  private uiWindow: any;
  private currentYear: number;          // Current Year
  private currentScenario: string;      // Current scenario.
  private messageCheckInterval: any;


  constructor(private planService: PlanService,
    private window: Window,
    private touchService: TouchService,
    private router: Router) {

    // if the plan is undefined, then the application will go back to the landing page.
    try {
      this.currentYear = this.planService.getMinimumYear();
      this.currentScenario = this.planService.getCurrentScenario().displayName;
    } catch (error) {
      this.router.navigateByUrl('');
      this.planService.setState('landing');
      console.log('No Plan Found --> Route to setup');
    } finally {

    }

  }

  ngAfterViewInit() {
    this.positionMap();
    this.positionLineChart();
    this.positionPieChart();
    this.touchService.openUIWindow();
    this.touchService.messageUI({ type: 'plan', data: 'heco-oahu', newMsg: 'true' });

    this.messageCheckInterval = setInterval(() => {
      try {
        this.reviewMessage(this.touchService.readMessage());
      } catch (err) {
        console.log('Failed to revieve a new message');
      }
    }, 20);

    // Push Year Data to Second Screen
    this.planService.yearSubject.subscribe({
      next: value => {
        const msg = {
          type: 'year',
          data: value,
          newMsg: 'true'
        }
        this.touchService.messageUI(msg);
      }
    });
  }

  private reviewMessage(msg): void {
    const data = JSON.parse(msg);
    if (data.newMsg === 'true') {
      this.touchService.clearMessages();
      console.log(data.type);
      if (data.type === 'layer-update') {
        this.planService.toggleSelectedLayer(data.data);
      } else if (data.type === 'change year') {
        if (data.data === 'increment') {
          this.planService.incrementCurrentYear();
        } else if (data.data === 'decrement') {
          this.planService.decrementCurrentYear();
        } else {
          this.planService.setCurrentYear(parseInt(data.data, 10));
        }
      } else if (data.type === 'change scenario') {
        this.planService.setScenario(data.data);
      }
    } else {
      console.log('no new message');
    }
  }

  private positionMap(): void {
    try {
      //Select map element from viewchild
      const e = this.mapElement.nativeElement;
      // Get styles from the plan service.
      const styles = this.planService.getCss();
      e.style.left = styles.map.left;
      e.style.top = styles.map.top;
    } catch (error) {
      console.log('Failed To locate Element to position');
    }
  }

  private positionLineChart(): void {
    try {
      //Select map element from viewchild
      const e = this.lineChart.nativeElement;
      // Get styles from the plan service.
      const styles = this.planService.getCss();
      e.style.left = styles.charts.line.left;
      e.style.top = styles.charts.line.top;
    } catch (error) {
      console.log('Error.  Failed to find element to position.');
    }
  }

  private positionPieChart(): void {
    try {
      //Select map element from viewchild
      const e = this.pieChart.nativeElement;
      // Get styles from the plan service.
      const styles = this.planService.getCss();
      e.style.left = styles.charts.pie.left;
      e.style.top = styles.charts.pie.top;
    } catch (error) {
      console.log('Error. Failed to find the element to position. ');
    }
  }

}
