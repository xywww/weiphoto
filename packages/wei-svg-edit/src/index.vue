<template>
  <div class="photoContainer">
    <div ref="photo" class="weiPhotosphere"></div>
    <div style="position:absolute;z-index:999">
      <button @click="nowEdit = []">清空当前编辑</button>
      <button @click="setArr">插入编辑</button>
    </div>
    <!-- 禁止拖动覆盖层 -->
    <div class></div>

    <!-- marker插槽 -->
    <div class="maker">
      <slot></slot>
    </div>
    <slot name="loading">
      <div class="weiLoadingBox" v-show="loadingStatus&&!loadingStatusErr">
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
    </slot>
  </div>
</template>
<script>
import { Viewer, Animation } from "wei-photo-js";
import MarkersPlugin from "wei-photo-js/dist/plugins/markers";
import gyroPlugin from "wei-photo-js/dist/plugins/gyroscope.js";
import "wei-photo-js/dist/wei-photo-js.css";
import "wei-photo-js/dist/plugins/markers.css";
import { ani1 } from "./js/animation";
export default {
  name: "wei-svg-edit",
  props: ["options", "panorama", "markers", "animation"],
  data() {
    return {
      markersPlugin: null,

      loadingStatus: false,
      //方法加载中
      methodsLoad: false,
      //首次加载图片
      isOneLoad: false,
      //加载数值
      loadNum: 0,
      //加载失败页面
      loadingStatusErr: false,
      nowEditId: null,
      nowEdit: [],
    };
  },
  watch: {
    nowEdit(newVal) {
      if(newVal.length==0)return;
    
      setTimeout(() => {
        this.$markersPlugin.removeMarker("polygon");
        setTimeout(() => {
          this.$markersPlugin.addMarker({
            id: "polygon",
            svgStyle: {
              fill: "rgba(0, 255, 243, 0.52)",
            },
            polylineRad: newVal,
            tooltip: {
              content: "放上去",
              position: "right bottom",
            },
          });
        }, 1000);
      }, 200);

      this.$markersPlugin.addMarker({
        id: "polygon",
        svgStyle: {
          fill: "rgba(0, 255, 243, 0.52)",
        },
        polylineRad: newVal,
        tooltip: {
          content: "放上去",
          position: "right bottom",
        },
      });
    },
    panorama: {
      handler(newVal) {
        if (!this.$viewer || newVal == "$$methordUrl##") return;
        this.setP(newVal);
      },
    },
  },
  methods: {
    setArr() {
      this.$markersPlugin.addMarker({
        id: "polygon" + parseInt(Math.random() * 10000),
        svgStyle: {
          fill: "rgba(0, 255, 243, 0.52)",
        },
        polylineRad: this.nowEdit,
        tooltip: {
          content: "放上去",
          position: "right bottom",
        },
      });
      this.nowEdit = [];
    },

    //方法切换场景
    setPanoramaUrl(val, fun) {
      this.$emit("update:panorama", "$$methordUrl##");
      return this.setP(val, fun);
    },
    //
    setP(val, fun) {
      this.loadingStatus = true;
      this.loadNum = 0;
      return this.$viewer
        .setPanorama(val, (val) => {
          this.loadNum = val;
          if (fun) fun(val);
          if (this.loadNum == 100) {
            setTimeout(() => {
              this.loadingStatus = false;
            }, 800);
          }
        })
        .then((res) => {
          this.loadingStatus = false;
          ani1(this.$viewer);
        })
        .catch((e) => {
          console.error("图片加载失败", e);
          this.loadingStatusErr = true;
          this.loadingStatus = false;
        });
    },
    //开启陀螺仪
    startGyro() {
      gyroPlugin
        .start()
        .then((res) => {})
        .catch((e) => {
          console.log("陀螺仪开启失败");
        });
    },
    gyro() {
      //陀螺仪是否启用
      // gyro.isEnabled()
    },

    //初始化
    inits(argoptions) {
      let defaultOptions = {
        container: this.$refs.photo,
        panorama: "",
        autorotateSpeed: "3rpm",
        loadingTxt: "正在加载中。。",
        minFov: 60,
        maxFov: 180,
        //鱼眼效果
        fisheye: 1,
        moveSpeed: 1,
        //初始缩放级别
        defaultZoomLvl: 10,
        //初始角度
        defaultLong: 3.2793629693320606,
        defaultLat: -2.8332488105978124,
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
        console.error("panorama:全景图为空");
      }

      this.$viewer.on("img-loader", (e, v) => {
        // console.log(v);
      });

      this.$viewer.on("click", (e, data) => {
        console.log(data);
        let position = [data.longitude, data.latitude];
        this.nowEdit.push(position);
      });

      return this.$viewer;
    },
  },
  mounted() {},
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
  .weiPhotosphere {
    position: absolute;
    height: 100%;
    width: 100%;
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