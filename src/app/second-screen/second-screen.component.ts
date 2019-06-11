import { Component, OnInit } from '@angular/core';
import { MultiWindowService, Message } from 'ngx-multi-window';

@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})
export class SecondScreenComponent implements OnInit {

  private currentYear: number;
  private plan: string;
  private displayName: string;
  private secondScreenImagePath: string;

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
      }
    });
  }

  /** Initializes the second screen when it is opened.
   * @param data => The setup object
   */
  private setupSecondScreen(data: any): void {
    this.currentYear = data.currentYear;
    this.plan = data.name;
    this.displayName = data.displayName;
    this.secondScreenImagePath = data.secondScreenImagePath;
  }
}
