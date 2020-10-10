import {  Animation } from "wei-photo-js";
export function ani1(viewer) {
    
    // let option = {
    //     minFov: 30,
    //     maxFov: 200,
    //     fisheye: 1,
    //     moveSpeed: 1,
    //     defaultZoomLvl: 5,
    //     defaultLong: 3.5793629693320606,
    //     defaultLat: -1.5332488105978124,
    // }
    //  for(let i in option){
    //     viewer.setOption(i,option[i]);
    //  }
    
    
    //入场动画
    viewer.animate({
            latitude: -0.2252791009931826,
            longitude: 0.03705944131975738,
            maxFov: 90,
            zoom: 60,
            speed: 2700,
        })
        .then(async () => {
            viewer.setOption("minZoom", 10);
            viewer.setOption("maxZoom", 100);
        });
  

    //鱼眼视角的分解帧
    new Animation({
        properties: {
            fisheye: { start: 1.5, end: 0.5 },
            // fov: { start: 180, end: 90 },
        },
        duration: 2000,
        onTick: (properties) => {
            viewer.setOption("fisheye", properties.fisheye);
        },
    });
}