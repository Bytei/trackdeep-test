<script setup>
import "leaflet/dist/leaflet.css"
import CircleIcon from 'vue-material-design-icons/Circle.vue';
import CircleOutlineIcon from 'vue-material-design-icons/CircleOutline.vue'
import TriangleOutlineIcon from 'vue-material-design-icons/TriangleOutline.vue'
import TriangleIcon from 'vue-material-design-icons/Triangle.vue'
import SquareIcon from "vue-material-design-icons/Square.vue";
import SquareOutlineIcon from "vue-material-design-icons/SquareOutline.vue";
import EyeIcon from "vue-material-design-icons/Eye.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";

const emit = defineEmits(['toggle-visibility'])

defineProps({
    objectVisibility: {
        type: Object,
        required: true
    }
})

</script>

<template>
    <div class="position-relative">
        <PrimaryButton
            :icon="EyeIcon"
        >
            <div style="white-space: nowrap; margin-bottom: 8px">
                Toggle visibility
            </div>
            <div class="d-flex">
                <SecondaryButton
                    :icon="objectVisibility.SQUARE ? SquareIcon : SquareOutlineIcon"
                    style="margin-right: 8px"
                    @click="emit('toggle-visibility', 'SQUARE')"
                />
                <SecondaryButton
                    :icon="objectVisibility.CIRCLE ? CircleIcon : CircleOutlineIcon"
                    style="margin-right: 8px"
                    @click="emit('toggle-visibility', 'CIRCLE')"
                />
                <SecondaryButton
                    :icon="objectVisibility.TRIANGLE ? TriangleIcon : TriangleOutlineIcon"
                    @click="emit('toggle-visibility', 'TRIANGLE')"
                />
            </div>
        </PrimaryButton>
    </div>
</template>
