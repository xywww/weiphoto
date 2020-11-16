<template>
  <div ref="marker" @click="markerClick" style="height: 1px;width: 1px;background:rgba(0,0,0,0)">
    <div class="markerContainer" :style="xyPosition">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import utils from "../../utils.js";
export default {
  name: "wei-markers",
  props: ["config"],
  data() {
    return {
      viewer: null,
      markersPlugin: null,
      oldConfig: null,
      markerId: null,
      xyPosition: "",
    };
  },
  watch: {
    config: {
      handler(newVal) {
        if (!(newVal.longitude && newVal.longitude)) return;
        //如果没有就添加else修改数据
        this.update(newVal);
      },
      deep: true,
    },
  },
  methods: {
    markerClick() {
      this.$emit("click", true)
    },
    //删除标记
    remove(id) {
      if (!id) return;
      this.$markersPlugin.removeMarker(id);
    },
    //添加
    add(configs) {
      var config = utils.deepCopy(configs);
      let x = config.positionX;
      let y = config.positionY;
      let xy = "";

      if (x) {
        if (x == "start") xy += "0px";
        if (x == "center") xy += "-50%";
        if (x == "end") xy += "-100%";
      }
      if (y) {
        if (y == "start") xy += ",0px";
        if (y == "center") xy += ",-50%";
        if (y == "end") xy += ",-100%";
      }

      if (!x && !y) {
        this.xyPosition = `transform: translate(-50%,-100%);`;
      } else {
        this.xyPosition = `transform: translate(${xy});`;
      }

      let ranDom = String(parseInt(Math.random() * 1000000));
      if (!config.id) {
        config.id = "myId-" + ranDom;
      }

      config.$$el = this.$el;
      if (!config.polylineRad) {
        config.html = '';
      }
      this.$markersPlugin.addMarker(config);

      if (config.polylineRad) {
        //svg 事件
        this.$nextTick(() => {
          let marker = document.getElementById("psv-marker-" + config.id);
          this.$markerEl = marker;
          marker.addEventListener("click", () => {
            this.$emit("click", true)
          });
        });
      }

      this.markerId = config.id;
    },
    //更新标记
    update(config) {
      this.remove(this.markerId);
      this.add(config);
    },
    change(type, data) {
      if (type == "on") {
        this.$emit("over", true);
      } else {
        this.$emit("leave", true);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$markersPlugin = this.$parent.$markersPlugin;

      if (this.$parent.isOneLoad) {
        this.add(this.config);
      } else {
        this.$parent.$viewer.once("ready", () => {
          this.add(this.config);
        });
      }
    });
  },
  destroyed() {
    this.remove(this.markerId);
  },
};
</script>

<style>
.markerContainer {
  display: inline-block;
}
</style>