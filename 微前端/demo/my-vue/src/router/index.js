import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/Home.vue'
import about from '../views/about.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home
    },
    {
        path: '/about',
        name: 'About',
        component: about
    }
]

// const router = createRouter({
//     routes,
//     history: createWebHistory()
// })

export default routes