import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiWindowService, Message} from 'ngx-multi-window';
import { Plan } from '../interfaces/plan';
import { OahuPlan } from '../../assets/plans/oahu/plan';
import { MauiPlan } from '../../assets/plans/maui/plan';
import { BigIslandPlan } from '../../assets/plans/bigisland/plan';


@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})
export class SecondScreenComponent implements OnInit {

  private currentYear: number;
  private displayName: string;
  private secondScreenImagePath: string;
  private nextLayer: string;
  private plan: Plan;

  constructor(private multiWindowService: MultiWindowService) {
    multiWindowService.name = 'secondScreen';
  }

  ngOnInit() {
    this.multiWindowService.onMessage().subscribe((value: Message) => {
      const data = JSON.parse(value.data);
      if (data.type === 'setup') {
        this.setupSecondScreen(data);
      } else if (data.type === 'year') {
        this.currentYear = data.year;
      } else if (data.type === 'layer') {
        this.nextLayer = data.name;
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.multiWindowService.name = 'dead';
  }

  /** Initializes the second screen when it is opened.
   * @param data => The setup object
   */
  private setupSecondScreen(data: any): void {
    this.currentYear = data.currentYear;
    switch (data.name) {
      case 'oahu':
        this.plan = OahuPlan;
        break;
      case 'maui':
        this.plan = MauiPlan;
        break;
      case 'bigisland':
        this.plan = BigIslandPlan;
        break;
      default:
        this.plan = OahuPlan;
        break;
    }
    this.nextLayer = this.plan.map.mapLayers[0].name;
  }
}
