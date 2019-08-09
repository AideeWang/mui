//B页面onload从服务器获取列表数据；
window.onload = function() {
	//从服务器获取数据
	vmain.getUserInfoByDingUserId();

}


var vmain = new Vue({
	el: "#main-content",
	data: {
		txtSearch: '',
		searchWorklistItemList: [],
		cchrUserInfo: {},
		approvalWorklistItemList: [],
		approvalWorklistItem: '',
		itemCount: 0
	},
	created: function() {
		this.getUserInfoByDingUserId();
	},
	watch: {
		txtSearch: function() {
			this.searchWorklistItemList = [];
			this.approvalWorklistItemList.forEach(function(value, index) {
				if (value.Folio.indexOf(vmain.txtSearch) >= 0) {
					vmain.searchWorklistItemList.push(value);
				}
			});
		}
	},
	methods: {
		getUserInfoByDingUserId: function() { //获取人员信息
			var dingUserId = sessionStorage.getItem("userid");
			MuiAjax('login/GetEmployeeInfo?DingUserId=' + dingUserId, null, function(data) {
				if (data.IsSuccess) {
					vmain.cchrUserInfo = data.Result;
					vmain.getCurrentUserWorkListItem();
				} else {
					muitoast(data.Message);
				}

			}, 'get');
		},
		getCurrentUserWorkListItem: function() {
			MuiAjax('k2WebService/getCurrentUserWorkListItem?ApprovalUser=' + "doush", null, function(data) {
				if (data != null) {
					vmain.approvalWorklistItemList = JSON.parse(data);
					
					// JSON.parse(data).forEach(function(value,index){
					// 	if(value.ProcessName=="劳务合同审批")
					// });
					vmain.searchWorklistItemList = vmain.approvalWorklistItemList;
					vmain.itemCount = vmain.searchWorklistItemList.length;
					//业务数据获取完毕，并已插入当前页面DOM；
					//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
					mui.plusReady(function() {
						//关闭等待框
						plus.nativeUI.closeWaiting();
						//显示当前页面
						mui.currentWebview.show();
					});
				}

			}, 'get');
		}
	}
});
