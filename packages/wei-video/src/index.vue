<template>
  <div class="photoContainer">
    <video
      ref="myvideo"
      muted
      crossOrigin="anonymous"
      playsinline
      webkit-playsinline
      x5-video-player-type="h5-page"
      style="opacity: 0; height: 1px; width: 1px"
    >
      <source :src="videoUrl" />
    </video>
    <div ref="photo" class="weiPhotosphere"></div>
    <div class="playerTime">
      <div class="currentBar">
        <div class="currentVal" :style="`width:${playerVal}`">
          
        </div>
      </div>
      <div class="videoPauseButton">
        <!-- 暂停按钮 -->
        <svg
          @click="playVideo"
          v-show="!videoPlayStatus"
          t="1605250404806"
          class="svgClass"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2886"
          width="200"
          height="200"
        >
          <path
            d="M512 12C236.31 12 12 236.31 12 512s224.31 500 500 500 500-224.31 500-500S787.69 12 512 12z m0 944.44C266.94 956.44 67.56 757.06 67.56 512S266.94 67.56 512 67.56 956.44 266.94 956.44 512 757.06 956.44 512 956.44z"
            p-id="2887"
            fill="#8a8a8a"
          ></path>
          <path
            d="M749.63 488.89L416.3 266.67a27.78 27.78 0 0 0-43.19 23.11v444.44a27.78 27.78 0 0 0 43.19 23.11l333.33-222.22a27.78 27.78 0 0 0 0-46.22z m-321 193.44V341.67L684.15 512z"
            p-id="2888"
            fill="#8a8a8a"
          ></path>
        </svg>
        <svg
          @click="pauseVideo"
          v-show="videoPlayStatus"
          t="1605250404806"
          class="svgClass"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3128"
          width="200"
          height="200"
        >
          <path
            d="M512 12C236.31 12 12 236.31 12 512s224.31 500 500 500 500-224.31 500-500S787.69 12 512 12z m0 944.44C266.94 956.44 67.56 757.06 67.56 512S266.94 67.56 512 67.56 956.44 266.94 956.44 512 757.06 956.44 512 956.44z"
            p-id="3129"
            fill="#bfbfbf"
          ></path>
          <path
            d="M373.11 289.78a27.76 27.76 0 0 0-27.78 27.78v388.88a27.78 27.78 0 1 0 55.56 0V317.56a27.76 27.76 0 0 0-27.78-27.78zM650.89 289.78a27.76 27.76 0 0 0-27.78 27.78v388.88a27.78 27.78 0 0 0 55.56 0V317.56a27.76 27.76 0 0 0-27.78-27.78z"
            p-id="3130"
            fill="#bfbfbf"
          ></path>
        </svg>
      </div>
    </div>

    <!-- marker插槽 -->
    <div class="maker" v-if="markersViews">
      <slot></slot>
    </div>
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
    </div>
    <!-- <div
      class="playerVideo weiLoadingBox"
      @click="playVideo"
      v-show="!videoPlayStatus"
      ref="cont"
    >
      <button>播放</button>
    </div> -->
  </div>
</template>
<script>
import { Viewer, Animation } from "wei-photo-js";
import MarkersPlugin from "wei-photo-js/dist/plugins/markers";
import gyroPlugin from "wei-photo-js/dist/plugins/gyroscope.js";
import "wei-photo-js/dist/wei-photo-js.css";
import "wei-photo-js/dist/plugins/markers.css";
import { ani1, ani1Config } from "./js/animation";
export default {
  name: "wei-video",
  props: ["options", "videoUrl", "markers", "videoEl"],
  data() {
    return {
      markersPlugin: null,
      markersViews: false,
      loadingStatus: true,
      //方法加载中
      methodsLoad: false,
      //首次加载图片
      isOneLoad: false,
      //加载数值
      loadNum: 0,
      //加载失败页面
      loadingStatusErr: false,
      //禁止拖动
      noTouch: false,
      isDirective: false,
      isSlotLoading: false,

      //video
      videoPlayStatus: false,
      currentTime: "",
      totalTime: "",
      playerVal: 0,
      videoIsReady: false,
    };
  },
  watch: {
    panorama: {
      handler(newVal) {
        if (!this.$viewer || newVal == "$$methordUrl##") return;
        this.setP(newVal);
      },
    },
  },
  methods: {
    playVideo() {
      this.$video.play();
      this.videoPlayStatus = true;
    },
    pauseVideo() {
      this.$video.pause();
      this.videoPlayStatus = false;
    },
    //方法切换场景
    setPanoramaUrl(val, fun) {
      this.$emit("update:panorama", "$$methordUrl##");
      return this.setP(val, fun);
    },

    setP(val) {
      this.loadingStatus = true;
      this.loadNum = 0;
      return this.$viewer
        .setVideoPanorama(this.$refs.myvideo)
        .then((res) => {});
    },
    //开启陀螺仪
    startGyro() {
      return this.$gyroPlugin.start;
    },
    //关闭陀螺仪
    stopGyro() {
      return this.$gyroPlugin.stop;
    },
    isGyro() {
      //陀螺仪是否启用
      return this.$gyroPlugin.isEnabled();
    },

    //初始化
    inits(argoptions) {
      let animationConfig = {};

      let defaultOptions = {
        container: this.$refs.photo,
        panorama:
          "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC",
        autorotateSpeed: "3rpm",
        moveSpeed: 2,
        //初始缩放级别
        defaultZoomLvl: 30,
        //初始角度
        defaultLat: -0.2252791009931826,
        defaultLong: 0.03705944131975738,
        minZoom: 1,
        maxFov: 120,
        minFov: 30,
        lang: {
          gyroscope: "Gyroscope",
        },
        plugins: [
          [gyroPlugin, { absolutePosition: true }],
          [
            MarkersPlugin,
            {
              markers: this.markers,
            },
          ],
        ],
        ...animationConfig,
      };

      let options = argoptions || this.options || [];
      /**
       * 覆盖默认配置
       */
      for (let i in options) {
        defaultOptions[i] = options[i];
      }
      this.$viewer = new Viewer(defaultOptions);

      // setInterval(()=>{
      //   this.$viewer.renderer.render(true)
      // },20)
      // this.$viewer.startAutorotate();

      // this.$viewer.loop();
      let requestFun = () => {
        this.$viewer.needsUpdate(true);
        requestAnimationFrame(requestFun);
      };
      requestFun();

      this.$viewer.setPanoramaUrl = this.setPanoramaUrl;
      const markersPlugins = this.$viewer.getPlugin(MarkersPlugin);
      const gyro = this.$viewer.getPlugin(gyroPlugin);
      this.$gyroPlugin = gyro;
      this.$markersPlugin = markersPlugins;
      /**
       * 遍历组件实例如果有没有销毁的实例那么就change
       */
      //进入
      // this.$markersPlugin.on("over-marker", (e, marker) => {
      //   try {
      //     let $slots = this.$slots.default;
      //     for (let i in $slots) {
      //       let slot = $slots[i].componentInstance;
      //       if (slot.markerId && slot.markerId == marker.id) {
      //         slot.change("on");
      //       }
      //     }
      //   } catch (error) {}
      // });
      // //离开
      // this.$markersPlugin.on("leave-marker", (e, marker) => {
      //   try {
      //     let $slots = this.$slots.default;
      //     for (let i in $slots) {
      //       let slot = $slots[i].componentInstance;
      //       if (slot.markerId && slot.markerId == marker.id) {
      //         slot.change("off", marker);
      //       }
      //     }
      //   } catch (error) {}
      // });

      /**
       * options.panorama 优先级最高
       */

      if (this.videoUrl) {
        this.setP(this.videoUrl, (val) => {
          this.$emit("readyNum", val);
        }).then((res) => {
          this.$emit("ready", "1");
        });
      }
      this.$viewer.on("ready", () => {});

      this.$viewer.on("click", (e, data) => {
        this.$emit("viewChange", data);
        if (!this.videoPlayStatus) {
          this.playVideo();
        } else {
          this.pauseVideo();
        }
      });
      return {
        setPanorama: this.setPanoramaUrl,
        startGyro: this.startGyro,
        stopGyro: this.stopGyro,
        isGyro: this.isGyro,
        setOption: this.$viewer.setOption,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.isDirective) {
        this.inits();
      }
    });

    if (this.$scopedSlots.loading && this.$scopedSlots.loading()) {
      this.isSlotLoading = true;
    } else {
      this.isSlotLoading = false;
    }
    let video = this.$refs.myvideo;
    this.$video = this.$refs.myvideo;

    video.oncanplaythrough = () => {
      // this.$viewer.needsUpdate();
      this.loadingStatus = false;
      // video.play();
    };
    // video.loop = true;
    video.ontimeupdate = () => {
      const currentTime = video.currentTime;
      const totalTime = video.duration;
      const value = currentTime / totalTime;
      this.currentTime = currentTime;
      this.totalTime = totalTime;
      this.playerVal = value * 100 + "%";
      // 当播放完毕之后，播放暂停按钮要转换成暂停按钮
      if (currentTime === totalTime) {
        this.videoPlayStatus = false;
      }
    };
  },
  destroyed() {
    //释放内存
    this.$viewer.destroy();
  },
};
</script>
<style lang="less" >
@import "./css/index.less";
.photoContainer {
  position: relative;
  z-index: 0;
  .loadingContainer {
    position: relative;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
    z-index: 100;
  }
  .weiPhotosphere {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  .playerTime {
    position: absolute;
    z-index: 22;
    cursor: pointer;
    bottom: 20px;
    left: 20px;
    width: calc(100% - 20px);
    height: 5px;
    display: flex;
    .currentBar {
      position: relative;
      background: #7d7d7d;  
      flex: 1;
      display: flex;
      justify-content: left;
      .currentVal{
        height:100%;
        background: #ff7700;
      }
    }
    .videoPauseButton {
      width: 80px;
      position: relative;
    }
    .svgClass {
      width: 40px;
      height: 40px;
      position: absolute;
      top: -20px;
      left: 20px;
    }
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
    }
  }
  .playerVideo {
    color: #7a7a7a;
    font-size: 14px;
    opacity: 0.4;
    font-weight: 500;
  }
}
</style>