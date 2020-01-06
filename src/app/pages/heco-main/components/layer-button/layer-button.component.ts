import { Component, OnInit, Input } from '@angular/core';
import { UiServiceService } from '@app/services/ui-service.service';

@Component({
  selector: 'app-layer-button',
  templateUrl: './layer-button.component.html',
  styleUrls: ['./layer-button.component.css'],
  host: {
    '(click)': 'handleClick()'
  }
})
export class LayerButtonComponent implements OnInit {

  @Input() layerName: string;
  @Input() layerDisplayName: string;
  @Input() layerIcon: string;

  constructor(private uiService: UiServiceService) {

  }

  ngOnInit() {
  }

  private handleClick(): void {
    this.uiService.messageMap({ type: 'layer-update', data: this.layerName, newMsg: 'true' });
  }

}
