var info_login = '';//登录信息

var timer = [];//定时器
var timer_vehicle;//定时器-获取车辆列表实时信息
var timer_location;//定时器-获取车辆定位信息

var ajax_139 = '';
var ajax_106 = 'https://api0.youbanganda.com';

var arr_sign = 1;//判断轨迹是否需要重新加载

var myVideo = []; 
var myVideo_small = [];
var get_localtion = "";

//全局AJAX
$(document).ajaxSuccess(function(evt, request, settings){
	var _response = request.responseJSON;
	if(_response && _response.hash || _response && _response.token)return;
	if(_response && _response.result == 0)return;
	if(_response && _response.code !== "0000"){
		if(_response.code === "1000")return;
		toastr.success(_response.message);
	}
});

if(window.localStorage.info_login){
	info_login = JSON.parse(window.localStorage.info_login);
	$("#login_name").html(info_login.data.realname);//用户名
	console.log(info_login)
}else{
	window.sessionStorage.sizeHtml = window.location.href;
	window.location.href = 'login.html';
}

// if(Cookies.get("login")){
// 	info_login = JSON.parse(Cookies.get("login"));
// 	$("#login_name").html(info_login.data.realname);//用户名
// 	console.log(info_login)
// }else{
// 	window.location.href = 'login.html';
// }

var map_style = 'amap://styles/0aec002a2cbb52a45552c91ecb520c5f';//地图风格
var width_trajectory = 4;
var colors_trajectory_default = "#b4b1d7";//轨迹默认颜色
var colors_trajectory_checked = ["#9bacc7","#b94b5b","#ee8754"];
if(info_login.data.id == 215){
	map_style = '';//地图风格
	colors_trajectory_default = "#444460";//轨迹默认颜色
	colors_trajectory_checked = ["#444460","#b94b5b","#ee8754"];
}

//清除定时器
function clearTimer(){
	window.clearInterval(timer_location);
	if(timer.length===0)return false;
	for(var k in timer){
	    window.clearInterval(timer[k]);
	}
}

//初始化-导航数据
function fun_nav_begin(){
	var nav_json = JSON.parse(info_login.data.display);//数据包-导航
	
	//过滤导航
	function fn_nav_watch(sign){
		for(var i=0;i<nav_json.length;i++){
			if(sign == nav_json[i].href){
				nav_json.splice(i,1);
				return nav_json;
			}
			if(nav_json[i].items){
				var items = nav_json[i].items;
				for(var j=0;j<items.length;j++){
					if(sign == items[j].href){
						items.splice(j,1);
						return nav_json;
					}
				}
			}
		}
		return nav_json;
	}
	
	//中外运增加一个视频回放
	if(info_login.data.id != "82"){
		nav_json = fn_nav_watch("video-playback");
	}

	var html_nav = '';
	nav_json.forEach(function(el,index){
		var child = "";
		if(el.items && el.items.length>0){
			child = JSON.stringify(el.items);
		}
		var cls = index==0?"active":"default";
		html_nav += '<li><a class='+cls+' d-href='+el.href+' d-child=\''+child+'\'>'+el.name+'</a></li>';		
	});
	$(".navBar-list").html(html_nav);
}
fun_nav_begin();//初始化-导航数据

// 删除本地存储
// 	info_car 车辆定位
// 	infoIndexCity 首页城市信息
function clear_storage(names){
	if(!names || names.length===0){
		names = [
			"info_tab_unsafe",
			"info_dataSingle",
			"info_car"
		];
	}
	names.forEach(function(el,index){
		window.sessionStorage.removeItem(el);
	});
}

//导航路由
function ajax_nav(href,pushState){
	fn_breadcrumbs(null);//fn_breadcrumbs

	window.clearInterval(timer_vehicle);//清除实时监控定时器-获取车辆列表实时信息

	if(href !== "fence")fn_sess_remove('fenceInfo');//删除本地存储

	var replace_href = GetQueryString('sign');

	if(!pushState){//是否需要history
		history.pushState({sign:href}, "页面标题", "index.html?sign="+href);
	}

	//修改页面标题
	var nav_json = JSON.parse(info_login.data.display);//数据包-导航
	nav_json.forEach(function(el,index){
		if(el.href === href){
			$("#w_tle").html("友邦BMS管理系统-"+el.name);
		}
		
		if(!el.items || el.items.length===0)return;

		var nav_json_child = el.items;
		nav_json_child.forEach(function(el_child,index_child){
			if(el_child.href === href){
				$("#w_tle").html("友邦BMS管理系统-"+el_child.name);
				//fn_breadcrumbs
				fn_breadcrumbs([
					{name:el.name},
					{name:el_child.name},
				]);
			}
		});
	});
	
	if(get_localtion == 1){
		get_localtion = "0";
		//location.reload();
	}

	function Ajax_route(){
		$(".navBar-tab").hide();
		var html_loading = '<div class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>';
		show_loading_bar(75);
		$.ajax({
	        url: "html/"+href+".html",
	        dataType: "html",
	        async:true,
	        cache:false,
	        success:function(data){
	        	clearTimer();//清除定时器
	        	$(".mainBlock").html(data);
	        	
	        	if(myVideo.length>0){
					location.reload();
				}
				myVideo = [];
				myVideo_small = [];

		        show_loading_bar({
					pct: 100,
					finish: function(pct){
						hide_loading_bar();
					}
		        });
	        }
	    });
	}
	Ajax_route();
}

//加载中
function loading_main(elem){
	elem.html("加载中……");
}

//ajax-loginOut
function ajax_logout(){
	$.ajax({
		url:ajax_139+'/api/user/logout.json',
		type:'post',
		dataType:'json',
	}).then(function(data){
		if(data.code === "0000"){
			window.location.href="login.html";
		}
	});
}

//右侧菜单管理
//		menu({title:"这是标题",search:{isShow:true},list:{items:arr},date:{isShow:true}});//右侧菜单管理
//		参数：
// 			title:"",//标题
// 			search:{//搜索
// 				display:false,
// 				info:"",
// 			},
// 			list:{//列表
// 				display:false,
// 				items:{
// 					id:"",
// 					name:"",//列表名称
// 				},
// 			},
// 			date:{//日期
// 				display:false,
// 				start:"",
// 				end:"",
// 			},
// 			event:{//事件
// 				display:false,
// 				title:"事件",
// 				options:[],
// 			},
//		使用二：构造函数 var menu = new menu();
//			功能1：已选功能
//				menu.selecteds = [];//已选数组
//				menu.selectedsCode();//
//				menu.selectedsText();//
function menu(config){
	var _this = this;
	var _config = {
		title:"",//标题
		search:{//搜索
			display:false,
			info:"",
		},
		list:{//列表
			display:false,
			items:{
				id:"",
				name:"",//列表名称
			},
		},
		date:{//日期
			display:false,
			start:"",
			end:"",
		},
		event:{//事件
			display:false,
			title:"事件",
			options:[],
		},
	};

	var html_menu = '<div class="menu-title menu-height" id="menu_title">标题</div><div class="menu-content"><div class="menu-select menu-height zoom" id="menu_event"><div class="menu-select-title color999">请选择停车事件</div><select id="menu_event_select"></select></div><div class="menu-input menu-height menu_date"><input type="text" placeholder="请选择开始时间" id="menu_start" onclick=\'laydate.render({elem:this,type:"datetime",position:"fixed",theme:"#44bae0",show:true,trigger:"click",max:1});\' /></div><div class="menu-input menu-height menu_date"><input type="text" placeholder="请选择结束时间" id="menu_end" onclick=\'laydate.render({elem:this,type:"datetime",position:"fixed",theme:"#44bae0",show:true,trigger:"click",max:1});\' /></div><div class="menu-search menu-height zoom" id="menu_search"><input type="text" placeholder="输入关健字" id="menu_search_text" /><button type="button" id="menu_search_btn">搜索</button></div><div class="menu-list" id="menu_list"><ul></ul></div><div class="menu-btn menu-height"><button class="cbtn" id="menu_btn">确定</button></div></div>';

	function init(){
		if(!config || typeof config !== "object"){
			console.log("右侧菜单传入值有误");
			return;
		}

		for(var k in _config){
			if(!config.hasOwnProperty(k)){
				config[k] = _config[k];
			}
		}

		fn_height();//高度

		//标题
		if($.trim(config.title)){
			$("#menu_title").show();
			$("#menu_title").html(config.title);
		}else{
			$("#menu_title").hide();
		}

		//搜索
		if(config.search.display){
			$("#menu_search").show();
			$("#menu_search input").val("");
		}else{
			$("#menu_search").hide();
		}

		//列表
		if(config.list.items.length>0){
			var list = config.list;
			for(var k in _config.list){
				if(!list.hasOwnProperty(k)){
					list[k] = _config.list[k];
				}
			}
			var items = config.list.items;
			m_list(items);//绘制列表结果
		}

		//日历
		if(config.date){
			var date = config.date;
			for(var k in _config.date){
				if(!date.hasOwnProperty(k)){
					date[k]=_config.date[k];
				}
			}

			if(date.display){
				$(".menu_date").show();
			}else{
				$(".menu_date").hide();
			}
		}

		//事件
		if(config.event.display){
			$("#menu_event").show();
			$("#menu_event select").html('<option value="">'+config.event.title+'</option>');
			$(".menu-select-title").html(config.event.title);
			m_event(config.event.options);//绘制事件结果
		}else{
			$("#menu_event").hide();
			$("#menu_event select").html("");
		}
	}

	//高度
	function fn_height(){
		$(".menu").html(html_menu);
		var menuHeight = $(window).height()-170;
		var hei = 146;
		$(".menu-height").each(function(index){
			hei += $(".menu-height").eq(index).height();
		});
		var listHeight = menuHeight - hei;
		$(".menu-list").css("max-height",listHeight);
	}

	//绘制列表结果
	function m_list(items){
		var html = "";
		items.forEach(function(el,index){
			var code = el.code?"d-code="+el.code:"";
			var status = el.status?' ('+el.status+')':"";
			html += '<li><label for="'+el.id+'" class="check"><input type="checkbox" class="menu-check" id="'+el.id+'" value='+el.id+' '+code+' /><span>'+el.name+status+'</span></label></li>';
		});
		$("#menu_list ul").html(html);
	}

	//绘制事件结果
	function m_event(items){
		var html = '<option value="">'+config.event.title+'</option>';
		if(items && items.length){
			items.forEach(function(el,index){
				html += '<option value="'+el.val+'">'+el.text+'</option>';
			});
		}
		$("#menu_event select").html(html);
	}

	init();

	//搜索结果
	$(document).off("click","#menu_search_btn").on("click","#menu_search_btn",function(){
		var str = $("#menu_search_text").val();
		var arr = [];
		var items = config.list.items;
		items.forEach(function(el,index){
			if(el.name.indexOf(str)>-1){
				arr.push(el);
			}
		});

		m_list(arr);//绘制搜索结果
	});

	//点击复选框
	$(document).off("click",".menu-check").on("click",".menu-check",function(){
		if($(this).is(":checked")){
			$(this).parent().attr("class","checked");
		}else{
			$(this).parent().attr("class","check");
		}
	});

	$(document).off("change",".menu-select").on("change",".menu-select",function(){
		var id = $(this).find("select").val();
		var text = $(this).find("select").find("option:selected").text();
		$(this).find(".menu-select-title").attr("d-id",id);
		$(this).find(".menu-select-title").html(text);
		if(id){
			$(this).find(".menu-select-title").removeClass("color999").addClass("color333");
		}else{
			$(this).find(".menu-select-title").removeClass("color999").addClass("color999");
		}
	});

	this.selecteds = function(){
		var arr = [];
		$(".menu-check").each(function(index,el){
			if($(".menu-check").eq(index).is(":checked")){
				var id = $(".menu-check").eq(index).val();
				arr.push("\""+id+"\"");
			}
		});
		return arr;
	}

	this.selectedsCode = function(){
		var arr = [];
		$(".menu-check").each(function(index,el){
			if($(".menu-check").eq(index).is(":checked")){
				var code = $(".menu-check").eq(index).attr("d-code");
				arr.push("\""+code+"\"");
			}
		});
		return arr;
	}

	this.selectedsText = function(){
		var arr = [];
		$(".menu-check").each(function(index,el){
			if($(".menu-check").eq(index).is(":checked")){
				var txt = $(".menu-check").eq(index).next().text();
				arr.push("\""+txt+"\"");
			}
		});
		return arr;
	}
}

//breadcrumbs
//		items:[
//			{href:"index",name:"首页"}
//		]
function fn_breadcrumbs(items){
	if(!items || items.length === 0){
		$(".navBar-breadcrumbs").hide();
		return;
	}

	$(".navBar-breadcrumbs").show();
	var html = "";
	items.forEach(function (el,index){
		el.href = el.href?el.href:"";
		html += '<a class="navBar-breadcrumbs-href" d-href="'+el.href+'">'+el.name+'</a>';
		if(index!=items.length-1)html+='<a>></a>';
	});
	$(".navBar-breadcrumbs-main").html(html);
}

//event-back
window.addEventListener("popstate", function() {
    ajax_nav(GetQueryString("sign")?GetQueryString("sign"):"index",true);									
});


//fn_报警
function fn_warning(){
	function get_vehicles(){
		$.ajax({
			url:ajax_106+'/get_vehicles',
			type:'post',
			dataType:'json',
			data:{
				role_id:info_login.data.roleid,
				extra_id:info_login.data.extraid,
			},
		}).then(function(data){
			if(data.code === "0000"){
				var arr = [];
				data.data.forEach(function(el,index){
					arr.push(el.id);
				});
				
				arr = JSON.stringify(arr);
				var data_alarm = {
					vehicle_ids:arr,
					last_time:window.localStorage.info_warning?window.localStorage.info_warning:"",
				};
				ajax_quest_has_new_alarm(data_alarm);
			}
		});
	}
	get_vehicles();
	setInterval(get_vehicles,5000);

	function ajax_quest_has_new_alarm(set){
		$.ajax({
			url:ajax_106+'/quest_has_new_alarm',
			type:'post',
			dataType:'json',
			async:false,
			data:set,
		}).then(function(data){
			if(data.code === "0000"){
				var count = parseInt(data.data.count);
				var count_old = window.localStorage.info_warning_count?parseInt(window.localStorage.info_warning_count):0;
				window.localStorage.info_warning_count = count;
				if(count>count_old){
					var audio = document.getElementById("bgMusic");
					audio.play();
				}
				count=count<100?count:"...";
				$(".navBar-warning span").html(count);
			}
		});
	}

	$(document).off("click",".navBar-warning").on("click",".navBar-warning",function(){
		$(".navBar-warning span").html("0");
		ajax_nav("system-warning");
	});
}

$(function(){
	ajax_nav(GetQueryString("sign")?GetQueryString("sign"):"index");//导航路由
	fn_warning();

	//当鼠标经过
	$(document).off("mouseover",".navBar-list li a,.navBar-tab").on("mouseover",".navBar-list li a,.navBar-tab",function(){
		var _this = $(this);
		if(_this.attr("d-href")==="index" || _this.attr("d-href")==="intelligent-traffic")return;

		$(".navBar-tab").show();//show second nav
		
		if(!_this.attr("d-child"))return;

		var data_nav = JSON.parse(_this.attr("d-child"));
		var html = "";
		data_nav.forEach(function(el,index){
			html += '<a class="navBar-tab-list" d-href='+el.href+'><span style=\'background-image:url("img/second/'+el.href+'.png");\'>'+el.name+'</span></a>';
		});
		$(".navBar-tab-main").attr("d-nav",_this.attr("d-href"));
		$(".navBar-tab-main").html(html);
	});

	//当鼠标离开-一级导航
	$(document).off("mouseout",".navBar-list li a,.navBar-tab").on("mouseout",".navBar-list li a,.navBar-tab",function(){
		$(".navBar-tab").hide();
	});

	//当鼠标经过-二级导航
	$(document).off("mouseover",".navBar-tab-list").on("mouseover",".navBar-tab-list",function(){
		$(".navBar-tab-list").removeClass("active");
		$(this).addClass("active");
	});

	//一级导航点击
	$(document).off("click",".navBar-list li a").on("click",".navBar-list li a",function(){
		$(".navBar-list li a").attr("class","default");//
		$(this).attr("class","active");

		var child = $(this).attr("d-child");
		if(child)return;
		var href = $(this).attr("d-href");
		clearTimer();
		ajax_nav(href);

		clear_storage();// 删除本地存储
	});

	//二级导航点击
	$(document).off("click",".navBar-tab-list").on("click",".navBar-tab-list",function(){
		var href = $(this).attr("d-href");
		ajax_nav(href);

		var navTxt = $(".navBar-tab-main").attr("d-nav");
		$(".navBar-list li a").attr("class","default");//
		$(".navBar-list li").each(function(index,el){
			var navHref = $(".navBar-list li").eq(index).find("a").attr("d-href");
			if(navHref === navTxt){
				$(".navBar-list li").eq(index).find("a").attr("class","active");
			}
		});

		clear_storage();// 删除本地存储
	});

	//点击
	$(".navBar-outlogin-title").click(function(){
		$(this).siblings("ul").stop(true,true).slideToggle();
	});

	//退出
	$("#outlogin").click(function(){
		ajax_logout();
	});

	//点击breadcrumbs
	$(document).off("click",".navBar-breadcrumbs-href").on("click",".navBar-breadcrumbs-href",function(){
		var href = $(this).attr("d-href");
		if(!href)return;
		ajax_nav(href);
	});
});

//浏览器监听
window.onresize = function(){
	if($(window).width()<950){
		window.sessionStorage.sizeHtml = window.location.href;
		window.location.href = "size.html";
	}
}