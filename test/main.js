/*
 * @Author: your name
 * @Date: 2020-09-09 12:02:10
 * @LastEditTime: 2020-09-10 11:29:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vue_Cli3_MAPLib-master\examples\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// var test = require('w-photo');
// console.log(test);
import test from "@/index"
import "../lib/style/index.css"
Vue.use(test)
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')