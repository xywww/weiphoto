中文文档地址 <a href="http://www.jsdoc.top">http://www.jsdoc.top</a>
qq群 591170943
  ![image](https://camo.githubusercontent.com/f4009c9fd899d5454311ea8e09d899400a4b29fba231945f30a1c3341475ca2a/68747470733a2f2f787579617765693132332e6f73732d636e2d7368656e7a68656e2e616c6979756e63732e636f6d2f6769746875622f323032312d30392d313325323031302e32352e31352e676966) 

<div style="display:flex">
  
<img style="height:200px" src="https://xuyawei123.oss-cn-shenzhen.aliyuncs.com/WX20210913-100613%402x.png" />
<img style="height:200px" src="https://xuyawei123.oss-cn-shenzhen.aliyuncs.com/WX20210913-101429%402x.png" />
</div>

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
