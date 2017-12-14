function hsbToRgb(h,s,v){
    var hi = Math.floor((h/60)%6);
    var f = h / 60 - hi;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var rgb;
    switch (hi){
        case 0:
            rgb = [v,t,p];
            break;
        case 1:
            rgb = [q,v,p];
            break;
        case 2:
            rgb = [p,v,t];
            break;
        case 3:
            rgb = [p,q,v];
            break;
        case 4:
            rgb = [t,p,v];
            break;
        case 5:
            rgb = [v,p,q];
            break;
    }
    rgb.forEach(function(a , i){
        rgb[i] = Math.floor(a * 255);
    });
    return rgb;
}
function thisload (){
    var maxBigWidth=200,maxBigHeight=200;
    var maxSmallWidth=100,maxSmallHeight=100;
    var bigWidth = 30;
    var bigCanvas = document.getElementById('big-canvas');
    var smallCanvas = document.getElementById('small-canvas');
    var canvasDiv = document.getElementById('canvas-div');
    var bigCircle = document.getElementById('big-circle');
    var smallCircle = document.getElementById('small-circle');
    bigCanvas.style.width = maxBigWidth+'px';
    bigCanvas.style.height = maxBigHeight+'px';
    bigCanvas.width = maxBigWidth;
    bigCanvas.height = maxBigHeight;

    smallCanvas.style.width = maxSmallWidth+'px';
    smallCanvas.style.height = maxSmallHeight+'px';
    smallCanvas.width = maxSmallWidth;
    smallCanvas.height = maxSmallHeight;
    smallCanvas.style.left = (maxBigWidth - maxSmallWidth) / 2 + 'px';
    smallCanvas.style.top = (maxBigHeight - maxSmallHeight) / 2 + 'px';

    canvasDiv.style.width = maxBigWidth - bigWidth * 2 + 'px';
    canvasDiv.style.height = maxBigWidth - bigWidth * 2 + 'px';
    canvasDiv.style.left = bigWidth + 'px';
    canvasDiv.style.top = bigWidth + 'px';

    var bigCtx = bigCanvas.getContext('2d');
    var smallCtx = smallCanvas.getContext('2d');
    var bigData = bigCtx.getImageData(0,0,maxBigWidth,maxBigHeight);
    var smallData = smallCtx.getImageData(0,0,maxSmallWidth,maxSmallHeight);

    function getLength(x,y,type){
        var cx = type==='big'?maxBigWidth/2:maxSmallWidth/2;
        var cy = type==='big'?maxBigHeight/2:maxSmallHeight/2;
        return Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));
    }
    function checkLength(len){
        return len > (maxBigWidth/2 - bigWidth - 1)&& len < maxBigWidth / 2 +1;
    };
    function getRadius(i , j){
        var radius = Math.atan(Math.abs((i- maxBigWidth / 2) / (j-maxBigHeight / 2))) * 180 / Math.PI;
        if(maxBigHeight / 2 === j){
            if(i > maxBigWidth / 2)return 90;
            return 270;
        }
        //右半球
        if(i > maxBigWidth / 2){
            //右下
            if(j > maxBigHeight / 2){
                return 180 - radius;
            }
            return radius;
        }else if(i === maxBigWidth / 2){
            if(j > maxBigHeight / 2){
                return 180;
            }
            return 0;
        }else{
            if(j > maxBigHeight / 2){
                return 180 + radius;
            }
            return 360 - radius;
        }
    }
    var rads = [];
    for(var i = 0;i<=maxBigWidth;i++){
        for(var j=0;j<maxBigHeight;j++){
            var len = getLength(i , j , 'big');
            if(checkLength(len)){
                var rad = Math.ceil(getRadius(i,j));
                if(rad === 360)rad = 0;
                rads.push(rad);
                var rgb = hsbToRgb(rad , 1 , 1);
                var index = (j * maxBigWidth + i) * 4;
                bigData.data[index] = rgb[0];
                bigData.data[index + 1] = rgb[1];
                bigData.data[index + 2] = rgb[2];
                bigData.data[index + 3] = 255;
            }
        }
    }
    bigCtx.putImageData(bigData,0,0);
    bigCanvas.onclick = (function(e){
        doBigClick(e.offsetX || e.layerX , e.offsetY || e.layerY );
    });
    function doBigClick(x , y){
        var rad = getRadius(x,y );
        rad = (rad + 360) % 360;
        rad |= 0;
        drawSmall(rad);
        bigCircle.style.left = x - 1 + 'px';
        bigCircle.style.top = y - 1 + 'px';
        bigCircle.style.backgroundColor = 'rgb('+hsbToRgb(rad , 1 , 1)+')';
    }
    var autoH;
    function drawSmall(h){
        autoH = h;
        for(var i = 0;i<100;i++){
            for(var j=0;j<100;j++){
                var rgb = hsbToRgb(h,1 - i / 100,1 - j / 100);
                var index = (j * maxSmallWidth + i) * 4;
                smallData.data[index] = rgb[0];
                smallData.data[index + 1] = rgb[1];
                smallData.data[index + 2] = rgb[2];
                smallData.data[index + 3] = 255;
            }
        }
        smallCtx.putImageData(smallData , 0 , 0);
        doSmallClick(1,1);
    };
    smallCanvas.onclick = function(e){
        doSmallClick(e.offsetX || e.layerX , e.offsetY || e.layerY);
    };
    function doSmallClick(x , y){
        var index = (y * maxSmallWidth + x) * 4;
        var rgb = smallData.data.slice(index , index + 3);
        smallCircle.style.left = x + (maxBigWidth - maxSmallWidth) / 2 - 1 + 'px';
        smallCircle.style.top = y + (maxBigHeight - maxSmallHeight) / 2 - 1 + 'px';
        smallCircle.style.backgroundColor = 'rgb('+rgb+')';
        document.getElementById('show-rgb').innerHTML = 'rgb('+rgb+')';
        document.getElementById('show-select').style.backgroundColor = 'rgb('+rgb+')';
        document.getElementById('show-hsb').innerHTML = [autoH , 1 - x / 100 , 1 - y / 100].map(function(a){return a.toFixed(2) - 0}).join();
        document.getElementById('show-hex').innerHTML = '#' + [].slice.call(rgb).map(function(a){return a.toString(16).padStart(2,'0')}).join('');
    }
    doBigClick(5 , 100);
}
setTimeout(function(){
    console.log('setTimeout');
    thisload();
},100);