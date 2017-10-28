/**
 write by wuyun
 **/
var imgSrc= 'svg.jpg';
var img = new Image();
img.src = imgSrc;
var imgWidth,imgHeight;
var showDiv = document.getElementById('show-div');
var baseOffsetLeft = showDiv.offsetLeft;
var baseOffsetTop = showDiv.offsetTop;
var thisSvg = document.getElementById('this-svg');
var myCanvas = document.getElementById('my-canvas');
var ctx = myCanvas.getContext('2d');
var imgData;
var svgObj = new mySvg(thisSvg);
if(typeof $ === 'undefined')$= function(s){
    return document.querySelector(s);
};
var tableG,chairG,roomG;
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
    roomG = svgObj.add('g',{
    });
    tableG = svgObj.add('g',{
    });
    chairG = svgObj.add('g',{
    });
};
var optionsSelect = document.getElementsByClassName('options-select')[0];
optionsSelect.onchange = function(e){
    if(targetEle)targetEle.style.stroke = 'none';
    targetEle = null;
    drawInit();
};
var drawOptions = {};
function drawInit(){
    var drawCategoryEle = optionsSelect.querySelector('[name=drawCategory]:checked');
    drawOptions.drawCategory = drawCategoryEle.value;
    drawOptions.personCount = drawCategoryEle.getAttribute('person-count');
    drawOptions.drawType = optionsSelect.querySelector('[name=drawType]:checked').value;
    drawOptions.shape = optionsSelect.querySelector('[name=shape]:checked').value;
    drawOptions.direction = optionsSelect.querySelector('[name=direction]:checked').value;
    console.log(drawOptions);
}
var targetEle;
function targetActive(){
    targetEle.style.stroke = 'red';
}
var allSvgData = [],thisSvgData;
function removeSvgData(){
    if(thisSvgData){
        var index = allSvgData.indexOf(thisSvgData);
        allSvgData.splice(index,1);
    }
    thisSvg.removeChild(thisSvgData.svg);
    thisSvgData = null;
}
var autoPoint;
$('.end-this-btn').onclick = function(){
    autoPoint = null;
    if(targetEle)targetEle.style.stroke = 'none';
};
thisSvg.onclick = function(e){
    var x = e.pageX - baseOffsetLeft,y = e.pageY - baseOffsetTop;
    if(e.target!==thisSvg){
        if(targetEle)targetEle.style.stroke = 'none';
        thisSvgData = findSvgData(e.target);
        clickTrigger(targetEle = e.target);
        showInfo();
        return false;
    }
    if(drawOptions.drawType === 'draw'){
        if(!autoPoint){
            if(targetEle)targetEle.style.stroke = 'none';
            thisSvgData = {};
            thisSvgData.options = Object.assign({},drawOptions);
            autoPoint = [];
            allSvgData.push(thisSvgData);
        }
        thisSvgData = thisSvgData || {};
        autoPoint.push(x+','+y);
        if(autoPoint.length >= 3){
            var parent = getParent();
            var fillColor = getColor();
            if(thisSvgData.svg){
                svgObj.remove(thisSvgData.svg,parent);
            }
            clickTrigger(thisSvgData.svg = targetEle = svgObj.add('polygon',{
                parent:parent,
                attr:{
                    points:autoPoint.join(' ')
                },
                style:{
                    fill:fillColor,
                }
            }));
            showInfo();
        }
        return false;
    }
    thisSvgData = {};
    thisSvgData.options = Object.assign({},drawOptions);
    allSvgData.push(thisSvgData);
    autoPoint = null;
    if(targetEle)targetEle.style.stroke = 'none';
    showInfo();
    console.log(findMin(x,y));
};
function findSvgData(ele){
    var o;
    allSvgData.every(function(a){
        if(a.svg === ele){
            o = a;
            return false;
        }
        return true;
    });
    return o;
}
$('.close-this-btn').onclick = function(){
    removeSvgData();
    hideInfo();
};
function clickTrigger(ele){
    console.log(ele);
    targetActive();
}
var infoMessage = document.getElementsByClassName('info-message')[0];
infoMessage.querySelector('[name=drawCategory]').onchange = function(){
    thisSvgData.options.drawCategory = this.value;
    thisSvgData.options.personCount = this.selectedOptions[0].getAttribute('person-count');
    showInfo();
};
infoMessage.addEventListener('input' , function(){
    thisSvgData.options.personCount = this.querySelector('[name=personCount]').value;
},false);
function showInfo(){
    infoMessage.style.visibility = 'visible';
    infoMessage.querySelector('[name=drawCategory]').value = thisSvgData.options.drawCategory;
    infoMessage.querySelector('[name=personCount]').value = thisSvgData.options.personCount;
}
function hideInfo(){
    infoMessage.style.visibility = 'hidden';
}
function getCanvasData(x,y){
    var index = y * imgWidth + x;
    return imgData.slice(index * 4 , (index+1)*4);
}
var maxColor=210;
function getParent(){
    return ({
        room:roomG,
        table:tableG,
        chair:chairG
    })[drawOptions.drawCategory];
}
function getColor(){
    return ({
        room:'rgb(0,255,255)',
        table:'rgb(255,255,0)',
        chair:'rgb(255,0,255)'
    })[drawOptions.drawCategory];
}
function getMin(x,y,dir){
    var color;
    if(dir === 'level'){
        for(;;){
            color = getCanvasData(--x,y);
            if(color[0]>maxColor){

            }else{
                break;
            }
        }
        return x;
    }else{
        for(;;){
            color = getCanvasData(x,--y);
            if(color[0]>maxColor){
            }else{
                break;
            }
        }
        return y;
    }

}
function getMax(x,y,dir){
    var color;
    if(dir === 'level'){
        for(;;){
            color = getCanvasData(++x,y);
            if(color[0]>maxColor){
            }else{
                break;
            }
        }
        return x;
    }else{
        for(;;){
            color = getCanvasData(x,++y);
            if(color[0]>maxColor){
            }else{
                break;
            }
        }
        return y;
    }
}
function findAllPointByX(x,y,minX,maxX,data){
    data = data || {};
    for(var i=minX+1;i<maxX;i++){
        if(data[i])continue;
        data[i] = [getMin(i,y,'vertical'),getMax(i,y,'vertical')]
    }
    var minData = data[minX];
    var newMinX = minX;
    if(minData)for(var j = minData[0]+1;j<minData[1];j++){
        var oneMinX = getMin(minX,j,'level');
        if(oneMinX < newMinX){
            newMinX = oneMinX;
            findAllPointByX(x,j,newMinX,minX,data);
        }
    }
    var maxData = data[maxX];
    var newMaxX = maxX;
    if(maxData)for(var j = maxData[0]+1;j<maxData[1];j++){
        var oneMaxX = getMax(maxX,j,'level');
        if(oneMaxX < newMaxX){
            newMaxX = oneMaxX;
            findAllPointByX(x,j,maxX,newMaxX,data);
        }
    }
    data.minX = minX;
    data.maxX = maxX;
    return data;
}
function findMin(x,y){
    var color = getCanvasData(x,y);
    if(color[0] < maxColor)return null;
    var drawOptions = thisSvgData.options;
    var parent = getParent();
    var fillColor = getColor();
    if(drawOptions.shape === 'fill'){
        if(drawOptions.direction === 'vertical'){
            var xData = findAllPointByX(x,y,getMin(x,y,'level'),getMax(x,y,'level'));
            var pointsA = [],pointB=[];
            for(var i=xData.minX;i<=xData.maxX;i++){
                if(xData[i]){
                    pointsA.push(i + ',' + xData[i][0]);
                    pointB.push(i + ',' + xData[i][1]);
                }
            }
            console.log(pointsA.concat(pointB.slice().reverse()).join(' '));
            targetEle = svgObj.add('polygon',{
                parent:parent,
                attr:{
                    points:pointsA.concat(pointB.reverse()).join(' ')
                },
                style:{
                    fill:fillColor,
                }
            });
        }else{

        }
    }else{
        var minX = getMin(x,y,'level');
        var minY = getMin(minX+1,y,'vertical');
        var maxX = getMax(x,y,'level');
        var maxY = getMax(maxX-1,y,'vertical');
        if(drawOptions.shape === 'rect'){
            targetEle = svgObj.add('rect',{
                parent:parent,
                attr:{
                    width:maxX-minX,
                    height:maxY-minY,
                    x:minX,
                    y:minY
                },
                style:{
                    fill:fillColor,
                }
            });
        }else{
            targetEle = svgObj.add('circle',{
                parent:parent,
                attr:{
                    cx:(maxX+minX)/2,
                    cy:(maxY+minY)/2,
                    r:Math.sqrt((maxX-minX)*(maxX-minX)+(maxY-minY)*(maxY-minY))/2,
                },
                style:{
                    fill:fillColor,
                }
            });
        }
        thisSvgData.svg = targetEle;
        targetActive();
    }


}
drawInit();