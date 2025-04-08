import {getRandomBetween, wrapLatitude, wrapLongitude} from "@/helpers.js";
import {FlyingObject} from "@/flyingObject.js";

export class MovingSquare extends FlyingObject {
    constructor(gl, startLat, startLon) {
        super('square', startLat, startLon);
        this.speed = getRandomBetween(50, 80) / (3600 / 1000)
        this.heading = getRandomBetween(0, 360);
    }

    getTimeToCompletePath() {
        const earthRadius = 6371000;
        const circumference = 2 * Math.PI * earthRadius;
        return circumference / this.speed;
    }

    getPositionAtTime(timeElapsed) {
        const movement = this.speed * timeElapsed;
        const headingInRadians = this.heading * (Math.PI / 180);
        const earthRadius = 6371000;
        const startLatInRadians = this.startLat * (Math.PI / 180);
        const startLonInRadians = this.startLon * (Math.PI / 180);

        const newLat = Math.asin(Math.sin(startLatInRadians) * Math.cos(movement / earthRadius) +
            Math.cos(startLatInRadians) * Math.sin(movement / earthRadius) * Math.cos(headingInRadians));

        const newLon = startLonInRadians + Math.atan2(Math.sin(headingInRadians) * Math.sin(movement / earthRadius) * Math.cos(startLatInRadians),
            Math.cos(movement / earthRadius) - Math.sin(startLatInRadians) * Math.sin(newLat));

        const newLatDeg = newLat * (180 / Math.PI);
        const newLonDeg = newLon * (180 / Math.PI);

        const lat = wrapLatitude(newLatDeg);
        const lon = wrapLongitude(newLonDeg);

        return [newLatDeg, newLonDeg];
    }
}
