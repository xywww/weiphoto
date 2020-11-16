
<template>
  <div style="text-align: center">
    <div>
      <!-- 720全景 -->
      <wei-photo
        style="width: 90vw; height: 90vh"
        ref="weiPhoto"
        v-wei-photo:photo="options"
        animationType="1"
        @ready="ready"
        :panorama.sync="panorama"
        @viewChange="viewClick"
      >
        <wei-markers
          v-for="(item, index) in markers"
          @over="over"
          @leave="leave"
          :config="item"
          :key="index"
        >
          <div style="height: 60px; width: 60px; background: aliceblue">
            {{ item.title }}
          </div>
        </wei-markers>
      </wei-photo>
      <div style="position">
        <button @click="methodsPanorama">
          方法切换场景，带加载进度{{ loadNum }}
        </button>
        <button @click="panorama = panorama1">
          变量动态切换场景，无法监听加载进度
        </button>
         <button @click="autoRota">
          自动旋转
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      options: {
        //拖动
        mousemove: true,
        //视角跟随
        captureCursor: false,
        //滑动速度
        moveSpeed: 1,
        //缓动
        moveInertia: true,
      },
      panorama: "",
      panorama1: require("../assets/p4.jpeg"),
      panorama2: require("../assets/p3.jpeg"),
      markers: [
        {
          title: "息州大道1",
          // positionX:'center',
          // positionY:'center',
          latitude: -0.6951847265465538,
          longitude: 1.0576435302000715,
          borderColor: "rgba(239, 168, 14, 1)",
        },
        {
          title: "息州大道2",
          latitude: -0.3853725556846837,
          longitude: 0.4663614356302664,
          borderColor: "rgba(239, 168, 14, 1)",
        },
        {
          svgStyle: {
            fill: "rgba(0, 255, 243, 0.52)",
          },
          polylineRad: [
            [5.717759501961227, -0.39914442457653276],
            [0.039110839732687204, -0.48748008799766396],
            [0.17079467717898614, -0.8985200857468225],
            [5.381000189795457, -0.6500682152093917],
          ],
        },
      ],
      loadNum: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.panorama = require("../assets/indexBg.jpg");
    }, 2000);
  },
  methods: {
    viewClick(data) {
      console.log(data);
    },
    over(item) {
      console.log("进入", item.title);
    },
    markerChange(item) {
      console.log(item, "f.c");
    },
    leave(item) {
      console.log("离开", item.title);
    },
    autoRota(){
      this.photo.autoRota()
    },
    methodsPanorama() {
      this.photo
        .setPanorama(this.panorama2, (val) => {
          this.loadNum = val;
        })
        .then((res) => {
          this.loadNum = 100;
        });
    },
    ready(val) {
      console.log("ok");
    },
  },
};
</script>
