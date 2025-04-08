import * as L from "leaflet";
import {
    createCircleVertices,
    createSquareVertices,
    createTriangleVertices,
    getGlLocations,
    initWebGL,
    createVertexBuffer
} from "@/webGL.js";

export class FlyingObjectLayer extends L.Layer {
    constructor(props) {
        super(props);

        this.flyingObjects = {
            CIRCLE: [],
            TRIANGLE: [],
            SQUARE: []
        };
        this.flyingObjectVisibility = {
            CIRCLE: true,
            TRIANGLE: true,
            SQUARE: true
        }
        this.selectedObject = null;
        this.lastUpdate = Date.now();
        this.simulationSpeed = 1.0;
        this.glLocations = {}
        this.objectData = {}
    }

    onAdd(map) {
        this._map = map;
        this.canvas = document.querySelector('#draw-canvas');

        this.gl = this.canvas.getContext("webgl");
        if (!this.gl) {
            console.error("WebGL not supported");
            return;
        }

        this.shaderProgram = initWebGL(this.gl);

        this.glLocations = getGlLocations(this.gl, this.shaderProgram)

        const circleVertices = createCircleVertices(12, 10)
        const squareVertices = createSquareVertices(12)
        const triangleVertices = createTriangleVertices(12)

        this.objectData = {
            CIRCLE: {
                color: [1.0, 0.0, 0.0, 1.0],
                verticesLength: circleVertices.length,
                vertexBuffer: createVertexBuffer(circleVertices, this.gl)
            },
            SQUARE: {
                color: [0.0, 1.0, 0.0, 1.0],
                verticesLength: squareVertices.length,
                vertexBuffer: createVertexBuffer(squareVertices, this.gl)
            },
            TRIANGLE: {
                color: [0.0, 0.0, 1.0, 1.0],
                verticesLength: triangleVertices.length,
                vertexBuffer: createVertexBuffer(triangleVertices, this.gl)
            }
        }

        map.on('moveend', this._resizeCanvas, this);
        map.on('zoomend', this._resizeCanvas, this);
        map.on('click', this._onMapClick, this);
        map.on('dragend', this._resizeCanvas, this);

        this._resizeCanvas();
    }

    getTotalNumberOfFlyingObjects() {
        let total = 0;
        for (const type of Object.keys(this.flyingObjects)) {
            total += this.flyingObjects[type].length
        }

        return total
    }

    _resizeCanvas() {
        const size = this._map.getSize();

        this.canvas.width = size.x;
        this.canvas.height = size.y;

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects();
    }

    _clearExpiredObjects() {
        for (const type of Object.keys(this.flyingObjects)) {
            this.flyingObjects[type] = this.flyingObjects[type].filter(x => !x.isExpired())
        }

        if (this.selectedObject && this.selectedObject.isExpired()) {
            this.selectedObject = null
        }
    }

    drawObjects() {
        this._clearExpiredObjects()
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const now = Date.now();
        const deltaTime = ((now - this.lastUpdate) / 1000) * this.simulationSpeed;  // in seconds
        this.lastUpdate = now

        this.gl.uniform2f(this.glLocations.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);

        for (const flyingObjectType of Object.keys(this.flyingObjects)) {
            const flyingObjects = this.flyingObjects[flyingObjectType]

            this.gl.uniform4fv(this.glLocations.colorLocation, this.objectData[flyingObjectType].color);  // Red color (Fully opaque)
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objectData[flyingObjectType].vertexBuffer);
            this.gl.vertexAttribPointer(this.glLocations.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.glLocations.positionLocation);

            for (const flyingObject of flyingObjects) {
                flyingObject.timeElapsed += deltaTime;

                if (!this.flyingObjectVisibility[flyingObjectType]) {
                    continue
                }
                flyingObject.drawObject(this.gl, this.glLocations, this._map, this.objectData[flyingObjectType].verticesLength);
            }
        }

        if (this.selectedObject) {
            this.gl.uniform2fv(this.glLocations.positionOffsetLocation, [0, 0]);

            this.selectedObject.drawTail(this.gl, this.glLocations, this._map)
            this.selectedObject.drawTrajectory(this.gl, this.glLocations, this._map)
        }
    }

    _onMapClick(event) {
        const clickPosition = event.latlng;
        this._getObjectAtPosition(clickPosition);
    }

    _getObjectAtPosition(clickPosition) {
        const clickPoint = this._map.latLngToContainerPoint(clickPosition);

        for (const type of Object.keys(this.flyingObjects)) {
            if (!this.flyingObjectVisibility[type]) {
                continue
            }

            for (const obj of this.flyingObjects[type]) {
                const objectPosition = obj.getCurrentPosition();
                const objectPoint = this._map.latLngToContainerPoint(objectPosition);

                const radius = 10;
                const distance = Math.sqrt(Math.pow(objectPoint.x - clickPoint.x, 2) + Math.pow(objectPoint.y - clickPoint.y, 2));

                if (distance <= radius) {
                    this.selectedObject = obj;
                    return;
                }
            }
        }

        this.selectedObject = null;
    }
}
