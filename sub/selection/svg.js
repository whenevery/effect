/**
 write by wuyun
 **/
function mySvg(svg){
    this.ele = svg;
}

;(function(){
    mySvg.create = function(){

    };
    mySvg.prototype = {
        create:function(e , options){
            options = options || {};
            var ele = document.createElementNS("http://www.w3.org/2000/svg",e);
            if(options.attr){
                for(var key in options.attr){
                    ele.setAttribute(key , options.attr[key]);
                }
            }
            var styles = [];
            if(options.style){
                for(var key in options.style){
                    styles.push(key + ':' + options.style[key]);
                }
                ele.style = styles.join(';');
            }
            return ele;
        },
        add:function(e,options){
            var ele = this.create(e,options);
            this.push(ele , options.parent);
            return ele;
        },
        push:function(e , p){
            (p || this.ele).appendChild(e);
        },
        remove:function(e,p){
            (p || this.ele).removeChild(e);
        }
    }
})();