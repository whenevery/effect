function canvas3d (options){
    this.angleY = options.angleY || Math.PI / 4;//观看角度 弧度
    this.angleZ = options.angleZ || Math.PI / 4;//观看角度 弧度
    this.distance = options.distance || 1000;//观看距离
    this.scaleDistance = options.scaleDistance || 10;//产生缩放距离
    this.scaleStep = options.scaleStep || 0.01;//产生缩放的大小
    this.canvas = options.canvas;
    this.canvasWidth = options.canvasWidth || window.innerWidth;
    this.canvasHeight = options.canvasHeight || window.innerHeight;
    this.colorStart = options.colorStart;//圆球中间色
    this.colorEnd = options.colorEnd;//圆球边缘色
    this.radius = options.radius || 10;//球半径
    this.centerX = options.centerX;//绘制中心
    this.centerY = options.centerY;
    //阴影部分
    this.shadow = options.shadow === undefined?true:options.shadow;
    this.shadowColor = options.shadowColor;
    this.shadowBlur = options.shadowBlur || 20;
    this.shadowOffsetX = options.shadowOffsetX || 0;
    this.shadowOffsetY = options.shadowOffsetY || 0;

    this.items = [];//粒子集合
    this.ctx = this.canvas.getContext('2d');
    //this.ctx.rotate(Math.PI / 4);
    this.ctx.translate(this.centerX , this.centerY);
    //this.ctx.transform(1,0.5,0.5,1,this.centerX , this.centerY);


}
canvas3d.prototype = {
    init:function(){

    },
    //现在只支持圆球、
    add:function(data){
        data.radius = this.radius;
        data.angleY = this.angleY;
        data.angleZ = this.angleZ;
        data.distance = this.distance;
        data.scaleDistance = this.scaleDistance;
        data.scaleStep = this.scaleStep;
        data.colorStart = this.colorStart;
        data.colorEnd = this.colorEnd;
        data.ctx = this.ctx;
        var item = new canvas3d.item(data);
        this.items.push(item);
        return item;
    },
    remove:function(item){
        var index = this.items.indexOf(item);
        if(index > -1)this.items.splice(index,1);
    },
    restart:function(call){
        this.ctx.clearRect(-this.canvasWidth,-this.canvasHeight,this.canvasWidth*2,this.canvasHeight*2);
        this.items.forEach(function(a){
            a.draw();
        });
        if(call)call();
    }
};
canvas3d.item = function(options){
    this.distance = options.distance;
    this.angleY = options.angleY;
    this.angleZ = options.angleZ;
    this.radius = options.radius;
    this.scaleDistance = options.scaleDistance;
    this.scaleStep = options.scaleStep;
    this.colorStart = options.colorStart;
    this.colorEnd = options.colorEnd;
    this.ctx = options.ctx;
    this.x = options.x;
    this.y = options.y;
    this.z = options.z;
    this.init();
};
canvas3d.item.prototype = {
    init:function(){
        this.reset();
    },
    reset:function(){
        var offset = this.getOffset();
        var scaleLength = ((this.distance - offset.len)/this.scaleDistance) | 0;
        this.showRadius = this.radius * (1 + scaleLength * this.scaleStep);
        this.showY = offset.height;
    },
    draw:function(){
        this.ctx.beginPath();
        // this.ctx.fillStyle = '#f0f';
        var grd=this.ctx.createRadialGradient(this.x,this.showY,1,this.x,this.showY,this.showRadius);
        // var grd=this.ctx.createRadialGradient(50,50,1,50,50,this.showRadius);
        grd.addColorStop(0,this.colorStart);
        grd.addColorStop(1,this.colorEnd);
        this.ctx.fillStyle = grd;
        this.ctx.arc(this.x,this.showY,this.showRadius,0,Math.PI * 2);
        this.ctx.fill();
        //this.ctx.fillRect(this.x,this.showY,10,10);
        //this.ctx.fillRect(0,0,100,100);
    },
    getOffset:function(){
        var y = this.y,z=this.z;
        var other,otherAngle,height,len;
        other = Math.sqrt(y * y + z * z);
        otherAngle = Math.atan(z / y);
        if(y < 0){
            if(z > 0){
                height = - other * Math.sin(this.angle + Math.PI / 2 - otherAngle);
                len = this.distance - other * Math.cos(this.angle + Math.PI / 2 - otherAngle);
            }else{
                height = - other * Math.sin(this.angle - otherAngle);
                len = this.distance + other * Math.cos(this.angle - otherAngle);
            }
        }else{
            if(z > 0){
                height = other * Math.sin(this.angle - otherAngle);
                len = this.distance - other * Math.cos(this.angle - otherAngle);
            }else{
                height = other * Math.sin(this.angle + Math.PI / 2 - otherAngle);
                len = this.distance + other * Math.cos(this.angle + Math.PI - otherAngle);
            }
        }
        return {
            height:height,
            len:len
        };
    }
};