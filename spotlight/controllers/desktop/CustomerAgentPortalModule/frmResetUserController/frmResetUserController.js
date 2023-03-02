define({ 

  //Type your controller code here 

  willUpdateUI : function(viewModel){
    this.updateLeftMenu(viewModel);
  },
  retailerList:[],
  selecteduser:[],

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
    this.view.flxCloseIcon.onClick=function(){
      self.preshow();
    };
    this.view.btnContinue.onClick=function(){
      self.preshow();
    };
    this.view.btnYesOnReset.onClick=function(){
      self.view.flxLoading.setVisibility(true);
      try{
        let password = self.randomString(6, "aA!#");
        kony.print("Random password :: "+password);
        let serviceName = "MurabahaJavaServiceAdmin";
        let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
        let operationName =  "ResendPassword";
        let data= {
          "userid":self.view.lblUserIDMap.text,
          "resetpassword":password.trim()
        };
        let headers= {};
        integrationObj.invokeOperation(operationName, headers, data, self.resetSuccessCallBack, self.resetFailureCallBack);
      }catch(exception ){
        self.view.flxLoading.setVisibility(false);
        alert("exception occured "+exception);

      } 
    };
    this.view.btnNoOnReset.onClick=function(){
      self.view.flxPopOnReset.setVisibility(false);
    };
    this.view.btnYesOnSuccess.onClick=function(){
      self.preshow();
    };
    this.view.txtSearchUser.onTextChange = function(eventId) {
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
    this.view.flxPopOnReset.setVisibility(true);
    this.view.flxSuccesspopOnReset.setVisibility(false);
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
    this.view.lblUsenameMap.text = data.UserName;
    this.view.lblEmailID.text = data.EmailId;
    this.view.lblMobie.text = data.PhoneNo;
    this.view.lblUserIDMap.text = data.UserId;
    this.view.lblRoles.text = data.Role;
    this.view.lblStatusMap.text = (data.Status === "SID_ACTIVE")?"Active":"Inactive";

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

});