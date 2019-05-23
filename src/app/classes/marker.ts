export class Marker {

  markerId: number;
  job: string;
  icon: string;

  constructor(id: number, job: string, icon: string) {
    this.markerId = id;
    this.job = job;
    this.icon = icon;
  }

}
