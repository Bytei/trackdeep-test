import {FlyingObject} from "@/flyingObject.js";
import {getRandomBetween} from "@/helpers.js";

export class MovingCircle extends FlyingObject {
    constructor(gl, startLat, startLon) {
        super('circle', startLat, startLon);
        this.speed = getRandomBetween(110, 300) / (3600 / 1000);
        this.radius = getRandomBetween(10000, 30000);
        this.angle = getRandomBetween(0, 360);
    }

    getTimeToCompletePath() {
        const circumference = 2 * Math.PI * this.radius;
        return circumference / this.speed;
    }

    isExpired() {
        let distanceTravelled = this.speed * this.timeElapsed;
        const circumference = 2 * Math.PI * this.radius;
        const totalAngleTravelled = (distanceTravelled / circumference) * 360;
        return totalAngleTravelled >= 360;
    }

    getPositionAtTime(timeElapsed) {
        let distanceTravelled = this.speed * timeElapsed;
        distanceTravelled += (this.angle / 360) * (2 * Math.PI * this.radius);
        const circumference = 2 * Math.PI * this.radius;
        let fraction = (distanceTravelled % circumference) / circumference;
        let angleInRadians = fraction * 2 * Math.PI;

        const offsetDistance = -this.radius;
        const offsetAngle = this.angle * (Math.PI / 180);

        const lat1 = this.startLat * (Math.PI / 180);
        const lon1 = this.startLon * (Math.PI / 180);

        const newLat = Math.asin(Math.sin(lat1) * Math.cos(offsetDistance / 6371000) +
            Math.cos(lat1) * Math.sin(offsetDistance / 6371000) * Math.cos(offsetAngle));
        const newLon = lon1 + Math.atan2(Math.sin(offsetAngle) * Math.sin(offsetDistance / 6371000) * Math.cos(lat1),
            Math.cos(offsetDistance / 6371000) - Math.sin(lat1) * Math.sin(newLat));

        const deltaLat = Math.asin(Math.sin(newLat) * Math.cos(this.radius / 6371000) +
            Math.cos(newLat) * Math.sin(this.radius / 6371000) * Math.cos(angleInRadians));
        const deltaLon = newLon + Math.atan2(Math.sin(angleInRadians) * Math.sin(this.radius / 6371000) * Math.cos(newLat),
            Math.cos(this.radius / 6371000) - Math.sin(newLat) * Math.sin(deltaLat));

        const lat = deltaLat * (180 / Math.PI);
        const lon = deltaLon * (180 / Math.PI);

        return [lat, lon];
    }
}
