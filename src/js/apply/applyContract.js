var PROCESSNAME = "上海职员劳务合同审批";

mui.init({
	swipeBack: true //启用右滑关闭功能
});
//创建选择器
var newCompanyNamePicker = new mui.PopPicker();
var newContractNamePicker = new mui.PopPicker();
var newContractTypePicker = new mui.PopPicker();
//创建日期选择器
var newStartDatePicker = new mui.DtPicker({
	"type": "month"
});
var newEndDatePicker = new mui.DtPicker({
	"type": "month"
});
var vm = new Vue({
	el: "#divMuiContent",
	data: {
		cchrUserInfo: {}, //员工信息
		values: {}, // 配置的键值对 （填充选择器）
		categorys: "合同类型,劳动合同名称,劳动合同类型",
		formData: { //表单
			dingUserId: '',
			empId: '',
			newContract: {
				newCompanyName: '', //新公司名称
				newContractName: '', //新合同名称
				newContractType: '', //新合同类型
				contractStartData: '', //合同开始时间
				contractEndData: '' //合同结束时间
			}
		}
	},
	created: function() {
		this.getUserInfoByDingUserId();
		this.getNameValueList();
		//this.bindNewSigningType();
	},
	methods: {
		bingSelector: function(obj) { //绑定选择器，填充值
			newCompanyNamePicker.setData(obj.合同类型);
			newContractNamePicker.setData(obj.劳动合同名称);
			newContractTypePicker.setData(obj.劳动合同类型);
		},
		getUserInfoByDingUserId: function() { //获取人员信息
			var dingUserId = sessionStorage.getItem("userid");
			MuiAjax('login/GetEmployeeInfo?DingUserId=' + dingUserId, null, function(data) {
				if (data.IsSuccess) {
					vm.cchrUserInfo = data.Result;
				} else {
					muitoast(data.Message);
				}

			}, 'get');
		},
		getNameValueList: function() { //获取所有选择器的值
			GetNameValueList(this.categorys, this.bingSelector);
		},
		clickContractName: function() { //点击合同名称
			newContractNamePicker.show(function(items) {
				vm.formData.newContract.newContractName = items[0];
			});
		},
		clickContractType: function() { //点击合同类型
			newContractTypePicker.show(function(items) {
				vm.formData.newContract.newContractType = items[0];
			});
		},
		clickCompanyName: function() { //点击所属公司
			newCompanyNamePicker.show(function(items) {
				vm.formData.newContract.newCompanyName = items[0];
			});
		},
		clickContractStartData: function() { //点击开始时间
			newStartDatePicker.show(function(selectItems) {
				vm.formData.newContract.contractStartData = selectItems.text;
			})
		},
		clickContractEndData: function() { //点击开始时间
			newEndDatePicker.show(function(selectItems) {
				vm.formData.newContract.contractEndData = selectItems.text;
			})
		},
		clickSave: function(event) {
			var IsSave = this.checkFormData();
			if (IsSave) {
				mui(event.target).button('loading'); //切换为loading状态
				var employeeContractApply = {
					EmpID: this.cchrUserInfo.EmpID,
					EmpName: this.cchrUserInfo.EmpName,
					EmpCode: this.cchrUserInfo.EmpNo,
					JobLevel: this.cchrUserInfo.JobLevel,
					CompanyName: this.formData.newContract.newCompanyName,
					ContractName: this.formData.newContract.newContractName,
					ContractType: this.formData.newContract.newContractType,
					StartDate: this.formData.newContract.contractStartData,
					EndDate: this.formData.newContract.contractEndData,
				};
				MuiAjax('EmpContract/AddEmpContractApply', employeeContractApply, function(data) {
					muitoast("保存成功");
					mui(event.target).button('reset'); //切换为reset状态(即重置为原始的button)

				});
			}
		},
		clickSubmit: function(event) {
			var IsSave = this.checkFormData();
			mui(event.target).button('loading'); //切换为loading状态
			if (IsSave) {
				var EmpContractApplyRequest = {
					WorkflowTypeName: PROCESSNAME,
					employeeContractApply: { //请求的员工合同信息
						EmpID: this.cchrUserInfo.EmpID,
						EmpName: this.cchrUserInfo.EmpName,
						EmpCode: this.cchrUserInfo.EmpNo,
						JobLevel: this.cchrUserInfo.JobLevel,
						CompanyName: this.formData.newContract.newCompanyName,
						ContractName: this.formData.newContract.newContractName,
						ContractType: this.formData.newContract.newContractType,
						StartDate: this.formData.newContract.contractStartData,
						EndDate: this.formData.newContract.contractEndData,
					},
					dicDataFields: {
						BizDataID: '',
						Originator: this.cchrUserInfo.DomainAccount,
						OriginatorMail: this.cchrUserInfo.DomainAccount + "@centaline.com.cn",
						OriginatorDeptName: this.cchrUserInfo.DeptFullName,
						JobLevel: this.cchrUserInfo.JobLevel,
						BizEmpName: this.cchrUserInfo.EmpName,
						BizEmpID: this.cchrUserInfo.EmpID,
						BizPositionID: this.cchrUserInfo.PositionID,
						BizPositionName: this.cchrUserInfo.PositionName,
						BizDeptID: this.cchrUserInfo.DeptID,
						BizDeptName: this.cchrUserInfo.DeptName,
						DeptKind: "0"
					},
					ApplyUserInfo: {
						ApplyUserName: this.cchrUserInfo.EmpName,
						ApplyUserId: this.cchrUserInfo.DomainAccount,
						ApplyDeptName: this.cchrUserInfo.DeptName
					}
				}

				MuiAjax('empcontract/startEmpContractApply', EmpContractApplyRequest, function(data) {
					mui(event.target).button('reset'); //切换为reset状态(即重置为原始的button)
					muitoast("流程提交成功");
					mui.openWindow({
						url: 'main.html',
						show: {
							autoShow: false
						}
					});
				});

			};

		},
		checkFormData: function() { //保存，提交前校验
			if (this.formData.newContract.newContractType == '') {
				mui.toast('请选择新合同类型', {
					duration: 'long',
					type: 'div'
				})
				return false;
			} else if (this.formData.newContract.newContractName == '') {
				mui.toast('请选择新合同名称', {
					duration: 'long',
					type: 'div'
				})
				return false;
			} else if (this.formData.newContract.newCompanyName == '') {
				mui.toast('请选择新所属公司', {
					duration: 'long',
					type: 'div'
				})
				return false;
			} else if (this.formData.newContract.contractStartData == '') {
				mui.toast('请选择合同开始时间', {
					duration: 'long',
					type: 'div'
				})
				return false;
			} else if (this.formData.newContract.contractEndData == '') {
				mui.toast('请选择合同结束时间', {
					duration: 'long',
					type: 'div'
				});
				return false;
			}
			return true;
		}


	}
});
