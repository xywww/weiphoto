
<template>
  <div class="wei360">
    <div class="weiPhotosphere" style="opacity: 0;z-index:1" ref="photo"></div>
    <canvas class="weiPhotosphere" style="z-index: 0" ref="canvas"></canvas>

    <div class="userLoadingBox" v-if="loadingStatus && !loadingStatusErr">
      <slot name="loading" :loadNum="loadNum"></slot>
    </div>
    <div
      class="weiLoadingBox"
      v-show="loadingStatus && !loadingStatusErr && !isSlotLoading"
    >
      <div class="weiLoadingBox">
        <svg width="50px" height="50px">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="transparent"
            stroke-width="3"
            stroke-dasharray="31.415 31.415"
            stroke="#02bcfe"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0, 25 25;360, 25 25"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke"
              values="#02bcfe;#3be6cb;#02bcfe"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="25"
            cy="25"
            r="10"
            fill="transparent"
            stroke-width="3"
            stroke-dasharray="15.7 15.7"
            stroke="#3be6cb"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360, 25 25;0, 25 25"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke"
              values="#3be6cb;#02bcfe;#3be6cb"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div class="loadingBar">
          <div class="bar" :style="`width:${loadNum}%`"></div>
        </div>
        <div class="loadingText">正在加载中...</div>
      </div>

      <div v-if="loadingStatusErr" class="loadErr weiLoadingBox">
        <div>加载图片失败,请刷新后重试</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Viewer, Animation } from "wei-photo-js";
import "wei-photo-js/dist/wei-photo-js.css";
import "wei-photo-js/dist/plugins/markers.css";
import canvas from "./canvas";
export default {
  name: "wei-360",
  props: ["imgList", "isAuto", "isDeep", "moveSpeed", "autoSpeed"],
  data() {
    return {
      loadingStatus: true,
      loadingStatusErr: false,
      isSlotLoading: false,
      loadNum: 0,
      defaultlatPer: {
        longitude: 0.01,
      },
      nowRota: null,
    };
  },
  watch: {
    //自动旋转
    isAuto(newVal) {
      if (!this.$viewer) return;
      if (newVal) {
        this.$viewer.startAutorotate();
      } else {
        this.$viewer.stopAutorotate();
      }
    },
    //循环播放
    isDeep(newVal) {
      if (!this.$viewer) return;
      this.$viewer.setOption("is360", newVal);
    },
    //滑动速度
    moveSpeed(newVal) {
      if (!this.$viewer) return;
      this.$viewer.setOption("moveSpeed", newVal);
    },
    //自动旋转速度
    autoSpeed(newVal) {
      if (!this.$viewer || !newVal || newVal == "") return;
      this.$viewer.setOption("autorotateSpeed", newVal + "rpm");
    },
    imgList: {
      handler(newVal) {
        if (newVal && newVal.length !== 0) {
          this.inits();
        }
      },
      immediate: true,
    },
  },
  computed: {},
  methods: {
    //初始化监听数据
    initImgData(fun) {
      this.loadingStatus = true;
      new canvas(this.imgList, this, this.$refs.canvas, (val) => {
        this.$emit("imgLoad", val);
        if (val == 100) {
          this.loadingStatus = false;
        }
        this.loadNum = val;
      });
    },
    //初始化
    inits(argoptions) {
      let defaultOptions = {
        is360: this.isDeep,
        container: this.$refs.photo,
        panorama:
          "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC",
        autorotateSpeed: this.autoSpeed + "rpm",
        autorotateLat: 0,
        moveSpeed: this.moveSpeed,
        defaultZoomLvl: 50,
        maxZoom: 50,
        minZoom: 50,
        moveInertia: false,
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
          let z = parseInt(
            position.longitude / ((Math.PI * 2) / this.imgList.length)
          );

          this.nowRota = z == this.imgList.length ? z - 1 : z;
          this.$emit("change", this.nowRota);
          this.defaultlatPer = position;
        });

        //显示第一帧
        this.$nextTick(() => {
          this.$viewer.rotate({
            latitude: Math.PI,
            longitude: this.defaultlatPer.longitude || Math.PI * 2,
          });
          this.$viewer.startAutorotate();
          setTimeout(() => {
            this.$viewer.stopAutorotate();
          }, 0);
        });

        this.initImgData();
      });
    },
  },
  mounted() {
    if (this.$scopedSlots.loading && this.$scopedSlots.loading()) {
      this.isSlotLoading = true;
    } else {
      this.isSlotLoading = false;
    }
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
  .psv-canvas-container{
    z-index: 2;
  }
  .weiPhotosphere {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
  .userLoadingBox {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 21;
  }
  .weiLoadingBox {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 100%;
    background: #f4f4f4;
    z-index: 21;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .loadingText {
    color: #7a7a7a;
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    bottom: 7%;
  }
  .loadingBar {
    height: 3px;
    width: 70%;
    position: absolute;
    bottom: 17%;
    .bar {
      position: absolute;
      left: 0;
      height: 100%;
      background: #0cd4d4;
    }
  }
  .loadErr {
    color: #7a7a7a;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
