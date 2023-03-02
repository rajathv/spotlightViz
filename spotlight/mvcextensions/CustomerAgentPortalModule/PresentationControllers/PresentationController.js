define(['ErrorInterceptor', 'ErrorIsNetworkDown'], function (ErrorInterceptor, isNetworkDown){
  /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */
  function CustomerAgent_PresentationController() {
    kony.mvc.Presentation.BasePresenter.call(this);
    this.allDocuments = null;
    this.otpverify = null;
  }

  inheritsFrom(CustomerAgent_PresentationController, kony.mvc.Presentation.BasePresenter);

  CustomerAgent_PresentationController.prototype.showCustomerDetail = function () {
    this.showCustomerDetailForm();
  };
  
   CustomerAgent_PresentationController.prototype.showCustomerDetailForm = function () {
    var self = this;
    let context = {context: 'showLoadingScreen'};
    kony.print("Context = " + context);
    this.presentUserInterface('frmCustomerDetail',context);
  };

  CustomerAgent_PresentationController.prototype.showCustomerRetailForm = function () {
    var self = this;
    let context = {context: 'showLoadingScreen'};
    kony.print("Context = " + context);
    this.presentUserInterface('frmCreateRetailer',context);
  };
    CustomerAgent_PresentationController.prototype.showResetUserPassword= function () {
    var self = this;
    let context = {context: 'showLoadingScreen'};
    kony.print("Context = " + context);
    this.presentUserInterface('frmResetUser',context);
  };
  //frmModify
      CustomerAgent_PresentationController.prototype.showModifyUser= function () {
    var self = this;
    let context = {context: 'showLoadingScreen'};
    kony.print("Context = " + context);
    this.presentUserInterface('frmModifyUser',context);
  };
  
  CustomerAgent_PresentationController.prototype.showCustomerAgent = function () {
    this.loadAgentManagement();
  };

  CustomerAgent_PresentationController.prototype.loadAgentManagement = function () {
    var self = this;
    let context = {context: 'showLoadingScreen'};
    kony.print("Context = " + context);
    this.presentUserInterface('frmCSAPortal',context);
  };

  CustomerAgent_PresentationController.prototype.showEmdhaSign = function () {

    var self = this;
    let context = {context: 'showLoadingScreen'};
    kony.adminConsole.utils.showProgressBar(this.view);
    var customerAgentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CustomerAgentPortalModule");
    customerAgentModule.presentationController.callNonSignedDoc(
      function(response){
        kony.print("Response Success= " + response.records.length);
        self.presentUserInterface('frmCounterSign', context);
        self.allDocuments = response.records;
      }, 
      function(error){
        self.presentUserInterface('frmCounterSign', context);
      });
  };

  CustomerAgent_PresentationController.prototype.callNonSignedDoc = function(dataSuccessCB,dataFailureCB) {
    var self=this;
    var customerAgentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CustomerAgentPortalManager");

    customerAgentModule.businessController.callNonSignedDoc(
      function onSuccess(response) {
        dataSuccessCB(response);
      },
      function onError(response) {
        dataFailureCB(response);
      });

  };


  CustomerAgent_PresentationController.prototype.getAllDocuments = function () {
    return this.allDocuments;
  };


  CustomerAgent_PresentationController.prototype.sendOTPReq = function(dataSuccessCB,dataFailureCB) {
    var self=this;
    var customerAgentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CustomerAgentPortalManager");

    let userID = kony.mvc.MDAApplication.getSharedInstance().appContext.userID;
    kony.print("OTP userID= " + userID);
    customerAgentModule.businessController.sendOTPReq(
      userID,
      function onSuccess(response) {
        kony.print("Response Success= " + JSON.stringify(response));
        dataSuccessCB(response);
        this.otpverify
      },
      function onError(response) {
        kony.print("Response onError= " + JSON.stringify(response));
        dataFailureCB(response);
      });


  };


  CustomerAgent_PresentationController.prototype.signedIbanContracts = function(appLst, docList,dataSuccessCB,dataFailureCB) {
    var self=this;


    kony.adminConsole.utils.showProgressBar(this.view);

    var customerAgentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CustomerAgentPortalManager");

    let userID = kony.mvc.MDAApplication.getSharedInstance().appContext.userID;
    kony.print(" userID= " + userID);
    customerAgentModule.businessController.signedIbanContracts(
      appLst,
      docList,
      userID,
      function onSuccess(response) {

        kony.adminConsole.utils.hideProgressBar(this.view);
        kony.print("signedIbanContracts Success= " + JSON.stringify(response));
        dataSuccessCB(response);
        this.otpverify
      },
      function onError(response) {

        kony.adminConsole.utils.hideProgressBar(this.view);
        kony.print("signedIbanContracts onError= " + JSON.stringify(response));
        dataFailureCB(response);
      });


  };


  CustomerAgent_PresentationController.prototype.recallNonEmdhaSign = function(successCB, errorCB) {  
    var self=this;
    var customerAgentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CustomerAgentPortalManager");

    customerAgentModule.businessController.callNonSignedDoc(
      function onSuccess(response) {
        kony.print("Response Success= " + response.records.length);
        self.allDocuments = response.records;
        successCB(response.records);
      },
      function onError(response) {
        errorCB(response);
      });

  };





  CustomerAgent_PresentationController.prototype.initializePresentationController = function() {
  };








  return CustomerAgent_PresentationController;
});