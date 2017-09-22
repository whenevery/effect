(function(){
    var width=600,height=600;
    var canvas = document.getElementById('this-canvas');
    var ctx = canvas.getContext('2d');
    canvas.setAttribute('width',width);
    canvas.setAttribute('height',height);
    function particle(options){
        this.ctx = options.ctx;
        this.radian = options.index * Math.PI * 2 / count;
        this.opacity = 1;
        this.radius = 0;
        this.index = options.index;
        this.baseX = width / 2;
        this.baseY = height / 2;
    }
    particle.prototype = {
        draw:function(){
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(0,0,0,'+this.opacity+')';
            this.ctx.arc(this.x , this.y,radius,0,Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        },
        run:function(){
            this.radius += speed;
            this.opacity = (this.opacity - 1/count).toFixed(2) - 0;
            this.x = this.baseX + this.radius * Math.cos(this.radian);
            this.y = this.baseY + this.radius * Math.sin(this.radian);
        },
        reset:function(){
            this.opacity = 1;
            this.radius = 0;
        }
    };
    var particleSet = [],count = 100,speed=2,radius=1;
    for(var i=0;i<count;i++){
        particleSet.push(new particle({
            ctx:ctx,
            index:i
        }))
    }

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
    var step=0,resetIndex=0;
    particle.reset = function(){
        particleSet.forEach(function(a){
           a.reset();
        });
    };
    particle.draw = function(){
        ctx.clearRect(0,0,width,height);
        particleSet.forEach(function(a){
            if(a.index < step){
                a.run();
                a.draw();
            }
        });
        if(step >= count){
            if(resetIndex >= count)resetIndex=0;
            particleSet[resetIndex].reset();
            resetIndex ++;
        }
        step++;
        requestAnimationFrame(particle.draw);
    };
    requestAnimationFrame(particle.draw);
})();