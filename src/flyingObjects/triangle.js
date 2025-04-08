import {FlyingObject} from "@/flyingObject.js";
import {getRandomBetween, haversine, wrapLatitude, wrapLongitude} from "@/helpers.js";

export class MovingTriangle extends FlyingObject {
    constructor(gl, startLat, startLon) {
        super('triangle', startLat, startLon);
        this.speed = getRandomBetween(1700, 2200) / (3600 / 1000)
        this.lifespan = 3600;
        this.destination = this._generateRandomDestination();
    }


    getTimeToCompletePath() {
        const distanceToDestination = haversine(this.startLat, this.startLon, this.destination[0], this.destination[1]);

        const timeToComplete = distanceToDestination / this.speed;

        if (timeToComplete > this.lifespan) {
            return this.lifespan
        }

        return timeToComplete;
    }

    getPositionAtTime(timeElapsed) {
        const distanceTraveled = this.speed * timeElapsed;
        const heading = this._calculateHeading([this.startLat, this.startLon], this.destination);

        let [newLat, newLon] = this._calculateGreatCirclePosition(this.startLat, this.startLon, heading, distanceTraveled);

        if (timeElapsed > this.lifespan || haversine(newLat, newLon, this.destination[0], this.destination[1]) <= this.speed) {
            [newLat, newLon] = this.destination;
        }

        return [newLat, newLon];
    }

    isExpired() {
        return this.timeElapsed > this.lifespan || this.timeElapsed > this.getTimeToCompletePath()
    }

    _generateRandomDestination() {
        const lat = getRandomBetween(-90, 90);
        const lon = getRandomBetween(-180, 180);
        return [lat, lon];
    }

    _calculateGreatCirclePosition(lat, lon, heading, distance) {
        const angle = heading * (Math.PI / 180);
        const angularDistance = distance / 6371000;

        const lat1 = lat * (Math.PI / 180);
        const lon1 = lon * (Math.PI / 180);

        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(angle));
        const lon2 = lon1 + Math.atan2(Math.sin(angle) * Math.sin(angularDistance) * Math.cos(lat1),
            Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));

        const newLat = lat2 * (180 / Math.PI);
        let newLon = lon2 * (180 / Math.PI);

        newLon = (newLon + 540) % 360 - 180;

        return [newLat, newLon];
    }

    _calculateHeading([firstLatitude, firstLongitude], [secondLatitude, secondLongitude]) {
        const firstLatitudeRadians = firstLatitude * Math.PI / 180;
        const secondLatitudeRadians = secondLatitude * Math.PI / 180;
        const longitudeDifference = (secondLongitude - firstLongitude) * Math.PI / 180;

        const yComponent = Math.sin(longitudeDifference) * Math.cos(secondLatitudeRadians);
        const xComponent = Math.cos(firstLatitudeRadians) * Math.sin(secondLatitudeRadians)
            - Math.sin(firstLatitudeRadians) * Math.cos(secondLatitudeRadians) * Math.cos(longitudeDifference);
        const headingAngle = Math.atan2(yComponent, xComponent);

        return (headingAngle * 180 / Math.PI + 360) % 360;
    }

}
