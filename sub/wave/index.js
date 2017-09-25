var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function( callback ){
    window.setTimeout(callback, 1000 / 60);
};
var wWidth = window.innerWidth,wHeight=window.innerHeight;
var canvas = document.getElementById('this-canvas');
canvas.setAttribute('width',wWidth);
canvas.setAttribute('height',wHeight);
var obj = new canvas3d({
    canvas:canvas,
    angle:Math.PI / 4,
    distance:1000,
    radius:10,
    centerX:wWidth/2,
    centerY:wHeight/2,
    colorStart:'rgb(52,133,251)',
    colorEnd:'rgb(120,150,194)'
});
var startX = -300,startY = -300,endX = 300,endY = 300;
var countX=10,countY=10;

var stepX = (endX - startX) / countX;
var stepY = (endY - startY) / countY;
var stepPi = Math.PI / 10,zLength = 100;
for(var x=startX;x<=endY;x+=stepX){
    var showZ = 0;
    for(var y=startY;y<=endY;y+=stepY){
        var z = zLength * Math.sin(showZ);
        var item = obj.add({
            x:x,
            y:y,
            z:z,
        });
        item.showZ = showZ;
        showZ += stepPi;
    }
}
function restart(){

    obj.restart(function(){
        obj.items.forEach(function(a){
            a.showZ += Math.PI / 180;
            a.z = zLength *  Math.sin(a.showZ);
            a.reset();
        });
        requestAnimationFrame(restart);
    });
}
requestAnimationFrame(restart);