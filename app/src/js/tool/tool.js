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