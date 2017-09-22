
//获取元素内容
$.fn.__getValue = function(options){
    var _this = $(this[0]);
    if(_this.is('input,select,textarea,option')){
        return _this.val();
    }
    return _this.text();
};
//将form内容 转为json
$.fn.__serializeJSON = function(options){
    var o = {};
    options = $.extend({
        name : 'name',
        ignore : ''
    } , options);
    $(this).find('[' + options.name + ']').not(options.ignore).not('[type=file],button,[type=button]').each(function(){
        if((($(this).is('[type=checkbox]') || $(this).is('[type=radio]')) && !this.checked) || !$(this).attr(options.name)){
            return;
        }
        var val = $(this).__getValue();
        //过滤emoji表情  有BUG  弃用
        //val = val.replace(/ud83c[udc00-udfff]|ud83d[udc00-udfff]|[u2000-u2fff]/g,'');
        $.setArrayValue( o ,$(this).attr(options.name) , val);
    });
    return o;
};
$.fn. __formData = function(data , name , ignore){
    name = name || 'name';
    ignore = ignore || [];
    if(data)for(var key in data){
        if(ignore.indexOf(data[key]) != -1)continue;
        this.find('[' + name + '="' + key + '"]').__setValue(data[key]);
    }
    return this;
};
$.setArrayValue = function (obj , key,val) {
    if(obj[key]){
        if(Array.isArray(obj[key]))obj[key].push(val);
        else obj[key] = [obj[key],val];
    }else obj[key] = val;
};
(function(){
    function setRadioValue(ele , val){
        var name = ele.attr('name');
        ele.prop('checked' ,false);
        if(!val)return;
        ele.filter('[value="' + val + '"]').prop('checked' ,true);
    }
    function setCheckboxValue(ele , val , split){
        var name = ele.attr('name');
        ele.prop('checked' ,false);
        if(!val) return;
        if(typeof val == 'string') val = val.split(split || ',');
        $.each(val ,function(i , o){
            ele.filter('[value="' + o + '"]').prop('checked' ,true);
        });
    }
    function setSelectValue(ele , val){
        var __val = [].slice.call(ele.children().map(function(){return $(this).val()}));
        if(__val.indexOf(val) != -1){
            ele.val(val);
        }else{
            ele.get(0).selectedIndex = 0;
        }
        ele.change();
    }
    $.fn.__setValue = function(val , split){
        return this.each(function(){
            if(!this)return;
            if(typeof val == 'number')val += '';
            if(val == null)val = '';
            var _this = $(this);
            if(_this.is('img')) return _this.attr('src',useCommon.concatImgUrl(val==null?'':val));
            if(_this.is('[type=radio]')) return setRadioValue(_this , val);
            else if(_this.is('[type=checkbox]')) return setCheckboxValue(_this , val , split);
            else if(_this.is('select')) return setSelectValue(_this , val);
            else if(_this.is('input,textarea')){
                return _this.val(val);
            }
            _this.text(val);
        });
    };
})();
$.fn.getSelectedText = function(){
    if(!this.is('select'))return '';
    var val = $(this).val();
    if(!val)return '';
    return this.find(':selected').text();
};
$.fn.dataTablePage = function(options){
    options.page -= 0;
    options.page = options.page || 1;
    options.allPage -= 0;
   return this.each(function(){
       if(!options.allPage){
           return $(this).hide();
       }
       $(this).show();
       var $this = $(this).addClass('clearfix').html('');
       $this.append('<span style="float: left;">共'+options.allNumber+'条数据,第'+options.page+'/'+options.allPage+'页</span>');
       var $fist = $('<span class="btn">').text('first').attr('num',1);
       var $last = $('<span class="btn">').text('last').attr('num',options.allPage);
       var $prev = $('<span class="btn">').text('prev').attr('num',options.page - 1);
       var $next = $('<span class="btn">').text('next').attr('num',options.page + 1);
       $this.append($fist)
           .append($prev);
       var min=1,max=options.allPage;
       if(options.allPage > 5){
           if(options.page > 3){
               $this.append($('<span class="more">...</span>'));
               min = options.page - 2;
               max = Math.min(max , options.page + 2)
           }
           if(options.allPage - 5 < options.page){
               min = options.allPage - 5;
               max = options.allPage;
           }
       }

       for(var i = min ; i <= max ; i ++ ){
           var $number = $('<span class="number"></span>').text(i).attr('num' , i);
           $this.append($number);
           if(i == options.page){
               $number.addClass('active');
           }
           else{
               $number.addClass('able');
           }
       }
       if(max < options.allPage){
           $this.append($('<span class="more">...</span>'));
       }
       $this.append($next)
           .append($last);
       if(options.page > 1){
           $fist.addClass('able');
           $prev.addClass('able');
       }
       if(options.page < options.allPage){
           $next.addClass('able');
           $last.addClass('able');
       }
       $this.find('.able').click(function(){
           console.log('click' , $(this).attr('num') - 0);
           if(options.done)options.done($(this).attr('num') - 0);
           return false;
       });
   });
};

$.fn.wyOn = function(event , selector , func){
    $(this).find(selector).bind(event,function(e){
        func.call(this,e);
        return false;
    });
    $(this).bind(event , function(e){
        var originalEvent = e.originalEvent;
        if(originalEvent){
            var path = originalEvent.path;
            for(var i=0,o;o=path[i++];){
                if($(o).is(selector)){
                    return func.call(o,e);
                }
            }
        }

    });
};