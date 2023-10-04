<script setup>
import { ref } from 'vue';
const props = defineProps(['type', 'sortDataField'])
const toggle = ref(false)
const handleToggle = () => {
    toggle.value = !toggle.value
    props.sortDataField(props.type, toggle.value)
}
</script>
<template>
    <p className="d-inline" :id="`srt-${type}`" @click="handleToggle">
        <i class="bi bi-arrow-down" v-if="toggle"></i>
        <i class="bi bi-arrow-up" v-else></i>
    </p>
</template>