//格式化数组
function fn_format_arr(items){
	items.forEach(function(el,index){
		for(var k in el){
			if(!el[k])el[k]="--";
		}
	});
	return items;
}

/****/
Date.prototype.format = function (fmt) {
	if(!fmt)fmt="yyyy-MM-dd hh:mm:ss";
	var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/****
	name:date plus minus
	parameter: {
		fmt:"yyyy-MM-dd hh:mm:ss",//format
		dd:false,//string
		days:0,//plus or minus
	}

	example: 
		format_date();//today 00:00:00
		format_date({dd:"now"});//now
		format_date({days:1});//today+1
		format_date({days:-1});//today-1

		format_date({fmt:"yy-mm-dd"});

		format_date({dd:"2018-1-16 00:00:00"});
****/
function format_date(config) {
	var _config = {
		fmt:"yyyy-MM-dd hh:mm:ss",
		dd:false,
		days:0,
	};

	if(typeof config !== "object"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	var dd=config.dd;
	if(dd){
		dd=dd==="now"?new Date():new Date(dd.replace(/-/g,"/"));
	}else{
		dd=new Date();
		dd=dd.format("yyyy/MM/dd")+" 00:00:00";
		dd=new Date(dd);
	}

	var dd_s = dd.getTime();
	var days = config.days;
	if(!days)days=0;
	var plus = 86400000*days;
	dd.setTime(dd_s+plus);

	return dd.format();
}

//数组排序-对象
//		array.sort(compare(''))
function compare(property,type){
	if(!type)type = "low";
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        if(type === "low"){
        	value1 = value1==="--"?99999999:value1;
        	value2 = value2==="--"?99999999:value2;
        	return value1 - value2;
        }else{
        	value1 = value1==="--"?0:value1;
        	value2 = value2==="--"?0:value2;
        	return value2 - value1;
        }
    }
}

//获取浏览器参数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//数组对象深拷贝
var objDeepCopy = function (source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}