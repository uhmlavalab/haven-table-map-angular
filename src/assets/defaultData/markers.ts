import { Marker } from '@app/input';
import { UserInputService } from '@app/input';

export const markers: Marker[] = [{
  markerId: 1,
  //markerId: 1,
  secondId: 3,
  job: 'year',
  delay: 75,
  minRotation: 3,
  rotateLeft(inputService: UserInputService) {
    inputService.sendInputEvent('decrement_year');
  },
  rotateRight(inputService: UserInputService) {
    inputService.sendInputEvent('decrement_year');  }
}, {
  markerId: 7,
  secondId: 6,
  job: 'layer',
  delay: 300,
  minRotation: 5,
  rotateLeft(inputService: UserInputService) {
    inputService.sendInputEvent('decrement_maplayer');
   },
   rotateRight(inputService: UserInputService) {
    inputService.sendInputEvent('increment_maplayer');
   }
}, {
  markerId: 4,
  secondId: 9,
  job: 'scenario',
  delay: 300,
  minRotation: 5,
  rotateLeft(inputService: UserInputService) {
    inputService.sendInputEvent('decrement_scenario');
   },
   rotateRight(inputService: UserInputService) {
    inputService.sendInputEvent('increment_scenario');
   }
}, {
  markerId: 8,
  secondId: 7,
  job: 'add',
  delay: 300,
  minRotation: 5,
  rotateLeft(inputService: UserInputService) {
    inputService.sendInputEvent('toggle_maplayer');
   },
   rotateRight(inputService: UserInputService) {
    inputService.sendInputEvent('toggle_maplayer');
   }
}];
