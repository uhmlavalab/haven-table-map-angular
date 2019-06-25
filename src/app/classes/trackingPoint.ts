export class TrackingPoint {

    private mapX: number;
    private mapY: number;
    private camX: number;
    private camY: number;
    public detected: boolean;

    constructor() {
        this.mapX = 0;
        this.mapY = 0
        this.camX = 0;
        this.camY = 0;
        this.detected = false;
    }

    public setCamPoint(x: number, y: number): void {
        this.camX = x;
        this.camY = y;
    }

    public setMapPoint(x: number, y: number): void {
        this.mapX = x;
        this.mapY = y;
    }

    public detect() {
        this.detected = true;
    }
}