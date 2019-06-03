import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.css']
})
export class InsideComponent implements OnInit {

  year: number;

  constructor(private planService: PlanService) {
    this.year = this.planService.getCurrentYear();

  }

  ngOnInit() {
    this.planService.yearSubject.subscribe({
      next: value => {
        this.year = value;
      }
    });
  }

}
