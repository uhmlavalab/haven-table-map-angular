import { Marker } from '@app/interfaces';
import { PlanService } from '../../app/services/plan.service'

export const markers: Marker[] = [{
  markerId: 3,
  //markerId: 1,
  secondId: 3,
  job: 'year',
  delay: 75, 
  minRotation: 4,
  rotateLeft(planService: PlanService) {
   planService.decrementCurrentYear();
  },
  rotateRight(planService: PlanService) {
    planService.incrementCurrentYear();
  }
}, {
  markerId: 6,
  secondId: 7,
  job: 'layer',
  delay: 300, 
  minRotation: 5,
  rotateLeft(planService: PlanService) {
    planService.decrementNextLayer();
   },
   rotateRight(planService: PlanService) {
    planService.incrementNextLayer();
   }
}, {
  markerId: 5,
  secondId: 9,
  job: 'scenario',
  delay: 300, 
  minRotation: 5,
  rotateLeft(planService: PlanService) {
    this.planService.decrementScenario();
   },
   rotateRight(planService: PlanService) {
    this.planService.incrementScenario();
   }
}, {
  markerId: 8,
  secondId: 7,
  job: 'add',
  delay: 1000, 
  minRotation: 5,
  rotateLeft(planService: PlanService) {
    planService.toggleLayer();
   },
   rotateRight(planService: PlanService) {
    planService.toggleLayer();
   }
}];