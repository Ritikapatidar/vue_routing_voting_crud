<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import useData from '../composables/logic';
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength, minValue, maxValue } from '@vuelidate/validators'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import stateCity from '../assets/stateCities.json'

const { setLocalStorageData } = useData()
const router = useRouter()
const route = useRoute()
const formData = ref({
    Id: Math.floor(Math.random() * 9999), FirstName: '', LastName: '', DateOfBirth: '', Gender: '', Age: 0, Hobbies: [], State: '', City: ''
})
const rules = computed(() => ({
    FirstName: {
        required: helpers.withMessage("First Name Can't be Blank *", required),
        minLength: helpers.withMessage("First Name must contain atleast 3 characters !", minLength(3)),
        maxLength: helpers.withMessage("First Name must contain atmost 20 characters !", maxLength(20)),
        containsOnlyCharacters: helpers.withMessage('Only Characters are allowed!', (val) => /^[A-Za-z]+$/.test(val))
    },
    LastName: {
        required: helpers.withMessage("Last Name Can't be Blank *", required),
        minLength: helpers.withMessage("Last Name must contain atleast 3 characters !", minLength(3)),
        maxLength: helpers.withMessage("Last Name must contain atmost 20 characters !", maxLength(20)),
        containsOnlyCharacters: helpers.withMessage('Only Characters are allowed!', (val) => /^[A-Za-z]+$/.test(val))
    },
    DateOfBirth: {
        required: helpers.withMessage("Please Select Date of Birth*", required)
    },
    Gender: {
        required: helpers.withMessage("Please select Gender*", required)
    },
    Age: {
        required: helpers.withMessage("Age Required *", required),
        minValue: helpers.withMessage("Not Eligible", minValue(18)),
        maxValue: helpers.withMessage("Not Eligible", maxValue(120)),
    },
    Hobbies: {
        required: helpers.withMessage("Please select hobby*", required)
    },
    State: {
        required: helpers.withMessage("Please Select a State*", required),
    },
    City: {
        required: helpers.withMessage("Please Select a City*", required),
    }
}))

const v$ = useVuelidate(rules, formData.value)
const errors = ref({
    FirstNameError: '', LastNameError: '', DOBError: '', GenderError: '', AgeError: '', HobbiesError: '', StateError: '', CityError: '', sameDataError: ''
})
const allUsers = ref([])
const allStates = ref([])
const allCities = ref([])
const edit = ref({ isEdit: false, editIndex: -1 })

// Get Current date
let cur_date = new Date().toISOString().split('T')[0]

// Get Age based on DOB
watch(()=> formData.value.DateOfBirth, () => {
    let age = new Date().getFullYear() - new Date(formData.value.DateOfBirth).getFullYear()
    formData.value.Age = Math.floor(age)
}, {deep:true})

onMounted(() => {
    allStates.value = Object.keys(stateCity).sort()
    allUsers.value = JSON.parse(localStorage.getItem('userData1'))
    if (route.params.id) {
        let editItem = allUsers.value.find(user => user.Id === parseInt(route.params.id))
        handleStateChange(editItem.State)
        formData.value.FirstName = editItem.FirstName
        formData.value.LastName = editItem.LastName
        formData.value.DateOfBirth = editItem.DateOfBirth
        formData.value.Age = editItem.Age
        formData.value.Hobbies = editItem.Hobbies
        formData.value.Gender = editItem.Gender
        formData.value.State = editItem.State
        formData.value.City = editItem.City
    }
})

const handleStateChange = (e) => {
    formData.value.City = ''
    allCities.value = stateCity[e].sort()
}

const resetForm = () => {
    formData.value = {
        FirstName: '', LastName: '', DateOfBirth: '', Gender: '', Age: "", Hobbies: [], State: '', City: ''
    }
}

async function handleSubmit() {
    let res = await v$.value.$validate()
    if (res) {
        errors.value.sameDataError = ''
        if (route.params.id) {
            let user = allUsers.value.find((user) => user.Id === parseInt(route.params.id))
            let restUsers = allUsers.value.filter((user) => user.Id !== parseInt(route.params.id))
            let index = allUsers.value.indexOf(user)
            if (restUsers.some((user) => user.FirstName.trim() === formData.value.FirstName.trim() && user.LastName.trim() === formData.value.LastName.trim() && user.Age === formData.value.Age && user.Gender === formData.value.Gender && JSON.stringify(formData.value.Hobbies.sort()) === JSON.stringify(user.Hobbies.sort()) && user.DateOfBirth === formData.value.DateOfBirth && user.State === formData.value.State && user.City === formData.value.City)) {
                errors.value.sameDataError = "Record already exist!"
            }
            else {
                allUsers.value[index] = formData.value
                setLocalStorageData(allUsers.value)
                edit.value.editIndex = -1
                edit.value.isEdit = false
                resetForm()
                v$.value.$reset()
                router.push('/userData')
            }
        }
        else {
            if (allUsers.value?.some((user) => user.FirstName.trim() === formData.value.FirstName.trim() && user.LastName.trim() === formData.value.LastName.trim() && user.Age === formData.value.Age && user.Gender === formData.value.Gender && JSON.stringify(formData.value.Hobbies.sort()) === JSON.stringify(user.Hobbies.sort()) && user.DateOfBirth === formData.value.DateOfBirth && user.State === formData.value.State && user.City === formData.value.City)) {
                errors.value.sameDataError = "Record already exist!"
            }
            else {
                if (localStorage.getItem('userData1')) {
                    setLocalStorageData([formData.value, ...JSON.parse(localStorage.getItem('userData1'))])
                }
                else {
                    setLocalStorageData([formData.value])
                }
                resetForm()
                router.push('/userData')
            }
        }
        allUsers.value = JSON.parse(localStorage.getItem('userData1'))
    }
}
</script>
<template>
    <div class="container my-2 m-auto">
        <div class="row py-3">
            <h2 class="mx-2">Voting Registration Form</h2>
            <div class="col-12">
                <form @submit.prevent="handleSubmit" class="p-3 rounded border">
                    <span class="formError text-danger" id="SameDataError">{{ errors.sameDataError }}</span>
                    <div class="form-group mb-3">
                        <label for="firstName">First Name</label>
                        <input class="form-control" type="text" name="FirstName" id="firstName"
                            v-model="formData.FirstName" />
                        <span class="formError text-danger" id="FirstNameError">{{ v$.FirstName.$errors[0]?.$message
                        }}</span>
                    </div>
                    <div class="form-group mb-3">
                        <label for="lastName">Last Name</label>
                        <input id="lastName" class="form-control" type="text" name="LastName" v-model="formData.LastName" />
                        <span class="formError text-danger" id="LastNameError">{{ v$.LastName.$errors[0]?.$message }}</span>
                    </div>
                    <div class="row justify-content-between">
                        <div class="form-group mb-2 col-6">
                            <label for="dateOfBirth">Date Of Birth</label>
                            <input id="dateOfBirth" :max="cur_date" name="DOB" class="form-control" type="date"
                                v-model="formData.DateOfBirth" />
                            <span class="formError text-danger" id="DOBError">{{ v$.DateOfBirth.$errors[0]?.$message
                            }}</span>
                        </div>
                        <div class="form-group mb-2 col-6">
                            <label for="age">Age</label>
                            <input id="age" class="form-control" type="number" disabled="true" v-model="formData.Age" />
                            <span class="formError text-danger" id="AgeError">{{ v$.Age.$errors[0]?.$message }}</span>
                        </div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="form-group mb-3 col-6">
                            <label for="hobbies">Hobbies</label>
                            <div class="form-check">
                                <input class="form-check-input" name="Hobbies" type="checkbox" v-model="formData.Hobbies"
                                    value="Chess" id="Chess">
                                <label class="form-check-label" for="Chess">
                                    Chess
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" name="Hobbies" type="checkbox" v-model="formData.Hobbies"
                                    value="Badminton" id="Badminton">
                                <label class="form-check-label" for="Badminton">
                                    Badminton
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" name="Hobbies" type="checkbox" v-model="formData.Hobbies"
                                    value="Hockey" id="Hockey">
                                <label class="form-check-label" for="Hockey">
                                    Hockey
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" name="Hobbies" type="checkbox" v-model="formData.Hobbies"
                                    value="Reading" id="Reading">
                                <label class="form-check-label" for="Reading">
                                    Reading
                                </label>
                            </div>
                            <span class="formError text-danger" id="HobbiesError">{{ v$.Hobbies.$errors[0]?.$message
                            }}</span>
                        </div>
                        <div class="form-group mb-2 col-6">
                            <label for="Gender">Gender</label>
                            <div class="form-check">
                                <input class="form-check-input" id="male" name="Gender" value="Male" type="radio"
                                    v-model="formData.Gender" /><label class="form-check-label" for="male">Male</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" id="female" name="Gender" value="Female" type="radio"
                                    v-model="formData.Gender" /><label class="form-check-label" for="female">Female</label>
                            </div>
                            <span class="formError text-danger" id="GenderError">{{ v$.Gender.$errors[0]?.$message }}</span>
                        </div>
                    </div>

                    <div class="form-group mb-3">
                        <label for="stateDropdown">Select a State</label>
                        <select class="form-select" id="stateDropdown" v-model="formData.State"
                            @change="handleStateChange($event.target.value)">
                            <option value="" disabled selected>Select a State</option>
                            <option :value="state" v-for="state in allStates">{{ state }}</option>
                        </select>
                        <span class="formError text-danger" id="StateError">{{ v$.State.$errors[0]?.$message }}</span>
                    </div>
                    <div class="form-group mb-3">
                        <label for="cityDropdown">Select a City</label>
                        <select class="form-select" id="cityDropdown" v-model="formData.City">
                            <option value="" selected disabled>Select a City</option>
                            <option :value="city" v-for="city in allCities">{{ city }}</option>
                        </select>
                        <span class="formError text-danger" id="CityError">{{ v$.City.$errors[0]?.$message }}</span>
                    </div>

                    <button :id="route.params.id ? 'update' : 'submit'" class="btn btn-success text-light">{{
                        !route.params.id ? 'Add' : 'Update'
                    }}</button>
                </form>
            </div>
        </div>
    </div>
</template>