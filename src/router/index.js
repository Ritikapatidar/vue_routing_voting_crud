import { createRouter, createWebHistory } from "vue-router";
import Listing from '../components/UserData/Listing.vue'
import Registration from '../components/Registration.vue'
import AllData from '../components/UserData/AllData.vue'
const routes = [
    {
        path: '/',
        name: '',
        component: AllData
    },
    {
        path: '/Home',
        name: 'register',
        component: Registration
    },
    {
        path: '/userData',
        name: 'AllData',
        component: AllData,
        children: [
            {
                path: '/userData',
                name: 'listing',
                component: Listing,
            },
            {
                path: 'edit/:id',
                name: 'edit',
                component: () => import('../components/UserData/EditForm.vue')
            }
        ]
    },
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router