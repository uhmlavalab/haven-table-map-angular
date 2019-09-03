import { Marker } from '@app/interfaces';
import { PlanService } from '../../app/services/plan.service'

export const markers: Marker[] = [{
  markerId: 320,
  secondId: 3,
  job: 'layer_0',
  delay: 250, 
  minRotation: 5,
  layerIndex: 0,
  layerId: 0,
  rotateLeft(planService: PlanService) {
    planService.decrementNextLayer(0);
   },
   rotateRight(planService: PlanService) {
    planService.incrementNextLayer(0);
   }
}, {
  markerId: 7,
  secondId: 6,
  job: 'layer_1',
  delay: 250, 
  minRotation: 5,
  layerIndex: 0,
  layerId: 1,
  rotateLeft(planService: PlanService) {
    planService.decrementNextLayer(1);
   },
   rotateRight(planService: PlanService) {
    planService.incrementNextLayer(1);
   }
}, {
  markerId: 9,
  secondId: 5,
  job: 'layer_2',
  delay: 250, 
  minRotation: 5,
  layerIndex: 0,
  layerId: 2,
  rotateLeft(planService: PlanService) {
    planService.decrementNextLayer(2);
   },
   rotateRight(planService: PlanService) {
    planService.incrementNextLayer(2);
   }
}, {
  markerId: 11,
  secondId: 7,
  job: 'layer_3',
  delay: 600, 
  minRotation: 5,
  layerIndex: 0,
  layerId: 3,
  rotateLeft(planService: PlanService) {
    planService.decrementNextLayer(3);
   },
   rotateRight(planService: PlanService) {
    planService.incrementNextLayer(3);
   }
},
{
  markerId: 1,
  secondId: 3,
  job: 'year',
  delay: 250, 
  minRotation: 3,
  layerIndex: 0,
  layerId: 0,
  rotateLeft(planService: PlanService) {
    planService.decrementCurrentYear();
   },
   rotateRight(planService: PlanService) {
    planService.incrementCurrentYear();
   }
}];
