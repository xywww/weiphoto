<template>
  <div class="rotad" ref="rotad" :style="`transform: rotate(${rota}deg);`">
    <div class="divImg" :style="`transform: rotate(${360-rota}deg);`">
        2222
    </div>

     <div class="divImg" :style="`transform: rotate(${360-rota}deg);`">
        2222
    </div>
     <div class="divImg" :style="`transform: rotate(${360-rota}deg);`">
        2222
    </div>
     <div class="divImg" :style="`transform: rotate(${360-rota}deg);`">
        2222
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rota: 0,
    };
  },
  mounted() {
   setInterval(()=>{
       this.rota+=0.1;
       if(this.rota == 360){
           alert(9)
           this.rota = 1;
       }
   },10)
  },
};
</script>

<style scoped>
.divImg{
    position: absolute;
    font-size: 20px;
}
.divImg:nth-child(0) {
    left: 0;
    top: 50%;
}

.divImg:nth-child(1) {
    right: 0;
    top: 0%;
}

.divImg:nth-child(2) {
    bottom: 0;
    left: 0;
}
.divImg:nth-child(3) {
    bottom: 0;
    right: 0%;
}


.rotad {
  position: relative;
  width: 500px;
  height: 500px;
  border: 2px solid red;
  border-radius: 100%;
  font-weight: bold;
}
</style>
