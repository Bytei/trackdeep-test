export class FlyingObject {
    constructor(type, startLat, startLon) {
        this.type = type;
        this.startLat = startLat
        this.startLon = startLon
        this.tailDuration = 60;
        this.timeElapsed = 0;
        this.lifespan = null;
    }

    getTimeToExpire() {
        if (!this.lifespan) {
            return
        }

        const timeToCompletePathExpire = this.getTimeToCompletePath() - this.timeElapsed
        const timeToExpire = this.lifespan - this.timeElapsed

        if (timeToCompletePathExpire < timeToExpire) {
            return timeToCompletePathExpire
        } else {
            return timeToExpire
        }
    }

    isExpired() {
        return false
    }

    getCurrentPosition() {
        return this.getPositionAtTime(this.timeElapsed)
    }

    getPositionAtTime(timeElapsed) {
    }

    getTimeToCompletePath() {
        return 0
    }

    drawTrajectory(gl, glLocations, map) {
        const timeToCompletePath = this.getTimeToCompletePath();
        const points = 500;
        const lines = [];

        let lastLongitude = null;
        let lastLatitude = null;

        let positions = [];
        for (let i = 0; i <= points; i++) {
            const timeElapsed = (i / points) * timeToCompletePath;
            const [lat, lon] = this.getPositionAtTime(timeElapsed);

            const latLng = map.latLngToContainerPoint([lat, lon]);

            const invertedY = gl.canvas.height - latLng.y;

            if (lastLongitude !== null) {
                const deltaLon = Math.abs(lon - lastLongitude);
                if (deltaLon > 180) {
                    lines.push(positions);
                    positions = [];
                }
            }

            if (lastLatitude !== null) {
                const deltaLat = Math.abs(lat - lastLatitude);
                if (deltaLat > 45) {
                    lines.push(positions);
                    positions = [];
                }
            }

            lastLongitude = lon;
            lastLatitude = lat;

            positions.push(latLng.x, invertedY);
        }

        if (positions.length) {
            lines.push(positions);
        }

        const color = [0.0, 0.5, 1.0, 1.0];
        gl.uniform4fv(glLocations.colorLocation, color);

        for (const line of lines) {
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);

            gl.vertexAttribPointer(glLocations.positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(glLocations.positionLocation);

            gl.drawArrays(gl.LINE_STRIP, 0, line.length / 2);
        }
    }


    drawTail(gl, glLocations, map) {
        let trailStartTime = this.timeElapsed - this.tailDuration;
        if (trailStartTime < 0) {
            trailStartTime = 0;
        }

        let positions = [];
        const lines = []
        let lastLongitude = null;
        let lastLatitude = null;

        const timeStep = 0.1;
        for (let i = trailStartTime; i <= this.timeElapsed; i += timeStep) {
            const [lat, lon] = this.getPositionAtTime(i);
            const point = map.latLngToContainerPoint([lat, lon]);

            const invertedY = gl.canvas.height - point.y;

            if (lastLongitude !== null) {
                const deltaLon = Math.abs(lon - lastLongitude);
                if (deltaLon > 90) {
                    lines.push(positions);
                    positions = [];
                }
            }

            if (lastLatitude !== null) {
                const deltaLat = Math.abs(lat - lastLatitude);
                if (deltaLat > 180) {
                    lines.push(positions);
                    positions = [];
                }
            }

            lastLongitude = lon;
            lastLatitude = lat;

            positions.push(point.x, invertedY);
        }

        if (positions.length) {
            lines.push(positions);
        }

        const color = [0.0, 0.0, 0.0, 1.0];
        gl.uniform4fv(glLocations.colorLocation, color);
        for (const line of lines) {
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);

            gl.vertexAttribPointer(glLocations.positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(glLocations.positionLocation);

            gl.drawArrays(gl.LINE_STRIP, 0, line.length / 2);
        }
    }

    drawObject(gl, glLocations, map, verticesLength) {
        const currentPosition = this.getCurrentPosition();
        const latLng = map.latLngToContainerPoint(currentPosition);

        gl.uniform2fv(glLocations.positionOffsetLocation, [latLng.x, gl.canvas.height - latLng.y]);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesLength / 2);
    }
}