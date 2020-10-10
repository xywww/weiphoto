import Vue from 'vue'
import Router from 'vue-router'
import d720 from './views/d720.vue'
import d360 from './views/d360.vue'
Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'd720',
            component: d720
        },
        {
            path: '/d360',
            name: 'd360',
            component: d360
        },
    ]
})