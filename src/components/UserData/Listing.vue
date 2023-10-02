<script setup>
import { ref, onMounted } from 'vue';
import ConfirmModal from '../ConfirmModal.vue'
import useData from '../../composables/logic';
import stateCity from '../../assets/stateCities.json'
import "vue-search-select/dist/VueSearchSelect.css"

defineProps(['data', 'handleEdit'])
const isDeleteModal = ref(false)
const deleteIndex = ref(null)
const allUsers = ref([])
const newUserData = ref([])
const hobbiesArr = ['Chess', 'Badminton', 'Hockey', 'Reading']
const { setLocalStorageData, sortData } = useData()
const search = ref({ name: '', city: '', state: '', gender: '', hobbies: [], startAge: 0, MaxAge: 0 })
const cityList = ref([])
const stateList = ref([])

onMounted(() => {
    allUsers.value = JSON.parse(localStorage.getItem('userData1'))
    newUserData.value = allUsers.value

    // Sort Data
    sortData(newUserData.value)

    // Get Maximum Age
    let ages = allUsers.value?.map((i) => i.Age)
    search.value.MaxAge = Math.max.apply(0, ages)
    search.value.startAge = search.value.MaxAge

    // Set state list
    Object.keys(stateCity).map((state) => {
        stateList.value.push({ value: state, text: state })
    })

    // Set city list
    Object.values(stateCity).map((c) => {
        cityList.value.push(...c)
    })
})

// Open Delete Modal
const handleDeleteModal = (key) => {
    isDeleteModal.value = true
    deleteIndex.value = key
}
// Delete Data
const handleDelete = (id) => {
    let d = allUsers.value.filter((user) => user.Id !== id)
    allUsers.value = d
    newUserData.value = d
    setLocalStorageData(allUsers.value)
}
// Close Delete Modal
const closeDeleteModal = () => {
    isDeleteModal.value = false
}

const handleSearch = () => {
    newUserData.value = allUsers.value.filter((user) => {
        if (
            (search.value.name.length === 0 ? true : (user.FirstName.toUpperCase() + " " + user.LastName.toUpperCase()).includes(search.value.name.toUpperCase())) &&
            (search.value.city.length === 0 ? true : user.City.toUpperCase().includes(search.value.city.toUpperCase())) &&
            (search.value.state.length === 0 ? true : user.State.toUpperCase().includes(search.value.state.toUpperCase())) &&
            (search.value.gender.length === 0 ? true : user.Gender.toUpperCase() === search.value.gender.toUpperCase()) &&
            (search.value.hobbies.length === 0 ? true : !search.value.hobbies.some(h => user.Hobbies.indexOf(h) === -1)) &&
            (search.value.startAge === 0 ? true : user.Age <= search.value.startAge)
        ) {
            return true
        }
        else return false
    })
}
</script>
<template>
    <div class="container m-auto pt-4 pb-5" v-if="allUsers?.length > 0">
        <div class="row my-2">
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <input v-model="search.name" type="text" class="form-control" placeholder="Search by Name.." />
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select class="slectpicker form-select" v-model="search.state">
                    <option selected value="">Search by State</option>
                    <option v-for="state in Object.keys(stateCity).sort()" :value="state">{{ state }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select class="slectpicker form-select" v-model="search.city">
                    <option selected value="">Search by City</option>
                    <option v-for=" city in cityList.sort()" :value="city">{{ city }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select class="form-select" name="gender" v-model="search.gender">
                    <option value="">Search Based on gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="col-12 col-lg-6 my-1">
                <div class="form-group mb-3 row mx-auto">
                    <label for="hobbies" class="p-0">Hobbies</label>
                    <div class="form-check col-6 col-sm-3" v-for="hobby in hobbiesArr">
                        <input class="form-check-input" name="hobbies" type="checkbox" v-model="search.hobbies"
                            :value="hobby" :id="hobby">
                        <label class="form-check-label" :for="hobby">
                            {{ hobby }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <span class="d-block text-center"><strong> Age: </strong>{{ search.startAge }}</span>
                <div class="d-flex">
                    0<input type="range" id="to" class="form-range" v-model="search.startAge" min="0"
                        :max="search.MaxAge" />{{ search.MaxAge }}
                </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <button @click="handleSearch" id="filter" class="btn btn-success border ms-auto d-block">Filter</button>
            </div>
        </div>
        <div class="table-responsive text-nowrap">
            <table id="tblOutput" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <template v-for="(value, key) of newUserData[0]">
                            <th v-if="key !== 'Id'">{{ key }}</th>
                        </template>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, key) of newUserData" :id="`tr${key + 1}`">
                        <template v-for="(val, k) of value">
                            <td v-if="k !== 'Id'">
                                <template v-if="k === 'Hobbies'">{{ val.sort().join(', ') }}</template>
                                <template v-else-if="k === 'Age'">
                                    <span v-if="val < 60">{{ val }}</span>
                                    <span v-else class="text-success">{{ val }}</span>
                                </template>
                                <template v-else>{{ val }}</template>
                            </td>
                        </template>
                        <td><router-link :to="`/userData/edit/${value.Id}`" class="btn btn-success"
                                :id="`${value.FirstName}-${value.LastName}-edit`" style="font-size: 14px;"> Edit<i
                                    class="bi bi-pencil-fill ms-1"></i></router-link>
                        </td>
                        <td><button class="btn btn-danger" style="font-size: 14px"
                                :id="`${value.FirstName}-${value.LastName}-delete`"
                                @click="handleDeleteModal(value.Id)">Delete
                                <i class="bi bi-trash"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <ConfirmModal v-if="isDeleteModal" :closeDeleteModal="closeDeleteModal" :handleDelete="handleDelete"
        :deleteIndex="deleteIndex" />
</template>