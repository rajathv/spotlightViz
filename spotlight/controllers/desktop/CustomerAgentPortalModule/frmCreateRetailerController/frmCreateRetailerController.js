define({ 

  //Type your controller code here 

  willUpdateUI : function(viewModel){
    this.updateLeftMenu(viewModel);
  },

  preshow:function(){

    var self = this;

    // Null Values

    this.view.txtBoxUsername.text = "";
    this.view.listPartnerList.selectedKey = "0";
    this.view.txtBoxMobilNumber.text = "";
    this.view.txtBoxCountryCodeMobile.text = "+966";
    this.view.txtBoxEmail.text = "";
	this.view.txtBoxCountryCodeMobile.setEnabled(false);
    // visibilitys 

    this.view.lblUsenameError.setVisibility(false);
    this.view.lblPartnerError.setVisibility(false);
    this.view.lblMobileError.setVisibility(false);
    this.view.lblEmailError.setVisibility(false);
	this.view.flxUserCreated.isVisible = false;
    // btn On Click 

    this.view.btnCreateUser.onClick=function(){
      self.btnCreateUser();
    };

    //onKeyup

    this.view.txtBoxUsername.onKeyUp=function(){
      self.view.lblUsenameError.setVisibility(false);
    };
    this.view.txtBoxMobilNumber.onKeyUp=function(){
      self.view.lblMobileError.setVisibility(false);
    };
    this.view.txtBoxCountryCodeMobile.onKeyUp=function(){
      self.view.lblMobileError.setVisibility(false);
    };
    this.view.txtBoxEmail.onKeyUp=function(){
      self.view.lblEmailError.setVisibility(false);
    };
    this.view.btnContinue.onClick = function() {
      self.view.flxUserCreated.isVisible = false;
    };
  },
  btnCreateUser: function(){
	var self = this;
    var username = this.view.txtBoxUsername.text;
    var listPartner = this.view.listPartnerList.selectedKey;
    var retailerSelection = this.view.listPartnerList.selectedKeyValue;
    var mobilenum =  this.view.txtBoxMobilNumber.text ;
    var mobileCode = this.view.txtBoxCountryCodeMobile.text ;
    var email = this.view.txtBoxEmail.text;

    if(username===""){
      this.view.lblUsenameError.text="Please Enter the Username";
      this.view.lblUsenameError.setVisibility(true);
    }else {
      this.view.lblUsenameError.setVisibility(false);
    }
    if(listPartner==="0"){
      this.view.lblPartnerError.text="Please selet the retail Partner";
      this.view.lblPartnerError.setVisibility(true);
    }else{
      this.view.lblPartnerError.setVisibility(false);
    }
    if(mobilenum===""){
      this.view.lblMobileError.text="Please Enter the Mobile Number";
      this.view.lblMobileError.setVisibility(true);
    }else{
      this.view.lblMobileError.setVisibility(false);
    }
    if(mobileCode===""){
      this.view.lblMobileError.text="Please Enter the Mobile Code";
      this.view.lblMobileError.setVisibility(true);
    }
    if(email===""){
      this.view.lblEmailError.text="Please Enter the Email";
      this.view.lblEmailError.setVisibility(true);
    }else{
      this.view.lblEmailError.setVisibility(false);
    }
    if(username!==""&&listPartner!==""&&mobilenum!==""&&email!==""){

      // Navigate or service call
      self.view.lblUsenameError.setVisibility(false);
      self.view.lblPartnerError.setVisibility(false);
      self.view.lblMobileError.setVisibility(false);
      self.view.lblEmailError.setVisibility(false);
      var retailerObj = {};
      retailerObj.userid = "";
      retailerObj.role = "Admin";
      retailerObj.phonenumber = mobilenum;
      retailerObj.email = email;
      retailerObj.retailerid = listPartner;
      retailerObj.retailername = retailerSelection[1];
      retailerObj.status = "SID_CUS_NEW";
      retailerObj.username = username;
	  self.createRetailerAdmin(retailerObj);	
    }

  },
  onPostShow: function() {
   var self = this;
    try{
      this.view.flxLoading.setVisibility(true);
      let serviceName = "MurabahaJSONService";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "GetRetailers";
      let data= {};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.getRetailerSuccessCB, this.getRetailerFailureCB);
    }catch(exception ){
      alert("searchThorughDateRange exception occured "+exception);
    } 
  },
  getRetailerSuccessCB: function(response) {
    try {
      this.view.flxLoading.setVisibility(false);
      kony.print(response);
      var retailerList = response.body;
      var masterData = [];
      masterData.push(['0','Please select retailer']);
      for(var retailer = 0, retailerLen = retailerList.length; retailer < retailerLen ;retailer++) {
        var data = [];
        data.push(retailerList[retailer].retailerId);
        data.push(retailerList[retailer].retailerName);
        masterData.push(data);
      }
      this.view.listPartnerList.masterData = masterData;
    } catch(ex) {
      this.view.flxLoading.setVisibility(false);
      kony.print("Exception in getRetailerSuccessCB :: "+ex);
    }    
  },
  getRetailerFailureCB: function(error) {
    this.view.flxLoading.setVisibility(false);
    kony.print(error);
  },
  createRetailerAdmin: function(data) {
    try {
      this.view.flxLoading.setVisibility(true);
      let serviceName = "MurabahaJavaServiceAdmin";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "CreateRetailer";
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.createRetailerSuccessCB, this.createRetailerErrorCB);
    } catch(ex) {
      this.view.flxLoading.setVisibility(false);
      kony.print("Exception in createRetailerAdmin :: "+ex);
    }
  },
  createRetailerSuccessCB: function(response) {
    this.view.flxUserCreated.isVisible = true;
    this.view.forceLayout();
    this.view.flxLoading.setVisibility(false);
    this.view.txtBoxUsername.text = "";
    this.view.listPartnerList.selectedKey = "0";
    this.view.txtBoxMobilNumber.text = "";
    this.view.txtBoxCountryCodeMobile.text = "+966";
    this.view.txtBoxEmail.text = "";
	this.view.txtBoxCountryCodeMobile.setEnabled(false);
    kony.print(response);
  },
  createRetailerErrorCB: function(error) {
   	this.view.flxLoading.setVisibility(false);
    kony.print(error);
  }
});