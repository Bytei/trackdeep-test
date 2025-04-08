<script setup>
import "leaflet/dist/leaflet.css"
import SpeedometerIcon from "vue-material-design-icons/Speedometer.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

const props = defineProps({
    simulationSpeed: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update-simulation-speed'])

</script>

<template>
    <div class="position-relative">
        <PrimaryButton
            :icon="SpeedometerIcon"
        >
            <div style="text-nowrap; margin-bottom: 8px">
                Simulation speed: {{ simulationSpeed }}x
            </div>
            <div class="simulation-speed">
                <input style="min-width: 400px" type="range" min="-1000" max="1000" :value="props.simulationSpeed"
                       step="0.1" @input="emit('update-simulation-speed', Number($event.target.value))">
            </div>
        </PrimaryButton>
    </div>
</template>
