<script setup>
import { ref } from 'vue';
const props = defineProps(['type', 'sortDataField'])
const sortVal = ref(false)
const handleSorting = () => {
    sortVal.value = !sortVal.value
    props.sortDataField(props.type, sortVal.value)
}
</script>
<template>
    <p className="d-inline" :id="`srt-${type}`" @click="handleSorting">
        <i class="bi bi-arrow-down" v-if="sortVal"></i>
        <i class="bi bi-arrow-up" v-else></i>
    </p>
</template>