var colorObject = {
    hsbToRgb:function (h,s,v){
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
    },
    getRadian:function(i , j , w , h){
        function a(){
            var radius = Math.atan(Math.abs((i- w / 2) / (j-h / 2))) * 180 / Math.PI;
            if(h / 2 === j){
                if(i > w / 2)return 90;
                return 270;
            }
            //右半球
            if(i > w / 2){
                //右下
                if(j > h / 2){
                    return 180 - radius;
                }
                return radius;
            }else if(i === w / 2){
                if(j > h / 2){
                    return 180;
                }
                return 0;
            }else{
                if(j > h / 2){
                    return 180 + radius;
                }
                return 360 - radius;
            }
        }
        var rad = a();
        rad = (rad + 360) % 360;
        rad |= 0;
        return rad;
    },
};