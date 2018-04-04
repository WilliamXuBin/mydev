//消息提示框
function msg(info){
	layui.use(['layer'], function(){
		var layer = layui.layer;
		layer.msg(info);
	});
}

function ajax_login(set){
	$.ajax({
		url: "/api/user/login.json",
		method: 'POST',
		dataType: 'json',
		data:set
	}).then(function(data, textStatus, request){
		var SESSION = request.getResponseHeader('SESSION');
		if(data.code==="0000"){
			Cookies.set('SESSION', SESSION, { expires: 1 });
			console.log(JSON.stringify({data:data.data}))
			Cookies.set('login', JSON.stringify({data:data.data}), { expires: 1 });
			window.localStorage.info_login = JSON.stringify({data:data.data});
			if(data.data.roleid == 1){
				window.location.href = 'index.html?sign=user';
			}else{
				if(window.sessionStorage.sizeHtml){
					window.location.href = window.sessionStorage.sizeHtml;
				}else{
					window.location.href = 'index.html';
				}
			}
		}else{
			msg(data.message);//提示框
		}
	});
}

//keydown-all text
$(".login-item input").keydown(function(e){
	if(e.keyCode==13){
	   $("#login").click();//处理事件
	}
});

//click-login
$("#login").click(function(){
	var userName = $.trim($("#userName").val());
	var pwd = $.trim($("#pwd").val());

	if(!userName){
		msg("请输入用户名");
		return;
	}

	if(!pwd){
		msg("请输入密码");
		return;
	}

	var postData = {
		"username":userName,
		"password":pwd,
	};
	ajax_login(postData);
});