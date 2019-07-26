export class TrackingPoint {

    private mapX: number;
    private mapY: number;
    private camX: number;
    private camY: number;
    private cam2X: number;
    private cam2Y: number;
    public detected: boolean;

    constructor(camX: number, camY: number, cam2X: number, cam2Y: number, mapX: number, mapY: number) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.camX = camX;
        this.camY = camY;
        this.cam2X = cam2X;
        this.cam2Y = cam2Y;
    }

    public setCamPoint(x: number, y: number): void {
        this.camX = x;
        this.camY = y;
    }

    public setMapPoint(x: number, y: number): void {
        this.mapX = x;
        this.mapY = y;
    }

    public getCam2X() {
        return this.getCam2X
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