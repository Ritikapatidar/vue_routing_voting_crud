<script setup>
const props = defineProps(['modelValue', 'type', 'placeholder'])
</script>
<template>
    <input class="form-control border border-secondary" @input="$emit('update:modelValue', $event.target.value)" :type="type" v-bind="$attrs"
        :placeholder="placeholder" />
</template>