<script setup>
import { ref, onMounted } from 'vue';
import ConfirmModal from '../ConfirmModal.vue'
import useData from '../../composables/logic';
import stateCityArea from '../../assets/indianStateandAreawithcode.json'
import Pagination from '../../composables/Pagination';
import PaginationLink from '../PaginationLink.vue'
import TableHeaderVue from './TableHeader.vue';
defineProps(['data', 'handleEdit'])
const { setLocalStorageData, sortData } = useData()
const deleteModal = ref({ isModalVisible: false, deleteIndex: null })
const allUsers = ref([])
const newUserData = ref([])
const hobbiesArr = ['Chess', 'Badminton', 'Hockey', 'Reading']
const cityList = ref([])
const stateList = ref([])
const areaList = ref([])
const filter = ref({ city: '', state: '', area: '', gender: '', hobbies: [], minAge: 0, maxAge: 0, Age: 0 })
const searchName = ref('')
const pageObj = ref({ currentPage: 0, totalPage: 0, pageSize: 0 })
const sort = ref({ field: '', sortType: '' })
let filteredData = []
let searchData = []

// Common function for updating pagination data
const paginationUpdate = async (arr, page) => {
    const { totalPages, curPage, newPaginationData, updatePage } = await Pagination(sortData(arr), 5)
    updatePage(page)
    newUserData.value = newPaginationData.value
    pageObj.value.currentPage = curPage
    pageObj.value.totalPage = totalPages
}

onMounted(async () => {
    let data = await JSON.parse(localStorage.getItem('userData'))
    allUsers.value = data
    paginationUpdate(data, pageObj.value.currentPage)

    // Get Maximum Age
    let ages = allUsers.value?.map((i) => i.Age)
    filter.value.Age = Math.max.apply(0, ages)

    // Set state list
    stateList.value = stateCityArea.filter((s) => {
        return s.parentId === null
    })
})

// Update Pagination Page
const updatePagee = async (page) => {
    (!searchName.value) && (searchData = allUsers.value);
    (!filter.value.city && !filter.value.state && !filter.value.area && !filter.value.gender && filter.value.hobbies.length === 0 && filter.value.minAge === 0 && filter.value.maxAge === 0) && (filteredData = allUsers.value)

    let commonData = filteredData.filter((d) => searchData.includes(d))
    newUserData.value = commonData
    sortDataField(sort.value.field, sort.value.sortType)
    paginationUpdate(newUserData.value, page)
}

// Open Delete Modal
const handleDeleteModal = (key) => {
    deleteModal.value.isModalVisible = true
    deleteModal.value.deleteIndex = key
}
// Delete Data
const handleDelete = (id) => {
    let d = allUsers.value.filter((user) => user.Id !== id)
    allUsers.value = d
    paginationUpdate(d, pageObj.value.currentPage)
    setLocalStorageData(d)
}
// Close Delete Modal
const closeDeleteModal = () => {
    deleteModal.value.isModalVisible = false
}

// Search Based On Name
function handleNameSearch(e) {
    (!searchName.value) && (searchData = allUsers.value);
    (!filter.value.city && !filter.value.state && !filter.value.gender && filter.value.hobbies.length === 0 && filter.value.minAge === 0 && filter.value.maxAge === 0) && (filteredData = allUsers.value)

    searchData = allUsers.value.filter((user) => (user.FirstName.toUpperCase() + " " + user.LastName.toUpperCase()).includes(e.target.value.toUpperCase()))
    let commonData = filteredData.filter((d) => searchData.includes(d))
    paginationUpdate(commonData, 0)
}

// Filters
const handleFilter = () => {
    (!searchName.value) && (searchData = allUsers.value);
    (!filter.value.city && !filter.value.state && !filter.value.gender && filter.value.hobbies.length === 0 && filter.value.minAge === 0 && filter.value.maxAge === 0) && (filteredData = allUsers.value)

    filteredData = allUsers.value.filter((user) => {
        if (
            (filter.value.city.length === 0 ? true : user.City.toUpperCase().includes(filter.value.city.toUpperCase())) &&
            (filter.value.state.length === 0 ? true : user.State.toUpperCase().includes(filter.value.state.toUpperCase())) &&
            (filter.value.gender.length === 0 ? true : user.Gender.toUpperCase() === filter.value.gender.toUpperCase()) &&
            (filter.value.hobbies.length === 0 ? true : !filter.value.hobbies.some(h => user.Hobbies.indexOf(h) === -1)) &&
            ((filter.value.minAge <= 0 && filter.value.maxAge <= 0) ? true : (user.Age <= filter.value.maxAge && user.Age >= filter.value.minAge))
        ) {
            return true
        }
        else return false
    })
    let commonData = searchData.filter((d) => filteredData.includes(d))
    paginationUpdate(commonData, 0)
}
// Reset Filters
const handleReset = () => {
    filter.value.city = ''
    filter.value.state = ''
    filter.value.gender = ''
    filter.value.hobbies = []
    filter.value.minAge = 0
    filter.value.maxAge = 0
    if (searchName.value) {
        paginationUpdate(searchData, pageObj.value.currentPage)
    }
    else {
        paginationUpdate(allUsers.value, pageObj.value.currentPage)
    }
}

const sortDataField = (field, sortType) => {
    sort.value.field = field;
    sort.value.sortType = sortType;
    newUserData.value.sort((u1, u2) => {
        if (sortType) {
            if (typeof u1[field] === 'string') {
                return u1[field].toUpperCase() === u2[field].toUpperCase() ? 0 : u1[field].toUpperCase() > u2[field].toUpperCase() ? 1 : -1
            }
            else {
                return u1[field] === u2[field] ? 0 : u1[field] > u2[field] ? 1 : -1
            }
        }
        else {
            if (typeof u1[field] === 'string') {
                return u1[field].toUpperCase() === u2[field].toUpperCase() ? 0 : u1[field].toUpperCase() < u2[field].toUpperCase() ? 1 : -1
            }
            else {
                return u1[field] === u2[field] ? 0 : u1[field] < u2[field] ? 1 : -1
            }
        }
    })
}

const handleStateChange = (e) => {
    if (e) {
        let stateObj = stateCityArea.find(state => state.name === e)
        filter.value.city = ''
        filter.value.area = ''
        cityList.value = stateCityArea.filter((city) => city.parentId === stateObj.ID)
    }
}
const handleCityChange = (e) => {
    if (e) {
        let cityObj = stateCityArea.find(city => city.name === e)
        filter.value.area = ''
        areaList.value = stateCityArea.filter((area) => area.parentId === cityObj.ID)
    }
}
</script>
<template>
    <div class="container m-auto pt-4 pb-5" v-if="allUsers?.length > 0">
        <div class="row mb-2">
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <label class="fw-bold" for="search">Search</label>
                <input id="search" v-model="searchName" @input="handleNameSearch($event)" type="search" class="form-control"
                    placeholder="Search by Name.." />
            </div>
        </div>
        <div class="row my-2">
            <h6 class="mb-0 fw-bold">Filters</h6>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select id="filter-state" class="slectpicker form-select" v-model="filter.state"
                    @change="handleStateChange(filter.state)">
                    <option selected value="">Filter Based on State</option>
                    <option v-for="state of stateList" :value="state.name">{{ state.name }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select id="filter-city" class="slectpicker form-select" v-model="filter.city"
                    @change="handleCityChange(filter.city)">
                    <option selected value="">Filter Based on City</option>
                    <option v-for=" city in cityList.sort()" :value="city.name">{{ city.name }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select id="filter-city" class="slectpicker form-select" v-model="filter.area">
                    <option selected value="">Filter Based on Area</option>
                    <option v-for="area in areaList.sort()" :value="area.name">{{ area.name }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <select id="filter-gender" class="form-select" name="gender" v-model="filter.gender">
                    <option value="">Filter Based on gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="col-12 col-lg-6 my-1">
                <div class="form-group mb-3 row mx-auto">
                    <label for="filter-hobbies" class="p-0">Hobbies</label>
                    <div class="form-check col-6 col-sm-3" v-for="hobby in hobbiesArr">
                        <input class="form-check-input" name="filter-hobbies" type="checkbox" v-model="filter.hobbies"
                            :value="hobby" :id="hobby">
                        <label class="form-check-label" :for="hobby">
                            {{ hobby }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1">
                <div class="d-flex">
                    <div>
                        <label class="d-block" for="filter-minAge">Min Age</label>
                        <input type="number" min="0" max="120" class="w-100" id="filter-minAge" v-model="filter.minAge" />
                    </div>
                    <div>
                        <label class="d-block" for="filter-maxAge">Max Age</label>
                        <input type="number" min="0" max="120" class="w-100" id="filter-maxAge" v-model="filter.maxAge" />
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-3 my-1 text-center">
                <button @click="handleFilter" name="Filter" id="filter-btn" class="btn btn-success border">Filter</button>
                <button @click="handleReset" name="Reset" id="filter-reset" class="btn border text-light"
                    style="background-color: rgb(34, 129, 151)">Reset
                    <em class="bi bi-arrow-clockwise"></em></button>
            </div>
        </div>
        <div class="table-responsive text-nowrap">
            <table id="tblOutput" class="table table-striped table-bordered table-hover" v-if="newUserData.length > 0">
                <thead>
                    <tr>
                        <template v-for="(value, key) of newUserData[0]">
                            <th v-if="key !== 'Id'">
                                {{ key }}
                                <template v-if="(key !== 'Gender') && (key !== 'Hobbies')">
                                    <TableHeaderVue :type="key" :sortDataField="sortDataField" />
                                </template>
                            </th>
                        </template>
                        <th class="text-center">Edit</th>
                        <th class="text-center">Delete</th>
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
                        <td class="text-center"><router-link :to="`/userData/edit/${value.Id}`" class="btn btn-success"
                                :id="`${value.FirstName}-${value.LastName}-edit`" style="font-size: 14px;"><i
                                    class="bi bi-pencil-fill"></i></router-link>
                        </td>
                        <td class="text-center"><button class="btn btn-danger" style="font-size: 14px"
                                :id="`${value.FirstName}-${value.LastName}-delete`" @click="handleDeleteModal(value.Id)">
                                <i class="bi bi-trash"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <PaginationLink :pageObj="pageObj" :updatePage="updatePagee" />

    </div>
    <ConfirmModal v-if="deleteModal.isModalVisible" :closeDeleteModal="closeDeleteModal" :handleDelete="handleDelete"
        :deleteIndex="deleteModal.deleteIndex" />
</template>