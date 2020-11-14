中文文档地址 <a href="http://39.105.191.92">http://39.105.191.92</a>

## 安装依赖

```bash
npm install wei-photo --save
```

#### main.js
```js
import Vue from 'vue'
import App from './App.vue' 

import weiPhoto from 'wei-photo'
import "wei-photo/style/index.css"
Vue.use(weiPhoto);

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
}).$mount('#app')

```

#### xxx.vue
```html
<template>
  <div>
    <wei-photo 
      class="weiPhoto" 
      v-wei-photo:photo720="options"
      :panorama.sync="panorama"
    ></wei-photo>
  </div>
</template>

<script> 

export default {
  data() {
    return {
      panorama: '图片路径',
      options:{}
    };
  },
  mounted(){
    //this.photo720 为组件自定义指令的变量,针对全景组件的操作通过这个变量进行，可以随意命名，
    //当需要在一个.vue文件里展示两个全景组件的时候，两个组件的变量名称不可以重复
    //它将会将实例化后对象赋值到你当前的组件作用域里
  }
};
</script>

<style>
.weiPhoto {
  width: 80vw;
  height: 80vh;
}
</style>
```
