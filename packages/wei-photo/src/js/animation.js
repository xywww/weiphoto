import { Animation } from "wei-photo-js";
export let ani1Config = {
    minFov: 60,
    maxFov: 180,
    fisheye: 1.5,
    defaultLong: 3.2793629693320606,
    defaultLat: -2.8332488105978124,
}
export function ani1(viewer, that) {
    that.noTouch = true;
    //入场动画
    viewer.animate({
        latitude: -0.2252791009931826,
        longitude: 0.03705944131975738,

        maxFov: 90,
        minFov: 30,
        zoom: 70,
        speed: 2700,
    })
        .then(async () => {
            viewer.setOption("minZoom", 40);
            viewer.setOption("maxZoom", 100);
            that.noTouch = false;
        });


    //鱼眼视角的分解帧
    new Animation({
        properties: {
            fisheye: { start: 1.5, end: 0.0 },
            // fov: { start: 180, end: 90 },
        },
        duration: 2000,
        onTick: (properties) => {
            viewer.setOption("fisheye", properties.fisheye);
        },
    });
}