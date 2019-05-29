export interface Marker {
  markerId: number,
  job: string,
  icon: string,
  live: boolean,
  startTime: number,
  rotationStartTime: number,
  corners: number[],
  prevCorners: number[],
  rotation: number,
  rotationSum: number
}
