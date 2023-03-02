define(['ErrorInterceptor', 'ErrorIsNetworkDown','Promisify'], function (ErrorInterceptor, isNetworkDown, Promisify) {

  function ServicesManagement_PresentationController() {
    kony.mvc.Presentation.BasePresenter.call(this);
  }

  inheritsFrom(ServicesManagement_PresentationController, kony.mvc.Presentation.BasePresenter);

  ServicesManagement_PresentationController.prototype.initializePresentationController = function() {
    var self = this;
    ErrorInterceptor.wrap(this, 'businessController').match(function(on){
      return [
        on(isNetworkDown).do(function(){
          self.presentUserInterface("frmServiceManagement",{
            NetworkDownMessage : {}
          });
        })
      ];
    });
  };
   /**
     * @name showFeatures
     * @member ServicesManagementModule.presentationController
     * 
     */
  ServicesManagement_PresentationController.prototype.showFeatures = function() {
    var self = this;
    self.showLoadingScreen();
    var promiseGetAllFeatures = Promisify(this.businessController, 'getAllFeatures');
    var promiseFetchAllLocale = Promisify(this.businessController, 'getAllLocaleLanguagesList');
    var promiseGetAllFacilities = Promisify(this.businessController, 'getAllFacilities');
    
    Promise.all([
      promiseGetAllFeatures({}),
      promiseFetchAllLocale({}),
      promiseGetAllFacilities({})
    ]).then(function (responses) {
      var context = {
        featuresList : responses[0].features,
        localeLanguages : responses[1],
        facilitiesList : responses[2]
      };
      self.showFeaturesScreen(context);
      self.hideLoadingScreen();
    }).catch(function (error) {
      self.hideLoadingScreen();
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
    });
  };


 /**
     * @name fetchAllFeatures
     * @member ServicesManagementModule.presentationController
     * 
     */
  ServicesManagement_PresentationController.prototype.fetchAllFeatures = function () {
    var self = this;

    function successCallback(response) {
      self.showFeaturesScreen({
        featuresList : response.features
      });
      self.hideLoadingScreen();
    }

    function failureCallback(error) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
      self.hideLoadingScreen();
    }

    self.showLoadingScreen();
    self.businessController.getAllFeatures({}, successCallback, failureCallback);
  };
  /*
      * function to call command handler to update a service
      * @param : edited request
      */
  ServicesManagement_PresentationController.prototype.updateFeature = function (editedParamReq) {
    var self = this;

    function successCallback(response) {
      self.fetchAllFeatures();
      self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.Feature_edited_msg"), "success");
    }

    function failureCallback(response) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(response), "error");
      self.hideLoadingScreen();
    }

    self.showLoadingScreen();
    self.businessController.updateService(editedParamReq, successCallback, failureCallback);
  };

 
  /*
      * function to call command handler to update a service
      * @param : edited request,opt (1-list or 2-details)
      */
  ServicesManagement_PresentationController.prototype.updateStatusOfFeature = function (editedParamReq,opt) {
    var self = this;
    var status = editedParamReq.statusId;
    function successCallback(response) {
      if(status === "SID_FEATURE_ACTIVE"){
        self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.FeatureActivatedSuccessfully"), "success");
      } else{
        self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.FeatureDeactivatedSuccessfully"), "success");
      }      
      self.fetchAllFeatures();  
    }

    function failureCallback(response) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(response), "error");
      self.hideLoadingScreen();
    }

    self.showLoadingScreen();
    self.businessController.updateService(editedParamReq, successCallback, failureCallback);
  };
  
    /*
      * function to call command handler to update an action status
      * @param : edited request,feature id for setting context after update
      */
  ServicesManagement_PresentationController.prototype.updateStatusOfAction = function (editedParamReq,featureId) {
    var self = this;
    var status = editedParamReq.status;
    function successCallback(response) {
      if(status === "SID_ACTION_ACTIVE"){
        self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagementController.successMsg.ActivateAction"), "success");
      } else{
        self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagementController.successMsg.DeactivateAction"), "success");
      }      
      self.getActionsOfFeature({
        "context": "detailsView",
        "requestParam": {"featureId": featureId }
      });
    }

    function failureCallback(response) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(response), "error");
      self.hideLoadingScreen();
    }

    self.showLoadingScreen();
    self.businessController.updateActionStatus(editedParamReq, successCallback, failureCallback);
  };
/**
     * @name getFeaturesMasterData
     * @member ServicesManagementModule.presentationController
     * 
     */
  ServicesManagement_PresentationController.prototype.getFeaturesMasterData = function () {
    var self = this;
    self.showLoadingScreen();
    function successCallback(response) {
      self.hideLoadingScreen();
      self.showFeaturesScreen({
        localeLanguages :  response
      });
    }
    function failureCallback(response) {
      self.hideLoadingScreen();
    }
    self.businessController.getAllLocaleLanguagesList({}, successCallback, failureCallback);
  };

  /**
    * @name getActionsOfFeature
    * @member ServicesManagementModule.presentationController
    * 
    */
  ServicesManagement_PresentationController.prototype.getActionsOfFeature = function (inputParam) {
    var self = this;
    self.showLoadingScreen();
    var context = inputParam.context;
    var inputReq = inputParam.requestParam;
    function successCallback(response) {
      self.showFeaturesScreen({
        context: context,
        actionsOfFeature :  response.actions
      });
      self.hideLoadingScreen();
    }
    function failureCallback(error) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
      self.hideLoadingScreen();
    }
    self.businessController.getActionsOfFeature(inputReq, successCallback, failureCallback);
  };
  
  /**
    * @name getLimitGroups
    * @member ServicesManagementModule.presentationController
    * 
    */
  ServicesManagement_PresentationController.prototype.getLimitGroups = function () {
    var self = this;
    self.showLoadingScreen();
    function successCallback(response) {
      self.showFeaturesScreen({
        limitGroups :  response
      });
      self.hideLoadingScreen();
    }
    function failureCallback(error) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
      self.hideLoadingScreen();
    }
    self.businessController.getLimitGroups({},successCallback, failureCallback);
  };
  
  /**
    * @name editLimitGroup
    * @member ServicesManagementModule.presentationController
    * 
    */
  ServicesManagement_PresentationController.prototype.editLimitGroup = function (inputparam) {
    var self = this;
    self.showLoadingScreen();
    function successCallback(response) {
      self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.LimitGroupUpdatedSuccessfully"), "success");
      self.getLimitGroups();
    }
    function failureCallback(error) {
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
      self.hideLoadingScreen();
    }
    self.businessController.editLimitGroup(inputparam,successCallback, failureCallback);
  };

 /**
     * @name showFeaturesScreen
     * @member ServicesManagementModule.presentationController
     * @param {servicesList : [{Description : object, DisplayDescription : object, WorkSchedule_Desc : object, IsSMSAlertActivated : object, IsAgreementActive : object, BeneficiarySMSCharge : object, TransactionFee_id : object, Channel_id : object, IsFutureTransaction : object, Name : object, IsOutageMessageActive : object, IsBeneficiarySMSAlertActivated : object, MinTransferLimit : object, MaxTransferLimit : object, createdby : object, DisplayName : object, HasWeekendOperation : object, id : object, TransactionCharges : object, TransactionFees : object, Status : object, Type_Name : object, Status_id : object, Channel : object, IsAuthorizationRequired : object, SMSCharges : object, TransferDenominations : object, Category_Name : object, IsCampaignActive : object, Code : object, WorkSchedule_id : object, Category_Id : object, IsTCActive : object, IsAlertActive : object, TransactionLimit_id : object, Type_id : object, PeriodicLimits : object}]} viewModel
     */
  ServicesManagement_PresentationController.prototype.showFeaturesScreen = function (viewModel) {
    var self = this;
    if (viewModel) {
      self.presentUserInterface("frmServiceManagement", viewModel);
    } else {
      self.presentUserInterface("frmServiceManagement");
    }

  };
  /**
     * @name showLoadingScreen
     * @member ServicesManagementModule.presentationController
     * 
     */
  ServicesManagement_PresentationController.prototype.showLoadingScreen = function(){
    this.showFeaturesScreen({
      LoadingScreen : {
        show : true
      }
    });
  };
   /**
     * @name hideLoadingScreen
     * @member ServicesManagementModule.presentationController
     * 
     */
  ServicesManagement_PresentationController.prototype.hideLoadingScreen = function(){
    this.showFeaturesScreen({
      LoadingScreen : {
        show : false
      }
    });
  };

  /*
      * common function to present user interface with Toast message
      */
  ServicesManagement_PresentationController.prototype.showToastMessageFlex = function (msg, status) {
    var self = this;
    self.presentUserInterface("frmServiceManagement", {
      toast: {
        message: msg,
        status: status
      }
    });

  };

  /* Returns the features and actions list for a given facility */
  ServicesManagement_PresentationController.prototype.getFacilityDetails = function(facilityId, context) {
		var self = this;
		self.presentUserInterface('frmServiceManagement', {
		  "LoadingScreen": {
			show: true
		  }
		});

		function onSuccessCallBack(response) {
		  self.showFacilitiesListScreen({
			"facilityFeaturesList": response,
            "context" : context
		  });
		  self.presentUserInterface('frmServiceManagement', {
			"LoadingScreen": {
			  show: false
			}
		  });
		}

		function onErrorCallBack(error) {
		  self.presentUserInterface('frmServiceManagement', {
			"LoadingScreen": {
			  focus: false
			}
		  });
		  self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
		}
         var facilityIdJson = {
             "facilityId": facilityId
        };
		self.businessController.getFacilityDetails(facilityIdJson, onSuccessCallBack, onSuccessCallBack);
	 };
  
  /* Returns the facilities list without features */
  ServicesManagement_PresentationController.prototype.getAllFacilities = function(context) {
		var self = this;
		self.presentUserInterface('frmServiceManagement', {
		  "LoadingScreen": {
			show: true
		  }
		});

		function onSuccessCallBack(response) {
		  self.showFacilitiesListScreen({
			"facilitiesList": response
		  });
		  self.presentUserInterface('frmServiceManagement', {
			"LoadingScreen": {
			  show: false
			}
		  });
		}

		function onErrorCallBack(error) {
		  self.presentUserInterface('frmServiceManagement', {
			"LoadingScreen": {
			  focus: false
			}
		  });
		  self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
		}
		self.businessController.getAllFacilities(context, onSuccessCallBack, onErrorCallBack);
	 };
  
	ServicesManagement_PresentationController.prototype.showFacilitiesListScreen = function(viewModel) {
		var self = this;
		if (viewModel) {
		  self.presentUserInterface("frmServiceManagement", viewModel);
		} else {
		  self.presentUserInterface("frmServiceManagement");
		}
	  };
  
     /*
      * function to call command handler to update a service
      * @param : edited request
      */
  ServicesManagement_PresentationController.prototype.getAccountLevelFeatureAction = function (context) {
    var self = this;
	self.presentUserInterface('frmServiceManagement', {
	  "LoadingScreen": {
        show: true
	  }
	});

	function onSuccessCallBack(response) {
	  self.showFacilitiesListScreen({
		"allFeaturesForEmptyFacilitiesList": response
	  });
	  self.presentUserInterface('frmServiceManagement', {
		"LoadingScreen": {
		  show: false
		}
	  });
	}

	function onErrorCallBack(error) {
	  self.presentUserInterface('frmServiceManagement', {
		"LoadingScreen": {
		  focus: false
		}
	  });
	  self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
	}
	self.businessController.getAccountLevelFeatureAction(context, onSuccessCallBack, onErrorCallBack);
  };
  
  /*
      * function to call command handler to update a service
      * @param : edited request
      */
  ServicesManagement_PresentationController.prototype.editFacility = function (editedParamReq, facilityOptionView) {
    var self = this;

    function successCallback(response) {
      if( facilityOptionView === "viewFacility") { 
     	 self.getFacilityDetails(editedParamReq.facilityId);
      } else {
      self.getAllFacilities();
      }

      self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.Facility_edited_msg"), "success");
    }

    function failureCallback(response) {
      // de modificat si returnat mesajul returnat in response de API
      self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.Facility_edited_msg_error"), "error");
      //self.showToastMessageFlex(ErrorInterceptor.errorMessage(response), "error");
      self.hideLoadingScreen();
    }

    self.showLoadingScreen();
    self.businessController.editFacility(editedParamReq, successCallback, failureCallback);
  };

  ServicesManagement_PresentationController.prototype.createFacility = function (editedParamReq) {
    var self = this;
	self.presentUserInterface('frmServiceManagement', {
		  "LoadingScreen": {
			show: true
		  }
		});
    function successCallback(response) {
      self.getAllFacilities();
      self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.Facility_added_msg"), "success");
    }

    function failureCallback(response) {
      // de modificat si returnat mesajul returnat in response de API
      self.showToastMessageFlex(kony.i18n.getLocalizedString("i18n.frmServiceManagement.Facility_added_msg_error"), "error");
      //self.showToastMessageFlex(ErrorInterceptor.errorMessage(response), "error");
      self.hideLoadingScreen();
    }

    
    self.businessController.createFacility(editedParamReq, successCallback, failureCallback);
  };
  return ServicesManagement_PresentationController;
});