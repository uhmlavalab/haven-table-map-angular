import { UserInputService } from '@app/input';

export interface Marker {
  markerId: number;
  secondId: number;
  job: string;
  delay: number;
  minRotation: number;
  rotateLeft(service: UserInputService): void;
  rotateRight(service: any): void;
}