<script setup>
import { ref, onMounted } from 'vue';
import ConfirmModal from '../ConfirmModal.vue'
import useData from '../../composables/logic';
const props = defineProps(['data', 'handleEdit'])
const isDeleteModal = ref(false)
const deleteIndex = ref(null)
const allUsers = ref([])
const { setLocalStorageData } = useData()
onMounted(() => {
    allUsers.value = JSON.parse(localStorage.getItem('userData'))
})
const handleDeleteModal = (key) => {
    isDeleteModal.value = true
    deleteIndex.value = key
}
const handleDelete = (index) => {
    allUsers.value = allUsers.value.filter((user) => allUsers.value.indexOf(user) !== index)
    setLocalStorageData(allUsers.value)
}
const closeDeleteModal = () => {
    isDeleteModal.value = false
}
</script>
<template>
    <div class="container m-auto pt-4 pb-5" v-if="allUsers?.length > 0">
        <div class="table-responsive text-nowrap">
            <table id="tblOutput" class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <template v-for="(value, key) of allUsers[0]">
                            <th v-if="key !== 'Id'">{{ key }}</th>
                        </template>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, key) of allUsers" :id="`tr${key + 1}`">
                        <template v-for="(val, k) of value">
                            <td v-if="k !== 'Id'">
                                <template v-if="k === 'Hobbies'">{{ val.join(', ') }}</template>
                                <template v-else>{{ val }}</template>
                            </td>
                        </template>
                        <td><router-link :to="`/userData/edit/${value.Id}`" class="btn btn-success"
                                style="font-size: 14px;"> Edit<i class="bi bi-pencil-fill"></i></router-link>
                        </td>
                        <td><button class="btn btn-danger" style="font-size: 14px" @click="handleDeleteModal(key)">Delete
                                <i class="bi bi-trash"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <ConfirmModal v-if="isDeleteModal" :closeDeleteModal="closeDeleteModal" :handleDelete="handleDelete"
        :deleteIndex="deleteIndex" />
</template>