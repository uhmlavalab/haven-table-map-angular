export class TrackingPoint {

    private mapX: number;
    private mapY: number;
    private camX: number;
    private camY: number;
    public detected: boolean;

    constructor(camX: number, camY: number, mapX: number, mapY: number) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.camX = camX;
        this.camY = camY;
    }

    public setCamPoint(x: number, y: number): void {
        this.camX = x;
        this.camY = y;
    }

    public setMapPoint(x: number, y: number): void {
        this.mapX = x;
        this.mapY = y;
    }

    public getCamX() {
        return this.camX;
    }

    public getCamY() {
        return this.camY;
    }

    public getMapX() {
        return this.mapX;
    }

    public getMapY() {
        return this.mapY;
    }

    public detect() {
        this.detected = true;
    }
}