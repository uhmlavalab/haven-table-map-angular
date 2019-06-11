import { Component, OnInit } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { MultiWindowService, Message } from 'ngx-multi-window';
import { WindowRefService } from '../services/window-ref.service';
import { _ } from 'underscore';

@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})
export class SecondScreenComponent implements OnInit {

  private currentYear: number;

  constructor(private planService: PlanService,
              private multiWindowService: MultiWindowService,
              private windowRefService: WindowRefService) {
                multiWindowService.name = 'secondScreen';
  }

  ngOnInit() {
    this.multiWindowService.onMessage().subscribe((value: Message) => {
      console.log(JSON.parse(value.data));
    });
  }
}
