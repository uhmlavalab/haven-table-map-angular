import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { LayerPuckComponent } from '../layer-puck/layer-puck.component';

@Component({
  selector: 'app-add-puck',
  templateUrl: './add-puck.component.html',
  styleUrls: ['./add-puck.component.css']
})
export class AddPuckComponent implements OnInit {

  private selectedLayer: {
    icon: string;
    active: boolean;
    text: string;
    color: string;
  }

  private addRemoveText: string;

  constructor(private mapService: MapService) {
    this.selectedLayer = {
      icon: this.mapService.getSelectedLayer().iconPath,
      active: this.mapService.getSelectedLayer().active,
      text: this.mapService.getSelectedLayer().displayName,
      color: this.mapService.getSelectedLayer().legendColor
    }

    this.setAddRemoveText();
   }

  ngOnInit() {

    // Subscribe to layer toggling
    this.mapService.selectedLayerSubject.subscribe((layer) => {
      this.selectedLayer = {
        icon: layer.iconPath,
        active: layer.active,
        text: layer.displayName,
        color: layer.legendColor
      }
      this.setAddRemoveText();
    });

    // Subscribe to layer toggling
    this.mapService.toggleLayerSubject.subscribe((layer) => {
      this.selectedLayer = {
        icon: layer.iconPath,
        active: layer.active,
        text: layer.displayName,
        color: layer.legendColor
      }
      this.setAddRemoveText();
    });
    
  }

  private setAddRemoveText(): void {
    this.addRemoveText = this.selectedLayer.active ? 'Remove' : 'Add';
  }
}
