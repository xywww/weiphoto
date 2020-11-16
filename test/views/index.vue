<template>
  <div class="container flex-x-y-center">
    <div class="list-box flex-x-y-center" v-for="item in routerList" :key="item[0]" @click="$router.push(item[1])">
      {{ item[0] }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerList: [
        ["全景图", "/d720"],
        ["序列帧", "/d360"],
        ["全景图标记点", "/d720"],
        ["全景视频", "/video"],
      ],
    };
  },
  mounted() { 
    
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  .list-box {
    width: 300px;
    height: 200px;
    margin: 0 20px;
    animation: topBottom 1s;
    transition: 1s;
    background: black;
    font-size: 30px;
    color: aliceblue;
    cursor: pointer;
  }
}
@keyframes topBottom {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>