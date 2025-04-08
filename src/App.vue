<script setup>
import "leaflet/dist/leaflet.css"

import {ref, onMounted} from 'vue';
import * as L from 'leaflet';
import * as turf from '@turf/turf'

import 'leaflet-rotate';
import 'leaflet-geometryutil'

import {FlyingObjectLayer} from "@/flyingObjectLayer.js";
import {MovingCircle} from "@/flyingObjects/circle.js";
import {MovingSquare} from "@/flyingObjects/square.js";
import {MovingTriangle} from "@/flyingObjects/triangle.js";
import estonia from "@/assets/estonia.json"
import AddObjectsButton from "@/components/Sidebar/AddObjectsButton.vue";
import SimulationSpeedButton from "@/components/Sidebar/SimulationSpeedButton.vue";
import VisibilityButton from "@/components/Sidebar/VisibilityButton.vue";
import ObjectInfo from "@/components/ObjectInfo.vue";

const initialMap = ref(null);
const flyingObjectLayer = ref(null)
const numberOfObjectsToAdd = ref(1)
const objectLimit = ref(5000)

function updateAndRender() {
    if (!flyingObjectLayer.value) {
        return null
    }

    flyingObjectLayer.value.drawObjects();

    requestAnimationFrame(updateAndRender);
}

requestAnimationFrame(updateAndRender);

onMounted(() => {
    initialMap.value = L.map('map', {
        maxZoom: 19,
        rotate: true,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        rotateControl: {
            closeOnZeroBearing: false,
            position: 'topright',
        },
    }).setView([58.5953, 25.0136], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(initialMap.value);

    flyingObjectLayer.value = new FlyingObjectLayer();
    flyingObjectLayer.value.addTo(initialMap.value)

    initialMap.value.zoomControl.setPosition('topright');

    const panControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-control-pan');

            const upButton = L.DomUtil.create('button', '', container);
            upButton.innerHTML = '↑';
            L.DomEvent.on(upButton, 'click', function () {
                map.panBy([0, -50]);
            });

            L.DomEvent.on(upButton, 'dblclick', function (event) {
                L.DomEvent.stopPropagation(event);
            });

            const leftButton = L.DomUtil.create('button', '', container);
            leftButton.innerHTML = '←';
            L.DomEvent.on(leftButton, 'click', function () {
                map.panBy([-50, 0]);
            });
            L.DomEvent.on(leftButton, 'dblclick', function (event) {
                L.DomEvent.stopPropagation(event);
            });

            const rightButton = L.DomUtil.create('button', '', container);
            rightButton.innerHTML = '→';
            L.DomEvent.on(rightButton, 'click', function () {
                map.panBy([50, 0]);
            });
            L.DomEvent.on(rightButton, 'dblclick', function (event) {
                L.DomEvent.stopPropagation(event);
            });

            const downButton = L.DomUtil.create('button', '', container);
            downButton.innerHTML = '↓';
            L.DomEvent.on(downButton, 'click', function () {
                map.panBy([0, 50]);
            });
            L.DomEvent.on(downButton, 'dblclick', function (event) {
                L.DomEvent.stopPropagation(event);
            });

            return container;
        }
    });

    initialMap.value.addControl(new panControl());
});

function getRandomPointInsidePolygon(polygonGeoJSON) {
    const polygon = polygonGeoJSON.getLayers()[0].feature.geometry;
    const bounds = turf.bbox(polygon);
    const [minLng, minLat, maxLng, maxLat] = bounds;

    let point;

    do {
        const lon = Math.random() * (maxLng - minLng) + minLng;
        const lat = Math.random() * (maxLat - minLat) + minLat;

        point = turf.point([lon, lat]);
    } while (!turf.booleanPointInPolygon(point, polygon));

    return [point.geometry.coordinates[1], point.geometry.coordinates[0]];
}


const onToggleVisibility = (type) => {
    flyingObjectLayer.value.flyingObjectVisibility[type] = !flyingObjectLayer.value.flyingObjectVisibility[type]
}

const addMovingObject = (type) => {
    const estoniaData = L.geoJSON(estonia)

    for (let i = 0; i < numberOfObjectsToAdd.value; i++) {
        if (flyingObjectLayer.value.getTotalNumberOfFlyingObjects() >= objectLimit.value) {
            return
        }

        let movingObject

        let position = getRandomPointInsidePolygon(estoniaData)

        if (type === 'SQUARE') {
            movingObject = new MovingSquare(flyingObjectLayer.value.gl, position[0], position[1])
        } else if (type === 'CIRCLE') {
            movingObject = new MovingCircle(flyingObjectLayer.value.gl, position[0], position[1])
        } else if (type === 'TRIANGLE') {
            movingObject = new MovingTriangle(flyingObjectLayer.value.gl, position[0], position[1])
        }

        flyingObjectLayer.value.flyingObjects[type].push(movingObject)
    }
}

</script>

<template>
    <div>
        <div id="map" style="width: 100vw; height: 100vh"></div>
        <canvas id="draw-canvas"></canvas>
        <div
            v-if="flyingObjectLayer"
            class="controls"
        >
            <AddObjectsButton
                :number-of-objects-to-add="numberOfObjectsToAdd"
                :number-of-objects-active="flyingObjectLayer.getTotalNumberOfFlyingObjects()"
                :total-number-of-objects-allowed="objectLimit"
                @add-moving-object="addMovingObject($event)"
                @update-number-of-objects-to-add="numberOfObjectsToAdd = $event"
            />
            <VisibilityButton
                :object-visibility="flyingObjectLayer.flyingObjectVisibility"
                @toggle-visibility="onToggleVisibility($event)"
            />
            <SimulationSpeedButton
                :simulation-speed="flyingObjectLayer.simulationSpeed"
                @update-simulation-speed="flyingObjectLayer.simulationSpeed = $event"
            />
        </div>
        <ObjectInfo
            v-if="flyingObjectLayer && flyingObjectLayer.selectedObject"
            :flying-object="flyingObjectLayer.selectedObject"
        />
    </div>
</template>

<style scoped>
#draw-canvas {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 500;
    pointer-events: none;
}

</style>