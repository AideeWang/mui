//var BASEAPI; //服务器URL
//获取config.json baseapi参数 
// function getBaseApi() {
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("GET", "config.json", false);
// 	xhr.onload = function() {
// 		if (this.status == 200) {
// 			var configJson = JSON.parse(this.responseText);
// 			//console.log(config.baseapi);
// 			BASEAPI = configJson.baseapi;
// 			sessionStorage.setItem("BASEAPI", BASEAPI);
// 		}
// 	}
// 	xhr.send();
// }

//重写$.ajax
//api controller/aaction
//parms 请求数据
//success 成功函数
//xhrtype 请求类型
//xhrasync 同步或异步请求
function MuiAjax(api, parms, success, xhrtype, xhrasync) {
	var baseapi = sessionStorage.getItem("BASEAPI");
	if (baseapi == "" || baseapi == null) {
		sessionStorage.setItem("BASEAPI", BASEAPI);
		baseapi =BASEAPI;
	}
	api = baseapi + api;
	if (xhrtype == undefined) {
		xhrtype = 'post'
	} //默认post 请求
	if (xhrasync == undefined) {
		xhrasync = true
	} //默认 异步请求
	mui.ajax(api, {
		data: parms,
		dataType: 'json', //服务器返回json格式数据
		type: xhrtype, //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		headers: {
			'Content-Type': 'application/json'
		},
		success: success,
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		},
		async: xhrasync
	});
}

/*
	获取单个配置键值对 
	categorys 参数
*/
function GetNameValue(category,bingSelector){
	MuiAjax('namevalue/getnamevalue?category='+category,null,function(data){
		if(data.IsSuccess){
			//console.log(data);
			bingSelector(data.Result);
		}
	},'get');
}

/*
	获取多个配置键值对 
	categorys 参数,参数
*/
function GetNameValueList(categorys,bingSelector){
	MuiAjax('namevalue/getnamevaluelist?categorys='+categorys,null,function(data){
		if(data.IsSuccess){
			//console.log(data);
			bingSelector(data.Result);
		}
	},'get');
}

/*
提示
*/
function muitoast(name){
	mui.toast(name, {
		duration: 'long',
		type: 'div'
	})
}
/*
从url获取参数
*/
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
