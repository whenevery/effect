/**
 write by wuyun
 **/
var imgSrc= 'svg.png';
var img = new Image();
img.src = imgSrc;
var imgWidth,imgHeight;
var showDiv = document.getElementById('show-div');
var thisSvg = document.getElementById('this-svg');
var myCanvas = document.getElementById('my-canvas');
var ctx = myCanvas.getContext('2d');
var imgData;
var svgObj = new mySvg(thisSvg);
img.onload = function(){
    imgWidth = img.width;
    imgHeight = img.height;
    showDiv.style.width = thisSvg.style.width = myCanvas.style.width = imgWidth + 'px';
    showDiv.style.height = thisSvg.style.height = myCanvas.style.height = imgHeight + 'px';
    myCanvas.setAttribute('width',imgWidth);
    myCanvas.setAttribute('height',imgHeight);
    showDiv.style.background = 'url('+imgSrc+')';
    ctx.drawImage(img,0,0);
    imgData = ctx.getImageData(0,0,imgWidth,imgHeight).data;
};
thisSvg.onclick = function(e){
    // console.log(getCanvasData(e.offsetX,e.offsetY));
    console.log(findMin(e.offsetX,e.offsetY));
};
function getCanvasData(x,y){
    var index = y * imgWidth + x;
    return imgData.slice(index * 4 , (index+1)*4);
}
var maxColor=210;
function findMin(x,y){
    var color = getCanvasData(x,y);
    if(color[0] < maxColor)return null;
    var baseX=x,baseY=y;
    for(;;){
        color = getCanvasData(x-1,y);
        console.log(color);
        if(color[0]>maxColor){
            x--
        }else{
            break;
        }
    }
    for(;;){
        color = getCanvasData(x,y-1);
        console.log(color);
        if(color[0]>maxColor){
            y--
        }else{
            break;
        }
    }
    var minX = x,minY = y;
    x=baseX,y=baseY;
    for(;;){
        color = getCanvasData(x+1,y);
        console.log(color);
        if(color[0]>maxColor){
            x++
        }else{
            break;
        }
    }

    for(;;){
        color = getCanvasData(x,y+1);
        console.log(color);
        if(color[0]>maxColor){
            y++
        }else{
            break;
        }
    }
    var maxX = x,maxY=y;
    console.log(minX,minY,maxX,maxY);
    svgObj.add('rect',{
        attr:{
            width:maxX-minX,
            height:maxY-minY,
            x:minX,
            y:minY
        },
        style:{
            fill:'rgb(0,0,255)',
        }
    });

}