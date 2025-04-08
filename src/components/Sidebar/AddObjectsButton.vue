<script setup>
import "leaflet/dist/leaflet.css"
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import SquareIcon from "vue-material-design-icons/Square.vue";
import TriangleIcon from "vue-material-design-icons/Triangle.vue";
import CircleIcon from "vue-material-design-icons/Circle.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";

const emit = defineEmits(['add-moving-object', 'update-number-of-objects-to-add'])

defineProps({
    numberOfObjectsToAdd: {
        type: Number,
        required: true
    },
    numberOfObjectsActive: {
        type: Number,
        required: true
    },
    totalNumberOfObjectsAllowed: {
        type: Number,
        required: true
    }
})

</script>

<template>
    <div>
        <PrimaryButton
            :icon="PlusIcon"
        >
            <div style="white-space: nowrap; margin-bottom: 12px">Add object</div>
            <div class="d-flex">
                <SecondaryButton
                    :icon="SquareIcon"
                    style="margin-right: 8px"
                    @click="emit('add-moving-object', 'SQUARE')"
                />
                <SecondaryButton
                    :icon="CircleIcon"
                    style="margin-right: 8px"
                    @click="emit('add-moving-object', 'CIRCLE')"
                />
                <SecondaryButton
                    :icon="TriangleIcon"
                    @click="emit('add-moving-object', 'TRIANGLE')"
                />
            </div>
            <div style="white-space: nowrap; margin-top: 12px; margin-bottom: 12px">
                Number of objects to add: {{ numberOfObjectsToAdd }}
            </div>
            <input
                type="range"
                min="1"
                max="1000"
                :value="numberOfObjectsToAdd"
                step="1"
                @input="$emit('update-number-of-objects-to-add', Number($event.target.value))"
            >
            <div style="white-space: nowrap; margin-top: 12px; margin-bottom: 12px">
                Number of objects active: {{ numberOfObjectsActive }}/{{ totalNumberOfObjectsAllowed }}
            </div>
        </PrimaryButton>
    </div>
</template>
