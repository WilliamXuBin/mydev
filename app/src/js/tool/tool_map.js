/**
 * 地图自定义信息弹出框
 * 
 *
 	var obj = {
		title:"标题",
		items:[{title:"123：",content:"222"}],
		btns:["确定",{name:"取消",id:"btn-calcel",type:"cancel",data:""}],
	};
	ret_infoWindow(obj);
 *
 * 
 **/
function ret_infoWindow(config){
	var _this = this;
	var _config = {
		title:"标题",
		type:"default",
		items:[],
		btns:[],
		width:70,
		imgSrc:'',
	};

	if(!config && typeof config !== "object"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	_this.config = config;
	var html_title = re_title(config.title);//return-html-title
	var html_items = "";
	if(config.type === "video"){
		html_items = re_video(config.items);//return-html-video
	}else if(config.type === "img" && config.imgSrc && config.imgSrc !== "--"){
		html_items = re_img(config.items);//return-html-img
	}else{
		html_items = re_default(config.items);//return-html-default
	}
	var html_button = re_btn(config.btns);//return-html-btn

	event_close();//event-close

	var html = '<div class="infoWindowNew">'+html_title+html_items+html_button+'</div>';
	return html;

	//event-close
	function event_close(){
		//点击关闭
		$(document).off("click",".infoWindowNew-title-close").on("click",".infoWindowNew-title-close",function(){
			map.clearInfoWindow();
		});

		//点击取消
		$(document).off("click",".infoWindowNew-btn-cancel").on("click",".infoWindowNew-btn-cancel",function(){
			map.clearInfoWindow();
		});
	}

	//return-html-title
	function re_title(txt){
		return '<div class="infoWindowNew-title zoom"><div class="infoWindowNew-title-txt">'+txt+'</div><div class="infoWindowNew-title-close ibtn-close"></div></div>';
	}

	//return-html-default
	function re_default(items){
		var html = "";
		if(items.length>0){
			items.forEach(function(el,index){
				html += '<div class="infoWindowNew-box zoom"><div class="infoWindowNew-box-title" style="width:'+this.config.width+'px">'+el.title+'</div><div class="infoWindowNew-box-content" style="width:calc(100% - '+this.config.width+'px);">'+el.content+'</div></div>';
			});
		}
		return '<div class="infoWindowNew-content">'+html+'</div>';
	}

	//return-html-video
	function re_video(items){
		var html = "";
		if(items.length>0){
			items.forEach(function(el,index){
				html += '<div class="infoWindow-item zoom"><div class="infoWindow-item-title" style="width:'+this.config.width+'px">'+el.title+'</div><div class="infoWindow-item-content" style="width:calc(100% - '+this.config.width+'px);">'+el.content+'</div></div>';
			});
			html = '<div class="infoWindow-box">'+html+'</div><div class="infoWindow-img"><div class="infoWindow-view"><video id="infoWindow_video" width="107" height="80"><source src="'+this.config.info.video_url_view+'" type="video/mp4"></video></div><div class="infoWindow-img-operation infoWindow-img-play"></div><div class="infoWindow-img-timg"></div><div class="infoWindow-smallView"><video id="infoWindow_video_small" width="40" height="30"><source src="'+this.config.info.video_url_small+'" type="video/mp4"></video></div></div>';
		}
		return '<div class="infoWindowNew-content zoom" style="margin-top:12px;">'+html+'</div>';
	}

	//return-html-img
	function re_img(items){
		var html = "";
		if(items.length>0){
			items.forEach(function(el,index){
				html += '<div class="infoWindow-item zoom"><div class="infoWindow-item-title" style="width:'+this.config.width+'px">'+el.title+'</div><div class="infoWindow-item-content" style="width:calc(100% - '+this.config.width+'px);">'+el.content+'</div></div>';
			});
			html = '<div class="infoWindow-box">'+html+'</div><div class="infoWindow-img"><img src="'+this.config.imgSrc+'"/><div class="infoWindow-img-timg" style="display:block;"></div></div>';
		}
		return '<div class="infoWindowNew-content zoom" style="margin-top:12px;">'+html+'</div>';
	}

	//return-html-btn
	function re_btn(items){
		var html = "";
		if(items.length > 0){
			items.forEach(function(el,index){
				if(typeof el === "object"){
					var cls=el.type==="cancel"?cls="cbtn-cancel infoWindowNew-btn-cancel":cls="cbtn";
					el.id=el.id?el.id:"";
					el.data=el.data?el.data:"";
					html += '<button class="'+cls+'" id="'+el.id+'" d-data=\''+el.data+'\'>'+el.name+'</button>';
				}else{
					html += '<button class="cbtn">'+el+'</button>';
				}
			});
		}
		return '<div class="infoWindowNew-button">'+html+'</div>';
	}
}

//fn-绘制标注
//config:{
//		name:"",//名称+
//		location:[],//经纬度
//		title:"",//地标名
//		bg:"red",
//		offset:object
//}
function map_marker(config){
	if(!config.extData)config.extData={};

	if(!config.title)config.title="";

	if(!config.offset)config.offset=new AMap.Pixel(15, 30);

	if(config.bg == "center"){
		config.offset = new AMap.Pixel(10, 25);
	}else if(!config.bg){
		config.bg="red";
	}
	//配置标注
	var marker = new AMap.Marker({
		extData:config.extData,
		icon:'img/lnglat/'+config.bg+'.png',
		label: {
            content: config.name,
            offset: config.offset
        },
        topWhenClick:true,
		topWhenMouseOver:true,
		position:config.location,
		title: config.title,
		map: map,
	});
	return marker;
}
//数组去重-一般数组
Array.prototype.remove_arr = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};