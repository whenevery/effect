/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
useCommon.convertBase64UrlToBlob = function (urlData , type){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : type});
};

useCommon.uuid = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/**
 * 字符串转JSON
 *
 */
useCommon.parseJSON = function (str){
    try{
        return JSON.parse(str);
    }catch(e){
        return null;
    }
};

/*
 * 日期格式化
 * */
useCommon.parseDate = function(date , format){
    format = format || 'Y-m-d H:i:s';//默认转换格式
    if(!(date instanceof Date)){
        if(date - 0){
            date -= 0;
        }
        date = new Date(date);
    }
    if(date == 'Invalid Date')return '';
    var time = {};
    time.Y = date.getFullYear();
    time.y = (time.Y + '').slice(2);
    time.m = this.stringPadStart(date.getMonth() + 1 , 2 , '0');
    time.d = this.stringPadStart(date.getDate() , 2 , '0');
    time.D = '星期' + '日一二三四五六'[date.getDay()];
    time.H = this.stringPadStart(date.getHours() , 2 ,'0');
    time.h = this.stringPadStart(time.H%12 , 2 , '0');
    time.i = this.stringPadStart(date.getMinutes() , 2 , '0');
    time.s = this.stringPadStart(date.getSeconds(), 2 ,0);
    time.w = this.stringPadStart(date.getMilliseconds(),3 ,0);
    time.a = time.H >= 12 ?'下午':'上午';
    return format.replace(/./g,function(a){
        return time[a] || a;
    });
};
/*
 * 获取对象的值 或者执行方法获取值
 * */
useCommon.getKeyValue = function(obj , key){
    if(typeof obj[key] == 'function'){
        return obj[key].apply(obj , [].slice.call(arguments , 2));
    }else return obj[key];
};
/*
 *在前补全字符串
 * */
useCommon.stringPadStart = function(str , len , split){
    if(str == null)str = '';
    str += '';
    if(str.length > len)return str;
    var _len = len - str.length;
    return Array(_len + 1).join(split).slice(0 , _len) + str;
};
/*
 *在后补全字符串
 * */
useCommon.stringPadEnd = function(str , len , split){
    if(str == null)str = '';
    str += '';
    if(str.length > len)return str;
    var _len = len - str.length;
    return  str + Array(_len + 1).join(split).slice(0 , _len);
};
//sha256加密
useCommon.SHA256 = function(s){
    var chrsz = 8;
    var hexcase = 0;
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
        }
        return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
};
useCommon.parse = function(data){
    if(typeof data !== 'string')return data;
    if(!isNaN(data))return data;
    try{
        return JSON.parse(data);
    }catch (e){
        return data;
    }
};
useCommon.stringify = function(data){
    if(typeof data !=='object')return data;
    try{
        return JSON.stringify(data) + '';
    }catch (e){
        return data + '';
    }
};
useCommon.serialize = function(data){
    var str = '';
    if(data)for(var key in data){
        var o = data[key];
        if(o != null){
            if(str)str+='&';
            str += key + '=' + encodeURIComponent(o);
        }
    }
    return str;
};
useCommon.getHrefData = function(href , notDecode){
    var param = href.split('?');
    param = param[1] || param[0];
    var rt = {};
    param && param.split('&').forEach(function(a){
        var index =  a.indexOf('=');
        var d = a.slice(index + 1);
        if(index > 0)rt[a.slice(0 , index)]  = notDecode?d:decodeURIComponent(d);
    });
    return rt;
};
useCommon.concatImgUrl = function(url){
    if(!url)return url;
    if(/^http/.test(url))return url;
    return resJson.imgUrl + url;
};

useCommon.sumTime = function(time , format){
    var timeData = this.sumDate(time);
    if(timeData.s){
        timeData.s += '秒';
    }
    if(timeData.i){
        timeData.i += '分';
    }
    if(timeData.h){
        timeData.h += '时';
    }
    if(timeData.d){
        timeData.d += '天';
    }
    format = format || 'dhis';
    return format.replace(/./g , function(a){
        return timeData[a];
    });
};
useCommon.sumDate = function(time , format){
    var timeData = {
        d:'',
        s:'',
        h:'',
        i:''
    };
    time = Math.floor(time / 1000);
    var more;
    if(more = time % 60 ){
        timeData.s = more;
        time -= more;
    }
    time /= 60;
    if(more = time % 60 ){
        timeData.i = more;
        time -= more;
    }
    time /= 60;
    if(more = time % 24 ){
        timeData.h = more;
        time -= more;
    }
    time /= 24;
    if(time > 1){
        timeData.d = time;
    }
    return timeData;
};
useCommon.sum = function(arr , func){
    func = func || function(a){return a};
    var sum = 0;
    arr.forEach(function(a , i){
        sum += func(a , i) - 0;
    });
    return sum;
};