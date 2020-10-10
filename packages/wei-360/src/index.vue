
<template>
  <div class="wei360">
    <div class="weiPhotosphere" style="opacity:0" ref="photo"></div>
    <canvas class="weiPhotosphere" style="z-index:-1" ref="canvas"></canvas>
  </div>
</template>

<script>
import { Viewer, Animation } from "wei-photo-js";
import MarkersPlugin from "wei-photo-js/dist/plugins/markers";
import gyroPlugin from "wei-photo-js/dist/plugins/gyroscope.js";
import "wei-photo-js/dist/photo-sphere-viewer.css";
import "wei-photo-js/dist/plugins/markers.css";
import canvas from "./canvas";
export default {
  name: "wei-360",
  props: ["imgList", "type", "speed"],
  data() {
    return {
      defaultlatPer: {
        longitude: 6.26999,
      },
      nowRota: null,
    };
  },
  watch: {
    speed(newVal){
      this.$viewer.setOption("moveSpeed", newVal);
    },
    imgList: {
      handler(newVal) {
        if (newVal && newVal.length !== 0 && this.$viewer) {
          this.initImgData();
        }
      },
      immediate: true,
    },
  },
  computed: {},
  methods: {
    //初始化监听数据
    initImgData(fun) {
      new canvas(this.imgList, this, this.$refs.canvas, fun);
    },
    //初始化
    inits(argoptions) {
      let is360 = true;
      if (this.type == "video") is360 = false;
      let defaultOptions = {
        is360,
        container: this.$refs.photo,
        panorama:
          "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC",
        autorotateSpeed: "3rpm",
        moveSpeed: '10',
        defaultZoomLvl: 50,
        maxZoom: 50,
        minZoom: 50,
        moveInertia:false
      };

      let options = argoptions || this.options || [];
      /**
       * 覆盖默认配置
       */
      for (let i in options) {
        defaultOptions[i] = options[i];
      }

      this.$viewer = new Viewer(defaultOptions);

      this.$viewer.once("ready", () => {
        this.$emit("ready", true);

        //监听事件
        this.$viewer.on("position-updated", (e, position) => {
          let z = parseInt(position.longitude / (6.3 / this.imgList.length));
          this.nowRota = z == this.imgList.length ? z - 1 : z;
          this.defaultlatPer = position;
        });
        //显示第一帧
        this.$nextTick(() => {
          this.$viewer.rotate({
            latitude: -0.27713435769187544,
            longitude: this.defaultlatPer.longitude + 0.00000000001 || 6.26999,
          });
          this.$viewer.startAutorotate();
          setTimeout(() => {
            this.$viewer.stopAutorotate();
          }, 0);
        });
      });
    },
  },
  mounted() {
    this.inits();
  },
  destroyed() {
    //释放内存
    this.$viewer.destroy();
  },
};
</script>

<style lang="less">
.wei360 {
  position: relative;
  height: 400px;
  width: 400px;
  .weiPhotosphere {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
}
</style>
