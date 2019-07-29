mui.init({
	swipeBack: true //启用右滑关闭功能
});
var newSigningTypePicker = new mui.PopPicker();
var vm = new Vue({
	el: "#divMuiContent",
	data: {
		newSigningTypeList: [],
		newSigningType: ''
	},
	created: function() {
		this.newSigningTypeList = newSigningTypeData;
		this.bindNewSigningType();
	},
	methods: {
		bindNewSigningType: function() { //绑定新签约类型
			newSigningTypePicker.setData(this.newSigningTypeList);
		},
		onNewSigningType: function() { //点击新合约类型选择器
			newSigningTypePicker.show(function(items) {
				console.log(this);
				vm.newSigningType = items[0].text;
			});
		},
		getUserInfoByDingUserId: function() {
			var dingUserId = sessionStorage.getItem("userid");
			MuiAjax('')
		}
	}
});
