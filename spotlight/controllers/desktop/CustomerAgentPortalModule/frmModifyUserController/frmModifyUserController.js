define({ 

  //Type your controller code here 

  willUpdateUI : function(viewModel){
    this.updateLeftMenu(viewModel);
  },
  retailerList:[],
  selecteduser:[],
  modifyUser:[],
     selectedRole:[],
    selectedStatus:[],
  preshow: function(){

    var self = this;

    // Null Values
    this.onPostShow();
    this.view.flxContent.setVisibility(true);
    this.view.flxSelectUserMain.setVisibility(true);
    this.view.flxGeneralDetails.setVisibility(false);
    self.view.txtSearchUser.text="";
    this.view.flxUserCreated.setVisibility(false);
    this.view.flxPopOnReset.setVisibility(false);
    this.view.flxSuccesspopOnReset.setVisibility(false);

    this.view.txtBoxUsername.text = "";
    this.view.txtBoxEmail.text = "";
    this.view.txtBoxMobileNumber.text = "";
    this.view.lblUserIDMap.text = "";
    this.view.listPartnerList.selectedKey = "";
    this.view.lblStatusList.selectedKey ="";
    
    this.view.txtBoxUsername.onEndEditing = function() {
      self.validateFields();
    };
    this.view.txtBoxMobileNumber.onEndEditing = function() {
      self.validateFields();
    };
    this.view.txtBoxEmail.onEndEditing = function() {
      self.validateFields();
    };
    
    this.view.flxCloseIcon.onClick=function(){
      self.preshow();
    };
    this.view.btnContinue.onClick=function(){
      self.preshow();
    };
    this.view.btnYesOnReset.onClick=function(){
     // self.view.flxLoading.setVisibility(true);
    
    };
    this.view.btnNoOnReset.onClick=function(){
      self.view.flxPopOnReset.setVisibility(false);
    };
    this.view.btnYesOnSuccess.onClick=function(){
      self.preshow();
    };
    this.view.txtSearchUser.onKeyUp = function(eventId) {
      let searchText = eventId.text;
      if(searchText.length > 1) {
        let filteredData = retailerList.filter(
          data => (data.UserId).includes(searchText));
        kony.print(filteredData);
        self.view.SegUserLIst.setData(filteredData);
        if(filteredData.length === 0) {
          self.view.flxUserCreated.isVisible = true;
          self.view.forceLayout();
        }
      } else {
        self.view.SegUserLIst.setData(retailerList);
      }
    };
    this.view.SegUserLIst.onRowClick = function(eventId) {
      kony.print(eventId.selectedRowItems[0]);
      selecteduser = eventId.selectedRowItems[0];

      self.mapUserDetails(selecteduser);
    };
    this.view.btnCreateUser.onClick=function(){
      self.btnCreateUser();
    };
  },
  btnCreateUser: function(){
    var self = this;
    var statusAt = "";
    self.view.flxLoading.setVisibility(true);
    try{
    
        if(this.view.lblStatusList.selectedKey==="Active"){
           statusAt = "SID_ACTIVE";
        }else{
           statusAt = "SID_INACTIVE";
        }
      
      let serviceName = "MurabahaJavaServiceAdmin";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "ModifyRetailer";
      let data= {
     //   "userid":this.view.lblUserIDMap.text , 
     //   "status":statusAt, 
     //   "username":this.view.txtBoxUsername.text , 
     //   "phoneno": this.view.txtBoxMobileNumber.text, 
     //   "emailid":  this.view.txtBoxEmail.text , 
     //   "role": this.view.listPartnerList.selectedKey 
        
        "userid":this.view.lblUserIDMap.text, 
        "status":statusAt, 
        "username":this.view.txtBoxUsername.text , 
        "phonenumber":this.view.txtBoxMobileNumber.text, 
        "email":this.view.txtBoxEmail.text ,
        "role":this.view.listPartnerList.selectedKey ,
      };
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, self.modifySuccessCallBack, self.modifyFailureCallBack);
    }catch(exception ){
      self.view.flxLoading.setVisibility(false);
      alert("exception occured "+exception);

    } 
    
  },
  
  modifySuccessCallBack: function(response){
    var self = this;
    self.view.flxLoading.setVisibility(false);
    self.view.flxSuccesspopOnReset.setVisibility(true);
    self.view.forceLayout();
  },
  modifyFailureCallBack: function(err){
    self.view.flxLoading.setVisibility(false);
    kony.print(err);
  },
  
  resetSuccessCallBack: function(response){
    var self =this;
    self.view.flxLoading.setVisibility(false);
    self.view.flxSuccesspopOnReset.setVisibility(true);
    self.view.flxPopOnReset.setVisibility(false);
    self.view.forceLayout();
  },
  resetFailureCallBack: function(err){
    var self=this;
    self.view.flxLoading.setVisibility(false);
    kony.print(err);
  },
  randomString: function(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '!@#$%';
    var result = '';
    for (var i = length; i > 0; --i) {
      result += mask[Math.round(Math.random() * (mask.length - 1))];
    }
    return result;
  },

  mapUserDetails: function(data) {
    this.view.flxGeneralDetails.isVisible = true;
    this.view.flxSelectUserMain.isVisible = false;
    this.view.txtBoxUsername.text = data.UserName;
    this.view.txtBoxEmail.text = data.EmailId;
    this.view.txtBoxMobileNumber.text = data.PhoneNo;
    this.view.lblUserIDMap.text = data.UserId;
    this.view.listPartnerList.selectedKey = data.Role;
    this.view.lblStatusList.selectedKey = (data.Status === "SID_ACTIVE")?"Active":"Inactive";
    selectedRole = this.view.listPartnerList.selectedKey;
    selectedStatus = this.view.lblStatusList.selectedKey;
    
    if (data.Role === "Admin") {
      this.view.listPartnerList.setEnabled(false);
      this.view.listPartnerList.masterData = [
        ["Admin", "Admin"]
      ];
      this.view.listPartnerList.selectedKeyValue = data.Role;
    } else {
      this.view.listPartnerList.setEnabled(true);
      this.view.listPartnerList.masterData = [
        ["Sale Representative", "Sale Representative"],
        ["Sale Person", "Sale Person"],
      ];
      this.view.listPartnerList.selectedKey = data.Role;
    }
    
  },
  onPostShow: function() {
    var self = this;
    try{
      this.view.flxLoading.setVisibility(true);
      let serviceName = "RetailerDBServiceAdmin";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "dbxdb_retailer_get";
      let data= {};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.getRetailerSuccessCB, this.getRetailerFailureCB);
    }catch(exception ){
      alert("exception occured "+exception);
    } 
  },
  getRetailerSuccessCB: function(response){
    this.view.flxLoading.setVisibility(false);

    this.view.flxLoading.setVisibility(false);
    this.view.flxLoading.setVisibility(false);
    this.view.SegUserLIst.widgetDataMap = {
      lblOptionValue: "UserId"
    };
    this.view.SegUserLIst.setData(response.retailer);
    retailerList = response.retailer;
  },
  getRetailerFailureCB: function(){

  },

  validateFields: function() {
    var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    //var phoneformat = /[0-9]/g;
    var phoneformat = /^\d+$/;
    let username = this.view.txtBoxUsername.text;
    let phone = this.view.txtBoxMobileNumber.text;
    let email = this.view.txtBoxEmail.text;
    let userid = this.view.lblUserIDMap.text;

    if(username.length >= 3 && phone.length >= 8 && phone.match(phoneformat)
       && email.match(mailformat) && userid.length >= 3 
       && selectedRole !== "" && selectedStatus !== "") {
    //  modifyUser.userid = userid.trim();
    //  modifyUser.phoneno = phone.trim();
    //  modifyUser.emailid = email.trim();
    //  modifyUser.username = username.trim();
    //  modifyUser.role = selectedRole;
    //  modifyUser.status = selectedStatus;
      //TODO : Change based on login
     // modifyUser.retailerid = ServiceResponse.USER_ATTRIBUTES.retailerid;
     // modifyUser.retailername = ServiceResponse.USER_ATTRIBUTES.retailername;
    //  this.view.btnModifyUser.setEnabled(true);
    //  this.view.btnModifyUser.skin = "sknbtn2c3d73Rounded18px";
      this.view.btnCreateUser.setEnabled(true);
      this.view.btnCreateUser.skin = "sknBtn003E75LatoRegular13pxFFFFFFRad20px";
    } else {
      this.view.btnCreateUser.setEnabled(false);
      this.view.btnCreateUser.skin = "sknbtn898A8DRounded";
    
    }
  },

});