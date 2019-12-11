import { Component, OnInit, Input } from '@angular/core';
import { PlanService } from '@app/services/plan.service';

@Component({
  selector: 'app-legend-card',
  templateUrl: './legend-card.component.html',
  styleUrls: ['./legend-card.component.css']
})
export class LegendCardComponent implements OnInit {

  @Input() iconPath: string;
  @Input() name: string;
  @Input() color: string;

  constructor(private planService: PlanService) { }

  ngOnInit() {

  }

  toggleBackgroundColor() {
    
  }

}
