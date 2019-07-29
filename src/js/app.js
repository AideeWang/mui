var BASEAPI;//服务器URL
//获取config.json baseapi参数 
function getBaseApi() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "config.json", false);
	xhr.onload = function() {
		if (this.status == 200) {
			var configJson = JSON.parse(this.responseText);
			//console.log(config.baseapi);
			BASEAPI = configJson.baseapi;
		}
	}
	xhr.send();
}
//重写$.ajax
//api controller/aaction
//parms 请求数据
//success 成功函数
//xhrtype 请求类型
//xhrasync 同步或异步请求
function MuiAjax(api, parms, success, xhrtype, xhrasync) {
	getBaseApi();
	api = BASEAPI +api ;
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
		async:xhrasync
	});
}
