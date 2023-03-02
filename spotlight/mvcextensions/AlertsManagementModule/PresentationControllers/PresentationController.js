define(['ErrorInterceptor', 'ErrorIsNetworkDown','Promisify'], function (ErrorInterceptor, isNetworkDown,Promisify) {

  function AlertsManagement_PresentationController() {
    kony.mvc.Presentation.BasePresenter.call(this);
    this.variableRef = null;
  }

  inheritsFrom(AlertsManagement_PresentationController, kony.mvc.Presentation.BasePresenter);

  AlertsManagement_PresentationController.prototype.initializePresentationController = function() {
    var self = this;
    ErrorInterceptor.wrap(this, 'businessController').match(function(on){
      return [
        on(isNetworkDown).do(function(){
          self.presentUserInterface("frmAlertsManagement",{
            NetworkDownMessage : {}
          });
        })
      ];
    });
  };
	/**
     * @name showAlerts
     * @member AlertsManagementModule.presentationController
     * @param {progressBar : {show : boolean}} context
     */
  AlertsManagement_PresentationController.prototype.showAlerts = function(context) {
    this.presentUserInterface("frmAlertsManagement",context);
  };
  /**
     * @name showProgressBar
     * @member AlertsManagementModule.presentationController
     * 
     */
  AlertsManagement_PresentationController.prototype.showProgressBar = function(){
    this.showAlerts({progressBar : {
      show : true
    }});
  };
  /**
     * @name hideProgressBar
     * @member AlertsManagementModule.presentationController
     * 
     */
  AlertsManagement_PresentationController.prototype.hideProgressBar = function(){
    this.showAlerts({progressBar : {
      show : false
    }});
  };
	/**
     * @name initAlerts
     * @member AlertsManagementModule.presentationController
     * 
     */
  AlertsManagement_PresentationController.prototype.initAlerts = function(){
    //For Left Menu entry
    var self = this;
    self.fetchAlertCategories("fetch");
  };
  /**
     * @name fetchAlertCategories
     * @member AlertsManagementModule.presentationController
     * @param string type
     */
  AlertsManagement_PresentationController.prototype.fetchAlertCategories = function () {
    var self = this;
    self.showProgressBar();
    function onSuccess(response) {
      self.hideProgressBar();
      self.showAlerts({"categoryList":response.records});
    }

    function onError(err) {
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(err),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.fetchAlertCategories({}, onSuccess, onError);
  };
  /**
     * @name fetchCategoryDetails
     * @member AlertsManagementModule.presentationController
     * @param {"AlertCategoryId":"ALERT_CAT_ACCOUNTS"}
     */
  AlertsManagement_PresentationController.prototype.fetchCategoryDetails = function (inputParam) {
    var self = this;
    self.showProgressBar();
    function onSuccess(response) {
      self.hideProgressBar();
      self.showAlerts({"categoryDetail":response});
    }

    function onError(err) {
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(err),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.fetchAlertCategory(inputParam, onSuccess, onError);
  };
  /**
    *@name addAlertCategory
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
  AlertsManagement_PresentationController.prototype.addAlertCategory = function(context) {
    var self = this;
    //var catId = context.categoryCode;
    self.showProgressBar();
    function onSuccess(response){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagement.CategoryAddedSuccessfully"), kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      self.fetchAlertCategories();
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error), kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.createAlertCategory(context, onSuccess, onError);
  };
  /**
    *@name editAlertCategory
    * @member AlertsManagementModule.presentationController
    * @param {edit request param, isActivateDeactivate}
    */
  AlertsManagement_PresentationController.prototype.editAlertCategory = function(context, isActivateDeactivate) {
    var self = this;
    var catId = context.categoryCode;
    self.showProgressBar();
    function onSuccess(){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagementController.Alert_category_updated_msg"), kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      if(isActivateDeactivate === true){
        self.hideProgressBar();
        self.showAlerts({"categoryActivateDecivate":context.statusId});
      } else{
        self.fetchCategoryDetails({"AlertCategoryId":catId});
      }
      
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagementController.Alert_category_failed_update_msg"), kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.editAlertCategory(context, onSuccess, onError);
  };

/**
    *@name updateAlertCategorySequence
    * @member AlertsManagementModule.presentationController
    */
  AlertsManagement_PresentationController.prototype.updateAlertCategorySequence = function(context,action) {
    var self = this;
    self.showProgressBar();
    function onSuccess(response){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagementController.Alert_category_reordered_msg"), kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      self.fetchAlertCategories("fetch");
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagementController.Alert_category_failed_reorder_msg"), kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.updateAlertCategorySequence(context, onSuccess, onError);
  };
  /**
    *@name getAlertTypeDetails
    * @member AlertsManagementModule.presentationController
    * @param: {"AlertTypeId":""}
    * @param: action -("edit","viewDetails","statusChange")
    */
  AlertsManagement_PresentationController.prototype.getAlertTypeDetails = function(context,action) {
    var self = this;
    self.showProgressBar();
    function onSuccess(response){
      self.hideProgressBar();
      self.showAlerts({"alertDetails":response,"action":action});
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.getAlertTypeDetails(context, onSuccess, onError);
  };
  /**
    *@name updateAlertTypeSequence
    * @member AlertsManagementModule.presentationController
    * @param {"typeOrder": {"ALERT_TYPE_FUNDS_RECEIVED": 1,"ALERT_TYPE_BALANCE_ALERT": 2},"alertCategoryCode":"ALERT_CAT_TRANSACTIONAL"}
    */
  AlertsManagement_PresentationController.prototype.updateAlertTypeSequence = function(context) {
    var self = this;
    var catId = context.alertCategoryCode;
    self.showProgressBar();
    function onSuccess(){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Alertgroups_successfully_reordered"),
                            kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      self.fetchCategoryDetails({"AlertCategoryId":catId});
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.updateAlertTypeSequence(context, onSuccess, onError);
  };
  /**
    *@name createAlertGroup
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
  AlertsManagement_PresentationController.prototype.createAlertGroup = function(context) {
    var self = this;
    var catId = context.alertCategoryCode;
    self.showProgressBar();
    function onSuccess(response){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Alertgroup_added_successfully"),
                            kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      self.fetchCategoryDetails({"AlertCategoryId":catId});
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(error.dbpErrMsg,kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.createAlertType(context, onSuccess, onError);
  };
  /**
    *@name editAlertGroup
    * @member AlertsManagementModule.presentationController
    * @param {}
    * @param : context (1 or 2)
    */
  AlertsManagement_PresentationController.prototype.editAlertGroup = function(reqParam,context) {
    var self = this;
    var catId = reqParam.alertCategoryCode;
    var alertGroupId = reqParam.alertCode;
    self.showProgressBar();
    function onSuccess(response){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Alertgroup_updated_successfully"),
                                                         kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      //for navigating to respective screen after edit
      if(context === 1){
        self.fetchCategoryDetails({"AlertCategoryId":catId});
      }else if(context === 2){
        self.getAlertTypeDetails({"AlertTypeId":alertGroupId}, "viewDetails");
      }
    }
    function onError(error){
      self.showToastMessage(error.dbpErrMsg,kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
      self.fetchCategoryDetails({"AlertCategoryId":catId});
    }
    this.businessController.editAlertType(reqParam, onSuccess, onError);
  };
  /**
    *@name getAlertCategoriesByAccountType
    * @member AlertsManagementModule.presentationController
    * @param {"alertCategoryCode" : "","isAccountLevel" : "true"}
    */
  AlertsManagement_PresentationController.prototype.getAlertCategoriesByAccountType = function(reqParam) {
    var self = this;
    self.showProgressBar();
    function onSuccess(response){
      self.hideProgressBar();
      self.showAlerts({"categoryListBasedOnAccLevel":response.dbxalertcategory});
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.getAlertCategoriesByAccountType(reqParam, onSuccess, onError);
  };
   /**
    *@name reassignAlertType
    * @member AlertsManagementModule.presentationController
    * @param {"alertCode" : "","fromAlertyCategory" : "","toAlertCategory": ""}
    */
  AlertsManagement_PresentationController.prototype.reassignAlertType = function(reqParam) {
    var self = this;
    var catId = reqParam.fromAlertyCategory;
    self.showProgressBar();
    function onSuccess(){
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmAlertsManagement.GroupMovedSuccessully"),
                                                         kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      self.fetchCategoryDetails({"AlertCategoryId":catId});
    }
    function onError(error){
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
      self.fetchCategoryDetails({"AlertCategoryId":catId});
    }
    this.businessController.reassignAlertType(reqParam, onSuccess, onError);
  };
  /**
    *@name showToastMessage
    * @member AlertsManagementModule.presentationController
    * @param message,status("success"/"error")
    */
  AlertsManagement_PresentationController.prototype.showToastMessage = function(message,status) {
    var self = this;
    self.presentUserInterface("frmAlertsManagement",{"toast":{"message":message,"status":status}});
  };
  AlertsManagement_PresentationController.prototype.getSubAlertView = function(context,action) {
    var self = this;
    self.showProgressBar();
    function onSuccess(response){
      self.hideProgressBar();
      self.showAlerts({"subAlertDetails":response,"action":action});
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));      
    }
    this.businessController.getSubAlertDetails(context, onSuccess, onError);
  };
  AlertsManagement_PresentationController.prototype.getVariableReferenceData = function() {
    var self = this;
    function onSuccess(response){
     self.showAlerts({"variableRef":response});
    }
    function onError(error){
      console.log("ERROR"+error);
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.getVariableReferenceData({}, onSuccess, onError);
  };
    /**
    *@name createSubAlert
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
  AlertsManagement_PresentationController.prototype.createSubAlert = function(context) {
    var self = this;
    var typeId = {"AlertTypeId":context.alertTypeCode};
    self.showProgressBar();
    function onSuccess(response){
      self.showToastMessage("Alert created successfully ",kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      self.getAlertTypeDetails(typeId,"viewDetails");
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.createSubAlert(context, onSuccess, onError);
  };
      /**
    *@name editSubAlert
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
  AlertsManagement_PresentationController.prototype.editSubAlert = function(context,isView) {
    var self = this;
    var subAlertId = {"SubAlertId":context.code};
    self.showProgressBar();
    function onSuccess(){
      self.showToastMessage("Alert updated successfully ",kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      if(isView===true){
        self.getSubAlertView(subAlertId);
        self.getVariableReferenceData();
      }else{
        self.getAlertTypeDetails({"AlertTypeId":context.alertTypeCode},"viewDetails");
      }
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.editSubAlert(context, onSuccess, onError);
  };
        /**
    *@name editSubAlertStatus
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
  AlertsManagement_PresentationController.prototype.editSubAlertStatus = function(context,isView) {
    var self = this;
    self.showProgressBar();
    function onSuccess(){
      self.showToastMessage("Alert status updated successfully ",kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"));
      if(isView===true){
        self.getSubAlertView({"SubAlertId":context.code});
        self.getVariableReferenceData();
      }else{
        self.getAlertTypeDetails({"AlertTypeId":context.alertTypeCode},"viewDetails");
      }
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.editSubAlertStatus(context, onSuccess, onError);
  };
        /**
    *@name getAlertCodes
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
  AlertsManagement_PresentationController.prototype.getAlertCodes = function(context) {
    var self = this;
    self.showProgressBar();
    function onSuccess(response){
      self.hideProgressBar();
      self.showAlerts({"alertCodes":response});
    }
    function onError(error){
      self.hideProgressBar();
      self.showToastMessage(ErrorInterceptor.errorMessage(error),kony.i18n.getLocalizedString("i18n.frmGroupsController.error"));
    }
    this.businessController.getAlertCodes(context, onSuccess, onError);
  };
  /**
    * @name fetchMasterdata
    * @member AlertsManagementModule.presentationController
    * @param {}
    */
   AlertsManagement_PresentationController.prototype.fetchMasterdata = function(context) {
    var self = this;
    self.showProgressBar();
    var promiseFetchAllApps = Promisify(this.businessController, 'getAllAppsList');
    var promiseFetchAllUsers = Promisify(this.businessController, 'getAllUsersList');
    var promiseFetchAllLanguages = Promisify(this.businessController, 'getAllLocaleLanguagesList');
    var promiseFetchAllChannels = Promisify(this.businessController, 'getAlertChannels');
    var promiseFetchAttributes = Promisify(this.businessController, 'getAlertAttributes');
    var promiseFetchCriteria = Promisify(this.businessController, 'getAlertAttributeConditions');
    var promiseFetchEventTypes = Promisify(this.businessController, 'getEventTypes');
    var promiseFetchAccountTypes = Promisify(this.businessController, 'getAccountTypes');
    var promiseFetchFreqTypes = Promisify(this.businessController, 'getAlertFrequency');
    var promiseFetchRecipientTypes = Promisify(this.businessController, 'getAlertRecipientTypes');
     
     Promise.all([
      promiseFetchAllApps({}),
      promiseFetchAllUsers({}),
      promiseFetchAllLanguages({"$orderby": "Language"}),
      promiseFetchAllChannels({}),
      promiseFetchAttributes({}),
      promiseFetchCriteria({}),
      promiseFetchEventTypes({}),
      promiseFetchAccountTypes({}),
      promiseFetchFreqTypes({}),
      promiseFetchRecipientTypes({"isAccountLevel":"1"})
    ]).then(function (responses) {
      self.showAlerts({"action":"masterData",
                       "appsList":responses[0],
                       "usersList":responses[1],
                       "languagesList":responses[2],
                       "channelList": responses[3],
                       "attributesList":responses[4],
                       "criteriaList":responses[5],
                       "alertGroupCodes":responses[6],
                       "accountTypes": responses[7],
                       "frequencyTypes": responses[8],
                       "recipientsList":responses[9]
                       });
       self.hideProgressBar();
    }).catch(function (error) {
      self.hideProgressBar();
      console.log("ERROR" + error);
    });
   };
  return AlertsManagement_PresentationController;
});