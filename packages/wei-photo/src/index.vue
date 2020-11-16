<!--
 * @Author: wei
 * @Date: 2020-09-09 12:02:10
 * @LastEditTime: 2020-09-10 11:45:50
 * @Description: In User Settings Edit
 * @FilePath: \packages\wei-photo\src\index.vue
-->
<template>
  <div class="photoContainer">
    <div ref="photo" class="weiPhotosphere"></div>
    <!-- 禁止拖动覆盖层 -->
    <div class="noTouch" v-if="noTouch"></div>

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
    <div v-if="loadingStatusErr" class="loadErr weiLoadingBox">
      <div>加载图片失败,请刷新后重试</div>
    </div>
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
  name: "wei-photo",
  props: ["options", "panorama", "markers", "animationType"],
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
    //方法切换场景
    setPanoramaUrl(val, fun) {
      this.$emit("update:panorama", "$$methordUrl##");
      return this.setP(val, fun);
    },
    //
    setP(val, fun, animation) {
      this.loadingStatus = true;
      this.loadNum = 0;

      return this.$viewer
        .setPanorama(val, (val) => {
          this.loadNum = val;
          if (fun) fun(val);
          //初次开场动画效果
          if (this.loadNum == 100 && !this.isOneLoad) {
            setTimeout(() => {
              //小行星
              if (this.animationType == 1 && this.animationType != "none") {
                ani1(this.$viewer, this);
                //默认值
              } else if (this.animationType != "none") {
                ani1(this.$viewer, this);
              }
              this.markersViews = true;
              this.isOneLoad = true;
              this.loadingStatus = false;
            }, 200);
          }
        })
        .then((res) => {
          this.loadingStatus = false;
        })
        .catch((e) => {
          console.error(
            "图片加载失败请检查图片路径是否正确,注意：图片不支持跨域加载",
            e
          );
          this.loadingStatusErr = true;
          this.loadingStatus = false;
        });
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
      let animationConfig;
      if (this.animationType == "none") {
        animationConfig = {};
      } else if (this.animationType == 1) {
        animationConfig = ani1Config;
      } else {
        animationConfig = ani1Config;
      }

      let defaultOptions = {
        container: this.$refs.photo,
        panorama: "",
        autorotateSpeed: "1rpm",
        autorotateLat: 0,
        moveSpeed: 2,
        //初始缩放级别
        defaultZoomLvl: 10,
        //初始角度
        defaultLat: -0.2252791009931826,
        defaultLong: 0.03705944131975738,
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

      this.$viewer.setPanoramaUrl = this.setPanoramaUrl;
      const markersPlugins = this.$viewer.getPlugin(MarkersPlugin);
      const gyro = this.$viewer.getPlugin(gyroPlugin);
      this.$gyroPlugin = gyro;
      this.$markersPlugin = markersPlugins;
      /**
       * 遍历组件实例如果有没有销毁的实例那么就change
       */
      //进入
      this.$markersPlugin.on("over-marker", (e, marker) => {
        try {
          let $slots = this.$slots.default;
          for (let i in $slots) {
            let slot = $slots[i].componentInstance;
            if (slot.markerId && slot.markerId == marker.id) {
              slot.change("on");
            }
          }
        } catch (error) {}
      });
      //离开
      this.$markersPlugin.on("leave-marker", (e, marker) => {
        try {
          let $slots = this.$slots.default;
          for (let i in $slots) {
            let slot = $slots[i].componentInstance;
            if (slot.markerId && slot.markerId == marker.id) {
              slot.change("off", marker);
            }
          }
        } catch (error) {}
      });

      /**
       * options.panorama 优先级最高
       */

      if (this.panorama) {
        this.setP(this.panorama, (val) => {
          this.$emit("readyNum", val);
        }).then((res) => {
          this.$emit("ready", "1");
        });
      } else {
        console.warn("panorama:初次加载全景图为空");
      }
      this.$viewer.on("click", (e, data) => {
        this.$emit("viewChange", data);
      });

      // this.$viewer.on("select-marker", (e, data) => {
      //   console.log(data.id);
      // });

      // this.$viewer.on("img-loader", (e, v) => {
      //   // console.log(v);
      // });

      // this.$viewer.stopAutorotate();
      // this.$viewer.startAutorotate();
      return {
        setPanorama: this.setPanoramaUrl,
        startGyro: this.startGyro,
        stopGyro: this.stopGyro,
        isGyro: this.isGyro,
        viewer:this.$viewer,
        setOption: (o,val) => {
          this.$viewer.setOption(o,val);
        },
        autoRota: () => {
          this.$viewer.startAutorotate();
        },
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
  .noTouch {
    z-index: 99;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .weiPhotosphere {
    position: absolute;
    height: 100%;
    width: 100%;
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