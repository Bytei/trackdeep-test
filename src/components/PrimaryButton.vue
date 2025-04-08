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
    <div class="primary-button-wrapper">
        <div class="primary-button" @click="emit('click', $event)">
            <component :is="icon"/>
        </div>
        <div class="content">
            <slot/>
        </div>
    </div>

</template>

<style scoped>
.content {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    right: 0;
    transform: translate(calc(100% + 8px));
    color: white;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
    border-radius: 0 10px 10px 10px;
    padding: 12px 20px;

    &:before {
        content: '';
        width: 16px;
        height: 64px;
        top: 0;
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        left: 0;
        transform: translateX(-100%);
    }

    &:hover {
        opacity: 1;
        pointer-events: all;
    }
}

.primary-button-wrapper {
    margin: 8px;
    position: relative;

    &:hover {
        .primary-button {
            background: rgba(0, 0, 0, 1.0);
        }
    }
}

.primary-button {
    padding: 20px 12px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
    z-index: 1;

    &:hover {
        background: rgba(0, 0, 0, 1.0);

        & + .content {
            display: block;
            pointer-events: all;
            opacity: 1;
        }
    }
}

</style>