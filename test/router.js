import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: '首页',
        component: () => import('./views/index')
    }, {
        path: '/d360',
        name: 'd360',
        component: () => import('./views/d360')
    },
    {
        path: '/d720',
        name: 'd720',
        component: () => import('./views/d720')
    },
    {
        path: '/video',
        name: 'video',
        component: () => import('./views/video')
    },

    ]
})