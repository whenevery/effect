function clockCanvas(options){
  var canvas = document.createElement('canvas'), colorCanvas, backCanvas;
  var maxWidth = options.width, maxHeight = options.height;
  var ctx = canvas.getContext('2d')
  canvas.width = maxWidth;
  canvas.height = maxHeight;
  var radius = maxWidth / 2;
  var cx = maxWidth / 2, cy = maxHeight / 2
  options.content.appendChild(canvas);
  makeColorCanvas()
  var colorPat = ctx.createPattern(colorCanvas, 'no-repeat');
  makeBackCanvas();
  makeTime()
  function makeTime(){
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.drawImage(backCanvas, 0, 0)
    var date = new Date();
    ['hour', 'minute', 'second'].forEach(function(a, i){
      var all = i ? 60 : 12;
      var time = date['get' + a.replace(/^\w/, function(a){return a.toUpperCase()}) + 's']();
      if (a === 'hour') {
        time += date.getMinutes() / 60
      }
      else if (a === 'minute') {
        time += date.getSeconds() / 60
      }
      else {
        time += date.getMilliseconds() / 1000
      }
      var scale = time / all;
      var scaleRadian = scale * Math.PI * 2
      var radian
      var line = [];
      var after = options[a + 'After'], length = options[a + 'Length'], lineWidth = options[a + 'Width']
      if (scale <= .25 || scale > .75){
        radian = Math.PI * 5 / 2 - scaleRadian
        line[0] = (length - after) * Math.cos(radian) + radius
        line[1] = - (length - after) * Math.sin(radian) + radius
        line[2] = - after * Math.cos(radian) + radius
        line[3] = after * Math.sin(radian) + radius
      }else {
        radian = - (scaleRadian - Math.PI / 2)
        line[0] = (length - after) * Math.cos(radian) + radius
        line[1] = -(length - after) * Math.sin(radian) + radius
        line[2] = - after * Math.cos(radian) + radius
        line[3] =  after * Math.sin(radian) + radius
      }
      makeLine(ctx, line, lineWidth)
    })
    requestAnimationFrame(makeTime)
  }
  window.autoMakeTime = function(scale){
    var scaleRadian = scale * Math.PI * 2
    var radian
    if (scale <= .25){
      radian = Math.PI / 2 - scaleRadian
    }else if(scale <= .5){
      radian = - (scaleRadian - Math.PI / 2)
    }else if(scale <= .75){
      radian = - (scaleRadian - Math.PI / 2)
    }else{
      radian = Math.PI * 5 / 2 - scaleRadian
    }
  }
  // 生成背景的刻度重复利用
  function makeBackCanvas(){
    backCanvas = document.createElement('canvas')
    backCanvas.width = maxWidth;
    backCanvas.height = maxHeight;
    var backCtx =  backCanvas.getContext('2d')
    backCtx.save()
    backCtx.arc(cx, cy, radius, 0, Math.PI * 2)
    backCtx.clip()
    backCtx.drawImage(colorCanvas, 0, 0)
    backCtx.restore()
    backCtx.beginPath();
    backCtx.save()
    backCtx.arc(cx, cy, radius - options.clockWidth, 0, Math.PI * 2)
    backCtx.fillStyle = '#fff'
    backCtx.fill()
    backCtx.restore()
    makeMark(backCtx)
  }
  // 画刻度
  function makeMark(ctx){

    for(var i = 0; i < options.stepClock * 12; i ++){
      var len = (i % options.stepClock) ? options.smallLength : options.bigLength
      var lineWidth = (i % options.stepClock) ? options.smallWidth : options.bigWidth
      var radian = i * Math.PI * 2 / (options.stepClock * 12)
      var line = []
      line[0] = radius * Math.sin(radian) + radius
      line[1] = radius * Math.cos(radian) + radius
      line[2] = (radius - len) * Math.sin(radian) + radius
      line[3] = (radius - len) * Math.cos(radian) + radius
      makeLine(ctx, line, lineWidth)
    }
  }
  function makeLine(ctx, line, lineWidth){
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = colorPat
    ctx.moveTo(line[0], line[1])
    ctx.lineTo(line[2], line[3])
    ctx.stroke()
  }
  // 生成彩色的canvas
  function makeColorCanvas(){
    colorCanvas = document.createElement('canvas')
    var colorCtx = colorCanvas.getContext('2d');
    colorCanvas.width = maxWidth;
    colorCanvas.height = maxHeight;
    var clockData = colorCtx.getImageData(0, 0, maxWidth, maxHeight);
    for(var i = 0; i < maxWidth; i ++){
      for(var j = 0; j < maxHeight; j ++){
        var radian = colorObject.getRadian(i , j , maxWidth , maxHeight);
        var index = (j * maxWidth + i) * 4;
        var rgb = colorObject.hsbToRgb(radian , 1 , 1);
        clockData.data[index] = rgb[0];
        clockData.data[index + 1] = rgb[1];
        clockData.data[index + 2] = rgb[2];
        // 制造色彩的透明度变化
        clockData.data[index + 3] = (55 + 200 * getLen(i, j) / radius).toFixed(2) - 0;
      }
    }
    function getLen(x,y){
      return Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy))
    }
    colorCtx.putImageData(clockData,0,0);
  }
}