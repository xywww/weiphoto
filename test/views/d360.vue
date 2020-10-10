
<template>
  <div style="text-align:center"> 
      <wei-360 :imgList="imgArr" type="video1" ref="wei360">
          
      </wei-360>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      imgArr:[]
    };
  },
  
  methods: {

  },
  mounted() {
    let arr = [];
    for(let i = 1;i<=199;i++){
      arr.push(require(`../assets/fz/fz_${i}.png`))
    }
    this.imgArr = arr;
  },
};
</script>
