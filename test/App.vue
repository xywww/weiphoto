<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
*{
  margin: 0%;
  padding: 0%;
}
.flex {
  display: flex;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.flex-around {
  display: flex;
  justify-content: space-around;
}
.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.flex-x-center {
  display: flex;
  justify-content: center;
}
.flex-y-center {
  display: flex;
  align-items: center;
}
.flex-x-y-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-end {
  justify-content: flex-end;
}
.flex-wrap {
  flex-wrap: wrap;
}
.color-black {
  color: black;
}
</style>
