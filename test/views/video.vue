<template>
  <div>
    <wei-video
      style="width: 100vw; height: 100vh"
      ref="weiPhoto"
      :videoUrl.sync="videoUrl"
    >
      <wei-markers
        v-for="(item, index) in markers"
        :config="item"
        :key="index"
      >
        <div style="height: 60px; width: 560px; background: aliceblue">
          {{ item.title }}
        </div>
      </wei-markers>
    </wei-video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: require("../assets/myvideo.mp4"),
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
      ],
    };
  },
};
</script>

<style>
</style>