define(['Promisify','ErrorInterceptor'], function(Promisify, ErrorInterceptor) {
    /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */
    function PresentationController() {
        kony.mvc.Presentation.BasePresenter.call(this);
		this.globalDetails={country:[],region:[],city:[]};
		this.companyViewModel = {searchData:null};
        this.CustomerAccounts = null;
        this.isAccountCentricCore = true;
        this.AddUserAccountsFeatures = {}
    }

    inheritsFrom(PresentationController, kony.mvc.Presentation.BasePresenter);

    /**
     * Overridden Method of kony.mvc.Presentation.BasePresenter
     * This method gets called when presentation controller gets initialized
     * @method
     */
    PresentationController.prototype.initializePresentationController = function() {
      var self = this;
      self.getAccountCentricCore();
    };
    PresentationController.prototype.showCompanies = function(context) {
      var self = this;
      self.showLoadingScreen();
      if(context){}
      else{
        context = {action : "fetch"};
      }
      
      var promiseFetchFeature = Promisify(this.businessController, 'getAllFeatures');
      var promiseBusinessTypes = Promisify(this.businessController, 'getBusinessTypes');
      var promiseServiceDefinition = Promisify(this.businessController, 'getServiceDefinition');

      Promise.all([
        promiseFetchFeature(context),
        promiseBusinessTypes({}),
        promiseServiceDefinition({})
      ]).then(function (responses) {
        context.features = responses[0];
        self.presentUserInterface("frmCompanies",context);
        self.presentUserInterface("frmCompanies",{"coreTypeConfig": {"value":self.isAccountCentricCore}});
        self.presentUserInterface("frmCompanies",{"businessTypes":responses[1].BusinessTypeRecords});
        self.presentUserInterface("frmCompanies",{"ServiceDefinitionRecords":responses[2].ServiceDefinitionRecords});
        self.hideLoadingScreen();
      }).catch(function (res) {
        var error = res.dbpErrMsg || res ;
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),error);
        self.hideLoadingScreen();
      });
    };
    /*
    * fetch core type configuration
    */
    PresentationController.prototype.getAccountCentricCore = function() {
      var self =this;
      function onSuccess(response){
        self.isAccountCentricCore = response.isAccountCentricCore;
      }
      function OnError(err){
        self.isAccountCentricCore = true;
        console.log("----ERROR: fetching config type " +err);
      }
      this.businessController.getCoreTypeInformation({},onSuccess,OnError);
    };
  
    PresentationController.prototype.navigateToCreateCustomerScreen = function(context) {
        var self = this;
        context.companyID=self.companyId;
        self.navigateTo('CustomerCreateModule', 'showCreatecompanyScreen',[context]);
    };
    /*
    * navigate to edit customer form
    * @param: {"id": "","DateOfBirth": "","DrivingLicenseNumber": "","FirstName": "","LastName": "","Lastlogintime": "","MiddleName":"","Ssn": "","UserName": "","createdts": "","role_name": "","status": "","Email": "","Phone": "",
	          "company": {"UserName": "","id": "","TypeId": "TYPE_ID_SMALL_BUSINESS"}}
              navigationParams - {"selectTab":""}
    */
    PresentationController.prototype.navigateToEditCustomerScreen = function(context,navigationParams) {
        var self = this;
        if(navigationParams){
          context['isAccountCentricConfig'] = self.isAccountCentricCore;
        }
        self.navigateTo('CustomerCreateModule', 'showEditCustomerScreen',[context, navigationParams]);
    };
    /*
    * navigate to customer profile
    * @param: param- {"Customer_id":""}
              formDetails - {"name":""}
    */
    PresentationController.prototype.navigateToCustomerPersonal = function(param,formDetails) {
        var self = this;
        var context = [param.Customer_id,formDetails];
        self.navigateTo('CustomerManagementModule', 'diplayCustomerProfileFromOtherModule',context);
    };  
    PresentationController.prototype.showResultFromCustomerScreen = function(context,isLoading,toast) {
        var self = this;
        if(isLoading) self.showLoadingScreen();
        self.presentCompaniesScreen(toast);
        if (context) self.showCompanies(context);
    };
    PresentationController.prototype.showLoadingScreen = function() {
        var self = this;
        self.presentUserInterface("frmCompanies",{"loadingScreen":{"focus":true}});
    };
    PresentationController.prototype.hideLoadingScreen = function() {
        var self = this;
        self.presentUserInterface("frmCompanies",{"loadingScreen":{"focus":false}});
    };
    PresentationController.prototype.showToastMessage = function(status,message) {
        var self = this;
        self.presentUserInterface("frmCompanies",{"toastMessage":{"status":status,
                                                                  "message":message}});
    };
    PresentationController.prototype.getAddressSuggestion=function(text,onSucess,OnError){
       var context={
         "input":text,
       };
      this.businessController.getAddressSuggestion(context,onSucess,OnError);
    };
    PresentationController.prototype.getPlaceDetails=function(PlaceId,onSucess,OnError){
       var context={
         "placeid":PlaceId,
       };
      this.businessController.getPlaceDetails(context,onSucess,OnError);
    };
  PresentationController.prototype.fetchLocationPrefillData = function(callback) {
    var self = this;
    self.globalDetails = {
      countries: null,
      regions: null,
      cities: null,
    };

    var promiseFetchCountryList = Promisify(this.businessController, 'fetchCountryList');
    var promiseFetchRegionList = Promisify(this.businessController, 'fetchRegionList');

    Promise.all([
      promiseFetchCountryList({}),
      promiseFetchRegionList({})
    ]).then(function (responses) {
      self.globalDetails.countries = responses[0];
      self.globalDetails.regions = responses[1];
      if (typeof callback === 'function') callback(self.globalDetails);
    }).catch(function (res) {
      callback("error");
      kony.print("unable to fetch preloaded data",res);
    });
  };
   PresentationController.prototype.presentCompaniesScreen = function(context){
     var self = this;
     self.presentUserInterface("frmCompanies",context);
   };

  PresentationController.prototype.createCompany = function (context) {
    var self = this; 

    function completionCreateCompanyCallback(response) {
	if(response['status'] === "Failure"){
       self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
       self.hideLoadingScreen();
      }else{
        self.companyId=response.id;
       self.presentUserInterface("frmCompanies",{
         "createCompanySuccess":response
       });
      }
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.createCompany(context, completionCreateCompanyCallback, onError);
  };
  
  PresentationController.prototype.getAllAccounts = function (context) {
    var self = this; 
    function completionFetchAccountsCallback(response) {
       self.presentUserInterface("frmCompanies",{
         "accountSearch":response.Accounts? response.Accounts : []
       });
      self.hideLoadingScreen();
    }

    function onError(error) {
       self.presentUserInterface("frmCompanies",{
         "accountSearch":[]
       });
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getAllAccounts(context, completionFetchAccountsCallback, onError);
  };
  PresentationController.prototype.getCompanyDetails = function (context,success,error) {
    var self = this;
    var onSuccess = function(res){
      var detailContext = {
        "CompanyContext" : res.OrganisationDetails,
        "OwnerContext" : res.OrganisationOwnerDetails
      };
      self.hideLoadingScreen();
      success(detailContext);
    };
    var onError = function(err){
      self.hideLoadingScreen();
      kony.print("getCompanyDetails(presentation controller): not able to fetch company details",err);
      error(err);
    };
    this.showLoadingScreen();
    this.businessController.getCompanyDetails(context,onSuccess,onError);
  };
  PresentationController.prototype.getCompanyAccounts = function (context,success,error) {
    var self = this;
    var onSuccess = function(res){
      self.CustomerAccounts = res.OgranizationAccounts; 
      var accountContext = {
        "accountContext" : res.OgranizationAccounts
      };
      success(accountContext);
      self.hideLoadingScreen();
    };
    var onError = function(err){
      self.hideLoadingScreen();
      kony.print("getCompanyAccounts(presentation controller): not able to fetch acocunts ",err);
      error(err);
    };  
    this.showLoadingScreen();
    this.businessController.getCompanyAccounts(context,onSuccess,onError);
  };
  PresentationController.prototype.getCompanyCustomers = function (context,success,error) {
    var self = this;
    var onSuccess = function(res){
      var customerContext = {
        "customerContext" : res.organizationEmployee
      };
      success(customerContext);
      self.hideLoadingScreen();
    };
    var onError = function(err){
      self.hideLoadingScreen();
      kony.print("getCompanySignatories(presentation controller): not able to fetch customers",err);
      error(err);
    };  
    this.showLoadingScreen();
    this.businessController.getCompanySignatories(context,onSuccess,onError);
  };
  PresentationController.prototype.getCompanyFeatures = function(context,success,error,frmName){
    //this.showLoadingScreen();
    if(frmName === "frmEnrollmentRequests")
      this.showRequestsLoadingScreen();
    else
      this.showLoadingScreen();
    var self = this;
    var onSuccess = function(res){
      success(res.FeatureActions);
      //self.hideLoadingScreen();
      if(frmName === "frmEnrollmentRequests")
        self.hideRequestsLoadingScreen();
      else
        self.hideLoadingScreen();
    };
    var onError = function(err){
      error(err);
      //self.hideLoadingScreen();
      if(frmName === "frmEnrollmentRequests")
        self.hideRequestsLoadingScreen();
      else
        self.hideLoadingScreen();
    };
    this.businessController.getCompanyFeaturesActionsLimits({"organization_id":context.id},onSuccess,onError);
  };
  PresentationController.prototype.showCompaniesForm = function(context) {
    this.currentForm = "frmCompanies";
    this.presentUserInterface('frmCompanies', context);
  };

  PresentationController.prototype.hideLocationsLoadingScreen = function() {
    this.showCompaniesForm({
      action: "hideLoadingScreen"
    });
  };  
  /*
  * showCompaniesFromCustomerModule
  * @param: {"id":"","selectTab":""}
  */
  PresentationController.prototype.showCompaniesFromCustomerModule = function (context) {
    var self = this;
    self.presentUserInterface("frmCompanies",{"action":"hideScreens"});
    self.showLoadingScreen();
    function onSuccess(response){
      self.presentUserInterface("frmCompanies",{"businessTypes":response.BusinessTypeRecords});
      self.getAllFeatures({
        action : "getAllFeatures"
      });
      self.getCompanyAllDetails(context);
    }
    function OnError(err){
      self.hideLocationsLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(err));
    }
    this.businessController.getBusinessTypes({},onSuccess,OnError);
    
  };
  PresentationController.prototype.getContractDetails = function(context){
    var self = this;
    self.showLoadingScreen();
    function onSuccess(response){
      self.presentUserInterface("frmCompanies",{"contractCustomers":response.contractCustomers,
                                                "serviceDef" : {
                                                  "name" : response.servicedefinitionName,
                                                  "id" : response.servicedefinitionId}});
      self.hideLocationsLoadingScreen();
    }
    function OnError(err){
      self.hideLocationsLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(err));
    }
    this.businessController.getContractDetails(context,onSuccess,OnError);
  }

  /*
  * getContractInformation
  * @param: {"id":"","selectTab":""}
  */
 PresentationController.prototype.getContractInformation= function (contractId) {
  this.showLoadingScreen();
  var self = this;
  self.globalDetails = { };
  var promiseGetContractDetailsList = Promisify(this.businessController, 'getContractDetails');

  Promise.all([
      
      promiseGetContractDetailsList({
          "contractId": contractId
      })
  ]).then(function(responses) {
      self.globalDetails.contractDetails = responses[0];    
      self.hideLocationsLoadingScreen();
      self.presentUserInterface("frmCompanies", {
          "action": "contractDetails",
          "contractDetails": self.globalDetails
      });
    }).catch(function(res) {
        self.hideLocationsLoadingScreen();
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"), ErrorInterceptor.errorMessage(res));
        kony.print("unable to fetch preloaded data", res);
    });	
  };
  /*
  * getContractFeatureActionLimits
  * @param: {"id":"","selectTab":""}
  */
 PresentationController.prototype.getContractFeatureActionLimits= function (contractId , selectTab) {
  this.showLoadingScreen();
  var self = this;
  self.globalDetails = { };
  var promiseGetContractDetailsList = Promisify(this.businessController, 'getContractFeatureActionLimits');

  Promise.all([
      
      promiseGetContractDetailsList({
          "contractId": contractId
      })
  ]).then(function(responses) {
      self.globalDetails.accountsFeatures = responses[0];    
      self.hideLocationsLoadingScreen();
      self.presentUserInterface("frmCompanies", {
          "action": "contractFeatureActionLimits",
          "contractDetails": self.globalDetails,
          'selectTab' : selectTab
      });
    }).catch(function(res) {
        self.hideLocationsLoadingScreen();
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"), ErrorInterceptor.errorMessage(res));
        kony.print("unable to fetch preloaded data", res);
    });	
  };
   /*
  * getContractInfinityUsers
  * @param: {"id":"","selectTab":""}
  */
 PresentationController.prototype.getContractInfinityUsers= function (contractId) {
  this.showLoadingScreen();
  var self = this;
  self.globalDetails = { };
  var promiseGetInfinityUsersList = Promisify(this.businessController, 'getContractInfinityUsers');

  Promise.all([   
      promiseGetInfinityUsersList({
        "contractId": contractId
    })
  ]).then(function(responses) {
    self.globalDetails.signatoryUsers = responses && responses[0].contractUsers ? responses[0].contractUsers :[];    
      self.hideLocationsLoadingScreen();
      self.presentUserInterface("frmCompanies", {
          "action": "contractInfinityUsers",
          "contractDetails": self.globalDetails.signatoryUsers
      });
    }).catch(function(res) {
        self.hideLocationsLoadingScreen();
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"), ErrorInterceptor.errorMessage(res));
        kony.print("unable to fetch preloaded data", res);
    });	
  };
  /*
  * getContractAllDetails
  * @param: {"id":"","selectTab":""}
  */
 PresentationController.prototype.getContractAllDetails= function (context) {
    this.showLoadingScreen();
    var self = this;
    self.globalDetails = { };
  var promiseGetContractDetailsList = Promisify(this.businessController, 'getContractDetails');
  var promiseGetContractFeaturesLimitsList = Promisify(this.businessController, 'getContractFeatureActionLimits');    
  var promiseGetInfinityUsersList = Promisify(this.businessController, 'getContractInfinityUsers');
  
  Promise.all([
      
      promiseGetContractDetailsList({
          "contractId": context.contractId
      }),
      promiseGetContractFeaturesLimitsList({
          "contractId": context.contractId
      }),
      promiseGetInfinityUsersList({
          "contractId": context.contractId
      })
  ]).then(function(responses) {
      self.globalDetails.contractDetails = responses[0];
      self.globalDetails.accountsFeatures = responses[1];        
      self.globalDetails.signatoryUsers = responses[2];        
      
      self.hideLocationsLoadingScreen();
      self.presentUserInterface("frmCompanies", {
          "action": "contractDetails",
          "contractDetails": self.globalDetails,
          "selectedTabNo": context.selectTab
      });
    }).catch(function(res) {
        self.hideLocationsLoadingScreen();
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"), ErrorInterceptor.errorMessage(res));
        kony.print("unable to fetch preloaded data", res);
    });	
  };
  /*
  * getCompanyAllDetails
  * @param: {"id":"","selectTab":""}
  */
  PresentationController.prototype.getCompanyAllDetails = function (context) {
    this.showLoadingScreen();
    var self = this;
    self.globalDetails = {
      CompanyContext: null,
      OwnerContext: null,
      accountContext: null,
//       customerContext: null,
      featuresContext: null
    };
    var promiseGetCompanyDetailsList = Promisify(this.businessController, 'getCompanyDetails');
    var promiseGetCompanyAccountsList = Promisify(this.businessController, 'getCompanyAccounts');
    var promiseGetCompanyCustomersList = Promisify(this.businessController, 'getCompanySignatories');
    var promiseGetFeaturesActionsList = Promisify(this.businessController, 'getCompanyFeaturesActionsLimits');
    var promiseGetApprovalMatrixList = Promisify(this.businessController, 'getCompanyApprovalLimits');
    
    Promise.all([
      promiseGetCompanyDetailsList({"id":context.id}),
      promiseGetCompanyAccountsList({"Organization_id":context.id}),
      promiseGetCompanyCustomersList({"Organization_id":context.id}),
      promiseGetFeaturesActionsList({"organization_id":context.id}),
      promiseGetApprovalMatrixList({"Organization_id":context.id})
    ]).then(function (responses) {
      self.globalDetails.CompanyContext = responses[0].OrganisationDetails;
      self.globalDetails.OwnerContext = responses[0].OrganisationOwnerDetails;
      self.globalDetails.accountContext = responses[1].OgranizationAccounts;
      self.globalDetails.customerContext = responses[2].organizationEmployee;
      self.globalDetails.featuresContext = responses[3].FeatureActions; 
      self.globalDetails.approvalsContext = responses[4].accounts; 
      self.CustomerAccounts = responses[1].OgranizationAccounts; 
      self.hideLocationsLoadingScreen();
      self.presentUserInterface("frmCompanies",{"action":"companyDetails",
                                                "companyDetails":self.globalDetails,
                                                "selectedTabNo": context.selectTab});
    }).catch(function (res) {
      self.hideLocationsLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(res));
      kony.print("unable to fetch preloaded data",res);
    });	
  };
  PresentationController.prototype.validateTIN = function (context,callback) {
    var self = this; 

    function completionvalidateTinCallback(response) {
       self.presentUserInterface("frmCompanies",{
         "tinValidation":response
       });
      self.hideLoadingScreen();
      if(callback && callback instanceof Function){
        callback();
      }
    }

    function onError(err) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),err.dbpErrMsg);
      self.hideLoadingScreen();
      if(callback && callback instanceof Function){
        callback();
      }
    }
    this.showLoadingScreen();
    this.businessController.validateTIN(context, completionvalidateTinCallback, onError);
  };
  
  PresentationController.prototype.getCompaniesSearch = function(payload) {
    var self = this; 

    function onSuccess(response) {
      self.companyViewModel.searchData = response.OrganisationDetails;
      self.hideLoadingScreen();
      self.presentCompaniesScreen(self.companyViewModel);
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getCompaniesSearch(payload, onSuccess, onError);
  };

  PresentationController.prototype.editCompany = function (context) {
    var self = this; 

    function completionEditCompanyCallback(response) {
      if(response['status'] == "Failure"){
       self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
       self.hideLoadingScreen();
      }else{
       response.id = context.id;
       self.presentUserInterface("frmCompanies",{
         "editCompanySuccess":response
       });
      }
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.editCompany(context, completionEditCompanyCallback, onError);
  };
  PresentationController.prototype.unlinkAccounts = function (context,success,error) {
    var self = this;
    var onSuccess = function(res){
      self.hideLoadingScreen();
      success(res);
    };
    var onError = function(err){
      self.hideLoadingScreen();
      error(err);
    };
    this.showLoadingScreen();
    this.businessController.unlinkAccounts(context, onSuccess, onError);
  };
  /**
     * @name getAccountTransactions
     * @member CustomerManagementModule.presentationController
     * @param {AccountNumber : string, StartDate : string, EndDate : string} data
     */
  PresentationController.prototype.getAccountTransactions = function (data) {
    var self = this;
    self.showLoadingScreen();

    function successCallback(response) {
      self.hideLoadingScreen();
      self.AccountTrasactions = response.Transactions;
      self.presentCompaniesScreen({"AccountTrasactions": self.AccountTrasactions});
    }
    function failureCallback(response) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }

    self.businessController.getCustomerTransactions(data, successCallback, failureCallback);

  };

  /**
     * @name getCustomerAccountInfo
     * @member CompaniesModule.presentationController
     * @param string accountID
     */
  PresentationController.prototype.getCustomerAccountInfo = function (accountID) {
    return this.CustomerAccounts.filter(function (x) { return x.Account_id === accountID; });
  };
  PresentationController.prototype.getAllFeatures = function (context) {
    var self = this;
    function successCallback(res){
      context.features = res;
      self.presentUserInterface("frmCompanies",context);
    }
    function errorCallback(err){
      kony.print("erro while fetching features ",err);
    }
    self.businessController.getAllFeatures({},successCallback,errorCallback);
  };
  PresentationController.prototype.getMonetaryActions = function (payload,success,error) {
    var self = this;
    function successCallback(res){
      success(res);
    }
    function errorCallback(err){
      error(err);
    }
    self.businessController.getMonetaryActions(payload,successCallback,errorCallback);
  };
  PresentationController.prototype.suspendFeature = function (payload,success,error,frmName) {
    var self = this;
    //self.showLoadingScreen();
    if(frmName === "frmEnrollmentRequests")
      self.showRequestsLoadingScreen();
    else
      self.showLoadingScreen();
    function successCallback(res){
      success(res);
    }
    function errorCallback(err){
      error(err);
    }
    self.businessController.suspendFeature(payload,successCallback,errorCallback);
  };    
   /**
     * @name getMembershipDetails
     * @member CompaniesModule.presentationController
     * @param: Object {"Membership_id": ""}
     */
  PresentationController.prototype.getMembershipDetails = function (payload) {
    var self = this;
    self.showLoadingScreen();
    function successCallback(response){
      self.hideLoadingScreen();
      self.presentUserInterface("frmCompanies",{"membershipDetails": response});
    }
    function errorCallback(err){
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(err));
    }
    self.businessController.getMembershipDetails(payload,successCallback,errorCallback);
  };    
  
  //BusinessTypes
  PresentationController.prototype.navigateToBusinessTypesUi = function() {
    var self = this;
    self.getBusinessTypes();
  };
  PresentationController.prototype.getBusinessTypes = function() {
    var self = this;  
    self.showBusinessTypeLoadingScreen();
    function successCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.presentUserInterface("frmBusinessTypes", {"businessTypeRecords" : response.BusinessTypeRecords} );
    }
    function failureCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }
    self.businessController.getBusinessTypes({}, successCallback, failureCallback);
  };
  PresentationController.prototype.geMaxAuthSignatories = function(context) {
    var self = this;  
    self.showLoadingScreen();
    function successCallback(response) {
      self.hideLoadingScreen();
      self.presentUserInterface("frmCompanies", {"businessTypeRecords" : response.BusinessTypeRecords} );
    }
    function failureCallback(response) {
      self.hideLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }
    self.businessController.getBusinessTypes(context, successCallback, failureCallback);
  };
  PresentationController.prototype.deleteBusinessType = function(context) {
    var self = this;    
    self.showBusinessTypeLoadingScreen();
    function successCallback() {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),kony.i18n.getLocalizedString("i18n.frmBusinessTypes.message.deleteSuccessful"));
      self.getBusinessTypes();
    }
    function failureCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }
    self.businessController.deleteBusinessType(context, successCallback, failureCallback);
  }; 
   PresentationController.prototype.updateBusinessType = function(context,action) {
    var self = this;    
    self.showBusinessTypeLoadingScreen();
    function successCallback() {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),kony.i18n.getLocalizedString("i18n.frmBusinessTypes.message.updateSuccessful"));
      if(action==="VIEW")
        self.presentUserInterface("frmBusinessTypes", {"action":action,"defaultRoleId":context.defaultRole});
      else 
        self.getBusinessTypes();
    }
    function failureCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }
    self.businessController.updateBusinessType(context, successCallback, failureCallback);
  }; 
  PresentationController.prototype.createBusinessType = function(context) {
    var self = this;    
    self.showBusinessTypeLoadingScreen();
    function successCallback() {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),kony.i18n.getLocalizedString("i18n.frmBusinessTypes.message.createSuccessful"));
      self.getBusinessTypes();
    }
    function failureCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }
    self.businessController.createBusinessType(context, successCallback, failureCallback);
  }; 
  PresentationController.prototype.getBusinessTypeGroups = function(context,action) {
    var self = this;    
    self.showBusinessTypeLoadingScreen();
    function successCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.presentUserInterface("frmBusinessTypes", {"rolesForBusinessType" : response.groups,"action":action});
    }
    function failureCallback(response) {
      self.hideBusinessTypeLoadingScreen();
      self.showBusinessTypeToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
    }
    self.businessController.getBusinessTypeGroups(context, successCallback, failureCallback);
  };
  PresentationController.prototype.showBusinessTypeLoadingScreen = function() {
    var self = this;
    self.presentUserInterface("frmBusinessTypes",{"loadingScreen":{"focus":true}});
  };
  PresentationController.prototype.hideBusinessTypeLoadingScreen = function() {
    var self = this;
    self.presentUserInterface("frmBusinessTypes",{"loadingScreen":{"focus":false}});
  };
  PresentationController.prototype.showBusinessTypeToastMessage = function(status,message) {
    var self = this;
    self.presentUserInterface("frmBusinessTypes",{"toastMessage":{"status":status,
                                                              "message":message}});
  };
  PresentationController.prototype.navigateToRequestsUI = function() {
    var self = this;
    self.getAllContractEnrollmentRequests();
  };
  PresentationController.prototype.getAllContractEnrollmentRequests = function () {
    var self = this;
    self.showRequestsLoadingScreen();
    var promiseGetCompanyRequests = Promisify(this.businessController, 'getListOfContractsByStatus');
    var promiseGetAutoApprovalStatus = Promisify(this.businessController, 'fetchBusinessConfigurations');
    // Promise.all([
    //   promiseGetCompanyRequests({"statusId":"SID_ORG_PENDING"}),
    //   promiseGetCompanyRequests({"statusId":"SID_ORG_REJECTED"}),
    //   promiseGetAutoApprovalStatus({})
    // ]).then(function (responses) {
    //   self.hideRequestsLoadingScreen();
    //   self.presentUserInterface("frmEnrollmentRequests", {"rejectedRequestsData" : responses[1].contract,"pendingRequestsData" : responses[0].contract, action:"ViewRequestsList","BusinessConfigurations":responses[2].BusinessConfigurationRecords} );
    // }).catch(function (res) {
    //   self.hideRequestsLoadingScreen();
    //   self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(res));
    // });	

    Promise.all([
      promiseGetAutoApprovalStatus({})
    ]).then(function (responses) {
      self.hideRequestsLoadingScreen();
      self.presentUserInterface("frmEnrollmentRequests", {"rejectedRequestsData" :  [
        {
            "serviceType": "TYPE_ID_RETAIL",
            "servicedefinitionName": "Sole Proprietor (Retail Type)",
            "faxId": "abcd",
            "statusId": "SID_CONTRACT_ACTIVE",
            "name": "Kony Global201120",
            "id": "1606129095",
            "servicedefinitionId": "707dfea8-d0fe-4154-89c3-e7d7ef2ee16a",
            "createdts": "2020-11-20 11:16:29.0"
        },
        {
            "serviceType": "TYPE_ID_RETAIL",
            "servicedefinitionName": "Sole Proprietor (Retail Type)",
            "faxId": "abcd",
            "statusId": "SID_CONTRACT_ACTIVE",
            "name": "Kony Global20112001",
            "id": "2502836677",
            "servicedefinitionId": "707dfea8-d0fe-4154-89c3-e7d7ef2ee16a",
            "createdts": "2020-11-20 19:30:36.0"
        },
        {
            "serviceType": "TYPE_ID_RETAIL",
            "servicedefinitionName": "Sole Proprietor (Retail Type)",
            "faxId": "abcd",
            "statusId": "SID_CONTRACT_ACTIVE",
            "name": "Kony Global2011",
            "id": "6466843933",
            "servicedefinitionId": "707dfea8-d0fe-4154-89c3-e7d7ef2ee16a",
            "createdts": "2020-11-20 10:45:43.0"
        }
    ],"pendingRequestsData" :  [
      {
          "serviceType": "TYPE_ID_RETAIL",
          "servicedefinitionName": "Sole Proprietor (Retail Type)",
          "faxId": "abcd",
          "statusId": "SID_CONTRACT_ACTIVE",
          "name": "Kony Global201120",
          "id": "1606129095",
          "servicedefinitionId": "707dfea8-d0fe-4154-89c3-e7d7ef2ee16a",
          "createdts": "2020-11-20 11:16:29.0"
      },
      {
          "serviceType": "TYPE_ID_RETAIL",
          "servicedefinitionName": "Sole Proprietor (Retail Type)",
          "faxId": "abcd",
          "statusId": "SID_CONTRACT_ACTIVE",
          "name": "Kony Global20112001",
          "id": "2502836677",
          "servicedefinitionId": "707dfea8-d0fe-4154-89c3-e7d7ef2ee16a",
          "createdts": "2020-11-20 19:30:36.0"
      },
      {
          "serviceType": "TYPE_ID_RETAIL",
          "servicedefinitionName": "Sole Proprietor (Retail Type)",
          "faxId": "abcd",
          "statusId": "SID_CONTRACT_ACTIVE",
          "name": "Kony Global2011",
          "id": "6466843933",
          "servicedefinitionId": "707dfea8-d0fe-4154-89c3-e7d7ef2ee16a",
          "createdts": "2020-11-20 10:45:43.0"
      }
  ], action:"ViewRequestsList","BusinessConfigurations":responses[0].BusinessConfigurationRecords} );
    }).catch(function (res) {
      self.hideRequestsLoadingScreen();
      self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(res));
    });	
  };
  PresentationController.prototype.getAllEnrollmentRequests = function () {
    var self = this;
    self.showRequestsLoadingScreen();
    var promiseGetCompanyRequests = Promisify(this.businessController, 'getListOfContractsByStatus');
    var promiseGetAutoApprovalStatus = Promisify(this.businessController, 'fetchBusinessConfigurations');
    Promise.all([
      promiseGetCompanyRequests({"statusId":"SID_CONTRACT_PENDING"}),
      promiseGetCompanyRequests({"statusId":"SID_CONTRACT_REJECTED"}),
      promiseGetAutoApprovalStatus({})
    ]).then(function (responses) {
      self.hideRequestsLoadingScreen();
      self.presentUserInterface("frmEnrollmentRequests", {"rejectedRequestsData" : responses[1].contract,"pendingRequestsData" : responses[0].contract, action:"ViewRequestsList","BusinessConfigurations":responses[2].BusinessConfigurationRecords} );
    }).catch(function (res) {
      self.hideRequestsLoadingScreen();
      self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(res));
    });	
  };
  PresentationController.prototype.getEnrolledCompanyDetails = function (context) {
    var self = this;
    self.showRequestsLoadingScreen();
    var promiseGetCompanyDetailsList = Promisify(this.businessController, 'getCompanyDetails');
    var promiseGetCompanyAccountsList = Promisify(this.businessController, 'getCompanyAccounts');
    var promiseFetchConfiguration = Promisify(this.businessController, 'getCoreTypeInformation');
    var promiseGetFeaturesActionsList = Promisify(this.businessController, 'getCompanyFeaturesActionsLimits');
    var promiseFetchFeature = Promisify(this.businessController, 'getAllFeatures');
    Promise.all([
      promiseGetCompanyDetailsList({"id":context.id}),
      promiseGetCompanyAccountsList({"Organization_id":context.id}),
      promiseGetFeaturesActionsList({"organization_id":context.id}),
      promiseFetchFeature(context),
      promiseFetchConfiguration({})
    ]).then(function (responses) {
      self.globalDetails.CompanyContext = responses[0].OrganisationDetails;
      self.globalDetails.OwnerContext = responses[0].OrganisationOwnerDetails; 
      self.globalDetails.accountContext = responses[1].OgranizationAccounts;
      self.globalDetails.featuresContext = responses[2].FeatureActions;
      self.isAccountCentricCore = responses[4].isAccountCentricCore;
      self.globalDetails.allfeatures = responses[3];
      context.features = responses[0];
      self.presentUserInterface("frmEnrollmentRequests",{"coreTypeConfig":responses[4]});
      self.hideRequestsLoadingScreen();
      self.presentUserInterface("frmEnrollmentRequests",{"action":"companyDetails",
                                                "companyDetails":self.globalDetails});
    }).catch(function (res) {
      self.hideRequestsLoadingScreen();
      kony.print("getEnrolledCompanyDetails(presentation controller): not able to fetch company details",res);
      self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(res));
    });	
  };
  PresentationController.prototype.getEnrolledContractDetails = function (context) {
    var self = this;
    self.showRequestsLoadingScreen();
    var promiseGetContractDetailsList = Promisify(this.businessController, 'getContractDetails');
    var promiseFetchConfiguration = Promisify(this.businessController, 'getCoreTypeInformation');
    var promiseGetInfinityUsersList = Promisify(this.businessController, 'getContractInfinityUsers');

    Promise.all([
      promiseGetContractDetailsList({
        "contractId": context.id 
      }),
      promiseGetInfinityUsersList({
        "contractId": context.id 
      }),
      promiseFetchConfiguration({})
    ]).then(function (responses) {
      self.globalDetails.CompanyContext = responses[0];
      self.globalDetails.OwnerContext = responses[1];
      self.globalDetails.accountContext = responses[0].contractCustomers;
      self.hideRequestsLoadingScreen();
      self.presentUserInterface("frmEnrollmentRequests",{"action":"companyDetails",
                                                         "companyDetails":self.globalDetails});
    }).catch(function (res) {
      self.hideRequestsLoadingScreen();
      kony.print("getEnrolledCompanyDetails(presentation controller): not able to fetch company details",res);
      self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(res));
    });
  };
  PresentationController.prototype.updateContractStatus = function(command) {
    var self = this;
    var context={};
    var message="";
    self.showRequestsLoadingScreen();
    function successCallback(response) {
      self.hideRequestsLoadingScreen();
      self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),message);
      self.getAllEnrollmentRequests();
    }
    function failureCallback(error) {
      self.hideRequestsLoadingScreen();
      self.showRequestsToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    if(command.statusId==="SID_CONTRACT_REJECTED"){
      context={
        "contractId":command.contractId,
        "statusId":"SID_CONTRACT_REJECTED",
        "rejectedReason":command.rejectedReason,
        "rejectedBy":command.rejectedBy
      };
      message=command.companyName+" Company request is rejected successfully";
      self.businessController.updateContractStatus(context, successCallback, failureCallback);
    }else{
      context={
        "contractId":command.contractId,
        "statusId": "SID_CONTRACT_ACTIVE"
      };
      message=command.companyName+" Company request is approved successfully";
      self.businessController.updateContractStatus(context, successCallback, failureCallback);
    }
  };
  PresentationController.prototype.showRequestsLoadingScreen = function() {
    var self = this;
    self.presentUserInterface("frmEnrollmentRequests",{"loadingScreen":{"focus":true}});
  };
  PresentationController.prototype.hideRequestsLoadingScreen = function() {
    var self = this;
    self.presentUserInterface("frmEnrollmentRequests",{"loadingScreen":{"focus":false}});
  };
  PresentationController.prototype.showRequestsToastMessage = function(status,message) {
    var self = this;
    self.presentUserInterface("frmEnrollmentRequests",{"toastMessage":{"status":status,
                                                              "message":message}});
  };
  // create contract related functions
  
  PresentationController.prototype.searchCoreCustomers = function(payload) {
    var self = this; 
    var coreSearchData=[];
    function onSuccess(response) {
      self.hideLocationsLoadingScreen();
      coreSearchData = response.customers;
      self.presentCompaniesScreen({"coreCustomerSearch":coreSearchData});
    }
    function onError(error) {
      self.hideLocationsLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.showLoadingScreen();
    this.businessController.searchCoreCustomers(payload, onSuccess, onError);
  };
  PresentationController.prototype.getRelatedCoreCustomers = function(payload) {
    var self = this; 
    var coreRelatedCustomers=[];
    function onSuccess(response) {
      self.hideLocationsLoadingScreen();
      coreRelatedCustomers = response.customers;
      self.presentCompaniesScreen({"coreRelatedCustomers":coreRelatedCustomers,"coreCustomerId" : payload.coreCustomerId});
    }

    function onError(error) {
      self.hideLocationsLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.showLoadingScreen();
    this.businessController.getCoreRelativeCustomers(payload, onSuccess, onError);
  };
  PresentationController.prototype.getSearchContract = function(payload) {
    var self = this;
    var coreRelatedCustomers = [];

    function onSuccess(response) {
      
        self.hideLoadingScreen();
        self.presentCompaniesScreen({
            "searchData": response
        });
    }

    function onError(error) {
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"), ErrorInterceptor.errorMessage(error));
        self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getSearchContract(payload, onSuccess, onError);
};

  PresentationController.prototype.fetchServiceDefinitions = function(payload) {
    var self = this; 
    var serviceDefinitions=[];
    function onSuccess(response) {
      serviceDefinitions = response.ServiceDefinitionRecords;
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"serviceDefinitions":serviceDefinitions});
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
      
    }
    this.showLoadingScreen();
    this.businessController.getServiceDefinition(payload, onSuccess, onError);
  };
  PresentationController.prototype.getServiceDefinitionsForContracts = function(payload) {
    var self = this; 
    var serviceDefinitions=[];
    function onSuccess(response) {
      serviceDefinitions = response.ServiceDefinitionRecords;
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"serviceDefinitions":serviceDefinitions});
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
      
    }
    this.showLoadingScreen();
    this.businessController.getServiceDefinitionsForContracts(payload, onSuccess, onError);
  };
  PresentationController.prototype.getCoreCustomerAccounts = function(payload) {
    var self = this; 
    var coreCustomerAccounts=[];
    function onSuccess(response) {
      coreCustomerAccounts = response.coreCustomerAccounts;
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"coreCustomerAccounts":coreCustomerAccounts});
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getCoreCustomerAccounts(payload, onSuccess, onError);
  };
  PresentationController.prototype.getServiceDefinitionActionLimit = function(payload) {
    var self = this; 
    var serviceDefinitionFeatures=[];
    function onSuccess(response) {
      serviceDefinitionFeatures = response.features;
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"serviceDefinitionFeatures":serviceDefinitionFeatures});
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getFeaturesAndActions(payload, onSuccess, onError);
  };
  PresentationController.prototype.getServiceDefinitionFeaturesAndLimits = function(payload) {
    var self = this; 
    var serviceDefinitionFeatures=[];
    function onSuccess(response) {
      serviceDefinitionFeatures = response;
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"serviceDefinitionFeaturesLimits":serviceDefinitionFeatures});
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getServiceDefinitionFeaturesAndLimits(payload, onSuccess, onError);
  };
  PresentationController.prototype.getServiceDefinitionMonetaryActions = function(payload) {
    var self = this; 
    var serviceDefinitionFeatures=[];
    function onSuccess(response) {
      serviceDefinitionFeatures = response;
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"serviceDefinitionMonetaryActions":serviceDefinitionFeatures});
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.getServiceDefinitionMonetaryActions(payload, onSuccess, onError);
  };
  PresentationController.prototype.getCoreRelativeCustomers = function(payload) {
    var self = this; 
    var coreRelatedCustomers=[];
    function onSuccess(response) {
      coreRelatedCustomers = response.customers ? response.customers :[];
      if(coreRelatedCustomers.length > 0)
        self.presentCompaniesScreen({"coreRelativeCustomers":coreRelatedCustomers});
      else
        self.presentCompaniesScreen({"coreRelativeCustomersError":[]});
    }
    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.presentCompaniesScreen({"coreRelativeCustomersError":[]});
    }
    this.businessController.getCoreRelativeCustomers(payload, onSuccess, onError);
  };
  PresentationController.prototype.createContract = function (context) {
    var self = this; 
    var payload={};
    payload.contractName= context.contractName;
    payload.serviceDefinitionName= context.serviceDefinitionName;
    payload.serviceDefinitionId= context.serviceDefinitionId;
    payload.faxId= context.faxId;
    payload.communication=JSON.stringify(context.communication);
    payload.address=JSON.stringify(context.address);
    payload.contractCustomers=JSON.stringify(context.contractCustomers);
    function completionCreateContractCallback(response) {
	if(response['status'] === "Failure"){
       self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
       self.hideLoadingScreen();
      }else{
       self.presentUserInterface("frmCompanies",{
         "createContractSuccess":{"contractId":response.contractId,"message":"Contract has been created successfully"}
       });
      }
    }

    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.createContract(payload, completionCreateContractCallback, onError);
  };
  PresentationController.prototype.editContract = function (context) {
    var self = this; 
    var payload={};
    payload.contractId=context.contractId;
    payload.contractName= context.contractName;
    payload.serviceDefinitionName= context.serviceDefinitionName;
    payload.serviceDefinitionId= context.serviceDefinitionId;
    payload.faxId= context.faxId;
    payload.communication=JSON.stringify(context.communication);
    payload.address=JSON.stringify(context.address);
    payload.contractCustomers=JSON.stringify(context.contractCustomers);
    function completionCreateContractCallback(response) {
	if(response['status'] === "Failure"){
       self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(response));
       self.hideLoadingScreen();
      }else{
       self.presentUserInterface("frmCompanies",{
         "editContractSuccess":{"contractId":context.contractId,"message":"Contract has been updated successfully"}
       });
      }
    }
    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.hideLoadingScreen();
    }
    this.showLoadingScreen();
    this.businessController.editContract(payload, completionCreateContractCallback, onError);
  };
  PresentationController.prototype.getCustomerStatusList = function(payload) {
    var self = this; 
    var customerStatusList=[];
    function onSuccess(response) {
      customerStatusList = response.Configuration ;
      self.presentCompaniesScreen({"customerStatusList":customerStatusList});
    }
    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getConfigurations(payload, onSuccess, onError);
  };
  PresentationController.prototype.getAllEligibleRelationalCustomers = function(payload) {
    var self = this; 
    var coreRelatedCustomers=[];
    function onSuccess(response) {
      coreRelatedCustomers = response.customers ? response.customers :[];
      if(coreRelatedCustomers.length > 0)
        self.presentCompaniesScreen({"AllEligibleRelationalCustomers":coreRelatedCustomers});
      else
        self.presentCompaniesScreen({"AllEligibleRelationalCustomersError":[]});
    }
    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.presentCompaniesScreen({"AllEligibleRelationalCustomersError":[]});
    }
    this.businessController.getAllEligibleRelationalCustomers(payload, onSuccess, onError);
  };
  PresentationController.prototype.customerSearch = function(payload) {
    var self = this; 
    function onSuccess(response) {
      if(response.records.length > 0)
        self.presentCompaniesScreen({"customerSearch":response.records});
      else
        self.presentCompaniesScreen({"AllEligibleRelationalCustomersError":[]});
    }
    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      self.presentCompaniesScreen({"AllEligibleRelationalCustomersError":[]});
    }
    this.businessController.customerSearch(payload, onSuccess, onError);
  };
  PresentationController.prototype.getServiceDefinitionRoles = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"serviceDefRoles":response.roles});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getServiceDefinitionRoles(payload, onSuccess, onError);
  };
  PresentationController.prototype.getCoreCustomerRoleFeatureActionLimits = function(payload) {
    var self = this; 
    self.showLoadingScreen();    
    self.globalDetails = { };
		var promiseGetContractList = Promisify(this.businessController, 'getCoreCustomerRoleFeatureActionLimits');
	var promiseGetSignatoryList = Promisify(this.businessController,'getAllSignatoryGroupsbyCoreCustomerIds');
	Promise.all([
      promiseGetContractList(payload),
      promiseGetSignatoryList({
        "coreCustomerIds": [payload.coreCustomerRoleIdList[0].coreCustomerId]
      }),
    ]).then(function (response){    
   // function onSuccess(response) {
      self.presentCompaniesScreen({"serviceDefinitionRoles":response});
      self.hideLoadingScreen();
    }).catch(function (res) {
    //function onError(error) {
      self.hideLoadingScreen();
   //   self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    });
   //this.businessController.getCoreCustomerRoleFeatureActionLimits(payload, onSuccess, onError);
  };
  /*
   * @name setAccountsFeaturesForEnrollCust
   * @member CustomerManagementModule.presentationController
   */
  PresentationController.prototype.setAccountsFeaturesForAddUser = function (custId,accountsFeaturesObj) {
    var custAccFeaturesObj = {"accounts" : accountsFeaturesObj.accounts,
                              "features" : accountsFeaturesObj.features,
                              "accLevelFeatures":accountsFeaturesObj.accLevelFeatures,
                              "nonAccLevelFeatures": accountsFeaturesObj.nonAccLevelFeatures,
                              "accountMapFeatures": accountsFeaturesObj.accountMapFeatures,
                              "accLevelLimits" : accountsFeaturesObj.accLevelLimits,
                              "limitGroups" : accountsFeaturesObj.limitGroups,
                              "signatoryGroups":accountsFeaturesObj.signatoryGroups,
                              "limits": accountsFeaturesObj.limits,
                              "customerDetails" : accountsFeaturesObj.isPrimary === true ?this.CustomerBasicInfo.customer : null,
                              "isPrimary" : accountsFeaturesObj.isPrimary};
    this.AddUserAccountsFeatures[custId] = custAccFeaturesObj;
  };
  /*
   * @name deleteAccountsFeaturesForEnrollCust
   * @member CustomerManagementModule.presentationController
   */
  PresentationController.prototype.deleteAccountsFeaturesForAddUser = function(custId){
    if(this.AddUserAccountsFeatures[custId])
      delete this.AddUserAccountsFeatures[custId];
  };
  /*
   * @name getAccountsFeaturesForEnrollCust
   * @member CustomerManagementModule.presentationController
   * @param: customer id
   */
  PresentationController.prototype.getAccountsFeaturesForAddUser = function (custId) {
    if(custId){
      return this.AddUserAccountsFeatures[custId];
    } else{
      return this.AddUserAccountsFeatures;
    }
  };
  
  PresentationController.prototype.createInfinityUser = function(context){
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"createInfinityUser":response});
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),"Infinity User Created Successfully");
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.createInfinityUser(context, onSuccess, onError);
  };
  PresentationController.prototype.editInfinityUser = function(context){
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"editInfinityUser":response});
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),"Infinity User Created Successfully");
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.editInfinityUser(context, onSuccess, onError);
  };
  PresentationController.prototype.getContractUser = function(){
     return this.globalDetails.signatoryUsers;
   };
  PresentationController.prototype.getAutoSyncAccountsFlag = function(payload) {
    var self = this; 
    function onSuccess(response) {
      self.presentCompaniesScreen({"autoSyncAccountsFlag":response.Configuration});
    }
    function onError(error) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getConfigurations(payload, onSuccess, onError);
  };
  
  PresentationController.prototype.updateSignatoryGroups = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCompaniesController.deleteViewSignatoryGroup.successToastMessage"));
      self.getSignatoryGroupDetails({"signatoryGroupId":response.signatoryGroupId },false);        
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.updateSignatoryGroups(payload, onSuccess, onError);
  };

  PresentationController.prototype.updateSignatoryGroupDetails = function(payload,isView) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentUserInterface("frmCompanies",{
         "createGroupSuccess":{"contractId":payload.contractId,"message":"Signatory Group has been updated successfully","isView":isView,"signGroupId":payload.signatoryGroupId}
       });
      
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.updateSignatoryGroups(payload, onSuccess, onError);
  };

  
  PresentationController.prototype.isSignatoryGroupEligibleForDelete = function(payload, isView) {
    var self = this; 
    var inputReq ={"signatoryGroupId":payload.signatoryGroupId,
                   "signatoryGroupName":payload.signatoryGroupName
                  };
    self.showLoadingScreen();
    function onSuccess(response) {     
      self.presentCompaniesScreen({"isElegibleForDelete":response.status,
                                   "signatoryGroupName":inputReq.signatoryGroupName,
                                   "signatoryGroupId":inputReq.signatoryGroupId,
                                   "isViewScreen":isView
                                  });
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.isSignatoryGroupEligibleForDelete(inputReq, onSuccess, onError);
  };  
   
  PresentationController.prototype.deleteSignatoryGroup = function(payload) {
    var self = this; 
    var inpuReq={"signatoryGroupName":payload.signatoryGroupName};
    var inputRequest = {"contractId":payload.contractId,
                       "signatoryGroupId":payload.signatoryGroupId};
    self.showLoadingScreen();
    function onSuccess(response) {
        self.showToastMessage("Signatory Group "+inpuReq.signatoryGroupName+" has been deleted successfully.");
       self.getAllSignatoryGroups({"contractId":payload.contractId});
     //  self.showToastMessage("Signatory Group "+inpuReq.signatoryGroupName+" has been deleted successfully.");
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.deleteSignatoryGroup(inputRequest, onSuccess, onError);
  };
  
  PresentationController.prototype.getAllSignatoryGroups = function(payload,tabOption) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"signatoryGroups":response,"tab":tabOption || ""});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getAllSignatoryGroups(payload, onSuccess, onError);
  };
  PresentationController.prototype.getSignatoryGroupDetails = function(payload,isEdit) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"signatoryGroupDetails":response,"isEdit":isEdit});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"), ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getSignatoryGroupDetails(payload, onSuccess, onError);
  };
  PresentationController.prototype.getNoGroupUsers = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"noGroupUsers":response.EligibleSignatories});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getNoGroupUsers(payload, onSuccess, onError);
  };
  PresentationController.prototype.getApprovalPermissionsForUser = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"approvalPermissions":response});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getApprovalPermissionsForUser(payload, onSuccess, onError);
  };
  PresentationController.prototype.createSignatoryGroup = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentUserInterface("frmCompanies",{
         "createGroupSuccess":{"contractId":payload.contractId,"message":"Signatory Group has been created successfully","isView":false}
       });
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.createSignatoryGroup(payload, onSuccess, onError);
  };
      
         /****** APPROVAL MATRIX *****/
  /*
   * @name getApprovalMatrix
   * @member CompaniesModule.presentationController
   * @param: {"contractId": "","cif":""}, isAccount level(true/false)
   */
  PresentationController.prototype.getApprovalMatrixByCif = function(payload, isAccountLevel) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"approvalMatrixOfCif":response,
                                   "isAccountLevel":isAccountLevel});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getApprovalMatrix(payload, onSuccess, onError);
  };
  /*
   * @name getApprovalMatrixByContractId
   * @member CompaniesModule.presentationController
   * @param: {"contractId": ""}, is signatory group call required(true/false)
   */
  PresentationController.prototype.getApprovalMatrixByContractId = function(payload,isSGReq) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      if(isSGReq === true)
        self.getAllSignatoryGroups(payload,2);
      self.presentCompaniesScreen({"action":"contractApprovalMatrix",
                                   "approvalMatrix":response});
      //self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getApprovalMatrixByContractId(payload, onSuccess, onError);
  };
  /*
   * @name getApprovalRules
   * @member CompaniesModule.presentationController
   * @param: {"contractId":"","cifId": "","accountId": "","featureId": "","actionId":"","limitTypeId": ""}
   */
  PresentationController.prototype.getApprovalRules = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen();
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getApprovalRules(payload, onSuccess, onError);
  };
  /*
   * @name getApproversInSignatoryGroup
   * @member CompaniesModule.presentationController
   * @param: {"signatoryGroupId":""}
   */
  PresentationController.prototype.getApproversInSignatoryGroup = function(payload) {
    var self = this;
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen();
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.getApproversInSignatoryGroup(payload, onSuccess, onError);
  };
  /*
   * @name createApprovalRuleUserLevel
   * @member CompaniesModule.presentationController
   * @param: create payload, selected action name
   */
  PresentationController.prototype.createApprovalRuleUserLevel = function(payload, actionName) {
    var self = this;
    self.showLoadingScreen();
    var reqParam ={
      "contractId": payload.contractId,
      "cif": payload.cif
    };
    var isAccountLevel = payload.accountId ? true : false;
    function onSuccess(response) {
      var successMsg = kony.i18n.getLocalizedString("i18n.frmCompanies.ApprovalRulesForAction") + "\"" +actionName+
          "\"" + kony.i18n.getLocalizedString("i18n.frmCompanies.haveBeenAddedSuccessfully");
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),successMsg);
      self.getApprovalMatrixByCif(reqParam, isAccountLevel);
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.createApprovalRuleUserLevel(payload, onSuccess, onError);
  };
  /*
   * @name createApprovalRuleSGLevel
   * @member CompaniesModule.presentationController
   * @param: create payload, selected action name
   */
  PresentationController.prototype.createApprovalRuleSGLevel = function(payload, actionName) {
    var self = this;
    var reqParam ={
      "contractId": payload.contractId,
      "cif": payload.cif
    };
    var isAccountLevel = payload.accountId ? true : false;
    self.showLoadingScreen();
    function onSuccess(response) {
      var successMsg = kony.i18n.getLocalizedString("i18n.frmCompanies.ApprovalRulesForAction") + "\"" +actionName+
          "\"" + kony.i18n.getLocalizedString("i18n.frmCompanies.haveBeenAddedSuccessfully");
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),successMsg);
      self.getApprovalMatrixByCif(reqParam, isAccountLevel);
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.createApprovalRuleSGLevel(payload, onSuccess, onError);
  };
  /*
   * @name updateApprovalRuleUserLevel
   * @member CompaniesModule.presentationController
   * @param: update payload, selected action name, is delete action
   */
  PresentationController.prototype.updateApprovalRuleUserLevel = function(payload, actionName, isDelete) {
    var self = this;
    self.showLoadingScreen();
    var reqParam ={
      "contractId": payload.contractId,
      "cif": payload.cif
    };
    var isAccountLevel = payload.accountId ? true : false;
    function onSuccess(response) {
      var msg = isDelete === false ? kony.i18n.getLocalizedString("i18n.frmCompanies.haveBeenUpdatedSuccessfully"): kony.i18n.getLocalizedString("i18n.frmCompanies.deletedSuccessfully");
      var successMsg = kony.i18n.getLocalizedString("i18n.frmCompanies.ApprovalRulesForAction") + "\"" +actionName+
          "\"" + msg;
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),successMsg);
      self.getApprovalMatrixByCif(reqParam, isAccountLevel);
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.updateApprovalRuleUserLevel(payload, onSuccess, onError);
  };
  /*
   * @name updateApprovalRuleSGLevel
   * @member CompaniesModule.presentationController
   * @param: update payload, selected action name, is delete action
   */
  PresentationController.prototype.updateApprovalRuleSGLevel = function(payload, actionName, isDelete) {
    var self = this; 
    var reqParam ={
      "contractId": payload.contractId,
      "cif": payload.cif
    };
    var isAccountLevel = payload.accountId ? true : false;
    self.showLoadingScreen();
    function onSuccess(response) {
      var msg = isDelete === false ? kony.i18n.getLocalizedString("i18n.frmCompanies.haveBeenUpdatedSuccessfully"): kony.i18n.getLocalizedString("i18n.frmCompanies.deletedSuccessfully");
      var successMsg = kony.i18n.getLocalizedString("i18n.frmCompanies.ApprovalRulesForAction") + "\"" +actionName+
          "\"" + msg;
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),successMsg);
      self.getApprovalMatrixByCif(reqParam, isAccountLevel);
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.updateApprovalRuleSGLevel(payload, onSuccess, onError);
  };
  /*
   * @name updateApprovalMode
   * @member CompaniesModule.presentationController
   * @param: {"coreCustomerId": "","contractId": "","isGroupLevel":"1"}
   */
  PresentationController.prototype.updateApprovalMode = function(payload) {
    var self = this; 
    var reqParam ={
      "contractId": payload.contractId
    };
    self.showLoadingScreen();
    function onSuccess(response) {
      self.getApprovalMatrixByContractId(reqParam, true);
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.updateApprovalMode(payload, onSuccess, onError);
  };
  /*
   * @name isApprovalMatrixDisabled
   * @member CompaniesModule.presentationController
   * @param: {"contractId": "","cif": "",}
   */
  PresentationController.prototype.isApprovalMatrixDisabled = function(payload) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.hideLoadingScreen();
      self.presentCompaniesScreen({"isApprovalDisabled":response.isDisabled});
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.isApprovalMatrixDisabled(payload, onSuccess, onError);
  };
  /*
   * @name updateApprovalMatrixStatus
   * @member CompaniesModule.presentationController
   * @param: {"contractId": "","cif": "","disable": "true"}
   */
  PresentationController.prototype.updateApprovalMatrixStatus = function(payload, customerNameId) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.hideLoadingScreen();
      var toastMsgText = payload.disable === "true" ? kony.i18n.getLocalizedString("i18n.frmCompanies.ApprovalsDisabledSuccessfully") +customerNameId:
              kony.i18n.getLocalizedString("i18n.frmCompanies.ApprovalsEnabledSuccessfully") + customerNameId;
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmCustomerCareController.success"),toastMsgText);
    }
    function onError(error) {
      self.hideLoadingScreen();
      self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
    }
    this.businessController.updateApprovalMatrixStatus(payload, onSuccess, onError);
  };
   /*
   * @name getAccountActionCustomerApproverList
   * @member CompaniesModule.presentationController
   * @param: {"contractId": "","cif": "","accountId": "","actionId":""}, isCreateFlow,selectedCardInfo
   */
  PresentationController.prototype.getAccountActionCustomerApproverList = function(payload,selectedCardInfo) {
    var self = this; 
    self.showLoadingScreen();
    function onSuccess(response) {
      self.presentCompaniesScreen({"approversList":response.Approvers || [],
                                   "selectedCardInfo":selectedCardInfo});
      self.hideLoadingScreen();
    }
    function onError(error) {
      self.hideLoadingScreen();
      if(error.dbpErrCode=== 10712){ //no approvers error
        self.presentCompaniesScreen({"approversList":[],
                                     "selectedCardInfo":selectedCardInfo
                                    });
      } else{
        self.showToastMessage(kony.i18n.getLocalizedString("i18n.frmGroupsController.error"),ErrorInterceptor.errorMessage(error));
      }
    }
    this.businessController.getAccountActionCustomerApproverList(payload, onSuccess, onError);
  };
          /****** APPROVAL MATRIX - end *****/
  
  return PresentationController;
});