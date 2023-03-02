define(['AdminConsoleCommonUtilities'],function(adminConsoleUtils) {

  function setCSRAssistStatus(status, formInstance, self) {
    if(formInstance.view.id === "frmDepositsDashboard"){
      self.view.flxCSRAssist.setVisibility(false);
    } else{
      self.view.flxCSRAssist.setVisibility(true);
    }
    
    if (status === "true") {
      self.view.flxCSRAssist.skin = "sknFlxBg003E75Br1pxRd20px";
      self.view.flxCSRAssist.hoverSkin = "sknFlxBg005198Br1pxRd20pxHov";
      self.view.lblCSRAssist.skin = "sknlblCSRAssist";
      self.view.fonticonCSRAssist.text = "\ue93b";
      self.view.fonticonCSRAssist.skin = "sknIcon13pxWhite";
      self.view.flxCSRAssist.onClick = function() {
        formInstance.view.CSRAssist.openCSRAssistWindow(formInstance, "OLB");
      }
      self.view.flxCSRAssist.onHover = function () { };
    } else {
      self.view.flxCSRAssist.skin = "sknflxCSRAssistGray";
      self.view.fonticonCSRAssist.text = "\ue93b";
      self.view.flxCSRAssist.hoverSkin = "sknflxCSRAssistGray";
      self.view.flxCSRAssist.onClick = function () { };
      self.view.flxCSRAssist.onHover = function (widget, context) {
        if (context.eventType === constants.ONHOVER_MOUSE_ENTER) {
          if(kony.application.getCurrentForm().flxGeneralInfoWrapper.generalInfoHeader.flxNotification.isVisible===true)
            kony.application.getCurrentForm().CSRAssistToolTip.top="98px";
          kony.application.getCurrentForm().CSRAssistToolTip.setVisibility(true);
          kony.application.getCurrentForm().forceLayout();
        } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
          kony.application.getCurrentForm().CSRAssistToolTip.setVisibility(false);
          kony.application.getCurrentForm().forceLayout();
        }
      };
    }
  }

  function handleLockedUserStatus(customerType,formInstance){
    var self = this;
    self.view.fonticonActive.setVisibility(true);
    self.view.lblStatus.setVisibility(true);
    self.view.lblStatus.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Locked");
    self.view.lblStatus.skin = "sknlblCustMngLocked";
    self.view.fonticonActive.text = "";
    self.view.fonticonActive.skin = "sknfontIconLock";
    formInstance.view.flxSelectOptions.flxUpgrade.setVisibility(false);
    formInstance.view.flxSelectOptions.lblOption1.text = kony.i18n.getLocalizedString("i18n.permission.Suspend");
    formInstance.view.flxSelectOptions.fonticonEdit.text = "";
    self.view.flxUnlock.setVisibility(true);
    setCSRAssistStatus("false",formInstance, self);
    hideUpgradeOption(formInstance);
  }

  function handleSuspendedUserStatus(customerType,formInstance){
    var self = this;
    self.view.flxOptions.setVisibility(true);
    self.view.fonticonActive.setVisibility(true);
    self.view.lblStatus.setVisibility(true);
    self.view.lblStatus.text = kony.i18n.getLocalizedString("i18n.frmCustomers.Suspended");
    self.view.lblStatus.skin = "sknlblLato5bc06cBold14px";
    self.view.fonticonActive.text = "";
    self.view.fonticonActive.skin = "sknFontIconSuspend";
    formInstance.view.flxSelectOptions.flxSuspend.setVisibility(true);
    formInstance.view.flxSelectOptions.lblOption1.text = kony.i18n.getLocalizedString("i18n.permission.Activate");
    formInstance.view.flxSelectOptions.fonticonEdit.text = "";
    enableUpgradeOption(formInstance);
    formInstance.view.flxSelectOptions.isVisible  = false;
    self.view.flxUnlock.setVisibility(false);
    setCSRAssistStatus("false",formInstance, self);
    hideUpgradeOption(formInstance);
  }

  function handleNewUserStatus(customerType,formInstance){
    var self = this;
    self.view.flxOptions.setVisibility(false);
    self.view.fonticonActive.setVisibility(true);
    self.view.lblStatus.setVisibility(true);
    self.view.lblStatus.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.New");
    self.view.lblStatus.skin = "sknlblLato5bc06cBold14px";
    self.view.fonticonActive.text = "";
    self.view.fonticonActive.skin = "sknIcon039dffBlue12px";
    formInstance.view.flxSelectOptions.flxSuspend.setVisibility(true);
    formInstance.view.flxSelectOptions.lblOption1.text = kony.i18n.getLocalizedString("i18n.permission.Suspend");
     formInstance.view.flxSelectOptions.fonticonEdit.text = "";
    formInstance.view.flxSelectOptions.isVisible  = false;
    self.view.flxUnlock.setVisibility(false);
    hideUpgradeOption(formInstance);
    self.view.flxCSRAssist.setVisibility(false);
  }
  function handleActiveUserStatus(customerType, isAssistConsented,formInstance){
    var self = this;
    self.view.flxOptions.setVisibility(true);
    self.view.fonticonActive.setVisibility(true);
    self.view.lblStatus.setVisibility(true);
	self.view.flxCSRAssistNewApp.setVisibility(true);
    self.view.fontIconCSRAssistNewApp.text = "\ue93b";
    self.view.lblStatus.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Active");
    self.view.lblStatus.skin = "sknlblLato5bc06cBold14px";
    self.view.fonticonActive.text = "";
    self.view.fonticonActive.skin = "sknFontIconActivate";
    formInstance.view.flxSelectOptions.flxSuspend.setVisibility(true);
    formInstance.view.flxSelectOptions.isVisible  = false;
    formInstance.view.flxSelectOptions.lblOption1.text = kony.i18n.getLocalizedString("i18n.permission.Suspend");
    formInstance.view.flxSelectOptions.fonticonEdit.text = "";
    enableUpgradeOption(formInstance);
    self.view.flxUnlock.setVisibility(false);
    if(formInstance.presenter.getCurrentCustomerDetails().isCustomerAccessiable === false){
      //Disable CSR assist and upgrade option if the user does not have access to the customer
      setCSRAssistStatus("false",formInstance, self);
      hideUpgradeOption(formInstance);
    }else{
      setCSRAssistStatus(isAssistConsented,formInstance, self);
    }
    if (customerType && customerType.indexOf(adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.RETAIL_TYPE) >= 0) { 
    } else {
      hideUpgradeOption(formInstance);
    }

  }

  function enableUpgradeOption(formInstance){
    //hiding upgrade to bussinss user as latest changes not implemented
    hideUpgradeOption(formInstance);
    //formInstance.view.flxSelectOptions.flxUpgrade.setVisibility(true);
    //formInstance.view.flxSelectOptions.width="220px";
  }

  function hideUpgradeOption(formInstance){
    formInstance.view.flxSelectOptions.width="180px";
    formInstance.view.flxSelectOptions.flxUpgrade.setVisibility(false);
  }
  function setCustomerNameandTag(customer) {
    if(customer.Name.trim().length !== 0){
      if(customer.hasOwnProperty('Salutation') && customer.Salutation.length!==0){
        this.view.lblCustomerName.text = customer.Salutation + " " + customer.Name;
      } else {
        this.view.lblCustomerName.text = customer.Name;
      }
    }
    else {
      this.view.lblCustomerName.text = "Not Available";
    }
    //this.view.lblCustomerName.text = customer.Name.trim().length!==0?customer.Name:"Not Available";
    this.view.flxRetailTag.setVisibility(false);
    this.view.flxSmallBusinessTag.setVisibility(false);
    this.view.flxMicroBusinessTag.setVisibility(false);
    this.view.flxApplicantTag.setVisibility(false);
    this.view.flxMicroBusinessTag.left = "0dp";
    this.view.flxWealthTag.left = "0dp";

    if (customer.CustomerType_id === adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.BUSINESS_TYPE) {
      this.view.flxMicroBusinessTag.setVisibility(true);
    } else if (customer.CustomerType_id === adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.PROSPECT_TYPE) {
      this.view.flxApplicantTag.setVisibility(true);
    } else if(customer.CustomerType_id.indexOf(adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.BUSINESS_TYPE) >= 0 &&
             customer.CustomerType_id.indexOf(adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.RETAIL_TYPE) >= 0){
      this.view.flxRetailTag.setVisibility(true);
      this.view.flxMicroBusinessTag.setVisibility(true);
      this.view.flxMicroBusinessTag.left = "10dp";
    } else if(customer.CustomerType_id === adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.WEALTH_TYPE){
      this.view.flxWealthTag.setVisibility(true);
    }else if(customer.CustomerType_id.indexOf(adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.WEALTH_TYPE) >= 0 &&
             customer.CustomerType_id.indexOf(adminConsoleUtils.AdminConsoleCommonUtils.constantConfig.RETAIL_TYPE) >= 0){
      this.view.flxRetailTag.setVisibility(true);
      this.view.flxWealthTag.setVisibility(true);
      this.view.flxWealthTag.left = "10dp";
    } else {
      this.view.flxRetailTag.setVisibility(true);
    }
  }

  function setRiskStatus(CustomerFlag){
    this.view.fonticonDefaulter.setVisibility(false);
    this.view.lblDefaulter.setVisibility(false);
    this.view.fonticonFraud.setVisibility(false);
    this.view.lblFraud.setVisibility(false);
    this.view.fonticonRisk.setVisibility(false);
    this.view.lblRisk.setVisibility(false);

    if (CustomerFlag) {
      this.view.flxRiskStatus.setVisibility(true);
      var customerFlags = CustomerFlag.split(",");
      for (var i = 0; i < customerFlags.length; i++) {
        if (customerFlags[i].trim().toUpperCase() === kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Defaulter").toUpperCase()) {
          this.view.fonticonDefaulter.setVisibility(true);
          this.view.lblDefaulter.setVisibility(true);
        }
        if (customerFlags[i].trim().toUpperCase() === kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Fraud_Detected").toUpperCase()) {
          this.view.fonticonFraud.setVisibility(true);
          this.view.lblFraud.setVisibility(true);
        }
        if (customerFlags[i].trim().toUpperCase() === kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.High_Risk").toUpperCase()) {
          this.view.fonticonRisk.setVisibility(true);
          this.view.lblRisk.setVisibility(true);
        }
      }
    } else {
      this.view.flxRiskStatus.setVisibility(false);
    }
  }

  function setDefaultHeaderData(formInstance){
    formInstance.view.CSRAssist.setVisibility(false);
    formInstance.view.CSRAssistToolTip.setVisibility(false);
    formInstance.view.CSRAssistToolTip.zIndex = 100;
    formInstance.view.flxSelectOptions.isVisible  = false;
    initializeFlowActions(formInstance, this);
  }

  function initializeFlowActions(formInstance, scopeObj){

    scopeObj.view.flxUnlock.onClick = function(){
      formInstance.presenter.sendUnlockLinkToCustomer({
        "username": formInstance.presenter.getCurrentCustomerDetails().Username
      });
    };

    formInstance.view.flxSelectOptions.flxSuspend.onClick = function () {
      var locklbl = formInstance.view.flxSelectOptions.lblOption1.text;
      var currentStatus = locklbl.toUpperCase();
      var primaryCustId=formInstance.presenter.getCurrentCustomerDetails().primaryCustomerId;
      var isAssociated=formInstance.presenter.getCurrentCustomerDetails().isAssociated;
      var rtxMsg="";//Using rtxMsg separatley as the mesg different in certain senarios
      var buttonText='YES, ' + (locklbl.toUpperCase());
      var cancelMsg = kony.i18n.getLocalizedString("i18n.PopUp.NoLeaveAsIS");
      var confirmAction = function () {
        formInstance.presenter.updateDBPUserStatus({
          "Customer_id":formInstance.presenter.getCurrentCustomerDetails().Customer_id,
          "customerUsername": formInstance.presenter.getCurrentCustomerDetails().Username,
          "status": locklbl === kony.i18n.getLocalizedString("i18n.permission.Activate") ? "ACTIVE" : "SUSPENDED"
        });
      };
      var cancelAction = function () { };
      var message = "", message2 = "";
      if (locklbl === kony.i18n.getLocalizedString("i18n.permission.Activate")&&isAssociated==="false") {
        message = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Are_you_sure_to_Activate_the_customer_NoContractMsg1");
        message2 = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Are_you_sure_to_Activate_the_customer_NoContractMsg2");
        rtxMsg=message + ' ' + scopeObj.view.lblCustomerName.text +" " + message2;
        buttonText=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddCustomer_UC");
        cancelMsg =kony.i18n.getLocalizedString("i18n.frmCustomers.CANCEL");
        confirmAction = function () {
          var customerDetails = formInstance.presenter.getCurrentCustomerDetails();
          var navigationParam = {"formName":kony.application.getCurrentForm().id,
                                 "isEnrollEditUser" : false,
                                 "tabName":"CONTACTS"};
          formInstance.presenter.getInfinityUserAllDetails({"id":customerDetails.Customer_id},navigationParam,true);
        };
      }else if (locklbl === kony.i18n.getLocalizedString("i18n.permission.Activate")) {
        message = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Are_you_sure_to_Activate_the_customer");
        message2 = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Customer_can_perform");
        rtxMsg=message + ' "' + scopeObj.view.lblCustomerName.text + '"?<br><br>' + message2;
      } else if (locklbl.toLowerCase() === kony.i18n.getLocalizedString("i18n.permission.Suspend")) {
        message = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Are_you_sure_to_Suspend_the_customer");
        message2 = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Customer_can_not_perform");
        rtxMsg=message + ' "' + scopeObj.view.lblCustomerName.text + '"?<br><br>' + message2;
      }

      formInstance.AdminConsoleCommonUtils.openConfirm({
        header: locklbl + ' Customer',
        message: rtxMsg,
        confirmAction: confirmAction,
        cancelMsg: cancelMsg,
        cancelAction: cancelAction,
        confirmMsg: buttonText,

      }, formInstance);
    };

    formInstance.view.flxSelectOptions.onHover = function (widget, context) {
      if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
       formInstance.view.flxSelectOptions.isVisible  = false;
       scopeObj.view.flxOptions.skin = "slFbox";
      }
    };
    formInstance.view.flxSelectOptions.flxUpgrade.onClick = function () {
      formInstance.view.flxSelectOptions.isVisible  = false;
      formInstance.presenter.showUpgrdageUserScreen(formInstance.view.breadcrumbs.lblCurrentScreen.text);
    };
    scopeObj.view.flxOptions.onClick = function () {
      if(formInstance.view.flxSelectOptions.isVisible) {
        formInstance.view.flxSelectOptions.isVisible  = false;
        scopeObj.view.flxOptions.skin = "slFbox";
        scopeObj.view.flxOptions.hoverSkin = "sknflxffffffop100Border424242Radius100px";
      }
      else  {
        formInstance.view.flxSelectOptions.isVisible  = true;
        scopeObj.view.flxOptions.skin = "sknflxffffffop100Border424242Radius100px";
        scopeObj.view.flxOptions.hoverSkin = "sknflxffffffop100Border424242Radius100px";
        formInstance.view.flxSelectOptions.lblOption2.hoverSkin = "";
        formInstance.view.flxSelectOptions.flxUpgrade.hoverSkin = "sknContextualMenuEntryHover";
        formInstance.view.flxSelectOptions.lblOption1.hoverSkin = "";
        formInstance.view.flxSelectOptions.flxSuspend.hoverSkin = "sknContextualMenuEntryHover";
        //formInstance.view.flxSelectOptions.left = (scopeObj.view.flxActionButtons.frame.x + scopeObj.view.flxOptions.frame.x - 125) + "dp";
        formInstance.view.flxSelectOptions.left = (scopeObj.view.flxActionButtons.frame.x + scopeObj.view.flxOptions.frame.x - 125+ 38) +"dp";
      }
    };
    
    scopeObj.view.flxCSRAssistNewApp.onClick = function () {
      var payload;
      payload = {
        "customerid" : kony.store.getItem("Customer_id")
      };
      formInstance.presenter.CSRAssistCustomerOnboardingNewApp(payload);
    };
  }

	return {
    setDefaultHeaderData: setDefaultHeaderData,
    handleLockedUserStatus: handleLockedUserStatus,
    handleSuspendedUserStatus: handleSuspendedUserStatus,
    handleNewUserStatus: handleNewUserStatus,
    handleActiveUserStatus: handleActiveUserStatus,
    setCustomerNameandTag: setCustomerNameandTag,    
    setRiskStatus: setRiskStatus
	};
});