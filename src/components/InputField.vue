<script setup>
const props = defineProps(['modelValue', 'type'])
</script>
<template>
    <input class="form-control" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" :type="type" v-bind="$attrs" />
</template>