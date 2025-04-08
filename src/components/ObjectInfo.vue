<script setup>
import "leaflet/dist/leaflet.css"

import 'leaflet-rotate';
import {computed} from "vue";

const props = defineProps({
    flyingObject: {
        type: Object,
        required: true
    }
})

const location = computed(() => {
    const position = props.flyingObject.getCurrentPosition()

    return `${position[0]} lat ${position[1]} lon}`
})

const timeToExpire = computed(() => {
    const timeToExpire = props.flyingObject.getTimeToExpire()
    if (timeToExpire) {
        return Math.round(props.flyingObject.getTimeToExpire()) + ' s'
    } else {
        return 'Never'
    }
})

const speed = computed(() => {
    return Math.round(props.flyingObject.speed * (3600 / 1000))
})

</script>

<template>
    <div
        class="object-info"
    >
        <div>Speed: {{ speed }} km/h</div>
        <div>Location: {{ location }}</div>
        <div>Time to expire: {{ timeToExpire }}</div>
        <div></div>
    </div>
</template>

<style scoped>
.object-info {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    min-width: 500px;
    padding: 12px 20px;
    margin: 8px;
    border-radius: 10px;
}
</style>