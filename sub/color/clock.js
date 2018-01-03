var clockCanvas = document.getElementById('clock-canvas');
var clockCtx = clockCanvas.getContext('2d');
var maxWidth = 1000,maxHeight=1000;
var bigWidth = 60;
clockCanvas.width = maxWidth;
clockCanvas.height = maxHeight;
var clockData = clockCtx.getImageData(0,0,maxWidth,maxHeight);
function getLen(x,y){
    var cx = maxWidth / 2;
    var cy = maxHeight / 2;
    return Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));
}
for(var i=0;i<maxWidth;i++){
    for(var j=0;j<maxHeight;j++){
        var len = getLen(i , j);
        if(len <= maxWidth/2+.5 && len > maxWidth/2 - bigWidth -.5){
            var rad = colorObject.getRadius(i , j , maxWidth , maxHeight);
            var index = (j * maxWidth + i) * 4;
            var rgb = colorObject.hsbToRgb(rad , 1 , 1);
            clockData.data[index] = rgb[0];
            clockData.data[index + 1] = rgb[1];
            clockData.data[index + 2] = rgb[2];
            clockData.data[index + 3] = 255;
        }
    }
}
clockCtx.putImageData(clockData,0,0);