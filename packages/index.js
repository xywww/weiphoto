import weiphoto from './wei-photo';
import weimarkers from './wei-markers';
import wei360 from './wei-360';
import event from './event';
import weisvg from './wei-svg-edit'
let newEvent = new event();
let obj = {
    install(Vue) {
        Vue.prototype.$weiEnent = newEvent;
        Vue.use(weimarkers);
        Vue.use(weiphoto);
        Vue.use(wei360);
        Vue.use(weisvg);
    }
}

export default obj;