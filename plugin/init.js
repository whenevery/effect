if(!Object.assign){
    Object.assign = $.extend;
}
//loading
;(function(){
    Object.defineProperties(useCommon , {
        loading:{
            set:function(sts){
                var loadingEle = $('.wy-loading-window');
                if(!loadingEle.showEasyWindow)return false;
                if(sts){
                    loadingEle.showEasyWindow(null , 1);
                }
                else{
                    loadingEle.showEasyWindow('hide');
                }
            }
        }
    });
})();