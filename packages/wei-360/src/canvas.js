export default function (imgArr, that, canvasDom, fun) {
    //初始化参数
    var canvas = null;
    var ctx = null;
    var loadNum = 0;
    //初始化
    var sources = imgArr;

    function loadImages(sources, callback) {
      return new Promise((resolve, reject) => {
        var loadedImages = 0;
        var numImages = 0;
        var images = [];
        numImages = sources.length;
        for (var i = 0, len = sources.length; i < len; i++) {
          images[i] = new Image();
          //当一张图片加载完成时执行
          images[i].onload = function () {
            loadNum += (100 / imgArr.length);
            //当所有图片加载完成时，执行回调函数callback
            if (++loadedImages >= numImages) {
              callback ? callback(images) : "";
              resolve(images);
              if (fun) fun(100);
            } else {
              if (fun) fun(loadNum);
            }
          };

          images[i].onerror = function(){
            console.error(images[i].src+'图片加载失败')
          }
          //把sources中的图片信息导入images数组
          images[i].src = sources[i];
        }
      });
    }
    //播放图片动画
    function playImages(images) {
      var fps = 60;
      var now;
      var then = Date.now();
      var interval = 1000 / fps;
      var delta;
      function draw() {
        ctx.clearRect(0, 0, canvas.height, canvas.width);
        // ctx.fillRect(0, 0, canvas.height, canvas.width);

        ctx.drawImage(
          images[that.nowRota],
          0,
          0,
          canvas.height,
          canvas.width
        );
      }
      function tick() {
        requestAnimationFrame(tick);
        now = Date.now();
        delta = now - then;
        if (delta > interval) {
          then = now - (delta % interval);
          draw();
        }
      }
      tick();
    }


    canvas = canvasDom;
    canvas.width = 2000;
    canvas.height = 2000;

    ctx = canvas.getContext("2d");
    //ctx.globalAlpha=0.5
    //执行图片预加
    loadImages(sources, async function (images) {
      //   that.$emit('ready');
      playImages(images);
    });
}
