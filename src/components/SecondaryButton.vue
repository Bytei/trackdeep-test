<script setup>
const emit = defineEmits(['click'])

defineProps({
    icon: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="secondary-button" @click="emit('click', $event)">
        <component :is="icon"/>
    </div>
</template>

<style scoped>
.secondary-button {
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border-radius: 8px;
    min-width: 24px;
    padding: 8px 12px;

    &:hover {
        background: rgba(0, 0, 0, 1.0);
    }
}

</style>