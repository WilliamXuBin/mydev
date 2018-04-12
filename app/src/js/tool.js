//ajax-get all companys 获取所有公司
function ajax_get_all_companys(){
    $.ajax({
        url:ajax_106+'/get_all_companys',
        type:'post',
        dataType:'json',
    }).then(function(data){
        if(data.code === "0000"){
            var items = data.data;
            if(items && items.length>0){
                var html = '<option value=""><font><font>请选择</font></font></option>';
                items.forEach(function(el,index){
                    html += '<option value="'+el.id+'"><font><font>'+el.name+'</font></font></option>'
                });
                $("#companyName").html(html);
            }
        }
    });
}

//删除本地存储
function fn_sess_remove(info){
	sessionStorage.removeItem(info);
}

//列表加载中
function fn_table_loading(){
	var len_td = $("#example-2 thead tr").eq(0).find("th").length;
	var html_noData = '<tr><td colspan='+len_td+' style="text-align:center">查询中…</td></tr>';
	$("#table").html(html_noData);
}

//加载动画
function fn_loading(){
	var _this = this;
	_this.elem = false,
	_this.show = function(){
		if(!_this.elem)return;
		_this.elem.html('<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>');
	},
	_this.hide = function(){
		$(".spinner").remove();
	}
}
var objLoading = new fn_loading();

//窗体大小
function fn_size_window(elem,num){
	var width_nav = $(".navBar").width();
	$("#container").width(width_nav);
	var _height = $(window).height()-100;
	$("#container").height(_height);

	if(!elem)return;
	if(!num)num=0;
	var rightHeight = elem.height()+num;
	var _height = $(window).height()-100;
	if(rightHeight>_height)_height=rightHeight;
	$("#container").height(_height);
}

//表单必填
function form_table(){
    var sign = true;
    var _this = $(".urequired");
    var len = _this.length;
    for(var i = 0;i<len;i++){
        if(!_this.eq(i).val()){
            toastr.error(_this.eq(i).attr("d-error"));//提示框
            sign = false;
            return;
        }
    }

    var _this_sel = $(".urequired-sel");
    var _this_len = _this_sel.length;
    for(var i = 0;i<_this_len;i++){
        if(!_this_sel.eq(i).find(".tselect-title").attr("d-val")){
            toastr.error(_this_sel.eq(i).attr("d-error"));//提示框
            sign = false;
            return;
        }
    }

    //校验输入是否附和标准
    function isverification(_this,_val){
        var sign = true;
        fn_phone();//手机号码

        //手机号码
        function fn_phone(){
            var _attr = _this.attr("phone");
            if(_attr == ""){
                if(!/^[1]{1}[3,5,7,8]{1}\w{9}$/g.test(_val)){
                    _this.siblings(".form-error").remove();
                    _this.after('<div class="form-error" style="color:red;font-size:12px;height:20px;line-height:20px;">请输入正确的手机号码</div>');
                    sign = false;
                }else{
                    _this.siblings(".form-error").remove();
                    sign = true;
                }
            }
        }
        return sign;
    }
    
    return sign;
}

//时间加减-轨迹管理
function fn_date(dd,plus){
	if(!plus)plus=0;
	var d1 = new Date(dd);
	var d2 = d1.getDate()+plus;
	return d2;
}

//日期限制，有返回值，默认为3天
function daysMath(config){
    if(!config.days)config.days=3;

    var start = format_date({dd:config.start,days:3});
    var end = config.end;
    console.log(start)
    console.log(end)

    if(end>start){
        toastr.info('请选择'+3+'天内的时间段查询')//提示框
        objLoading.hide();
        return false;
    }else{
        return true;
    }

    // var start = fn_date(config.start,config.days);
    // var end = fn_date(config.end);
    // console.log(start+" "+end)
    // var days = config.days;
    // if(end - start > 0){
    //  toastr.info('请选择'+days+'天内的时间段查询')//提示框
    //  objLoading.hide();
    //  return false;
    // }else{
    //  return true;
    // }
}
//提示框
//toastr.info('')//提示框
//toastr.success('','这是一个标题');//提示框
//toastr.error('');//提示框
//toastr.warning('','')//提示框

//弹出框
//    new msgAlert(config);
//    config:{
//    		info:"提示文案",
//    		title:"提示标题",
//    		num:"按钮数量",
//    		txt1:"第一个按钮文案",
//    		txt2:"第二个按钮文案",
//    }
//    
//    //实例化一个模态框
		// var msg = new msgAlert({info:'请输入要显示的内容',title:'这里是标题',num:2,txt1:'取消',txt2:'确定'});

		// //点击事件-确定
		// msg.on("btnOkClick",function(){
		// console.log("ok");
		// });

		// //点击事件-取消
		// msg.on("btnCancelClick",function(){
		// 	console.log("cancel");
		// });
//
function msgAlert(config){
	var _this = this;
	var _config = {
		info:'',
		title:'提示信息',
		num:2,
		txt1:"取消",
		txt2:"确定",
	};

	var info = function(){
		if(!config && typeof config !== "object"){
			config = _config;
		}

		for(var k in _config){
			if(!config.hasOwnProperty(k)){
				config[k] = _config[k];
			}
		}

		// 判断传入的参数
        if(typeof config.info==="undefined"||(typeof config.info==="string"&&config.info.trim().length===0)){
            console.log("传入值为空");
            return;
        }

        var operation = "";//操作按钮
        switch(config.num){
        	case 1:
        		operation = '<div class="msg-footer zoom"><button class="msg-btn msg-btn-ok" id="msg_ok">'+config.txt2+'</button></div>';
        		break;
        	case 2:
        		operation = '<div class="msg-footer zoom"><button class="msg-btn msg-btn-ok" id="msg_ok">'+config.txt2+'</button><button class="msg-btn msg-btn-cancel" id="msg_cancel">'+config.txt1+'</button></div>';
        		break;
        }

        $("body").append('<div id="msg"></div>');

        var html = '<div class="msg"><div class="msg-header zoom"><a class="msg-close" id="msg_close">×</a><div class="msg-title">'+config.title+'</div></div><div class="msg-body" style="color:#000">'+config.info+'</div>'+operation+'</div><div class="msg-bg"></div>';
        $("#msg").html(html);

        _this.on("btnOkClick"); //注册默认的点击事件
        _this.on("btnCancelClick"); //注册默认的点击事件

		$("#msg").off("click",'#msg_ok').on('click', '#msg_ok', function(event) {
		    _this.btnOkClick();
		});

		$("#msg").off("click",'#msg_close').on('click', '#msg_close', function(event) {
		    _this.hide();
		});

		$("#msg").off("click",'#msg_cancel').on('click', '#msg_cancel', function(event) {
		    _this.btnCancelClick();
		});
	}
	info();
}

msgAlert.prototype = {
	on:function(fnName, fn, hide){
		this[fnName] = function() {
	        if (hide != false) {
	            this.hide();
	        }
	        if (typeof fn == "function") {
	            fn.apply(this);
	        }
	    };
	},
	hide:function(){
		$("#msg").remove();
	}
}

//分页组件
function fn_page(config){
	_this = this;
	var _config = {
		elem:"pageDemo",
		pages:10,
		pageNo:1,
		set:{},
		fn:function(){},
	};

	if(!config || typeof config === "undefined"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	layui.use(['laypage'], function(){
		var laypage = layui.laypage;

		//分页
		laypage({
			cont:config.elem, //分页容器的id
			pages:config.pages, //总页数
			curr:config.set.page,//当前页
			skin:'#44bae0', //自定义选中色值
			//,skip: true //开启跳页
			jump: function(obj, first){
				if(!first){
					config.set.page=obj.curr;
					config.fn(config.set);
				}
			}
		});
	});
}

function fn_msg123(){
	layui.use(['layer'], function(){
		var layer = layui.layer
		layer.msg('Hello W12121212orld',{offset:"rt",area:"auto"});
	});
}
//fn_msg123();

//下拉框
function fn_tselect(config){
	if(!config || typeof config !== "object")return;

	var _config = {
		elem:null,
		type:"default",
		options:[],
		selected:"all",
		selecteds:[],
		selected_option:false,//初始默认项
		result:null,
		width:"200px",
		height:"38px",
	};

	var _this = this;
	_this.value = "";
	_this.code = "";
	_this.text = "";
	_this.elem = config.elem;
	_this.selecteds = [];
	_this.selecteds_text = [];//选中的文案
	_this.selecteds_obj = [];
	_this.codes = [];

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	_this.id = config.id;
	_this.title = config.title?config.title:"";
	_this.required = config.required?'d-error="请选择'+_this.title+'" d-type="select" required':'';
	_this.type = config.type;
	_this.selecteds_default = config.selecteds;
	_this.result = config.result;

	var html_options = '';
	if(config.options.length > 0){
		config.options.forEach(function(el,index){
			el.code = el.code?el.code:"";
			if(_this.type === "checkbox"){
				html_options += '<li d-val="'+el.val+'" d-code="'+el.code+'"><span class="default">'+el.name+'</span></li>';
			}else{
				html_options += '<li d-val="'+el.val+'" d-code="'+el.code+'">'+el.name+'</li>';
			}
		});
		
		//初始默认项
		if(config.selected_option || config.selected_option === 0){
			config.selected = config.options[config.selected_option].val;
		}
	}

	var html = '<div class="tselect" tabindex="1"><div class="tselect-title" '+_this.required+'><span>请选择</span><i class="arrow_down"></i></div><ul>'+html_options+'</ul></div>';

	_this.elem.html(html);
	_this.on("change"); //注册改变事件

	//click-show select
	_this.elem.off("click",".tselect-title").on("click",".tselect-title",function(){
		$(this).siblings("ul").show();
	});

	//blur-select
	_this.elem.off("blur",".tselect").on("blur",".tselect",function(){
		$(this).find("ul").hide();
	});

	//click-select
	_this.elem.off("click",".tselect li").on("click",".tselect li",function(){
		_this.elemLi = $(this);
		_this.elemItem = $(this).find("span");
		_this.change();
	});

	//是否有选中
	if(config.selected)_this.selected(config.selected);

	//是否有结果选项
	if(!_this.result)return;
	_this.result.off("click",".singleResult-close").on("click",".singleResult-close",function(){
		_this.elemLi = null;
		var id = $(this).attr("d-id");
		var allList = _this.elem.find("li");
		allList.each(function(index){
			if(allList.eq(index+1).attr("d-val") == id){
				allList.eq(index+1).find("span").attr("class","default");
			}
		});
		_this.selecteds_default = _this.selecteds.removeByValue(id);
		_this.selected(config.selected);
	});
}

fn_tselect.prototype.on = function(fnName,fn){
	var _this = this;
	this[fnName] = function(){
		if(fnName === "change"){
			_this.dftchange();
		}
		if(typeof fn === "function"){
			fn.apply(this);
		}
	}
};

fn_tselect.prototype.dftchange = function(){
	var _this = this;
	var _elem = _this.elemLi;
	var _val,
		_code,
		_text;

	if(_elem){
		fn_hasElem();
	}else{
		fn_noElem();
	}

	function fn_hasElem(){
		_val = _elem.attr("d-val");
		_code = _elem.attr("d-code");

		if(_this.type === "checkbox"){
			fn_op_checkbox();
		}else{
			_text = _elem.html();
			_elem.parent().parent().blur();
		}

		_elem.parent().siblings(".tselect-title").attr("d-val",_val);
		_elem.parent().siblings(".tselect-title").attr("d-code",_code);
		_elem.parent().siblings(".tselect-title").find("span").html(_text);

		_this.value = _val;
		_this.code = _code;
		_this.text = _text;

		function fn_op_checkbox(){
			if(_this.elemItem.attr("class") === "default"){
				_this.elemItem.attr("class","active");
			}else{
				_this.elemItem.attr("class","default");
			}
			if(_val === "all"){//全选
				_this.selecteds = [];
				_this.selecteds_text = [];
				_this.selecteds_obj = [];
				_this.codes = [];
				if(_this.elemItem.attr("class") === "active"){
					var allList = _this.elem.find("li");
					allList.each(function(index,el){
						if(index==0)return;
						allList.eq(index).find("span").attr("class","active");
						var id = allList.eq(index).attr("d-val");
						_this.selecteds.push(id);

						var text = allList.eq(index).find("span").html();
						_this.selecteds_text.push(text);

						var code = allList.eq(index).attr("d-code");
						_this.codes.push('"'+code+'"');

						_this.selecteds_obj.push({val:id,text:text});
					});
				}else{
					_this.elem.find("li").find("span").attr("class","default");
				}
			}else{//普通单选
				var text =_this.elemItem.html();
				if(_this.elemItem.attr("class") === "active"){
					_this.selecteds.push(_val);
					_this.selecteds_text.push(text);
					_this.codes.push('"'+_code+'"');
					_this.selecteds_obj.push({val:_val,text:text});
				}else{
					_this.selecteds.removeByValue(_val);
					_this.selecteds_text.removeByValue(text);
					_this.codes.removeByValue('"'+_code+'"');
					_this.selecteds_obj.removeByValue({val:_val,text:text});
				}
			}
			_text = "已选择："+_this.selecteds.length;
		}
	}

	function fn_noElem(){
		_elem = _this.elem.find(".tselect-title");
		if(_this.selecteds_default){
			_val = _this.selecteds_default;
			_val.forEach(function(el,index){//过滤选项中有多选
				if(el == "all")_val="all";
			});
		}else{
			_val = _this.value;
		}
		
		_code = _this.code;
		_text = _this.text;

		_this.selecteds = [];
		_this.selecteds_text = [];
		_this.selecteds_obj = [];
		_this.codes = [];

		if(_this.type === "checkbox"){
			var allList = _this.elem.find("li");
			if(_val === "all"){//全选
				allList.each(function(index,el){
					allList.eq(index).find("span").attr("class","active");
					var id = allList.eq(index).attr("d-val");
					if(index===0)return;
					_this.selecteds.push(id);

					var text = allList.eq(index).find("span").html();
					_this.selecteds_text.push(text);

					var code = allList.eq(index).attr("d-code");
					_this.codes.push('"'+code+'"');

					_this.selecteds_obj.push({val:id,text:text});
				});
			}else if(typeof _val === "object"){//多选
				_val.forEach(function(el,index){
					allList.each(function(ind_all,el_all){
						var ec_val = allList.eq(ind_all).attr("d-val");
						if(ec_val == el){
							allList.eq(ind_all).find("span").attr("class","active");
							_this.selecteds.push(ec_val);

							var text = allList.eq(ind_all).find("span").html();
							_this.selecteds_text.push(text);

							var code = allList.eq(ind_all).attr("d-code");
							_this.codes.push('"'+code+'"');

							_this.selecteds_obj.push({val:ec_val,text:text});
						}
					});
				});
			}else{//普通单选
				allList.each(function(index,el){
					var ec_val = allList.eq(index).attr("d-val");
					if(ec_val === _val){
						allList.eq(index).find("span").attr("class","active");
						_this.selecteds.push(ec_val);

						var text = allList.eq(index).find("span").html();
						_this.selecteds_text.push(text);

						var code = allList.eq(index).attr("d-code");
						_this.codes.push('"'+code+'"');

						_this.selecteds_obj.push({val:ec_val,text:text});
					}
				});
			}
			_text = "已选择："+_this.selecteds.length;
		}else{
			_elem.parent().blur();
		}

		_elem.attr("d-val",_val);
		_elem.attr("d-code",_code);
		_elem.find("span").html(_text);
	}

	//全选按钮
	function fn_checkLi(){
		var allList = _this.elem.find("li");
		var len = allList.length-1;
		if(_this.selecteds.length === len){
			allList.eq(0).find("span").attr("class","active");
		}else{
			allList.eq(0).find("span").attr("class","default");
		}
	}
	fn_checkLi();

	//结果列表
	function fn_result(){
		if(!_this.result)return;

		var html = '';
		_this.selecteds_obj.forEach(function(el,index){
			html += '<li class="zoom"><div class="singleResult-title">'+el.text+'</div><div class="singleResult-close" d-id="'+el.val+'"></div></li>';
		});

		_this.result.html('<div class="singleResult"><ul class="zoom">'+html+'</ul></div>');
	}
	fn_result();
}

fn_tselect.prototype.selected = function(val){
	var _this = this.elem;
	var selDom = _this.find(".tselect li[d-val=\""+val+"\"]")||[];
	if(selDom.length === 0){
		console.log("没有找到相关选项");
		return;
	}

	var _val = selDom.attr("d-val");
	var _code = selDom.attr("d-code");
	var _text = selDom.text();

	_this.find(".tselect-title").attr("d-val",_val);
	_this.find(".tselect-title").attr("d-code",_code);
	_this.find(".tselect-title").find("span").html(_text);

	this.value = _val;
	this.code = _code;
	this.text = _text;
	//this.change();
}

//表格
function fn_ttable(config){
	if(!config || typeof config !== "object")return;

	var _config = {
		elem:null,
		titles:[],
		items:[],
	};

	var _this = this;
	_this.elem = config.elem;
	_this.titles = config.titles;
	_this.items = config.items;

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	_this.init();

	_this.checked = function(){
		var arr = [];
		$(".dcheckbox input[type='checkbox']").each(function(index,el){
			if(el.checked){
				arr.push(el.getAttribute("id"));
			}
		});
		return arr;
	}
}

fn_ttable.prototype.initTitle = function(titles){
	if(titles)this.titles=titles;

	var _this = this;
	var html_title = '';
	if(_this.titles.length > 0){
		_this.titles.forEach(function(el){
			if(el === "checkbox"){
				html_title += '<th style="width:50px"><div class="dcheckbox-all"><input type="checkbox" id="all"><label for="all" class="default"></label></div></th>';
			}else{
				html_title += '<th>'+el+'</th>';
			}
		});
	}
	html_title = '<tr>'+html_title+'</tr>';

	return html_title;
}

fn_ttable.prototype.initItems = function(items){
	var _this = this;
	
	if(items)_this.items=items;
	
	var len = _this.titles.length;
	var html_tr = '';
	if(typeof items === "string"){
		html_tr = '<tr><td colspan='+len+'>'+items+'</td></tr>';
	}else{
		if(_this.items.length > 0){
			_this.items.forEach(function(el){
				var html_tds = '';
				el.tds.forEach(function(el_tds){
					html_tds += '<td>'+el_tds+'</td>';
				});
				html_tr += '<tr>'+html_tds+'</tr>';
			});
		}else{
			html_tr = '<tr><td colspan='+len+'>没有找到相关数据</td></tr>';
		}
	}
	
	return html_tr;
}

fn_ttable.prototype.init = function(config){
	var titles = false;
	var items = "请选择条件查询";
	if(typeof config === "object"){
		titles = config.titles?config.titles:titles;
		items = config.items?config.items:items;
	}
	var html_title = this.initTitle(titles);
	var html_tr = this.initItems(items);
	this.elem.html(html_title+html_tr);
}

//点击选中复选框
$(document).off("click",".dcheckbox").on("click",".dcheckbox",function(){
	var checkbox = $(this).find("input");
	var checkimg = $(this).find("label");

	if(checkbox.is(':checked')){
		checkimg.attr("class","active");
	}else{
		checkimg.attr("class","default");
	}
});

//点击选中复选框
$(document).off("click",".dcheckbox-all").on("click",".dcheckbox-all",function(){
	var checkbox = $(this).find("input");
	var checkimg = $(this).find("label");

	if(checkbox.is(':checked')){
		checkimg.attr("class","active");
		$(".dcheckbox input[type='checkbox']").each(function(index,el){
			el.checked = true;
			$(this).siblings("label").attr("class","active");
		});
	}else{
		checkimg.attr("class","default");
		$(".dcheckbox input[type='checkbox']").each(function(index,el){
			el.checked = false;
			$(this).siblings("label").attr("class","default");
		});
	}
});

/**事件选择

	var newObj = new infoAlert({
		type:"search",
		items:items
	});
	newObj.on("save",function(){
		console.log(abc.selected)
	})
**/
function infoAlert(config){
	var _this = this;
	var _config = {
		elem:null,
		type:"default",
		title:"",
		style:"default",
		items:[],
		items_new:[],
	};

	_this.value = [];
	_this.selected_obj = [];

	if(!config && typeof config !== "object"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	_this.config = config;
	_this.config.items_new = objDeepCopy(_this.config.items);

	var html_search = "";
	if(config.type === "search"){
		html_search = re_html_search();
	}

	_this.config = config;
	var items = config.items;

	var html_show_btn = re_html_title();//event-html-title

	config.elem.html(html_show_btn);

	if(!items || items.length === 0)return;

	_this.on("save"); //注册默认的点击事件

	config.elem.find("#infoAlert_title").off("click").on("click",function(){
		var disabled = $(this).attr("d-disabled");
		if(disabled === "true"){
			$(this).attr("d-disabled","false");
		}else{
			return;
		}

		var html = re_html_begin(html_search);//return-html-search
		config.elem.append(html);
		if(_this.config.items.length>0)items=_this.config.items;
		var html_body = _this.fn_list(config.type,items);
		_this.fn_begin(html_body);
	});

	//event-close
	config.elem.off("click",".ibtn-close").on("click",".ibtn-close",function(){
		_this.remove();
		$(document).find("#infoAlert_title").attr("d-disabled","true");
		config.elem.find("#infoAlert_title").attr("d-disabled","true");
	});

	//event-selectClick
	config.elem.off("click",".selectEvent-item").on("click",".selectEvent-item",function(){
		var _this_item = $(this);
		var is = JSON.parse(_this_item.attr("d-is"));
		if(is.isChecked){
			is.isChecked = false;
			_this_item.attr("d-is",JSON.stringify(is));
			_this_item.find(".selectEvent-icon").removeClass("onlineImg").addClass("defaultImg");

			if(is.type){
				_this.selected_click({type:is.type,id:is.id,isChecked:false});
			}else{
				_this.selected_click({id:is.id,isChecked:false});
			}
		}else{
			is.isChecked = true;
			_this_item.attr("d-is",JSON.stringify(is));
			_this_item.find(".selectEvent-icon").removeClass("defaultImg").addClass("onlineImg");
			if(is.type){
				_this.selected_click({type:is.type,id:is.id,isChecked:true});
			}else{
				_this.selected_click({id:is.id,isChecked:true});
			}
		}
	});

	//event-selectClick
	config.elem.off("click",".selectEvent-all").on("click",".selectEvent-all",function(){
		var index = $(this).attr("d-index");
		var is = $(this).attr("d-is");
		if(is === "true"){
			
			var set_config = {
				elem:$(this).parent().next(".selectEvent-box"),
				is:false,
				index:index
			}
			_this.set_selected(set_config);

			$(this).attr("d-is","false");
			$(this).find(".selectEvent-icon").removeClass("onlineImg").addClass("defaultImg");

		}else{
			var set_config = {
				elem:$(this).parent().next(".selectEvent-box"),
				is:true,
				index:index
			}
			_this.set_selected(set_config);
			$(this).attr("d-is","true");
			$(this).find(".selectEvent-icon").removeClass("defaultImg").addClass("onlineImg");
		}
	});

	//event-selectClick
	config.elem.off("click","#selectEvent_save").on("click","#selectEvent_save",function(){
		_this.config.items = objDeepCopy(_this.config.items_new);
		_this.save();
		config.elem.find("#infoAlert_title").attr("d-disabled","true");
	});

	//event-keyup
	config.elem.off("keyup","#selectEvent_search").on("keyup","#selectEvent_search",function(event){
		if(event.keyCode ==13){
			_this.fn_blur($(this));
		}
	});

	//event-click
	config.elem.off("click",".selectEvent-search-clear").on("click",".selectEvent-search-clear",function(){
		config.elem.find("#selectEvent_search").val("");
		_this.fn_blur(config.elem.find("#selectEvent_search"));
	});

	//return-html-begin
	function re_html_begin(html_search){
		return '<div class="infoAlert"><div class="infoAlert-main"><div class="infoAlert-title zoom"><div class="infoAlert-title-txt">'+config.title+'</div><div class="infoAlert-title-close ibtn-close"></div></div><div class="infoAlert-content">'+html_search+'<div class="selectEvent"></div><div class="selectEvent-btn"><button id="selectEvent_save">保存</button></div></div></div></div><div class="infoAlert-bg"></div>';
	}

	//return-html-search
	function re_html_search(){
		return '<div class="selectEvent-search zoom" style="display:none;"><div class="selectEvent-search-text"><input type="text" id="selectEvent_search" placeholder="请输入车牌号码" /></div><div class="selectEvent-search-clear"></div></div>'
	}

	//return-html-title
	function re_html_title(){
		var html = '<div class="tselect-title" id="infoAlert_title" d-disabled="true"><span>请选择</span><i class="arrow_down"></i></div>';

		if(_this.config.style === "white")html = '<div class="ctrlBlock-item-selectTitle" id="infoAlert_title" d-disabled="true"><span>请选择</span></div>';

		return html;
	}
}

infoAlert.prototype = {
	on:function(fnName, fn, hide){
		this[fnName] = function() {
	        if (hide != false) {
	            this.selecteds();
	            this.remove();
	        }
	        if (typeof fn == "function") {
	            fn.apply(this);
	        }
	    };
	},
	set_selected:function(set_conf){
		var items = this.config.items_new[set_conf.index].items;
		items.forEach(function(el,index){
			el.isChecked = set_conf.is;
			var obj = {
				isChecked:set_conf.is,
				type:index+1,
				id:el.id
			}

			set_conf.elem.find(".selectEvent-item").eq(index).attr("d-is",JSON.stringify(obj));
			if(set_conf.is){
				set_conf.elem.find(".selectEvent-item").eq(index).find(".selectEvent-icon").removeClass("defaultImg").addClass("onlineImg");
			}else{
				set_conf.elem.find(".selectEvent-item").eq(index).find(".selectEvent-icon").removeClass("onlineImg").addClass("defaultImg");
			}
			
		});		
	},
	selecteds:function(){
		var _this = this;
		var configItems = _this.config.items_new;
		var _thisItems = $(".selectEvent-item");
		var result = [];
		if(_thisItems.length>0 && _this.config.type === "default"){
			result = selecteds_default(_thisItems);
		}else{
			if(_this.config.type === "default"){
				result = set_default(configItems);
			}else if(_this.config.type === "search"){
				result = set_search(configItems);
			}
		}
		
		_this.value = result;
		var len=_this.value.length;
		_this.config.elem.find("span").html("已选择："+len);

		function selecteds_default(items){
			var arr = [];
			items.each(function(index,el){
				var is = JSON.parse(items.eq(index).attr("d-is"));
				if(is.isChecked){
					arr.push(is.id);
				}
			});
			ajax_save_user_vehicle_exception(arr);
			return arr;
		}

		function set_default(items){
			var arr = [];
			items.forEach(function(el,index){
				for(var i=0;i<el.items.length;i++){
					if(el.items[i].isChecked){
						arr.push(el.items[i].id);
					}
				}
			});
			return arr;
		}

		function set_search(items){
			var arr = [];
			items.forEach(function(el,index){
				if(el.isChecked){
					arr.push(el.id);
				}
			});
			return arr;
		}

		//ajax-获取不安全事件列表
		function ajax_save_user_vehicle_exception(set){
			$.ajax({
				url:ajax_106+'/save_user_vehicle_exception',
				type:'post',
				dataType:'json',
				data:{
					user_id:info_login.data.id,
					option:JSON.stringify(set),
				},
			}).then(function(data){
				if(data.code === "0000"){
					
				}
			});
		}
	},
	selected_click:function(obj){
		var items = this.config.items_new;

		if(obj.type){
			items.forEach(function(el,index){
				for(var i=0;i<el.items.length;i++){
					if(obj.id === el.items[i].id){
						el.items[i].isChecked = obj.isChecked;
					}
				}
			});
		}else{
			items.forEach(function(el,index){
				if(obj.id === el.id){
					el.isChecked = obj.isChecked;
				}
			});
		}
	},
	fn_blur:function(event_this){
		var arr = [];
		var items = this.config.items;
		items.forEach(function(el,index){
			if(el.txt.indexOf(event_this.val())>-1){
				arr.push(el);
			}
		});

		console.log(items)

		var html_body = this.fn_list(this.config.type,arr);
		this.fn_begin(html_body);
	},
	fn_list:function(type,items){
		var result = [];
		if(type === "default"){
			result = selecteds_default(items);
		}else{
			result = selecteds_search(items);
		}

		return result;

		function selecteds_default(items){
			items = fn_reload(items);
			var html = "";
			items.forEach(function(el,index){
				var isAll = fn_is_all(el.items);
				var isAll_css = isAll?'onlineImg':'defaultImg';
				var html_title = '';
				if(el.title)html_title = '<div class="selectEvent-title zoom"><span>'+el.title+'</span><div class="selectEvent-all" d-is="'+isAll+'" d-index="'+index+'"><div class="selectEvent-icon '+isAll_css+'"></div><div class="selectEvent-txt">全选</div></div></div>';
				var html_box = "";
				var elItem = el.items;
				for(var i=0;i<elItem.length;i++){
					var html_box_list = "";
					for(var j=0;j<elItem[i].length;j++){
						var isChecked = elItem[i][j].isChecked;
						if(elItem[i][j].isChecked){
							isChecked = 'onlineImg';
						}else{
							isChecked = 'defaultImg';
						}
						var postData = {
							isChecked:elItem[i][j].isChecked,
							type:el.type,
							id:elItem[i][j].id,
						};
						html_box_list += '<div class="selectEvent-item zoom" d-is=\''+JSON.stringify(postData)+'\'><div class="selectEvent-icon '+isChecked+'"></div><div class="selectEvent-txt">'+elItem[i][j].txt+'</div></div>';
					}
					html_box += '<div class="selectEvent-line zoom">'+html_box_list+'</div>';
				}
				html += html_title+'<div class="selectEvent-box">'+html_box+'</div>';
			});
			return html;

			function fn_reload(items){
				var newItems = [];
				items.forEach(function(el,index){
					newItems.push([]);
					var arr = el.items;
					var arr1 = [];
					var arr2 = [];
					for(var i = 0; i < arr.length; i++){
						arr2.push(arr[i]);
						if(arr2.length == 4){
							arr1.push(arr2);
							arr2=[];  
						}else if(i == arr.length-1){
							arr1.push(arr2);
							arr2=[];
						}
					}

					newItems[index] = {
						title:el.title,
						type:el.type,
						items:arr1,
					};
				});
				return newItems;
			}
		}
		
		function selecteds_search(items){
			var html = "";
			items.forEach(function(el,index){
				var elItem = el.items;
				if(el.isChecked){
						isChecked = 'onlineImg';
					}else{
						isChecked = 'defaultImg';
					}
					var postData = {
						isChecked:el.isChecked,
						id:el.id,
					};

				html += '<div class="selectEvent-item zoom" d-is=\''+JSON.stringify(postData)+'\'><div class="selectEvent-icon '+isChecked+'"></div><div class="selectEvent-txt">'+el.txt+'</div></div>';
			});
			return '<div class="selectEvent-box zoom">'+html+'</div>';
		}

		//判断是否全选
		function fn_is_all(items){
			for(var i=0;i<items.length;i++){
				for(var j=0;j<items[i].length;j++){
					if(!items[i][j].isChecked){
						return false;
					}
				}
			}
			return true;
		}
	},
	fn_begin:function(html){
		$(".selectEvent").html(html);
		var width_infoAlert = $(".infoAlert").width();
		var height_infoAlert = $(".infoAlert").height();
		$(".infoAlert").css("margin-top",-height_infoAlert/2);
		$(".infoAlert").css("margin-left",-width_infoAlert/2);
	},
	remove:function(){
		$(".infoAlert,.infoAlert-bg").remove();
	}
}

/**图片弹框

	new imgAlert({
		index:0,
		items:[],
		navigation:true,
	});
**/
function imgAlert(config){
	var _config = {
		index:0,
		items:[],
		navigation:true,
		isDownload:true,
	};

	if(!config && typeof config !== "object"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	var config_index = config.index;

	var html = re_html();//return-html

	$("body").append(html);
	if(!config.isDownload)$(".imgAlert-download").remove();

	//click-close
	$(document).off("click",".imgAlert-close").on("click",".imgAlert-close",function(){
		$(".imgAlert").remove();
	});

	//click-download
	$(document).off("click",".imgAlert-download").on("click",".imgAlert-download",function(){
		var src = $(this).parent().parent().siblings(".imgAlert-img").find("img").attr("src");
		fn_download(src);//download
	});

	//判断是否有navigation
	if(config.navigation){
		$(".imgAlert-arrow-next,.imgAlert-arrow-prev").show();
		new Swiper('#imgAlert_swiper', {
			navigation: {
				nextEl: '.imgAlert-arrow-prev',
				prevEl: '.imgAlert-arrow-next',
			},
			initialSlide :config_index,
		});
	}else{
		$(".imgAlert-arrow-next,.imgAlert-arrow-prev").hide();
	}

	//return-html
	function re_html(){
		var html_imgs = '';
		config.items.forEach(function(el,index){
			var infos = el.infos;
			var html_infos = "";
			if(infos.length>0){
				infos.forEach(function(el,index){
					html_infos += '<span>'+el+'</span>';
				});
			}

			html_imgs += '<div class="swiper-slide"><div class="imgAlert-img"><img src='+el.src+' /></div><div class="imgAlert-box"><div style="position:relative;"><div class="imgAlert-info-bg"></div><div class="imgAlert-info">'+html_infos+'</div><div class="imgAlert-download" id="download">下载</div></div></div></div>';

			if(el.index === config_index)config_index = index;
		});

		return '<div class="imgAlert"><div class="imgAlert-main bounceIn animated"><div class="imgAlert-close"></div><div id="imgAlert_swiper"><div class="swiper-wrapper">'+html_imgs+'</div></div><div class="imgAlert-arrow-next"></div><div class="imgAlert-arrow-prev"></div></div><div class="imgAlert-bg"></div></div>';
	}

	//download
	function fn_download(src) {
	    var $a = document.createElement('a');
	    $a.setAttribute("href", src);
	    $a.setAttribute("download", "");

	    var evObj = document.createEvent('MouseEvents');
	    evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
	    $a.dispatchEvent(evObj);
	}
}

/**表格菜单栏
	config = {
		elem:null,//容器，备注，此容器加一个zoom用作清除浮动
		items:[
			{
				name:"",
				id:"",
				type:"",
				val:"",
				placeholder:"",
				width:"170",
				required:false
			}
		]
	};
**/
function singleMenu(config){
	var _this = this;
	var _config = {
		elem:null,
		items:[
			{name:"",id:"",type:"",val:"",placeholder:"",width:"170",required:false}
		]
	};

	if(!config && typeof config !== "object"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	var html = "";
	config.items.forEach(function(el,index){
		switch (el.type){
			case "text":
				html += _this.re_text(el);
				break;
			case "btn":
				html += _this.re_btn(el);
				break;
			case "select":
				html += _this.re_select(el);
				break;
			case "date":
				html += _this.re_date(el);
				break;
			default:
				html += _this.re_text(el);
		}
	});

	config.elem.html(html);
}
singleMenu.prototype = {
	re_text:function(obj){
		obj.width=obj.width?obj.width:"170";
		obj.placeholder=obj.placeholder?obj.placeholder:"";
		return '<div class="singleMenu-item zoom"><div class="singleMenu-item-txt">'+obj.name+'</div><div class="singleMenu-item-content" style="width:'+obj.width+'px;"><input type="text" class="dtext" placeholder="'+obj.placeholder+'" id="'+obj.id+'" /></div></div>';
	},
	re_btn:function(obj){
		return '<div class="singleMenu-item"><button class="dbtn" id="'+obj.id+'">'+obj.name+'</button></div>';
	},
	re_select:function(obj){
		obj.width=obj.width?obj.width:"170";
		return '<div class="singleMenu-item zoom"><div class="singleMenu-item-txt">'+obj.name+'</div><div class="singleMenu-item-content" id="'+obj.id+'" style="width:'+obj.width+'px;"></div></div>';
	},
	re_date:function(obj){
		obj.width=obj.width?obj.width:"170";
		obj.placeholder=obj.placeholder?obj.placeholder:"";

		var fn_date = "laydate.render({elem:this,type:'datetime',position:'fixed',btns:['clear', 'confirm'],format:'yyyy-MM-dd HH:mm:ss',theme:'#44bae0',show:true,trigger:'click',max:1});";
		var boxId = obj.boxId?obj.boxId:"";
		if(obj.typeStyle == "end"){
			fn_date = "laydate.render({elem:this,type:'datetime',position:'fixed',format:'yyyy-MM-dd HH:mm:ss',theme:'#44bae0',show:true,trigger:'click',max:1});";
		}

		return '<div class="singleMenu-item zoom" id="'+boxId+'"><div class="singleMenu-item-txt">'+obj.name+'</div><div class="singleMenu-item-content" style="width:'+obj.width+'px;"><input type="text" class="dtext" placeholder="'+obj.placeholder+'" id="'+obj.id+'" onclick="'+fn_date+'" /></div></div>';
	}
};

/** 选项卡
	config = {
		elem:null,
		options:[
			{name:""}
		],
		default:0
	};	 	
**/
function singleTab(config){
	var _this = this;
	var _config = {
		elem:null,
		options:[],
		default:0
	};

	if(!config && typeof config !== "object"){
		config = _config;
	}

	for(var k in _config){
		if(!config.hasOwnProperty(k)){
			config[k] = _config[k];
		}
	}

	var html = "";
	config.options.forEach(function(el,index){
		var cls = config.default===index?"online":"default";
		html += '<div class="singleTab-span '+cls+'" d-index="'+index+'">'+el.name+'</div>';
	});

	config.elem.html(html);
	config.elem.off("click",".singleTab-span").on("click",".singleTab-span",function(){
		$(".singleTab-span").removeClass("online").addClass("default");
		$(this).removeClass("default").addClass("online");
	});
}

/***系统管理编辑页的配置型UI
    var _config = {
        elem:null,//容器
        items:[
            {
                title:"车队基本信息",
                items:[
                    {title:"输入框：",required:true,value:"",id:"",placeholder:"",colspan:4},
                    {title:"下拉框：",type:"select",value:"",id:""},
                    {title:"日期：",type:"date",required:true,value:"",id:""},
                    {title:"文本域：",type:"textarea",required:true,value:"",id:""},
                ],
            }
        ]
    };
***/
function fn_edit_begin(config){
    var _this = this;
    var _config = {
        elem:null,
        items:[]
    };

    for(var k in _config){
        if(!config.hasOwnProperty(k)){
            config[k] = _config[k];
        }
    }

    var data_items = config.items;
    this.width_content = 0;
    this.sel_arr = [];//下拉框

    var html = "";
    for(var i=0;i<data_items.length;i++){
        var html_items = "";
        if(data_items[i].items && data_items[i].items.length > 0){
            var items = data_items[i].items;
            items.forEach(function(el,index){
            	_this.width_content = 0;
            	if(el.colspan == 2){
            		_this.width_content = "calc(50% - 15px)";
                }else if(el.colspan == 3){
                	_this.width_content = "calc(75% - 8px)";
                }else if(el.colspan == 4){
                	_this.width_content = "100%";
                }
                html_items += _this.re_html(el);
            });
        }
        html += '<div class="mngCar-block"><div class="mngCar-block-title"><span>'+data_items[i].title+'</span></div><div class="mngCar-block-content zoom">'+html_items+'</div></div>';
    }

    config.elem.html(html);
    $(".mngCar-select").each(function(index,el){
    	var id = $(".mngCar-select").eq(index).attr("id");
    	for(var i=0;i<data_items.length;i++){
    		var _child_items = data_items[i].items;
    		for(var j=0;j<_child_items.length;j++){
    			if(id == _child_items[j].id){
    				var selected = _child_items[j].selected?_child_items[j].selected:"";
    				_this.sel_arr[index] = new fn_tselect({
    					elem:$("#"+_child_items[j].id),
    					options:_child_items[j].options,
    					id:_child_items[j].id,
    					selected:selected,
    					required:_child_items[j].required,
    					title:_child_items[j].title.substring(0,_child_items[j].title.length-1)});
    				return;
    			}
    		}
    	}
        var id = $(".mngCar-select").eq(index).attr("id");
        var required = $(".mngCar-select").eq(index).attr("d-required");
        var options= [{name:"请选择",val:""}];
    });

    config.elem.off("change",".file-fixed").on("change",".file-fixed",function(){
    	$(this).siblings("button").html("上传中");
    	ajax_token_qiniu($(this).parent(),"default",$(this).parents(".mngCar-item").index());
    });

    config.elem.off("click",".mngCar-photo-remove").on("click",".mngCar-photo-remove",function(){
    	$(this).parent().hide();
    	$(this).parent().siblings(".mngCar-photo-add,.mngCar-photo-default").show();
    	$(this).siblings("img").attr("src","");
    });

    config.elem.off("change",".mngCar-photo-add input[type=file]").on("change",".mngCar-photo-add input[type=file]",function(){
    	$(this).siblings("button").html("上传中");
    	
    	ajax_token_qiniu($(this).parent(),"add",$(this).parent().parent().index());
    });

    config.elem.off("click",".mngCar-photo-removeAdd").on("click",".mngCar-photo-removeAdd",function(){
    	$(this).parent().hide();
    	$(this).parent().siblings(".mngCar-photo-default").show();
    });

    config.elem.off("click",".boxOrigin-tab span").on("click",".boxOrigin-tab span",function(){
    	var _this_child = $(this);
    	var index = $(this).index();

    	if(index == 0){
    		var obj = {
	    		elem:_this_child.parent().siblings(".boxOrigin-list").find("ul")
	    	}
	    	_this.ajax_provinces(obj);
	    	_this_child.parent().html("<span>省/直辖市</span>");
    	}
    });

    config.elem.off("click",".boxOrigin-list li").on("click",".boxOrigin-list li",function(){
    	var code = $(this).attr("d-code");
    	var val = $(this).html();
    	var type = $(this).attr("d-type");

    	if(type === "city"){
    		$(this).parents(".mngCar-item-content").find("input").val(val);
    		$(this).parents(".mngCar-item-content").find("input").attr("d-code",code);
    		$(this).parents(".boxOrigin").hide();
    		return;
    	}
    	var obj = {
    		elem:$(this).parent(),
    		code:code
    	}
    	_this.ajax_city(obj);
    	$(this).parents(".boxOrigin").find(".boxOrigin-tab span").html(val);
    	$(this).parents(".boxOrigin").find(".boxOrigin-tab span").removeClass("active");
    	$(this).parents(".boxOrigin").find(".boxOrigin-tab").append('<span class="active">请选择</span>');
    });

    config.elem.off("click",".mngCar-item-origin").on("click",".mngCar-item-origin",function(){
    	$(this).siblings(".boxOrigin").find(".boxOrigin-tab").html("<span>省/直辖市</span>");
    	$(this).siblings(".boxOrigin").show();
    	$(this).siblings(".boxOrigin").focus();
    	var obj = {
    		elem:$(this).siblings(".boxOrigin").find("ul")
    	}
    	_this.ajax_provinces(obj);
    });

    config.elem.off("blur",".boxOrigin").on("blur",".boxOrigin",function(){
    	$(this).hide();
    });

    function ajax_token_qiniu(elem,type,index){
    	var pre_url="";
		$.ajax({
			url:"https://performance.whome.cn/get_token",
			type:"get",
			dataType:"json",
			data:{file_name:name}
		}).then(function(data){
			if(data.code === "0000"){
				data=data.data;
				pre_url = data.pre_url;
				var set = {
					token:data.token,
					key:data.access_key
				};
				upload_qiniu(set);
			}
		});

		function upload_qiniu(data){
		    var config = {
		      useCdnDomain: true,
		      disableStatisticsReport: false,
		      retryCount: 5,
		      region: qiniu.region.z0
		    };

		    var putExtra = {
		      fname: "",
		      params: {},
		      mimeType: null
		    };
		    
		    var file = document.querySelectorAll('[type=file]');
		    file = file[index];
		    if(!file)return;
		    var formData = new FormData();
		    formData.append("file",file.files[0]);
		    formData.append("key",data.key);
		    formData.append("token",data.token);
		    ajaxAddVoucherToMore(formData);
		}

		function ajaxAddVoucherToMore(set){
		    $.ajax({
		    	url:"https://upload.qiniup.com",
		    	type:"post",
		    	dataType:"json",
		    	data:set,
		    	cache: false,                      // 不缓存
			    processData: false,                // jQuery不要去处理发送的数据
			    contentType: false,                // jQuery不要去设置Content-Type请求头
		    }).then(function(data){
		    	console.log(data)

		    	var url = pre_url;
		    	elem.hide();
		    	elem.find("button").html("上传照片");

		    	if(type === "default"){
		    		elem.siblings(".mngCar-photo-img").show();
    				elem.siblings(".mngCar-photo-img").find("img").attr("src",url+data.key);
		    	}else{
		    		elem.siblings(".mngCar-photo-img").show();
			    	elem.siblings(".mngCar-photo-img").find("img").attr("src",url+data.key);

			    	var num = elem.parent().parent().attr("d-num");
			    	var len = config.elem.find(".mngCar-photo-add").length;
			    	if(len>=num)return;
			    	var obj = {
			    		id:""
			    	}
			    	var photo = _this.re_html_photo(obj);
			    	elem.parent().after(photo);
		    	}
		    });
		}
	}
}

fn_edit_begin.prototype = {
    re_html:function(el){
    	var _this = this;
        var required_html = el.required?"<span>*</span>":"";

        var width_items = "";
        if(_this.width_content){width_items = 'style="width:'+this.width_content+';margin-right:0;"';}

        var html = "";
        switch (el.type){
            case "select":
                html = re_html_select(el);
                break;
            case "date":
                html = re_html_date(el);
                break;
            case "dateStartEnd":
                html = re_html_dateStartEnd(el);
                break;
            case "textarea":
                html = re_html_textarea(el);
                break;
            case "upload":
                html = re_html_upload(el);
                break;
            case "upload_fixed":
            	width_items = 'style="width:33.3%;margin-right:0;"';
                html = re_html_upload_fixed(el);
                break;
            case "origin":
            	html = re_html_origin(el);
            	break;
            default:
                html = re_html_text(el);
        }

        function re_html_select(obj){
            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content mngCar-select" id="'+obj.id+'" d-required="'+obj.required+'"></div></div>';
        }

        function re_html_date(obj){
        	var value = obj.value?"value=\""+obj.value+"\"":"";
        	var required = obj.required?'d-error="请输入'+obj.title.substring(0,obj.title.length-1)+'" required':'';
        	var max = obj.max?",max:"+obj.max:"";
            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content"><input type="text" class="dtext mngCar-item-text icon-date" onclick="laydate.render({elem:this,type:\'datetime\',position:\'fixed\',format:\'yyyy-MM-dd HH:mm:ss\',theme:\'#44bae0\',show:true,trigger:\'click\''+max+'});" id="'+obj.id+'" '+required+' '+value+' maxlength="50" d-type="date" /></div></div>';
        }

        function re_html_dateStartEnd(obj){
        	var value1 = obj.value1?"value=\""+obj.value1+"\"":"";
        	var value2 = obj.value2?"value=\""+obj.value2+"\"":"";
        	var required1 = obj.required1?'d-error="请输入'+obj.placeholder1+'" required':'';
        	var required2 = obj.required2?'d-error="请输入'+obj.placeholder2+'" required':'';
        	var max1 = obj.max1?",max:"+obj.max1:"";
        	var max2 = obj.max2?",max:"+obj.max2:"";

            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content"><input type="text" class="dtext mngCar-item-text icon-date" onclick="laydate.render({elem:this,type:\'datetime\',position:\'fixed\',format:\'yyyy-MM-dd HH:mm:ss\',theme:\'#44bae0\',show:true,trigger:\'click\''+max1+'});" placeholder="'+obj.placeholder1+'" id="'+obj.id1+'" '+value1+' style="width:170px;" '+required1+' maxlength="50" d-type="date" /><span style="color:#fff;margin:0 10px;">——</span><input type="text" class="dtext mngCar-item-text icon-date" onclick="laydate.render({elem:this,type:\'datetime\',position:\'fixed\',format:\'yyyy-MM-dd HH:mm:ss\',theme:\'#44bae0\',show:true,trigger:\'click\''+max2+'});" placeholder="'+obj.placeholder2+'" id="'+obj.id2+'" '+value2+' style="width:170px;" '+required2+' maxlength="50" d-type="date" /></div></div>';
        }

        function re_html_text(obj){
        	var value = obj.value?"value="+obj.value:"";
        	var disabled = obj.disabled?'disabled="disabled"':"";
        	var required = obj.required?'d-error="请输入'+obj.title.substring(0,obj.title.length-1)+'" required':'';
            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content"><input type="text" class="dtext mngCar-item-text" d-type="text" id="'+obj.id+'" '+required+' '+value+' maxlength="50" '+disabled+' /></div></div>';
        }

        function re_html_textarea(obj){
        	var value = obj.value?obj.value:"";
        	var required = obj.required?'d-error="请输入'+obj.title.substring(0,obj.title.length-1)+'" required':'';
            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content"><textarea class="dtext mngCar-item-texteara" id="'+obj.id+'" '+required+' maxlength="50">'+value+'</textarea></div></div>';
        }

        function re_html_upload(obj){
        	var photo = _this.re_html_photo(obj);
        	console.log(obj.srcs)
        	if(obj.srcs){
        		photo = "";
        		var srcs = JSON.parse(obj.srcs);
        		srcs.forEach(function(el,index){
        			var obj_el = {
        				id:index,
        				src:el
        			}
        			photo+=_this.re_html_photo(obj_el);
        		});
        		if(srcs.length<3){
        			photo += _this.re_html_photo(obj)
        		}
        	}
        	
        	obj.num = obj.num?obj.num:3;

            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content zoom" d-num="'+obj.num+'">'+photo+'</div></div>';
        }

        function re_html_upload_fixed(obj){
        	var h1 = '<div class="mngCar-photo-default"><img src="img/mng/car/add.png" /><br><button>上传照片</button><input type="file" class="file-fixed" /></div><div class="mngCar-photo-img" style="display:none;"><img src="" alt="" id="'+obj.id+'" /><div class="mngCar-photo-remove"></div></div>';
        	if(obj.src){
        		h1 = '<div class="mngCar-photo-default" style="display:none;"><img src="img/mng/car/add.png" /><br><button>上传照片</button><input type="file" class="file-fixed" /></div><div class="mngCar-photo-img"><img src="'+obj.src+'" alt="" id="'+obj.id+'" /><div class="mngCar-photo-remove"></div></div>';
        	}

            return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content zoom"><div class="mngCar-photo dtext">'+h1+'</div></div></div>';
        }

        function re_html_origin(obj){
        	var value = obj.value?"value="+obj.value:"";
        	var disabled = obj.disabled?'disabled="disabled"':"";
        	var required = obj.required?'d-error="请输入'+obj.title.substring(0,obj.title.length-1)+'" required':'';

        	return '<div class="mngCar-item zoom" '+width_items+'><div class="mngCar-item-title">'+required_html+obj.title+'</div><div class="mngCar-item-content"><input type="text" class="dtext mngCar-item-text mngCar-item-origin" d-type="text" id="'+obj.id+'" '+required+' '+value+' maxlength="50" '+disabled+' /><div class="boxOrigin" tabindex="1"><div class="boxOrigin-tab zoom"><span>省/直辖市</span></div><div class="boxOrigin-list zoom"><ul class="zoom"></ul></div></div></div></div>';
        }

        return html;
    },
    re_html_photo:function(obj){
    	var h1 = '<div class="mngCar-photo-add"><img src="img/mng/car/add.png" /><br><button>上传照片</button><input type="file" class="file-fixed" /></div><div class="mngCar-photo-img" style="display:none;"><img src="" alt="" id="'+obj.id+'" /><div class="mngCar-photo-remove mngCar-photo-removeAdd"></div></div>'
    	if(obj.src){
    		h1 = '<div class="mngCar-photo-add" style="display:none;"><img src="img/mng/car/add.png" /><br><button>上传照片</button><input type="file" class="file-default" /></div><div class="mngCar-photo-img"><img src="'+obj.src+'" alt="" id="'+obj.id+'" /><div class="mngCar-photo-remove mngCar-photo-removeAdd"></div></div>';
    	}
    	return '<div class="mngCar-photo dtext">'+h1+'</div>';
    },
    is_required:function(){//校验
        var  _required = $("[required]");
        for(var i=0;i<_required.length;i++){
            var obj_i = _required.eq(i);
            var type = obj_i.attr("d-type");
            if(type && type == "text"){
                var val = obj_i.val();
                if(!val){
                    var error = obj_i.attr("d-error");
                    toastr.error(error);
                    return false;
                }
            }else if(type == "select"){
                var val = obj_i.attr("d-val");
                if(!val){
                    var error = obj_i.attr("d-error");
                    toastr.error(error);
                    return false;
                }
            }else if(type == "date"){
                var val = obj_i.val();
                if(!val){
                    var error = obj_i.attr("d-error");
                    toastr.error(error);
                    return false;
                }
            }
        }
        return true;
    },
    ajax_provinces:function(obj){
    	$.ajax({
    		url:ajax_106+'/get_all_provinces',
    		type:'post',
    		dataType:'json',
    		async:true,
    	}).then(function(data){
    		if(data.code === "0000"){
    			var data = data.data;

    			var html_li = "";
    			data.forEach(function(el,index){
    				html_li += '<li d-code="'+el.code+'">'+el.name+'</li>';
    			});

    			obj.elem.html(html_li);
    		}
    	});
    },
    ajax_city:function(obj){
    	$.ajax({
    		url:ajax_106+'/get_province_citys',
    		type:'post',
    		dataType:'json',
    		async:true,
    		data:{
    			code:obj.code
    		},
    	}).then(function(data){
    		if(data.code === "0000"){
    			var data = data.data;

    			var html_li = "";
    			data.forEach(function(el,index){
    				html_li += '<li d-code="'+el.code+'" d-type="city">'+el.name+'</li>';
    			});

    			obj.elem.html(html_li);
    		}
    	});
    },
    re_provinces:function(){
    	var html = "";
    	$.ajax({
    		url:ajax_106+'/get_all_provinces',
    		type:'post',
    		dataType:'json',
    		async:false,
    	}).then(function(data){
    		if(data.code === "0000"){
    			var data = data.data;

    			data.forEach(function(el,index){
    				html += '<li d-code="'+el.code+'">'+el.name+'</li>';
    			});

    		}
    	});
    	return html;
    }
}
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
//数组去重-一般数组
Array.prototype.remove_arr = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};

//判断是否有重复
Array.prototype.isArrLike = function(){
	var _this = this;
	var sign = false;
	_this.forEach(function(el,index){
		if(index === _this.length)return;
		var str1 = JSON.stringify(el);
		var str2 = JSON.stringify(_this[index+1]);
		if(str1 === str2)sign=true;
	});
    return sign ;
}

//数组去空
Array.prototype.notempty = function(){
	var array = this;
	for(var i = 0 ;i<array.length;i++){

		if($.trim(array[i]) == "" || typeof(array[i]) == "undefined"){
			array.splice(i,1);
			i= i-1;
		}
	}
	return array;
}

//数组删除
Array.prototype.removeByValue = function(val) {
	if(typeof val === "object"){
		var _this = [];
		this.forEach(function(el,index){
			_this.push(JSON.stringify(el));
		});

		var index=_this.indexOf(JSON.stringify(val)); 
		this.splice(index,1); 
		return this;
	}else{
		for(var i=0; i<this.length; i++) {
		  if(this[i] == val) {
		    this.splice(i, 1);
		    break;
		  }
		}
		return this;
	}
}