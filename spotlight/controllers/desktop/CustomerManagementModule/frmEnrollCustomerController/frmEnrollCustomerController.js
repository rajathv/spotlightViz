define({ 
  prevIndex : -1,
  isEditUserAccessVisited:{},
  enrollCustomerRecordData:[],
  bulkUpdateListboxData: [],
  bulkUpdateAllFeaturesList : [],
  bulkUpdateAllFeaturesLimits:[],
  serviceDefinitions : [],
  segment_ROW_FRAMES :[],
  customerToEnrollInfo : "",
  enrollSegRowInd : 0,
  actionsAccountJSON :{},
  selAccCount:{},
  limitsValidationObject:"",
  limitGroupsValidationObject :"",
  prevSelectedStateEditUser :{},
  removedEnrollCustomers :{},
  createContractRequestParam:"",
  selectedServiceCard:"",
  monetaryLimits:{},
  selectedCustomers:[],
  completeContractDetails: {},
  prevRole:{},
  viewContractServiceDef :[],
  bulkUpdateAllFeaturesListContract : [],
  actionConfig: {
    create: "CREATE",
    edit: "EDIT",
    editUser: "EDIT_USER"
  },
  action:"CREATE",
  enrollAction :"CREATE",
  limitId :{
    PRE_APPROVED_DAILY_LIMIT:"PRE_APPROVED_DAILY_LIMIT",
    AUTO_DENIED_DAILY_LIMIT:"AUTO_DENIED_DAILY_LIMIT",
    PRE_APPROVED_WEEKLY_LIMIT:"PRE_APPROVED_WEEKLY_LIMIT",
    AUTO_DENIED_WEEKLY_LIMIT:"AUTO_DENIED_WEEKLY_LIMIT",
    PRE_APPROVED_TRANSACTION_LIMIT:"PRE_APPROVED_TRANSACTION_LIMIT",
    AUTO_DENIED_TRANSACTION_LIMIT:"AUTO_DENIED_TRANSACTION_LIMIT",
    WEEKLY_LIMIT:"WEEKLY_LIMIT",
    MAX_TRANSACTION_LIMIT:"MAX_TRANSACTION_LIMIT",
    DAILY_LIMIT:"DAILY_LIMIT"
  },
  willUpdateUI : function(context){
    if (context) {
      this.updateLeftMenu(context);

      if (context.LoadingScreen) {
        if (context.LoadingScreen.focus) {
          kony.adminConsole.utils.showProgressBar(this.view);
        } else {
          kony.adminConsole.utils.hideProgressBar(this.view);
        }
      } 
      else if (context.toastModel) {
        if (context.toastModel.status === kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.SUCCESS")) {
          this.view.toastMessage.showToastMessage(context.toastModel.message, this);
        } else {
          this.view.toastMessage.showErrorToastMessage(context.toastModel.message, this);
        }
      } else if(context.resetEnrollFormUI){
        //hide all screens
        this.showEnrollCustomer();
        this.view.flxEnrollCustomerContainer.setVisibility(false);
      }
      else if(context.showEnrollFormCreate){
        this.enrollAction = "CREATE";
        this.showEnrollCustomer();
        this.enrollCustomerRecordData = context.showEnrollFormCreate;
      } 
      else if(context.enrollCustomerContract) {
        this.setPrimaryCustInEnrollList(context);
      }
      else if(context.serviceDefinitions){
        this.serviceDefinitions = context.serviceDefinitions.ServiceDefinitionRecords;
      }
      else if(context.serviceDefinitionRoles){
        this.clearRoleSelection(context.serviceDefinitionRoles,context.rowsIndexArr);
      }
      else if(context.relatedCustomers){
        this.showAddAnotherCustomerScreen();
        this.setRelatedCustomerListData(context.relatedCustomers.customers);
      }
      else if(context.contractSearch){
        if(context.contractOption === 1){ // for related customer screen contract
          this.showRelatedCustomerDetailsScreen();
          this.setRelatedCustomerDetails(context.contractSearch.contracts);
        } else{ // other customer search screen contract
          this.viewContractCases(context.contractSearch.contracts,context.custSearchResponse);
        }  
      }
      else if(context.otherCustomersSearch){
        this.showSearchedCustomerResults();
        this.setSearchCustomerResultData(context.otherCustomersSearch);
      }
      else if(context.tempContractAccountFeatures){
        this.constructGetContractDetailsPayload(context.tempContractAccountFeatures);
      }
      else if(context.contractOfCustomer){
        if(context.contractOption === 1){ // for related customer screen contract
          this.setSelectedRelatedCustContractCard(context);
        } else{ // other customer search screen contract
          this.viewContractCases(context);
        }  
      }
      else if(context.assignDefaultEnableFlag){
        this.formEditObjectAssignDefaultValues(context.assignDefaultEnableFlag);
      }
      else if(context.custStatusConfig){
        this.setCustomerStatusListData(context.custStatusConfig.Configuration);
      }
      else if(context.editUserNavigationEntry){ 
        if(context.editUserNavigationEntry.navParam.isEnrollEditUser === false){
          this.enrollAction = this.actionConfig.edit;
        } else{
          this.enrollAction = this.actionConfig.editUser;
        }
        var userAllDetails = {"userData":context.editUserNavigationEntry.userData,
                              "defaultLimits":context.editUserNavigationEntry.defaultLimits};
        this.parseCustomersAccountsFeatures(userAllDetails, context.editUserNavigationEntry.navParam);
        if(context.editUserNavigationEntry.isSuspendedUser === true){
          this.callAddCustomer();
        }else{
           this.setEnrolledCustListForEdit(context.editUserNavigationEntry.userData);
        }
      }
      else if(context.serviceDefinitionsContract){
        this.viewContractServiceDef = context.serviceDefinitionsContract;
        this.setContractServiceCards(context.serviceDefinitionsContract);
        this.setDataToServiceTypeFilter(context.serviceDefinitionsContract);
        this.view.flxContractServiceCards.info={"totalRecords":context.serviceDefinitionsContract};
      }
      else if(context.contractsCustomerSearch){
        this.setCoreCustomersList(context.contractsCustomerSearch);
      }
      else if(context.relatedCustomersContract){
        this.setSelectedCustomerData(context.relatedCustomersContract,context.coreCustomerId);
      }
      else if(context.coreCustomerAccountsContracts){
        this.setContractAccountsData(context.coreCustomerAccountsContracts);
      }
      else if(context.serviceDefFeaturesLimitsContract){
        this.setServiceDefinitionFAData(context.serviceDefFeaturesLimitsContract);
      }
      else if(context.allFeaturesActions){
        this.getAllFeatures(context.allFeaturesActions);
      }
      else if(context.createContractSuccess){
        this.addCustomersFromCreatedContract(context.createContractSuccess);
      }
      else if(context.editContractDetails){
        this.createEditContractPayload(context.editContractDetails);
      }
      else if(context.serviceDefinitionMonetaryActions){
        this.setGlobalMonetaryActions(context.serviceDefinitionMonetaryActions.limits);
      }else if(context.autoSyncAccountsFlag){
        this.autoSyncAccountsFlag=context.autoSyncAccountsFlag.value==="IMPLICIT"?"true":"false";
      }
    }  
  },
  enrollCustPreshow : function(){
    this.view.flxToastMessage.setVisibility(false);
    this.view.bulkUpdateFeaturesLimitsPopup.flxSegmentContainer.top = "106dp";
    this.bulkUpdateAllFeaturesList = [{"featureName":"feature1","id":"1"},{"featureName":"feature2","id":"2"},
                                     {"featureName":"feature3","id":"3"},{"featureName":"feature4","id":"4"}];
    this.defaultCurrencyCodeSymbol =this.defaultCurrencyCode();
    this.currencyValue=this.defaultCurrencyCode();
    this.customerToEnrollInfo = this.presenter.getCurrentCustomerDetails();
    this.view.breadcrumbs.btnPreviousPage.text = this.customerToEnrollInfo.Name.toUpperCase();
    this.view.lblEnrollCustomerTitle.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.setFlowActions();
  },
  setFlowActions : function(){
    var scopeObj = this;    
    this.view.flxContextualMenu.onHover = this.onHoverEventCallback;
    this.view.customListBoxAccounts.onHover = this.onHoverHideSelectionDropdown;
    this.view.flxAccountsFilter.onHover = this.onHoverEventCallback;
    this.view.flxOwnershipFilter.onHover = this.onHoverEventCallback;
    this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.onHover = this.onHoverEventCallback;
    this.view.popUpDeactivate.btnPopUpCancel.onClick = function(){
      scopeObj.view.flxEnrollCustConfirmationPopup.setVisibility(false);
    };
    this.view.popUpDeactivate.flxPopUpClose.onClick = function(){
      scopeObj.view.flxEnrollCustConfirmationPopup.setVisibility(false);
    };
    /**** Enroll customer screen actions****/   
    this.view.breadcrumbs.btnBackToMain.onClick = function(){
      scopeObj.presenter.getSearchInputs();
    };
    this.view.breadcrumbs.btnPreviousPage.onClick = function(){
      var custId = scopeObj.customerToEnrollInfo.Customer_id || scopeObj.customerToEnrollInfo.primaryCustomerId;
      scopeObj.presenter.getCustomerBasicInfo({ "Customer_id": custId }, "InfoScreen", null);
    };
    this.view.breadcrumbs.btnPreviousPage1.onClick = function(){
      if(scopeObj.enrollAction === scopeObj.action.editUser){
        scopeObj.enrollAction = scopeObj.action.edit;
      }
      scopeObj.showEnrollCustomer();
    };
    this.view.breadcrumbs.btnPreviousPage2.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.btnLink1.onClick = function(){
      var isValid = scopeObj.validateServiceRoleSelection(scopeObj.enrollSegRowInd);
      if(isValid){
        scopeObj.showEditUserScreen(false);
        scopeObj.editUserAccessOnClick();
        scopeObj.showEditAccountsScreen();
      }
    };
    this.view.btnLink2.onClick = function(){
      var isValid = scopeObj.validateServiceRoleSelection(scopeObj.enrollSegRowInd);
      if(isValid){
        scopeObj.showEditUserScreen(false);
        scopeObj.editUserAccessOnClick();
        scopeObj.showEditFeaturesScreen(1);
      }
    };
    this.view.btnLink3.onClick = function(){
      var isValid = scopeObj.validateServiceRoleSelection(scopeObj.enrollSegRowInd);
      if(isValid){
        scopeObj.showEditUserScreen(false);
        scopeObj.editUserAccessOnClick();
        scopeObj.showEditLimitsScreen(1);
      }
    };
    this.view.btnLink4.onClick = function(){
      var isValid = scopeObj.validateServiceRoleSelection(scopeObj.enrollSegRowInd);
      if(isValid){
        scopeObj.showEditUserScreen(false);
        scopeObj.editUserAccessOnClick();
        scopeObj.showEditSignatoryGroups(scopeObj.enrollSegRowInd);
      }
    }; 
    this.view.flxOption1.onClick = function(){
      scopeObj.view.flxContextualMenu.setVisibility(false);
      scopeObj.changeOptionsSkin();
      scopeObj.onEditContractClick();
    };
    this.view.flxOption2.onClick = function(){
      scopeObj.view.flxContextualMenu.setVisibility(false);
      var segData = scopeObj.view.segEnrollCustList.data;
      var rowData = segData[scopeObj.enrollSegRowInd];
      if(rowData.flxPrimary.isVisible === true){ //if own customer
        scopeObj.showRemoveCustomerPopup();
      }else{ // if other customer
        scopeObj.removeCustomerFromEnroll();
      }
      
    };
    this.view.btnAddCustomerId.onClick = function(){
      var custId = scopeObj.customerToEnrollInfo.Customer_id || scopeObj.customerToEnrollInfo.primaryCustomerId;
      scopeObj.presenter.getRelatedCustomers({"coreCustomerId":custId},"enroll");
    };
    this.view.commonButtons.btnSave.onClick = function(){
      var isValid = scopeObj.validateOnClickOfEnroll();
      if(isValid){
        scopeObj.createEnrollCustomerRequestParam();
      } 
    };
    this.view.commonButtons.btnCancel.onClick = function(){
      //navigate to cust contact tabs
      if(scopeObj.enrollAction === scopeObj.actionConfig.create){
        scopeObj.presenter.navigateBackToCustomerTabs(true);
      }else{ //navigate to respective cust tab
        scopeObj.presenter.navigateBackToCustomerTabs(false);
      }  
    };
    /**** Add another customer screen actions****/
    this.view.btnShowHideAdvanceSearch.onClick= function(){
      if(scopeObj.view.flxAddCustAdvanceSearchCont.isVisible)
        scopeObj.showHideAdvanceSearchParam(false);
      else
        scopeObj.showHideAdvanceSearchParam(true);
    };
    this.view.btnAddRelatedCustomers.onClick = function(){
      scopeObj.showRelatedCustomersListScreen();
    };
    this.view.btnAddOtherCustomers.onClick = function(){
      scopeObj.showSearchOtherCustomerScreen();
    };
    this.view.btnRelatedDetailsShowSearch.onClick = function(){
      scopeObj.showSearchOtherCustomerScreen();
    };
    this.view.commonButtonsAddAnotherCust.btnCancel.onClick = function(){
      scopeObj.showEnrollCustomer();
    };
    this.view.commonButtonsAddAnotherCust.btnSave.onClick = function() {
      scopeObj.onClickToAddSearchCustomers(); 
    };
    this.view.commonButtonsRelatedCust.btnCancel.onClick = function(){
      scopeObj.showEnrollCustomer();
    };
    this.view.commonButtonsRelatedCust.btnSave.onClick = function(){
      scopeObj.showRelatedCustomerDetailsScreen();
      scopeObj.fetchContractDetailsOfCustomer(scopeObj.view.segRelatedCustomers,1);
      //scopeObj.callSearchContracts();
    };
    this.view.commonButtonsRelatedDetails.btnCancel.onClick = function(){
      scopeObj.showEnrollCustomer();
    };
    this.view.commonButtonsRelatedDetails.btnSave.onclick = function(){
      scopeObj.addNewCustomerToEnroll(scopeObj.view.relatedCustContractCard.segRelatedContractsList);
      scopeObj.showEnrollCustomer();
    };
    this.view.segSearchResultsCust.onRowClick = function(){
      scopeObj.fetchContractDetailsOfCustomer(scopeObj.view.segSearchResultsCust, 2);
    };
    this.view.commonButonsSearchCust.btnSave.onClick = function(){
      scopeObj.callOtherCustomersSearch();
    };
    this.view.commonButonsSearchCust.btnCancel.onClick = function(){
      scopeObj.clearOtherCustSearchFields();
    };
    this.view.flxBackOptionAddCust.onClick = function(){
      scopeObj.showSearchedCustomerResults();
    };
    this.view.segRelatedCustomers.onRowClick = function(){
      scopeObj.AdminConsoleCommonUtils.setEnableDisableSkinForButton(scopeObj.view.commonButtonsRelatedCust.btnSave,true,true);
    };
    this.view.flxResultsCustIdHeader.onClick = function(){
      scopeObj.sortAndSetData("lblSearchSegHeaderCustId.text",scopeObj.view.segSearchResultsCust, 3);
    };
    this.view.flxResultsCustNameHeader.onClick = function(){
      scopeObj.sortAndSetData("lblSearchSegHeaderCustName.text",scopeObj.view.segSearchResultsCust, 3);
    };
    this.view.flxResultsCustEmailHeader.onClick = function(){
      scopeObj.sortAndSetData("lblSearchSegHeaderEmail.text",scopeObj.view.segSearchResultsCust, 3);
    };
    this.view.textBoxEntry11.tbxEnterValue.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.textBoxEntry12.tbxEnterValue.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.textBoxEntry13.tbxEnterValue.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.textBoxEntry31.tbxEnterValue.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.textBoxEntry32.tbxEnterValue.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.textBoxEntry33.tbxEnterValue.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.contactNumber21.txtISDCode.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.contactNumber21.txtContactNumber.onKeyUp = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.lstBoxSearchParam23.onSelection = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.customCalDob.event = function(){
      scopeObj.clearCustSearchValidation();
    };
    this.view.contractDetailsPopup.flxPopUpClose.onClick = function(){
      scopeObj.view.flxContractDetailsPopup.setVisibility(false);
    };
    /**** Edit user screen actions****/
    this.view.commonButtonsEditAccounts.btnCancel.onClick = function(){
      if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
        scopeObj.presenter.navigateBackToCustomerTabs(false);
      } else{
        scopeObj.revertEditUserChangesOnCancel();
        scopeObj.showEnrollCustomer();
      }
    };
    this.view.commonButtonsEditFeatures.btnCancel.onClick = function(){
      if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
        scopeObj.presenter.navigateBackToCustomerTabs(false);
      } else{
        scopeObj.revertEditUserChangesOnCancel();
        scopeObj.showEnrollCustomer();
      }
    };
    this.view.commonButtonsEditOF.btnCancel.onClick = function(){
      if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
        scopeObj.presenter.navigateBackToCustomerTabs(false);
      } else{
        scopeObj.revertEditUserChangesOnCancel();
        scopeObj.showEnrollCustomer();
      }
    };
    this.view.commonButtonsEditLimits.btnCancel.onClick = function(){
      if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
        scopeObj.presenter.navigateBackToCustomerTabs(false);
      } else{
        scopeObj.revertEditUserChangesOnCancel();
        scopeObj.showEnrollCustomer();
      }
    };
    this.view.commonButtonsEditSignatories.btnCancel.onClick = function(){
      if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
        scopeObj.presenter.navigateBackToCustomerTabs(false);
      } else{
        scopeObj.revertEditUserChangesOnCancel();
        scopeObj.showEnrollCustomer();
      }
    }; 
    this.view.toggleButtonsFeatures.btnToggleLeft.onClick = function(){
      scopeObj.toggleFeaturesCustomerLevel();
    };
    this.view.toggleButtonsFeatures.btnToggleRight.onClick = function(){
      scopeObj.toggleFeaturesAccountLevel();
    };
    this.view.toggleButtonsLimits.btnToggleRight.onClick = function(){
     // var isValid = scopeObj.validateLimitGroupEditUser();
      //if(isValid){
        scopeObj.toggleLimitsAccountLevel();
     // }
    };
    this.view.toggleButtonsLimits.btnToggleLeft.onClick = function(){
     // var isValid = scopeObj.validateAccLimitEditUser();
     // if(isValid){
        scopeObj.toggleLimitsCustomerLevel();
     // }
    };
    this.view.enrollVerticalTabs.btnOption1.onClick = function(){
      scopeObj.showEditAccountsScreen();
    };
    this.view.enrollVerticalTabs.btnOption2.onClick = function(){
      scopeObj.showEditFeaturesScreen(1);
    };
    this.view.commonButtonsEditAccounts.btnNext.onClick = function(){
      scopeObj.showEditFeaturesScreen(1);
    };
    this.view.enrollVerticalTabs.btnOption3.onClick = function(){
      scopeObj.showEditOtherFeaturesScreen();
    };
    this.view.commonButtonsEditFeatures.btnNext.onClick = function(){
      scopeObj.showEditOtherFeaturesScreen();
    };
    this.view.enrollVerticalTabs.btnOption4.onClick = function(){
      scopeObj.showEditLimitsScreen(1);
    };
this.view.commonButtonsEditLimits.btnNext.onClick = function(){
scopeObj.showEditSignatoryGroups();
};
    this.view.enrollVerticalTabs.btnOption5.onClick = function(){
      scopeObj.showEditSignatoryGroups();
    };
    this.view.commonButtonsEditOF.btnNext.onClick = function(){
      scopeObj.showEditLimitsScreen(1);
    };
    this.view.commonButtonsEditAccounts.btnSave.onClick = function(){
      var isValid = scopeObj.validateAllLimitsEditUser();
      if(isValid === true){
        if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        } else{
          scopeObj.showEnrollCustomer();
          var custId = scopeObj.view.customersDropdownAccounts.lblSelectedValue.info.customerId;
          scopeObj.isEditUserAccessVisited[custId] = true;
        }
      }
    };
    this.view.commonButtonsEditFeatures.btnSave.onClick = function(){
      var isValid = scopeObj.validateAllLimitsEditUser();
      if(isValid === true){
        if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        } else{
          scopeObj.showEnrollCustomer();
          var custId = scopeObj.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
          scopeObj.isEditUserAccessVisited[custId] = true;
        }
      }
    };
    this.view.commonButtonsEditOF.btnSave.onClick = function(){
      var isValid = scopeObj.validateAllLimitsEditUser();
      if(isValid === true){
        if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        } else{
          var custId = scopeObj.view.customersDropdownOF.lblSelectedValue.info.customerId;
          scopeObj.isEditUserAccessVisited[custId] = true;
          scopeObj.showEnrollCustomer();
        }
      }
    };
    this.view.commonButtonsEditLimits.btnSave.onClick = function(){
      var isValid = scopeObj.validateAllLimitsEditUser();
      if(isValid === true){
        if(isValid && scopeObj.enrollAction !== scopeObj.actionConfig.editUser){
          var custId = scopeObj.view.customersDropdownLimits.lblSelectedValue.info.customerId;
          scopeObj.isEditUserAccessVisited[custId] = true;
          scopeObj.showEnrollCustomer();
        } else if(isValid && scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        }
      }
      //for account level limit screen
      /*if(scopeObj.view.flxEnrollEditAccLimitsList.isVisible === true){
        isValid = scopeObj.validateAccLimitEditUser();
        if(isValid && scopeObj.enrollAction !== scopeObj.actionConfig.editUser){
          scopeObj.showEnrollCustomer();
        } else if(isValid && scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        }
      }else{ //for limit group screen
        isValid = scopeObj.validateLimitGroupEditUser();
        if(isValid && scopeObj.enrollAction !== scopeObj.actionConfig.editUser){
          scopeObj.showEnrollCustomer();
        } else if(isValid && scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        }
      }*/
    };
    this.view.commonButtonsEditSignatories.btnSave.onClick = function(){
      var isValid = scopeObj.validateAllLimitsEditUser();
      if(isValid === true){
        if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
          scopeObj.createEnrollCustomerRequestParam();
        } else{
          var custId = scopeObj.view.customersDropdownSignatory.lblSelectedValue.info.customerId;
          scopeObj.isEditUserAccessVisited[custId] = true;
          scopeObj.showEnrollCustomer();
        }
      }
    };
    this.view.customersDropdownSignatory.segList.onRowClick = function(){
      var selInd = scopeObj.view.customersDropdownSignatory.segList.selectedRowIndex[1];
      var selectedRowData = scopeObj.view.customersDropdownSignatory.segList.data[selInd];
      var custId = selectedRowData.id;
      scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownSignatory,custId);
      //var editUserDetails = scopeObj.presenter.getSignGroupsForEnrollCust(custId);
      scopeObj.setSignatoryGroupsData(custId);  
    };
    this.view.customersDropdownAccounts.segList.onRowClick = function(){
      var selInd = scopeObj.view.customersDropdownAccounts.segList.selectedRowIndex[1];
      var selectedRowData = scopeObj.view.customersDropdownAccounts.segList.data[selInd];
      var custId = selectedRowData.id;
      scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownAccounts,custId);
      var editUserDetails = scopeObj.presenter.getAccountsFeaturesForEnrollCust(custId);
      var accounts = editUserDetails.accounts;
      scopeObj.setAccountsSegmentData(accounts,editUserDetails.customerDetails.autoSyncAccounts);  
    };
    this.view.customersDropdownFeatures.segList.onRowClick = function(){
      var selInd = scopeObj.view.customersDropdownFeatures.segList.selectedRowIndex[1];
      var selectedRowData = scopeObj.view.customersDropdownFeatures.segList.data[selInd];
      var custId = selectedRowData.id;
      if(scopeObj.view.toggleButtonsFeatures.info.selectedTab === 1){
        scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownFeatures,custId);
        scopeObj.createFeatureCardForCustomers();
      }else{
        scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownFeatures,custId);
        scopeObj.createFeatureCardForAccounts();
      }
      
    };
    this.view.customersDropdownOF.segList.onRowClick = function(){
      var selInd = scopeObj.view.customersDropdownOF.segList.selectedRowIndex[1];
      var selectedRowData = scopeObj.view.customersDropdownOF.segList.data[selInd];
      var custId = selectedRowData.id;
      scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownOF,custId);
      scopeObj.createOtherFeaturesCard();

    };
    this.view.customersDropdownLimits.segList.onRowClick = function(){
      var selInd = scopeObj.view.customersDropdownLimits.segList.selectedRowIndex[1];
      var selectedRowData = scopeObj.view.customersDropdownLimits.segList.data[selInd];
      var custId = selectedRowData.id;
      if(scopeObj.view.toggleButtonsLimits.info.selectedTab === 1){
        scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownLimits,custId);
        scopeObj.createLimitCardForCustomers();
      }else{
        scopeObj.setSelectedTextFromDropdownEditUser(scopeObj.view.customersDropdownLimits,custId);
        scopeObj.createLimitsCardForAccounts();
      }
    };
    this.view.customersDropdownAccounts.tbxSearchBox.onKeyUp = function(){
      scopeObj.searchCustomersDropDownList("customersDropdownAccounts");
    };
    this.view.customersDropdownSignatory.tbxSearchBox.onKeyUp = function(){
      scopeObj.searchCustomersDropDownList("customersDropdownSignatory");
    };
    this.view.customersDropdownFeatures.tbxSearchBox.onKeyUp = function(){
      scopeObj.searchCustomersDropDownList("customersDropdownFeatures");
    };
    this.view.customersDropdownOF.tbxSearchBox.onKeyUp = function(){
      scopeObj.searchCustomersDropDownList("customersDropdownOF");
    };
    this.view.customersDropdownLimits.tbxSearchBox.onKeyUp = function(){
      scopeObj.searchCustomersDropDownList("customersDropdownLimits");
    };
    this.view.btnBulkUpdateFeatures.onClick = function(){
      scopeObj.showBulkUpdatePopupEditUser(1);
    };
    this.view.btnBulkUpdateLimits.onClick = function(){
      scopeObj.showBulkUpdatePopupEditUser(2);
    };
    this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnSave.onClick = function(){
      if(scopeObj.view.flxCreateContract.isvisible === true){ //for contracts case
        scopeObj.showContractBulkUpdatePopupScreen2();
      }else{ //for edit user case
        scopeObj.getSelectedAccountTypesCount();
        scopeObj.showBulkUpdatePopupScreen2();
      }   
    };
    this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnCancel.onClick = function(){
      scopeObj.view.flxBulkUpdateFeaturesPopup.setVisibility(false);
    };
    this.view.bulkUpdateFeaturesLimitsPopup.flxPopUpClose.onClick = function(){
      scopeObj.view.flxBulkUpdateFeaturesPopup.setVisibility(false);
    };
    this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen2.btnSave.onClick = function(){
      if(scopeObj.view.flxCreateContract.isVisible === true){
        if(scopeObj.validateBulkSelectionContracts())
          scopeObj.updateFeatureLimitsBulkContract();
      } else{
        if(scopeObj.validateBulkSelectionEditUser())
          scopeObj.updateFeatureLimitsBulkChanges(scopeObj.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info.option);
      }      
    };
    this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen2.btnCancel.onClick = function(){
      scopeObj.view.flxBulkUpdateFeaturesPopup.setVisibility(false);
    };
    this.view.searchEditAccounts.tbxSearchBox.onTouchStart = function(){
      scopeObj.view.searchEditAccounts.setSearchBoxFocus(true);
    };
    this.view.searchEditAccounts.tbxSearchBox.onEndEditing = function(){
      scopeObj.view.searchEditAccounts.setSearchBoxFocus(false);
    };
    this.view.searchEditAccounts.tbxSearchBox.onKeyUp = function(){
      if(scopeObj.view.searchEditAccounts.tbxSearchBox.text === ""){
        scopeObj.view.searchEditAccounts.clearSearchBox();
      } else{
        scopeObj.view.searchEditAccounts.setSearchBoxFocus(true);
        scopeObj.view.searchEditAccounts.flxSearchCancel.setVisibility(true);
        scopeObj.view.searchEditAccounts.forceLayout();
      }
      scopeObj.searchFilterForAccounts();
    };
    this.view.searchEditAccounts.flxSearchCancel.onClick = function(){
      scopeObj.view.searchEditAccounts.clearSearchBox();
      scopeObj.searchFilterForAccounts();
    };
    this.view.searchEditFeatures.tbxSearchBox.onTouchStart = function(){
      scopeObj.view.searchEditFeatures.setSearchBoxFocus(true);
    };
    this.view.searchEditFeatures.tbxSearchBox.onEndEditing = function(){
      scopeObj.view.searchEditFeatures.setSearchBoxFocus(false);
    };
    this.view.searchEditFeatures.tbxSearchBox.onKeyUp = function(){
      if(scopeObj.view.searchEditFeatures.tbxSearchBox.text === ""){
        scopeObj.view.searchEditFeatures.clearSearchBox();
      } else{
        scopeObj.view.searchEditFeatures.setSearchBoxFocus(true);
        scopeObj.view.searchEditFeatures.flxSearchCancel.setVisibility(true);
        scopeObj.view.searchEditFeatures.forceLayout();
      }
      if(scopeObj.view.flxEnrollEditFeaturesList.isVisible === true){
        scopeObj.searchFeaturesCustomerLevel(1);
      }else{
        scopeObj.searchFeaturesLimitsAccountLevel(1);
      }
    };
    this.view.searchEditFeatures.flxSearchCancel.onClick = function(){
      scopeObj.view.searchEditFeatures.clearSearchBox();
      if(scopeObj.view.flxEnrollEditFeaturesList.isVisible === true){
        scopeObj.searchFeaturesCustomerLevel(1);
      }else{
        scopeObj.searchFeaturesLimitsAccountLevel(1);
      }
    };
    this.view.searchEditOtherFeatures.tbxSearchBox.onTouchStart = function(){
      scopeObj.view.searchEditOtherFeatures.setSearchBoxFocus(true);
    };
    this.view.searchEditOtherFeatures.tbxSearchBox.onEndEditing = function(){
      scopeObj.view.searchEditOtherFeatures.setSearchBoxFocus(false);
    };
    this.view.searchEditOtherFeatures.tbxSearchBox.onKeyUp = function(){
      if(scopeObj.view.searchEditOtherFeatures.tbxSearchBox.text === ""){
        scopeObj.view.searchEditOtherFeatures.clearSearchBox();
      } else{
        scopeObj.view.searchEditOtherFeatures.setSearchBoxFocus(true);
        scopeObj.view.searchEditOtherFeatures.flxSearchCancel.setVisibility(true);
        scopeObj.view.searchEditOtherFeatures.forceLayout();
      }
      scopeObj.searchFeaturesCustomerLevel(2);
    };
    this.view.searchEditOtherFeatures.flxSearchCancel.onClick = function(){
      scopeObj.view.searchEditOtherFeatures.clearSearchBox();
      scopeObj.searchFeaturesCustomerLevel(2);
    };
    this.view.searchEditLimits.tbxSearchBox.onTouchStart = function(){
      scopeObj.view.searchEditLimits.setSearchBoxFocus(true);
    };
    this.view.searchEditLimits.tbxSearchBox.onEndEditing = function(){
      scopeObj.view.searchEditLimits.setSearchBoxFocus(false);
    };
    this.view.searchEditLimits.tbxSearchBox.onKeyUp = function(){
      if(scopeObj.view.searchEditLimits.tbxSearchBox.text === ""){
        scopeObj.view.searchEditLimits.clearSearchBox();
      } else{
        scopeObj.view.searchEditLimits.setSearchBoxFocus(true);
        scopeObj.view.searchEditLimits.flxSearchCancel.setVisibility(true);
        scopeObj.view.searchEditLimits.forceLayout();
      }
      if(scopeObj.view.flxEnrollEditLimitsList.isvisible === true){  
      }else{ //acc level tab
        scopeObj.searchFeaturesLimitsAccountLevel(2);
      }
    };
    this.view.searchEditLimits.flxSearchCancel.onClick = function(){
      scopeObj.view.searchEditLimits.clearSearchBox();
      if(scopeObj.view.flxEnrollEditLimitsList.isvisible === true){
      }else{ //acc level tab
        scopeObj.searchFeaturesLimitsAccountLevel(2);
      }
    };
    this.view.searchEditSignatory.tbxSearchBox.onTouchStart = function(){
      scopeObj.view.searchEditSignatory.setSearchBoxFocus(true);
    };
    this.view.searchEditSignatory.tbxSearchBox.onEndEditing = function(){
      scopeObj.view.searchEditSignatory.setSearchBoxFocus(false);
    };
    this.view.searchEditSignatory.tbxSearchBox.onKeyUp = function(){
      if(scopeObj.view.searchEditSignatory.tbxSearchBox.text === ""){
        scopeObj.view.searchEditSignatory.clearSearchBox();
      } else{
        scopeObj.view.searchEditSignatory.setSearchBoxFocus(true);
        scopeObj.view.searchEditSignatory.flxSearchCancel.setVisibility(true);
        scopeObj.view.searchEditSignatory.forceLayout();
      }
      scopeObj.searchSignatoryGroups();
    };
    this.view.searchEditSignatory.flxSearchCancel.onClick = function(){
      scopeObj.view.searchEditSignatory.clearSearchBox();
      scopeObj.searchSignatoryGroups();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.onClick = function(){
      var category = scopeObj.view.flxCreateContract.isVisible === true ? "contract" :"enroll";
      if(scopeObj.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info.option === 1){
        scopeObj.addNewFeatureRowBulkUpdate(category);
      } else{
        scopeObj.addNewLimitRowBulkUpdate(category);
      }  
    };
    this.view.flxEnrollEditFeatureFilter.onClick = function(){
      scopeObj.showAccountTypesFilter(1);
      var selInd = scopeObj.view.customListBoxAccounts.segList.selectedRowIndices;
      var indicesToSet = (selInd && selInd.length > 0) ? JSON.stringify(selInd[0][1]) : JSON.stringify([]);
      scopeObj.view.customListBoxAccounts.segList.info.prevSelInd = indicesToSet;
    };
    this.view.flxEnrollEditLimitsFilter.onClick = function(){
      scopeObj.showAccountTypesFilter(2);
      var selInd = scopeObj.view.customListBoxAccounts.segList.selectedRowIndices;
      var indicesToSet = (selInd && selInd.length > 0) ? JSON.stringify(selInd[0][1]) : JSON.stringify([]);
      scopeObj.view.customListBoxAccounts.segList.info.prevSelInd = indicesToSet;
    };
    this.view.btnApplyFilter.onClick = function(){
      if(scopeObj.view.flxEnrollEditFeaturesContainer.isVisible === true){
        scopeObj.searchFeaturesLimitsAccountLevel(1);
      } else{
        scopeObj.searchFeaturesLimitsAccountLevel(2);
      }
      scopeObj.view.flxAccountTypesFilter.setVisibility(false);
    };
    this.view.flxImage.onClick = function(){
      var prevSelInd = JSON.parse(scopeObj.view.customListBoxAccounts.segList.info.prevSelInd);
      scopeObj.view.customListBoxAccounts.segList.selectedRowIndices = [[0,prevSelInd]];
      scopeObj.view.customListBoxAccounts.lblSelectedValue.text = scopeObj.view.customListBoxAccounts.segList.setData.info.selectedText;
      scopeObj.view.flxAccountTypesFilter.setVisibility(false);
    };
    this.view.customListBoxAccounts.flxSelectedText.onClick = function(){
      var isVisible = scopeObj.view.customListBoxAccounts.flxSegmentList.isVisible;
      scopeObj.view.customListBoxAccounts.flxSegmentList.setVisibility(!isVisible);
    };
    this.view.customListBoxAccounts.segList.onRowClick = function(){
      var segData = scopeObj.view.customListBoxAccounts.segList.data;
      var selInd = scopeObj.view.customListBoxAccounts.segList.selectedRowIndices;
      var selRows = (selInd && selInd.length > 0) ? selInd[0][1] : [];
      var selText = (selRows.length > 1 || selRows.length === 0) ?
          selRows.length+" "+kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Selected") : segData[selRows[0]].lblDescription; 
      scopeObj.view.customListBoxAccounts.lblSelectedValue.text = selText;
    };
    this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.tbxSearchBox.onTouchStart = function(){
      scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.setSearchBoxFocus(true);
    };
    this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.tbxSearchBox.onEndEditing = function(){
      scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.setSearchBoxFocus(false);
    };
    this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.tbxSearchBox.onKeyUp = function(){
      if(scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.tbxSearchBox.text === ""){
        scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.clearSearchBox();
      } else{
        scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.setSearchBoxFocus(true);
        scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.flxSearchCancel.setVisibility(true);
        scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.forceLayout();
      }
      scopeObj.searchForAccountsInBulkUpdate();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.flxSearchCancel.onClick = function(){
      scopeObj.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.clearSearchBox();
      scopeObj.searchForAccountsInBulkUpdate();
    };
    this.view.accountTypesFilterMenu.segStatusFilterDropdown.onRowClick = function(){
      scopeObj.view.flxOwnershipFilter.setVisibility(false);
      scopeObj.searchFilterForAccounts();
    };
    this.view.ownershipFilterMenu.segStatusFilterDropdown.onRowClick = function(){
      scopeObj.view.flxAccountsFilter.setVisibility(false);
      scopeObj.searchFilterForAccounts();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.imgRadioButton1.onTouchStart = function(){
      scopeObj.resetAddedRows();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.imgRadioButton2.onTouchStart = function(){
      scopeObj.resetAddedRows();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.imgRadioButton3.onTouchStart = function(){
      scopeObj.resetAddedRows();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.btnModifySearch.onClick = function(){
      if(scopeObj.view.flxCreateContract.isVisible === true)
        scopeObj.showContractBulkUpdatePopupScreen1(true);
      else
        scopeObj.showBulkUpdatePopupScreen1();
    };
    this.view.bulkUpdateFeaturesLimitsPopup.flxArrow.onClick = function(){
      scopeObj.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.setVisibility(!scopeObj.view.bulkUpdateFeaturesLimitsPopup.isVisible);
    };
    this.view.bulkUpdateFeaturesLimitsPopup.filterMenu.segStatusFilterDropdown.onRowClick = function(){
      scopeObj.filterAccountRowsInBulkUpdate();
    };
    this.view.noResultsSearchCustomers.btnAddRecord.onClick = function(){
      scopeObj.onCreateContractClick();
    };
    this.view.noResultsRelatedCustDetails.btnAddRecord.onClick = function(){
      var selInd = scopeObj.view.segRelatedCustomers.selectedRowIndex[1];
      var segRowData = scopeObj.view.segRelatedCustomers.data[selInd];
      var custDetails = segRowData.custDetails;
      scopeObj.addSearchCustToContractCustList(custDetails);
      scopeObj.onCreateContractClick();
    };	
    this.view.btnAddContract.onClick = function(){
      var custDetailsArr = scopeObj.view.btnAddContract.info.customerDetail;
      var custInfo = custDetailsArr.customers && custDetailsArr.customers.length > 0 ? custDetailsArr.customers[0] : [];
      scopeObj.addSearchCustToContractCustList(custInfo);
      scopeObj.onCreateContractClick();
    };
    
    /** create contract actions **/
    this.view.flxAccountsFilterContracts.onHover = this.onHoverEventCallback;
    this.view.flxOwnershipFilterContracts.onHover = this.onHoverEventCallback;
    this.view.flxCustomerOptions.onHover = this.onHoverEventCallback;
    this.view.verticalTabsContract.btnOption0.onClick = function(){
      scopeObj.showContractServiceScreen();
    };
    this.view.verticalTabsContract.btnOption1.onClick = function(){
      if(scopeObj.isValidSelection())
        scopeObj.showContractCustomersScreen(false);
    };
    this.view.verticalTabsContract.btnOption2.onClick = function(){
      if(scopeObj.isValidSelection())
        scopeObj.showContractDetailsScreen(false);
    };
    this.view.verticalTabsContract.btnOption3.onClick = function(){
      if(scopeObj.isValidSelection())
        scopeObj.showContractAccountsScreen(false);
    };
    this.view.verticalTabsContract.btnOption4.onClick = function(){
      if(scopeObj.isValidSelection())
        scopeObj.showContractFAScreen(false);
    };
    this.view.verticalTabsContract.btnOption5.onClick = function(){
      if(scopeObj.isValidSelection())
        scopeObj.showContractLimitsScreen(false);
    };
    this.view.commonButtonsServiceDetails.btnSave.onClick = function(){
      scopeObj.showContractCustomersScreen(true);
    };
    this.view.commonButtonsServiceDetails.btnCancel.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.btnSearchContractCustomers.onClick = function(){
      scopeObj.showCustomerSearchPopup(true);
    };
    this.view.btnSelectCustomers.onClick = function(){
      scopeObj.showCustomerSearchPopup(false);
    };
    this.view.flxRightImage.onClick = function(){
      scopeObj.revertAddedCustomers();
      scopeObj.view.flxCustomerSearchPopUp.setVisibility(false);
    };
    this.view.commonButtonsCustomers.btnNext.onClick = function(){
      scopeObj.showContractDetailsScreen(true);
    };
    this.view.commonButtonsCustomers.btnCancel.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.commonButtonsCustomers.btnSave.onClick = function(){
      if(scopeObj.action === scopeObj.actionConfig.create){
        scopeObj.showCreateContractPopup();
      }else{
        scopeObj.createContract();
      } 
    };
    this.view.contractDetailsCommonButtons.btnNext.onClick = function(){
      if(scopeObj.validateContractDetails()){
        scopeObj.showContractAccountsScreen(true);
      }
    };
    this.view.contractDetailsCommonButtons.btnSave.onClick = function(){
      if(scopeObj.action === scopeObj.actionConfig.create && scopeObj.validateContractDetails()){
        scopeObj.showCreateContractPopup();
      }else if(scopeObj.validateContractDetails()){
        scopeObj.createContract();
      }    
    };
    this.view.contractDetailsCommonButtons.btnCancel.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.commonButtonsContractAccounts.btnNext.onClick = function(){
      scopeObj.showContractFAScreen(true);
    };
    this.view.commonButtonsContractAccounts.btnSave.onClick = function(){
      if(scopeObj.action === scopeObj.actionConfig.create){
        scopeObj.showCreateContractPopup();
      }else{
        scopeObj.createContract();
      }  
    };
    this.view.commonButtonsContractAccounts.btnCancel.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.commonButtonsContractFA.btnNext.onClick = function(){
      scopeObj.showContractLimitsScreen(true);
    };
    this.view.commonButtonsContractFA.btnSave.onClick = function(){
      if(scopeObj.action === scopeObj.actionConfig.create){
        scopeObj.showCreateContractPopup();
      }else{
        scopeObj.createContract();
      }  
    };
    this.view.commonButtonsContractFA.btnCancel.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.commonButtonsContractLimits.btnSave.onClick = function(){
      if(scopeObj.validateAllLimitsContracts()){
        if(scopeObj.action === scopeObj.actionConfig.create){
          scopeObj.showCreateContractPopup();
        }else{
          scopeObj.createContract();
        }  
      }
    };
    this.view.commonButtonsContractLimits.btnCancel.onClick = function(){
      var category = scopeObj.action === scopeObj.actionConfig.create ? 1 : 2;
      scopeObj.hideCreateContractScreen(category);
    };
    this.view.btnShowHideAdvSearch.onClick = function(){
      if(scopeObj.view.flxRow2.isVisible){
        scopeObj.view.btnShowHideAdvSearch.text = kony.i18n.getLocalizedString("i18n.Group.AdvancedSearch");
        scopeObj.view.fonticonrightarrowSearch.text="";//right arrow
        scopeObj.view.flxColumn13.setVisibility(false);
        scopeObj.view.flxRow2.setVisibility(false);
        scopeObj.view.flxRow3.setVisibility(false);
      }else{
        scopeObj.view.btnShowHideAdvSearch.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.HideAdvancedSearch");
        scopeObj.view.fonticonrightarrowSearch.text="";//up arrow
        scopeObj.view.flxColumn13.setVisibility(true);
        scopeObj.view.flxRow2.setVisibility(true);
        scopeObj.view.flxRow3.setVisibility(true);
      }
      scopeObj.view.forceLayout();
    };
    this.view.btnSearchCustomers.onClick = function(){
      if(scopeObj.validateCoreCustSearch()){
        scopeObj.searchCoreCustomers();
        scopeObj.setNormalSkinToCoreSearch();
      }
    };
    this.view.btnClearAll.onClick = function(){
      scopeObj.resetCoreCustomerSearch();
    };
    this.view.flxSelectedCustomersArrow.onClick = function(){
      if(scopeObj.view.flxSearchFilter.isVisible){
        scopeObj.view.lblIconArrow.text="";
        scopeObj.view.flxSearchFilter.setVisibility(false);
      }else{
        scopeObj.view.flxSearchFilter.setVisibility(true);
        scopeObj.view.lblIconArrow.text="";
      }
    };
    //customer search popup button actions
    this.view.commonButtonsContractSearchCust.btnNext.onClick = function(){
      //add tags and back to search page navigation
      scopeObj.view.commonButtonsContractSearchCust.btnNext.setVisibility(false);
      scopeObj.view.flxCustomerSearchHeader.setVisibility(true);
      scopeObj.view.flxCustomersBreadcrumb.setVisibility(false);
      scopeObj.view.flxCustomerAdvSearch.setVisibility(true);
      scopeObj.view.flxCustomerDetailsContainer.setVisibility(true);
      scopeObj.view.flxSelectedCustomerInfo.setVisibility(false);
      scopeObj.view.lblNoCustomersSearched.text= kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.NoresultsSearchForaCustomer");
      scopeObj.view.flxNoCustomersSearched.setVisibility(true);
      scopeObj.view.flxRelatedCustomerSegContracts.setVisibility(false);
      scopeObj.view.lblRelatedcustSubHeading.setVisibility(false);
      scopeObj.view.flxSearchBreadcrumb.info.added=[];
      scopeObj.view.flxSearchFilter.setVisibility(true);
      scopeObj.view.lblIconArrow.text="";
      var i=scopeObj.view.flxSearchBreadcrumb.widgets().concat([]);
      scopeObj.view.segBreadcrumbs.setData([]);
      for(var x=2;x<i.length-1;x++)
        scopeObj.view.flxSearchBreadcrumb.remove(i[x]);
      scopeObj.resetCoreCustomerSearch();
    };
    this.view.commonButtonsContractSearchCust.btnSave.onClick = function(){
      scopeObj.view.flxCustomerSearchPopUp.setVisibility(false);
      scopeObj.view.flxNoCustomersAdded.setVisibility(false);
      scopeObj.view.segAddedCustomers.setVisibility(true);
      if(scopeObj.view.btnSelectCustomers.isVisible){
        scopeObj.setAddedCustDataInRequest();
      }
      else
        scopeObj.view.btnSelectCustomers.setVisibility(true);
      scopeObj.setSelectedCustomersData();
    };
    this.view.commonButtonsContractSearchCust.btnCancel.onClick = function(){
      scopeObj.revertAddedCustomers();
      scopeObj.view.flxCustomerSearchPopUp.setVisibility(false);
    };
    this.view.ContractLimitsList.btnReset.onClick = function(){
      scopeObj.showResetAllLimitsContractPopup();
    };
    this.view.accountTypesFilterContracts.segStatusFilterDropdown.onRowClick = function(){
      var filteredData=scopeObj.performAccountOwnerContractFilters();
      scopeObj.setAccountsDataCustomers(filteredData);
    };
    this.view.ownershipFilterContracts.segStatusFilterDropdown.onRowClick = function(){
      var filteredData=scopeObj.performAccountOwnerContractFilters();
      scopeObj.setAccountsDataCustomers(filteredData);
    };
    this.view.flxServiceFilter.onClick = function(){
      scopeObj.view.flxServiceTypeFilter.setVisibility(!scopeObj.view.flxServiceTypeFilter.isVisible);
    };
    this.view.serviceTypeFilterMenu.segStatusFilterDropdown.onRowClick = function(){
      scopeObj.performServiceTypeFilter();
    };
    this.view.tbxAccountsSearch.onKeyUp = function(){
      if(scopeObj.view.tbxAccountsSearch.text.trim().length!==0){
        scopeObj.view.flxClearAccountsSearch.setVisibility(true);
        scopeObj.setCustSelectedData("customersDropdown",true);
      }else{
        scopeObj.view.flxClearAccountsSearch.setVisibility(false);
        scopeObj.setCustSelectedData("customersDropdown",false);
      }      
    };
    this.view.flxClearAccountsSearch.onClick = function(){
      scopeObj.view.tbxAccountsSearch.text="";
      scopeObj.setCustSelectedData("customersDropdown",false);
      scopeObj.view.flxClearAccountsSearch.setVisibility(false);
    };
    this.view.tbxContractFASearch.onKeyUp = function(){
      if(scopeObj.view.tbxContractFASearch.text.trim().length!==0){
        scopeObj.view.flxClearContractFASearch.setVisibility(true);
        scopeObj.setCustSelectedData("customersDropdownFA",true);
      }else{
        scopeObj.view.flxClearContractFASearch.setVisibility(false);
        scopeObj.setCustSelectedData("customersDropdownFA",false);
      }      
    };
    this.view.flxClearContractFASearch.onClick = function(){
      scopeObj.view.tbxContractFASearch.text="";
      scopeObj.setCustSelectedData("customersDropdownFA",false);
      scopeObj.view.flxClearContractFASearch.setVisibility(false);
    };
    this.view.tbxContractLimitsSearch.onKeyUp = function(){
      if(scopeObj.view.tbxContractLimitsSearch.text.trim().length!==0){
        scopeObj.view.flxClearContractLimitsSearch.setVisibility(true);
        scopeObj.setCustSelectedData("customersDropdownContractLimits",true);
      }else{
        scopeObj.view.flxClearContractLimitsSearch.setVisibility(false);
        scopeObj.setCustSelectedData("customersDropdownContractLimits",false);
      }      
    };
    this.view.flxClearContractLimitsSearch.onClick = function(){
      scopeObj.view.tbxContractLimitsSearch.text="";
      scopeObj.setCustSelectedData("customersDropdownContractLimits",false);
      scopeObj.view.flxClearContractLimitsSearch.setVisibility(false);
    };
    this.view.btnUpdateInBulkFA.onClick = function(){
      scopeObj.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.info="FA";
      scopeObj.showBulkUpdatePopupContracts(1);
    };
    this.view.btnUpdateInBulkLimits.onClick = function(){
      scopeObj.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.info="Limits";
      scopeObj.showBulkUpdatePopupContracts(2);
    };
    this.view.tbxRecordsSearch.onKeyUp = function(){
      if(scopeObj.view.tbxRecordsSearch.text.trim().length!==0){
        scopeObj.view.flxClearRecordsSearch.setVisibility(true);
        scopeObj.searchServiceCards();
        if(scopeObj.action===scopeObj.actionConfig.create){
          scopeObj.AdminConsoleCommonUtils.setEnableDisableSkinForButton(scopeObj.view.commonButtonsServiceDetails.btnSave,true,false);
          scopeObj.enableAllTabs(false);
        }
      }else{
        scopeObj.view.flxNoServiceSearchResults.setVisibility(false);
        scopeObj.view.flxContractServiceCards.setVisibility(true);
        scopeObj.view.flxClearRecordsSearch.setVisibility(false);
        scopeObj.setContractServiceCards(scopeObj.view.flxContractServiceCards.info.totalRecords);
      }      
    };
    this.view.flxClearRecordsSearch.onClick = function(){
      scopeObj.view.flxNoServiceSearchResults.setVisibility(false);
      scopeObj.view.flxContractServiceCards.setVisibility(true);
      scopeObj.view.tbxRecordsSearch.text="";
      scopeObj.setContractServiceCards(scopeObj.view.flxContractServiceCards.info.totalRecords);
      scopeObj.view.flxClearRecordsSearch.setVisibility(false);
    };
    this.view.contractDetailsEntry1.tbxEnterValue.onKeyUp = function(){
      if(scopeObj.view.contractDetailsEntry1.flxInlineError.isVisible){
      scopeObj.view.contractDetailsEntry1.tbxEnterValue.skin="sknflxEnterValueNormal";
      scopeObj.view.contractDetailsEntry1.flxInlineError.setVisibility(false);
      }
    };
    this.view.typeHeadContractCountry.tbxSearchKey.onKeyUp = function(){
      scopeObj.clearValidation(scopeObj.view.typeHeadContractCountry.tbxSearchKey, scopeObj.view.flxNoContractCountry, 1);
      scopeObj.view.typeHeadContractCountry.tbxSearchKey.info.isValid = false;
      scopeObj.hideAddressSegments(scopeObj.view.typeHeadContractCountry);
      scopeObj.view.flxContractCountry.zIndex = 2;
      scopeObj.searchForAddress(scopeObj.view.typeHeadContractCountry.tbxSearchKey, scopeObj.view.typeHeadContractCountry.segSearchResult, scopeObj.view.typeHeadContractCountry.flxNoResultFound, 1);
      if(scopeObj.view.flxNoContractCountry.isVisible){
        scopeObj.view.flxNoContractCountry.isVisible = false;
        scopeObj.view.typeHeadContractCountry.tbxSearchKey.skin = "skntbxLato35475f14px";
      }
      scopeObj.view.forceLayout();
    };
    this.view.typeHeadContractCountry.tbxSearchKey.onEndEditing = function(){
      if (scopeObj.view.typeHeadContractCountry.flxNoResultFound.isVisible) {
        scopeObj.view.typeHeadContractCountry.flxNoResultFound.setVisibility(false);
      }
    };
    this.view.typeHeadContractCountry.segSearchResult.onRowClick = function(){
      scopeObj.assignText(scopeObj.view.typeHeadContractCountry.segSearchResult, scopeObj.view.typeHeadContractCountry.tbxSearchKey);
      scopeObj.clearValidation(scopeObj.view.typeHeadContractCountry.tbxSearchKey,scopeObj.view.flxNoCountry,1);
    };
    this.view.contractDetailsEntry3.tbxEnterValue.onKeyUp = function(){
      if(scopeObj.view.contractDetailsEntry3.flxInlineError.isVisible){
        scopeObj.view.contractDetailsEntry3.flxEnterValue.skin = "sknflxEnterValueNormal";
        scopeObj.view.contractDetailsEntry3.flxInlineError.isVisible = false;
      }
    };
    this.view.contractDetailsEntry6.tbxEnterValue.onKeyUp = function(){
      if(scopeObj.view.contractDetailsEntry6.flxInlineError.isVisible){
        scopeObj.view.contractDetailsEntry6.flxEnterValue.skin = "sknflxEnterValueNormal";
        scopeObj.view.contractDetailsEntry6.flxInlineError.isVisible = false;
      }
    };
    this.view.contractContactNumber.txtISDCode.onKeyUp = function(){
      if(scopeObj.view.contractContactNumber.flxError.isVisible){
        scopeObj.view.contractContactNumber.flxError.isVisible = false;
        scopeObj.view.contractContactNumber.txtISDCode.skin = "skntxtbxDetails0bbf1235271384a";
      }
    };
    this.view.contractContactNumber.txtContactNumber.onKeyUp = function(){
      if(scopeObj.view.contractContactNumber.flxError.isVisible){
        scopeObj.view.contractContactNumber.flxError.isVisible = false;
        scopeObj.view.contractContactNumber.txtContactNumber.skin = "skntxtbxDetails0bbf1235271384a";
      }
    };
    this.view.enrollEditAccountsCard.flxCheckboxOptions.onClick = function(){
      var isChecked="true";
      if(scopeObj.view.enrollEditAccountsCard.imgCheckboxOptions.src==="checkboxnormal.png"){
        scopeObj.view.enrollEditAccountsCard.imgCheckboxOptions.src="checkboxselected.png";
      }else{
        scopeObj.view.enrollEditAccountsCard.imgCheckboxOptions.src="checkboxnormal.png";
        isChecked="false";
      }
      var segData=scopeObj.view.segEnrollCustList.data;
      var enrollUserData=[];
      if(scopeObj.enrollAction === scopeObj.actionConfig.editUser){
        for(var i=0;i<segData.length;i++){
          if(segData[i].custId===scopeObj.view.customersDropdownAccounts.lblSelectedValue.info.customerId)
            enrollUserData = segData[i];
        }
      }else
        enrollUserData = scopeObj.view.segEnrollCustList.data[scopeObj.enrollSegRowInd];
      enrollUserData.custDetails.autoSyncAccounts=isChecked;
      scopeObj.view.segEnrollCustList.setDataAt(enrollUserData,scopeObj.enrollSegRowInd);
      scopeObj.view.forceLayout();
    };
  },
  /*
  * show the breadcrumb based on the screen
  * @param: screen -(enroll:1,edit user acces:2,add customer:3)
  */
  showBreadcrumbsForScreens : function(screen){
    var isEdit = this.enrollAction === this.actionConfig.create ? false : true;
    this.view.breadcrumbs.btnPreviousPage2.setVisibility(false);
    this.view.breadcrumbs.fontIconBreadcrumbsRight4.setVisibility(false);
    if(screen === 1){ //enroll listing
      this.view.breadcrumbs.btnPreviousPage1.setVisibility(false);
      this.view.breadcrumbs.fontIconBreadcrumbsRight3.setVisibility(false);
      this.view.breadcrumbs.lblCurrentScreen.text = isEdit === false ? kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.Enroll_UC"):
                                                             kony.i18n.getLocalizedString("i18n.frmOutageMessageController.EDIT");
    }else if(screen === 2){ //edit user access
      this.view.breadcrumbs.btnPreviousPage1.setVisibility(true);
      this.view.breadcrumbs.fontIconBreadcrumbsRight3.setVisibility(true);
      this.view.breadcrumbs.btnPreviousPage1.text = isEdit === false ? kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.Enroll_UC"):
                                                             kony.i18n.getLocalizedString("i18n.frmOutageMessageController.EDIT");
      this.view.breadcrumbs.lblCurrentScreen.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.EditUser_UC");
    }else if(screen === 3){ //add other customers
      this.view.breadcrumbs.btnPreviousPage1.setVisibility(true);
      this.view.breadcrumbs.fontIconBreadcrumbsRight3.setVisibility(true);
      this.view.breadcrumbs.btnPreviousPage1.text = isEdit === false ? kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.Enroll_UC"):
                                                             kony.i18n.getLocalizedString("i18n.frmOutageMessageController.EDIT");
      this.view.breadcrumbs.lblCurrentScreen.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddCustomer_UC");
    }else if(screen === 4){ //create contract
      this.view.breadcrumbs.btnPreviousPage2.setVisibility(true);
      this.view.breadcrumbs.fontIconBreadcrumbsRight4.setVisibility(true);
      this.view.breadcrumbs.btnPreviousPage2.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddCustomer_UC");
      this.view.breadcrumbs.lblCurrentScreen.text = this.action === this.actionConfig.create ? kony.i18n.getLocalizedString("i18n.Contracts.createContract") :
                                                        kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.EditContract_UC");
    }
  },
  /*
  * shows enroll customer listing screen
  */
  showEnrollCustomer : function(){
    this.view.flxEnrollCustomerContainer.setVisibility(true);
    this.view.flxAddAnotherCustContainer.setVisibility(false);
    this.view.flxEditUserContainer.setVisibility(false);
    this.view.flxCreateContract.setVisibility(false);
    this.showBreadcrumbsForScreens(1);
    this.view.commonButtons.btnSave.text = (this.enrollAction === this.actionConfig.create) ? kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.Enroll_UC") :
                                             kony.i18n.getLocalizedString("i18n.frmOutageMessageController.UPDATE");
    this.view.commonButtons.btnSave.width = (this.enrollAction === this.actionConfig.create) ? "100dp" : "110dp";
    this.view.forceLayout();
  },
  /*
  * shows create contract screen
  */
  showCreateContractScreen : function(){
    this.view.flxCreateContract.setVisibility(true);
    this.view.flxEnrollCustomerContainer.setVisibility(false);
    this.view.flxAddAnotherCustContainer.setVisibility(false);
    this.view.flxEditUserContainer.setVisibility(false);
    this.showBreadcrumbsForScreens(4);
    this.view.forceLayout();
  },
   /*
  * hide create contract screen and show add customr screen
  * @param: category - on hide show add cust or enroll cust screens
  */
  hideCreateContractScreen : function(category){
    this.view.flxCreateContract.setVisibility(false);
    this.view.flxEnrollCustomerContainer.setVisibility(false);
    this.view.flxEditUserContainer.setVisibility(false);
    this.view.flxAddAnotherCustContainer.setVisibility(false);
    if(category === 1){ //show add customer screen on hide
      this.view.flxAddAnotherCustContainer.setVisibility(true);
      this.showBreadcrumbsForScreens(3);
    }else{ //show enroll customer screen on hide
      this.view.flxEnrollCustomerContainer.setVisibility(true);
      this.showBreadcrumbsForScreens(1);
    }
    this.view.forceLayout();
  },
  /*
  * shows edit user on click of contextual menu
  * @param: enable dropdown - true/false
  */
  showEditUserScreen : function(isListEnabled){
    this.showBreadcrumbsForScreens(2);
    this.view.flxEditUserContainer.setVisibility(true);
    this.view.flxEnrollCustomerContainer.setVisibility(false);
    this.view.flxAddAnotherCustContainer.setVisibility(false);
    this.view.flxCreateContract.setVisibility(false);
    //enable/disable the dropdown option
    this.enableDisableDropdownUIEditUser(this.view.customersDropdownAccounts, isListEnabled);
    this.enableDisableDropdownUIEditUser(this.view.customersDropdownFeatures, isListEnabled);
    this.enableDisableDropdownUIEditUser(this.view.customersDropdownOF, isListEnabled);
    this.enableDisableDropdownUIEditUser(this.view.customersDropdownLimits, isListEnabled);
    this.enableDisableDropdownUIEditUser(this.view.customersDropdownSignatory, isListEnabled);
    //enable all buttons
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditAccounts.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditAccounts.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditOF.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditOF.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditLimits.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditLimits.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditSignatories.btnSave,true,true);
    this.enableOrDisableVerticalTabEditUser(true);
    this.view.forceLayout();
    
  },
  /*
  * enable/disable the customers dropdown
  * @param: dropdown component path, enable/disable
  */
  enableDisableDropdownUIEditUser : function(dropdownPath, isListEnabled){
    if(isListEnabled === false){
      dropdownPath.flxSelectedText.onClick = function(){};
      dropdownPath.flxSelectedText.skin = "sknFlxbgF3F3F3bdrd7d9e0";
      dropdownPath.flxSelectedText.hoverSkin = "sknFlxbgF3F3F3bdrd7d9e0";
    } else{
      dropdownPath.flxSelectedText.onClick = dropdownPath.showHideCustomersDropdown;
      dropdownPath.flxSelectedText.skin = "sknflxffffffBorderE1E5EERadius3pxPointer";
      dropdownPath.flxSelectedText.hoverSkin = "sknFlxBorder117eb0radius3pxbgfff";
    }
  },
  /*
  * shows add another customer search screen
  */
  showAddAnotherCustomerScreen : function(){
    this.showBreadcrumbsForScreens(3);
    this.view.flxAddAnotherCustContainer.setVisibility(true);
    this.view.flxCreateContract.setVisibility(false);
    this.view.flxEditUserContainer.setVisibility(false);
    this.view.flxEnrollCustomerContainer.setVisibility(false);
    this.showRelatedCustomersListScreen()
    this.view.forceLayout();
    
  },
  /*
  * set data to enroll list
  * @param: primary customer info
  */
  setPrimaryCustInEnrollList : function(context){
    var self =this;
    var widgetMap = {
      "custId": "custId",
      "flxEnrollCustomerList" : "flxEnrollCustomerList",
      "lblCustomerName":"lblCustomerName",
      "lblCustomerId":"lblCustomerId",
      "flxPrimary":"flxPrimary",
      "lblPrimary":"lblPrimary",
      "lstBoxService":"lstBoxService",
      "flxServiceError":"flxServiceError",
      "lblIconServiceError":"lblIconServiceError",
      "lblServiceErrorMsg":"lblServiceErrorMsg",
      "lstBoxRole":"lstBoxRole",
      "flxRoleError":"flxRoleError",
      "lblIconRoleError":"lblIconRoleError",
      "lblRoleErrorMsg":"lblRoleErrorMsg",
      "lblSeperator":"lblSeperator",
      "flxOptions":"flxOptions" ,
      "lblOptions":"lblOptions",
      "lblRemoved":"lblRemoved",
      "custDetails":"custDetails"
    };
    var data = [],contractId ="", contractName ="",contractExists = false;
    var customerContractDetails = context.enrollCustomerContract;
    var customerInfo = context.customerInfo.customer;
    //set contract details if customer is already part of a contract
    if(customerContractDetails.length > 0){
      contractId = customerContractDetails[0].id;
      contractName = customerContractDetails[0].name;
      contractExists = true;
    }
    data.push(customerInfo);
    var currCustContact = this.presenter.getCurrentCustomerContactInfo();
    var addrInfo = currCustContact.Addresses && currCustContact.Addresses.length > 0 ?currCustContact.Addresses[0]:"";
    //creating custDetails obj to set data in edit user access screen cards
    data[0]["custDetails"] = {
      "addressLine1": addrInfo ? addrInfo.AddressLine1 : "",
      "addressLine2":addrInfo ? addrInfo.AddressLine2 : "",
      "coreCustomerId": customerInfo.Customer_id || customerInfo.primaryCustomerId ,
      "coreCustomerName": customerInfo.Name,
      "email": customerInfo.PrimaryEmailAddress,
      "phone": customerInfo.PrimaryPhoneNumber,
      "taxId":"",
      "contractId": contractId ? contractId : "", 
      "contractName": contractName ? contractName : customerInfo.Name,
      "serviceId": "",
      "cityName": addrInfo ? addrInfo.CityName : "",
      "country": addrInfo ? addrInfo.CountryName : "",
      "id": "",
      "isBusiness": customerInfo.CustomerType_id === this.AdminConsoleCommonUtils.constantConfig.RETAIL_TYPE ? "false" :"true",
      "isPrimary": "true",
      "state": addrInfo ? addrInfo.RegionName : "",
      "zipCode": addrInfo ? addrInfo.ZipCode : "",
      "autoSyncAccounts":this.autoSyncAccountsFlag
    };
    this.segment_ROW_FRAMES = [];
    var segData = data.map(this.mapCustomerDataforEnrollSeg);
    segData[0].flxPrimary.isVisible = true;
    //disable the service selection if already associated with contract
    if(contractExists){
      segData[0].lstBoxService.selectedKey= customerContractDetails[0].servicedefinitionId;
      segData[0].lstBoxService.enable = false;
      segData[0].lstBoxService.skin = "sknLbxborderd7d9e03pxradiusF3F3F3Disabled";
      this.fetchRolesforSelectedService(segData[0].lstBoxService.selectedKey,[0]);
    }
    this.isEditUserAccessVisited = {};
    var custId = customerInfo.Customer_id || customerInfo.primaryCustomerId;
    this.isEditUserAccessVisited[custId] = false;
    this.view.segEnrollCustList.widgetDataMap = widgetMap;
    this.view.segEnrollCustList.setData(segData);
	this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtons.btnSave,true,true);
    this.view.forceLayout();
  },
  /*
  * map data for enroll segment
  * @param: cust data to map
  */
  mapCustomerDataforEnrollSeg : function(rec){
    var self = this;
    var listBoxServiceData = this.getServiceListBoxMappedData();
    var listBoxRoleData = [["select",kony.i18n.getLocalizedString("i18n.frmCompanies.Select_a_role")]];
    this.prevRole[rec.Customer_id || rec.primaryCustomerId]={"key":"SELECT"};
    return {
        "custId":rec.Customer_id || rec.primaryCustomerId,
        "lblCustomerName":{"text":rec.Name,
                           "skin":"sknLbl192b45LatoReg16px"},
        "lblCustomerId":{"text":this.AdminConsoleCommonUtils.getTruncatedString((rec.Customer_id || rec.primaryCustomerId),12,10),
                         "skin":"sknLbl192b45LatoReg16px",
                         "toolTip":rec.Customer_id || rec.primaryCustomerId},
        "flxPrimary":{"isVisible":false},
        "lblPrimary": kony.i18n.getLocalizedString("i18n.ProfileManagement.Primary"),
        "lstBoxService":{"onSelection":self.onServiceRoleSelection.bind(self,1),
                         "skin":"sknLbxborderd7d9e03pxradius",
                         "masterData":listBoxServiceData,
                         "selectedKey": "select",
                         "enable": true},
        "flxServiceError":{"isVisible":false},
        "lblIconServiceError":"\ue94c",
        "lblServiceErrorMsg":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.PleaseSelectService"),
        "lstBoxRole":{"onSelection":self.onServiceRoleSelection.bind(self,2),
                      "skin":"sknLbxborderd7d9e03pxradius",
                      "masterData":listBoxRoleData,
                      "selectedKey": "select",
                      "enable": true},
        "flxRoleError":{"isVisible":false},
        "lblIconRoleError":"\ue94c",
        "lblRoleErrorMsg":kony.i18n.getLocalizedString("i18n.frmCompanies.Please_select_a_role"),
        "lblSeperator":"-",
        "flxOptions":{"isVisible":true,
                      "skin":"sknFlxBorffffff1pxRound",
                      "hoverSkin":"sknflxffffffop100Border424242Radius100px",
                      "onClick":self.toggleContextualMenu},
        "lblOptions":"\ue91f",
        "lblRemoved":{"isVisible":false},
        "template" : "flxEnrollCustomerList",
        "custDetails":rec.custDetails,
        "flxEnrollCustomerList":{
          "doLayout":function(eventObj){
            self.segment_ROW_FRAMES.push(eventObj.frame);
          }
        }
      };
  },
  /*
  * set list of cust/companies of infinty user in edit user flow
  * @param: get infinity user response
  */
  setEnrolledCustListForEdit : function(infinityUserData){
    var segData = [];    
    var custToShow = infinityUserData.companyList;
    for(var i=0; i<custToShow.length; i++){
      this.isEditUserAccessVisited[custToShow[i].cif] = false;
      var custData = {"Customer_id":custToShow[i].cif,
                      "Name":custToShow[i].companyName || custToShow[i].contractName,
                      "custDetails":custToShow[i]
                     };
      var segMapData = this.mapCustomerDataforEnrollSeg(custData);
      var isPrimary = custToShow[i].cif === infinityUserData.userDetails[0].coreCustomerId ? true : false;
      segMapData.flxPrimary.isVisible = isPrimary;
      segMapData.lblCustomerId.text = this.AdminConsoleCommonUtils.getTruncatedString(custToShow[i].cif,isPrimary?12:20,isPrimary?10:20);
      segMapData.lstBoxService.masterData = [["select", kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectService")],
                                             [custToShow[i].serviceDefinition, custToShow[i].serviceDefinitionName]];
      segMapData.lstBoxService.selectedKey = custToShow[i].serviceDefinition;
      segMapData.lstBoxService.enable = false;
      segMapData.lstBoxService.skin = "sknLbxborderd7d9e03pxradiusF3F3F3Disabled";
      var rolesList = custToShow[i].validRoles.reduce(
        function (list, record) {
          return list.concat([[record.roleId, record.userRole]]);

        }, [["select", kony.i18n.getLocalizedString("i18n.frmCompanies.Select_a_role")]]);
      segMapData.lstBoxRole.masterData = rolesList;
      segMapData.lstBoxRole.selectedKey = custToShow[i].roleId;
      this.prevRole[custToShow[i].cif]={"key":custToShow[i].roleId,
                                       "value":custToShow[i].userRole};
      segData.push(segMapData);
    }
    this.view.segEnrollCustList.setData(segData);
    this.segment_ROW_FRAMES = [];
    this.removedEnrollCustomers ={};
    this.view.forceLayout();
  },
  /*
  * add new customer row to associate and enroll
  * @param: segment widget path
  */
  addNewCustomerToEnroll : function(segmentPath){
    var data = [], enrollSegData, newSegRowToAdd = [],rowsIndexArr =[],primaryCustServiceId = "";
    var addedCustList = this.view.segEnrollCustList.data;
    var newCust = segmentPath.data[0][1];
    for(var j=0; j<newCust.length ;j++){
      if(newCust[j].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxSelected){
        newCust[j].custDetails.autoSyncAccounts=this.autoSyncAccountsFlag;
        data ={"Name":newCust[j].lblContractName.text,"Customer_id":newCust[j].lblContractId.text,
               "serviceId":newCust[j].serviceId,"custDetails": newCust[j].custDetails};
        this.isEditUserAccessVisited[newCust[j].lblContractId.text] = false;
        var existingCustObj = this.checkIfCustomerAlreadyAdded(newCust[j].lblContractId.text);
        if(existingCustObj.isExists === true){
          // in case of adding the primary cust again after removal
          if(newCust[j].lblContractId.text === existingCustObj.existingCust.custId  &&
             existingCustObj.existingCust.flxPrimary.isVisible === true && existingCustObj.existingCust.lblRemoved.isVisible === true){
            this.view.segEnrollCustList.removeAt(0);
            enrollSegData = this.mapCustomerDataforEnrollSeg(data);
            enrollSegData.lstBoxService.enable = false;
            enrollSegData.lstBoxService.selectedKey = data.serviceId;
            enrollSegData.lstBoxService.skin = "sknLbxborderd7d9e03pxradiusF3F3F3Disabled";
            enrollSegData.flxPrimary.isVisible = true;
            rowsIndexArr.push(0);
            primaryCustServiceId = data.serviceId;
            this.view.segEnrollCustList.addDataAt(enrollSegData,0);
          } 
        }  // add the selected customer to enroll list
        else if(existingCustObj.isExists === false){
          enrollSegData = this.mapCustomerDataforEnrollSeg(data);
          enrollSegData.lstBoxService.enable = false;
          enrollSegData.lstBoxService.selectedKey = data.serviceId;
          enrollSegData.lstBoxService.skin = "sknLbxborderd7d9e03pxradiusF3F3F3Disabled";
          newSegRowToAdd.push(enrollSegData);
        }
      }  
    }  
    //append the newly added customers to enroll segment
    for(var k=0; k<newSegRowToAdd.length; k++){
      rowsIndexArr.push(this.view.segEnrollCustList.data.length);
      this.view.segEnrollCustList.addDataAt(newSegRowToAdd[k],this.view.segEnrollCustList.data.length);
    }
    //fetch roles list to set
    if(newSegRowToAdd.length > 0)
      this.fetchRolesforSelectedService(newSegRowToAdd[0].lstBoxService.selectedKey,rowsIndexArr);
    else if(primaryCustServiceId !== "" && rowsIndexArr.length > 0)
      this.fetchRolesforSelectedService(primaryCustServiceId,rowsIndexArr);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtons.btnSave,true,true);
  },
  /*
  * get list of services for listbox
  * @return : listbox masterdata formatted services list
  */
  getServiceListBoxMappedData : function(){
    var serviceList = [];
    serviceList = this.serviceDefinitions.reduce(
      function (list, record) {
        return list.concat([[record.id, record.name]]);
      }, [["select", kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectService")]]);
    return serviceList;
  },
  /*
  * get list of role for listbox
  * @param: list of roles
  * @return : listbox masterdata formatted roles list
  */
  getRoleListBoxMappedData : function(rolesList){
    var self =this;
    var mappedRolesList = [];
    mappedRolesList = rolesList.reduce(
      function (list, record) {
        if(record.status === self.AdminConsoleCommonUtils.constantConfig.ACTIVE)
          return list.concat([[record.id, record.name]]);
        else
          return list;
      }, [["select", kony.i18n.getLocalizedString("i18n.frmCompanies.Select_a_role")]]);
    return mappedRolesList;
  },
  /*
  * on selecting service/role listbox option
  * @param: opt- (service listbox:1, role listbox:2)
  */
  onServiceRoleSelection : function(opt,eventObj,context){
    var selRowInd = context.rowIndex;
    var selRowData = this.view.segEnrollCustList.data[selRowInd];
    this.enrollSegRowInd = context.rowIndex;
    this.clearServiceRoleValidationError(opt, context); 
    if(opt === 1){ //service listbox selected
      selRowData.custDetails.serviceId = selRowData.lstBoxService.selectedKey;
      this.view.segEnrollCustList.setDataAt(selRowData,selRowInd);
      this.fetchRolesforSelectedService(selRowData.lstBoxService.selectedKey, [selRowInd]);
      this.fetchCreateContractDetails();
      this.removeTempContractCustFromEnrollSeg(selRowInd);
    }else{ //role listbox selected
       this.fetchEditUserAccessDetails();
    }
  },
  /*
  * fetch the list of roles for given service id
  * @param: service id, row index array
  */
  fetchRolesforSelectedService : function(serviceId,rowIndArr){
    var reqParam = {"serviceDefinitionId": serviceId};
    this.presenter.getServiceDefinitionRoles(reqParam,rowIndArr);
  },
  /*
  * changes the roles list and clear the selection based on service selection
  * @param: list of roles for selected service, array of row index to set the roles
  */
  clearRoleSelection : function(serviceRoles,rowIndArr){
    var mappedRolesList = this.getRoleListBoxMappedData(serviceRoles.roles);
    for(var i=0; i<rowIndArr.length; i++){
      var selRowData = this.view.segEnrollCustList.data[rowIndArr[i]];
      selRowData.lstBoxRole.masterData = mappedRolesList;
      selRowData.lstBoxRole.selectedKey = "select";
      selRowData.lstBoxRole.selectedkey = "select";
      this.view.segEnrollCustList.setDataAt(selRowData, rowIndArr[i]);
    }
  },
  /*
  * show or hide contextual menu for enroll customer list
  */
  toggleContextualMenu:function(eventObj,context){
    var rowIndex = context.rowIndex;
    this.enrollSegRowInd = context.rowIndex;
    if (this.view.flxContextualMenu.isVisible === true){
      this.view.flxContextualMenu.setVisibility(false);
    }
    else{
      this.updateContextualMenuOptions(rowIndex); 
    }
    this.view.forceLayout();
    var heightVal= 0;
    for (var i = 0; i < rowIndex; i++) {
      heightVal = heightVal + this.segment_ROW_FRAMES[i].height;
    }
    var scrollWidget = this.view.flxEnrollCustomerSeg;
    var contextualWidget = this.view.flxContextualMenu;
    heightVal = heightVal + 50+ 106 - scrollWidget.contentOffsetMeasured.y;
    if ((heightVal + contextualWidget.frame.height) > (scrollWidget.frame.height+80)){
      this.view.flxContextualMenu.top=((heightVal-this.view.flxContextualMenu.frame.height)-25)+"px";
      this.view.flxUpArrowImage.setVisibility(false);
      this.view.flxDownArrowImage.setVisibility(true);
      this.view.flxContextualMenuOptions.top = "0px";    }
    else{
      this.view.flxContextualMenu.top=(heightVal)+"px";
      this.view.flxUpArrowImage.setVisibility(true);
      this.view.flxDownArrowImage.setVisibility(false);
      this.view.flxContextualMenuOptions.top = "-1px";
    }
    this.changeOptionsSkin();
  },
  /*
  * show /hide the contextual menu options based on action
  * @param: rowIndex
  */
  updateContextualMenuOptions : function(rowIndex){
    var segRowData = this.view.segEnrollCustList.data[rowIndex];
    var removeVis = true;
    if(this.enrollAction === this.actionConfig.create){
      var contractOption = (segRowData.custDetails.contractId === "" && segRowData.flxPrimary.isVisible === true) ?
          true : false;
      this.view.flxOption1.setVisibility(contractOption);
    } else{
      this.view.flxOption1.setVisibility(false);
      //hide remove option in case of one record
      if(this.view.segEnrollCustList.data.length === 2){
        removeVis = (this.view.segEnrollCustList.data[0].lblRemoved.isVisible === true || this.view.segEnrollCustList.data[1].lblRemoved.isVisible === true) ?
                     false : true;
      } else{
        removeVis = this.view.segEnrollCustList.data.length === 1 ? false: true;
      }
      this.view.flxOption2.setVisibility(removeVis);
      this.view.flxOptionsSeperator.setVisibility(removeVis);
    }
    this.view.flxContextualMenu.setVisibility(true);
  },
   /*
  * show poup for removing primary customer from contextual menu
  */
  showRemoveCustomerPopup: function(){
    var self = this;
    var segData = this.view.segEnrollCustList.data;
    var rowData = segData[this.enrollSegRowInd];
    this.view.popUpDeactivate.lblPopUpMainMessage.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.RemoveAccessToCustomer");
    this.view.popUpDeactivate.rtxPopUpDisclaimer.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AreYouSureYouWantToRemove") + " "+
      rowData.lblCustomerName.text+ " " + kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.accessToHisPrimaryCustomerId")+" ("+ rowData.custId +")";
    this.view.popUpDeactivate.btnPopUpCancel.text = kony.i18n.getLocalizedString("i18n.frmCustomers.CANCEL");
    this.view.popUpDeactivate.btnPopUpDelete.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Remove").toUpperCase();
    this.view.flxEnrollCustConfirmationPopup.setVisibility(true);

    this.view.popUpDeactivate.btnPopUpDelete.onClick = function(){
      self.removeCustomerFromEnroll();
      self.view.flxEnrollCustConfirmationPopup.setVisibility(false);
    };
  },
  /*
  * remove added customer from contextual menu
  */
  removeCustomerFromEnroll : function(){
    var segData = this.view.segEnrollCustList.data;
    var rowData = segData[this.enrollSegRowInd];
    if(rowData.custDetails.contractId !== ""){
      var custId = rowData.custDetails.coreCustomerId || rowData.custDetails.cif;
      this.removedEnrollCustomers[custId] = {"contractId":rowData.custDetails.contractId, "cif":custId};
    }
    if(rowData.flxPrimary.isVisible === true){ //for primary customer
      rowData.lblCustomerName.skin = "sknLbl192b45LatoReg16pxOp50";
      rowData.lblCustomerId.skin = "sknLbl192b45LatoReg16pxOp50";
      rowData.lstBoxService.enable = false;
      rowData.lstBoxRole.enable = false;
      rowData.lblRemoved.isVisible = true;
      rowData.flxOptions.isVisible = false;
      this.view.segEnrollCustList.setDataAt(rowData, this.enrollSegRowInd);
    }else{ //for non-primary customers
      this.view.segEnrollCustList.removeAt(this.enrollSegRowInd);
      this.presenter.deleteAccountsFeaturesForEnrollCust(rowData.custId);
    }
    //disable enroll button if no customer available in list
    if(segData.length === 1){
      var btnEnable = segData[0].lblRemoved.isVisible === true ? false : true;
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtons.btnSave,true,btnEnable);
    } else if(segData.length === 0){
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtons.btnSave,true,false);
    }
  },
  /*
  * hide contextual menu on hover callback
  */
  onHoverEventCallback:function(widget, context) {
    if (context.eventType === constants.ONHOVER_MOUSE_ENTER||context.eventType === constants.ONHOVER_MOUSE_MOVE) {
      widget.setVisibility(true);
    } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
      widget.setVisibility(false);
      this.changeOptionsSkin();
    }
  },
  /*
  * change the current selected row option menu skin
  */
  changeOptionsSkin : function(){
    var skin = this.view.flxContextualMenu.isVisible ? "sknflxffffffop100Border424242Radius100px" : "sknFlxBorffffff1pxRound";
    var segData = this.view.segEnrollCustList.data;
    if(this.prevIndex !=-1 && this.prevIndex < segData.length){
      var tempSegDataPrev = segData[this.prevIndex];
      tempSegDataPrev.flxOptions.skin = "slFbox";
      this.view.segEnrollCustList.setDataAt(tempSegDataPrev, this.prevIndex, 0);
    }
    var selcRow = this.view.segEnrollCustList.selectedRowIndex;
    if(selcRow){
      var selectIndex = this.view.segEnrollCustList.selectedRowIndex[1];
      var tempCurrent = segData[selectIndex];
      tempCurrent.flxOptions.skin =skin;
      this.view.segEnrollCustList.setDataAt(tempCurrent, selectIndex, 0);
      this.prevIndex = selectIndex;
    }
  },
   /*
  * validate service/role field selections
  * @param: rowIndex
  * @return: isValid - true/false
  */
  validateServiceRoleSelection : function(rowIndex){
    var isValidSel = true;
    var selRowData = this.view.segEnrollCustList.data[rowIndex];
    if(selRowData.lstBoxService.selectedKey === "select" && selRowData.lblRemoved.isVisible === false){
      isValidSel = false;
      selRowData.lstBoxService.skin = "sknLstBoxeb3017Bor3px";
      selRowData.flxServiceError.isVisible = true;
    }
    if(selRowData.lstBoxRole.selectedKey === "select" && selRowData.lblRemoved.isVisible === false){
      isValidSel = false;
      selRowData.lstBoxRole.skin = "sknLstBoxeb3017Bor3px";
      selRowData.flxRoleError.isVisible = true;  
    }
    this.view.segEnrollCustList.setDataAt(selRowData,rowIndex);
    return isValidSel;
  },
  /*
  *clear inline errors on service/role selection
  * @param: opt -1/2, context - row selection context
  */
  clearServiceRoleValidationError : function(opt,context){
    var selRowInd = context.rowIndex;
    var selRowData = this.view.segEnrollCustList.data[selRowInd];
    if(opt === 1 && selRowData.lstBoxService.selectedKey !== "select"){
      selRowData.lstBoxService.skin = "sknLbxborderd7d9e03pxradius";
      selRowData.flxServiceError.isVisible = false;
    }
    if(opt === 2 && selRowData.lstBoxRole.selectedKey !== "select"){
      selRowData.lstBoxRole.skin = "sknLbxborderd7d9e03pxradius";
      selRowData.flxRoleError.isVisible = false;
    }
    this.view.segEnrollCustList.setDataAt(selRowData,selRowInd);
  },
  /*
  * shows the account tab in edit user
  */
  showEditAccountsScreen : function(){
    this.view.flxEnrollEditAccountsContainer.setVisibility(true);
    this.view.flxEnrollEditFeaturesContainer.setVisibility(false);
    this.view.flxEnrollEditOtherFeaturesCont.setVisibility(false);
    this.view.flxEnrollEditLimitsContainer.setVisibility(false);
    this.view.flxEnrollEdiSignatoryContainer.setVisibility(false);
    var widgetBtnArr = [this.view.enrollVerticalTabs.btnOption1,this.view.enrollVerticalTabs.btnOption2,this.view.enrollVerticalTabs.btnOption3,this.view.enrollVerticalTabs.btnOption4,this.view.enrollVerticalTabs.btnOption5];
    var widgetArrowArr = [this.view.enrollVerticalTabs.flxImgArrow1,this.view.enrollVerticalTabs.flxImgArrow2,this.view.enrollVerticalTabs.flxImgArrow3, this.view.enrollVerticalTabs.flxImgArrow4,this.view.enrollVerticalTabs.flxImgArrow5];
    this.tabUtilVerticleButtonFunction(widgetBtnArr,this.view.enrollVerticalTabs.btnOption1);
    this.tabUtilVerticleArrowVisibilityFunction(widgetArrowArr,this.view.enrollVerticalTabs.flxImgArrow1);
    this.view.searchEditAccounts.tbxSearchBox.text = "";
    this.view.searchEditAccounts.flxSearchCancel.setVisibility(false);
    this.view.enrollEditAccountsCard.flxArrow.setVisibility(false);
    this.view.flxEnrollEditAccountsList.setContentOffset({x:0,y:0});
    this.view.enrollEditAccountsCard.lblHeading.text =kony.i18n.getLocalizedString("i18n.frmCompanies.Selected_Accounts") + ":";
  },
  /*
  * shows the features tab in edit user
  * @param: tab selection(customer level:1,acc level:2)
  */
  showEditFeaturesScreen : function(tabOption){
    this.view.flxEnrollEditAccountsContainer.setVisibility(false);
    this.view.flxEnrollEditFeaturesContainer.setVisibility(true);
    this.view.flxEnrollEditOtherFeaturesCont.setVisibility(false);
    this.view.flxEnrollEditLimitsContainer.setVisibility(false);
    this.view.flxEnrollEdiSignatoryContainer.setVisibility(false);
    var widgetBtnArr = [this.view.enrollVerticalTabs.btnOption1,this.view.enrollVerticalTabs.btnOption2,this.view.enrollVerticalTabs.btnOption3, this.view.enrollVerticalTabs.btnOption4,this.view.enrollVerticalTabs.btnOption5];
    var widgetArrowArr = [this.view.enrollVerticalTabs.flxImgArrow1,this.view.enrollVerticalTabs.flxImgArrow2,this.view.enrollVerticalTabs.flxImgArrow3, this.view.enrollVerticalTabs.flxImgArrow4,this.view.enrollVerticalTabs.flxImgArrow5];
    this.tabUtilVerticleButtonFunction(widgetBtnArr,this.view.enrollVerticalTabs.btnOption2);
    this.tabUtilVerticleArrowVisibilityFunction(widgetArrowArr,this.view.enrollVerticalTabs.flxImgArrow2);
    this.view.toggleButtonsFeatures.info = {"selectedTab":1};
    this.view.searchEditFeatures.tbxSearchBox.text = "";
    this.view.searchEditFeatures.flxSearchCancel.setVisibility(false);
    this.view.flxAccountTypesFilter.setVisibility(false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnNext,false,true);
    this.enableOrDisableVerticalTabEditUser(true);
    if(tabOption === 1){
      this.toggleFeaturesCustomerLevel();
    }else if(tabOption === 2){
      this.toggleFeaturesAccountLevel();
    }
    this.view.forceLayout();
  },
  /*
  * shows other features and actions tab in edit user
  */
  showEditOtherFeaturesScreen : function(){
    this.view.flxEnrollEditAccountsContainer.setVisibility(false);
    this.view.flxEnrollEditFeaturesContainer.setVisibility(false);
    this.view.flxEnrollEditOtherFeaturesCont.setVisibility(true);
    this.view.flxEnrollEditLimitsContainer.setVisibility(false);
    this.view.flxEnrollEdiSignatoryContainer.setVisibility(false);
    var widgetBtnArr = [this.view.enrollVerticalTabs.btnOption1,this.view.enrollVerticalTabs.btnOption2,this.view.enrollVerticalTabs.btnOption3, this.view.enrollVerticalTabs.btnOption4,this.view.enrollVerticalTabs.btnOption5];
    var widgetArrowArr = [this.view.enrollVerticalTabs.flxImgArrow1,this.view.enrollVerticalTabs.flxImgArrow2,this.view.enrollVerticalTabs.flxImgArrow3, this.view.enrollVerticalTabs.flxImgArrow4,this.view.enrollVerticalTabs.flxImgArrow5];
    this.tabUtilVerticleButtonFunction(widgetBtnArr,this.view.enrollVerticalTabs.btnOption3);
    this.tabUtilVerticleArrowVisibilityFunction(widgetArrowArr,this.view.enrollVerticalTabs.flxImgArrow3);
    this.view.searchEditOtherFeatures.tbxSearchBox.text = "";
    this.view.searchEditOtherFeatures.flxSearchCancel.setVisibility(false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditOF.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditOF.btnNext,false,true);
    this.enableOrDisableVerticalTabEditUser(true);
    this.createOtherFeaturesCard();
  },
  /*
  * shows the limit tab in edit user
  * @param: tabOption(customer level:1,acc level:2)
  */
  showEditLimitsScreen : function(tabOption){
    this.view.flxEnrollEditAccountsContainer.setVisibility(false);
    this.view.flxEnrollEditFeaturesContainer.setVisibility(false);
    this.view.flxEnrollEditOtherFeaturesCont.setVisibility(false);
    this.view.flxEnrollEdiSignatoryContainer.setVisibility(false);
    this.view.flxEnrollEditLimitsContainer.setVisibility(true);
    var widgetBtnArr = [this.view.enrollVerticalTabs.btnOption1,this.view.enrollVerticalTabs.btnOption2,this.view.enrollVerticalTabs.btnOption3, this.view.enrollVerticalTabs.btnOption4,this.view.enrollVerticalTabs.btnOption5];
    var widgetArrowArr = [this.view.enrollVerticalTabs.flxImgArrow1,this.view.enrollVerticalTabs.flxImgArrow2,this.view.enrollVerticalTabs.flxImgArrow3, this.view.enrollVerticalTabs.flxImgArrow4,this.view.enrollVerticalTabs.flxImgArrow5];
    this.tabUtilVerticleButtonFunction(widgetBtnArr,this.view.enrollVerticalTabs.btnOption4);
    this.tabUtilVerticleArrowVisibilityFunction(widgetArrowArr,this.view.enrollVerticalTabs.flxImgArrow4);
    this.view.toggleButtonsLimits.info = {"selectedTab":1};
    this.view.searchEditLimits.tbxSearchBox.text = "";
    this.view.searchEditLimits.flxSearchCancel.setVisibility(false);
    this.view.flxAccountTypesFilter.setVisibility(false);
    if(tabOption === 1){
      this.toggleLimitsCustomerLevel();
    } else if(tabOption === 2){
      this.toggleLimitsAccountLevel();
    }
    this.view.forceLayout();
  },
   /*
  * show related customers list
  */
  showRelatedCustomersListScreen : function(){
    this.view.flxEnrollRelatedCustomersBox.setVisibility(true);
    this.view.flxAddCustomerBox.setVisibility(false);
    this.view.flxSelectedRelatedCustDetailsBox.setVisibility(false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsRelatedCust.btnSave,true,false);
    this.view.lblRelatedcustSubHeading.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.CustomersRelatedTo")+ " " +
      this.customerToEnrollInfo.Name + " ("+ (this.customerToEnrollInfo.Customer_id || this.customerToEnrollInfo.primaryCustomerId) +")";
  },
  /*
  * show selected related customer details and contract
  */
  showRelatedCustomerDetailsScreen : function(){
    this.view.flxSelectedRelatedCustDetailsBox.setVisibility(true);
    this.view.flxEnrollRelatedCustomersBox.setVisibility(false);
    this.view.flxAddCustomerBox.setVisibility(false);
    this.view.flxRelatedCustContractCont.setVisibility(false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsRelatedDetails.btnSave,true,false);
    this.setRelatedCustomerDetails();
    this.view.forceLayout();
  },
  /*
  * show search other customers screen
  */
  showSearchOtherCustomerScreen : function(){
    this.view.flxAddCustomerBox.setVisibility(true);
    this.view.flxSelectedRelatedCustDetailsBox.setVisibility(false);
    this.view.flxEnrollRelatedCustomersBox.setVisibility(false);
    this.view.flxNoResultsContainer.setVisibility(true);
    this.view.flxNoContractAvailableFlag.setVisibility(false);
    this.view.noResultsSearchCustomers.btnAddRecord.setVisibility(false);
    this.view.flxSearchCustomerContractList.setVisibility(false);
    this.view.flxSearchResultsForAddCust.setVisibility(false);
    this.view.flxAddCustAdvanceSearchCont.setVisibility(false);
    this.showHideAdvanceSearchParam(false);
    this.clearCustSearchValidation();
    this.clearOtherCustSearchFields();
    this.view.commonButtonsAddAnotherCust.btnSave.info = {"addCustCase" :1};
    this.view.noResultsSearchCustomers.lblNoRecordsAvailable.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SearchCustomerToSeeContactExists");
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsAddAnotherCust.btnSave,true,false);
  },
  /*
  * show customer results list for the search
  */
  showSearchedCustomerResults : function(){
    this.view.flxSearchResultsForAddCust.setVisibility(true);
    this.view.flxSearchCustomerContractList.setVisibility(false);
    this.view.flxNoResultsContainer.setVisibility(false);
    this.view.flxNoContractAvailableFlag.setVisibility(false);
    this.view.lblSelectedSearchSubCriteria.setVisibility(false);
    this.showHideAdvanceSearchParam(false);
  },
  /*
  * show selected customer contracts list
  * @param: option - (on seg row click:1,direct navigation:2), customer details(name,id)
  */
  showSelectedCustFromSearchResults : function(option,customerData){
    this.view.flxSearchResultsForAddCust.setVisibility(false);
    this.view.flxSearchCustomerContractList.setVisibility(true);
    this.view.flxNoResultsContainer.setVisibility(false);
    this.view.flxNoContractAvailableFlag.setVisibility(false);
    this.view.lblContractListHeader.setVisibility(false);
    this.view.lblAddContractInfoHeading.top = "0dp";
    this.showHideAdvanceSearchParam(false);
    this.view.lblAddContractInfoHeading.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ContractExistsFor") +
                                                " "+customerData.name+" ("+customerData.id+")";
    if(option === 1){
      this.view.flxBackOptionAddCust.setVisibility(true);
    } else{
      this.view.flxBackOptionAddCust.setVisibility(false);
    }
  },
   /*
  * show searched customer realted contracts list
  * @param:searched customer response 
  */
  showRelativeContractsFromSearchResults : function(customerData){
    this.view.flxSearchResultsForAddCust.setVisibility(false);
    this.view.flxSearchCustomerContractList.setVisibility(true);
    this.view.flxNoResultsContainer.setVisibility(false);
    this.view.flxNoContractAvailableFlag.setVisibility(true);
    this.view.flxBackOptionAddCust.setVisibility(false);
    this.view.lblContractListHeader.setVisibility(true);
    this.view.lblAddContractInfoHeading.top = "15dp";
	this.view.btnAddContract.setVisibility(true);
    this.showHideAdvanceSearchParam(false);
    this.view.contractInfoFlagMessage.setInfoSkin();
    var custInfo = (customerData.customers && customerData.customers.length > 0) ? customerData.customers[0] : "";
    var custText = custInfo ? custInfo.coreCustomerName +" ("+custInfo.coreCustomerId +")" : "";
    this.view.contractInfoFlagMessage.lblErrorValue.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoContractExistsFor") + " "+ custText ;
    this.view.lblAddContractInfoHeading.text = kony.i18n.getLocalizedString("i18n.frmPermissionsController.Add") + " " +custText +
      " " + kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.toAnyOfFollowingOrCreate");
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsAddAnotherCust.btnSave,true,true);
  },
  /*
  * show create contract button in case no contract exists for searched customer
  */
  showCreateContractOption : function(customerResponse){
    this.view.flxSearchResultsForAddCust.setVisibility(false);
    this.view.flxSearchCustomerContractList.setVisibility(false);
    this.view.flxNoResultsContainer.setVisibility(true);
    this.view.flxNoContractAvailableFlag.setVisibility(true);
    this.view.noResultsSearchCustomers.btnAddRecord.setVisibility(true);
    this.showHideAdvanceSearchParam(false);
    this.view.contractInfoFlagMessage.setInfoSkin();
    var custInfo = customerResponse.customers && customerResponse.customers.length > 0 ? customerResponse.customers[0] : "";
    var custNameId = custInfo ? custInfo.coreCustomerName + " ("+custInfo.coreCustomerId + ")" : "";
    this.view.noResultsSearchCustomers.lblNoRecordsAvailable.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddNewContractFor") + " " + custNameId;
    this.view.noResultsSearchCustomers.btnAddRecord.text = "Create New Contract";
    this.view.contractInfoFlagMessage.lblErrorValue.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoContractOrRelatedContract") + " " + custNameId;
    if(custInfo){
      this.addSearchCustToContractCustList(custInfo);
    }
    this.view.forceLayout();
  },
  /*
  * add searched customer to contract by default
  * @param: customer details
  */
  addSearchCustToContractCustList : function(custInfo){
    this.selectedCustomers = [];
    custInfo["isSelected"] = true;
    this.selectedCustomers.push(custInfo);
  },
  /*
  * show/hide the advanced search param in add another customer screen
  */
  showHideAdvanceSearchParam : function(opt){
    if(opt === true){
      this.view.flxSearchField13.setVisibility(true);
      this.view.flxAddCustAdvanceSearchCont.setVisibility(true);
      this.view.lblIconSearchArrow.text = "\ue986"; //up arrow
      this.view.lblIconSearchArrow.skin = "sknfontIconDescDownArrow12px";
    } else{
      this.view.flxSearchField13.setVisibility(false);
      this.view.flxAddCustAdvanceSearchCont.setVisibility(false);
      this.view.lblIconSearchArrow.text = "\ue922"; //side arrow
      this.view.lblIconSearchArrow.skin = "sknfontIconDescRightArrow14px";
      
    }
  },
  /*
  * enable/disable vertical tabs in edit user access 
  * @param: true/false
  */
  enableOrDisableVerticalTabEditUser : function(isEnable){
    this.view.enrollVerticalTabs.setEnabled(isEnable);
  },
  /*
  * call the respective function based on the contract result
  * @param: contract response context
  */
  viewContractCases : function(context){
    var contracts = context.contractOfCustomer
    var customerDeatils = context.custSearchResponse;
    //contract exists for customer
    if(contracts.length === 1 && context.contractType === "core"){ 
      var custDetails = "";
      if(customerDeatils){ //single customer result
        custDetails = {"name":customerDeatils.customers[0].coreCustomerName,
                       "id":customerDeatils.customers[0].coreCustomerId};
        this.showSelectedCustFromSearchResults(1,custDetails);
      }else{ //multiple cust result - on seg customer click
        var selInd = this.view.segSearchResultsCust.selectedRowIndex[1];
        var segData = this.view.segSearchResultsCust.data[selInd];
        custDetails = {"name":segData.lblSearchSegHeaderCustName.text,
                       "id":segData.lblSearchSegHeaderCustId.text};
        this.showSelectedCustFromSearchResults(2,custDetails);
      }
      this.view.commonButtonsAddAnotherCust.btnSave.info.addCustCase = 1;
      this.setSelectedOtherCustContractCards(contracts,custDetails);
    }//contract exist for related customers only
    else if(context.contractType === "related" && contracts.length !== 0){ 
      this.view.btnAddContract.info = {"customerDetail":customerDeatils};
      this.view.commonButtonsAddAnotherCust.btnSave.info.addCustCase = 2;
      this.showRelativeContractsFromSearchResults(customerDeatils);
      this.setSearchedCustRelatedContractCards(contracts,customerDeatils);
    } //any contract does not exist
    else if(contracts.length === 0){ 
      this.view.commonButtonsAddAnotherCust.btnSave.info.addCustCase = 3;
      this.showCreateContractOption(customerDeatils);
    }
  },
  /*
  * widget data map for accounts segment
  * @return: widget data map object
  */
  widgetMapForAccounts : function(){
    var widgetMap = {
      "flxHeaderContainer":"flxHeaderContainer",
      "flxAccountNumCont":"flxAccountNumCont",
      "lblAccountNumber":"lblAccountNumber",
      "lblIconSortAccName":"lblIconSortAccName",
      "flxCheckbox":"flxCheckbox",
      "imgSectionCheckbox":"imgSectionCheckbox",
      "flxAccountType":"flxAccountType",
      "lblAccountType":"lblAccountType",
      "lblIconFilterAccType":"lblIconFilterAccType",
      "lblAccountName":"lblAccountName",
      "flxAccountName":"flxAccountName",
      "lblIconAccNameSort":"lblIconAccNameSort",
      "flxAccountHolder":"flxAccountHolder",
      "lblAccountHolder":"lblAccountHolder",
      "lblIconSortAccHolder":"lblIconSortAccHolder",
      "flxAccFlag":"flxAccFlag",
      "lblNewText":"lblNewText",
      "fontIconFlag":"fontIconFlag",
      "lblSeperator":"lblSeperator",
      "flxContractEnrollAccountsEditSection":"flxContractEnrollAccountsEditSection",
      "id":"id",
      "imgCheckbox":"imgCheckbox",
      "flxContractEnrollAccountsEditRow":"flxContractEnrollAccountsEditRow"
    };
    return widgetMap;
  },
  /*
  * set segment data for edit accounts
  */
  setAccountsSegmentData : function(accountsList,isAutoSync){
    var self =this;
    var rowData = [], accountsAvail = false;
    var custId = this.view.customersDropdownAccounts.lblSelectedValue.info.customerId;
    this.selAccCount[custId] = 0;
    if(accountsList.size > 0){
      accountsAvail = true;
      accountsList.forEach(function(rec,key){
        rowData.push({
          "id":rec.accountNumber,
          "flxCheckbox":{"onClick":self.onClickAccountsEditUserAccess.bind(self,self.view.enrollEditAccountsCard.segAccountFeatures,false)},
          "imgCheckbox":{"src":(rec.isAssociated === "true" || rec.isEnabled === "true") ? self.AdminConsoleCommonUtils.checkboxSelected : self.AdminConsoleCommonUtils.checkboxnormal},
          "lblAccountNumber": {"text": rec.accountNumber},
          "lblAccountType": {"text": rec.accountType || ""},
          "lblAccountName": {"text": rec.accountName || kony.i18n.getLocalizedString("i18n.Applications.NA")},
          "lblAccountHolder": {"text": rec.ownerType || ""},
          "lblSeperator":"-",
          "template":"flxContractEnrollAccountsEditRow"
        });
        if(rec.isAssociated === "true" || rec.isEnabled === "true") 
          self.selAccCount[custId] = self.selAccCount[custId] +1;
      });
      var secData = {
        "flxCheckbox":{"onClick": this.onCheckAccountsCheckbox.bind(this,this.view.enrollEditAccountsCard.segAccountFeatures,true)},
        "flxAccountNumCont":{"onClick":this.sortAndSetData.bind(this,"lblAccountNumber.text",this.view.enrollEditAccountsCard.segAccountFeatures, 1)},
        "lblIconSortAccName":{
          "text": "\ue92a",
          "skin": "sknIcon12pxBlack","hoverSkin" :"sknIcon12pxBlackHover",
          "left" : "10px"
        },
        "lblAccountNumber": kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNUMBER"),
        "imgSectionCheckbox": {"src":this.getHeaderCheckboxImage(rowData,true,true)},
        "flxAccountType":{"onClick": this.showFilterForAccountsSectionClick.bind(this,1)},
        "lblAccountType": kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTTYPE"),
        "lblIconFilterAccType":"\ue916",
        "lblAccountName": kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNAME"),
        "lblIconAccNameSort":{
          "text": "\ue92b",
          "skin": "sknIcon15px","hoverSkin":"sknlblCursorFont",
          "left" : "5px"
        },
        "flxAccountName":{"onClick": this.sortAndSetData.bind(this,"lblAccountName.text", this.view.enrollEditAccountsCard.segAccountFeatures, 1)},
        "flxAccountHolder":{"onClick": this.showFilterForAccountsSectionClick.bind(this,2)},
        "lblAccountHolder": kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.OWNERSHIP_TYPE"),
        "lblIconSortAccHolder":"\ue916",
        "lblSeperator":"-",
        "template":"flxContractEnrollAccountsEditSection",
      };
      this.sortBy = this.getObjectSorter("lblAccountNumber.text");
      this.sortBy.inAscendingOrder = true;
      rowData = rowData.sort(this.sortBy.sortData);
      this.view.enrollEditAccountsCard.lblCount.text = this.getSelectedItemsCount(rowData, true);
      this.view.enrollEditAccountsCard.lblTotalCount.text = "of " + this.getTwoDigitNumber(rowData.length);
      this.view.enrollEditAccountsCard.flxNoFilterResults.setVisibility(false);
      this.view.enrollEditAccountsCard.segAccountFeatures.setVisibility(true);
      this.view.searchEditAccounts.setVisibility(true);
      this.view.enrollEditAccountsCard.segAccountFeatures.widgetDataMap = this.widgetMapForAccounts();
      this.view.enrollEditAccountsCard.segAccountFeatures.setData([[secData,rowData]]);
      this.view.enrollEditAccountsCard.segAccountFeatures.info = {"segData":[[secData,rowData]], "segDataJSON":{}};
      this.setDataToAccountsTabFilters();
    } else{
      accountsAvail = false;
      this.view.enrollEditAccountsCard.lblCount.text = "0";
      this.view.enrollEditAccountsCard.lblTotalCount.text = "of 0";
      this.view.enrollEditAccountsCard.segAccountFeatures.setData([]);
      this.view.enrollEditAccountsCard.segAccountFeatures.info = {"segData":[], "segDataJSON":{}};
      this.view.enrollEditAccountsCard.flxNoFilterResults.setVisibility(true);
      this.view.enrollEditAccountsCard.lblNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmGroups.rtxNoRecordsAvailable");
      this.view.enrollEditAccountsCard.segAccountFeatures.setVisibility(false);
      this.view.searchEditAccounts.setVisibility(false); 
    }
    var autoSyncFlag=isAutoSync?isAutoSync:this.autoSyncAccountsFlag;
    this.view.enrollEditAccountsCard.imgCheckboxOptions.src=autoSyncFlag==="true"?"checkboxselected.png":"checkboxnormal.png";
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditAccounts.btnSave,true,accountsAvail);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditAccounts.btnNext,false,accountsAvail);
    this.enableOrDisableVerticalTabEditUser(accountsAvail);
    this.view.forceLayout();
  },
  /*
  * on click of checkbox in edit user accounts screen
  */
  onClickAccountsEditUserAccess : function(segmentPath, isHeader,eventObj,context){
    this.onCheckAccountsCheckbox(this.view.enrollEditAccountsCard.segAccountFeatures,false,eventObj,context);
    this.updateAccountSelectionEditUser(eventObj);
  },
  /*
  * check/uncheck checkbox in accounts tab header
  * @param: segment widget path, is header(true/false)
  */
  onCheckAccountsCheckbox : function(segmentPath, isHeader,eventObj,context) {
    var selSecInd = context.sectionIndex;
    var segData = segmentPath.data;
    var segSecData = segData[selSecInd][0];
    var rowsData = segData[selSecInd][1];
    var selectedRowsCount = 0;
    //on section checkbox click
    if(isHeader){
      var img = (segSecData.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?
          this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
      segSecData.imgSectionCheckbox.src = img;
      var count =0;
      for(var i=0; i<rowsData.length; i++){
        rowsData[i].imgCheckbox.src =img;
        if(img === this.AdminConsoleCommonUtils.checkboxSelected)
          count =count +1;
      }
      //get selcted accounts count in bulk update
      if(this.view.flxBulkUpdateFeaturesPopup.isVisible === true){
        segSecData.lblCountActions = count+"";
      }else if(this.view.flxEditUserContainer.isVisible === true){ //in edit user accounts
        this.view.enrollEditAccountsCard.lblCount.text = this.getTwoDigitNumber(count);
      }
      segmentPath.setSectionAt([segSecData,rowsData],selSecInd);
    } 
    //on row checkbox click
    else{ 
      var selInd = segmentPath.selectedRowIndex[1];
      rowsData[selInd].imgCheckbox.src = (rowsData[selInd].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ? this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
      segSecData.imgSectionCheckbox.src = this.getHeaderCheckboxImage(rowsData,true,true);
      selectedRowsCount = this.getSelectedActionsCount(rowsData);
      //get selcted count in bulk update popup
      if(this.view.flxBulkUpdateFeaturesPopup.isVisible === true){  
        segSecData.lblCountActions = selectedRowsCount;
      } else if(this.view.flxEditUserContainer.isVisible === true){ //in edit user accounts
        this.view.enrollEditAccountsCard.lblCount.text = this.getTwoDigitNumber(selectedRowsCount);
      }
      segmentPath.setSectionAt([segSecData,rowsData],selSecInd);
    } 
    //enable/disable save buttons
    var isValid = this.validateCheckboxSelections(segmentPath,true);
    if(this.view.flxBulkUpdateFeaturesPopup.isVisible === true){ //in bulk update popup
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnSave,true,isValid);
    } else if(segmentPath.id === "segRelatedContractsList"){ //for select related contracts seg
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsRelatedDetails.btnSave,true,isValid);
    } else{ // for edit accounts
      if(this.enrollAction === this.actionConfig.editUser)
        this.enableDisableDropdownUIEditUser(this.view.customersDropdownAccounts, isValid);
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditAccounts.btnSave,true,isValid);
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditAccounts.btnNext,false,isValid);
      this.enableOrDisableVerticalTabEditUser(isValid);
    }   
  },
  /*
  * check if all the rows of segment are selected or not
  * @param: data,rowData or section data, is partial selection behaviour
  * @return: :image to be set (checked/unchecked/partial)
  */
  getHeaderCheckboxImage : function(data,isRowData,hasPartialSelection){
    var img = this.AdminConsoleCommonUtils.checkboxnormal;
    var currImg = (isRowData === true) ? "imgCheckbox" :"imgSectionCheckbox";
    var selCount = 0, partialCount = 0;
    for(var i=0; i<data.length; i++){
      var list = (isRowData === true) ? data[i] : data[i][0];
        if(list[currImg].src === this.AdminConsoleCommonUtils.checkboxSelected || list[currImg].src === this.AdminConsoleCommonUtils.checkboxPartial){
          selCount  = selCount +1;
          partialCount = (list[currImg].src === this.AdminConsoleCommonUtils.checkboxPartial) ? partialCount +1 : partialCount;
        }
      }
    if(hasPartialSelection){
      if(selCount !== 0 && selCount === data.length)
        img = partialCount === 0 ? this.AdminConsoleCommonUtils.checkboxSelected: this.AdminConsoleCommonUtils.checkboxPartial;
      else if(selCount !== 0 && selCount < data.length)
        img = this.AdminConsoleCommonUtils.checkboxPartial;
    } else{
      if(selCount === data.length)
        img = this.AdminConsoleCommonUtils.checkboxSelected;
    }
    return img;    
  },
  /*
  * get count of selected items
  * @param: data,isRow
  * @return: count of selected items
  */
  getSelectedItemsCount : function(data,isRow){
    var selCount = 0;
    var srcImg = (isRow === true) ? "imgCheckbox" :"imgSectionCheckbox";
    for(var i=0; i<data.length; i++){
      var list = (isRow === true) ? data[i] : data[i][0];
      if(list[srcImg].src === this.AdminConsoleCommonUtils.checkboxSelected || list[srcImg].src === this.AdminConsoleCommonUtils.checkboxPartial){
        selCount  = selCount +1;
      }
    }
    if(selCount > 9 || selCount === 0)
      return selCount;
    else
      return "0"+selCount;
  },
  /*
  * update the selected accounts in edit user obj
  */
  updateAccountSelectionEditUser : function(eventObj){
    var custId = this.view.customersDropdownAccounts.lblSelectedValue.info.customerId;
   // var selCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var accSegData = this.view.enrollEditAccountsCard.segAccountFeatures.data[0][1];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currUserAccMap = editUserObj.accounts;
    var count =0;
    for(var i=0; i< accSegData.length; i++){
      var accObj = currUserAccMap.get(accSegData[i].id);
      if(accSegData[i].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxSelected){
        accObj.isEnabled = "true";
        accObj.isAssociated = "true";
        count =count+1;
      }else{
        accObj.isEnabled = "false";
        accObj.isAssociated = "false";
      }
      currUserAccMap.set(accSegData[i].id,accObj);
    }
    this.selAccCount[custId] = count;
    editUserObj.accounts = currUserAccMap;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * show filter for account types in account tab of edit user access
  *@param: option-(account type:1, ownership:2), event object, context object
  */
  showFilterForAccountsSectionClick : function(option,event,context){
    if(option === 1)
      this.view.flxOwnershipFilter.setVisibility(false);
    else if(option === 2)
      this.view.flxAccountsFilter.setVisibility(false);
    var filterWidget = (option === 1) ? this.view.flxAccountsFilter :this.view.flxOwnershipFilter;
    var filterIcon = (option === 1) ? "lblIconFilterAccType":"lblIconSortAccHolder" ;
    
    var flxRight = context.widgetInfo.frame.width - event.frame.x - event.frame.width;
    var iconRight = event.frame.width - event[filterIcon].frame.x;
    filterWidget.right = (flxRight + iconRight - 22) + "dp";
    filterWidget.top =(this.view.enrollEditAccountsCard.flxCardBottomContainer.frame.y + 40) +"dp";
    if(filterWidget.isVisible){
      filterWidget.setVisibility(false);
    } else{
      filterWidget.setVisibility(true);
    }
  },
  /*
  * search for accounts based on name,id in edit user access screen
  */
  searchFilterForAccounts : function(){
    var searchText = this.view.searchEditAccounts.tbxSearchBox.text;
    var accountsData = this.view.enrollEditAccountsCard.segAccountFeatures.info.segData;
    var sectionData = accountsData.length > 0 ? accountsData[0][0] :[];
    var rowsData = this.filterAccountsOnTypeOwnership();
    var filteredData = [], dataToSet;
    if(searchText.length >= 0){
      for(var i=0;i<rowsData.length;i++){
        if(rowsData[i].lblAccountName.text.toLowerCase().indexOf(searchText) >= 0 ||
           (rowsData[i].lblAccountNumber.text.indexOf(searchText) >= 0)){
          filteredData.push(rowsData[i]);
        }
      }
      sectionData.imgSectionCheckbox.src = this.getHeaderCheckboxImage(filteredData,true,true);
      if(filteredData.length > 0){
        dataToSet = [[sectionData,filteredData]];
        this.view.enrollEditAccountsCard.lblCount.text = this.getSelectedItemsCount(filteredData, true);
        this.view.enrollEditAccountsCard.lblTotalCount.text ="of "+ this.getTwoDigitNumber(filteredData.length);
        this.view.enrollEditAccountsCard.flxNoFilterResults.setVisibility(false);
      }else{
        dataToSet = searchText.length === 0 ? [[sectionData,[]]]: [];
        this.view.enrollEditAccountsCard.lblCount.text = "0";
        this.view.enrollEditAccountsCard.lblTotalCount.text = "of 0";
        this.view.enrollEditAccountsCard.flxNoFilterResults.setVisibility(true);
      }
        
      this.view.enrollEditAccountsCard.segAccountFeatures.rowTemplate = "flxContractEnrollAccountsEditRow";
      this.view.enrollEditAccountsCard.segAccountFeatures.setData(dataToSet);
    } else{
      this.view.enrollEditAccountsCard.segAccountFeatures.setData(accountsData);
    }
    this.view.flxEditUserContainer.forceLayout();
  },
  /*
  * show/hide the segment/no results based on results
  * @param: component path, visibility
  */
  showHideSegResultsCardContainers : function(componentPath, showSeg){
    componentPath.flxNoFilterResults.setVisibility(!showSeg);
    componentPath.segAccountFeatures.setVisibility(showSeg);
  },
  /*
  * show features by customer level on toggle
  */
  toggleFeaturesCustomerLevel : function(){
    this.view.toggleButtonsFeatures.info.selectedTab = 1;
    this.view.searchEditFeatures.tbxSearchBox.placeholder = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SearchByFeatureActionName");
    this.view.enrollEditFeaturesCard.lblHeading.text =  kony.i18n.getLocalizedString("i18n.frmEnrollCustomersController.SelectedFeatures")+":";
    this.toggleButtonsUtilFunction([this.view.toggleButtonsFeatures.btnToggleLeft,this.view.toggleButtonsFeatures.btnToggleRight],1);
    this.view.btnBulkUpdateFeatures.setVisibility(false);
    this.view.flxEnrollEditFeaturesList.setVisibility(true);
    this.view.flxEnrollEditAccFeaturesList.setVisibility(false);
    this.view.flxEnrollEditFeatureFilter.setVisibility(false);
    this.view.forceLayout();
    this.view.flxEnrollEditFeaturesList.height = this.view.flxEnrollEditFeatureButtons.frame.y === 0 ? "220dp" :(this.view.flxEnrollEditFeatureButtons.frame.y - 170)+"dp" ;
    this.view.flxEnrollEditFeaturesList.setContentOffset({x:0,y:0});
    this.createFeatureCardForCustomers();
  },
  /*
  * show features by account level on toggle
  */
  toggleFeaturesAccountLevel : function(){
    this.view.toggleButtonsFeatures.info.selectedTab = 2;
    this.view.searchEditFeatures.tbxSearchBox.placeholder = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SearchByAccountNumber");
    this.toggleButtonsUtilFunction([this.view.toggleButtonsFeatures.btnToggleLeft,this.view.toggleButtonsFeatures.btnToggleRight],2);
    this.view.btnBulkUpdateFeatures.setVisibility(true);
    this.view.flxEnrollEditFeaturesList.setVisibility(false);
    this.view.flxEnrollEditAccFeaturesList.setVisibility(true);
    this.view.flxEnrollEditFeatureFilter.setVisibility(true);
    this.view.flxEnrollEditAccFeaturesList.setVisibility(true);
    this.view.flxEnrollEditNoResultAccFeatures.setVisibility(false);
    this.createFeatureCardForAccounts();
    this.view.forceLayout();
    this.view.flxEnrollEditAccFeaturesList.height = this.view.flxEnrollEditFeatureButtons.frame.y === 0 ? "220dp" :(this.view.flxEnrollEditFeatureButtons.frame.y - 170)+"dp" ;
    this.view.flxEnrollEditAccFeaturesList.setContentOffset({x:0,y:0});
    this.setFilterDataInFeaturesLimitsTab(1);
  },
  /*
  * show limits by customer level on toggle
  */
  toggleLimitsCustomerLevel : function(){
    this.view.toggleButtonsLimits.info.selectedTab = 1;
    this.toggleButtonsUtilFunction([this.view.toggleButtonsLimits.btnToggleLeft,this.view.toggleButtonsLimits.btnToggleRight],1);
    this.view.btnBulkUpdateLimits.setVisibility(false);
    this.view.flxEnrollEditLimitsList.setVisibility(true);
    this.view.flxEnrollEditAccLimitsList.setVisibility(false);
    this.view.flxEnrollEditLimitsFilter.setVisibility(false);
    this.view.flxEnrollEditLimitsSearchFilterCont.setVisibility(false);
    this.view.forceLayout();
    this.view.flxEnrollEditLimitsList.height = this.view.flxEnrollEditLimitsButtons.frame.y === 0 ? "220dp" : (this.view.flxEnrollEditLimitsButtons.frame.y - 170)+"dp" ;
    this.view.flxEnrollEditLimitsList.setContentOffset({x:0,y:0});
    this.view.enrollEditLimitsCard.lblHeading.text =  kony.i18n.getLocalizedString("i18n.frmServiceManagement.Limits");
    this.createLimitCardForCustomers();
  },
  /*
  * show limits by account level on toggle
  */
  toggleLimitsAccountLevel : function(){
    this.view.toggleButtonsLimits.info.selectedTab = 2;
    this.view.searchEditLimits.tbxSearchBox.placeholder = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SearchByAccountNumber");
    this.toggleButtonsUtilFunction([this.view.toggleButtonsLimits.btnToggleLeft,this.view.toggleButtonsLimits.btnToggleRight],2);
    this.view.btnBulkUpdateLimits.setVisibility(true);
    this.view.flxEnrollEditLimitsList.setVisibility(false);
    this.view.flxEnrollEditAccLimitsList.setVisibility(true);
    this.view.flxEnrollEditLimitsFilter.setVisibility(true);
    this.view.flxEnrollEditLimitsSearchFilterCont.setVisibility(true);
    this.view.flxEnrollEditNoResultAccLimits.setVisibility(false);
    this.view.forceLayout();
    this.view.flxEnrollEditAccLimitsList.height = this.view.flxEnrollEditLimitsButtons.frame.y === 0 ? "220dp" :(this.view.flxEnrollEditLimitsButtons.frame.y - 170)+"dp" ;
    this.view.flxEnrollEditAccLimitsList.setContentOffset({x:0,y:0});
    this.createLimitsCardForAccounts();
    this.setFilterDataInFeaturesLimitsTab(2);
  },
  /*
  * create features card at customer level
  */
  createFeatureCardForCustomers : function(){
    this.view.enrollEditFeaturesCard.toggleCollapseArrow(true);
    this.view.enrollEditFeaturesCard.flxArrow.setVisibility(false);
    this.view.enrollEditFeaturesCard.flxSelectAllOption.setVisibility(true);
    this.view.enrollEditFeaturesCard.lblName.skin = "sknLbl117EB0LatoReg14px";
    this.view.enrollEditFeaturesCard.lblName.hoverSkin = "sknLbl117EB0LatoReg14pxHov";
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    if(editUserObj.accLevelFeatures.length > 0){
      this.storeActionForAccountSelection();
      this.view.enrollEditFeaturesCard.lblTotalCount.text = "of "+ this.getTwoDigitNumber(editUserObj.accLevelFeatures.length);
      this.view.enrollEditFeaturesCard.segAccountFeatures.info = {"parentId":"enrollEditFeaturesCard","segData":[],"featuresType":1,"segDataJSON":{}};
      this.setFeaturesCardSegmentData(this.view.enrollEditFeaturesCard.segAccountFeatures, editUserObj.accLevelFeatures);
      this.view.enrollEditFeaturesCard.flxCheckbox.onClick = this.onSelectAllFeaturesClick.bind(this,this.view.enrollEditFeaturesCard);
      this.view.enrollEditFeaturesCard.imgSectionCheckbox.src = this.getHeaderCheckboxImage(this.view.enrollEditFeaturesCard.segAccountFeatures.data,false, true);
      this.view.enrollEditFeaturesCard.flxNoFilterResults.setVisibility(false);
      this.view.enrollEditFeaturesCard.segAccountFeatures.setVisibility(true);
      this.view.enrollEditFeaturesCard.flxSelectAllOption.setVisibility(true);
      this.view.flxEnrollEditFeaturesSearchFilterCont.setVisibility(true);
    } else{
      this.view.enrollEditFeaturesCard.lblTotalCount.text = "of 0";
      this.view.enrollEditFeaturesCard.flxNoFilterResults.setVisibility(true);
      this.view.enrollEditFeaturesCard.segAccountFeatures.setVisibility(false);
      this.view.enrollEditFeaturesCard.flxSelectAllOption.setVisibility(false);
      this.view.flxEnrollEditFeaturesSearchFilterCont.setVisibility(false);
      this.view.enrollEditFeaturesCard.lblNoFilterResults.skin = "sknLbl485C75LatoRegular13Px";
      this.view.enrollEditFeaturesCard.lblNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoFeaturesAvailable");
    }
  },
  /*
  * create features card at account level
  */
  createFeatureCardForAccounts : function(){
    var self =this;
    var i=0, accCardCount =0;
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    //var selCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accLevelFeaturesMap = editUserObj.accountMapFeatures;
    this.view.flxEnrollEditAccFeaturesList.removeAll();
    var compWidth = this.view.flxEnrollEditFeaturesContainer.frame.width === 0 ? "95%" : (this.view.flxEnrollEditFeaturesContainer.frame.width -40);
    accLevelFeaturesMap.forEach(function(valueObj,key){
      //show only accounts that have been selected
      if(valueObj.accountDetails.isEnabled === "true" || valueObj.accountDetails.isAssociated === "true"){
        var num = i>10 ? i : "0"+i;
        var featureCardToAdd = new com.adminConsole.contracts.accountsFeaturesCard({
          "id": "featureCard" +num,
          "isVisible": true,
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "left":"20dp",
          "width":compWidth+"dp",
          "top": "15dp"
        }, {}, {});
        i=i+1;
        featureCardToAdd.flxArrow.onClick = self.toggleCardListVisibility.bind(self,featureCardToAdd,self.view.flxEnrollEditAccFeaturesList);
        featureCardToAdd.flxSelectAllOption.isVisible = true;
        featureCardToAdd.flxCheckbox.onClick = self.onSelectAllFeaturesClick.bind(self,featureCardToAdd);
        featureCardToAdd.segAccountFeatures.info = {"parentId":featureCardToAdd.id,"segData":[],"featuresType":2, "segDataJSON":{}};
        if(JSON.parse(valueObj.features).length > 0){
          accCardCount = accCardCount +1;
          self.view.flxEnrollEditAccFeaturesList.add(featureCardToAdd);
          self.setAccountFeatureCardData(featureCardToAdd, valueObj);
        }      
      }
    });
    //in case no features available
    if(accCardCount === 0){
      this.view.flxEnrollEditAccFeaturesList.setVisibility(false);
      this.view.flxEnrollEditNoResultAccFeatures.setVisibility(true);
      this.view.lblEnrollFeaturesNoFilterResults.skin = "sknLbl485C75LatoRegular13Px";
      this.view.lblEnrollFeaturesNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoAccountFeaturesAvailable");
      this.view.flxEnrollEditFeaturesSearchFilterCont.setVisibility(false);
      this.view.btnBulkUpdateFeatures.setVisibility(false);
    } else{
      this.view.flxEnrollEditAccFeaturesList.setVisibility(true);
      this.view.flxEnrollEditNoResultAccFeatures.setVisibility(false);
      this.view.flxEnrollEditFeaturesSearchFilterCont.setVisibility(true);
      this.view.btnBulkUpdateFeatures.setVisibility(true);
    }
  },
  /*
  * set UI changes and data to the each card component
  */
  setAccountFeatureCardData : function(featureCardToAdd, accLevelFeaturesMap){
    featureCardToAdd.info = {"accDetails":accLevelFeaturesMap.accountDetails};
    featureCardToAdd.lblName.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNUMBERColon") + " "+
      accLevelFeaturesMap.accountDetails.accountNumber;
    featureCardToAdd.lblHeading1.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTTYPE");
    featureCardToAdd.lblHeading2.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNAME");
    featureCardToAdd.lblHeading3.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.OWNERSHIP_TYPE");
    featureCardToAdd.lblData1.text = accLevelFeaturesMap.accountDetails.accountType;
    featureCardToAdd.lblData2.text = accLevelFeaturesMap.accountDetails.accountName;
    featureCardToAdd.lblData3.text = accLevelFeaturesMap.accountDetails.ownerType;
    featureCardToAdd.lblHeading.text =  kony.i18n.getLocalizedString("i18n.frmEnrollCustomersController.SelectedFeatures")+":";
    featureCardToAdd.lblTotalCount.setVisibility(true);
    var count = JSON.parse(accLevelFeaturesMap.features).length;
    featureCardToAdd.lblTotalCount.text =  "of "+ this.getTwoDigitNumber(count);
    featureCardToAdd.toggleCollapseArrow(false);
    featureCardToAdd.lblName.skin = "sknLbl192B45LatoRegular14px";
    featureCardToAdd.lblName.hoverSkin = "sknLbl192B45LatoRegular14px";
    featureCardToAdd.flxArrow.isVisible = true;
    this.setFeaturesCardSegmentData(featureCardToAdd.segAccountFeatures, JSON.parse(accLevelFeaturesMap.features));
    featureCardToAdd.imgSectionCheckbox.src = this.getHeaderCheckboxImage(featureCardToAdd.segAccountFeatures.data,false, true);   
  },
  /*
  * create other features card 
  */
  createOtherFeaturesCard : function(){
    this.view.enrollEditOtherFeaturesCard.toggleCollapseArrow(true);
    this.view.enrollEditOtherFeaturesCard.flxArrow.setVisibility(false);
    this.view.enrollEditOtherFeaturesCard.flxSelectAllOption.setVisibility(true);
    this.view.enrollEditOtherFeaturesCard.flxCardBottomContainer.setVisibility(true);
    this.view.enrollEditOtherFeaturesCard.segAccountFeatures.info = {"parentId":"enrollEditOtherFeaturesCard","segData":[], "featuresType":3, "segDataJSON":{}};
    var custId = this.view.customersDropdownOF.lblSelectedValue.info.customerId;
    //var selCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var enrollCustOtherFeatures = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    this.view.enrollEditOtherFeaturesCard.lblTotalCount.text = "of " + this.getTwoDigitNumber(enrollCustOtherFeatures.nonAccLevelFeatures.length);
    this.setFeaturesCardSegmentData(this.view.enrollEditOtherFeaturesCard.segAccountFeatures, enrollCustOtherFeatures.nonAccLevelFeatures);
    this.view.enrollEditOtherFeaturesCard.flxCheckbox.onClick = this.onSelectAllFeaturesClick.bind(this,this.view.enrollEditOtherFeaturesCard);
    this.view.enrollEditOtherFeaturesCard.imgSectionCheckbox.src = this.getHeaderCheckboxImage(this.view.enrollEditOtherFeaturesCard.segAccountFeatures.data,false, true);
  },
  /*
  * widget map function for edit user features segment
  * @returns: widget data map for features segment
  */
  getWidgetDataMapForFeatures : function(){
    var widgetMap = {
      "id":"id",
      "dependentActions":"dependentActions",
      "isRowVisible":"isRowVisible",
      "flxFeatureNameCont":"flxFeatureNameCont",
      "imgCheckbox":"imgCheckbox",
      "flxCheckbox":"flxCheckbox",
      "lblStatus":"lblStatus",
      "flxStatus":"flxStatus",
      "lblIconStatus":"lblIconStatus",
      "lblCustom":"lblCustom",
      "flxContractEnrollFeaturesEditRow":"flxContractEnrollFeaturesEditRow",
      "lblTopSeperator":"lblTopSeperator",
      "imgSectionCheckbox":"imgSectionCheckbox",
      "flxToggleArrow":"flxToggleArrow",
      "lblIconToggleArrow":"lblIconToggleArrow",
      "lblFeatureName":"lblFeatureName",
      "lblStatusValue":"lblStatusValue",
      "lblIconStatusTop":"lblIconStatusTop",
      "lblBottomSeperator":"lblBottomSeperator",
      "lblAvailableActions":"lblAvailableActions",
      "lblCountActions":"lblCountActions",
      "lblTotalActions":"lblTotalActions",
      "flxContractEnrollFeaturesEditSection":"flxContractEnrollFeaturesEditSection"
    };
    return widgetMap;
  },
   /*
  * set features and actions segment data in feature card
  * @param: segment widget path
  */
  setFeaturesCardSegmentData : function(segmentPath,featuresArr){
    var self =this;
    var segFeaturesData = [];
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var featuresSegData = featuresArr.map(function(rec){
      var segRowData = [], selActionCount = 0, dependentActions =[];
      var actions = rec.actions || rec.permissions;
      for(var i=0;i < actions.length; i++){
        //as we are getting string format /object format in different case
        if(actions[i].dependentActions && actions[i].dependentActions.length > 0 && typeof actions[i].dependentActions==="string")
          dependentActions=(actions[i].dependentActions.substring(1,actions[i].dependentActions.length-1)).split(",");
        else if(actions[i].dependentActions && actions[i].dependentActions.length > 0)
          dependentActions=actions[i].dependentActions.map(function(depAction){return depAction.id;});
        var rowJson = {
          "id":actions[i].actionId,
          "isRowVisible": false,
          "flxContractEnrollFeaturesEditRow":{"isVisible":false},
          "flxFeatureNameCont":{"isVisible":true},
          "imgCheckbox":{"src": actions[i].isEnabled === "true" ? self.AdminConsoleCommonUtils.checkboxSelected :self.AdminConsoleCommonUtils.checkboxnormal},
          "flxCheckbox":{"onClick":self.onClickFeaturesRowCheckbox.bind(self,segmentPath)},
          "lblFeatureName":{"text":actions[i].actionName},
          "lblStatus":{"text":actions[i].actionStatus === self.AdminConsoleCommonUtils.constantConfig.ACTION_ACTIVE ?"Active" : "Inactive"},
          "lblIconStatus":{"skin":actions[i].actionStatus === self.AdminConsoleCommonUtils.constantConfig.ACTION_ACTIVE ?
                           "sknFontIconActivate" :"sknfontIconInactive"},
          "lblCustom":{"isVisible":false},
          "dependentActions": dependentActions,
          "template":"flxContractEnrollFeaturesEditRow",
        };
        //changes specific for customer level actions
        if(segmentPath.info.featuresType === 1){
          //to set partial selection for action incase of customer level features
          var accCount =  self.actionsAccountJSON[custId][actions[i].actionId] ? self.actionsAccountJSON[custId][actions[i].actionId].length : 0;
          rowJson.imgCheckbox.src = (accCount === 0)? self.AdminConsoleCommonUtils.checkboxnormal : 
          (accCount < self.selAccCount[custId] ? self.AdminConsoleCommonUtils.checkboxPartial : self.AdminConsoleCommonUtils.checkboxSelected);
          if(rowJson.imgCheckbox.src === self.AdminConsoleCommonUtils.checkboxSelected || rowJson.imgCheckbox.src === self.AdminConsoleCommonUtils.checkboxPartial)
            selActionCount = selActionCount +1;
          //show/hide the custom label
          rowJson.lblCustom.isVisible = (rowJson.imgCheckbox.src === self.AdminConsoleCommonUtils.checkboxPartial)?true : false;
        } else{
          if(actions[i].isEnabled === "true") selActionCount = selActionCount +1;
        }
        
        segRowData.push(rowJson);
      }
      var segSecData = {
        "id":rec.featureId,
        "lblTopSeperator":{"isVisible":false},
        "flxCheckbox":{"onClick": self.onSectionCheckboxClick.bind(self,segmentPath)},
        "imgSectionCheckbox":{"src": self.getHeaderCheckboxImage(segRowData,true,true)},
        "lblIconToggleArrow":{"text":"\ue922","skin":"sknfontIconDescRightArrow14px"},
        "flxToggleArrow":{"onClick": self.toggleSegmentSectionArrow.bind(self,segmentPath)},
        "lblFeatureName": rec.featureName || rec.name ,
        "lblStatusValue":{"text":(rec.featureStatus || rec.status) === self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ?
                          "Active" : "Inactive"},
        "lblIconStatusTop":{"text":"\ue921",
                            "skin":(rec.featureStatus || rec.status) === self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ?
                            "sknFontIconActivate" : "sknfontIconInactive"},
        "lblBottomSeperator":{"isVisible":true,"text":"-"},
        "lblAvailableActions":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectedActionsColon"),
        "lblCountActions": {"text":selActionCount},
        "lblTotalActions":"of "+ actions.length,
        "lblCustom":{"isVisible":false },
        "template":"flxContractEnrollFeaturesEditSection"
      };
      //changes specific to customer level features
      if(segmentPath.info.featuresType === 1){
         segSecData.lblCustom.isVisible = self.checkFeatureCustomLabel(segRowData);
      }
     
      if(segRowData.length > 0){
        segmentPath.info.segDataJSON[rec.featureName] = [segSecData, segRowData];
        segFeaturesData.push([segSecData, segRowData]);
      }
      return [segSecData, segRowData];
    });
    segmentPath.widgetDataMap = this.getWidgetDataMapForFeatures();
    if(segFeaturesData.length > 0){
      segFeaturesData[segFeaturesData.length-1][0].lblBottomSeperator.isVisible = false;
    }
    segmentPath.rowTemplate = "flxContractEnrollFeaturesEditRow";
    segmentPath.setData(segFeaturesData);
    var cardWidgetId = segmentPath.info.parentId;
    this.view[cardWidgetId].lblCount.text = this.getSelectedItemsCount(segmentPath.data, false);
    this.view.forceLayout();
    
  },
  /*
  * get the selected actions count
  * @param: actions segment list
  */
  getSelectedActionsCount : function(actionsList){
    var actionCount = 0;
    for(var i=0;i < actionsList.length; i++){
      if(actionsList[i].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxSelected)
        actionCount = actionCount +1;
    }
    return (actionCount+"");
  },
  /*
  * show/hide custom label for feature 
  * @param: actions segment list
  * @return: true/false
  */
  checkFeatureCustomLabel : function(rowsData){
    for(var i=0; i<rowsData.length; i++){
      if(rowsData[i].lblCustom.isVisible === true){
        return true;
      }
    }
    return false;
  },
 /*
  * create limits card at customer level
  */
  createLimitCardForCustomers : function(){
    this.view.enrollEditLimitsCard.flxCardBottomContainer.setVisibility(true);
    this.view.enrollEditLimitsCard.flxArrow.setVisibility(false);
    this.view.enrollEditLimitsCard.toggleCollapseArrow(true);
    this.view.enrollEditLimitsCard.lblName.skin = "sknLbl117EB0LatoReg14px";
    this.view.enrollEditLimitsCard.lblName.hoverSkin = "sknLbl117EB0LatoReg14pxHov";
    this.createLimitsRowsForCustLevel();
  },
  /*
  * create limit rows dynamically and add in component
  */
  createLimitsRowsForCustLevel : function(){
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var updateLimitGroupMaxValues = this.caluclateTransactionLimitGroupValue(editUserObj.accountMapFeatures,editUserObj.accLevelLimits,false,editUserObj.limitGroups);
    editUserObj.limitGroups = updateLimitGroupMaxValues;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
    var limitGroups = updateLimitGroupMaxValues;
    this.view.enrollEditLimitsCard.btnReset.onClick = this.showResetLimitsEditUserPopup.bind(this,1);
    this.view.enrollEditLimitsCard.segAccountFeatures.setVisibility(false);
    this.view.enrollEditLimitsCard.reportPagination.setVisibility(false);
    this.view.enrollEditLimitsCard.flxDynamicWidgetsContainer.setVisibility(true);
    this.view.enrollEditLimitsCard.flxDynamicWidgetsContainer.removeAll();
    if(limitGroups.length > 0){
      for(var i=0; i<limitGroups.length; i++){
        //ignore third type of limit group
        if(limitGroups[i].limitGroupId !== "ACCOUNT_TO_ACCOUNT"){
          var num = i>10 ? i : "0"+i;
          var limitRowToAdd = this.view.flxEnrollEditLimitsTemplate.clone(num);
          limitRowToAdd.isVisible = true;  
          this.view.enrollEditLimitsCard.flxDynamicWidgetsContainer.add(limitRowToAdd);
          this.setDataToCustLimitTextBox(limitGroups[i], num);

          this.view.enrollEditLimitsCard[num+"lblLimitsHeading"].text = (limitGroups[i].limitGroupId.indexOf("SINGLE_PAYMENT") >= 0) ?
            kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SingleTransactionLimits_UC") :kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.BulkTransactionLimits_UC");
          this.view.enrollEditLimitsCard[num+"tbxLimitValue1"].onTouchStart = this.showHideRange.bind(this,num,"1",true);
          this.view.enrollEditLimitsCard[num+"tbxLimitValue1"].onEndEditing = this.showHideRange.bind(this,num,"1",false);
          this.view.enrollEditLimitsCard[num+"tbxLimitValue2"].onTouchStart = this.showHideRange.bind(this,num,"2",true);
          this.view.enrollEditLimitsCard[num+"tbxLimitValue2"].onEndEditing = this.showHideRange.bind(this,num,"2",false);
          this.view.enrollEditLimitsCard[num+"tbxLimitValue3"].onTouchStart = this.showHideRange.bind(this,num,"3",true);
          this.view.enrollEditLimitsCard[num+"tbxLimitValue3"].onEndEditing = this.showHideRange.bind(this,num,"3",false);

          this.view.enrollEditLimitsCard[num+"tbxLimitValue1"].onTextChange = this.updateCustLimitGroupValueEditUser.bind(this,num,"1");
          this.view.enrollEditLimitsCard[num+"tbxLimitValue2"].onTextChange = this.updateCustLimitGroupValueEditUser.bind(this,num,"2");
          this.view.enrollEditLimitsCard[num+"tbxLimitValue3"].onTextChange = this.updateCustLimitGroupValueEditUser.bind(this,num,"3");

        }
      }
      this.view.flxEnrollEditLimitsList.setVisibility(true);
      this.view.flxEnrollEditNoResultAccLimits.setVisibility(false);
    } else{
      this.view.lblEnrollLimitsNoFilterResults.skin = "sknLbl485C75LatoRegular13Px";
      this.view.lblEnrollLimitsNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoLimitsAvailable");
      this.view.flxEnrollEditLimitsList.setVisibility(false);
      this.view.flxEnrollEditNoResultAccLimits.setVisibility(true);
    }
    this.view.forceLayout();
  },
  /*
  *set data to limit group row at customer level limits in edit user 
  *limit group data, id
  */
  setDataToCustLimitTextBox : function(limitsGroup, num){
    for(var i=0; i<limitsGroup.limits.length; i++){
      if(limitsGroup.limits[i].id === this.limitId.MAX_TRANSACTION_LIMIT){
        this.view.enrollEditLimitsCard[num+"tbxLimitValue1"].text = limitsGroup.limits[i].value;
        this.view.enrollEditLimitsCard[num+"tbxLimitValue1"].info = {"maxValue":limitsGroup.limits[i].maxValue,
                                                                     "id":limitsGroup.limitGroupId,
                                                                     "type": limitsGroup.limits[i].id};
        this.view.enrollEditLimitsCard[num+"lblRangeValue1"].text = " 0 - " +limitsGroup.limits[i].maxValue;
      } 
      else if(limitsGroup.limits[i].id === this.limitId.DAILY_LIMIT){
        this.view.enrollEditLimitsCard[num+"tbxLimitValue2"].text = limitsGroup.limits[i].value;
        this.view.enrollEditLimitsCard[num+"tbxLimitValue2"].info = {"maxValue":limitsGroup.limits[i].maxValue,
                                                                     "id":limitsGroup.limitGroupId,
                                                                     "type": limitsGroup.limits[i].id};
        this.view.enrollEditLimitsCard[num+"lblRangeValue2"].text = " 0 - " +limitsGroup.limits[i].maxValue;
      } 
      else if(limitsGroup.limits[i].id === this.limitId.WEEKLY_LIMIT){
        this.view.enrollEditLimitsCard[num+"tbxLimitValue3"].text = limitsGroup.limits[i].value;
        this.view.enrollEditLimitsCard[num+"tbxLimitValue3"].info = {"maxValue":limitsGroup.limits[i].maxValue,
                                                                     "id":limitsGroup.limitGroupId,
                                                                     "type": limitsGroup.limits[i].id};
        this.view.enrollEditLimitsCard[num+"lblRangeValue3"].text = " 0 - " +limitsGroup.limits[i].maxValue;
      }
    }
  },
  /*
  * create limits card at account level
  */
  createLimitsCardForAccounts : function(){
    var self =this;
    this.view.flxEnrollEditAccLimitsList.removeAll();
    var i=0, accCardCount = 0;
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accLevelLimitsMap = editUserObj.accLevelLimits;
    var compWidth = this.view.flxEnrollEditLimitsContainer.frame.width === 0 ? "95%" : (this.view.flxEnrollEditLimitsContainer.frame.width -40);
    accLevelLimitsMap.forEach(function(accountObj,accKey) {
      //show only accounts that have been selected
      if(accountObj.accountDetails.isEnabled === "true" || accountObj.accountDetails.isAssociated === "true"){
        var num = i>10 ? i : "0"+i;
        var limitCardToAdd = new com.adminConsole.contracts.accountsFeaturesCard({
          "id": "limitCard" +num,
          "isVisible": true,
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "top": "10px",
          "left":"20dp",
          "width": compWidth
        }, {}, {});
        i=i+1;
        limitCardToAdd.flxCardBottomContainer.isVisible = false;
        limitCardToAdd.toggleCollapseArrow(false);
        limitCardToAdd.btnReset.setVisibility(false);
        limitCardToAdd.flxArrow.onClick = self.toggleCardListVisibility.bind(self,limitCardToAdd,self.view.flxEnrollEditAccLimitsList);
        limitCardToAdd.btnReset.onClick = self.showResetLimitsEditUserPopup.bind(self, 2, limitCardToAdd);
        limitCardToAdd.segAccountFeatures.info = {"parentId":limitCardToAdd.id,"segData":[]};
        if(JSON.parse(accountObj.limits).length > 0){
          accCardCount = accCardCount +1;
          self.view.flxEnrollEditAccLimitsList.add(limitCardToAdd);
          self.setAccountLimitCardData(limitCardToAdd,accountObj);
        }       
      }
    });
    //in case no limits available
    if(accCardCount === 0){
      this.view.lblEnrollLimitsNoFilterResults.skin = "sknLbl485C75LatoRegular13Px";
      this.view.lblEnrollLimitsNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoAccountLimitsAvailable");
      this.view.flxEnrollEditAccLimitsList.setVisibility(false);
      this.view.flxEnrollEditNoResultAccLimits.setVisibility(true);
      this.view.btnBulkUpdateLimits.setVisibility(false);
      this.view.flxEnrollEditLimitsSearchFilterCont.setVisibility(false);
    } else {
      this.view.flxEnrollEditAccLimitsList.setVisibility(true);
      this.view.flxEnrollEditNoResultAccLimits.setVisibility(false);
      this.view.btnBulkUpdateLimits.setVisibility(true);
      this.view.flxEnrollEditLimitsSearchFilterCont.setVisibility(true);
    }
    this.view.forceLayout();
  },
  /*
  * set UI changes and data to the each card component
  * @param: limit card component path, acclevel limit object
  */
  setAccountLimitCardData : function(limitCardToAdd, accLevelLimitsMap){
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    limitCardToAdd.info = {"accDetails":accLevelLimitsMap.accountDetails};
    limitCardToAdd.lblName.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNUMBERColon") + " "+
      accLevelLimitsMap.accountDetails.accountNumber;
    limitCardToAdd.lblHeading1.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTTYPE");
    limitCardToAdd.lblHeading2.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNAME");
    limitCardToAdd.lblHeading3.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.OWNERSHIP_TYPE");
    limitCardToAdd.lblData1.text = accLevelLimitsMap.accountDetails.accountType;
    limitCardToAdd.lblData2.text = accLevelLimitsMap.accountDetails.accountName;
    limitCardToAdd.lblData3.text = accLevelLimitsMap.accountDetails.ownerType;
    limitCardToAdd.lblHeading.text =  kony.i18n.getLocalizedString("i18n.frmServiceManagement.Limits");
    limitCardToAdd.lblCount.setVisibility(false);
    limitCardToAdd.lblTotalCount.setVisibility(false);
    limitCardToAdd.toggleCollapseArrow(false);
    limitCardToAdd.lblName.skin = "sknLbl192B45LatoRegular14px";
    limitCardToAdd.lblName.hoverSkin = "sknLbl192B45LatoRegular14px";
    limitCardToAdd.flxArrow.isVisible = true;
    this.setLimitsAtAccountLevel(limitCardToAdd.segAccountFeatures, JSON.parse(accLevelLimitsMap.limits), custId);

  },
   /*
  * widget map function for edit user limits segment at account level
  * @returns: widget data map for limits segment
  */
  getWidgetMapForLimitsAccountLevel : function(){
    var widgetMap = {
      "isRowVisible": "isRowVisible",
      "lblTopSeperator":"lblTopSeperator",
      "flxCheckbox":"flxCheckbox",
      "imgSectionCheckbox":"imgSectionCheckbox",
      "flxToggleArrow":"flxToggleArrow",
      "lblIconToggleArrow":"lblIconToggleArrow",
      "lblFeatureName":"lblFeatureName",
      "lblStatusValue":"lblStatusValue",
      "lblIconStatusTop":"lblIconStatusTop",
      "lblBottomSeperator":"lblBottomSeperator",
      "lblAvailableActions":"lblAvailableActions",
      "lblCountActions":"lblCountActions",
      "lblTotalActions":"lblTotalActions",
      "flxContractEnrollFeaturesEditSection":"flxContractEnrollFeaturesEditSection",
      "lblTransactionType":"lblTransactionType",
      "lblTransactionLimits":"lblTransactionLimits",
      "lblPreApprovedLimit":"lblPreApprovedLimit",
      "lblAutoDenyLimits":"lblAutoDenyLimits",
      "lblPerTransactionLimitDollar":"lblPerTransactionLimitDollar",
      "lblDailyTransactionLimitDollar":"lblDailyTransactionLimitDollar",
      "lblWeeklyTransactionLimitDollar":"lblWeeklyTransactionLimitDollar",
      "lblperTransactionLimits":"lblperTransactionLimits",
      "lblDailyTransactionLimits":"lblDailyTransactionLimits",
      "lblWeeklyTransactionLimits":"lblWeeklyTransactionLimits",
      "lblPerTransactionLimitValue": "lblPerTransactionLimitValue",
      "txtPerTransPreApprovedLimit": "txtPerTransPreApprovedLimit",
      "txtPerTransAutoDenyLimits":"txtPerTransAutoDenyLimits",
      "lblDailyTransactionLimitValue":"lblDailyTransactionLimitValue",
      "txtDailyTransPreApprovedLimit":"txtDailyTransPreApprovedLimit",
      "txtDailyTransAutoDenyLimits": "txtDailyTransAutoDenyLimits",
      "lblWeeklyTransactionLimitValue": "lblWeeklyTransactionLimitValue",
      "txtWeeklyTransPreApprovedLimit": "txtWeeklyTransPreApprovedLimit",
      "txtWeeklyTransAutoDenyLimits":"txtWeeklyTransAutoDenyLimits",
      "flxColumn11": "flxColumn11",
      "flxColumn12": "flxColumn12",
      "flxColumn21": "flxColumn21",
      "flxColumn22": "flxColumn22",
      "flxColumn31" : "flxColumn31",
      "flxColumn32" : "flxColumn32",
      "flxErrorRow1":"flxErrorRow1",
      "flxErrorRow2":"flxErrorRow2",
      "flxErrorRow3":"flxErrorRow3",
      "lblErrorMsg11": "lblErrorMsg11",
      "lblErrorMsg12": "lblErrorMsg12",
      "lblErrorMsg21": "lblErrorMsg21",
      "lblErrorMsg22": "lblErrorMsg22",
      "lblErrorMsg31" : "lblErrorMsg31",
      "lblErrorMsg32" : "lblErrorMsg32",
      "lblErrorIcon11":"lblErrorIcon11",
      "lblErrorIcon12":"lblErrorIcon12",
      "lblErrorIcon21":"lblErrorIcon21",
      "lblErrorIcon22":"lblErrorIcon22",
      "lblErrorIcon31":"lblErrorIcon31",
      "lblErrorIcon32":"lblErrorIcon32",
      "lblPerCurrencyPreLimit":"lblPerCurrencyPreLimit",
      "lblPerCurrencyADLimits":"lblPerCurrencyADLimits",
      "lblDailyCurrencyPreLimit":"lblDailyCurrencyPreLimit",
      "lblDailyCurrencyADLimits":"lblDailyCurrencyADLimits",
      "lblWeeklyCurrencyADLimits":"lblWeeklyCurrencyADLimits",
      "lblWeeklyCurrencyPreLimit":"lblWeeklyCurrencyPreLimit",
      "statusValue": "statusValue",
      "statusIcon" :"statusIcon",
      "lblSeperator1":"lblSeperator1",
      "lblSeperator2":"lblSeperator2",
      "lblSeperator":"lblSeperator",
      "lblIconRangeInfo1":"lblIconRangeInfo1",
      "lblIconRangeInfo2":"lblIconRangeInfo2",
      "lblIconRangeInfo3":"lblIconRangeInfo3",
      "flxRangeIcon1":"flxRangeIcon1",
      "flxRangeIcon2":"flxRangeIcon2",
      "flxRangeIcon3":"flxRangeIcon3",
      "flxPerTransactionCont":"flxPerTransactionCont",
      "flxDailyTransactionCont":"flxDailyTransactionCont",
      "flxWeeklyTransactionCont":"flxWeeklyTransactionCont",
      "flxAssignLimits":"flxAssignLimits"
    };
    return widgetMap;
  },
   /*
  * set limits segment data in limits card at account level
  * @param: segment widget path, limits array
  */
  setLimitsAtAccountLevel : function(segmentPath,limitsArr,custId){
    var self =this;
    var limitsDataToSet = [];
    var parentCardId = segmentPath.info.parentId;
    var accountInfo = this.view[parentCardId].info ? this.view[parentCardId].info.accDetails : "";
    var limitsSegData = limitsArr.map(function(rec){
      var segRowData = [];
      for(var i=0;i < rec.actions.length; i++){
        var limitValues = rec.actions[i].limits;     
        var accNum = accountInfo.accountNumber || accountInfo.accountId;
        //check if current action is enabled in features tab
        var currActionAccList = self.actionsAccountJSON[custId][rec.actions[i].actionId];
        if(currActionAccList.indexOf(accNum) >= 0){
          segRowData.push({
            "id":rec.actions[i].actionId,
            "lblFeatureName":rec.actions[i].actionName,
            "isRowVisible": false,
            "flxAssignLimits":{"isVisible":false},
            "lblTransactionType":kony.i18n.getLocalizedString("i18n.frmMFAScenarios.Transaction_Type_Caps"),
            "lblTransactionLimits":"TRANSACTION LIMIT",
            "lblPreApprovedLimit":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.PreApproved_UC"),
            "lblAutoDenyLimits":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AutoDeny_UC"),
            "lblperTransactionLimits":kony.i18n.getLocalizedString("i18n.frmServiceManagement.PerTransactionLimitLC"),
            "lblDailyTransactionLimits":kony.i18n.getLocalizedString("i18n.frmServiceManagement.DailyTransactionLimitLC"),
            "lblWeeklyTransactionLimits":kony.i18n.getLocalizedString("i18n.frmServiceManagement.WeeklyTransLimitLC"),
            "lblPerTransactionLimitValue": {"text":limitValues[self.limitId.MAX_TRANSACTION_LIMIT]},
            "txtPerTransPreApprovedLimit": {"text":limitValues[self.limitId.PRE_APPROVED_TRANSACTION_LIMIT],
                                            "skin":"sknTbxBgFFFFFFBrD7D9E01pxR3px",
                                            "onTextChange":self.updateAccLimitsValueEditUser.bind(self,segmentPath),
                                            "info":{"name": self.limitId.PRE_APPROVED_TRANSACTION_LIMIT, "rowNum":1}
                                           },
            "txtPerTransAutoDenyLimits": {"text":limitValues[self.limitId.AUTO_DENIED_TRANSACTION_LIMIT],
                                          "skin":"sknTbxBgFFFFFFBrD7D9E01pxR3px",
                                          "onTextChange":self.updateAccLimitsValueEditUser.bind(self,segmentPath),
                                          "info":{"name": self.limitId.AUTO_DENIED_TRANSACTION_LIMIT, "rowNum":1}
                                         },
            "lblDailyTransactionLimitValue": {"text":limitValues[self.limitId.DAILY_LIMIT]},
            "txtDailyTransPreApprovedLimit": {"text":limitValues[self.limitId.PRE_APPROVED_DAILY_LIMIT],
                                              "skin":"sknTbxBgFFFFFFBrD7D9E01pxR3px",
                                              "onTextChange":self.updateAccLimitsValueEditUser.bind(self,segmentPath),
                                              "info":{"name": self.limitId.PRE_APPROVED_DAILY_LIMIT, "rowNum":2}
                                             },
            "txtDailyTransAutoDenyLimits": {"text":limitValues[self.limitId.AUTO_DENIED_DAILY_LIMIT],
                                            "skin":"sknTbxBgFFFFFFBrD7D9E01pxR3px",
                                            "onTextChange":self.updateAccLimitsValueEditUser.bind(self,segmentPath),
                                            "info":{"name": self.limitId.AUTO_DENIED_DAILY_LIMIT, "rowNum":2}
                                           },
            "lblWeeklyTransactionLimitValue": {"text":limitValues[self.limitId.WEEKLY_LIMIT]},
            "txtWeeklyTransPreApprovedLimit": {"text":limitValues[self.limitId.PRE_APPROVED_WEEKLY_LIMIT],
                                               "skin":"sknTbxBgFFFFFFBrD7D9E01pxR3px",
                                               "onTextChange":self.updateAccLimitsValueEditUser.bind(self,segmentPath),
                                               "info":{"name": self.limitId.PRE_APPROVED_WEEKLY_LIMIT, "rowNum":3}
                                              },
            "txtWeeklyTransAutoDenyLimits": {"text":limitValues[self.limitId.AUTO_DENIED_WEEKLY_LIMIT],
                                             "skin":"sknTbxBgFFFFFFBrD7D9E01pxR3px",
                                             "onTextChange":self.updateAccLimitsValueEditUser.bind(self,segmentPath),
                                             "info":{"name": self.limitId.AUTO_DENIED_WEEKLY_LIMIT, "rowNum":3}
                                            },
            "lblPerTransactionLimitDollar":{"text":self.currencyValue},
            "lblDailyTransactionLimitDollar":{"text":self.currencyValue},
            "lblWeeklyTransactionLimitDollar":{"text":self.currencyValue},
            "lblPerCurrencyPreLimit": {"text":self.currencyValue},
            "lblPerCurrencyADLimits": {"text":self.currencyValue},
            "lblDailyCurrencyPreLimit": {"text":self.currencyValue},
            "lblDailyCurrencyADLimits": {"text":self.currencyValue},
            "lblWeeklyCurrencyADLimits": {"text":self.currencyValue},
            "lblWeeklyCurrencyPreLimit": {"text":self.currencyValue},
            "lblErrorMsg11": {"text":"Error"},
            "lblErrorMsg12": {"text":"Error"},
            "lblErrorMsg21": {"text":"Error"},
            "lblErrorMsg22": {"text":"Error"},
            "lblErrorMsg31" : {"text":"Error"},
            "lblErrorMsg32" : {"text":"Error"},
            "lblErrorIcon11": {"text":"\ue94c"},
            "lblErrorIcon12":{"text":"\ue94c"},
            "lblErrorIcon21":{"text":"\ue94c"},
            "lblErrorIcon22":{"text":"\ue94c"},
            "lblErrorIcon31":{"text":"\ue94c"},
            "lblErrorIcon32":{"text":"\ue94c"},
            "flxErrorRow1":{"isVisible":true},
            "flxErrorRow2":{"isVisible":true},
            "flxErrorRow3":{"isVisible":true},
            "flxColumn11": {"isVisible": false},
            "flxColumn12": {"isVisible": false},
            "flxColumn21": {"isVisible": false},
            "flxColumn22": {"isVisible": false},
            "flxColumn31" : {"isVisible": false},
            "flxColumn32" : {"isVisible": false},
            "lblSeperator1":"-",
            "lblSeperator2":"-",
            "lblSeperator":"-",
            "flxRangeIcon1":{"isVisible":false,"onHover": self.showRangeTooltip},
            "flxRangeIcon2":{"isVisible":false,"onHover":self.showRangeTooltip},
            "flxRangeIcon3":{"isVisible":false,"onHover":self.showRangeTooltip},
            "lblIconRangeInfo1":{"text":"\ue94d"},
            "lblIconRangeInfo2":{"text":"\ue94d"},
            "lblIconRangeInfo3":{"text":"\ue94d"},
            "template":"flxAssignLimits"});
        }
      }
      var segSecData = {
        "id":rec.featureId,
        "lblTopSeperator": {"isVisible":false},
        "flxCheckbox": {"isVisible":false},
        "flxToggleArrow": {"onClick": self.toggleSegmentSectionArrow.bind(self,segmentPath)},
        "lblIconToggleArrow": {"text":"\ue922","skin":"sknfontIconDescRightArrow14px"},
        "lblFeatureName": rec.featureName,
        "lblStatusValue": {"text": rec.featureStatus === self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ?
                          kony.i18n.getLocalizedString("i18n.permission.Active") : kony.i18n.getLocalizedString("i18n.frmPermissionsController.InActive")},
        "lblIconStatusTop": {"text":"\ue921",
                            "skin":rec.featureStatus === self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ? "sknFontIconActivate" : "sknfontIconInactive"},
        "lblBottomSeperator": {"isVisible":true,"text":"-"},
        "lblAvailableActions": kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.MonetaryActions")+":",
        "lblCountActions": {"text":rec.actions.length},
        "lblTotalActions":{"isVisible":false},
        "template":"flxContractEnrollFeaturesEditSection"
      };
      //add feature if atleast one action is present
      if(segRowData.length > 0){
        limitsDataToSet.push([segSecData, segRowData]);
      }
      return limitsDataToSet;
    });
    segmentPath.widgetDataMap = this.getWidgetMapForLimitsAccountLevel();
    if(limitsDataToSet.length > 0){
      limitsDataToSet[limitsDataToSet.length-1][0].lblBottomSeperator.isVisible = false;
      segmentPath.setData(limitsDataToSet);
      this.view[parentCardId].segAccountFeatures.setVisibility(true);
      this.view[parentCardId].flxNoFilterResults.setVisibility(false);
    }else{
      segmentPath.setData([]);
      this.view[parentCardId].segAccountFeatures.setVisibility(false);
      this.view[parentCardId].flxNoFilterResults.setVisibility(true);
      this.view[parentCardId].lblNoFilterResults.skin = "sknLbl485C75LatoRegular13Px";
      this.view[parentCardId].lblNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomerController.NoLimitsForAccountMsg");
    }
    this.view.forceLayout();
  },
  /*
  * create liit values json from array
  * @param: limit values array
  * @return: limit values json
  */
  getLimitValuesJsonFromArray : function(limitValueArr){
    var limitsJson = {};
    if (limitValueArr && limitValueArr.length > 0) {
      limitsJson = limitValueArr.reduce(function (mapJson, rec) {
        mapJson[rec.id] = rec.value;
        return mapJson;
      }, {});
    }
    return limitsJson;
  },
  /*
  * create limit groups values json from array
  * @param: limitGroups values array
  * @return: limitGroups values json
  */
  getLimitGroupsValuesJsonFromArray : function(limitValueArr){
    var self =this;
    var limitsJson = {};
    if (limitValueArr && limitValueArr.length > 0) {
      limitsJson = limitValueArr.reduce(function (mapJson, rec) {
        var limitGroup = {
          'limitGroupName': "",
          'limitGroupId': rec.limitGroupId,
          "limits": [],
          "actualLimits":[]
        };
        var existingLimitId = [];
        //add max value param for caluclating max limits
        for(var i=0; i<rec.limits.length; i++){
          existingLimitId.push(rec.limits[i].id);
          limitGroup.limits.push({"id": rec.limits[i].id,"value": rec.limits[i].value, "maxValue":rec.limits[i].maxValue});
          limitGroup.actualLimits.push({"id": rec.limits[i].id,"value": rec.limits[i].value});
        }
        if(rec.limits.length < 3){
          if(!existingLimitId.includes(self.limitId.MAX_TRANSACTION_LIMIT)){
            limitGroup.limits.push({"id": self.limitId.MAX_TRANSACTION_LIMIT,"value": "0", "maxValue":"0"});
            limitGroup.actualLimits.push({"id": self.limitId.MAX_TRANSACTION_LIMIT,"value": "0"});
          }else if(!existingLimitId.includes(self.limitId.DAILY_LIMIT)){
            limitGroup.limits.push({"id": self.limitId.DAILY_LIMIT,"value": "0", "maxValue":"0"});
            limitGroup.actualLimits.push({"id": self.limitId.DAILY_LIMIT,"value": "0"});
          }else if(!existingLimitId.includes(self.limitId.WEEKLY_LIMIT)){
            limitGroup.limits.push({"id": self.limitId.WEEKLY_LIMIT,"value": "0", "maxValue": "0"});
            limitGroup.actualLimits.push({"id": self.limitId.WEEKLY_LIMIT,"value": "0"});
          }
        }
        mapJson[rec.limitGroupId] = limitGroup;
        return mapJson;
      }, {});
    }
    return limitsJson;
  },
  /*
  * expand/collapse selected card listing container visibility for featureLimitCard componrent
  * @param: feature/limit card widget path, path of all cards container flex
  */
  toggleCardListVisibility : function(cardWidget,parentFlexCont){
    var listArr = parentFlexCont.widgets();
    for(var i=0; i<listArr.length; i++){
      if(listArr[i].id === cardWidget.id){
        var visibilityCheck = cardWidget.flxCardBottomContainer.isVisible;
        cardWidget.toggleCollapseArrow(!visibilityCheck);
        //collapses segment section inside the card
        var segData = cardWidget.segAccountFeatures.data;
        for(var j=0;j< segData.length;j++){
          segData[j][0].lblTopSeperator.isVisible = false;
          if(segData[j][0].lblIconToggleArrow.skin !== "sknfontIconDescRightArrow14px"){
            segData[j][0].lblIconToggleArrow.text = "\ue922";
            segData[j][0].lblIconToggleArrow.skin = "sknfontIconDescRightArrow14px";
            segData[j][1] = this.showHideSegRowFlex(segData[j][1],false);
            if(j === segData.length-1){
              segData[j][0].lblBottomSeperator.isVisible = false;
            }
          }
        }
        if(this.view.flxEnrollEditLimitsContainer.isVisible === true){
          var btnVisibile = (!visibilityCheck) && cardWidget.segAccountFeatures.data.length > 0;
          this.view[listArr[i].id].btnReset.setVisibility(btnVisibile);
        }else{
          cardWidget.btnReset.setVisibility(false);
        }
        cardWidget.segAccountFeatures.setData(segData);
      }
      else{
        this.view[listArr[i].id].toggleCollapseArrow(false);
        this.view[listArr[i].id].btnReset.setVisibility(false);
      }
    }
    this.view.forceLayout();
  },
  /*
  * expand/collapse the rows under a section for feature/limits segments
  * @param: segment widget path, event
  */
  toggleSegmentSectionArrow : function(segmentWidgetPath,event){
    var segData = segmentWidgetPath.data;
    var selectedSecInd = event.rowContext.sectionIndex;
    //update remaining sections to collapse
    for(var i=0;i< segData.length;i++){
      segData[i][0].lblTopSeperator.isVisible = false;
      segData[i][0].lblBottomSeperator.isVisible = true;
      if(selectedSecInd !== i){
        segData[i][0].lblIconToggleArrow.text = "\ue922";
        segData[i][0].lblIconToggleArrow.skin = "sknfontIconDescRightArrow14px";
        segData[i][1] = this.showHideSegRowFlex(segData[i][1],false);
      }
      //hide bottom seperator for last row
      if(i === segData.length-1){
        segData[i][0].lblBottomSeperator.isVisible = false;
      }
    }
    //update selected section
    if(segData[selectedSecInd][1][0].isRowVisible === false){
      segData[selectedSecInd][0].lblIconToggleArrow.text = "\ue915";
      segData[selectedSecInd][0].lblIconToggleArrow.skin = "sknfontIconDescDownArrow12px";
      segData[selectedSecInd][1] = this.showHideSegRowFlex(segData[selectedSecInd][1],true);
      if(selectedSecInd < (segData.length-1)){
        segData[selectedSecInd+1][0].lblTopSeperator.isVisible = true;
      }
      segData[selectedSecInd][0].lblBottomSeperator.isVisible = (this.view.flxEnrollEditLimitsContainer.isVisible === true) ? false : true;
    } else{
      segData[selectedSecInd][0].lblIconToggleArrow.text = "\ue922";
      segData[selectedSecInd][0].lblIconToggleArrow.skin = "sknfontIconDescRightArrow14px";
      segData[selectedSecInd][1] = this.showHideSegRowFlex(segData[selectedSecInd][1],false);
      if(selectedSecInd < (segData.length-1)){
        segData[selectedSecInd+1][0].lblTopSeperator.isVisible = false;
      }
      if(selectedSecInd ===(segData.length-1) ){
        segData[selectedSecInd][0].lblBottomSeperator.isVisible = false;
      }
    }
    segmentWidgetPath.setData(segData);
  },
  /*
  * set segment rows visibility
  * @params: rows array, visibility - true/false
  * @return: updated rows data with visibilty
  */
  showHideSegRowFlex : function(rowsData,visibility){
    for(var i=0;i<rowsData.length;i++){
      if(rowsData[i].flxContractEnrollFeaturesEditRow){  // edit features
        rowsData[i].isRowVisible =visibility;
        rowsData[i].flxContractEnrollFeaturesEditRow.isVisible = visibility;
      }else if(rowsData[i].flxAssignLimits){ //edit limits
        rowsData[i].isRowVisible =visibility;
        rowsData[i].flxAssignLimits.isVisible =visibility;
      } else{ //accounts in bulk update
        rowsData[i].isRowVisible =visibility;
        rowsData[i].flxContractEnrollAccountsEditRow.isVisible = visibility;
      }
      
    }
    return rowsData;
  },
  /*
  * on click of checbox in section of segment
  * @param: segment widget path, event
  */
  onSectionCheckboxClick : function(segmentWidPath,event){
    var selSecInd = event.rowContext.sectionIndex;
    var segData = segmentWidPath.data;
    var img = (segData[selSecInd][0].imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?
        this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
    segData[selSecInd][0].imgSectionCheckbox.src = img;
    for(var i =0;i<segData[selSecInd][1].length; i++){
      segData[selSecInd][1][i].imgCheckbox.src = img;
      segData[selSecInd][1][i].lblCustom.isVisible = false;
    }
    segData[selSecInd][0].lblCountActions.text = this.getSelectedActionsCount(segData[selSecInd][1]);
    segData[selSecInd][0].lblCustom.isVisible = false;
    segmentWidPath.setSectionAt(segData[selSecInd],selSecInd);
    //set image for select all features image, selected count
    if(segmentWidPath.info && segmentWidPath.info.parentId){
      this.view[segmentWidPath.info.parentId].imgSectionCheckbox.src = this.getHeaderCheckboxImage(segData,false, true);
      this.view[segmentWidPath.info.parentId].lblCount.text = this.getSelectedItemsCount(segData, false);
    }
    
    //update the selected features based on features type
    if(segmentWidPath.info.featuresType === 1){ //customer level features
      this.updateCustFeaturesSelectionEditUser(segmentWidPath, event);
    } else if(segmentWidPath.info.featuresType === 2){ //account level features
      this.updateAccFeaturesSelectionEditUser(segmentWidPath, event);
    } else if(segmentWidPath.info.featuresType === 3){ //other features
      this.updateOtherFeaturesSelectionEditUser(segmentWidPath, event);
    }
    
    //enable/disable save buttons
   // var isValid = this.validateCheckboxSelections(segmentWidPath,true);
   /* var isValid = this.validateSelectionForMultipleCards(segmentWidPath);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnNext,false,isValid);
    this.enableOrDisableVerticalTabEditUser(isValid);*/
  },
  /*
  * uncheck/check features row checkbox
  * @param: segment widget path, event
  */
  onClickFeaturesRowCheckbox: function(segmentWidPath,event){
    var selSecInd = event.rowContext.sectionIndex;
    var selRowInd = event.rowContext.rowIndex;
    var segData = segmentWidPath.data;
    var imgToSet = (segData[selSecInd][1][selRowInd].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?
      this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
    segData[selSecInd][1][selRowInd].imgCheckbox.src = imgToSet;
    //update the selection for dependent actions if any
    if(segData[selSecInd][1][selRowInd].dependentActions.length > 0){
      for(var i=0; i<segData[selSecInd][1].length;i++){
        if(segData[selSecInd][1][selRowInd].dependentActions.indexOf(segData[selSecInd][1][i].id) >= 0){
          segData[selSecInd][1][i].imgCheckbox.src = imgToSet;
        }
      }
    }
    //hide custom label in customer level actions
    segData[selSecInd][1][selRowInd].lblCustom.isVisible = false;
    
    segData[selSecInd][0].imgSectionCheckbox.src = this.getHeaderCheckboxImage(segData[selSecInd][1],true, true);
    segData[selSecInd][0].lblCountActions.text = this.getSelectedActionsCount(segData[selSecInd][1]);
    segData[selSecInd][0].lblCustom.isVisible = this.checkFeatureCustomLabel(segData[selSecInd][1]);
    segmentWidPath.setSectionAt(segData[selSecInd],selSecInd);
    //set image for select all features image, selected count
    if(segmentWidPath.info && segmentWidPath.info.parentId){
      this.view[segmentWidPath.info.parentId].imgSectionCheckbox.src = this.getHeaderCheckboxImage(segData,false, true);
      this.view[segmentWidPath.info.parentId].lblCount.text = this.getSelectedItemsCount(segData, false);
    }
    
    //update the selected features based on features type
    if(segmentWidPath.info.featuresType === 1){ //customer level features
      this.updateCustFeaturesSelectionEditUser(segmentWidPath, event);
    } else if(segmentWidPath.info.featuresType === 2){ //account level features
      this.updateAccFeaturesSelectionEditUser(segmentWidPath, event);
    } else if(segmentWidPath.info.featuresType === 3){ //other features
      this.updateOtherFeaturesSelectionEditUser(segmentWidPath, event);
    }
    //enable/disable save buttons
   /* var isValid = this.validateSelectionForMultipleCards(segmentWidPath);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnNext,false,isValid);
    this.enableOrDisableVerticalTabEditUser(isValid);*/
  },
  /*
  * select all features under a customer/account card
  * @param: selected card widget path
  */
  onSelectAllFeaturesClick : function(cardWidgetPath){
    var segData = cardWidgetPath.segAccountFeatures.data;
    var img = (cardWidgetPath.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?
        this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
    cardWidgetPath.imgSectionCheckbox.src = img;
    cardWidgetPath.lblCount.text = (img === this.AdminConsoleCommonUtils.checkboxnormal ? "0": this.getTwoDigitNumber(segData.length));
    for(var i=0;i<segData.length; i++){
      segData[i][0].imgSectionCheckbox.src = img;
      for(var j=0;j<segData[i][1].length; j++){
        segData[i][1][j].imgCheckbox.src = img;
      }
    }
    cardWidgetPath.segAccountFeatures.setData(segData);
    //update all features based on features type
    if(cardWidgetPath.segAccountFeatures.info.featuresType === 1){ //customer level features
      this.updateCustAllFeaturesSelectionEdit(cardWidgetPath.segAccountFeatures);
    } else if(cardWidgetPath.segAccountFeatures.info.featuresType === 2){ //account level features
      this.updateAccAllFeaturesSelectionEdit(cardWidgetPath.segAccountFeatures);
    } else if(cardWidgetPath.segAccountFeatures.info.featuresType === 3){ //other features
      this.updateOtherAllFeaturesSelectionEdit(cardWidgetPath.segAccountFeatures);
    }
    //enable/disable save buttons
    /*var isValid = this.validateSelectionForMultipleCards(cardWidgetPath.segAccountFeatures);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsEditFeatures.btnNext,false,isValid);
    this.enableOrDisableVerticalTabEditUser(isValid);*/
  },
  /*
  * store the selected account's acc numbers for each action
  */
  storeActionForAccountSelection : function(){
    var self =this;
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    //var enrollUserData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var editUserDetails = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accLevelfeatures = editUserDetails.accountMapFeatures;
    
    accLevelfeatures.forEach(function(account,accKey){
      if(account.accountDetails.isEnabled === "true" || account.accountDetails.isAssociated === "true"){
        var accFeatures = JSON.parse(account.features);
        for(var j=0; j< accFeatures.length; j++){
          var actions = accFeatures[j].actions || accFeatures[j].permissions;
          for(var i=0; i<actions.length; i++){
            //push enabled actions for that account
            if(actions[i].isEnabled === "true"){
              self.addAccountIdForAction(actions[i].actionId,(accKey+""));
            } else if(actions[i].isEnabled === "false"){
              self.removeAccountIdForAction(actions[i].actionId,(accKey+""),1);
            }
          }
        }
      }  //remove acc num from all accounts when account is removed 
      else if(account.accountDetails.isEnabled === "false" || account.accountDetails.isAssociated === "false"){
        self.removeAccountIdForAction(null,(accKey+""),2);
      } 
    });
  },
  /*
  * remove the accounts for particular action from actionsAccountJSON
  * @param: action id, account id to remove,option(1/2)
  */
  removeAccountIdForAction : function(actionId,accountId,option){
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var filterAcc;
    if(option ===1){ //remove the account number for given action id
      var associatedAccounts = this.actionsAccountJSON[custId][actionId];
      filterAcc = associatedAccounts.filter(function(accId) { return accId !== accountId; });
      this.actionsAccountJSON[custId][actionId] = filterAcc;
    } else if(option ===2){ //remove the account number for all actions available
      var actionsArr = Object.keys(this.actionsAccountJSON[custId]);
      var accountsArr = Object.values(this.actionsAccountJSON[custId]);
      for(var i=0; i<accountsArr.length; i++){
        filterAcc = accountsArr[i].filter(function(accId) { return accId !== accountId; });
        this.actionsAccountJSON[custId][actionsArr[i]] = filterAcc;
      }
    }
  },
  /*
  * add the account for particular action from actionsAccountJSON
  * @param: action id, account id to add
  */
  addAccountIdForAction : function(actionId,accountId){
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var associatedAccounts = this.actionsAccountJSON[custId][actionId];
    if(associatedAccounts && associatedAccounts.indexOf(accountId) < 0){
      associatedAccounts.push(accountId);
    }
  },
  /*
  * filter particular feature from array of features
  */
  getFeatureObjFromArray : function(featureId, featuresArr){
    var featureObj = featuresArr.filter(function(feature) { return feature.featureId === featureId; });
    return (featureObj.length > 0 ? featureObj[0] : null);
  },
  /*
  * update the selection values for customer level features on checkbox clicks
  * @param: segment widget path, eventobj
  */
  updateCustFeaturesSelectionEditUser : function(segmentWidPath, event){
    var self = this;
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var featureData = segmentWidPath.data[event.rowContext.sectionIndex][0];
    var actionsSegData = segmentWidPath.data[event.rowContext.sectionIndex][1];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currUserFeaturesMap = new Map(editUserObj.accountMapFeatures);
    var count = 0;
    currUserFeaturesMap.forEach(function(accountObj,accKey){ 
      var features = JSON.parse(accountObj.features);
      var selFeature = self.getFeatureObjFromArray(featureData.id, features);
      var selFeatureActions = selFeature.actions || selFeature.permissions;
      for(var i=0; i< selFeatureActions.length; i++){
        for(var j=0; j<actionsSegData.length; j++){
          //compare with segment action ,action from list and update data
          if(selFeatureActions[i].actionId === actionsSegData[j].id){
            if(actionsSegData[i].imgCheckbox.src === self.AdminConsoleCommonUtils.checkboxSelected){
              selFeatureActions[i].isEnabled = "true";
              count = count+1;
              self.addAccountIdForAction(selFeatureActions[i].actionId, (accKey+""));
            }else{
              selFeatureActions[i].isEnabled = "false";
              self.removeAccountIdForAction(selFeatureActions[i].actionId, (accKey+""),1);
            }
            break;
          }
        }
      }
      selFeature.isEnabled = count === 0 ? "false" : "true";
      accountObj.features = JSON.stringify(features);
      currUserFeaturesMap.set(accKey,accountObj);
    });
    editUserObj.accountMapFeatures = currUserFeaturesMap;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * update the selection values for account level features on checkbox clicks
  * @param: segment widget path, eventobj
  */
  updateAccFeaturesSelectionEditUser : function(segmentWidPath, event){
    var self = this;
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var featureData = segmentWidPath.data[event.rowContext.sectionIndex][0];
    var actionsSegData = segmentWidPath.data[event.rowContext.sectionIndex][1];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);

    var count = 0;
    var accountCardComponent = this.view[segmentWidPath.info.parentId];
    var currAccountNum = accountCardComponent.info ? accountCardComponent.info.accDetails.accountNumber : "";
    var currAccountObj = editUserObj.accountMapFeatures.get(currAccountNum); 
    var features = JSON.parse(currAccountObj.features);
    var selFeature = self.getFeatureObjFromArray(featureData.id, features);
    var selFeatureActions = selFeature.actions || selFeature.permissions;
    for(var i=0; i< selFeatureActions.length; i++){
      for(var j=0; j<actionsSegData.length; j++){
        //compare with segment action ,action from list and update data
        if(selFeatureActions[i].actionId === actionsSegData[j].id){
          if(actionsSegData[i].imgCheckbox.src === self.AdminConsoleCommonUtils.checkboxSelected){
            selFeatureActions[i].isEnabled = "true";
            count = count+1;
            self.addAccountIdForAction(selFeatureActions[i].actionId, (currAccountNum+""));
          }else{
            selFeatureActions[i].isEnabled = "false";
            self.removeAccountIdForAction(selFeatureActions[i].actionId, (currAccountNum+""),1);
          }
          break;
        }
      }
    }
    selFeature.isEnabled = count === 0 ? "false" : "true";
    currAccountObj.features = JSON.stringify(features);
    editUserObj.accountMapFeatures.set(currAccountNum, currAccountObj);
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * update the selection values for other features on checkbox clicks
  * @param: segment widget path, eventobj
  */
  updateOtherFeaturesSelectionEditUser : function(segmentWidPath, event){
    var self = this;
    var custId = this.view.customersDropdownOF.lblSelectedValue.info.customerId;
    var featureData = segmentWidPath.data[event.rowContext.sectionIndex][0];
    var actionsSegData = segmentWidPath.data[event.rowContext.sectionIndex][1];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currUserOtherFeatures = editUserObj.nonAccLevelFeatures;
    var count = 0;
    var selFeature = self.getFeatureObjFromArray(featureData.id, currUserOtherFeatures);
    var selFeatureActions = selFeature.actions || selFeature.permissions;
    for(var i=0; i<selFeatureActions.length; i++){
      for(var j=0; j<actionsSegData.length; j++){
        //compare with segment action ,action from list and update data
        if(selFeatureActions[i].actionId === actionsSegData[j].id){
          if(actionsSegData[i].imgCheckbox.src === self.AdminConsoleCommonUtils.checkboxSelected){
            selFeatureActions[i].isEnabled = "true";
            count = count+1;
          }else{
            selFeatureActions[i].isEnabled = "false";
          }
          break;
        }
      }
    }
    selFeature.isEnabled = count === 0 ? "false" : "true";
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * update all feature/actions on click of select all option at customer level
  */
  updateCustAllFeaturesSelectionEdit : function(){
    var self =this;
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var featureCardComponent = this.view.enrollEditFeaturesCard;
    var currUserFeaturesMap = new Map(editUserObj.accountMapFeatures);
    currUserFeaturesMap.forEach(function(accountObj,accKey){ 
      var features = JSON.parse(accountObj.features);
      for(var i=0; i<features.length; i++){
        features[i].isEnabled = featureCardComponent.imgSectionCheckbox.src === self.AdminConsoleCommonUtils.checkboxnormal ? false:true;
        var currActions = features[i].actions || features[i].permissions;
        for(var j=0;j<currActions.length; j++){
          if(featureCardComponent.imgSectionCheckbox.src === self.AdminConsoleCommonUtils.checkboxnormal){
            currActions[j].isEnabled = "false";
            self.removeAccountIdForAction(currActions[j].actionId, (accKey+""), 1);
          } else{
            currActions[j].isEnabled = "true";
            self.addAccountIdForAction(currActions[j].actionId, (accKey+""));
          }

        }
      }
      accountObj.features = JSON.stringify(features);
      currUserFeaturesMap.set(accKey,accountObj);
    });
    editUserObj.accountMapFeatures = currUserFeaturesMap;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * update all feature/actions on click of select all option at account level
  * @param: segment widget path
  */
  updateAccAllFeaturesSelectionEdit : function(segmentWidPath){
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accountCardComponent = this.view[segmentWidPath.info.parentId];
    var currAccountNum = accountCardComponent.info ? accountCardComponent.info.accDetails.accountNumber : "";
    var currAccountObj = editUserObj.accountMapFeatures.get(currAccountNum); 
    var features = JSON.parse(currAccountObj.features);
    for(var i=0; i<features.length; i++){
      features[i].isEnabled = accountCardComponent.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal ? false:true;
      var currActions = features[i].actions || features[i].permissions;
      for(var j=0;j<currActions.length; j++){
        if( accountCardComponent.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal){
          currActions[j].isEnabled = "false";
          this.removeAccountIdForAction(currActions[j].actionId, currAccountNum, 1);
        } else{
          currActions[j].isEnabled = "true";
          this.addAccountIdForAction(currActions[j].actionId, currAccountNum);
        }
        
      }
    }
    currAccountObj.features = JSON.stringify(features);
    editUserObj.accountMapFeatures.set(currAccountNum, currAccountObj);
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * update all feature/actions on click of select all option for other features
  */
  updateOtherAllFeaturesSelectionEdit : function(){
    var custId = this.view.customersDropdownOF.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var featureCardComponent = this.view.enrollEditOtherFeaturesCard;
    var features = editUserObj.nonAccLevelFeatures;
    for(var i=0; i<features.length; i++){
      features[i].isEnabled = featureCardComponent.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal ? false:true;
       var currActions = features[i].actions || features[i].permissions;
      for(var j=0;j<currActions.length; j++){
        currActions[j].isEnabled = featureCardComponent.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal ? false:true;
      }
    }
    editUserObj.nonAccLevelFeatures = features;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * update the accouont level limits values when changes in textbox
  * @param: segment widget path, event object
  */
  updateAccLimitsValueEditUser : function(segmentWidPath,eventObj){
    var self = this;
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var selectedCardId = segmentWidPath.info ? segmentWidPath.info.parentId : "";
    var selAccDetails = selectedCardId !== "" ? this.view[selectedCardId].info.accDetails : "";
    var featureData = segmentWidPath.data[eventObj.rowContext.sectionIndex][0];
    var actionsSegData = segmentWidPath.data[eventObj.rowContext.sectionIndex][1];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currUserLimitsMap = new Map(editUserObj.accLevelLimits);
    var currLimitTextbox = eventObj.info ? eventObj.info.name : "";
    
    for(let accountObj of currUserLimitsMap.values()){ 
      var currAccId = (accountObj.accountDetails.accountNumber || accountObj.accountDetails.accountId) || "";
      var selAccId = selAccDetails !== "" ? (selAccDetails.accountNumber || selAccDetails.accountId) : "";
      if(currAccId === selAccId){
        var limits = JSON.parse(accountObj.limits);
        var selFeature = self.getFeatureObjFromArray(featureData.id, limits);
        for(var i=0; i< selFeature.actions.length; i++){
          for(var j=0; j<actionsSegData.length; j++){
            //compare with segment action ,action from list and update limit value
            if(selFeature.actions[i].actionId === actionsSegData[j].id){
              if(selFeature.actions[i].limits && currLimitTextbox){
                selFeature.actions[i].limits[currLimitTextbox] = eventObj.text;
              }
              break;
            }
          }
        }
        accountObj.limits = JSON.stringify(limits);
        currUserLimitsMap.set(currAccId,accountObj);
        break;
      }
    }
    editUserObj.accLevelLimits = currUserLimitsMap;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);

  },
  /*
  * update the limit group edit values in edit user obj
  * @param: flx prefix id, row id
  */
  updateCustLimitGroupValueEditUser : function(flxId, rowId, eventObj){
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var limitGroup = editUserObj.limitGroups;
    for(var i=0;i<limitGroup.length;i++){
      if(limitGroup[i].limitGroupId === eventObj.info.id){
        for(var j=0; j<limitGroup[i].limits.length; j++){
          if(limitGroup[i].limits[j].id === eventObj.info.type)
            limitGroup[i].limits[j].value = parseFloat(eventObj.text);
        }
      }
    }
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  /*
  * validate limit group values for all the customers
  */
  validateLimitGroupEditUser : function(custId){
    var errorCustId =[];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var limitGroups = editUserObj.limitGroups;
    var limitValidationObj = {};
    limitValidationObj[custId] = {};
    for(var i=0;i <limitGroups.length; i++){
      if(limitGroups[i].limitGroupId !== "ACCOUNT_TO_ACCOUNT"){
        var errorJson = this.validateLimitGroupValuesEditUserObj(limitGroups[i]);
        limitValidationObj[custId][limitGroups[i].limitGroupId] = errorJson.error;
        //save the cust id with error
        if(errorJson.isValid === false && errorCustId.indexOf(custId) < 0){
          errorCustId.push(custId);
        }
      }
    }
    this.limitGroupsValidationObject = limitValidationObj;
    var allLimitsValid = errorCustId.length > 0 ? false : true;

    return allLimitsValid;
  },
  /*
  * validate values for each limit group and create error obj
  * @param: limit group
  * @return :error obj
  */
  validateLimitGroupValuesEditUserObj : function(limitGroup){
    var errorObj={}, isValid = true;
    var limits = limitGroup.limits;
    for(var i=0;i<limits.length;i++){
      if(parseFloat(limits[i].value) > parseFloat(limits[i].maxValue)){
        errorObj[limits[i].id]= {"error": kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ValueCannotBeGreaterThanMaxValue"),
                                  "id":limits[i].id};
        isValid = false;
      }else if(limits[i].value === ""){
        errorObj[limits[i].id] = {"error": kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Value_cannot_be_empty"),
                                  "id":limits[i].id};
        isValid = false;
      }else if(parseFloat(limits[i].value < 0)){
        errorObj[limits[i].id] = {"error": kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ValueCannotBeNegative"),
                                  "id":limits[i].id};
        isValid = false;
      }
    }
    return {"error":errorObj, "isValid":isValid};
  },
  /*
  * set inline errors for validated limit groups
  * @param: customer id
  */
  setErrorLimitGroupEditUser : function(custId){
    var currCustErrorObj = this.limitGroupsValidationObject[custId];
    var childFlex = this.view.enrollEditLimitsCard.flxDynamicWidgetsContainer.widgets();
    
    for(var i=0; i<childFlex.length; i++){
      var id = childFlex[i].id.substr(0,2);
      var limitGroupId = this.view.enrollEditLimitsCard[id+"tbxLimitValue1"].info.id;
      var typeIdArr = Object.keys(currCustErrorObj[limitGroupId]);
      for(var j=0; j<typeIdArr.length; j++){
        if(typeIdArr[j] === this.limitId.MAX_TRANSACTION_LIMIT){
          this.view.enrollEditLimitsCard[id+"flxRangeCont1"].setVisibility(false);
          this.view.enrollEditLimitsCard[id+"flxLimitError1"].setVisibility(true);
          this.view.enrollEditLimitsCard[id+"lblLimitErrorMsg1"].text = currCustErrorObj[limitGroupId][typeIdArr[j]].error;
          this.view.enrollEditLimitsCard[id+"flxLimitValue1"].skin = "sknFlxCalendarError";                                                                                           
        }else if(typeIdArr[j] === this.limitId.DAILY_LIMIT){
          this.view.enrollEditLimitsCard[id+"flxRangeCont2"].setVisibility(false);
          this.view.enrollEditLimitsCard[id+"flxLimitError2"].setVisibility(true);
          this.view.enrollEditLimitsCard[id+"lblLimitErrorMsg2"].text = currCustErrorObj[limitGroupId][typeIdArr[j]].error;
          this.view.enrollEditLimitsCard[id+"flxLimitValue2"].skin = "sknFlxCalendarError";     
        }else if(typeIdArr[j] === this.limitId.WEEKLY_LIMIT){
          this.view.enrollEditLimitsCard[id+"flxRangeCont3"].setVisibility(false);
          this.view.enrollEditLimitsCard[id+"flxLimitError3"].setVisibility(true);
          this.view.enrollEditLimitsCard[id+"lblLimitErrorMsg3"].text = currCustErrorObj[limitGroupId][typeIdArr[j]].error;
          this.view.enrollEditLimitsCard[id+"flxLimitValue3"].skin = "sknFlxCalendarError";     
        }
      }
    }
    this.view.forceLayout();
  },
  /*
  * validate limit and limit groups on click of save/update in edit user
  */
  validateAllLimitsEditUser : function(){
    var custArr =[],isValid = true, updateLimitGroupMaxValues = [], editUserObj;
    kony.adminConsole.utils.showProgressBar(this.view);
    var dropdownSelectedCust = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    //get all the customer id's available and update limit group max values
    if(this.enrollAction === this.actionConfig.editUser){
      var limitsDropdown = this.view.customersDropdownLimits.segList.data;
      for(var i=0;i<limitsDropdown.length; i++){
        editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(limitsDropdown[i].id);
        updateLimitGroupMaxValues = this.caluclateTransactionLimitGroupValue(editUserObj.accountMapFeatures,editUserObj.accLevelLimits,false,editUserObj.limitGroups);
        editUserObj.limitGroups = updateLimitGroupMaxValues;
        this.presenter.setAccountsFeaturesForEnrollCust(limitsDropdown[i].id,editUserObj);
        custArr.push(limitsDropdown[i].id);
      }
    }else{
      editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(dropdownSelectedCust);
      updateLimitGroupMaxValues = this.caluclateTransactionLimitGroupValue(editUserObj.accountMapFeatures,editUserObj.accLevelLimits,false,editUserObj.limitGroups);
      editUserObj.limitGroups = updateLimitGroupMaxValues;
      this.presenter.setAccountsFeaturesForEnrollCust(dropdownSelectedCust,editUserObj);
      custArr.push(dropdownSelectedCust);
    }
    //validate for each customer id
    for(var j=0; j<custArr.length;j++){
      var isLimitGroupValid = this.validateLimitGroupEditUser(custArr[j]);
      var isLimitValid = this.validateAccLimitEditUser(custArr[j]);
      if(isLimitGroupValid === false ){ //customer tab in limits
        if(this.enrollAction === this.actionConfig.editUser){  //update the customer selected in dropdown
          this.setSelectedTextFromDropdownEditUser(this.view.customersDropdownLimits, custArr[j]);
        }
        //show the limits screen and respective tab
        if(this.view.flxEnrollEditAccLimitsList.isVisible === false){
          this.showEditLimitsScreen(1);
        }else{
          this.toggleLimitsCustomerLevel();
        }
        this.setErrorLimitGroupEditUser(custArr[j]);
        isValid = false;
        break;
      } else if(isLimitValid === false){ //accounts tab in limits
        if(this.enrollAction === this.actionConfig.editUser){ //update the customer selected in dropdown
          this.setSelectedTextFromDropdownEditUser(this.view.customersDropdownLimits, custArr[j]);
        }
        //show the limits screen and respective tab
        if(this.view.flxEnrollEditAccLimitsList.isVisible === false){
          this.showEditLimitsScreen(2);
        } else{
          this.toggleLimitsAccountLevel();
        }
        this.setErrorForLimitValuesAfterValidation(custArr[j]);
        isValid = false;
        break;
      }
    }
    kony.adminConsole.utils.hideProgressBar(this.view);
    return isValid;
  },
  /*
  * show error flag message in limits tab edit user
  */
  showErrorFlagInLimitsEditUser : function(showError){
    if(showError === true){
      this.view.flxLimitErrorEditUser.setVisibility(true);
      this.view.flxEnrollEditLimitsTopCont.top = "40dp";
    } else{
      this.view.flxLimitErrorEditUser.setVisibility(false);
      this.view.flxEnrollEditLimitsTopCont.top = "0dp";
    }
    this.view.forceLayout();
  },
  /*
  * validate and store the error for limits values for all the customer accounts
  * @param: selected customerId
  * @return : action limits valid -true/false
  */
  validateAccLimitEditUser : function(custId){
    var self = this;
    var limitsValidation = {},errorCustIdArr =[];
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currUserLimitsMap = editUserObj.accLevelLimits;
    limitsValidation[custId] = {};
    currUserLimitsMap.forEach(function(accountObj, key){
      limitsValidation[custId][key] = {};
      if(accountObj.accountDetails.isEnabled === "true" || accountObj.accountDetails.isAssociated === "true"){
        var featuresLimit = JSON.parse(accountObj.limits);
        for(var i=0;i<featuresLimit.length;i++){
          var currActions = featuresLimit[i].actions || featuresLimit[i].permissions;
          for(var j=0;j<currActions.length; j++){
            var errorObj = self.validateAccLimitValuesEditUserObj(currActions[j].limits);
            limitsValidation[custId][key][currActions[j].actionId] = errorObj.error;
            //save custId is invalid
            if(errorObj.isValid === false && errorCustIdArr.indexOf(custId) < 0){
              errorCustIdArr.push(custId);
            }
          }
        }
      }
    });
    this.limitsValidationObject = limitsValidation;
    var allActionsValid = errorCustIdArr.length > 0 ? false : true;
    return allActionsValid;
  },
  /*
  *validate the limit values for the limit object
  * @param: limit object
  */
  validateAccLimitValuesEditUserObj : function(limitObj){
    var errorObj = {}, isValid = true;;
    var negativeErrorText=kony.i18n.getLocalizedString("i8n.frmCreateCustomerController.warning.value_cannot_negative");
    var emptyValueText= kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Value_cannot_be_empty");
    var transLimit = limitObj[this.limitId.MAX_TRANSACTION_LIMIT] || "";
    var transDenyLimit = limitObj[this.limitId.AUTO_DENIED_TRANSACTION_LIMIT] || "";
    var transApprLimit = limitObj[this.limitId.PRE_APPROVED_TRANSACTION_LIMIT] || "";
    var dailyLimit = limitObj[this.limitId.DAILY_LIMIT] || "";
    var dailyDenyLimit = limitObj[this.limitId.AUTO_DENIED_DAILY_LIMIT] || "";
    var dailyApprLimit = limitObj[this.limitId.PRE_APPROVED_DAILY_LIMIT] || "";
    var weeklyLimit = limitObj[this.limitId.WEEKLY_LIMIT] || "";
    var weeklyDenyLimit = limitObj[this.limitId.AUTO_DENIED_WEEKLY_LIMIT] || "";
    var weeklyApprLimit = limitObj[this.limitId.PRE_APPROVED_WEEKLY_LIMIT] || "";
    // cunvert currency format to float
    var max_trans_limit=parseFloat((transLimit).replace(/[^0-9.-]+/g,"")); 
    var max_daily_limit=parseFloat((dailyLimit).replace(/[^0-9.-]+/g,"")); 
    var max_weekly_limit=parseFloat((weeklyLimit).replace(/[^0-9.-]+/g,""));
    
    //per transaction - auto deny
    var perTranAD ={};
    if(transDenyLimit === "" || parseFloat(transDenyLimit)<0){
      perTranAD.error = transDenyLimit ===""? emptyValueText : negativeErrorText;
      isValid=false;
      perTranAD.typeId = this.limitId.AUTO_DENIED_TRANSACTION_LIMIT;
      errorObj[this.limitId.AUTO_DENIED_TRANSACTION_LIMIT] = perTranAD;
    }
    else if(parseFloat(transDenyLimit)> max_trans_limit){
      perTranAD.typeId = this.limitId.AUTO_DENIED_TRANSACTION_LIMIT;
      perTranAD.error = kony.i18n.getLocalizedString("i18n.frmCreateCustomer.error.value_cannot_be_greater_than_trans_limit");
      isValid = false;
      errorObj[this.limitId.AUTO_DENIED_TRANSACTION_LIMIT] = perTranAD;
    }
    else if(parseFloat(transDenyLimit) < parseFloat(transApprLimit)){
      perTranAD.typeId = this.limitId.AUTO_DENIED_TRANSACTION_LIMIT;
      perTranAD.error = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ValuCannotBeLessThanTransactionLimit");
      isValid = false;
      errorObj[this.limitId.AUTO_DENIED_TRANSACTION_LIMIT] = perTranAD;
    }
    
    //per transaction - pre approved
    var perTranPA ={};
    if(transApprLimit === "" || parseFloat(transApprLimit)<0){
      perTranPA.typeId = this.limitId.PRE_APPROVED_TRANSACTION_LIMIT;
      perTranPA.error = transApprLimit ===""? emptyValueText : negativeErrorText;
      isValid=false;
      errorObj[this.limitId.PRE_APPROVED_TRANSACTION_LIMIT] = perTranPA;
    }
    else if(parseFloat(transApprLimit)> max_trans_limit){
      perTranPA.typeId = this.limitId.PRE_APPROVED_TRANSACTION_LIMIT;
      perTranPA.error = kony.i18n.getLocalizedString("i18n.frmCreateCustomer.error.value_cannot_be_greater_than_trans_limit");
      isValid = false;
      errorObj[this.limitId.PRE_APPROVED_TRANSACTION_LIMIT] = perTranPA;
    }
    
     //daily - auto deny
    var dailyAD = {};
    if(dailyDenyLimit ==="" || parseFloat(dailyDenyLimit)<0){
      dailyAD.typeId = this.limitId.AUTO_DENIED_DAILY_LIMIT;
      dailyAD.error = dailyDenyLimit ===""?emptyValueText : negativeErrorText;
      isValid=false;
      errorObj[this.limitId.AUTO_DENIED_DAILY_LIMIT] = dailyAD;
    }else if(parseFloat(dailyDenyLimit)>max_daily_limit){
      dailyAD.typeId = this.limitId.AUTO_DENIED_DAILY_LIMIT;
      dailyAD.error = kony.i18n.getLocalizedString("i18n.frmCreateCustomer.error.value_cannot_be_greater_than_trans_limit");
      isValid=false;
      errorObj[this.limitId.AUTO_DENIED_DAILY_LIMIT] = dailyAD;
    }else if(parseFloat(dailyDenyLimit)<parseFloat(dailyApprLimit)){
      dailyAD.typeId = this.limitId.AUTO_DENIED_DAILY_LIMIT;
      dailyAD.error = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ValuCannotBeLessThanTransactionLimit");
      isValid=false;
      errorObj[this.limitId.AUTO_DENIED_DAILY_LIMIT] = dailyAD;
    }

    //daily - pre approved
    var dailyPA = {};
    if(dailyApprLimit ==="" || parseFloat(dailyApprLimit)<0){
      dailyPA.error = dailyApprLimit ==="" ? emptyValueText : negativeErrorText;
      dailyPA.typeId = this.limitId.PRE_APPROVED_DAILY_LIMIT;
      isValid=false;
      errorObj[this.limitId.PRE_APPROVED_DAILY_LIMIT] = dailyPA;
    }else if(parseFloat(dailyApprLimit) > max_daily_limit){
      dailyPA.typeId = this.limitId.PRE_APPROVED_DAILY_LIMIT;
      dailyPA.error = kony.i18n.getLocalizedString("i18n.frmCreateCustomer.error.value_cannot_be_greater_than_trans_limit");
      isValid=false;
      errorObj[this.limitId.PRE_APPROVED_DAILY_LIMIT] = dailyPA;
    }
    
    //weekly- auto deny
    var weeklyAD = {};
    if(weeklyDenyLimit ==="" || parseFloat(weeklyDenyLimit)<0){
      weeklyAD.typeId = this.limitId.AUTO_DENIED_WEEKLY_LIMIT;
      weeklyAD.error = weeklyDenyLimit==="" ? emptyValueText : negativeErrorText;
      isValid=false;
      errorObj[this.limitId.AUTO_DENIED_WEEKLY_LIMIT] = weeklyAD;
    }else if(parseFloat(weeklyDenyLimit)>max_weekly_limit){
      weeklyAD.typeId = this.limitId.AUTO_DENIED_WEEKLY_LIMIT;
      weeklyAD.error = kony.i18n.getLocalizedString("i18n.frmCreateCustomer.error.value_cannot_be_greater_than_trans_limit");
      isValid=false;
      errorObj[this.limitId.AUTO_DENIED_WEEKLY_LIMIT] = weeklyAD;
    }else if(parseFloat(weeklyDenyLimit)<parseFloat(weeklyApprLimit)){
      weeklyAD.typeId = this.limitId.AUTO_DENIED_WEEKLY_LIMIT;
      weeklyAD.error = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ValuCannotBeLessThanTransactionLimit");
      isValid=false;
      errorObj[this.limitId.AUTO_DENIED_WEEKLY_LIMIT] = weeklyAD;
    }
    
    //weekly- pre approved
    var weeklyPA = {};
    if(weeklyApprLimit ==="" || parseFloat(weeklyApprLimit)<0){
      weeklyPA.typeId = this.limitId.PRE_APPROVED_WEEKLY_LIMIT;
      weeklyPA.error = weeklyApprLimit ==="" ? emptyValueText : negativeErrorText;
      isValid=false;
      errorObj[this.limitId.PRE_APPROVED_WEEKLY_LIMIT] = weeklyPA;
    }else if(parseFloat(weeklyApprLimit)>max_weekly_limit){
      weeklyPA.typeId = this.limitId.PRE_APPROVED_WEEKLY_LIMIT;
      weeklyPA.error = kony.i18n.getLocalizedString("i18n.frmCreateCustomer.error.value_cannot_be_greater_than_trans_limit");
      isValid=false;
      errorObj[this.limitId.PRE_APPROVED_WEEKLY_LIMIT] = weeklyPA;
    }
    
    return {"error":errorObj,"isValid":isValid};
  },
  /*
  * set inline error for segment rows with limit errors
  * @param: customer id
  */
  setErrorForLimitValuesAfterValidation : function(custId){
    var isValid = true;
    var limitErrorForCust = this.limitsValidationObject[custId];
    var accountFlx = this.view.flxEnrollEditAccLimitsList.widgets();
    for(var i=0;i<accountFlx.length;i++){
      var accfeatures = limitErrorForCust[accountFlx[i].info.accDetails.accountNumber];
      var segData = accountFlx[i].segAccountFeatures.data;
      for(var j=0; j<segData.length; j++){
        var errorActionsId = Object.keys(accfeatures);
        for(var a=0; a<segData[j][1].length; a++){
          var updatedRowJson;
          var actionHasError = Object.keys(accfeatures[segData[j][1][a].id]).length > 0 ? true : false;
          if(errorActionsId.indexOf(segData[j][1][a].id) >= 0){
            updatedRowJson = this.updatedRowWithErrorCheck(segData[j][1][a],accfeatures);
            segData[j][1][a] = updatedRowJson;
            isValid = false;
          }
        }
      }
      accountFlx[i].segAccountFeatures.setData(segData);
    }
    this.view.forceLayout();
  },
  /*
  * update the segment row widget to show error for actions
  * @param: row data json, error object
  */
  updatedRowWithErrorCheck : function(rowData, errorObj){
    var currActionError = errorObj[rowData.id];
    var currErrorLimitArr = Object.keys(currActionError);
    rowData = this.clearAccLevelLimitErrorEditUser(rowData);
    if(currErrorLimitArr.indexOf(this.limitId.PRE_APPROVED_TRANSACTION_LIMIT) >= 0){
      rowData.flxColumn11.isVisible =true;
      rowData.txtPerTransPreApprovedLimit.skin ="sknTbxFFFFFFBrE32416R3pxLato13px";
      rowData.lblErrorMsg11.text = currActionError[this.limitId.PRE_APPROVED_TRANSACTION_LIMIT].error;
    }
    if(currErrorLimitArr.indexOf(this.limitId.AUTO_DENIED_TRANSACTION_LIMIT) >= 0){
      rowData.flxColumn12.isVisible =true;
      rowData.txtPerTransAutoDenyLimits.skin ="sknTbxFFFFFFBrE32416R3pxLato13px";
      rowData.lblErrorMsg12.text = currActionError[this.limitId.AUTO_DENIED_TRANSACTION_LIMIT].error;
    }
    if(currErrorLimitArr.indexOf(this.limitId.PRE_APPROVED_DAILY_LIMIT) >= 0){
      rowData.flxColumn21.isVisible =true;
      rowData.txtDailyTransPreApprovedLimit.skin ="sknTbxFFFFFFBrE32416R3pxLato13px";
      rowData.lblErrorMsg21.text = currActionError[this.limitId.PRE_APPROVED_DAILY_LIMIT].error;
    }
    if(currErrorLimitArr.indexOf(this.limitId.AUTO_DENIED_DAILY_LIMIT) >= 0){
      rowData.flxColumn22.isVisible =true;
      rowData.txtDailyTransAutoDenyLimits.skin ="sknTbxFFFFFFBrE32416R3pxLato13px";
      rowData.lblErrorMsg22.text = currActionError[this.limitId.AUTO_DENIED_DAILY_LIMIT].error;
    }
    if(currErrorLimitArr.indexOf(this.limitId.PRE_APPROVED_WEEKLY_LIMIT) >= 0){
      rowData.flxColumn31.isVisible =true;
      rowData.txtWeeklyTransPreApprovedLimit.skin ="sknTbxFFFFFFBrE32416R3pxLato13px";
      rowData.lblErrorMsg31.text = currActionError[this.limitId.PRE_APPROVED_WEEKLY_LIMIT].error;
    }
    if(currErrorLimitArr.indexOf(this.limitId.AUTO_DENIED_WEEKLY_LIMIT) >= 0){
      rowData.flxColumn32.isVisible =true;
      rowData.txtWeeklyTransAutoDenyLimits.skin ="sknTbxFFFFFFBrE32416R3pxLato13px";
      rowData.lblErrorMsg32.text = currActionError[this.limitId.AUTO_DENIED_WEEKLY_LIMIT].error;
    }
    if(currErrorLimitArr.length > 0){
      rowData.flxAssignLimits.isVisible =true;
    } else{
      rowData.flxAssignLimits.isVisible =false;
    }
    return rowData;
  },
  /*
  * clear the inline errors if valid
  * @param: rowdata
  * @return errors cleared row data
  */
  clearAccLevelLimitErrorEditUser : function(rowData){
    rowData.txtPerTransPreApprovedLimit.skin ="sknTbxBgFFFFFFBrD7D9E01pxR3px";
    rowData.txtPerTransAutoDenyLimits.skin ="sknTbxBgFFFFFFBrD7D9E01pxR3px";
    rowData.txtDailyTransPreApprovedLimit.skin ="sknTbxBgFFFFFFBrD7D9E01pxR3px";
    rowData.txtDailyTransAutoDenyLimits.skin ="sknTbxBgFFFFFFBrD7D9E01pxR3px";
    rowData.txtWeeklyTransPreApprovedLimit.skin ="sknTbxBgFFFFFFBrD7D9E01pxR3px";
    rowData.txtWeeklyTransAutoDenyLimits.skin ="sknTbxBgFFFFFFBrD7D9E01pxR3px";
    rowData.flxColumn11.isVisible =false;
    rowData.flxColumn12.isVisible =false;
    rowData.flxColumn21.isVisible =false;
    rowData.flxColumn22.isVisible =false;
    rowData.flxColumn31.isVisible =false;
    rowData.flxColumn32.isVisible =false;
    return rowData;
  },
  /*
  * show popup forr reset limits
  * @param: option(customer level:1,acc level:2), cardwidget Path
  */
  showResetLimitsEditUserPopup : function(option,cardWidgetPath){
    var self = this;
    this.view.popUpDeactivate.lblPopUpMainMessage.text = kony.i18n.getLocalizedString("i18n.common.ResetLimits");
    this.view.popUpDeactivate.rtxPopUpDisclaimer.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AreYouSureToResetLimits");
    this.view.popUpDeactivate.btnPopUpCancel.text = kony.i18n.getLocalizedString("i18n.PopUp.NoLeaveAsIS");
    this.view.popUpDeactivate.btnPopUpDelete.text = kony.i18n.getLocalizedString("i18n.PopUp.YesDeactivate");
    this.view.flxEnrollCustConfirmationPopup.setVisibility(true);
    
    this.view.popUpDeactivate.btnPopUpDelete.onClick = function(){
      if(option === 1){ //cust level
        self.resetLimitGroupValuesEditUser();
      }else{ //account level
        self.resetLimitValuesEditUser(cardWidgetPath);
      }
      self.view.flxEnrollCustConfirmationPopup.setVisibility(false);
    };
  },
  /*
  * reset the limit values under an account
  * selected card widget path
  */
  resetLimitValuesEditUser : function(cardWidgetPath){
    var self = this;
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accountDetails = cardWidgetPath.info.accDetails;
    var currUserLimitsMap = editUserObj.accLevelLimits;
    var accNum = accountDetails.accountNumber || accountDetails.accountId;
    var currAccObj = currUserLimitsMap.get(accNum);
    var featureLimits = JSON.parse(currAccObj.limits);
    //update the actual limits in edit object
    for(var i=0; i<featureLimits.length; i++){
      for(var j=0; j<featureLimits[i].actions.length; j++){
        if(featureLimits[i].actions[j].limits){
          if(this.enrollAction !== this.actionConfig.editUser){
            featureLimits[i].actions[j].limits = this.addNewLimitsToExistingLimits(featureLimits[i].actions[j].actualLimits);
          } else{
            featureLimits[i].actions[j].limits = this.getLimitValuesJsonFromArray(featureLimits[i].actions[j].actualLimits);
          }
        }
      }
    }
    currAccObj.limits = JSON.stringify(featureLimits);
    currUserLimitsMap.set(accNum,currAccObj);
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
    //update the limit values in segment
    this.setLimitsAtAccountLevel(cardWidgetPath.segAccountFeatures,featureLimits, custId);
  },
  /*
  * reset the limit groups values of customer
  */
  resetLimitGroupValuesEditUser : function(){
    var self = this;
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var updateLimitGroupMaxValues = this.caluclateTransactionLimitGroupValue(editUserObj.accountMapFeatures,editUserObj.accLevelLimits,false,editUserObj.limitGroups); 
    //update the values in edit obj
    for(var i=0; i<updateLimitGroupMaxValues.length; i++){
      for(var j=0; j<updateLimitGroupMaxValues[i].limits.length; j++){
        updateLimitGroupMaxValues[i].limits[j].value = updateLimitGroupMaxValues[i].limits[j].maxValue+"";
      }
    }
    editUserObj.limitGroups = updateLimitGroupMaxValues;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
    //update the limit values in segment
    this.createLimitsRowsForCustLevel();
  },
  /*
  * show the limit range when focused on a textbox in limits component
  * @param: prefixed widget id,internal row num,option(true/false)
  */
  showHideRange : function(id,rowNum,option){
    this.view.enrollEditLimitsCard[id+"flxLimitError"+rowNum].isVisible = false;
    this.view.enrollEditLimitsCard[id+"flxLimitValue"+rowNum].skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px"; 
    if(option === true){
      this.view.enrollEditLimitsCard[id+"flxRangeCont"+rowNum].isVisible = true;
      this.view.enrollEditLimitsCard[id+"flxLimitValue"+rowNum].skin = "sknFlxBorder117eb0radius3pxbgfff"; //set focus skin
    } else{
      this.view.enrollEditLimitsCard[id+"flxRangeCont"+rowNum].isVisible = false;
      this.view.enrollEditLimitsCard[id+"flxLimitValue"+rowNum].skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
    }
    this.view.forceLayout();
  },
  /*
  * show the range tooltip for limits at account level
  */
  showRangeTooltip : function(widget,context){
    if (context.eventType === constants.ONHOVER_MOUSE_ENTER) {
      this.view.flxRangeTooltip.top = (context.pageY -120)+"dp";
      this.view.flxRangeTooltip.left = (context.pageX - 305 -230 -70) +"dp"; //(pageX -leftmenu-verticaltabs- left,right padding)
      if(this.view.flxRangeTooltip.isVisible === false){
        this.view.flxRangeTooltip.setVisibility(true);
        this.view.forceLayout();
      }    
    } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
      if(this.view.flxRangeTooltip.isVisible === true)
        this.view.flxRangeTooltip.setVisibility(false);
    }
  },
   /*
  * search at customer level features/other features based on feature,action name
  * @option-(features:1,other features:2)
  */
  searchFeaturesCustomerLevel : function(option){
    var searchWidgetPath,cardWidgetPath;
    if(option === 1){
      searchWidgetPath =this.view.searchEditFeatures;
      cardWidgetPath = this.view.enrollEditFeaturesCard;
    }else{
      searchWidgetPath =this.view.searchEditOtherFeatures;
      cardWidgetPath = this.view.enrollEditOtherFeaturesCard;
    }
    var searchText = searchWidgetPath.tbxSearchBox.text.trim() || "";
    var actualData = cardWidgetPath.segAccountFeatures.info.segDataJSON;
    var featureNamesList = Object.keys(actualData);
    var filterData = [],filteredSection = [],filteredRowData = [],updateDetailsObj =[];
    if(searchText.length > 0){
      for(var i=0; i<featureNamesList.length;i++){
        filteredRowData = [];
        //search for action first
        for(var j=0; j<actualData[featureNamesList[i]][1].length;j++){
          updateDetailsObj =[]
          updateDetailsObj.push(actualData[featureNamesList[i]][0]);
          updateDetailsObj.push(actualData[featureNamesList[i]][1]);
          if(updateDetailsObj[1][j].lblFeatureName.text.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){       
            filteredRowData.push(updateDetailsObj[1][j]);
          }
        }
        if(filteredRowData.length >0){
          updateDetailsObj[0].imgSectionCheckbox.src = this.getHeaderCheckboxImage(filteredRowData,true, true);
          filterData.push([updateDetailsObj[0],filteredRowData]);
          
        }else{ // filter for only feature
          if(updateDetailsObj[0].lblFeatureName.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
             updateDetailsObj[1] = this.showHideSegRowFlex(updateDetailsObj[1],false);
             filterData.push(updateDetailsObj);
          }
        }
      }
    } else{
      filterData = Object.values(actualData);
    }
    cardWidgetPath.segAccountFeatures.rowTemplate = "flxContractEnrollFeaturesEditRow";
    cardWidgetPath.segAccountFeatures.setData(filterData);
    cardWidgetPath.imgSectionCheckbox.src = this.getHeaderCheckboxImage(cardWidgetPath.segAccountFeatures.data,false, true);
    //show/hide no results flex
    if(filterData.length > 0){
      cardWidgetPath.lblCount.text = this.getSelectedItemsCount(filterData, false);
      cardWidgetPath.lblTotalCount.text = "of "+ this.getTwoDigitNumber(filterData.length);
      cardWidgetPath.flxNoFilterResults.setVisibility(false);
      cardWidgetPath.segAccountFeatures.setVisibility(true);
      cardWidgetPath.flxSelectAllOption.setVisibility(true);
    } else{
      cardWidgetPath.lblCount.text = "0";
      cardWidgetPath.lblTotalCount.text = "of 0";
      cardWidgetPath.segAccountFeatures.setVisibility(false);
      cardWidgetPath.flxSelectAllOption.setVisibility(false);
      cardWidgetPath.flxNoFilterResults.setVisibility(true);
      cardWidgetPath.lblNoFilterResults.skin = "sknLblLato84939E12px";
      cardWidgetPath.lblNoFilterResults.text = kony.i18n.getLocalizedString("i18n.frmLogs.rtxNorecords");
    }
    this.view.forceLayout();
  },
  /*
  * search at account level features/limits based on account number
  * @param: option(features:1,limits:2)
  */
  searchFeaturesLimitsAccountLevel : function(option){
    var count = 0;
     var allAccountCards = (option ===1) ? this.view.flxEnrollEditAccFeaturesList.widgets() : this.view.flxEnrollEditAccLimitsList.widgets();
    var searchText = (option ===1) ?this.view.searchEditFeatures.tbxSearchBox.text.trim() : this.view.searchEditLimits.tbxSearchBox.text.trim();
    var accountCard = this.filterFeaturesLimitsBasedOnAccType(option);
    //hide the accounts based on the filter result
    for(var p=0; p<allAccountCards.length; p++){
      if(accountCard.length === 0)
        allAccountCards[p].isVisible = false;
      for(var q=0; q<accountCard.length; q++){
        if(accountCard[q].info.accDetails.accountNumber === allAccountCards[p].info.accDetails.accountNumber){
          if(searchText.length > 0){ //filter for search text if any
            if(accountCard[q]["lblName"].text.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
              accountCard[q].isVisible = true;
            } else{
              accountCard[q].isVisible = false
            }
          } else{
            accountCard[q].isVisible = true;
          }
          break;
        }
      }
    }
    for(var i=0; i<allAccountCards.length; i++){
      count = allAccountCards[i].isVisible === true ? count +1 : count;
    }
    if(option === 1){ //features tab
      this.view.lblEnrollFeaturesNoFilterResults.skin = "sknLblLato84939E12px";
      if(count === 0){
        this.view.lblEnrollFeaturesNoFilterResults.text =  kony.i18n.getLocalizedString("i18n.frmLogs.rtxNorecords");
        this.view.flxEnrollEditAccFeaturesList.setVisibility(false);
        this.view.flxEnrollEditNoResultAccFeatures.setVisibility(true);
      } else{
        this.view.flxEnrollEditAccFeaturesList.setVisibility(true);
        this.view.flxEnrollEditNoResultAccFeatures.setVisibility(false);
      }
    } else{ //limits tab
      if(count === 0){
        this.view.lblEnrollLimitsNoFilterResults.skin = "sknLblLato84939E12px";
        this.view.lblEnrollLimitsNoFilterResults.text =  kony.i18n.getLocalizedString("i18n.frmLogs.rtxNorecords");
        this.view.flxEnrollEditAccLimitsList.setVisibility(false);
        this.view.flxEnrollEditNoResultAccLimits.setVisibility(true);
      }else{
        this.view.flxEnrollEditAccLimitsList.setVisibility(true);
        this.view.flxEnrollEditNoResultAccLimits.setVisibility(false);
      }
    }
    this.view.forceLayout();
  },
  /*
  * show bulk update features/limits popup
  * @param: option for feature/limits - 1/2
  */
  showBulkUpdatePopupEditUser: function(option){
    this.view.flxBulkUpdateFeaturesPopup.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info ={"option" : option};
    this.enableDisableDropdownUIEditUser(this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate, false);
    this.view.bulkUpdateFeaturesLimitsPopup.flxSegmentContainer.top = "106dp";
    this.view.bulkUpdateFeaturesLimitsPopup.flxSearchContainer.setVisibility(true);
    this.setAccountsListInBulkUpdatePopup(option);
    this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.tbxSearchBox.text = "";
    this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.flxSearchCancel.setVisibility(false);
    this.showBulkUpdatePopupScreen1();
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info = {"added":[]};
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.removeAll();
    this.setRadioGroupData(option);
    this.setFeatureLimitsBulkUpdateUI(option);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnSave,true,true);
  },
  /*
  * show bulk update features/limits accounts selection screen
  */
  showBulkUpdatePopupScreen1 : function(){
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen1.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen2.setVisibility(false);
  },
  /*
  * show bulk update features/limits screen in popup
  */
  showBulkUpdatePopupScreen2 : function(){
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.lblIconArrow.text="";
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen1.setVisibility(false);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen2.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.setVisibility(true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen2.btnSave,true,true);
    var flxChildren = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.removeAll();
    for(var i=0;i<flxChildren.length;i++){
      this.view.bulkUpdateFeaturesLimitsPopup.remove(this.view.bulkUpdateFeaturesLimitsPopup[flxChildren[i].id]);
    }
    this.view.forceLayout();
    var height = this.view.bulkUpdateFeaturesLimitsPopup.flxContractDetailsPopupContainer.frame.height - (70 + this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateListContainer.frame.y + 80);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateListContainer.height = height + "dp";
    if(this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info.option === 1){
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.plusAddNewPermissions");
      this.bulkUpdateListboxData = this.getListForListBox(1);
      this.addNewFeatureRowBulkUpdate("enroll");
      this.getFeaturesForBulkUpdate(1, "enroll");
    } else{
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.plusAddNewLimits");
      this.bulkUpdateListboxData = this.getListForListBox(2);
      this.addNewLimitRowBulkUpdate("enroll");
      this.getFeaturesForBulkUpdate(2, "enroll");
    }
    
  },
  /*
  * set bulk update popup UI changes based on feature/limit
  * @param: option(features:1,limits:2)
  */
  setFeatureLimitsBulkUpdateUI : function(option){
    if(option === 1){
      this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate.lblSelectedValue.text = this.view.customersDropdownFeatures.lblSelectedValue.text;
      this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate.lblSelectedValue.toolTip = this.view.customersDropdownFeatures.lblSelectedValue.toolTip
      this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate.btnPrimary.isVisible = this.view.customersDropdownFeatures.btnPrimary.isVisible;
      this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UpdatePermissionsInBulk");
      this.view.bulkUpdateFeaturesLimitsPopup.lblTitle.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddPermissions");
    }else{
      this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate.lblSelectedValue.text = this.view.customersDropdownLimits.lblSelectedValue.text;
      this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate.lblSelectedValue.toolTip = this.view.customersDropdownLimits.lblSelectedValue.toolTip;
      this.view.bulkUpdateFeaturesLimitsPopup.customersDropdownBulkUpdate.btnPrimary.isVisible = this.view.customersDropdownLimits.btnPrimary.isVisible;
      this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.text =  kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UpdateLimitsInBulk");
      this.view.bulkUpdateFeaturesLimitsPopup.lblTitle.text = kony.i18n.getLocalizedString("i18n.contracts.addLimits");
    }
  },
  /*
  * widget data map for accounts list in bulk update popup
  * @returns: widget map
  */
  widgetMapforBulkUpdateAccounts : function(){
    var widgetMap = {
      "id":"id",
      "lblFeatureName":"lblFeatureName",
      "flxToggleArrow":"flxToggleArrow",
      "lblIconToggleArrow":"lblIconToggleArrow",
      "flxLeftDetailsCont":"flxLeftDetailsCont",
      "lblSectionLine":"lblSectionLine",
      "lblAvailableActions":"lblAvailableActions",
      "lblCountActions":"lblCountActions",
      "lblTotalActions":"lblTotalActions",
      "flxAccountSectionCont":"flxAccountSectionCont",
      "flxHeaderContainer":"flxHeaderContainer",
      "flxAccountNumCont":"flxAccountNumCont",
      "flxAccountType":"flxAccountType",
      "flxAccountName":"flxAccountName",
      "flxAccountHolder":"flxAccountHolder",
      "lblSeperator":"lblSeperator",
      "imgSectionCheckbox":"imgSectionCheckbox",
      "flxCheckbox":"flxCheckbox",
      "lblAccountNumber":"lblAccountNumber",
      "lblIconSortAccName":"lblIconSortAccName",
      "lblAccountType":"lblAccountType",
      "lblAccountName":"lblAccountName",
      "lblIconAccNameSort":"lblIconAccNameSort",
      "lblAccountHolder":"lblAccountHolder",
      "lblIconSortAccHolder":"lblIconSortAccHolder",
      "flxEnrollSelectedAccountsSec":"flxEnrollSelectedAccountsSec",
      "imgCheckbox":"imgCheckbox",
      "isRowVisible":"isRowVisible",
      "flxContractEnrollAccountsEditRow":"flxContractEnrollAccountsEditRow"
      
    };
    return widgetMap;
  },
  /*
  * set accounts data in bulk update popup
  */
  setAccountsListInBulkUpdatePopup : function(option){
    var self =this;
    var custId ="";
    if(option === 1){
      custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    } else{
      custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    }
    var custEditUserObj  = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var allAccountsMap = custEditUserObj.accounts;
    var accountsJson = this.getAccountsBasedOnAccType(allAccountsMap);
    var accList = Object.values(accountsJson);
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info = {"allData":{}};
    var segData = accList.map(function(accArr){
      var rowsData = [],selRowCount = 0;
      for(var i=0;i< accArr.length; i++){
        rowsData.push({
          "isRowVisible":false,
          "id": accArr[i].accountNumber,
          "flxContractEnrollAccountsEditRow":{"isVisible":false,
                                              "skin":"sknFlxBgFFFFFFbrD7D9E0r1pxLeftRight"},
          "flxCheckbox":{"onClick": self.onCheckAccountsCheckbox.bind(self,self.view.bulkUpdateFeaturesLimitsPopup.segSelectionList,false)},
          "imgCheckbox":{"src":(accArr[i].isEnabled === "true" || accArr[i].isAssociated === "true") ? self.AdminConsoleCommonUtils.checkboxSelected: self.AdminConsoleCommonUtils.checkboxnormal},
          "lblAccountNumber": {"text":accArr[i].accountNumber},
          "lblAccountType": {"text":accArr[i].accountType},
          "lblAccountName": {"text":accArr[i].accountName},
          "lblAccountHolder": {"text":accArr[i].ownerType},
          "lblSeperator":"-",
          "template":"flxContractEnrollAccountsEditRow"
        });
        selRowCount = (accArr[i].isEnabled === "true" || accArr[i].isAssociated === "true") ? (selRowCount +1) : selRowCount;
        self.sortBy = self.getObjectSorter("lblAccountNumber.text");
        self.sortBy.inAscendingOrder = true;
        rowsData = rowsData.sort(self.sortBy.sortData);
      }
      
      var sectionData = {
        "lblFeatureName": accArr[0].accountType,
        "flxToggleArrow":{"onClick": self.toggleSelectAccountsArrow},
        "lblIconToggleArrow": {"text":"\ue922","skin":"sknIcon00000015px"},
        "flxLeft":"flxLeft",
        "lblSectionLine":"-",
        "lblAvailableActions":kony.i18n.getLocalizedString("i18n.frmCompanies.Selected_Accounts")+":",
        "lblCountActions": (selRowCount +""),
        "lblTotalActions": "of "+rowsData.length,
        "flxAccountSectionCont":{"skin":"sknFlxBgF5F6F8BrD7D9E0Br1pxRd3px"},
        "flxHeaderContainer":{"isVisible":false},
        "flxAccountNumCont":{"onClick":self.sortAndSetData.bind(self,"lblAccountNumber.text",self.view.bulkUpdateFeaturesLimitsPopup.segSelectionList, 2)},
        "flxAccountType":{"onClick":""},
        "flxAccountName":{"onClick":self.sortAndSetData.bind(self,"lblAccountName.text",self.view.bulkUpdateFeaturesLimitsPopup.segSelectionList, 2)},
        "flxAccountHolder":{"onClick":self.showAccountsFilterInBulkUpdate},
        "lblSeperator":"-",
        "imgSectionCheckbox":{"src":self.getHeaderCheckboxImage(rowsData,true,true)},
        "flxCheckbox":{"onClick":self.onCheckAccountsCheckbox.bind(self,self.view.bulkUpdateFeaturesLimitsPopup.segSelectionList,true)},
        "lblAccountNumber": kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNUMBER"),
        "lblIconSortAccName":{
          "text": "\ue92a","left" : "10px",
          "skin": "sknIcon12pxBlack","hoverSkin" :"sknIcon12pxBlackHover"
        },
        "lblAccountType": kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTTYPE"),
        "lblAccountName":kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNAME"),
        "lblIconAccNameSort":{
          "text": "\ue92b","left" : "5px",
          "skin": "sknIcon15px","hoverSkin" :"sknlblCursorFont"
        },
        "lblAccountHolder": kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.OwnershipType_UC"),
        "lblIconSortAccHolder":"\ue916",
        "template":"flxEnrollSelectedAccountsSec",
      };
      
      self.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.allData[accArr[0].accountType] = {"sectionData":sectionData,
                                                                                                      "rowData":rowsData};
      return [sectionData, rowsData];
    });
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.widgetDataMap = this.widgetMapforBulkUpdateAccounts();
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData(segData);
    this.view.forceLayout();
  },
  /*
  * categorize accounts based on account type
  * @param: all ccounts map
  */
  getAccountsBasedOnAccType : function(accountsMap){
    var accountJson = {};
    accountsMap.forEach(function(account,key){
      (accountJson[account.accountType] = accountJson[account.accountType] || []).push(account);
    });
    return accountJson;
  },
  /*
  * expand/collapse the selected account type list in bulk update popup
  */
  toggleSelectAccountsArrow : function(context){
    var selSecInd = context.rowContext.sectionIndex;
    var selRowInd = context.rowContext.rowIndex;
    var segData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    for(var i=0; i<segData.length; i++){
      if(selSecInd !== i){
        segData[i][0].lblIconToggleArrow.text = "\ue922"; //right-arrow
        segData[i][0].lblIconToggleArrow.skin = "sknIcon00000015px";
        segData[i][0].flxHeaderContainer.isVisible = false;
        segData[i][1] = this.showHideSegRowFlex(segData[i][1],false);
        segData[i][0].flxAccountSectionCont.skin = "sknFlxBgF5F6F8BrD7D9E0Br1pxRd3px";

      }
    }
    if(segData[selSecInd][0].lblIconToggleArrow.skin === "sknIcon00000015px"){
      segData[selSecInd][0].lblIconToggleArrow.text = "\ue915"; //down-arrow
      segData[selSecInd][0].lblIconToggleArrow.skin = "sknIcon00000014px";
      segData[selSecInd][0].flxHeaderContainer.isVisible = true;
      segData[selSecInd][1] = this.showHideSegRowFlex(segData[selSecInd][1],true);
      segData[selSecInd][0].flxAccountSectionCont.skin = "sknFlxBgF5F6F8BrD7D9E0rd3pxTopRound";
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.allData[segData[selSecInd][0].lblFeatureName] = {"sectionData":segData[selSecInd][0],
                                                                                                                     "rowData":segData[selSecInd][1]};
      this.setDataForOwnershipFilterBulk(segData[selSecInd][1]);
    } else{
      segData[selSecInd][0].lblIconToggleArrow.text = "\ue922"; //right-arrow
      segData[selSecInd][0].lblIconToggleArrow.skin = "sknIcon00000015px";
      segData[selSecInd][0].flxHeaderContainer.isVisible = false;
      segData[selSecInd][1] = this.showHideSegRowFlex(segData[selSecInd][1],false);
      segData[selSecInd][0].flxAccountSectionCont.skin = "sknFlxBgF5F6F8BrD7D9E0Br1pxRd3px";
    }
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData(segData);
    this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.setVisibility(false);
  },
  /*
  * get the selected account types and their count in bulk update screen
  */
  getSelectedAccountTypesCount : function(){
    var accountTypes = [];
    var segData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    for(var i=0;i<segData.length;i++){
      var segImg = segData[i][0].imgSectionCheckbox ? segData[i][0].imgSectionCheckbox.src : segData[i][0].imgCheckbox.src
      if(segImg !== this.AdminConsoleCommonUtils.checkboxnormal){
        var count =0;
        for(var j=0;j<segData[i][1].length; j++){
          if(segData[i][1][j].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxSelected)
            count = count + 1;
        }
        var accJson = {"accType":segData[i][0].lblFeatureName,
                       "count":count};
        accountTypes.push(accJson);
      }
    }
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.removeAll();
    for(var k=0;k<accountTypes.length;k++){
      this.addAccountsTag(accountTypes[k]);
    }
  },
  /*
  * show the ownership type filter in bul update feature/limits popup
  */
  showAccountsFilterInBulkUpdate : function(event,context){
    var flxRight = context.widgetInfo.frame.width - event.frame.x - event.frame.width;
    var iconRight = event.frame.width - event.lblIconSortAccHolder.frame.x;
    this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.right = (flxRight + iconRight - 32) + "dp";
    var secInd = context.sectionIndex;
    var computedTop = 0;
    for(var i=0;i< secInd;i++){
      computedTop = computedTop + 80;
    }
    this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.top = (computedTop + event.parent.frame.y + event.frame.y + 10 -
                                                                 this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.contentOffsetMeasured.y) + "dp";
    if (this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.isVisible) {
      this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.setVisibility(false);
    } else {
      this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.setVisibility(true);
    }
  },
  /*
  * enroll - change the fields based on features/limits bulk update
  * @param: opt - feature/limit, row widget path
  */
  setFeatureLimitRowUI : function(opt,widgetPath, category){
    if(opt === 1){  //for feature
      widgetPath.flxRow2.setVisibility(false);
      widgetPath.flxFieldColumn13.setVisibility(false);
      widgetPath.flxFieldColumn21.setVisibility(false);
    } else{ //for limits
      widgetPath.tbxValue21.text ="";
      widgetPath.tbxValue22.text ="";
      widgetPath.flxFieldColumn13.setVisibility(false);
      widgetPath.flxFieldColumn21.setVisibility(true);
      widgetPath.flxFieldColumn22.setVisibility(true);
      widgetPath.lblFieldName22.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AutoDeny");
      widgetPath.flxErrorField21.setVisibility(false);
      widgetPath.flxErrorField22.setVisibility(false);
      if(category === "enroll"){
        widgetPath.flxRow2.setVisibility(true);
        widgetPath.lblFieldName21.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.PreApproved");
      }else{
        widgetPath.flxRow2.setVisibility(false);
        widgetPath.lblFieldName21.text = kony.i18n.getLocalizedString("i18n.ConfigurationBundles.value");
      }
    }
  },
  /*
  * enroll - get the features,actions list to show in bulk update popup
  */
  getFeaturesForBulkUpdate : function(option,category){
    var bulkUpdateFeatures={};
    var featureJSON={};
    var actionsJSON={};
    var actions;
    var featuresList = category === "enroll" ? (option === 1 ? this.bulkUpdateAllFeaturesList : this.bulkUpdateAllFeaturesLimits) :
                                               this.bulkUpdateAllFeaturesListContract;
    for(var i=0;i<featuresList.length;i++){
      featureJSON={};
      featureJSON.featreName=featuresList[i].featureName;
      featureJSON.actions=[];
      var actions = featuresList[i].actions || featuresList[i].permissions;
      for(var j=0;j<actions.length;j++){
        actionsJSON={};
        actionsJSON.actionName=actions[j].actionName;
        actionsJSON.actionId=actions[j].actionId;
        actionsJSON.isChecked=true;
        actionsJSON.type=actions[j].isAccountLevel;
        actionsJSON.limitVal="0";
        actionsJSON.dependentActions=[];
        if(actions[j].dependentActions && actions[j].dependentActions.length>0){
          if(typeof actions[j].dependentActions==="string")//as we are getting string format in edit flow and object format in create flow
            actionsJSON.dependentActions=(actions[j].dependentActions.substring(1,actions[j].dependentActions.length-1)).split(",");
          else
            actionsJSON.dependentActions=actions[j].dependentActions.map(function(rec){return rec.id});
        }
        featureJSON.actions.push(actionsJSON);
      }
      bulkUpdateFeatures[featuresList[i].featureId]=featureJSON;
    }
    this.bulkUpdateList = bulkUpdateFeatures;
  },
  /*
  * enroll - add new entry for feature selection in bulk update popup
  * @param: category(enroll/contract)
  */
  addNewFeatureRowBulkUpdate : function(category){
    var flxChildren = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    //caluclate the value for id to suffix
    var num = flxChildren.length > 0 ? flxChildren[flxChildren.length-1].id.split("Z")[1] : "0";
    num = parseInt(num,10) +1;
    var id = num > 9 ? ""+num: "0"+num;
    var rowWidth = this.view.bulkUpdateFeaturesLimitsPopup.flxContractDetailsPopupContainer.frame.width - 40;
    var featureRowToAdd = new com.adminConsole.contracts.bulkUpdateAddNewFeatureRow({
        "id": "bulkFeatureRowZ" +id,
        "isVisible": true,
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "left":"20dp",
        "width":rowWidth + "dp",
        "top": "20dp"
      }, {}, {});
    this.setNewFeatureLimitRowData(featureRowToAdd,1, category);
    
  },
  /*
  * enroll - add new entry for limit selection in bulk update popup
  * @param: category(enroll/contract)
  */
  addNewLimitRowBulkUpdate : function(category){
    var flxChildren = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    //caluclate the value for id to suffix
    var num = flxChildren.length > 0 ? flxChildren[flxChildren.length-1].id.split("Z")[1] : "0";
    num = parseInt(num,10) +1;
    var id = num > 9 ? ""+num: "0"+num;
    var rowWidth = this.view.bulkUpdateFeaturesLimitsPopup.flxContractDetailsPopupContainer.frame.width - 40;
    var limitRowToAdd = new com.adminConsole.contracts.bulkUpdateAddNewFeatureRow({
        "id": "bulkLimitRowZ" +id,
        "isVisible": true,
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "left":"20dp",
        "width":rowWidth + "dp",
        "top": "20dp"
      }, {}, {});
    
    this.setNewFeatureLimitRowData(limitRowToAdd,2, category);
  },
  /*
  * enroll - set data and assign actions to the newly created row
  * @param: new row widget path, option (features:1,limits:2), category(enroll/contracts)
  */
  setNewFeatureLimitRowData : function(newRowWidget, option, category){
    var self =this;
    var allRows = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    if(allRows.length === 0){
      newRowWidget.flxDelete.isVisible = false;
    } else{
      allRows[0].flxDelete.isVisible = true;
      newRowWidget.flxDelete.isVisible = true;
    }
    var listboxData = this.getUnselectedFeaturesList(option, category);
    newRowWidget.lstBoxFieldValue11.masterData = listboxData;
    newRowWidget.lstBoxFieldValue11.selectedKey = listboxData[0][0];
    newRowWidget.zIndex = listboxData.length;
    newRowWidget.lblFieldValue12.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAnAction");
    newRowWidget.lblFieldValue12.toolTip = "";
    //assigning actions
    newRowWidget.lstBoxFieldValue11.onSelection = function(){
      newRowWidget.lstBoxFieldValue11.skin="sknLbxborderd7d9e03pxradius";
      newRowWidget.flxErrorField11.setVisibility(false);
      self.updateExistingRowsListboxData(newRowWidget,option,category);
      //disable action when feature not selected
      if(newRowWidget.lstBoxFieldValue11.selectedKey === "select"){
        newRowWidget.flxFieldValueContainer12.setEnabled(false);
        newRowWidget.lblFieldValue12.toolTip = "";
        newRowWidget.lblFieldValue12.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAnAction");
      } else{
        self.setActionsListboxData(newRowWidget,option);
      }
    }
    if(listboxData.length<3)//if there is only one feature to be added , that would be added in this widget row so no new row is needed
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.setVisibility(false);
    else
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.setVisibility(true);
    newRowWidget.flxDelete.onClick = this.deleteAddNewFeatureRow.bind(this,newRowWidget, option, category);
    newRowWidget.tbxValue21.onKeyUp = function(){
      newRowWidget.flxValue21.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
      newRowWidget.flxErrorField21.setVisibility(false);
    }
    newRowWidget.tbxValue22.onKeyUp = function(){
      newRowWidget.flxValue22.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
      newRowWidget.flxErrorField22.setVisibility(false);
    }
    this.setFeatureLimitRowUI(option,newRowWidget,category);
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.addAt(newRowWidget, allRows.length);
    this.updateExistingRowsListboxData(newRowWidget, option,category);
    this.view.forceLayout();
  },
  /*
  * enroll - set data to actions segmnet in every row in bulkupdate popup
  * @param: row component widget path
  */
  setActionsListboxData : function(widgetPath, option){
    var self=this;
    var maxText = "";
    var allBulkFeatures=this.bulkUpdateList;
    var selectedFeatureId=widgetPath.lstBoxFieldValue11.selectedKey;
    var featureActions=[{"id":"select","name":"Select"}];
    var actionListData=[["select","Select"]];
    if(selectedFeatureId!=="select"){
      featureActions=allBulkFeatures[selectedFeatureId].actions;
      widgetPath.lblFieldValue12.toolTip = "";
      widgetPath.lblFieldValue12.text=featureActions.length+ " " + kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.Selected");
      widgetPath.flxFieldValueContainer12.setEnabled(true);
      widgetPath.flxFieldValueContainer12.onClick = this.setActionsSearchOnFieldClick.bind(this,widgetPath);
    }
    var widgetMap = {
      "serviceType": "serviceType",
      "flxSearchDropDown": "flxSearchDropDown",
      "flxCheckBox": "flxCheckBox",
      "imgCheckBox": "imgCheckBox",
      "lblDescription": "lblDescription",
      "dependentActions": "dependentActions"
    };
    var i=0;
    var actionsSegData=featureActions.map(function(action){
      self.bulkUpdateList[selectedFeatureId].actions[i].isChecked=true;
      maxText=action.actionName.length > maxText.length ? action.actionName : maxText;
      i=i+1;
      return{
        "actionId": action.actionId,
        "flxSearchDropDown": "flxSearchDropDown",
        "imgCheckBox":self.AdminConsoleCommonUtils.checkboxSelected,
        "lblDescription": action.actionName,
        "dependentActions": action.dependentActions
      }
    });
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.widgetDataMap=widgetMap;
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setData(actionsSegData);
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info={"data":actionsSegData};
    var maxTextWidth=this.AdminConsoleCommonUtils.getLabelWidth(maxText,"13px Lato-Regular");
    var dropDownWidth=maxTextWidth+15+15+20;
    widgetPath.flxDropdownField12.width = dropDownWidth >widgetPath.flxFieldValueContainer12.frame.width ? dropDownWidth+"px" : widgetPath.flxFieldValueContainer12.frame.width+"px";
    //to select all the actions by default
    var selectInd=[];
    for(let x=0;x<actionsSegData.length;x++){
      selectInd.push(x);
    }
    var selectionProp = {
      imageIdentifier: "imgCheckBox",
      selectedStateImage: this.AdminConsoleCommonUtils.checkboxSelected,
      unselectedStateImage: this.AdminConsoleCommonUtils.checkboxnormal
    };
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectionBehavior = constants.SEGUI_MULTI_SELECT_BEHAVIOR;
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectionBehaviorConfig = selectionProp;
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices = [[0,selectInd]];
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info={"data":actionsSegData,"selectedIndices":selectInd};
    //actions for the row component
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.onRowClick = this.onClickOfActionBulkUpdateRow.bind(this,widgetPath);
    widgetPath.flxDropdownField12.onHover = this.onHoverEventCallback;
    widgetPath.productTypeFilterMenu.tbxSearchBox.onKeyUp = this.searchActionsInBulkUpdate.bind(this,widgetPath);
    widgetPath.productTypeFilterMenu.flxClearSearchImage.onClick = this.clearSearchActionBulkUpdate.bind(this,widgetPath);
    this.view.forceLayout();
  },
  /*
  * search actions initialization
  * @param: row widget path
  */
  setActionsSearchOnFieldClick : function(widgetPath){
    widgetPath.flxFieldValueContainer12.skin="sknFlxbgFFFFFFbdrD7D9E0rd3px";
    widgetPath.flxErrorField12.setVisibility(false);
    if(widgetPath.flxDropdownField12.isVisible)
      widgetPath.flxDropdownField12.setVisibility(false);
    else{
      widgetPath.productTypeFilterMenu.tbxSearchBox.text="";
      widgetPath.productTypeFilterMenu.flxClearSearchImage.setVisibility(false);
      var totalRecords=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.data;
      widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setData(totalRecords);
      //to select actions by default
      var selectInd=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices;
      widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices = [[0,selectInd]];
      widgetPath.productTypeFilterMenu.flxNoResultFound.setVisibility(false);
      widgetPath.flxDropdownField12.setVisibility(true);
    }
  },
  /*
  * on click of action in bulk update popup listbox
  * @param: row widget path
  */
  onClickOfActionBulkUpdateRow : function(widgetPath){
    var segData=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.data;
    var selInd = widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices;
    if(selInd){
      var selRowInd=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices[0][1];
      var selectedIndex=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndex?widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndex[1]:null;
      widgetPath.lblFieldValue12.text = selRowInd.length === 1 ? this.AdminConsoleCommonUtils.getTruncatedString(segData[selRowInd[0]].lblDescription,40,40) : selRowInd.length+" Selected";
      widgetPath.lblFieldValue12.toolTip = selRowInd.length === 1 ? segData[selRowInd[0]].lblDescription : "";
      if(widgetPath.flxErrorField12.isVisible){
        widgetPath.flxErrorField12.isVisible=false;
        widgetPath.flxFieldValueContainer12.skin="sknFlxbgFFFFFFbdrD7D9E0rd3px";
      }
      if(widgetPath.productTypeFilterMenu.tbxSearchBox.text.length===0)
        widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices=selRowInd;
      else{//to update slected indices in info which would be used in retaining the selected indices in search
        var index = widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices.indexOf(selectedIndex);
        if (index > -1) 
          widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices.splice(index, 1);
        else
          widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices.push(selectedIndex);
      }
      var feature=this.bulkUpdateList[widgetPath.lstBoxFieldValue11.selectedKey];
      for(let i=0;i<feature.actions.length;i++){
        if(feature.actions[i].actionId===segData[selRowInd[0]].actionId)
          this.bulkUpdateList[widgetPath.lstBoxFieldValue11.selectedKey].actions[i].isChecked=(segData[selRowInd[0]].imgCheckBox===this.AdminConsoleCommonUtils.checkboxnormal)?false:true;
      }  
    } else{
      widgetPath.lblFieldValue12.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAnAction");
      widgetPath.lblFieldValue12.toolTip = "";
      widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices = [];
    }
        
    this.view.forceLayout();
  },
  /*
  * search for actions in the list in bulk update popup rows
  * @param: row widget path
  */
  searchActionsInBulkUpdate : function(widgetPath){
    if(widgetPath.productTypeFilterMenu.tbxSearchBox.text.trim().length>0){
      widgetPath.productTypeFilterMenu.flxClearSearchImage.setVisibility(true);
      var segData=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.data;
      var searchText=widgetPath.productTypeFilterMenu.tbxSearchBox.text;
      var actionName="";
      var selIndices=[];
      var selectedRowIndices = widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices;
      var actualData=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.data;
      var selectedActionsIds=[];
      for(let z=0;z<selectedRowIndices.length;z++)
        	selectedActionsIds.push(actualData[z].actionId);
      var filteredData=segData.filter(function(rec){
        actionName=rec.lblDescription.toLowerCase();
        if(actionName.indexOf(searchText)>=0)
          return rec;
      });
      if(filteredData.length===0){
        widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setVisibility(false);
        widgetPath.productTypeFilterMenu.flxNoResultFound.setVisibility(true);
      }else{
        for(let x=0;x<filteredData.length;x++){
          if(selectedActionsIds.includes(filteredData[x].actionId))
            selIndices.push(x);
        }
        widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setData(filteredData);
        widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices=[[0,selIndices]];
        widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setVisibility(true);
        widgetPath.productTypeFilterMenu.flxNoResultFound.setVisibility(false);
      }
    }else{
      var selInd = widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices;
      widgetPath.productTypeFilterMenu.flxNoResultFound.setVisibility(false);
      widgetPath.productTypeFilterMenu.flxClearSearchImage.setVisibility(false);
      var totalRecords=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.data;
      widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setData(totalRecords);
      widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices = [[0,selInd]];
    }
    this.view.forceLayout();
  },
  /*
  * clear search for actions in the list in bulk update popup rows
  * @param: row widget path
  */
  clearSearchActionBulkUpdate : function(widgetPath){
    widgetPath.productTypeFilterMenu.tbxSearchBox.text="";
    widgetPath.productTypeFilterMenu.flxClearSearchImage.setVisibility(false);
    widgetPath.productTypeFilterMenu.flxNoResultFound.setVisibility(false);
    var totalRecords=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.data;
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.setData(totalRecords);
    var selInd=widgetPath.productTypeFilterMenu.segStatusFilterDropdown.info.selectedIndices;
    widgetPath.productTypeFilterMenu.segStatusFilterDropdown.selectedRowIndices=[[0,selInd]];
    this.view.forceLayout();
  },
 /*
  * enroll - remove the new row added in bulk update for features
  * @param: widget to remove path
  */
  deleteAddNewFeatureRow : function(widgetPath, option, category){
    var delRowSelection = widgetPath.lstBoxFieldValue11.selectedKeyValue;
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.remove(this.view.bulkUpdateFeaturesLimitsPopup[widgetPath.id]);
    this.view.bulkUpdateFeaturesLimitsPopup.remove(this.view.bulkUpdateFeaturesLimitsPopup[widgetPath.id]);
    var addedRows = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    if(addedRows.length === 1){
      addedRows[0].flxDelete.isVisible = false;
    }
    this.updateExistingRowsListboxData({"id":""}, option, category);
    this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.setVisibility(true);
  },
  /*
  * enroll - reset the add rows on channge of radio button option in bulk update popup
  */
  resetAddedRows : function(){
    var flxChildren = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.removeAll();
    for(var i=0;i<flxChildren.length;i++){
      this.view.bulkUpdateFeaturesLimitsPopup.remove(this.view.bulkUpdateFeaturesLimitsPopup[flxChildren[i].id]);
    }
    var height = this.view.bulkUpdateFeaturesLimitsPopup.flxContractDetailsPopupContainer.frame.height - (70 + this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateListContainer.frame.y + 80);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateListContainer.height = height + "dp";
    
    var bulkUpdateOption = this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info.option;
    this.bulkUpdateListboxData = this.getListForListBox(bulkUpdateOption);
    var category = this.view.flxCreateContract.isVisible === true ? "contract" :"enroll";
    if(bulkUpdateOption === 1){
      this.addNewFeatureRowBulkUpdate(category);
    }else{
      this.addNewLimitRowBulkUpdate(category);
    }  
    this.view.forceLayout();
  },
  /*
  * enroll - update previous rows listbox data on addition of new row
  * @param: current row path,option9features/limits),category(enroll/contracts)
  */
  updateExistingRowsListboxData : function(currRowPath,option,category){
    var currRowData;
    var allRows = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    var updatedList = this.getUnselectedFeaturesList(option,category);
    for(var i=0;i<allRows.length;i++){
      if(currRowPath.id !== allRows[i].id){
        currRowData = [];
        currRowData.push(allRows[i].lstBoxFieldValue11.selectedKeyValue);
        var lstMasterData = currRowData.concat(updatedList);
        allRows[i].lstBoxFieldValue11.masterData = lstMasterData;
      }
    }
    if(updatedList.length === 0){
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.setVisibility(false);
    }
  },
  /*
  * enroll - get unselected features list to set it in remaining rows
  * @param: option(features:1,limits:2), catgory(enroll/contract)
  * @returns: unselected features array formated for listbox masterdata
  */
  getUnselectedFeaturesList: function(option, category) {
    var assignedData = [],
        allFeaturesId = [],diffList = [],commonList = [];
    var rowsList = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    //get all assigned feature id's
    if(option === 1){//features bulk update list
      for (var i = 0; i < rowsList.length; i++) {
        if (rowsList[i].lstBoxFieldValue11.selectedKey !== "select") assignedData.push(rowsList[i].lstBoxFieldValue11.selectedKey);
      }   
    }else{//limits bulk update list
      for (var i = 0; i < rowsList.length; i++) {
        if (rowsList[i].lstBoxFieldValue11.selectedKey !== "select"){
          if(rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems&&rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems.length===rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.data.length)
            assignedData.push(rowsList[i].lstBoxFieldValue11.selectedKey);
        }
      }
    }
     //all exsisting feature id's
    var allFeaturesList = category === "enroll" ? (option === 1 ? this.bulkUpdateAllFeaturesList : this.bulkUpdateAllFeaturesLimits) :
                                                   this.bulkUpdateAllFeaturesListContract;
    allFeaturesId = allFeaturesList.map(function(rec) {
      return rec.featureId;
    });
    //differentiate common and diff id's
    for (var j = 0; j < allFeaturesId.length; j++) {
      if (assignedData.contains(allFeaturesId[j])) {
        commonList.push(allFeaturesId[j]);
      } else {
        diffList.push(allFeaturesId[j]);
      }
    }
    var finalList = category === "enroll" ? this.getListForListBox(option, diffList) : this.getListForListBoxContracts(diffList);
    return finalList;
  },
  /* 
  * enroll - function to return the required features in listbox masterdata format
  * @param: unselected features id's list
  * @retrun: masterdata with given features id's
  */
  getListForListBox: function(option,data) {
    var self = this;
    var finalList = [];
    var selectOption = [["select", kony.i18n.getLocalizedString("i18n.contracts.selectAFeature")]];
    if(option ===1){
      for (var i = 0; i < self.bulkUpdateAllFeaturesList.length; i++) {
        var check = data ? data.contains(self.bulkUpdateAllFeaturesList[i].featureId) : (!finalList.contains(self.bulkUpdateAllFeaturesList[i].featureId));
        if(check)
          finalList.push([self.bulkUpdateAllFeaturesList[i].featureId,self.bulkUpdateAllFeaturesList[i].featureName]);
      }
    } else{
      var limitFeatures=[];
      var limitActions=[];
      var dataToSet=[];
      for(var a=0;a<self.bulkUpdateAllFeaturesLimits.length;a++){
        var actions = self.bulkUpdateAllFeaturesLimits[a].actions || self.bulkUpdateAllFeaturesLimits[a].permissions;
        if(actions.length>0){
          limitFeatures=JSON.parse(JSON.stringify(self.bulkUpdateAllFeaturesLimits[a]));
          limitActions = actions.filter(function(item) {
            return ((item.isAccountLevel === "true" || item.isAccountLevel === "1") && item.limits);
          });
          if(limitActions.length>0){
            limitFeatures.actions=limitActions;
            dataToSet.push(limitFeatures);
          }
        }
      }
      for (var i = 0; i < dataToSet.length; i++) {
        var check = data ? data.contains(self.bulkUpdateAllFeaturesLimits[i].featureId) : (!finalList.contains(self.bulkUpdateAllFeaturesLimits[i].featureId));
        if (check) {
          finalList.push([dataToSet[i].featureId,dataToSet[i].featureName]);
        }
      }
    }
    finalList = selectOption.concat(finalList);
    return finalList;
  },
   /*
  *  enroll - set ddata to radio buttons in bulk update popup
  * @param: opt(1: features,2:limits)
  */
  setRadioGroupData : function(opt){
    var radioBtnData=[];
    if(opt===1){
      this.view.bulkUpdateFeaturesLimitsPopup.lblRadioGroupTitle.text= kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.PermissionType");
      radioBtnData = [{src:this.AdminConsoleCommonUtils.radioSelected, value: kony.i18n.getLocalizedString("i18n.userwidgetmodel.ViewConfigureCSR.Enable"), selectedImg:this.AdminConsoleCommonUtils.radioSelected, unselectedImg: this.AdminConsoleCommonUtils.radioNotSelected},
                      {src:this.AdminConsoleCommonUtils.radioNotSelected, value: kony.i18n.getLocalizedString("i18n.users.disable"), selectedImg:this.AdminConsoleCommonUtils.radioSelected, unselectedImg: this.AdminConsoleCommonUtils.radioNotSelected}];
      this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.flxRadioButton1.width="100px";
      this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.flxRadioButton2.width="100px";
    }else{
      this.view.bulkUpdateFeaturesLimitsPopup.lblRadioGroupTitle.text= kony.i18n.getLocalizedString("i18n.frmMFAScenarios.Transaction_Type");
      radioBtnData = [{src: this.AdminConsoleCommonUtils.radioSelected, value:kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.PerTransaction"), selectedImg:this.AdminConsoleCommonUtils.radioSelected, unselectedImg: this.AdminConsoleCommonUtils.radioNotSelected},
                      {src:this.AdminConsoleCommonUtils.radioNotSelected, value:kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.DailyTransaction"), selectedImg: this.AdminConsoleCommonUtils.radioSelected, unselectedImg: this.AdminConsoleCommonUtils.radioNotSelected},
                      {src:this.AdminConsoleCommonUtils.radioNotSelected, value:kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.WeeklyTransaction"), selectedImg: this.AdminConsoleCommonUtils.radioSelected, unselectedImg: this.AdminConsoleCommonUtils.radioNotSelected}];
      this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.flxRadioButton1.width="150px";
      this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.flxRadioButton2.width="150px";
      this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.flxRadioButton3.width="150px";
    }
    this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.setData(radioBtnData);
    this.view.forceLayout();
  },
  /*
  *  enroll - get the selected radio button type value in bulk update popup
  */
  getSelectedType : function(option) {
    var radBtn = this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.imgRadioButton1.src;
    var radBtn1 = this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.imgRadioButton2.src;
    var radBtn2 = this.view.bulkUpdateFeaturesLimitsPopup.customRadioButtonGroup.imgRadioButton3.src;
    if(option === 1){
      if(radBtn === this.AdminConsoleCommonUtils.radioSelected) 
        return "enable";
      else
        return "disable";
    }else{
      if(radBtn === this.AdminConsoleCommonUtils.radioSelected) 
        return this.limitId.MAX_TRANSACTION_LIMIT;
      if( radBtn1 === this.AdminConsoleCommonUtils.radioSelected) 
        return this.limitId.DAILY_LIMIT;
      if(radBtn2 === this.AdminConsoleCommonUtils.radioSelected)
        return this.limitId.WEEKLY_LIMIT;
    }
  },
  /*
  * bulk update the feature/limits that have been selected in popup
  * @param: option(1/2)
  */
  updateFeatureLimitsBulkChanges : function(option){
    var rowsList = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    var featureId="";
    var actionIds=[];
    var isEnable=false;
    var bulkUpdateList=[];
    var typeValue=this.getSelectedType(option);
    var selAccId = [];
    var accSegData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    //get all selected accounts
    for(var i=0;i<accSegData.length ;i++){
      for(var j=0; j<accSegData[i][1].length; j++){
        if(accSegData[i][1][j].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxSelected)
          selAccId.push(accSegData[i][1][j].id)
      }
    }
    //get all assigned feature,action id's
    for (var i = 0; i < rowsList.length; i++) {
      if (rowsList[i].lstBoxFieldValue11.selectedKey !== "select")
        featureId=rowsList[i].lstBoxFieldValue11.selectedKey;
      actionIds=[];
      if(rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems){
        var selItems=rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems;
        for(let i=0;i<selItems.length;i++){
          actionIds.push(selItems[i].actionId);
        }
      }
      if(option=== 1){
        bulkUpdateList.push({"featureId":featureId,"actionIds":actionIds,"isEnabled":typeValue==="enable"?"true":"false"});
      }else{
        bulkUpdateList.push({"featureId":featureId,"actionIds":actionIds,"limitId":typeValue,
                             "limitVal1":rowsList[i].tbxValue21.text, "limitVal2":rowsList[i].tbxValue22.text});
      }
    }
    var isUpdate = option === 1 ? this.updateBulkFeaturesInEditUserObj(selAccId,bulkUpdateList) :
                                  this.updateBulkLimitsInEditUserObj(selAccId,bulkUpdateList);
    if(isUpdate){
      this.view.flxBulkUpdateFeaturesPopup.setVisibility(false);
      if(option === 1){
        this.toggleFeaturesAccountLevel();
        this.view.toastMessage.showToastMessage(kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.BulkPermissionsUpdateSuccess"), this);
      }
      else{
        this.toggleLimitsAccountLevel();
        this.view.toastMessage.showToastMessage(kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.BulkLimitsUpdateSuccess"), this);
      }
    }
    
    
  },
  /*
  * update the selected bulk features,actions in edit user obj
  * @param: selected account id array, bulupdate list 
  * @return: true
  */
  updateBulkFeaturesInEditUserObj : function(selAccId, bulkUpdateList){
    var count = 0;
    var custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currCustAccFeatures = editUserObj.accountMapFeatures;
    for(var i=0; i<selAccId.length ;i++){  
      //get features of the acc id
      var currSelAccObj = editUserObj.accountMapFeatures.get(selAccId[i]);
      var accountFeatures = JSON.parse(currSelAccObj.features);
      for(var m=0; m<accountFeatures.length; m++){
        for(var j=0; j<bulkUpdateList.length; j++){  
          //get the selected feature obj
          if(accountFeatures[m].featureId === bulkUpdateList[j].featureId){
            count =0;
            var currActions = accountFeatures[m].actions || accountFeatures[m].permissions;
            for(var l=0; l<currActions.length; l++){
              for(var k=0; k<bulkUpdateList[j].actionIds.length; k++){
                //update the selected actions
                if(currActions[l].actionId === bulkUpdateList[j].actionIds[k]){
                  if(bulkUpdateList[j].isEnabled === "true"){
                    currActions[l].isEnabled = "true";
                    count = count+1;
                    this.addAccountIdForAction(currActions[l].actionId, selAccId[i]);
                  }else{
                    currActions[l].isEnabled = "false";
                    this.removeAccountIdForAction(currActions[l].actionId, selAccId[i], 1);
                  }
                  break;
                }
              }
            }
            accountFeatures[m].isEnabled = count === 0 ? "false" : "true";
            break;
          }
        }
      }
      currSelAccObj.features = JSON.stringify(accountFeatures);
      editUserObj.accountMapFeatures.set(selAccId[i], currSelAccObj);
    }
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
    return true;
  },
  /*
  * update the selected bulk limit values in edit user obj
  * @param: selected account id array, bulupdate list 
  * @return: true
  */
  updateBulkLimitsInEditUserObj : function(selAccId, bulkUpdateList){
    var count = 0;
    var custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var currCustAccFeatures = editUserObj.accLevelLimits;
    for(var i=0; i<selAccId.length ;i++){  
      //get features of the acc id
      var currSelAccObj = editUserObj.accLevelLimits.get(selAccId[i]);
      var accountFeatures = JSON.parse(currSelAccObj.limits);
      for(var m=0; m<accountFeatures.length; m++){
        for(var j=0; j<bulkUpdateList.length; j++){  
          //get the selected feature obj
          if(accountFeatures[m].featureId === bulkUpdateList[j].featureId){
            count =0;
            var currActions = accountFeatures[m].actions || accountFeatures[m].permissions;
            for(var l=0; l<currActions.length; l++){
              for(var k=0; k<bulkUpdateList[j].actionIds.length; k++){
                //get the selected actions
                if(currActions[l].actionId === bulkUpdateList[j].actionIds[k]){
                  if(bulkUpdateList[j].limitId === this.limitId.MAX_TRANSACTION_LIMIT){
                    currActions[l].limits[this.limitId.PRE_APPROVED_TRANSACTION_LIMIT] = bulkUpdateList[j].limitVal1;
                    currActions[l].limits[this.limitId.AUTO_DENIED_TRANSACTION_LIMIT] = bulkUpdateList[j].limitVal2;
                    
                  }else if(bulkUpdateList[j].limitId === this.limitId.DAILY_LIMIT){
                   currActions[l].limits[this.limitId.PRE_APPROVED_DAILY_LIMIT] = bulkUpdateList[j].limitVal1;
                    currActions[l].limits[this.limitId.AUTO_DENIED_DAILY_LIMIT] = bulkUpdateList[j].limitVal2;

                  } else if(bulkUpdateList[j].limitId === this.limitId.WEEKLY_LIMIT){
                    currActions[l].limits[this.limitId.PRE_APPROVED_WEEKLY_LIMIT] = bulkUpdateList[j].limitVal1;
                    currActions[l].limits[this.limitId.AUTO_DENIED_WEEKLY_LIMIT] = bulkUpdateList[j].limitVal2;
                  }
                  break;
                }
              }
            }
            break;
          }
        }
      }
      currSelAccObj.limits = JSON.stringify(accountFeatures);
      editUserObj.accLevelLimits.set(selAccId[i], currSelAccObj);
    }
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
    return true;
  },
  /*
  * validation the selection in bulk update popup edit user
  */
  validateBulkSelectionEditUser : function(){
    var rowsList = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    var isValid=true;
    var selCount=0;
    for (var i = 0; i < rowsList.length; i++) {
      if (rowsList[i].lstBoxFieldValue11.selectedKey !== "select"){
        selCount=selCount+1;
        //validation for action selection
        if(rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems===null){
          isValid=false;
          rowsList[i].flxFieldValueContainer12.skin = "sknFlxCalendarError";
          rowsList[i].lblErrorMsg12.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAtleastOneAction");
          rowsList[i].flxErrorField12.setVisibility(true);
        }
        //validation for limits
        if(this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info.option ===2){
          if(rowsList[i].tbxValue21.text.trim().length===0){
            isValid=false;
            rowsList[i].lblErrorMsg21.text = kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Value_cannot_be_empty");
            rowsList[i].flxErrorField21.setVisibility(true);
            rowsList[i].flxValue21.skin = "sknFlxCalendarError";
          }
          if(rowsList[i].tbxValue22.text.trim().length===0){
            isValid=false;
            rowsList[i].lblErrorMsg.text = kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Value_cannot_be_empty");
            rowsList[i].flxErrorField22.setVisibility(true);
            rowsList[i].flxValue22.skin = "sknFlxCalendarError";
          }
          
        }
      }
    }
    //validation for feature selection
    if(selCount===0){
      isValid=false;
      rowsList[0].lstBoxFieldValue11.skin="sknLstBoxeb3017Bor3px";
      rowsList[0].lblErrorMsg11.text= kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAtleastOneFeature");
      rowsList[0].flxErrorField11.setVisibility(true);
    }
    this.view.forceLayout();
    return isValid;
  },
  /*
  * sort based on selected segment column
  * @param: column to sort, segment path, segment category
  */
  sortAndSetData : function(columnName,segmentPath,category){
    var segData = segmentPath.data;
    var secInd = segmentPath.selectedsectionindex;
    this.sortBy.column(columnName);
    if(category === 1){ //edit accounts screen
      segData[secInd][1] = segData[secInd][1].sort(this.sortBy.sortData);
      segData[secInd][0].lblIconSortAccName = this.determineSortIconForSeg(this.sortBy,"lblAccountNumber.text");
      segData[secInd][0].lblIconAccNameSort = this.determineSortIconForSeg(this.sortBy,"lblAccountName.text");
      segmentPath.setSectionAt(segData[secInd],secInd);
    } else if(category === 2){ //bulk update accounts list
      segData[secInd][1] = segData[secInd][1].sort(this.sortBy.sortData);
      segData[secInd][0].lblIconSortAccName = this.determineSortIconForSeg(this.sortBy,"lblAccountNumber.text");
      segData[secInd][0].lblIconAccNameSort = this.determineSortIconForSeg(this.sortBy,"lblAccountName.text");
      segmentPath.setSectionAt(segData[secInd],secInd);
    } else if(category === 3){ //customer search results 
      this.determineSortFontIcon(this.sortBy,"lblSearchSegHeaderCustId.text",this.view.lblIconCustIdSort);
      this.determineSortFontIcon(this.sortBy,"lblSearchSegHeaderCustName.text",this.view.lblIconCustNameSort);
      this.determineSortFontIcon(this.sortBy,"lblSearchSegHeaderEmail.text",this.view.lblIconCustEmailSort);
      segmentPath.setData(segData.sort(this.sortBy.sortData));
    } else if(category === 4){ //contracts account screen
      segData[secInd][1] = segData[secInd][1].sort(this.sortBy.sortData);
      segData[secInd][0].lblIconSortAccName = this.determineSortIconForSeg(this.sortBy,"lblAccountNumber");
      segData[secInd][0].lblIconAccNameSort = this.determineSortIconForSeg(this.sortBy,"lblAccountName");
      segmentPath.setSectionAt(segData[secInd],secInd);
    }   
    
  },
  /*
  * search for accounts based on name,id in bulk update screen
  */
  searchForAccountsInBulkUpdate : function(){
    var searchText = this.view.bulkUpdateFeaturesLimitsPopup.searchBoxScreen1.tbxSearchBox.text.trim();
    var searchResults = [];
    var actualData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.allData;
    var accountTypes = Object.keys(actualData);
    var filteredRows = [];
    for(var i=0;i<accountTypes.length;i++){
      var accountHeader = actualData[accountTypes[i]].sectionData;
      var accountRows = actualData[accountTypes[i]].rowData;
      if(searchText.length > 0){
        filteredRows =[];
        for(var j=0;j<accountRows.length;j++){
          if(accountRows[j].lblAccountNumber.text.indexOf(searchText) >= 0 ||
             accountRows[j].lblAccountName.text.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
            accountRows[j].flxContractEnrollAccountsEditRow.isVisible = true;
            filteredRows.push(accountRows[j]);
          }
        }
        if(filteredRows.length > 0){ // show the account section expanded if it contains rows
          accountHeader.lblIconToggleArrow.text = "\ue915"; //down-arrow
          accountHeader.lblIconToggleArrow.skin = "sknIcon00000014px";
          accountHeader.flxHeaderContainer.isVisible = true;
          accountHeader.flxAccountSectionCont.skin = "sknFlxBgF5F6F8BrD7D9E0rd3pxTopRound";
          searchResults.push([accountHeader,filteredRows]);
        }
      } else{
        searchResults.push([accountHeader,accountRows]);
      }
    }
    if(searchResults.length > 0){
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData(searchResults);
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setVisibility(true);
      this.view.bulkUpdateFeaturesLimitsPopup.lblNoResultsScreen1.setVisibility(false);
    } else{
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setVisibility(false);
      this.view.bulkUpdateFeaturesLimitsPopup.lblNoResultsScreen1.setVisibility(true);
      this.view.bulkUpdateFeaturesLimitsPopup.lblNoResultsScreen1.text = kony.i18n.getLocalizedString("i18n.frmPoliciesController.No_results_found") + "" + searchText;
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData([]);
    }
    this.view.forceLayout();
  },
  /*
  * show the account types filter in edit features/limits screens
  * @param: option for feature/limits - 1/2
  */
  showAccountTypesFilter : function(opt){
    var top = 150;
    if(opt === 1){
      top = this.view.flxEnrollEditFeaturesSearch.frame.y + this.view.flxEnrollEditFeatureFilter.frame.y +30;
    } else{
      top = this.view.flxEnrollEditLimitSearch.frame.y + this.view.flxEnrollEditLimitsFilter.frame.y +30;
    }
    this.view.customListBoxAccounts.flxSegmentList.setVisibility(false);
    this.view.flxAccountTypesFilter.top = top +"dp";
    this.view.flxAccountTypesFilter.setVisibility(true);
    
  },
  /*
  * add selected account tag in bulk update screen
  * @param: account type data to set to the tag
  */
  addAccountsTag : function(accountType){
    var self = this;
    var tagsCount=self.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.widgets().length;
    var newTextTag = self.view.bulkUpdateFeaturesLimitsPopup.flxSelectionTag.clone(tagsCount.toString());
    var lblname = tagsCount + "lblTagName";
    var imgname = tagsCount + "flxCross";
    var textToSet = accountType.accType + " ("+ accountType.count + ")";
    var flexWidth= this.AdminConsoleCommonUtils.getLabelWidth(textToSet,"12px Lato-Regular");
    self.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info.added.push(accountType);
    newTextTag[lblname].text = textToSet;
    newTextTag[lblname].toolTip = textToSet;
    newTextTag.isVisible = true;
    newTextTag.width=flexWidth+10+10+15+"px";//labelwidth+left padding+right padding+ cross image width
    var parentWidth= self.view.bulkUpdateFeaturesLimitsPopup.flxContractDetailsPopupContainer.frame.width - 40;
    var leftVal=20;
    var topVal=0;
    var lineCount=0;
    for(var a=tagsCount-1;a>=0;a--){
      var childWid = self.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.widgets();
      var i= childWid[a].id;
      leftVal=leftVal+(self.view.bulkUpdateFeaturesLimitsPopup[i].frame.width+15);
      if((leftVal+flexWidth+50)>parentWidth){
        leftVal=20;
        lineCount=lineCount+1;
      }
    }
    newTextTag.left=leftVal+"px";
    if(lineCount>1){
      newTextTag.top=(lineCount-1)*40+"px";
    }else{
      newTextTag.top=topVal+"px";
    }
    self.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.addAt(newTextTag, -1);
    newTextTag[imgname].onTouchStart = function () {
      self.removeTagEditUser(tagsCount);
    };
    self.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.setVisibility(true);
    this.view.forceLayout();
  },
  /*
   * function to remove a selected tag
   * @param : tags count
   */
  removeTagEditUser: function(tagsCount) {
    var removedAccType = this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info.added.splice(tagsCount,1);
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.removeAll();
    var addedCount=this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info.added.length;
    var addedCustomers=this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info.added;
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info.added=[];
    for (var x=0;x<addedCount;x++){
      this.addAccountsTag(addedCustomers[x]);
    }
    if(addedCount === 0){
      this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.setVisibility(false);
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen2.btnSave,true,false);
    }
    var segData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    //update the segment selection
    for(var i=0; i<segData.length; i++){
      if(removedAccType[0].accType === segData[i][0].lblFeatureName){
        segData[i][0].lblCountActions = "0";
        segData[i][0].imgSectionCheckbox.src = this.AdminConsoleCommonUtils.checkboxnormal;
        for(var j=0; j<segData[i][1].length; j++){
          segData[i][1][j].imgCheckbox.src = this.AdminConsoleCommonUtils.checkboxnormal;
        }
        this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setSectionAt(segData[i], i);
        break;
      }
    }
    this.view.forceLayout();
  },
  /*
  * hide account types list dropdown on hover out
  */
  onHoverHideSelectionDropdown : function(widget,context){
    if (context.eventType === constants.ONHOVER_MOUSE_ENTER||context.eventType === constants.ONHOVER_MOUSE_MOVE) {
    } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
      this.view.customListBoxAccounts.flxSegmentList.setVisibility(false);
    }
  },
  /*
  * validation to check if all rows are selected
  * @param: segment path, section/row level
  */
  validateCheckboxSelections : function(segmentPath, isSection){
    var isValid = true, count =0;
    var segData = segmentPath.data;
    var imgName = isSection === true ? "imgSectionCheckbox" : "imgCheckBox";
    for(var i=0;i<segData.length;i++){
      var data = isSection === true ? segData[i][0] : segData[i];
      if(data[imgName].src !== this.AdminConsoleCommonUtils.checkboxnormal){
        count = count +1;
      }
    }
    isValid = count === 0 ? false: true;
    return isValid;
  },
  /*
  * check for checkbox selection for all the cards of container
  * @param: segment path
  */
  validateSelectionForMultipleCards : function(segmentPath){
    var parentFlxCont = "";
    if(segmentPath.info.featuresType === 1)
      parentFlxCont = this.view.flxEnrollEditFeaturesList;
    else if(segmentPath.info.featuresType === 2)
      parentFlxCont = this.view.flxEnrollEditAccFeaturesList;
    else if(segmentPath.info.featuresType === 3)
      parentFlxCont = this.view.flxEnrollEditOtherFeaturesList;
    
    var childWid = parentFlxCont.widgets();
    var count =0, isValid = true;
    for(var i=0;i<childWid.length;i++){
      if(childWid[i].imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal)
        count = count + 1;
    }
    if(count === childWid.length)
      return false;
    else
      return true;
  },
  /*
  * set related customer list data to segment
  * @param: related customers list
  */
  setRelatedCustomerListData: function(relatedCust){
    var self =this;
    var widgetMap = {
      "custDetails":"custDetails",
      "flxLeftDetailsCont":"flxLeftDetailsCont",
      "imgCheckbox":"imgCheckbox",
      "flxCheckbox":"flxCheckbox",
      "lblContractName":"lblContractName",
      "lblHeading1":"lblHeading1",
      "lblData1":"lblData1",
      "lblHeading2":"lblHeading2",
      "lblData2":"lblData2",
      "btnRelation":"btnRelation",
      "flxRightDetailsCont":"flxRightDetailsCont",
      "flxRightActionCont":"flxRightActionCont",
      "flxRelatedCustomerList":"flxRelatedCustomerList"
    };
    var address="";
    if(relatedCust && relatedCust.length > 0){
      var segData = relatedCust.map(function(rec){
        if(rec.cityName||rec.country)
          address=self.AdminConsoleCommonUtils.getAddressText(rec.cityName,rec.country);
        else
          address="N/A";
        var details = {
          "id": rec.coreCustomerId,
          "name": rec.coreCustomerName,
          "industry": rec.industry,
          "email": rec.email,
          "phone":rec.phone,
          "address": address
        };
        return {
          "custDetails":rec,
          "flxRightDetailsCont": {"isVisible": true},
          "flxRightActionCont": {"isVisible": false},
          "imgCheckbox":{"src":"radio_selected.png"},
          "flxCheckbox":"flxCheckbox",
          "lblContractName": {"text":rec.coreCustomerName, "onClick": self.showCustomerDetailsPopup.bind(self,details)},
          "lblHeading1": kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.CUSTOMER_ID"),
          "lblData1": {"text":rec.coreCustomerId},
          "lblHeading2":kony.i18n.getLocalizedString("i18n.View.ADDRESS"),
          "lblData2": {"text":address},
          "btnRelation":{"text":rec.relationshipName, "isVisible":true},
          "template":"flxRelatedCustomerList"
        };
      });
      this.view.segRelatedCustomers.widgetDataMap = widgetMap;
      this.view.segRelatedCustomers.setData(segData);
      this.view.segRelatedCustomers.setVisibility(true);
      this.view.noResultsRelatedCustomers.setVisibility(false);
    } else{
      this.view.segRelatedCustomers.setVisibility(false);
      this.view.noResultsRelatedCustomers.lblNoRecordsAvailable.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.NoRelatedCustomersAvailable");
      this.view.noResultsRelatedCustomers.setVisibility(true);
    }
    this.view.forceLayout();
  },
  /*
  * call to fetch the contract associated with the selected related customer id
  */
  callSearchContracts : function(segmentPath,option){
    var selRowInd = segmentPath.selectedRowIndex[1];
    var rowData = segmentPath.data[selRowInd];
    var searchParam = {
      "contractId": "",
      "contractName": "",
      "coreCustomerId": rowData.custDetails.coreCustomerId,
      "coreCustomerName": "",
      "email": "",
      "phoneCountryCode": "",
      "phoneNumber": "",
      "country": "",
      "serviceDefinitionId": ""
    };
    this.presenter.searchContracts(searchParam, option);
  },
  /*
  * set the selected related customer details on click of next
  */
  setRelatedCustomerDetails : function(){
    var selRowInd = this.view.segRelatedCustomers.selectedRowIndex[1];
    var rowData = this.view.segRelatedCustomers.data[selRowInd];
    this.view.lblRelatedCustDetailsTitle.text = rowData.lblContractName.text
    this.view.detailsRelatedCust1.lblData1.text = rowData.lblData1.text;
    this.view.detailsRelatedCust1.lblData2.text = rowData.lblContractName.text;
    this.view.detailsRelatedCust1.lblData3.text = rowData.custDetails.email;
    this.view.detailsRelatedCust2.lblData1.text = rowData.custDetails.phone;
    this.view.detailsRelatedCust3.lblData1.text = rowData.lblData2.text;
    this.view.lblRelatedCustContractHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ContractExistsFor") +
                                                " "+rowData.lblContractName.text+" ("+rowData.lblData1.text+")";
  },
  /*
  * set contract card and segment data of the selected customer
  * @params: customer contract details
  */
  setSelectedRelatedCustContractCard : function(contractData){
    if(contractData.contractOfCustomer.length > 0){
      this.view.flxRelatedCustContractCont.setVisibility(true);
      this.view.flxRelatedCustDetailsNoContracts.setVisibility(false);
      this.view.relatedCustContractCard.setVisibility(true);
      this.view.relatedCustContractCard.flxCheckbox.setVisibility(false);
      var contract = contractData.contractOfCustomer[0].name + " ("+contractData.contractOfCustomer[0].id + ")";
      this.view.lblRelatedCustContractHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ContractExistsFor") + " "+ contract;
      this.view.relatedCustContractCard.lblContractName.text = contract;
      var data = {"customerId":this.view.detailsRelatedCust1.lblData1.text,
                  "contractData":contractData.contractOfCustomer[0]};
      this.setContractCardSegmentData(data, this.view.relatedCustContractCard.segRelatedContractsList,1,true);
    } else if(contractData.contractOfCustomer.length === 0 && contractData.contractType === "core"){
      this.view.flxRelatedCustContractCont.setVisibility(false);
      this.view.flxRelatedCustDetailsNoContracts.setVisibility(true);
      var custNameId = contractData.custSearchResponse.customers.length>0 ? contractData.custSearchResponse.customers[0].coreCustomerName + " ("+contractData.custSearchResponse.customers[0].coreCustomerId + ")" : "";
	  this.view.noResultsRelatedCustDetails.lblNoRecordsAvailable.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddNewContractFor") + " "+custNameId;
      this.view.noResultsRelatedCustDetails.btnAddRecord.text = "Create New Contract";
      this.view.noResultsRelatedCustDetails.btnAddRecord.setVisibility(true);
    }
    this.view.forceLayout();
  },
  /*
  * set data to the segment in contract card
  * @params: customer contract details obj, segment widget path
  * @param: option(related cust:1, other cust:2), showCheckbox(true/false)
  */
  setContractCardSegmentData : function(custContractData,segmenthPath, option,showCheckbox){
    var self = this;
    var widgetMap = {
      "custDetails":"custDetails",
      "serviceId":"serviceId",
      "contractId":"contractId",
      "contractName":"contractName",
      "imgCheckbox":"imgCheckbox",
      "flxCheckbox":"flxCheckbox",
      "flxSectionCheckbox":"flxSectionCheckbox",
      "imgSectionCheckbox":"imgSectionCheckbox",
      "lblContractName":"lblContractName",
      "lblContractId":"lblContractId",
      "lblContractAddress":"lblContractAddress",
      "lblSeperator":"lblSeperator",
      "flxEnrollCustomerContractList":"flxEnrollCustomerContractList"
    };
    var secData ={
      "flxEnrollCustomerContractList":{"height":"50dp"},
      "flxCheckbox":{"isVisible":false},
      "imgSectionCheckbox": {"src":this.AdminConsoleCommonUtils.checkboxnormal},
      "flxSectionCheckbox": {"isVisible": showCheckbox,
                             "onClick":this.onCheckAccountsCheckbox.bind(this,segmenthPath,true)},
      "lblContractName": {"text":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.CustomerName_UC"),
                          "skin":"sknlblLato696c7311px"},
      "lblContractId": {"text":kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.CUSTOMER_ID"),
                        "skin":"sknlblLato696c7311px"},
      "lblContractAddress": {"text":kony.i18n.getLocalizedString("i18n.View.ADDRESS"),
                             "skin":"sknlblLato696c7311px"},
      "lblSeperator": {"text":"-","skin":"sknLblSeparator696C73"},
      "template":"flxEnrollCustomerContractList"
    };
    var contractCust = custContractData.contractData.contractCustomers;
    var segRowsData = contractCust.map(function(rec){
      var address = rec.addressLine1;
      address = address + (rec.addressLine2 ? ", "+rec.addressLine2 : "");
      var isCustAdded = self.checkIfCustomerAlreadyAdded(rec.coreCustomerId);
      var custDetail = rec;
      rec["contractId"] = custContractData.contractData.id;
      rec["contractName"] = custContractData.contractData.name;
      rec["serviceId"] = custContractData.contractData.servicedefinitionId;
      return {
        "flxSectionCheckbox":{"isVisible":false},
        "imgCheckbox": {"src":(isCustAdded.isExists === true || custContractData.customerId === rec.coreCustomerId) ?
                               self.AdminConsoleCommonUtils.checkboxSelected : self.AdminConsoleCommonUtils.checkboxnormal},
        "flxCheckbox": {"isVisible": showCheckbox,
                        "onClick": self.onCheckAccountsCheckbox.bind(self,segmenthPath,false)},
        "lblContractName": {"text":rec.coreCustomerName},
        "lblContractId": {"text":rec.coreCustomerId},
        "lblContractAddress": address,
        "lblSeperator": {"text":"-","isVisble":true},
        "serviceId": custContractData.contractData.servicedefinitionId,
        "custDetails":rec,
        "template":"flxEnrollCustomerContractList"
      };
    });
    segRowsData[segRowsData.length -1].lblSeperator.isVisible = false;
    //update checkbox selection in header
    secData.imgSectionCheckbox.src = this.getHeaderCheckboxImage(segRowsData, true, true);
    segmenthPath.widgetDataMap = widgetMap;
    segmenthPath.setData([[secData,segRowsData]]);
    //enable/disable add button
    var enableFlag = secData.imgSectionCheckbox.src === self.AdminConsoleCommonUtils.checkboxnormal ? false : true;
    if(option === 1){
      this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsRelatedDetails.btnSave,true,enableFlag);
    }else{
      if(this.view.commonButtonsAddAnotherCust.btnSave.info.addCustCase === 1)
        this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsAddAnotherCust.btnSave,true,enableFlag);
    } 
    this.view.forceLayout();
  },
  /*
  * check if the customer id is already added in enroll list
  * @param: customer id to check
  * @returns: {"existingCust":custObj,"isExists":true/false}
  */
  checkIfCustomerAlreadyAdded : function(customerId){
    var segData = this.view.segEnrollCustList.data;
    var isExists = false,custObj = "";
    for(var i=0; i<segData.length; i++){
      if(segData[i].custId === customerId){
        custObj = segData[i];
        isExists = true;
        break;
      }
    }
    var existingCustObj = {
      "existingCust" :custObj,
      "isExists":isExists,
      "rowInd":i
    };
    return existingCustObj;
  },
  /*
  * call service for other customers search
  */
  callOtherCustomersSearch : function(){
    var customerStatus = this.view.lstBoxSearchParam23.selectedKey !== "select" ? this.view.lstBoxSearchParam23.selectedKey : "";
    var searchParam = {
      "id": this.view.textBoxEntry11.tbxEnterValue.text || "",
      "name":this.view.textBoxEntry12.tbxEnterValue.text || "",
      "email": this.view.textBoxEntry13.tbxEnterValue.text || "",
      "phoneNumber": this.view.contactNumber21.txtContactNumber.text || "",
      "phoneCountryCode": this.view.contactNumber21.txtISDCode.text || "",
      "dob":"",
      "customerStatus": customerStatus,
      "country": this.view.textBoxEntry31.tbxEnterValue.text || "",
      "town": this.view.textBoxEntry32.tbxEnterValue.text || "",
      "zipcode": this.view.textBoxEntry33.tbxEnterValue.text || ""
    };
    var isValid = this.validateCustSearchParamEntry();
    if(isValid){
      this.presenter.searchOtherCoreCustomers(searchParam,"enroll");
    } else{
      
    }
    
  },
  /*
  * check if atleast one search param is entered
  */
  validateCustSearchParamEntry : function(){
    var isValid = true;
    if(this.view.textBoxEntry11.tbxEnterValue.text.trim() === "" && this.view.textBoxEntry12.tbxEnterValue.text.trim() === "" &&
       this.view.textBoxEntry13.tbxEnterValue.text.trim() === "" && this.view.contactNumber21.txtContactNumber.text.trim() === "" &&
       this.view.contactNumber21.txtISDCode.text.trim() === "" && this.view.textBoxEntry31.tbxEnterValue.text.trim() === "" &&
       this.view.textBoxEntry32.tbxEnterValue.text.trim() === "" && this.view.textBoxEntry33.tbxEnterValue.text.trim() === "" &&
       this.view.lstBoxSearchParam23.selectedKey === "select" && this.view.customCalDob.value === ""){
      this.view.textBoxEntry11.flxEnterValue.skin ="sknFlxCalendarError";
      this.view.textBoxEntry12.flxEnterValue.skin = "sknFlxCalendarError";
      this.view.textBoxEntry13.flxEnterValue.skin = "sknFlxCalendarError";
      this.view.textBoxEntry31.flxEnterValue.skin = "sknFlxCalendarError";
      this.view.textBoxEntry32.flxEnterValue.skin ="sknFlxCalendarError";
      this.view.textBoxEntry33.flxEnterValue.skin = "sknFlxCalendarError";
      this.view.contactNumber21.txtISDCode.skin = "skntbxBordereb30173px";
      this.view.contactNumber21.txtContactNumber.skin = "skntbxBordereb30173px";
      this.view.lstBoxSearchParam23.skin = "sknlbxError";
      this.view.flxCalendarDob.skin = "sknFlxCalendarError";
      this.view.flxCustSearchErrorCont.setVisibility(true);
      this.showHideAdvanceSearchParam(true);
      isValid = false;
    }
    return isValid;
  },
  /*
  * clear the error for the search params in customer search screen
  */
  clearCustSearchValidation : function(){
    this.view.flxCustSearchErrorCont.setVisibility(false);
    this.view.textBoxEntry11.flxEnterValue.skin ="sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.textBoxEntry12.flxEnterValue.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.textBoxEntry13.flxEnterValue.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.textBoxEntry31.flxEnterValue.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.textBoxEntry32.flxEnterValue.skin ="sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.textBoxEntry33.flxEnterValue.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.contactNumber21.txtISDCode.skin = "skntxtbxDetails0bbf1235271384a";
    this.view.contactNumber21.txtContactNumber.skin = "skntxtbxDetails0bbf1235271384a";
    this.view.flxCalendarDob.skin = "sknFlxbgFFFFFFbdrD7D9E0rd3px";
    this.view.lstBoxSearchParam23.skin = "sknLbxborderd7d9e03pxradius";
  },
  /*
  * clear the search fields in other customer search screen
  */
  clearOtherCustSearchFields : function(){
    this.view.textBoxEntry11.tbxEnterValue.text = "";
    this.view.textBoxEntry12.tbxEnterValue.text = "";
    this.view.textBoxEntry13.tbxEnterValue.text = "";
    this.view.textBoxEntry31.tbxEnterValue.text = "";
    this.view.textBoxEntry32.tbxEnterValue.text = "";
    this.view.textBoxEntry33.tbxEnterValue.text = "";
    this.view.contactNumber21.txtContactNumber.text ="";
    this.view.contactNumber21.txtISDCode.text = "";
    this.view.lstBoxSearchParam23.selectedKey = "select";
    this.view.customCalDob.resetData = kony.i18n.getLocalizedString("i18n.frmLogsController.Select_Date");
    this.view.customCalDob.value = "";
    this.view.noResultsSearchCustomers.lblNoRecordsAvailable.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SearchCustomerToSeeContactExists");
  },
  /*
  * set results data to segment on search for other customers
  * @param: search results list of other customer
  */
  setSearchCustomerResultData : function(custList){
    var widgetMap = {
      "custDetails": "custDetails",
      "lblSearchSegHeaderCustId":"lblSearchSegHeaderCustId",
      "lblSearchSegHeaderCustName":"lblSearchSegHeaderCustName",
      "lblSearchSegHeaderEmail":"lblSearchSegHeaderEmail",
      "lblSearchSegHeaderPhoneNum":"lblSearchSegHeaderPhoneNum",
      "lblSeperator":"lblSeperator",
      "flxEnrollCustomerSearchResult":"flxEnrollCustomerSearchResult"
    };
    if(custList && custList.length > 1){
      var segData = custList.map(function(rec){
        return {
          "lblSearchSegHeaderCustId": {"text":rec.coreCustomerId},
          "lblSearchSegHeaderCustName": {"text": rec.coreCustomerName},
          "lblSearchSegHeaderEmail": {"text":rec.email},
          "lblSearchSegHeaderPhoneNum": {"text":rec.phone},
          "lblSeperator":"-",
          "custDetails": rec,
          "template":"flxEnrollCustomerSearchResult"
        };
      });
      this.sortBy = this.getObjectSorter("lblSearchSegHeaderCustId.text");
      this.sortBy.inAscendingOrder = true;
      this.view.segSearchResultsCust.widgetDataMap = widgetMap;
      var sortedData = segData.sort(this.sortBy.sortData);
      this.view.segSearchResultsCust.setData(sortedData);
      
      this.view.flxNoResultsContainer.setVisibility(false);
      this.view.flxSearchResultsForAddCust.setVisibility(true);
      this.view.lblSelectedSearchCriteria.text = kony.i18n.getLocalizedString("i18n.contracts.searchResults")+ " ("+sortedData.length + ")";
    } else{
      this.view.flxSearchResultsForAddCust.setVisibility(false);
      this.view.flxNoResultsContainer.setVisibility(true);
      this.view.noResultsSearchCustomers.lblNoRecordsAvailable.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.No_results_found");
      this.view.noResultsSearchCustomers.btnAddRecord.setVisibility(false);
    }
    
    this.view.forceLayout();
  },
  /*
  * fetch the contract details of the selectd customer
  * @param: segment widget path, option-1/2(relatedCust:1,otherCust:2)
  */
  fetchContractDetailsOfCustomer : function(segmentPath, option){
    var selRowInd = segmentPath.selectedRowIndex[1];
    var rowData = segmentPath.data[selRowInd];
    var custDetails = {"customers":[]};
    custDetails.customers.push(rowData.custDetails);
    this.presenter.getCoreCustomerContractDetails({"coreCustomerId":rowData.custDetails.coreCustomerId}, option, custDetails);
  },
  /*
  * set contracts data for the searched/selected single customer
  */
  setSelectedOtherCustContractCards : function(contractDetails,custDetails){
    this.view.addAdditionalCustContractList.setVisibility(true);
    this.view.flxCustomerContractsList.setVisibility(false);
    this.view.btnAddContract.setVisibility(false);
    this.view.addAdditionalCustContractList.flxCheckbox.setVisibility(false);
    
    if(contractDetails.length > 0){
      var contract = contractDetails[0].name + " ("+contractDetails[0].id + ")"
      this.view.lblContractListHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.ContractExistsFor") + " "+ contract;
      this.view.addAdditionalCustContractList.lblContractName.text = contract;
      var contractData = {"customerId":custDetails.id,
                          "contractData":contractDetails[0]}
      this.setContractCardSegmentData(contractData,this.view.addAdditionalCustContractList.segRelatedContractsList, 2, true);
    } 
    this.view.forceLayout();
  },
  /*
  * set the related contracts data for the searched customer without direct contracts
  * @param: related contracts list, searched customer response
  */
  setSearchedCustRelatedContractCards : function(contract,searchCustDetails){
    this.view.addAdditionalCustContractList.setVisibility(false);
    this.view.flxCustomerContractsList.setVisibility(true);
    this.view.flxCustomerContractsList.removeAll();
    this.view.lblContractListHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.RelatedContracts")+ " ("+ contract.length +")";
    var compWidth = this.view.flxAddAnotherCustScreen.frame.width -40;
    for (var i = 0; i < contract.length; i++) {
      var num = i>10 ? i : "0"+i;
      var customerToAdd = new com.adminConsole.enrollCustomer.contractsList({
        "id": "customerContract" +num,
        "isVisible": true,
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "top": "15px",
        "left":"20dp",
        "width": compWidth
      }, {}, {});
      customerToAdd.segRelatedContractsList.top = "0dp";
      customerToAdd.flxCustomersListHeader.isVisible = false;
      customerToAdd.flxCheckbox.isVisible = true;
      customerToAdd.imgCheckbox.src = (i===0) ? this.AdminConsoleCommonUtils.radioSelected : this.AdminConsoleCommonUtils.radioNotSelected;
      customerToAdd.toggleCollapseArrow((i===0 ? true :false));
      customerToAdd.flxCheckbox.onClick = this.onSelectRelatedContractCard.bind(this,customerToAdd, this.view.flxCustomerContractsList);
      customerToAdd.flxArrow.onClick = this.toggleCardForContracts.bind(this,customerToAdd, this.view.flxCustomerContractsList);
      var contractTitle = contract[i].name + " (" + contract[i].id +")";
      customerToAdd.lblContractName.text = contractTitle;
      customerToAdd.info = {"contracts": contract[i], "searchCustDetails" : searchCustDetails};
      var data = {
        "customerId": this.view.detailsRelatedCust1.lblData1.text,
        "contractData": contract[i]
      };
      this.view.flxCustomerContractsList.add(customerToAdd);
      this.setContractCardSegmentData(data,customerToAdd.segRelatedContractsList, 2, false);
    }
    this.view.forceLayout();

  },
  /*
  * expand/collapse selected card listing container visibility for contract
  * @param: contract card widget path, path of all cards container flex
  */
  toggleCardForContracts : function(cardWidget,parentFlexCont){
    var listArr = parentFlexCont.widgets();
    for(var i=0; i<listArr.length; i++){
      if(listArr[i].id === cardWidget.id){
        var visibilityCheck = cardWidget.flxBottomContainer.isVisible;
        cardWidget.toggleCollapseArrow(!visibilityCheck);
      }
      else{
        this.view[listArr[i].id].toggleCollapseArrow(false);
      }
    }
  },
  /*
  * on selecting any related contract from the list
  * @param: crelated contract card path, path of all cards container flex
  */
  onSelectRelatedContractCard : function(cardWidget, parentFlexCont){
    var listArr = parentFlexCont.widgets();
    for(var i=0; i< listArr.length; i++){
      if(listArr[i].id === cardWidget.id){
        listArr[i].imgCheckbox.src = this.AdminConsoleCommonUtils.radioSelected;
        this.toggleCardForContracts(cardWidget, parentFlexCont);
      } else{
        listArr[i].imgCheckbox.src = this.AdminConsoleCommonUtils.radioNotSelected;
      }
    } 
  },
  /*
  * perform different actions on click of add based on selected customer/contract
  */
  onClickToAddSearchCustomers : function(){
    // contract exists for the customer
    if(this.view.commonButtonsAddAnotherCust.btnSave.info.addCustCase === 1){
      this.addNewCustomerToEnroll(this.view.addAdditionalCustContractList.segRelatedContractsList);
      this.showEnrollCustomer();
    } // realted contract of the customer
    else if(this.view.commonButtonsAddAnotherCust.btnSave.info.addCustCase === 2){
      this.showEditContractConfirmationPopup();
    }
    else {

    }
  },
  /*
  * fetch the data required for edit user access of each customer
  */
  fetchEditUserAccessDetails: function(){
    var self=this;
    var enrollCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var serviceId = enrollCustData.lstBoxService.selectedKey;
    var roleId = enrollCustData.lstBoxRole.selectedKey;
    var custId = [enrollCustData.custId];
    var inputParam = {"coreCustomerId": custId,
                      "serviceDefinitionId": serviceId,
                      "roleId":roleId};
    if(this.prevRole[custId].key==="SELECT"){
      this.prevRole[custId]={"key":enrollCustData.lstBoxRole.selectedKey,"value":enrollCustData.lstBoxRole.selectedkeyvalue[1]};
      if(enrollCustData.custDetails.contractId === ""){
        this.presenter.fetchAccountsServiceRoleFeatures(inputParam);
      } else{
        var arrList = [{"coreCustomerId":custId[0],
                        "serviceDefinitionId":serviceId,
                        "roleId":roleId}];
        inputParam = {"coreCustomerId":custId,
                      "contractId": enrollCustData.custDetails.contractId,
                      "coreCustomerRoleIdList": JSON.stringify(arrList)};
        this.presenter.fetchAccountsCustomerRoleFeatures(inputParam);
      }
    }else{
      self.view.popUpDeactivate.lblPopUpMainMessage.text = kony.i18n.getLocalizedString("i18n.frmCompanies.changeRoleMsg1")+enrollCustData.lstBoxRole.selectedkeyvalue[1];
      self.view.popUpDeactivate.rtxPopUpDisclaimer.text = kony.i18n.getLocalizedString("i18n.frmCompanies.changeRoleMsg2")+" \""+self.prevRole[enrollCustData.lblCustomerId.text].value+"\" to \""+enrollCustData.lstBoxRole.selectedkeyvalue[1]+kony.i18n.getLocalizedString("i18n.frmCompanies.changeRoleMsg3")+" \""+enrollCustData.lblCustomerName.text+"("+enrollCustData.lblCustomerId.text+") "+kony.i18n.getLocalizedString("i18n.frmCompanies.changeRoleMsg4");
      self.view.popUpDeactivate.btnPopUpDelete.text = kony.i18n.getLocalizedString("i18n.frmCSRController.Assign")+" \""+enrollCustData.lstBoxRole.selectedkeyvalue[1]+"\" "+ kony.i18n.getLocalizedString("i18n.frmPermissions.btnRoles");
      self.view.popUpDeactivate.btnPopUpCancel.text=kony.i18n.getLocalizedString("i18n.frmCustomers.CANCEL");
      self.view.popUpDeactivate.flxPopUpTopColor.skin="sknFlxTopColor4A77A0";
      self.view.flxEnrollCustConfirmationPopup.setVisibility(true);
      self.view.forceLayout();
      self.view.popUpDeactivate.btnPopUpDelete.onClick = function(){
        self.prevRole[enrollCustData.lblCustomerId.text]={"key":enrollCustData.lstBoxRole.selectedKey,"value":enrollCustData.lstBoxRole.selectedkeyvalue[1]};
        self.view.flxEnrollCustConfirmationPopup.setVisibility(false);
        if(enrollCustData.custDetails.contractId === ""){
          self.presenter.fetchAccountsServiceRoleFeatures(inputParam);
        } else{
          var arrList = [{"coreCustomerId":custId[0],
                          "serviceDefinitionId":serviceId,
                          "roleId":roleId}];
          inputParam = {"coreCustomerId":custId,
                        "contractId": enrollCustData.custDetails.contractId,
                        "coreCustomerRoleIdList": JSON.stringify(arrList)};
          self.presenter.fetchAccountsCustomerRoleFeatures(inputParam);
        }
        self.view.forceLayout();
      };
      this.view.popUpDeactivate.btnPopUpCancel.onClick = function(){
        enrollCustData.lstBoxRole.selectedKey=self.prevRole[enrollCustData.lblCustomerId.text].key;
        enrollCustData.lstBoxRole.selectedkey=self.prevRole[enrollCustData.lblCustomerId.text].key;
        self.view.flxEnrollCustConfirmationPopup.setVisibility(false);
        self.view.segEnrollCustList.setDataAt(enrollCustData,self.enrollSegRowInd);
        self.view.forceLayout();
      };
    }
  },
  /*
  * fetch the data required for creating temporary contract payload
  */
  fetchCreateContractDetails: function(){
    var enrollCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var serviceId = enrollCustData.lstBoxService.selectedKey;
    var roleId = enrollCustData.lstBoxService.selectedKey;
    var custId = [enrollCustData.custId];
    var inputParam = {"coreCustomerId": custId,
                      "serviceDefinitionId": serviceId};
    if(enrollCustData.flxPrimary.isVisible === true){
      this.presenter.fetchAccountsServiceFeatures(inputParam);
    }
    
  },
  /*
  * form getContractDetails response structure
  * @param: contract related account, features details
  * @return: getContractDetails payload
  */
  constructGetContractDetailsPayload : function(createContractDetails){
    var features = createContractDetails.features || [];
    var limits = createContractDetails.limits || [];
    var custInfo = createContractDetails.customerDetails;
    var accounts = createContractDetails.accounts || [];
    var assignedAcc =[], assignedFeatures =[],custRecordData;
    var enrollCust = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    for(let i=0;i<limits.length;i++){
      for(let j=0;j<features.length;j++){
        if(features[j].featureId===limits[i].featureId){
          features[j]=this.getCombinedFeature(features[j],limits[i]);
        }
      }
    }
    //to get bussiness type from search result records param
    for(var a=0; a< this.enrollCustomerRecordData.length; a++){
      var custId = custInfo.Customer_id || custInfo.primaryCustomerId;
      var currCust = this.enrollCustomerRecordData[a].Customer_id || this.enrollCustomerRecordData[a].primaryCustomerId;
      if(currCust === custId){
        custRecordData = this.enrollCustomerRecordData[a];
      }
    }
    var phnNum = custInfo.PrimaryPhoneNumber ? custInfo.PrimaryPhoneNumber.split("-") : [];
    var isd = phnNum.length === 2 ? 
        (phnNum[0].indexOf("+") >= 0 ? phnNum[0] : "+"+phnNum[0] ): "";
    var communication =[{
      "phoneNumber": phnNum.length === 2 ? phnNum[1] : (phnNum.length === 1 ? phnNum[0] : ""),
      "phoneCountryCode": isd,
      "email":custInfo.PrimaryEmailAddress || "",
      
    }];
    var currCustContact = this.presenter.getCurrentCustomerContactInfo();
    var addrInfo = currCustContact.Addresses && currCustContact.Addresses.length > 0 ?currCustContact.Addresses[0]:"";
    var address = [{
      "country":addrInfo ? addrInfo.CountryName : "",
      "cityName": addrInfo ? addrInfo.CityName : "",
      "state": addrInfo ? addrInfo.RegionName : "",
      "zipCode": addrInfo ? addrInfo.ZipCode : "",
      "addressLine1":addrInfo ? addrInfo.AddressLine1 : "",
      "addressLine2": addrInfo ? addrInfo.AddressLine2 : ""
    }];
    var contractCustomers =[{
      "isPrimary": "true",
      "isBusiness": custInfo.isBusiness ? custInfo.isBusiness : (custRecordData ? custRecordData.isBusiness : ""),
      "coreCustomerId": custInfo.Customer_id || custInfo.primaryCustomerId,
      "coreCustomerName": custInfo.Name,
      "sectorId": custInfo.sectorId,
      "accounts":accounts,
      "customerAccounts":accounts
    }];
    // form getContractDEtails service structure for temp contract edit
    var contractDetails = {
      "contractId":"",
      "contractName": custInfo.Name,
      "serviceDefinitionName": this.view.segEnrollCustList.data[0].lstBoxService.selectedKeyValue[1],
      "serviceDefinitionId":this.view.segEnrollCustList.data[0].lstBoxService.selectedKeyValue[0],
      "faxId":"",
      "communication": communication ,
      "address": address,
      "contractCustomers": contractCustomers
    };
    //create contractFeaturesActions service response structure for temp contract edit
    var accountFeatures = {
      "features":[{"isPrimary": "true",
                   "coreCustomerId": custInfo.Customer_id || custInfo.primaryCustomerId,
                   "coreCustomerName": custInfo.Name,
                   "contractCustomerFeatures": features}],
      "limits":[{"isPrimary": "true",
                   "coreCustomerId": custInfo.Customer_id || custInfo.primaryCustomerId,
                   "coreCustomerName": custInfo.Name,
                   "contractCustomerLimits": limits}]
    };
    this.bulkUpdateAllFeaturesListContract=JSON.parse(JSON.stringify(features));//used for contract bulk update popup data
    this.completeContractDetails.customercontext = {};
    this.completeContractDetails.contractDetails = contractDetails;
    this.completeContractDetails.accountsFeatures = accountFeatures;
    this.completeContractDetails.contractCustomers = [enrollCust.custDetails];
    this.createTempContractPayload();
    
  },
   /*
  * form payload to create a temp contract
  * @return: create contract payload
  */
  createTempContractPayload : function(){
	var self =this;
    var features = this.completeContractDetails.accountsFeatures.features[0].contractCustomerFeatures || [];
    var limits = this.completeContractDetails.accountsFeatures.limits[0].contractCustomerLimits || [];
    var contractInfo = this.completeContractDetails.contractDetails;
    var accounts = contractInfo.contractCustomers[0] ? contractInfo.contractCustomers[0].accounts : [];
    var assignedAcc =[], assignedFeatures =[];
    
    for(let i=0;i<limits.length;i++){
      for(let j=0;j<features.length;j++){
        if(features[j].featureId===limits[i].featureId){
          features[j]=this.getCombinedFeature(features[j],limits[i]);
        }
      }
    }
    assignedFeatures = features.map(function(feature){
      var actions =[];
      actions = feature.actions.map(function(action){
        var actionJson = {
          "actionId": action.actionId,
          "actionName": action.actionName,
          "actionDescription": action.actionDescription,
          "isAllowed":"true",
          "type": action.type ? action.type : self.AdminConsoleCommonUtils.constantConfig.NON_MONETARY,
          "actionStatus": action.actionStatus || ""
        };
        if(action.limits)
          actionJson["limits"] = action.limits;
        return actionJson;
      });
      return {
        "featureId": feature.featureId,
        "featureName": feature.featureName,
        "featureDescription": feature.featureDescription,
        "featureStatus":feature.featureStatus || "",
		"type": feature.type ? feature.type : self.AdminConsoleCommonUtils.constantConfig.NON_MONETARY,
        "actions": actions
      };
    });
    assignedAcc = accounts.map(function(rec){
      return {
			"accountId": rec.accountNumber || rec.accountId,
			"accountType": rec.accountType,
			"accountName": rec.accountName,
			"typeId": rec.typeId || "",
			"ownerType": rec.ownerType,
            "isAssociated":"true",// rec.isAssociated
            "accountHolderName": rec.accountHolderName,
            "accountStatus": rec.accountStatus,
        	"arrangementId": rec.arrangementId
		}
    });
    var contractCustomers =[{
      "isPrimary": contractInfo.contractCustomers[0].isPrimary,
      "isBusiness": contractInfo.contractCustomers[0].isBusiness,
      "sectorId":contractInfo.contractCustomers[0].sectorId,
      "coreCustomerId": contractInfo.contractCustomers[0].coreCustomerId,
      "coreCustomerName": contractInfo.contractCustomers[0].coreCustomerName,
      "accounts":assignedAcc,
      "features": assignedFeatures
    }];

    var communication =contractInfo.communication ? contractInfo.communication : [];
    var addrInfo = contractInfo.address || [];
    var createContractPayload = {
      "contractName": contractInfo.contractName,
      "serviceDefinitionName": contractInfo.serviceDefinitionName,
      "serviceDefinitionId": contractInfo.serviceDefinitionId,
      "faxId": contractInfo.faxId || "",
      "communication": JSON.stringify(communication) ,
      "address": JSON.stringify(addrInfo),
      "contractCustomers": JSON.stringify(contractCustomers)
    };
    this.presenter.setCreateContractPayload(createContractPayload);
  },
  /*
  * show customer's details in the popup
  * @param: customer details json
  */
  showCustomerDetailsPopup : function(details){
    this.view.flxContractDetailsPopup.setVisibility(true);
    this.view.contractDetailsPopup.showBackButton(false);
    this.view.contractDetailsPopup.setDataForPopup(details);
    this.view.forceLayout();
    
  },
  /*
  * create enroll customer request param
  */
  createEnrollCustomerRequestParam : function(){
    var enrollCustReqParam = {
      "userDetails":"",
      "companyList":[],
      "accountLevelPermissions":[],
      "globalLevelPermissions":[],
      "transactionLimits":[],
      "signatoryGroups":[]
    };
    var enrollSegData = this.view.segEnrollCustList.data;
    var customerDetails = this.presenter.getCurrentCustomerDetails();
    var companyList = [], limits = [];
    var phnNum = customerDetails.PrimaryPhoneNumber ? customerDetails.PrimaryPhoneNumber.split("-") : [];
    var isd = phnNum.length === 2 ? 
        (phnNum[0].indexOf("+") >= 0 ? phnNum[0] : "+"+phnNum[0]): "";
    var cust = {
      "firstName": customerDetails.FirstName || "",
      "lastName": customerDetails.LastName || "",
      "middleName": customerDetails.MiddleName || "",
      "phoneNumber": phnNum.length === 2 ? phnNum[1] : (phnNum.length === 1 ? phnNum[0] : ""),
      "phoneCountryCode": isd,
      "dob": customerDetails.DateOfBirth,
      "drivingLicenseNumber": customerDetails.DrivingLicenseNumber || "",
      "coreCustomerId": customerDetails.Customer_id || customerDetails.primaryCustomerId,
      "email": customerDetails.PrimaryEmailAddress || "",
      "isEnrolled": false
    };
    enrollCustReqParam.companyList = JSON.stringify(this.getEnrollCustCompanyList());
    var features = this.getEnrollCustFeaturesList();
    enrollCustReqParam.userDetails = JSON.stringify(cust);
    enrollCustReqParam.accountLevelPermissions = JSON.stringify(features.accountLevelPermissions);
    enrollCustReqParam.globalLevelPermissions = JSON.stringify(features.globalLevelPermissions);
    var contractDetails = this.appendContractDetailsRequired();
    if(contractDetails){
      enrollCustReqParam["contractDetails"] = JSON.stringify(contractDetails);
      var updatedUserDetails = this.updateEnrollUserDetailsFromContract(cust, contractDetails);
      var updatedFeaturesJson = this.updateFeatureActionsJsonObj(contractDetails);
      enrollCustReqParam.userDetails = JSON.stringify(updatedUserDetails);
	  enrollCustReqParam.contractCustomers = JSON.stringify(updatedFeaturesJson);
    }
      
    limits = this.getEnrollCustLimitsList();
    var signGroups=this.getEnrollCustSignGroups();
    enrollCustReqParam.transactionLimits = JSON.stringify(limits);
    enrollCustReqParam.signatoryGroups = JSON.stringify(signGroups);
    this.callEnrollEditCustomerService(enrollCustReqParam);
    
  },
  /*
  * call the required enroll/edit user service based on operation
  * @param: input request param for service
  */
  callEnrollEditCustomerService : function(enrollCustReqParam){
//     //to edit suspended user from OLB application
//     if(this.enrollAction === this.actionConfig.create&&this.view.commonButtons.btnSave.text === kony.i18n.getLocalizedString("i18n.frmOutageMessageController.UPDATE")){
//       this.presenter.editInfinityUser(enrollCustReqParam);
//     }else 
      if(this.enrollAction === this.actionConfig.create){
      this.presenter.enrollCustomer(enrollCustReqParam);
    } else if(this.enrollAction === this.actionConfig.edit){
      //remove uneccessary fields
      var userDetails = JSON.parse(enrollCustReqParam.userDetails);
      userDetails["id"] = this.customerToEnrollInfo.Customer_id;
      delete userDetails.coreCustomerId;
      delete userDetails.isEnrolled;
      enrollCustReqParam.userDetails = JSON.stringify(userDetails);
      enrollCustReqParam["removedCompanies"] = JSON.stringify(Object.values(this.removedEnrollCustomers));
      this.presenter.editInfinityUser(enrollCustReqParam);
    } else if(this.enrollAction === this.actionConfig.editUser){
      var userDetails = JSON.parse(enrollCustReqParam.userDetails);
      userDetails["id"] = this.customerToEnrollInfo.Customer_id;
      delete userDetails.coreCustomerId;
      delete userDetails.isEnrolled;
      enrollCustReqParam.userDetails = JSON.stringify(userDetails);
      enrollCustReqParam["removedCompanies"]  = JSON.stringify([]);
      this.presenter.editInfinityUser(enrollCustReqParam);
    }
  },
  /*
  * append the temporary contract details for own customer
  */
  appendContractDetailsRequired : function(){
    var enrollSegData = this.view.segEnrollCustList.data;
    var contractDetails ="",accList = [];
    for(var i=0; i<enrollSegData.length; i++){
      if(enrollSegData[i].custDetails.contractId === ""){
        contractDetails = this.presenter.getCreateContractPayload();
        var contractCust = JSON.parse(contractDetails.contractCustomers);
        //filter only selected account
        for(var a=0; a<contractCust.length; a++){
		  accList = [];
          for(var b=0; b<contractCust[a].accounts.length; b++){
            if(contractCust[a].accounts[b].isEnabled){
              if(contractCust[a].accounts[b].isEnabled === "true")
                accList.push(contractCust[a].accounts[b]);
            } else{
              accList.push(contractCust[a].accounts[b]);
            }
          }
          contractCust[a].accounts = accList;
        }
        contractDetails.contractCustomers = JSON.stringify(contractCust);
        break;
      }
    }
    return contractDetails;
  },
  /*
  * update enrolling user details from temp contract if edited
  * @param: user details, temp contract details
  * @return: updated user details
  */
  updateEnrollUserDetailsFromContract : function(userDetails, contractDetails){
    var customerDetails = this.presenter.getCurrentCustomerDetails();
    var enrollUserId = customerDetails.Customer_id || customerDetails.primaryCustomerId;
    var contractCust = JSON.parse(contractDetails.contractCustomers);
    for(var i=0; i< contractCust.length; i++){
      //if the primary user is the primary customer in the contract
      if(contractCust[i].coreCustomerId === enrollUserId && 
        contractCust[i].isPrimary === "true"){
        var communication = JSON.parse(contractDetails.communication);
        userDetails.phoneNumber = communication[0] ? (communication[0].phoneNumber !== "" ? communication[0].phoneNumber : userDetails.phoneNumber) :
                                  userDetails.phoneNumber;
        userDetails.phoneCountryCode = communication[0] ? (communication[0].phoneCountryCode !== "" ? communication[0].phoneCountryCode : userDetails.phoneCountryCode ) :
                                       userDetails.phoneCountryCode;
        userDetails.email = communication[0] ? (communication[0].email !== "" ? communication[0].email : userDetails.email) : userDetails.email;
        break;
      }
    }
    return userDetails;
  },
  /*
  * update features/actions json by removing type field
  * @param: temp contract details
  * @return: updated contract customers array
  */
  updateFeatureActionsJsonObj : function(tempContractDetails){
    var contractCust = JSON.parse(tempContractDetails.contractCustomers);
    for(var i=0; i<contractCust.length; i++){
      var features = contractCust[i].features;
      for(var j=0; j<features.length; j++){
        delete contractCust[i].features[j].type;
        delete contractCust[i].features[j].featureStatus;
        var actions = features[j].actions;
        for(var k=0; k<actions.length; k++){
          delete contractCust[i].features[j].actions[k].type;
          delete contractCust[i].features[j].actions[k].actionStatus;
        }
      }
    }
    return contractCust;
  },
  /*
  * form the company list payload for enroll customer request param
  * @return : company related info,accounts obj 
  */
  getEnrollCustCompanyList : function(){
    var companyList = [];
    var enrollCustAccountsFeatures = this.presenter.getAccountsFeaturesForEnrollCust();
    var enrollSegData = this.view.segEnrollCustList.data;
    for(var i=0; i<enrollSegData.length; i++){
      var companyObj = {"companyName": enrollSegData[i].lblCustomerName.text,
                        "contractId": enrollSegData[i].custDetails.contractId === "" ? "" : enrollSegData[i].custDetails.contractId,
                        "contractName": enrollSegData[i].custDetails.contractId === "" ? "" : enrollSegData[i].custDetails.contractName,
                        "cif": enrollSegData[i].custId,
                        "isPrimary": enrollSegData[i].flxPrimary.isVisible === true ? "true" : "false",
                        "serviceDefinition": enrollSegData[i].lstBoxService.selectedKey,
                        "roleId": enrollSegData[i].lstBoxRole.selectedKey,
                        "autoSyncAccounts":enrollSegData[i].custDetails.autoSyncAccounts,
                        "accounts":[],
                       "excludedAccounts":[]};
      var accListMap = enrollCustAccountsFeatures[enrollSegData[i].custId].accounts;
      accListMap.forEach(function(accObj,key){
        if(accObj.isEnabled==="true"){
        companyObj.accounts.push({
          "accountName": accObj.accountName,
          "accountId": accObj.accountNumber,
          "accountType": accObj.accountType,
          "isEnabled": accObj.isEnabled
        });
        }else{
          companyObj.excludedAccounts.push({
          "accountName": accObj.accountName,
          "accountId": accObj.accountNumber,
          "accountType": accObj.accountType
        });
        }
      });
      companyList.push(companyObj);
    }
    return companyList;
  },
  /*
  * form the company list payload for enroll customer request param
  * @returns: account level, global level featurse actions
  */
  getEnrollCustFeaturesList : function(){
    var self =this;
    var accountLevelPermissions = [], globalLevelPermissions = [];
    var enrollCustAccountsFeatures = this.presenter.getAccountsFeaturesForEnrollCust();
    
    var enrollSegData = this.view.segEnrollCustList.data;
    for(var i=0; i<enrollSegData.length; i++){
      var accFeaturesObj = {"companyName": enrollSegData[i].lblCustomerName.text,
                            "cif": enrollSegData[i].custId,
                            "accounts":[]};
      var accListMap = enrollCustAccountsFeatures[enrollSegData[i].custId].accounts;
      var allAccFeaturesArr = enrollCustAccountsFeatures[enrollSegData[i].custId].accountMapFeatures;
      var allOtherFeaturesArr = enrollCustAccountsFeatures[enrollSegData[i].custId].nonAccLevelFeatures;
      //map features and actions for enroll payload format
      var otherLevelFeatures = this.mapFeaturesActionsForEnrollPayload(allOtherFeaturesArr);
      //append features for each account
      accListMap.forEach(function(accObj,key){
        var currAccFeatures = JSON.parse(allAccFeaturesArr.get(accObj.accountNumber).features);
        if(accObj.isEnabled === "true"){
          accFeaturesObj.accounts.push({
            "accountName": accObj.accountName,
            "accountId": accObj.accountNumber,
            "accountType": accObj.accountType,
            "featurePermissions": self.mapFeaturesActionsForEnrollPayload(currAccFeatures)
          });
        }
        
      });
      var globalFeaturesObj = {"companyName": enrollSegData[i].lblCustomerName.text,
                               "cif": enrollSegData[i].custId,
                               "features":otherLevelFeatures};
      accountLevelPermissions.push(accFeaturesObj);
      globalLevelPermissions.push(globalFeaturesObj);

    }
    return {
      "accountLevelPermissions":accountLevelPermissions,
      "globalLevelPermissions":globalLevelPermissions
    };
  },
  /*
  * seperate account/non-account features actions
  * @param: features actions map, customer id
  * @param: account level and other features array
  */
  getAccountLevelFeatures : function(featuresListMap, custId){
    var self =this;
    var accFeaturesArr =[],otherFeaturesArr = [];
    var accLimits = [];
    var featuresArr1 = new Map(JSON.parse(JSON.stringify(Array.from(featuresListMap))));
    var featuresArr2 = new Map(JSON.parse(JSON.stringify(Array.from(featuresListMap))));
    featuresArr1.forEach(function(featureObj,key){
      var currFeature = featureObj;
      var accActions = [],otherActions = [];
      for(var j=0; j<currFeature.actions.length; j++){
        if(currFeature.actions[j].isAccountLevel === "true" || currFeature.actions[j].isAccountLevel === "1"){
          accActions.push(currFeature.actions[j]);
          self.actionsAccountJSON[custId][currFeature.actions[j].actionId] =[];
        }else{
          otherActions.push(currFeature.actions[j]);
        }
      }
      if(accActions.length > 0){
        featureObj.actions = accActions;
        accFeaturesArr.push(featureObj);
      }
      if(otherActions.length > 0){
        var nonAccFeature = featuresArr2.get(key);
        nonAccFeature.actions = otherActions;
        otherFeaturesArr.push(nonAccFeature);
      }
    });
    return {
      "accountLevelFeatures" : accFeaturesArr,
      "otherFeatures": otherFeaturesArr
    };
  },
  /*
  * format features and actions list for enroll payload
  * @param: features array
  * @return: formatted features list
  */
  mapFeaturesActionsForEnrollPayload : function(featuresArr){
    var features = featuresArr.map(function(feature){
      var featureObj = {"featureId": feature.featureId,
                        "featureDescription": feature.featureDescription,
                        "featureName": feature.featureName,
                        "isEnabled": feature.isEnabled,
                        "permissions":[]};
      var featureActions = feature.actions || feature.permissions;
      var actions = featureActions.map(function(action){
        return {
          "id": action.actionId,
          "isEnabled":action.isEnabled
        };
      });
      featureObj.permissions = actions;
      return featureObj;
    });
    return features;
  },
  /*
  * form limits related payload for enroll customer
  */
  getEnrollCustLimitsList : function(){
    var self =this;
    var companyList = [];
    var transactionLimits = [];
    var enrollCustAccountsFeatures = this.presenter.getAccountsFeaturesForEnrollCust();
    var enrollSegData = this.view.segEnrollCustList.data;
    for(var i=0; i<enrollSegData.length; i++){
      var accListMap = enrollCustAccountsFeatures[enrollSegData[i].custId].accounts;
      var accLimitsMap = enrollCustAccountsFeatures[enrollSegData[i].custId].accLevelLimits;
      var limitGroups = enrollCustAccountsFeatures[enrollSegData[i].custId].limitGroups;
      var limitsObj = {"companyName": enrollSegData[i].lblCustomerName.text,
                       "cif": enrollSegData[i].custId,
                       "limitGroups": [],
                       "accounts":[]};
      
      //form limit groups object 
      var limitGroupArr = [];
      for(var j=0; j<limitGroups.length; j++){
        if(limitGroups[j].limitGroupId !== "ACCOUNT_TO_ACCOUNT"){
          var limitGroupJson = {"limitGroupId": limitGroups[j].limitGroupId,"limits":[]};
          var limits = limitGroups[j].limits;
          for(var k=0;k<limits.length; k++){
            limitGroupJson.limits.push({
              "id": limits[k].id,
              "value": limits[k].value
            });
          }
          limitGroupArr.push(limitGroupJson);
        }
      }
      limitsObj.limitGroups = limitGroupArr;
      //append limits for each selected account
      accListMap.forEach(function(accObj,key){
        var currAccVal = accLimitsMap.get(accObj.accountNumber);
        var currAccLimits = currAccVal ? currAccVal.limits : [];
        if(accObj.isEnabled === "true"){
          limitsObj.accounts.push({
            "accountName": accObj.accountName,
            "accountId": accObj.accountNumber,
            "accountType": accObj.accountType,
            "featurePermissions": self.mapDefaultAccLimitsForEnrollPayload(JSON.parse(currAccLimits), enrollSegData[i].custId,accObj.accountNumber )
          });
        }
      });
      transactionLimits.push(limitsObj);

    }
    return transactionLimits;
  },
  /* 
  * format signatory groups list for enroll payload
  * @param:
  * formatted signatory list array
  */
  getEnrollCustSignGroups : function(){
    var signatoryGroupObj=[];
    var enrollCustAccountsFeatures = this.presenter.getAccountsFeaturesForEnrollCust();
    var enrollSegData = this.view.segEnrollCustList.data;
    for(var i=0; i<enrollSegData.length; i++){
      var groupList = enrollCustAccountsFeatures[enrollSegData[i].custId].signatoryGroups;
      var limitsObj = {"cif": enrollSegData[i].custId,
                       "groups": [],
                       "contractId": enrollSegData[i].custDetails.contractId === "" ? "" : enrollSegData[i].custDetails.contractId,
                      };

      //form signatory groups object 
      var groupsJSON={};
      for(var j=0; j<groupList.length; j++){
        if(groupList[j].isAssociated ==="true"&&groupList[j].signatoryGroupId!=="NONE"){
          groupsJSON={
        "signatoryGroupId":groupList[j].signatoryGroupId,
        "isAssociated":"true"
      }
          limitsObj.groups.push(groupsJSON);
          break;
        }
      }
      signatoryGroupObj.push(limitsObj);

    }
    return signatoryGroupObj;
  },
  /*
  * format limits list for enroll payload
  * @param: features array
  * @return: formatted limits list
  */
  mapDefaultAccLimitsForEnrollPayload : function(featuresArr,custId,accountNum){
    var self = this;
    var enabledActions =[];
    var actionList = featuresArr.map(function(feature){
      var actions = feature.actions || feature.permissions;
      for(var x=0; x<actions.length; x++){
        var action = actions[x];
        var checkVar = self.isEditUserAccessVisited[custId];
        var currActionAccList = self.actionsAccountJSON[custId][action.actionId];
        //default case no features edited add all limits
        if(checkVar === false && (self.enrollAction === self.actionConfig.create || self.enrollAction === self.actionConfig.edit)){
          var actionObj =  {
            "featureId":feature.featureId,
            "actionId": action.actionId,
            "actionDescription": action.actionDescription,
            "actionName": action.actionName,
            "limitGroupId": action.limitgroupId || action.limitGroupId,
            "limits":[]
          };
          var limitsJson = action.limits ? Object.keys(action.limits) : [];
          var limitsArr = limitsJson.map(function(key){
            var limitObj = {"id":key,"value":action.limits[key]};
            return limitObj;
          });
          actionObj.limits = limitsArr;
          enabledActions.push(actionObj);
        }
        //in case of edited features add only those limits
        else {
          if(currActionAccList.indexOf(accountNum) >= 0){
            var actionObj =  {
              "featureId":feature.featureId,
              "actionId": action.actionId,
              "actionDescription": action.actionDescription,
              "actionName": action.actionName,
              "limitGroupId": action.limitgroupId || action.limitGroupId,
              "limits":[]
            };
            var limitsJson = action.limits ? Object.keys(action.limits) : [];
            var limitsArr = limitsJson.map(function(key){
              var limitObj = {"id":key,"value":action.limits[key]};
              return limitObj;
            });
            actionObj.limits = limitsArr;
            enabledActions.push(actionObj);
          }
        }
      }
    });
    return enabledActions;
  },
  /*
  * edit accounts ,features,limits on click of edit user access options
  */
  editUserAccessOnClick : function(option){
    this.selAccCount ={};
    this.setEditUserAccessTitleCustInfo();
    var enrollUserData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var editUserDetails = this.presenter.getAccountsFeaturesForEnrollCust(enrollUserData.custId);
    this.view.commonButtonsEditAccounts.btnCancel.info = {"previousData": this.parseEditUserObjPreviousState(editUserDetails, 1),"previousSyncFlag":JSON.parse(JSON.stringify(enrollUserData.custDetails.autoSyncAccounts))};
    var accounts = editUserDetails.accounts;
    this.setAccountsSegmentData(accounts,enrollUserData.custDetails.autoSyncAccounts);
    this.view.enrollEditAccountsCard.lblHeading.text =kony.i18n.getLocalizedString("i18n.frmCompanies.Selected_Accounts") + ":";
    this.view.enrollEditFeaturesCard.segAccountFeatures.info = {"parentId":"enrollEditFeaturesCard","segData":[],"featuresType":1, "segDataJSON":{}};
    this.setFeaturesCardSegmentData(this.view.enrollEditFeaturesCard.segAccountFeatures, editUserDetails.accLevelFeatures);
    this.storeActionForAccountSelection();
  },
  /*
  * convert edit user obj values to stringify/object form in order to change referenc
  * @param: edit user param, option(stringified:1,objectform:2)
  */
  parseEditUserObjPreviousState : function(editUserObj,option){
    if(option === 1){
    var stringifyUser= {"accounts" : JSON.stringify(Array.from(editUserObj.accounts)),
                      "features" : JSON.stringify(Array.from(editUserObj.features)),
                      "accLevelFeatures": JSON.stringify(editUserObj.accLevelFeatures),
                      "nonAccLevelFeatures": JSON.stringify(editUserObj.nonAccLevelFeatures),
                      "accountMapFeatures": JSON.stringify(Array.from(editUserObj.accountMapFeatures)),
                      "limits": JSON.stringify(Array.from(editUserObj.limits)),
                      "accLevelLimits":JSON.stringify(Array.from(editUserObj.accLevelLimits)),
                      "limitGroups": JSON.stringify(editUserObj.limitGroups),
                      "signatoryGroups":JSON.stringify(editUserObj.signatoryGroups),
                      "customerDetails" : JSON.stringify(editUserObj.customerDetails),
                      "isPrimary" : editUserObj.isPrimary
                       };
      return stringifyUser;
    } else{
      var objUser = {"accounts" : new Map(JSON.parse(editUserObj.accounts)),
                      "features" : new Map(JSON.parse(editUserObj.features)),
                      "accLevelFeatures": JSON.parse(editUserObj.accLevelFeatures),
                      "nonAccLevelFeatures": JSON.parse(editUserObj.nonAccLevelFeatures),
                      "accountMapFeatures": new Map(JSON.parse(editUserObj.accountMapFeatures)),
                      "limits": new Map(JSON.parse(editUserObj.limits)),
                      "accLevelLimits":new Map(JSON.parse(editUserObj.accLevelLimits)),
                      "limitGroups": JSON.parse(editUserObj.limitGroups),
                     "signatoryGroups":JSON.parse(editUserObj.signatoryGroups),
                      "customerDetails" : JSON.parse(editUserObj.customerDetails),
                      "isPrimary" : editUserObj.isPrimary
                    };
      return objUser;
    }
  },
  /*
  * reverts the user changes and updates the edituser object on click of cancel
  */
  revertEditUserChangesOnCancel : function(){
    var custId = this.view.customersDropdownAccounts.lblSelectedValue.info.customerId;
    var stringifyPrevState = this.view.commonButtonsEditAccounts.btnCancel.info.previousData;
    var userObj = this.parseEditUserObjPreviousState(stringifyPrevState, 2);
    var segData=this.view.segEnrollCustList.data;
    var enrollUserData=[];
    for(var i=0;i<segData.length;i++){
      if(segData[i].custId===custId){
        enrollUserData = segData[i];
        break;
      }
    }
    enrollUserData.custDetails.autoSyncAccounts=this.view.commonButtonsEditAccounts.btnCancel.info.previousSyncFlag;
    this.view.segEnrollCustList.setDataAt(enrollUserData,this.enrollSegRowInd);
    this.presenter.setAccountsFeaturesForEnrollCust(custId,userObj);
  },
  /*
  * set the title in user screen, customer listbox selection
  */
  setEditUserAccessTitleCustInfo : function(){
    this.view.lblAccountsCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblFeaturesCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblOtherFeaturesCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblLimitsCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblSignatoryCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+ this.customerToEnrollInfo.Name;
    this.setCustDetailsInCardEditUserAccess(this.view.customersDropdownAccounts,this.view.enrollEditAccountsCard);
    this.setCustDetailsInCardEditUserAccess(this.view.customersDropdownFeatures,this.view.enrollEditFeaturesCard);
    this.setCustDetailsInCardEditUserAccess(this.view.customersDropdownOF,this.view.enrollEditOtherFeaturesCard);
    this.setCustDetailsInCardEditUserAccess(this.view.customersDropdownLimits,this.view.enrollEditLimitsCard);
    this.view.forceLayout();
  },
  /*
  * set the customer selection listbox, customer details in card components
  * @param: listbox comp path, card component path
  */
  setCustDetailsInCardEditUserAccess : function(listboxCompPath,cardWidgetPath){
    var enrollUserData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var custInfo, isPrimary = false;
    isPrimary = enrollUserData.flxPrimary.isVisible === true ? true : false;
    custInfo = enrollUserData.custDetails;
    var details = {
      "id": custInfo.coreCustomerId || custInfo.cif,
      "name": custInfo.coreCustomerName || custInfo.companyName || custInfo.contractName,
      "industry":custInfo.industry ||  kony.i18n.getLocalizedString("i18n.Applications.NA"),
      "email": custInfo.email,
      "phone":custInfo.phone,
      "address": custInfo.city ? (custInfo.country ? custInfo.city + ", "+ custInfo.country : custInfo.city) :
                                        (custInfo.country ? custInfo.country : kony.i18n.getLocalizedString("i18n.Applications.NA"))
    };
    var selectedCust = details.name +" ("+ details.id +")";
    listboxCompPath.setEnabled(false);
    listboxCompPath.flxSelectedText.skin = "sknFlxbgF3F3F3bdrd7d9e0";
    listboxCompPath.flxSelectedText.hoverSkin = "sknFlxbgF3F3F3bdrd7d9e0";
    listboxCompPath.lblSelectedValue.text = this.AdminConsoleCommonUtils.getTruncatedString(selectedCust,isPrimary?19:28,isPrimary?17:27);
    listboxCompPath.lblSelectedValue.info = {"customerId": details.id,"customerDetails": custInfo};
    listboxCompPath.lblSelectedValue.toolTip = selectedCust;
    listboxCompPath.btnPrimary.isVisible = isPrimary;
    cardWidgetPath.lblName.text = details.name;
    cardWidgetPath.lblData1.text = details.id;
    cardWidgetPath.lblData2.text = custInfo.taxId || kony.i18n.getLocalizedString("i18n.Applications.NA");
    cardWidgetPath.lblData3.text = details.address;
    cardWidgetPath.lblName.onTouchStart = this.showCustomerDetailsPopup.bind(this,details);
  },
  /*
  * show the respective enroll list/edit screen based on the navigated customer tab 
  * @param: navigation details, userDetails from getinfinityUser response
  */ 
  navigateToScreenForSelectedCustTab : function(navigationParam, userDetails){
    if(navigationParam.isEnrollEditUser === false){
      this.enrollAction = "EDIT";
      this.showEnrollCustomer();
    }else{
      this.enrollAction = "EDIT_USER";
      this.setEditUserScreenEditData(navigationParam.data, userDetails);
      this.initializeEditUserScreen(navigationParam, userDetails);
      this.showEditUserScreen(true);  
    }
  },
  /*
  * set default data required when naigated to user edit screen from customer profile tabs
  * @param: navigation details
  */
  initializeEditUserScreen : function(navigationParam){
    var custId = this.view.customersDropdownAccounts.lblSelectedValue.info.customerId;
    var editUserDetails = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accounts = editUserDetails.accounts;
    this.setAccountsSegmentData(accounts,editUserDetails.customerDetails.autoSyncAccounts);
    this.view.enrollEditFeaturesCard.segAccountFeatures.info = {"parentId":"enrollEditFeaturesCard","segData":[],"featuresType":1, "segDataJSON":{}};
    this.setFeaturesCardSegmentData(this.view.enrollEditFeaturesCard.segAccountFeatures, editUserDetails.accLevelFeatures);
    this.storeActionForAccountSelection();
    if(navigationParam.tabName === "ACCOUNTS"){
      this.showEditAccountsScreen();
    } else if(navigationParam.tabName === "FEATURES"){
      var tabOption = navigationParam.isAccountLevel === false ? 1 : 2;
      this.showEditFeaturesScreen(tabOption);
    } else if(navigationParam.tabName === "LIMITS"){
      var tabOption = navigationParam.isAccountLevel === false ? 1 : 2;
      this.showEditLimitsScreen(tabOption);
    }
  },
  /*
  * set data to customers dropdown and card widget customer part data in edit user screen
  * @param: customer related details from navigation,  userDetails from getinfinityUser response
  */
  setEditUserScreenEditData : function(navigationData, userDetails){
    var dropDownData = this.getCustomersListboxDataEditUser(userDetails);
    this.view.lblAccountsCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblFeaturesCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblOtherFeaturesCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    this.view.lblLimitsCustHeader.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UserColon")+" "+this.customerToEnrollInfo.Name;
    if(dropDownData.length > 0){
      this.setCustomersListboxDataEditUser(this.view.customersDropdownAccounts, this.view.enrollEditAccountsCard, dropDownData, navigationData);
      this.setCustomersListboxDataEditUser(this.view.customersDropdownFeatures, this.view.enrollEditFeaturesCard, dropDownData, navigationData);
      this.setCustomersListboxDataEditUser(this.view.customersDropdownOF, this.view.enrollEditOtherFeaturesCard, dropDownData, navigationData);
      this.setCustomersListboxDataEditUser(this.view.customersDropdownLimits, this.view.enrollEditLimitsCard, dropDownData, navigationData);
    }
  },
  
  /*
  * get the list of customers for dropdown in edit user access screen
  * @param: userDetails from getinfinityUser response
  */
  getCustomersListboxDataEditUser : function(userDetails){
    var allCustomerList = this.presenter.getAccountsFeaturesForEnrollCust();
    var allCustId = Object.keys(allCustomerList);
    var primaryCustId = userDetails && userDetails.length > 0 ? userDetails[0].coreCustomerId : "";
    var widgetMap={
      "flxCustomerName":"flxCustomerName",
      "flxCustomerNameCont":"flxCustomerNameCont",
      "lblCustomerName":"lblCustomerName",
      "btnPrimaryCustomers":"btnPrimaryCustomers"
    };
    var data=[], maxLengthText ="";
    for(var i=0;i<allCustId.length;i++){  
      var currCust = allCustomerList[allCustId[i]].customerDetails;
      data.push({
        "id": currCust.cif,
        "custDetails": currCust,
        "lblCustomerName":{"text":(currCust.companyName || currCust.contractName)+" ("+currCust.cif+")"},
        "btnPrimaryCustomers":{"isVisible": currCust.cif === primaryCustId ? true:false}
      });
      if((currCust.companyName+" ("+currCust.cif+")").length>maxLengthText.length)
          maxLengthText= (currCust.companyName || currCust.contractName)+" ("+currCust.cif+")";
    }
    
    var maxTextWidth=this.AdminConsoleCommonUtils.getLabelWidth(maxLengthText,"13px Lato-Regular");
    var dropdownWidth=maxTextWidth+15+15+70+15;
    this.view.customersDropdownAccounts.flxSegmentList.width = dropdownWidth +"dp";
    this.view.customersDropdownFeatures.flxSegmentList.width = dropdownWidth +"dp";
    this.view.customersDropdownOF.flxSegmentList.width = dropdownWidth +"dp";
    this.view.customersDropdownLimits.flxSegmentList.width = dropdownWidth +"dp";
    return data;
  },
  /*
  * set the customers dropdown data in all tabs, set default selection, set card data for selected cust
  * @param:dropdown component path, card widget path, dropdown seg data, navigation related data
  */
  setCustomersListboxDataEditUser : function(dropdownWidPath, cardWidgetPath, dropdownData, navData){
    var widgetMap={
      "flxCustomerName":"flxCustomerName",
      "flxCustomerNameCont":"flxCustomerNameCont",
      "lblCustomerName":"lblCustomerName",
      "btnPrimaryCustomers":"btnPrimaryCustomers"
    };  
    dropdownWidPath.segList.widgetDataMap=widgetMap;
    dropdownWidPath.segList.setData(dropdownData);
    dropdownWidPath.segList.info={"records":dropdownData};
    dropdownWidPath.flxSegmentList.setVisibility(false);
    //set the selected customer from the selected tabs
    var selectedCust;
    for(var i=0; i<dropdownData.length; i++){
      if(dropdownData[i].id === navData.custId){
        selectedCust = dropdownData[i];
        selectedCust["taxId"] = navData.taxId;
        selectedCust["addressLine1"] = navData.address;
        break;
      }
    }
    var selectedCustName = selectedCust.lblCustomerName ? selectedCust.lblCustomerName.text : "";
    var isPrimary = selectedCust.btnPrimaryCustomers.isVisible === true ? true : false;
    dropdownWidPath.lblSelectedValue.text = this.AdminConsoleCommonUtils.getTruncatedString(selectedCustName,isPrimary?19:28,isPrimary?17:28);
    dropdownWidPath.lblSelectedValue.toolTip = selectedCustName;
    dropdownWidPath.lblSelectedValue.info = {"customerId": selectedCust.id,"customerDetails": selectedCust.custDetails };
    dropdownWidPath.btnPrimary.setVisibility(isPrimary);
    var details = {
      "id": selectedCust.id,
      "name": selectedCust.custDetails.companyName || selectedCust.custDetails.contractName,
      "industry":selectedCust.custDetails.industry ||  kony.i18n.getLocalizedString("i18n.Applications.NA"),
      "email": selectedCust.custDetails.email || kony.i18n.getLocalizedString("i18n.Applications.NA"),
      "phone":selectedCust.custDetails.phone || kony.i18n.getLocalizedString("i18n.Applications.NA"),
      "address": selectedCust.custDetails.city ? (selectedCust.custDetails.country ? selectedCust.custDetails.city + ", "+ selectedCust.custDetails.country : selectedCust.custDetails.city) :
                                        (selectedCust.custDetails.country ? selectedCust.custDetails.country : kony.i18n.getLocalizedString("i18n.Applications.NA"))
    };
    cardWidgetPath.lblName.text = details.name;
    cardWidgetPath.lblData1.text = details.id;
    cardWidgetPath.lblData2.text = selectedCust.taxId || kony.i18n.getLocalizedString("i18n.Applications.NA");
    cardWidgetPath.lblData3.text = details.address;
    cardWidgetPath.lblName.onTouchStart = this.showCustomerDetailsPopup.bind(this,details);
    this.view.forceLayout();
  },
  /*
  * set the selected item from dropdown
  * dropdown component path, selected item id
  */
  setSelectedTextFromDropdownEditUser : function(componentPath,selectedId){
    var selIndex ="";
    var segData =componentPath.segList.data;
    if(selectedId){
      for(let x=0; x<segData.length; x++){
        if(segData[x].id === selectedId){
          selIndex =x;
          break;
        }
      }
    }else{
      selIndex = componentPath.segList.selectedRowIndex[1];
    }
    var isPrimary = segData[selIndex].btnPrimaryCustomers.isVisible ? true :false;
    componentPath.lblSelectedValue.text = this.AdminConsoleCommonUtils.getTruncatedString(segData[selIndex].lblCustomerName.text,isPrimary?19:30,isPrimary?17:29);
    componentPath.lblSelectedValue.toolTip = segData[selIndex].lblCustomerName.text;
    componentPath.lblSelectedValue.info = {"customerId": segData[selIndex].id,"customerDetails":segData[selIndex].custDetails };
    componentPath.btnPrimary.setVisibility(isPrimary);
    componentPath.flxSegmentList.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * add required keys and contruct object used for edit user access
  * @param: {"accounts":[],"features":[],"limits":[],"isPrimary":true/false,"custId":""}
  */
  formEditObjectAssignDefaultValues : function(accFeatureLimitsObj){
    var featuresMap = new Map();
    var filteredFeatures = this.getFilteredFeaturesFromTempContract(accFeatureLimitsObj.features,accFeatureLimitsObj.custId[0]);
    featuresMap = this.getFeaturesMapToFormEditObject(filteredFeatures,1);
    var filteredLimits = this.getFilteredFeaturesFromTempContract(accFeatureLimitsObj.limits,accFeatureLimitsObj.custId[0]);
    var limitsArr = this.getLimitsMapToFormEditObject(filteredLimits,2,true);
    
    this.actionsAccountJSON[accFeatureLimitsObj.custId[0]] = {};
    var categorizedFeatures = this.getAccountLevelFeatures(featuresMap,accFeatureLimitsObj.custId[0]);
    var accFeaturesMap = new Map();
    var accLimitsMap = new Map();
    //get filtered user accounts from  temp contract
    var accounts = this.getFilteredAccFromTempContract(accFeatureLimitsObj.accounts,accFeatureLimitsObj.custId[0]);
    var accountsMap = new Map();
    //add isEnable key for all accounts
    for(var i=0;i<accounts.length;i++){
      accounts[i]["isEnabled"] = "true";
      accounts[i]["isAssociated"] = "true";
      accounts[i]["accountNumber"] = accounts[i].accountNumber || accounts[i].accountId;
      accountsMap.set(accounts[i].accountNumber,accounts[i]); 
      //assign features for each accounts
      var accFeatureObj = {"accountDetails":accounts[i], "features":JSON.stringify(categorizedFeatures.accountLevelFeatures)};
      accFeaturesMap.set(accounts[i].accountNumber,accFeatureObj);
      //assign limits for each accounts
      var accLimitObj = {"accountDetails":accounts[i], "limits":JSON.stringify(limitsArr) };
      accLimitsMap.set(accounts[i].accountNumber,accLimitObj);
    }
    //store all features list for bulkupdate
    this.bulkUpdateAllFeaturesList = JSON.parse(JSON.stringify(categorizedFeatures.accountLevelFeatures));
    //store all featureslimits list for bulkupdate
    this.bulkUpdateAllFeaturesLimits = JSON.parse(JSON.stringify(limitsArr));
    var signatoryGroups=accFeatureLimitsObj.signatoryGroups;
    var limitGroupsArr = this.caluclateTransactionLimitGroupValue(accFeaturesMap, accLimitsMap, true,null);
    var editUserObj = {"accounts" : accountsMap,
                       "features" : featuresMap, //Map
                       "accLevelFeatures": categorizedFeatures.accountLevelFeatures, //Array
                       "nonAccLevelFeatures": categorizedFeatures.otherFeatures, //Array
                       "accountMapFeatures": accFeaturesMap, //Map(features - stringified)
                       "limits": this.getLimitsMapToFormEditObject(accFeatureLimitsObj.limits,1,true), //Map
                       "accLevelLimits":accLimitsMap, //Map(limits - stringified)
                       "limitGroups": limitGroupsArr, //Array
                       "signatoryGroups":signatoryGroups,
                       "isPrimary" : accFeatureLimitsObj.isPrimary,
                       "custId": accFeatureLimitsObj.custId,
                       "customerDetails": accFeatureLimitsObj.custDetails
                      };
    this.presenter.setAccountsFeaturesForEnrollCust(accFeatureLimitsObj.custId[0],editUserObj);
  },
  /*
  * add isEnabled key to all features,actions to construct edit user access object
  * @param: accounts,features,limits data,
  * @param: option(return type map:1,array:2)
  * @returns: features map/array 
  */
  getFeaturesMapToFormEditObject : function(features,option){
    var featuresMap = new Map();
    //add isEnable key for all features and action
   // var features = accFeatureLimitsObj.features;  
    for(var j=0; j<features.length; j++){
      features[j]["isEnabled"] = "true";
      for(var k=0; k<features[j].actions.length; k++){
        features[j].actions[k]["isEnabled"] = "true";
        features[j].actions[k]["isPartial"] = "false";
      }
      var featureId = features[j].featureId  || features[j].id;
      featuresMap.set(featureId,features[j]);
    }
    return (option === 1 ? featuresMap :features) ;
  },
  /*
  * add actuallimit key to all limits to construct edit user access object
  * @param: limits data
  * @param: option(return type map:1,array:2)
  * @returns: limits map/array 
  */
  getLimitsMapToFormEditObject : function(limitsList, option, isCreate){
    var limitsMap = new Map();
    var limits = limitsList || [];  
    for(var i=0; i<limits.length; i++){
      limits[i]["isEnabled"] = "true";
      for(var j=0; j<limits[i].actions.length; j++){
        limits[i].actions[j]["actualLimits"] = limits[i].actions[j].limits;
        if(isCreate === true){
          limits[i].actions[j].limits = this.addNewLimitsToExistingLimits(limits[i].actions[j].limits);
        } else{
          limits[i].actions[j].limits = this.getLimitValuesJsonFromArray(limits[i].actions[j].limits);
        }
      }
      var featureId = limits[i].featureId;
      limitsMap.set(featureId,limits[i]);
    }
    return (option === 1 ? limitsMap :limits);
  },
  /*
  * add new limit values to existing limits
  * @param: existing limit values array
  * @return: new limit values json
  */
  addNewLimitsToExistingLimits : function(limitVal){
    var allLimits = [], allLimitsJson;;
    if(limitVal && limitVal.length > 0){
      var limitJson = this.getLimitValuesJsonFromArray(limitVal);
      var newLimits = [{"id": this.limitId.PRE_APPROVED_DAILY_LIMIT, "value": "0"},
                       {"id": this.limitId.PRE_APPROVED_WEEKLY_LIMIT, "value": "0"},
                       {"id": this.limitId.PRE_APPROVED_TRANSACTION_LIMIT, "value": "0"},
                       {"id": this.limitId.AUTO_DENIED_DAILY_LIMIT, "value": limitJson[this.limitId.DAILY_LIMIT] || "0"},
                       {"id": this.limitId.AUTO_DENIED_WEEKLY_LIMIT, "value": limitJson[this.limitId.WEEKLY_LIMIT] || "0"},
                       {"id": this.limitId.AUTO_DENIED_TRANSACTION_LIMIT, "value": limitJson[this.limitId.MAX_TRANSACTION_LIMIT] || "0"}];
      allLimits = limitVal.concat(newLimits);
      allLimitsJson = this.getLimitValuesJsonFromArray(allLimits)
    }
    return allLimitsJson;
  },
  /*
  * caluclate the limit group values on features,accounts selection update
  * acc featurea map, account lemits map, isfirstTime(true/false), existingLimitGroups
  * retruns: limit groups array
  */
  caluclateTransactionLimitGroupValue : function(accFeaturesMap,accLimitsMap,isFirstTime, existingLimitGroups){
    var self =this;
    var activeFeatures = {}, hasExistingLimits = false;
    //fetch all the enabled actions for all the selected accounts
    accFeaturesMap.forEach(function(accountObj,key){
      if(accountObj.accountDetails.isEnabled === "true" || accountObj.accountDetails.isAssociated === "true"){
        activeFeatures[key] = [];
        var features = JSON.parse(accountObj.features);
        for(var i=0; i<features.length; i++){
          var actions = features[i].actions || features[i].permissions;
          for(var j=0; j<actions.length; j++){
            if(actions[j].isEnabled === "true"){
              var featureActionId = features[i].featureId + "$" + actions[j].actionId;
              activeFeatures[key].push(featureActionId);
            }
          }
        }
      }
    });
    if(self.enrollAction === self.actionConfig.editUser){ //in case of edit-consider existing values
      var limitGroups = this.getLimitGroupsValuesJsonFromArray(existingLimitGroups);
      hasExistingLimits = true;
    }else{ //in case of create- caluclate for each group
      var limitGroups = existingLimitGroups ? this.getLimitGroupsValuesJsonFromArray(existingLimitGroups) :{};
      hasExistingLimits = existingLimitGroups && existingLimitGroups.length > 0 ? true : false;
    }
    //reset max values
    var limitGrp = Object.values(limitGroups);
    for(var x=0; x<limitGrp.length; x++){
      limitGroups[limitGrp[x].limitGroupId].limits[0].maxValue = 0.0;
      limitGroups[limitGrp[x].limitGroupId].limits[1].maxValue = 0.0;
      limitGroups[limitGrp[x].limitGroupId].limits[2].maxValue = 0.0;
    }
    accLimitsMap.forEach(function(accountObj,key){
      if(accountObj.accountDetails.isEnabled === "true" || accountObj.accountDetails.isAssociated === "true"){
        var featureLimits = JSON.parse(accountObj.limits);
        for(var l=0; l<featureLimits.length; l++){
          var actions = featureLimits[l].actions || featureLimits[l].permissions;
          for(var m=0; m< actions.length; m++ ){
            if (activeFeatures[key].includes(featureLimits[l].featureId + '$' + actions[m].actionId)) {
              var limitGroupId = actions[m].limitGroupId || actions[m].limitgroupId;
              if (!limitGroups.hasOwnProperty(limitGroupId)) {
                limitGroups[limitGroupId] = {
                  'limitGroupName':actions[m].limitgroup || "",
                  'limitGroupId': limitGroupId,
                  "limits": [{"id": self.limitId.MAX_TRANSACTION_LIMIT,"maxValue":0.0},
                             {"id": self.limitId.DAILY_LIMIT, "maxValue" :0.0},
                             {"id": self.limitId.WEEKLY_LIMIT, "maxValue":0.0}],
                  "actualLimits":[{"id": self.limitId.MAX_TRANSACTION_LIMIT,"value":0.0},
                                  {"id": self.limitId.DAILY_LIMIT, "value" :0.0},
                                  {"id": self.limitId.WEEKLY_LIMIT, "value":0.0}]
                };
              }
              //caluclate the max values for limit groups
              for(var y=0; y<limitGroups[limitGroupId].limits.length; y++){
                if(limitGroups[limitGroupId].limits[y].id === self.limitId.MAX_TRANSACTION_LIMIT){
                  let value = parseFloat(actions[m].limits[self.limitId.MAX_TRANSACTION_LIMIT]);
                  if (limitGroups[limitGroupId].limits[y].maxValue < value) {
                    limitGroups[limitGroupId].limits[y].maxValue = value;
                  }
                } else if(limitGroups[limitGroupId].limits[y].id === self.limitId.DAILY_LIMIT){
                  limitGroups[limitGroupId].limits[y].maxValue += parseFloat(actions[m].limits[self.limitId.DAILY_LIMIT]);
                } else if(limitGroups[limitGroupId].limits[y].id === self.limitId.WEEKLY_LIMIT){
                  limitGroups[limitGroupId].limits[y].maxValue += parseFloat(actions[m].limits[self.limitId.WEEKLY_LIMIT]);
                }
              }           
              //for first time assign max values to values in create flow
              if(hasExistingLimits === false){ 
                limitGroups[limitGroupId].limits[0]["value"] = limitGroups[limitGroupId].limits[0].maxValue;
                limitGroups[limitGroupId].limits[1]["value"] = limitGroups[limitGroupId].limits[1].maxValue;
                limitGroups[limitGroupId].limits[2]["value"] = limitGroups[limitGroupId].limits[2].maxValue;
              }
              //store actual limit group values for reset functionality
              if(isFirstTime){
                limitGroups[limitGroupId].actualLimits[0]["value"] = limitGroups[limitGroupId].limits[0].value;
                limitGroups[limitGroupId].actualLimits[1]["value"] = limitGroups[limitGroupId].limits[1].value;
                limitGroups[limitGroupId].actualLimits[2]["value"] = limitGroups[limitGroupId].limits[2].value;
              }
            }
          }
        }
      }
    });
    var limitGroupArr = [];
    for (var key in limitGroups) {
      limitGroupArr.push(limitGroups[key]);
    }
    return limitGroupArr;
    
  },
  /*
  * seperate the accounts ,features,limits,customers related infofrom the response
  * @param: getInfinityUser response, navigation details
  */
  parseCustomersAccountsFeatures : function(userAllDetails, navigationParam){
    var infinityUserData = userAllDetails.userData;
    var companyList = infinityUserData.companyList;
    //reset action accounts 
    this.selAccCount = {};
    this.actionsAccountJSON  = {}
    var allCompanyAccountFeaturesObj ={};
    for(var i=0;i< companyList.length; i++){
      allCompanyAccountFeaturesObj[companyList[i].cif] = {
        "accounts": companyList[i].accounts,
        "accFeatures":[],
        "otherFeatures": [],
        "accLimits":[],
        "limitGroups":[],
        "signatoryGroups":[],
        "custId": companyList[i].cif,
        "isPrimary":companyList[i].isPrimary,
        "custDetils":companyList[i],
        "defaultLimits":userAllDetails.defaultLimits
      };
    }
    var accLevelFeatures = infinityUserData.accountLevelPermissions || [];
    for(var j=0; j<accLevelFeatures.length; j++){
      allCompanyAccountFeaturesObj[accLevelFeatures[j].cif].accFeatures = accLevelFeatures[j].accounts;
      if(accLevelFeatures[j].accounts.length !== 0 && accLevelFeatures[j].accounts.length < allCompanyAccountFeaturesObj[accLevelFeatures[j].cif].accounts.length){
        var missingFeatures = this.getFeaturesForDisabledAccEditUser(allCompanyAccountFeaturesObj[accLevelFeatures[j].cif].accounts,accLevelFeatures[j].accounts);
        var existingFeatures = accLevelFeatures[j].accounts;
        allCompanyAccountFeaturesObj[accLevelFeatures[j].cif].accFeatures = existingFeatures.concat(missingFeatures);
      }
    }
    var otherFeatures = infinityUserData.globalLevelPermissions || [];
    for(var k=0; k<otherFeatures.length; k++){
      //add isEnabled key for other features list
      for(var p=0 ;p<otherFeatures[k].features.length; p++){
        otherFeatures[k].features[p]["isEnabled"] = "true";
      }  
      allCompanyAccountFeaturesObj[otherFeatures[k].cif].otherFeatures = otherFeatures[k].features;
    }
    var accLimits = infinityUserData.transactionLimits || [];
    for(var l=0; l<accLimits.length; l++){
      allCompanyAccountFeaturesObj[accLimits[l].cif].accLimits = accLimits[l].accounts;
      if(accLimits[l].accounts.length !== 0 && accLimits[l].accounts.length < allCompanyAccountFeaturesObj[accLimits[l].cif].accounts.length){
        var missingLimits = this.getLimitsForDisabledAccEditUser(allCompanyAccountFeaturesObj[accLimits[l].cif].accounts,accLimits[l].accounts);
        var existingLimits = accLimits[l].accounts;
        allCompanyAccountFeaturesObj[accLimits[l].cif].accLimits = existingLimits.concat(missingLimits);
      }
    }
    var defaultLimits = userAllDetails.defaultLimits.length > 0 ? userAllDetails.defaultLimits : [];
    for(var q=0; q<defaultLimits.length; q++){
      allCompanyAccountFeaturesObj[defaultLimits[q].coreCustomerId].defaultLimits = defaultLimits[q].coreCustomerLimits;
    }
    var signGroups=infinityUserData.signatoryGroups||[];
    for(var x=0; x<signGroups.length; x++){
      allCompanyAccountFeaturesObj[signGroups[x].cif].signatoryGroups = signGroups[x].groups;
    }
    for(var n=0; n<accLimits.length; n++){
      allCompanyAccountFeaturesObj[accLimits[n].cif].limitGroups = accLimits[n].limitGroups;
    }
    var custArr = Object.keys(allCompanyAccountFeaturesObj);
    for(var m=0; m<custArr.length; m++){
      this.selAccCount[custArr[m]] = 0;
      kony.adminConsole.utils.showProgressBar(this.view);
      this.formDefaultValuesForObjEditUserFlow(allCompanyAccountFeaturesObj[custArr[m]],custArr[m]);
    }
    this.navigateToScreenForSelectedCustTab(navigationParam, infinityUserData.userDetails);
  },
   /*
  * contruct object used for edit user flow
  * @param: {"accounts":[],"accFeatures":[],"otherFeatures":[],"accLimits":[],"limitGroups":[],isPrimary":true/false,"custId":""}
  */
  formDefaultValuesForObjEditUserFlow : function(accFeatureLimitsObj, custId){
    var accountLevelFeatures = accFeatureLimitsObj.accFeatures && accFeatureLimitsObj.accFeatures.length > 0 ?
        accFeatureLimitsObj.accFeatures[0].featurePermissions : [];;
    var otherFeatures = accFeatureLimitsObj.otherFeatures;
    var limitsArr = accFeatureLimitsObj.accLimits && accFeatureLimitsObj.accLimits.length > 0 ?
        this.getFeatureBasedActions(accFeatureLimitsObj.accLimits[0].featurePermissions) : [];
    var limitGroups = accFeatureLimitsObj.limitGroups.length > 0 ? accFeatureLimitsObj.limitGroups : [];
    
    this.actionsAccountJSON[accFeatureLimitsObj.custId] = {};
    var accFeaturesMap = new Map();
    var accLimitsMap = new Map();
    //add all accounts
    var accounts = accFeatureLimitsObj.accounts;
    var accountsMap = new Map();
    for(var i=0;i<accounts.length;i++){
      accounts[i]["isAssociated"] = accounts[i].isEnabled;
      accounts[i]["accountNumber"] = accounts[i].accountId;
      accountsMap.set(accounts[i].accountId,accounts[i]); 
    }
    //map features for each accounts
    var accLevelFeatures = accFeatureLimitsObj.accFeatures;
    for(var j=0; j<accLevelFeatures.length; j++){
      var accObj = accountsMap.get(accLevelFeatures[j].accountId);
      var accFeatureObj = {"accountDetails":accObj, "features": JSON.stringify(accLevelFeatures[j].featurePermissions)};
      accFeaturesMap.set(accLevelFeatures[j].accountId,accFeatureObj);
    }
    //map limits for each accounts
    var accLevelLimits = accFeatureLimitsObj.accLimits;
    var updatedFeatureLimts = [];
    for(var k=0; k<accLevelLimits.length; k++){
      var accObj = accountsMap.get(accLevelLimits[k].accountId);
      var limitsList = this.getFeatureBasedActions(accLevelLimits[k].featurePermissions);
      var featuresList = accFeaturesMap.get(accLevelLimits[k].accountId);
      //include values from default limits for any disabled features
      updatedFeatureLimts = this.getLimitsForDisabledFeatures(featuresList.features, limitsList, accFeatureLimitsObj.defaultLimits);
      limitsList = limitsList.concat(updatedFeatureLimts);
      var accLimitObj = {"accountDetails":accObj, "limits": JSON.stringify(limitsList)}; 
      accLimitsMap.set(accLevelLimits[k].accountId,accLimitObj);
    }
    //store all features list for bulkupdate
    this.bulkUpdateAllFeaturesList = JSON.parse(JSON.stringify(accountLevelFeatures));
    //store all featureslimits list for bulkupdate
    this.bulkUpdateAllFeaturesLimits = JSON.parse(JSON.stringify(limitsArr));
    //add all the actionId's to varaible for selection tracking
    for(var m=0; m<accountLevelFeatures.length; m++){
      for(var p=0; p<accountLevelFeatures[m].permissions.length; p++){
        this.actionsAccountJSON[custId][accountLevelFeatures[m].permissions[p].actionId] =[];
      }     
    }
    var limitGroupsArr = this.caluclateTransactionLimitGroupValue(accFeaturesMap, accLimitsMap, true, limitGroups);
    var signatoryGroups=accFeatureLimitsObj.signatoryGroups;
    var editUserObj = {"accounts" : accountsMap,
                       "features" : [], //Map
                       "accLevelFeatures": accountLevelFeatures, //Array
                       "nonAccLevelFeatures": otherFeatures, //Array
                       "accountMapFeatures": accFeaturesMap, //Map(features - stringified)
                       "limits": this.getLimitsMapToFormEditObject(limitsArr,1,false), //Map
                       "accLevelLimits":accLimitsMap, //Map(limits - stringified)
                       "limitGroups": limitGroupsArr, //Array
                       "signatoryGroups":signatoryGroups,
                       "isPrimary" : accFeatureLimitsObj.isPrimary,
                       "custId": accFeatureLimitsObj.custId,
                       "customerDetails": accFeatureLimitsObj.custDetils
                      };
    this.presenter.setAccountsFeaturesForEnrollCust(accFeatureLimitsObj.custId,editUserObj);
  },
  /*
  * add default features for any of disabled accounts
  * @param: all accounts for cif, acc level features
  * @return : features for disabled accounts
  */
  getFeaturesForDisabledAccEditUser : function(allAccounts,accLevelFeatures){
    var accExist = false;
    var featuresArr = [];
    for(var i=0;i<allAccounts.length;i++){
      accExist = false;
      for(var j=0;j<accLevelFeatures.length;j++){
        if(allAccounts[i].accountId === accLevelFeatures[j].accountId){
          accExist = true;
          break;
        }
      }
      //assign permissions to accounts disabled
      if(accExist === false) {
        var accFeatures ={"accountName": allAccounts[i].accountName,
                          "accountId": allAccounts[i].accountId,
                          "accountType": allAccounts[i].accountType,
                          "featurePermissions":[]
                         };
        accFeatures.featurePermissions = JSON.parse(JSON.stringify(accLevelFeatures[0].featurePermissions));
        for(var k=0; k<accFeatures.featurePermissions.length; k++){
          var features = accFeatures.featurePermissions[k];
          features.isEnabled = "false"; 
          for(var l=0; l<features.permissions.length; l++){
            features.permissions[l].isEnabled = "false";
          }
        }
        featuresArr.push(accFeatures);
      }
    }
    return featuresArr;
  },
  /*
  * add default limits for any of disabled accounts
  * @param: all accounts for cif, acc level limits
  * @return : limits for disabled accounts
  */
  getLimitsForDisabledAccEditUser : function(allAccounts,accLevelLimits){
    var accExist = false;
    var limitsArr = [];
    for(var i=0;i<allAccounts.length;i++){
      accExist = false;
      for(var j=0;j<accLevelLimits.length;j++){
        if(allAccounts[i].accountId === accLevelLimits[j].accountId){
          accExist = true;
          break;
        }
      }
      //assign limits to accounts disabled
      if(accExist === false) {
        var accLimits ={"accountName": allAccounts[i].accountName,
                          "accountId": allAccounts[i].accountId,
                          "accountType": allAccounts[i].accountType,
                          "featurePermissions":[]
                         };
        limitsArr.push(accLimits);
      }
    }
    return limitsArr;
  },
  /*
  * get limits for disabled account level features from cust and role level
  * @param: acc level features, acc level limits, default limits of a cust
  */
  getLimitsForDisabledFeatures : function(features,accLevelLimits, defaultLimits){
    var featuresList = JSON.parse(features);
    var limitsList = accLevelLimits;
    var limitIds = [];
    var limitsToAdd = [];
    for(var p=0; p<limitsList.length; p++){
      var actions = limitsList[p].actions || limitsList[p].permissions;
      for(var q=0; q<actions.length; q++){
        limitIds.push(limitsList[p].featureId+"$"+actions[q].actionId);
      }
    }
    var missingLimits =[];
    //get the feature id for features that are not in limits
    for(var a=0; a<featuresList.length; a++){
      var actions = featuresList[a].actions || featuresList[a].permissions;
      for(var b=0; b<actions.length; b++){
        var id = featuresList[a].featureId+"$"+actions[b].actionId;
        if(actions[b].typeId === this.AdminConsoleCommonUtils.constantConfig.MONETARY && 
           limitIds.indexOf(id) < 0){
          missingLimits.push(id);
        }
      }
    }
    for(var i=0;i<defaultLimits.length; i++){
      for(var j=0; j<defaultLimits[i].actions.length; j++){
        var id = defaultLimits[i].featureId+"$"+defaultLimits[i].actions[j].actionId;
        if(missingLimits.indexOf(id) >= 0){
          limitsToAdd.push(JSON.parse(JSON.stringify(defaultLimits[i])));
        }
      }
    }
    var updatedLimitsArr = this.getLimitsMapToFormEditObject(limitsToAdd,2,true);
    return updatedLimitsArr;
  },
  /*
  * get features actions nested structure from flat structure
  * @param: features actions flat structure array
  * @return: nested features actions
  */
  getFeatureBasedActions : function(allFeatureActions){
    var featureJson ={};
    for(var i=0;i<allFeatureActions.length ;i++){
      var action = {"accessPolicyId": allFeatureActions[i].accessPolicyId,
                    "actionDescription": allFeatureActions[i].actionDescription,
                    "actionId": allFeatureActions[i].actionId,
                    "actionLevelId": allFeatureActions[i].actionLevelId,
                    "actionName": allFeatureActions[i].actionName,
                    "actionStatus": allFeatureActions[i].actionStatus,
                    "dependentActions": allFeatureActions[i].dependentActions,
                    "isAccountLevel": allFeatureActions[i].isAccountLevel,
                    "limitGroupId":  allFeatureActions[i].limitGroupId,
                    "limits":  this.getLimitValuesJsonFromArray(allFeatureActions[i].limits),
                    "actualLimits" : allFeatureActions[i].limits,
                    "typeId": allFeatureActions[i].typeId
                   };
      if(featureJson.hasOwnProperty(allFeatureActions[i].featureId) === false){ //a new entry
        featureJson[allFeatureActions[i].featureId] = {"featureDescription": allFeatureActions[i].featureDescription,
                                                       "featureId": allFeatureActions[i].featureId,
                                                       "featureName": allFeatureActions[i].featureName,
                                                       "featureStatus": allFeatureActions[i].featureStatus,
                                                       "isAccountLevel": allFeatureActions[i].isAccountLevel,
                                                       "actions":[]
                                                      };

      }
      featureJson[allFeatureActions[i].featureId].actions.push(action);
    }
    var nestedFeatures = Object.values(featureJson);
    return nestedFeatures;
  },
  /*
  * set data to filters in the edit user accounts tab
  */
  setDataToAccountsTabFilters : function(){
    var self =this;
    var accountsData = this.view.enrollEditAccountsCard.segAccountFeatures.info.segData;
    var rowsData = accountsData.length > 0 ? accountsData[0][1]:[]
    var widgetMap = {
      "flxSearchDropDown": "flxSearchDropDown",
      "flxCheckBox": "flxCheckBox",
      "imgCheckBox": "imgCheckBox",
      "lblDescription": "lblDescription"
    };
    var typesList =[],ownerTypeList =[],maxSizeTypeText ="",maxSizeOwnerTypeText ="";
    for(var i=0;i<rowsData.length;i++){
      if(!typesList.includes(rowsData[i].lblAccountType.text))
        typesList.push(rowsData[i].lblAccountType.text);
      if(!ownerTypeList.includes(rowsData[i].lblAccountHolder.text)){
        ownerTypeList.push(rowsData[i].lblAccountHolder.text);
      }    
    }
    var typesData = typesList.map(function(rec){
      maxSizeTypeText= (rec && rec.length > maxSizeTypeText.length) ? rec: maxSizeTypeText;
      return {
        "flxSearchDropDown": "flxSearchDropDown",
        "flxCheckBox": "flxCheckBox",
        "imgCheckBox": self.AdminConsoleCommonUtils.checkboxnormal,
        "lblDescription": rec
      };
    });
    var ownershipData = ownerTypeList.map(function(rec){
      maxSizeOwnerTypeText= (rec && rec.length > maxSizeOwnerTypeText.length) ? rec: maxSizeOwnerTypeText;
      return {
        "flxSearchDropDown": "flxSearchDropDown",
        "flxCheckBox": "flxCheckBox",
        "imgCheckBox": self.AdminConsoleCommonUtils.checkboxnormal,
        "lblDescription": rec
      }; 
    });
    this.view.accountTypesFilterMenu.segStatusFilterDropdown.widgetDataMap = widgetMap;
    this.view.ownershipFilterMenu.segStatusFilterDropdown.widgetDataMap = widgetMap;

    this.view.accountTypesFilterMenu.segStatusFilterDropdown.setData(typesData);
    this.view.ownershipFilterMenu.segStatusFilterDropdown.setData(ownershipData);

    this.view.flxAccountsFilter.width=this.AdminConsoleCommonUtils.getLabelWidth(maxSizeTypeText)+55+"px";
    this.view.flxOwnershipFilter.width=this.AdminConsoleCommonUtils.getLabelWidth(maxSizeOwnerTypeText)+55+"px";
    var selTypeInd = [],selOwnerInd = [];
    for(var j=0;j<typesList.length;j++){
      selTypeInd.push(j);
    }
    for(var k=0;k<ownerTypeList.length;k++){
      selOwnerInd.push(k);
    }
    self.view.accountTypesFilterMenu.segStatusFilterDropdown.selectedIndices = [[0,selTypeInd]];
    self.view.ownershipFilterMenu.segStatusFilterDropdown.selectedIndices = [[0,selOwnerInd]];
    this.view.forceLayout();
  },
  /*
  * filter the account data based on selection
  * @returns: filtered results
  */
  filterAccountsOnTypeOwnership : function(){
    var selFilter = [[]];
    var dataToShow = [];
    var accountsData = this.view.enrollEditAccountsCard.segAccountFeatures.info.segData[0][1];
    var typeIndices = this.view.accountTypesFilterMenu.segStatusFilterDropdown.selectedIndices;
    var ownershipIndices = this.view.ownershipFilterMenu.segStatusFilterDropdown.selectedIndices;
    selFilter[0][1] = [];
    selFilter[0][0] = [];    
    var selTypeInd = null;
    var selOwnershipInd = null;
    //get selected types
    var types = "";
    selTypeInd = typeIndices ? typeIndices[0][1] : [];
    for (var i = 0; i < selTypeInd.length; i++) {
      selFilter[0][0].push(this.view.accountTypesFilterMenu.segStatusFilterDropdown.data[selTypeInd[i]].lblDescription);
    }
    //get ownership types
    var types = "";
    selOwnershipInd = ownershipIndices ? ownershipIndices[0][1] : [];
    for (var j = 0; j < selOwnershipInd.length; j++) {
      selFilter[0][1].push(this.view.ownershipFilterMenu.segStatusFilterDropdown.data[selOwnershipInd[j]].lblDescription);
    }
    if (selFilter[0][0].length === 0 || selFilter[0][1].length === 0) { //none selected - show no results
      dataToShow = [];
    }else if(selFilter[0][0].length ===this.view.accountTypesFilterMenu.segStatusFilterDropdown.data.length && selFilter[0][1].length==this.view.ownershipFilterMenu.segStatusFilterDropdown.data.length)
      dataToShow= accountsData;
    else if (selFilter[0][0].length > 0 && selFilter[0][1].length > 0) {//both filters selected
      dataToShow = accountsData.filter(function(rec){
        if(selFilter[0][0].indexOf(rec.lblAccountType.text) >= 0 && selFilter[0][1].indexOf(rec.lblAccountHolder.text) >= 0){
          return rec;
        }
      });
    } else { //single filter selected
    }
    return dataToShow;
  },
  /*
  * on click of option in the accounts tab filters
  */
  onRowClickOfAccountsTabFilters : function(){
    var accountSegData = this.view.enrollEditAccountsCard.segAccountFeatures.info.segData;
    var filteredData = this.filterAccountsOnTypeOwnership();
    if(filteredData.length > 0){
      var sectionData = accountSegData[0][0];
      this.view.enrollEditAccountsCard.segAccountFeatures.setData([[sectionData,filteredData]]);
    }else{
      this.view.enrollEditAccountsCard.segAccountFeatures.setData([]);
    }
  },
  /*
  * set account types data to filter in features/limits tabs
  * @param: option(features:1,limits:2)
  */
  setFilterDataInFeaturesLimitsTab : function(option){
    var self =this;
    var accTypes = [], listBoxData = [], custId = "";
    var widgetDataMap = {
      "lblDescription": "lblDescription",
      "imgCheckBox": "imgCheckBox",
      "flxCheckBox":"flxCheckBox",
      "flxSearchDropDown": "flxSearchDropDown"
    };
    if(option === 1)
      custId = this.view.customersDropdownFeatures.lblSelectedValue.info.customerId;
    else
      custId = this.view.customersDropdownLimits.lblSelectedValue.info.customerId;
    //var selCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var userDetailsObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var accounts = userDetailsObj.accounts;
    //get the accoun types available
    accounts.forEach(function(accountObj,key){
      if(accountObj.isEnabled === "true" || accountObj.isAssociated === "true"){
        if(accTypes.indexOf(accountObj.accountType) < 0){
          accTypes.push(accountObj.accountType);
        }
      }
    });
    //map filtered account types to segmnet
    listBoxData = accTypes.map(function(rec){
      return {
        "lblDescription": rec,
        "imgCheckBox": {"src":self.AdminConsoleCommonUtils.checkboxnormal},
        "template": "flxSearchDropDown"
      };
    });
    this.view.customListBoxAccounts.segList.widgetMap = widgetDataMap;
    this.view.customListBoxAccounts.segList.setData(listBoxData);
    var arr = [];
    for(var i= 0; i< listBoxData.length; i++){
      arr.push(i);
    }
    this.view.customListBoxAccounts.segList.setData.info = {"prevSelInd": JSON.stringify(arr),
                                                            "selectedText": arr.length+" "+kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Selected")};
    this.view.customListBoxAccounts.segList.selectedIndices = [[0,arr]];
    this.view.customListBoxAccounts.lblSelectedValue.text = this.view.customListBoxAccounts.segList.setData.info.selectedText;
    this.view.forceLayout();
  },
  /*
  * filter the account level features/limits based on selected acc types
  * @param: option(1:features,2:limits)
  * @return: filtered feature/limits card components
  */
  filterFeaturesLimitsBasedOnAccType : function(option){
    var accountCard = (option ===1) ? this.view.flxEnrollEditAccFeaturesList.widgets() : this.view.flxEnrollEditAccLimitsList.widgets();
    var typeIndices = this.view.customListBoxAccounts.segList.selectedIndices;
    var selFilter = [],dataToShow = [];
    //get selected types
    var types = "";
    var selTypeInd = typeIndices ? typeIndices[0][1] : [];
    for (var i = 0; i < selTypeInd.length; i++) {
      selFilter.push(this.view.customListBoxAccounts.segList.data[selTypeInd[i]].lblDescription);
    }
    if (selFilter.length === 0 ) { //none selected
        dataToShow = [];
    } else if(selFilter.length === this.view.customListBoxAccounts.segList.data.length){ //all selected
      for(var i=0;i<accountCard.length;i++){
        dataToShow.push(accountCard[i]);
      }
    } else{
      for(var i=0;i<accountCard.length;i++){
        if(selFilter.indexOf(accountCard[i]["lblData1"].text) >= 0){
          dataToShow.push(accountCard[i]);
        }
      }
    }
    this.view.customListBoxAccounts.segList.setData.info.selectedText = this.view.customListBoxAccounts.lblSelectedValue.text;
    return dataToShow;
  },
  /*
  * validations on click of enroll now button
  * @return: true/false
  */
  validateOnClickOfEnroll : function(){
    var segData = this.view.segEnrollCustList.data;
    for(var i=0; i< segData.length; i++){
      var isValid = this.validateServiceRoleSelection(i);
      if(!isValid) break;
    }
    return isValid;
  },
  /*
  * set status data in search screen
  * @param: status configuration response
  */
  setCustomerStatusListData : function(statusConfiguration){
    var configuration = JSON.parse(statusConfiguration.value);
    var stautsCodes = configuration.code ? configuration.code : [];
    var statusList = stautsCodes.reduce(
      function (arr, record) {
        return arr.concat([[record.codeId, record.codeName]]);
      }, [["select", "Select a status"]]
    );
    this.view.lstBoxSearchParam23.masterData = statusList;
    this.view.lstBoxSearchParam23.selectedKey = "select";
    
  },
  /*
  * set ownership filter data on expand of each account in bulk update popup
  * @param: selected section accounts data
  */
  setDataForOwnershipFilterBulk : function(accountsData){
    var self = this;
    var widgetMap = {
      "flxSearchDropDown": "flxSearchDropDown",
      "flxCheckBox": "flxCheckBox",
      "imgCheckBox": "imgCheckBox",
      "lblDescription": "lblDescription"
    };
    var ownershipList =[], maxSizeOwnerTypeText ="";
    for(var i=0;i<accountsData.length;i++){
      if(!ownershipList.includes(accountsData[i].lblAccountHolder.text))
        ownershipList.push(accountsData[i].lblAccountHolder.text);
    }
    var ownershipData = ownershipList.map(function(rec){
      maxSizeOwnerTypeText=rec.length > maxSizeOwnerTypeText.length ? rec: maxSizeOwnerTypeText;
      return {
        "flxSearchDropDown": "flxSearchDropDown",
        "flxCheckBox": "flxCheckBox",
        "imgCheckBox": self.AdminConsoleCommonUtils.checkboxnormal,
        "lblDescription": rec
      };
    });
    this.view.bulkUpdateFeaturesLimitsPopup.filterMenu.segStatusFilterDropdown.widgetDataMap = widgetMap;
    this.view.bulkUpdateFeaturesLimitsPopup.filterMenu.segStatusFilterDropdown.setData(ownershipData);
    this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.width=this.AdminConsoleCommonUtils.getLabelWidth(maxSizeOwnerTypeText)+55+"px";
    var selOwnerInd = [];
    for(var j=0;j<ownershipList.length;j++){
      selOwnerInd.push(j);
    }
    this.view.bulkUpdateFeaturesLimitsPopup.filterMenu.segStatusFilterDropdown.selectedIndices = [[0,selOwnerInd]];
    this.view.forceLayout();
  },
  /*
  * set ownership filter data on expand of each account in bulk update popup
  */
  filterAccountRowsInBulkUpdate : function(){
    var selFilter =[], dataToShow =[],count = 0;
    var selInd = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.selectedsectionindex;
    var segData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.allData;
    var accSegData = this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    var selectedAccType = accSegData[selInd][0].lblFeatureName;
    var sectionData = segData[selectedAccType].sectionData;
    var accountsData = segData[selectedAccType].rowData;
    var ownershipIndices = this.view.bulkUpdateFeaturesLimitsPopup.filterMenu.segStatusFilterDropdown.selectedIndices;
    var selOwnershipInd = ownershipIndices ? ownershipIndices[0][1] : [];
    for (var j = 0; j < selOwnershipInd.length; j++) {
      selFilter.push(this.view.bulkUpdateFeaturesLimitsPopup.filterMenu.segStatusFilterDropdown.data[selOwnershipInd[j]].lblDescription);
    }
    for(var i=0;i<accountsData.length; i++){
      if (selFilter.indexOf(accountsData[i].lblAccountHolder.text) >= 0){
        accountsData[i].flxContractEnrollAccountsEditRow.isVisible = true;
        count = count +1;
      }
      else
        accountsData[i].flxContractEnrollAccountsEditRow.isVisible = false;
    }
    var headerChecboxImg = count === 0 ? this.AdminConsoleCommonUtils.checkboxnormal :
        (count === accountsData.length ? this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxPartial);
    sectionData.imgSectionCheckbox.src= headerChecboxImg;
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.rowTemplate = "flxContractEnrollAccountsEditRow";
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setSectionAt([sectionData,accountsData], selInd);
    this.view.bulkUpdateFeaturesLimitsPopup.flxFilterMenu.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * add customer to enroll segment after creating contract for them
  * @param: create contract payload,response
  */
  addCustomersFromCreatedContract : function(contractInfo){
    var enrollSegData, newSegRowToAdd =[], rowsIndexArr =[],updatedServiceId = "";
    this.showEnrollCustomer();
    var contractDetails = contractInfo.contractDetails;
    var customers = JSON.parse(contractDetails.contractCustomers);
    for(var i=0; i<customers.length; i++){
      var data ={"Name": customers[i].coreCustomerName,
                 "Customer_id": customers[i].coreCustomerId,
                 "serviceId": contractDetails.serviceDefinitionId,
                 "custDetails": ""};
      var custDetails ={
        "contractId": contractInfo.contractId || "",
        "contractName": contractDetails.contractName,
        "addressLine1": contractDetails.address[0] ? contractDetails.address[0].addressLine1 : "",
        "addressLine2": contractDetails.address[0] ? contractDetails.address[0].addressLine2 : "",
        "coreCustomerId": customers[i].coreCustomerId,
        "coreCustomerName": customers[i].coreCustomerName,
        "email": contractDetails.communication[0] ? contractDetails.communication[0].email : "",
        "isBusiness":customers[i].isBusiness,
        "phone": contractDetails.communication[0] ? contractDetails.communication[0].phoneNumber : "",
        "zipCode": contractDetails.address[0] ? contractDetails.address[0].zipCode : "",
        "autoSyncAccounts": this.autoSyncAccountsFlag
      };
      data.custDetails = custDetails;
      var existingCustObj = this.checkIfCustomerAlreadyAdded(customers[i].coreCustomerId);
      this.isEditUserAccessVisited[customers[i].coreCustomerId] = false;
      if(existingCustObj.isExists === false){ //customer does not exist
        enrollSegData = this.mapCustomerDataforEnrollSeg(data);
        enrollSegData.lstBoxService.enable = false;
        enrollSegData.lstBoxService.selectedKey = data.serviceId;
        enrollSegData.lstBoxService.skin = "sknLbxborderd7d9e03pxradiusF3F3F3Disabled";
        newSegRowToAdd.push(enrollSegData);
      } else{ //customer exists - reset role
        var existingCustDetails = existingCustObj.existingCust;
        existingCustDetails.flxPrimary.isVisible = existingCustDetails.flxPrimary.isVisible;
        updatedServiceId = data.serviceId;
        existingCustDetails.lstBoxService.masterData = this.getServiceListBoxMappedData();
        existingCustDetails.lstBoxService.selectedKey = data.serviceId;
        existingCustDetails.lstBoxService.selectedkey = data.serviceId;
        existingCustDetails.lstBoxRole.selectedKey = "select";
        existingCustDetails.lstBoxRole.selectedkey = "select";
        this.view.segEnrollCustList.setDataAt(existingCustDetails,existingCustObj.rowInd);
        rowsIndexArr.push(existingCustObj.rowInd);
      }
    }
    //append the newly added customers to enroll segment
    for(var k=0; k<newSegRowToAdd.length; k++){
      rowsIndexArr.push(this.view.segEnrollCustList.data.length);
      this.view.segEnrollCustList.addDataAt(newSegRowToAdd[k],this.view.segEnrollCustList.data.length);
    }
    //fetch roles list to set
    if(newSegRowToAdd.length > 0)
      this.fetchRolesforSelectedService(newSegRowToAdd[0].lstBoxService.selectedKey,rowsIndexArr);
    else if(newSegRowToAdd.length === 0 && rowsIndexArr.length > 0)
      this.fetchRolesforSelectedService(updatedServiceId,rowsIndexArr);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtons.btnSave,true,true);
  },
  /*
  * remove customers in enroll seg when any customers deleted from contract edit
  * @param:edit temp contract payload
  */
  removeContractDelCustFromEnrollSeg : function(contractPayload){
    var customers = JSON.parse(contractPayload.contractCustomers);
    var segCustomers = this.view.segEnrollCustList.data;
    var custId =[]; 
    for(var j=0;j<customers.length; j++){
      custId.push(customers[j].coreCustomerId)
    }
     //remove the customer deleted from temp contract if any
    for(var i=0; i<segCustomers.length; i++){
      if(segCustomers[i].custDetails.contractId === "" &&
         custId.indexOf(segCustomers[i].custId) < 0){
        this.presenter.deleteAccountsFeaturesForEnrollCust(segCustomers[i].custId);
        this.view.segEnrollCustList.removeAt(i);
        
      }
    }
  },
  /*
  * remove any temp contract customers when service is updated for primary cust
  * @param : curr row index
  */
  removeTempContractCustFromEnrollSeg : function(currRowInd){
    var segCustomers = this.view.segEnrollCustList.data;
    for(var i=0; i<segCustomers.length; i++){
      if(segCustomers[i].custDetails.contractId === "" && i !== currRowInd){
        this.presenter.deleteAccountsFeaturesForEnrollCust(segCustomers[i].custId);
        this.view.segEnrollCustList.removeAt(i);
        
      }
    }
  },
  /*
  * filter the user accounts based acounts selected in temp contract
  * @param: accounts list, customer id
  * @return : filter user accounts to show
  */
  getFilteredAccFromTempContract : function(accounts,custId){
    var filteredAcc =[];
    var enrollSegData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var contractExists = enrollSegData.custDetails.contractId !== "" ? true : false;
    var tempContractDetails = this.presenter.getCreateContractPayload();
    if(!contractExists && tempContractDetails && Object.keys(tempContractDetails).length > 0){
      var contractCust = JSON.parse(tempContractDetails.contractCustomers);
      for(var i=0;i<contractCust.length; i++){
        if(contractCust[i].coreCustomerId === custId){
          var contractAccounts = contractCust[i].accounts;
          var userAccounts = accounts;
          for(var j=0; j<userAccounts.length; j++){
            var userAccId = userAccounts[j].accountNumber ||userAccounts[j].accountId;
            for(var k=0; k<contractAccounts.length; k++){
              var contractAccId = contractAccounts[k].accountNumber ||contractAccounts[k].accountId;
              //filter for enabled accounts in contract
              if(userAccId === contractAccId){
                if(contractAccounts[k].isEnabled && contractAccounts[k].isEnabled === "false"){
                  //ignore the account
                }else{
                  filteredAcc.push(userAccounts[j]);
                }
                break;
              }
            }
          }
          break;
        }
      }
       return filteredAcc;
    }
    else{ // if no temp contract
       return accounts;
    }
  },
  /*
  * filter the user features based on features selected in temp contract
  * @param: features list, customer id
  * @return : filter user features to show
  */
  getFilteredFeaturesFromTempContract : function(features,custId,category){
    var filteredFeatures =[],contractFeatureActions = [];;
    var enrollSegData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var contractExists = enrollSegData.custDetails.contractId !== "" ? true : false;
    var tempContractDetails = this.presenter.getCreateContractPayload();
    if(!contractExists && tempContractDetails && Object.keys(tempContractDetails).length > 0) {
      var contractCust = JSON.parse(tempContractDetails.contractCustomers);
      for(var i=0;i<contractCust.length; i++){
        if(contractCust[i].coreCustomerId === custId){
          var contractFeatures = contractCust[i].features;
          //get all the enabled features from temp contract
          for(var j=0; j<contractFeatures.length; j++){
            var contractActions = contractFeatures[j].actions || contractFeatures[j].permissions;
            for(var k=0; k<contractActions.length; k++){
              if(contractActions[k].isAllowed === "true")
                contractFeatureActions.push(contractFeatures[j].featureId +"$"+contractActions[k].actionId);
            }
          }
          //filter features for user based on contract features
          var userFeatures = features;
          for(var p=0; p<userFeatures.length; p++){
            var filterActions = [];
            var userActions = userFeatures[p].actions || userFeatures[p].permissions;
            for(var q=0; q<userActions.length; q++){
              var id = userFeatures[p].featureId+"$"+userActions[q].actionId;
              if(contractFeatureActions.includes(id)){
                filterActions.push(userActions[q]);
              }
            }
            if(filterActions.length > 0){
              userFeatures[p].actions = filterActions;
              filteredFeatures.push(userFeatures[p]);
            }
          }
          break;
        }
      }
      return filteredFeatures;
    } 
    else{ //if no temp contract
      return features;
    }   
  },
  
  
  /******  CREATE/EDIT CONTRACT FUNCTIONS  *****/
  
  
  /*
  * enroll form
  * show contract screen on clik of create new contract
  */
  onCreateContractClick : function(){
    var scopeObj = this;
    scopeObj.view.tbxRecordsSearch.text="";
    scopeObj.action = scopeObj.actionConfig.create;
    scopeObj.updateButtonsText(false);
    scopeObj.showCreateContractScreen();
    scopeObj.setContractButtonsSkin(false);
    scopeObj.enableAllTabs(false);
    scopeObj.presenter.getServiceDefinitionsForContracts("contracts");
    scopeObj.view.segAddedCustomers.setVisibility(true);
    scopeObj.view.btnSelectCustomers.setVisibility(true);
    scopeObj.view.lblContractCustomersHeader.text= kony.i18n.getLocalizedString("i18n.contracts.selectCustomers_LC");
    scopeObj.view.flxNoCustomersAdded.setVisibility(false);
    scopeObj.showContractServiceScreen();
    scopeObj.monetaryLimits={};
    scopeObj.createContractRequestParam={
      "contractName": "",
      "serviceDefinitionName": "",
      "serviceDefinitionId": "",
      "faxId": "",
      "communication": [],
      "address": [],
      "contractCustomers": []
    };
    scopeObj.view.typeHeadContractCountry.tbxSearchKey.info = {"isValid":false,"data":""};
    scopeObj.getCountrySegmentData();
    scopeObj.view.forceLayout();
  },
  updateButtonsText : function(isEdit){
    var btnText=isEdit? kony.i18n.getLocalizedString("i18n.contracts.updateContract_UC"):kony.i18n.getLocalizedString("i18n.Contracts.createContract");
    this.view.commonButtonsCustomers.btnSave.text=btnText;
    this.view.contractDetailsCommonButtons.btnSave.text=btnText;
    this.view.commonButtonsContractAccounts.btnSave.text=btnText;
    this.view.commonButtonsContractFA.btnSave.text=btnText;
    this.view.commonButtonsContractLimits.btnSave.text=btnText;
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set skin for all buttons in create contract
  */
  setContractButtonsSkin : function(isEdit){
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsServiceDetails.btnSave,true,isEdit);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsCustomers.btnSave,true,isEdit);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsCustomers.btnNext,false,isEdit);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.contractDetailsCommonButtons.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.contractDetailsCommonButtons.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractAccounts.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractAccounts.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnNext,false,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractLimits.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractLimits.btnNext,false,true);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * enable all vertical tabs  in create contract
  */
  enableAllTabs : function(isEnable){
    for (let x=0;x<6;x++){
      this.view.verticalTabsContract["flxOption"+x].setEnabled(isEnable);
    }
    this.view.forceLayout();
  },
  /*
  * enroll form
  * show service selection screen in contract
  */
  showContractServiceScreen: function(){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow0,this.view.verticalTabsContract.btnOption0);
    this.hideAllScreens();
    if(this.view.tbxRecordsSearch.text.length>0)
      this.view.flxClearRecordsSearch.onClick();
    this.view.flxContractServiceTab.setVisibility(true);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * toggle selected vertical tab skins
  */
  toggleContractVerticalTabs: function(imgPath,btnPath){
    this.tabUtilVerticleArrowVisibilityFunction(
      [this.view.verticalTabsContract.flxImgArrow0,
       this.view.verticalTabsContract.flxImgArrow1,
       this.view.verticalTabsContract.flxImgArrow2,
       this.view.verticalTabsContract.flxImgArrow3,
       this.view.verticalTabsContract.flxImgArrow4,
      this.view.verticalTabsContract.flxImgArrow5],imgPath);  
    var widgetArray = [this.view.verticalTabsContract.btnOption0,this.view.verticalTabsContract.btnOption1,this.view.verticalTabsContract.btnOption2,this.view.verticalTabsContract.btnOption3,this.view.verticalTabsContract.btnOption4,this.view.verticalTabsContract.btnOption5];
    this.tabUtilVerticleButtonFunction(widgetArray,btnPath);
  },
  hideAllScreens: function(){
    this.view.flxContractServiceTab.setVisibility(false);
    this.view.flxContractCustomersTab.setVisibility(false);
    this.view.flxContractDetailsTab.setVisibility(false);
    this.view.flxContractAccounts.setVisibility(false);
    this.view.flxContractFA.setVisibility(false);
    this.view.flxContractLimits.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * create service definition cards dynamically
  */
  setContractServiceCards : function(services){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow0,this.view.verticalTabsContract.btnOption0);
    this.view.flxContractServiceCards.removeAll();
    var screenWidth = kony.os.deviceInfo().screenWidth;
    var left =20, top =20, width = 0;
    for (var i = 0; i < services.length; i++) {
      width = (screenWidth -305-230-35-60-60)/3;
      var alertServiceCard = new com.adminConsole.contracts.serviceCard({
        "id": "serviceCard"+i,
        "isVisible": true,
        "width": width + "px",
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "top": top+"dp",
        "left": left +"dp"
      }, {}, {});
      left = left + width + 20;
      if(i!== 0 && i%3 === 0){ //new row
        alertServiceCard.left = "20dp";
        left = 20 + width + 20;
        top = top + 80 + 20;
        alertServiceCard.top = top +"dp";
      } 
      this.setServiceCardData(services[i], alertServiceCard,width-40);
    }
  },
  /*
  * enroll form
  * set data to the service definition card
  * category data, card to add
  */
  setServiceCardData : function(serviceDefinition, serviceCard,width){
    var self = this;
    var tempContractDetails = this.presenter.getCreateContractPayload();
    serviceCard.lblCategoryName.info ={"catId":serviceDefinition.id};
    var labelCharCount=Math.ceil(width/7);
    serviceCard.lblCategoryName.text=this.AdminConsoleCommonUtils.getTruncatedString(serviceDefinition.name, labelCharCount, labelCharCount-3);
    serviceCard.lblCategoryName.toolTip = serviceDefinition.name;
    serviceCard.lblContent1.info={"groupId":serviceDefinition.serviceType};
    if(serviceDefinition.serviceType === "TYPE_ID_RETAIL"){
      serviceCard.lblContent1.text=kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.RetailBanking");
      serviceCard.flxServiceTag.skin="sknflxCustomertagRedRadius4px";
      serviceCard.flxServiceTag.width="100px";
    }
    else if(serviceDefinition.serviceType === "TYPE_ID_BUSINESS"){
      serviceCard.lblContent1.text=kony.i18n.getLocalizedString("i18n.frmCustomerManagement.BusinessBanking");
      serviceCard.flxServiceTag.skin="sknflxCustomertagPurpleRadius4px";
      serviceCard.flxServiceTag.width="115px";
    }
    if(this.action === this.actionConfig.edit && tempContractDetails.serviceDefinitionId === serviceDefinition.id){
      serviceCard.skin="sknFlxbgF8F9FAbdr003E75Shadow";
      this.selectedServiceCard=serviceCard.id;
    }
    serviceCard.onClick = function(){
      //should make all the other cards skins to normal skins
      if(self.selectedServiceCard){
      var cards=self.view.flxContractServiceCards.widgets();
        self.view[self.selectedServiceCard].skin="sknFlxbgFFFFFFbdrD7D9E0rd3px";
        if(self.createContractRequestParam.contractCustomers.length!==0)
          self.presenter.getServiceDefinitionFeaturesAndLimits({"serviceDefinitionId":serviceCard.lblCategoryName.info.catId});
      }
      self.createContractRequestParam.serviceDefinitionId=serviceCard.lblCategoryName.info.catId;
      self.createContractRequestParam.serviceDefinitionName=serviceCard.lblCategoryName.toolTip;
      self.view.lstBoxContractService.masterData=[[serviceCard.lblCategoryName.toolTip,serviceCard.lblCategoryName.toolTip]];
      self.view.lstBoxContractService.selectedKey= self.view.lstBoxContractService.masterData[0][0];
      serviceCard.skin="sknFlxbgF8F9FAbdr003E75Shadow";
      self.AdminConsoleCommonUtils.setEnableDisableSkinForButton(self.view.commonButtonsServiceDetails.btnSave,true,true);
      self.view.verticalTabsContract.flxOption0.setEnabled(true);
      self.view.verticalTabsContract.flxOption1.setEnabled(true);
      self.selectedServiceCard=serviceCard.id;
    }
    this.view.flxContractServiceCards.add(serviceCard);
    this.view.forceLayout();
  },
   /*
   * enroll form
  * set filter data in contract services tab
  * @param: search result
  */
  setDataToServiceTypeFilter : function(data){
    var self = this;
    var statusList=[],maxLenText = "";
    for(var i=0;i<data.length;i++){
      if(!statusList.contains(data[i].serviceType))
        statusList.push(data[i].serviceType);
    }
    var widgetMap = {
      "serviceType": "serviceType",
      "flxSearchDropDown": "flxSearchDropDown",
      "flxCheckBox": "flxCheckBox",
      "imgCheckBox": "imgCheckBox",
      "lblDescription": "lblDescription"
    };
    var statusData = statusList.map(function(rec){
      maxLenText = (rec.length > maxLenText.length) ? rec : maxLenText;     
      return {
        "serviceType": rec,
        "flxSearchDropDown": "flxSearchDropDown",
        "flxCheckBox": "flxCheckBox",
        "imgCheckBox": "checkbox.png",
        "lblDescription": rec === "TYPE_ID_RETAIL"?kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.RetailBanking"):
                               rec === "TYPE_ID_BUSINESS"?kony.i18n.getLocalizedString("i18n.frmCustomerManagement.BusinessBanking"):"Retail & Business Banking"
      };
    });
    self.view.serviceTypeFilterMenu.segStatusFilterDropdown.widgetDataMap = widgetMap;
    self.view.serviceTypeFilterMenu.segStatusFilterDropdown.setData(statusData);
    var selStatusInd = [];
    for(var j=0;j<statusList.length;j++){
      selStatusInd.push(j);
    }
    self.view.serviceTypeFilterMenu.segStatusFilterDropdown.selectedIndices = [[0,selStatusInd]];
    //set filter width
    self.view.flxServiceTypeFilter.width = self.AdminConsoleCommonUtils.getLabelWidth(maxLenText)+35+"px";
    self.view.forceLayout();
  },
  /*
  * enroll form
  * filter the company's list based on the business type selected
  */
  performServiceTypeFilter : function(){
    var self = this;
    var selType = [];
    var selInd;
    var dataToShow = [];
    var allData = self.view.flxContractServiceCards.info.totalRecords;
    var segStatusData = self.view.serviceTypeFilterMenu.segStatusFilterDropdown.data;
    var indices = self.view.serviceTypeFilterMenu.segStatusFilterDropdown.selectedIndices;
    if(indices){
      selInd = indices[0][1];
      for(var i=0;i<selInd.length;i++){
        selType.push(self.view.serviceTypeFilterMenu.segStatusFilterDropdown.data[selInd[i]].serviceType);
      }
      if (selInd.length === segStatusData.length) { //all are selected
        self.setContractServiceCards(allData);
        self.view.flxContractServiceCards.setVisibility(true);
        self.view.flxNoServiceSearchResults.setVisibility(false);
      } else {
        dataToShow = allData.filter(function(rec){
          if(selType.indexOf(rec.serviceType) >= 0){
            return rec;
          }
        });
        if (dataToShow.length > 0) {
          self.setContractServiceCards(dataToShow);
          self.view.flxContractServiceCards.setVisibility(true);
          self.view.flxNoServiceSearchResults.setVisibility(false);
        } else {
          self.view.flxContractServiceCards.setVisibility(false);
          self.view.flxNoServiceSearchResults.setVisibility(true);
        }
      }
    } else{
      self.view.flxContractServiceCards.setVisibility(false);
      self.view.flxNoServiceSearchResults.setVisibility(true);
    }
  },
  /*
  * enroll form
  * search for service definitions in create contracts
  */
  searchServiceCards : function(){
    var searchText=this.view.tbxRecordsSearch.text.toLowerCase();
    var serviceDef=this.view.flxContractServiceCards.info.totalRecords;
    var serviceName="";
    var searchResults=serviceDef.filter(function(service){
      serviceName=service.name.toLowerCase();
      if(serviceName.indexOf(searchText)>=0)
        return service;
    });
    if(searchResults.length>0){
      this.setContractServiceCards(searchResults);
      this.view.flxNoServiceSearchResults.setVisibility(false);
      this.view.flxContractServiceCards.setVisibility(true);
    }
    else{
      this.view.flxNoServiceSearchResults.setVisibility(true);
      this.view.flxContractServiceCards.setVisibility(false);
    }
    this.view.forceLayout();
  },
  /*
  * enroll form
  * show add customers screen in contracts
  */
  showContractCustomersScreen: function(isNextClick){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow1,this.view.verticalTabsContract.btnOption1);
    if(isNextClick)
      this.view.flxContractServiceTab.setVisibility(false);
    else
      this.hideAllScreens();
    this.view.verticalTabsContract.flxOption0.setEnabled(true);
    this.view.verticalTabsContract.flxOption1.setEnabled(true);
    this.view.flxContractCustomersTab.setVisibility(true);
    this.setSelectedCustomersData();
    this.view.forceLayout();
  },
  /*
  * enroll form
  * show contract details scren in contract
  */
  showContractDetailsScreen : function(isNextClick){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow2,this.view.verticalTabsContract.btnOption2);
    if(isNextClick)
      this.view.flxContractCustomersTab.setVisibility(false);
    else
      this.hideAllScreens();
    this.view.contractDetailsEntry1.flxInlineError.setVisibility(false);
    this.view.flxContractDetailsTab.setVisibility(true);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set contract details
  */
  setContractDetails : function(){
    var contractData={};
    var contact="";
    if(this.action === this.actionConfig.create){
      var primaryData=this.primaryContractCustomer;
      contractData.name=primaryData.coreCustomerName;
      contractData.faxId=primaryData.faxId?primaryData.faxId:"";
      contractData.email=primaryData.email?primaryData.email:"";
      contractData.address1=primaryData.addressLine1?primaryData.addressLine1:"";
      contractData.address2=primaryData.addressLine2?primaryData.addressLine2:"";
      contractData.zipCode=primaryData.zipCode?primaryData.zipCode:"";
      contractData.country=primaryData.country?primaryData.country:"";
      contractData.city=primaryData.city?primaryData.city:"";
      contact=primaryData.phone.split("-");
    }else{
      var contractDetails=this.presenter.getCreateContractPayload();
      var contractCommunication = JSON.parse(contractDetails.communication);
      var contractAddr = JSON.parse(contractDetails.address);
      this.view.lstBoxContractService.masterData=[[contractDetails.serviceDefinitionId,contractDetails.serviceDefinitionName]];
      contractData.name=contractDetails.contractName;
      contractData.faxId=contractDetails.faxId ?contractDetails.faxId:"";
      contractData.email= contractCommunication[0] && contractCommunication[0].email ? contractCommunication[0].email:"";
      contractData.address1= contractAddr[0] && contractAddr[0].addressLine1 ? contractAddr[0].addressLine1:"";
      contractData.address2= contractAddr[0] && contractAddr[0].addressLine2 ? contractAddr[0].addressLine2:"";
      contractData.zipCode=  contractAddr[0] && contractAddr[0].zipCode ? contractAddr[0].zipCode:"";
      contractData.country= contractAddr[0] && contractAddr[0].country ? contractAddr[0].country:"";
      contractData.city= contractAddr[0] && contractAddr[0].city ? contractAddr[0].city:"";
      contact=[contractCommunication[0].phoneCountryCode,contractCommunication[0].phoneNumber];
    }
    if(this.view.segAddedCustomers.data.length>1)
      this.view.flxContractNotification.setVisibility(true);
    else
      this.view.flxContractNotification.setVisibility(false);
    this.view.lstBoxContractService.selectedKey=this.view.lstBoxContractService.masterData[0][0];
    this.view.lstBoxContractService.setEnabled(false);
    this.view.contractDetailsEntry1.tbxEnterValue.text=contractData.name;
    this.view.contractDetailsEntry2.tbxEnterValue.text=contractData.faxId;
    this.view.contractContactNumber.txtISDCode.text=contact[0]?contact[0].trim():"";
    this.view.contractContactNumber.txtContactNumber.text=contact[1]?contact[1].trim():"";
    this.view.contractDetailsEntry3.tbxEnterValue.text=contractData.email;
    this.view.contractDetailsEntry4.tbxEnterValue.text=contractData.address1;
    this.view.contractDetailsEntry5.tbxEnterValue.text=contractData.address2;
    this.view.contractDetailsEntry6.tbxEnterValue.text=contractData.zipCode;
    //this.view.contractDetailsEntry7.tbxEnterValue.text=contractData.country;
    this.view.typeHeadContractCountry.tbxSearchKey.text = contractData.country;
    this.view.typeHeadContractCountry.tbxSearchKey.info={"isValid": true};
    this.view.contractDetailsEntry8.tbxEnterValue.text=contractData.city;
    if(this.view.contractDetailsEntry1.flxInlineError.isVisible)
      this.view.contractDetailsEntry1.flxInlineError.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * show popup for customer search
  */
  showCustomerSearchPopup : function(isFirstTime){
    this.resetCoreCustomerSearch();
    this.setNormalSkinToCoreSearch();
    this.view.flxSearchFilter.setVisibility(true);
    this.view.lblIconArrow.text="";
    this.view.commonButtonsContractSearchCust.btnNext.setVisibility(false);
    this.view.flxCustomerSearchPopUp.setVisibility(true);
    this.view.flxCustomersBreadcrumb.setVisibility(false);
    this.view.flxAddedCustomerInfo.setVisibility(false);
    this.view.flxCustomerSearchHeader.setVisibility(true);
    this.view.imgCustomerSearchError.setVisibility(false);
    this.view.lblCustomerSearchError.setVisibility(false);
    this.view.fonticonrightarrowSearch.text="";
    this.view.commonButtons.btnCancel.skin="sknbtnffffffLatoRegular4f555dBorder1px485c75";
    this.view.btnShowHideAdvSearch.text=kony.i18n.getLocalizedString("i18n.contracts.showAdvancedSearch");
    this.view.flxRow2.setVisibility(false);
    this.view.flxRow3.setVisibility(false);
    this.view.flxColumn13.setVisibility(false);
    this.view.flxCustomerAdvSearch.setVisibility(true);
    this.view.flxCustomerDetailsContainer.setVisibility(true);
    this.view.flxRelatedCustomerSegContracts.setVisibility(false);
    this.view.lblNoCustomersSearched.text=kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.NoresultsSearchForaCustomer");
    this.view.flxNoCustomersSearched.setVisibility(true);
    this.view.lblRelatedcustSubHeading.setVisibility(false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractSearchCust.btnSave,true,false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractSearchCust.btnNext,false,false);
    this.view.flxSearchBreadcrumb.info={"added":[]};
    this.view.flxSearchFilter.info={"added":[]};
    this.view.segBreadcrumbs.setData([]);
    var i=this.view.flxSearchBreadcrumb.widgets().concat([]);
    this.view.flxSearchFilter.removeAll();
    for(var x=2;x<i.length-1;x++)
    	this.view.flxSearchBreadcrumb.remove(i[x]);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * add the searched customer from customer search in contracts flow
  */
  addCustomer : function(customerInfo){
    this.view.flxCustomerSearchPopUp.info={"action":"SEGMENTCLICK"};
    this.view.commonButtonsContractSearchCust.btnNext.setVisibility(true);
    this.view.flxCustomerSearchHeader.setVisibility(false);
    this.view.flxCustomersBreadcrumb.setVisibility(true);
    this.view.flxAddedCustomerInfo.setVisibility(true);
    this.view.flxCustomerAdvSearch.setVisibility(false);
    this.view.flxCustomerDetailsContainer.setVisibility(false);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractSearchCust.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractSearchCust.btnNext,false,true);
    if(this.view.flxSearchBreadcrumb.info.added)
    this.addBreadcrumb(customerInfo);
    var isAdded=false;
    for(var i=0;i<this.selectedCustomers.length;i++){
      if(this.selectedCustomers[i].coreCustomerId === customerInfo.coreCustomerId&&this.selectedCustomers[i].isSelected)
        isAdded=true;
    }
    if(isAdded === false)
    	this.addCustomerTag(this.view.flxSearchFilter,customerInfo.coreCustomerName,customerInfo.coreCustomerId);
    this.view.flxLoading2.setVisibility(true);
    this.presenter.getRelatedCustomers({"coreCustomerId" : customerInfo.coreCustomerId},"contracts");
    this.view.forceLayout();
  },
  /*
  * enroll form
  * add the selected customer tags in screen
  */
  addCustomerTag : function(tagParentFlex,customerName,id){
    var self = this;
    var tagsCount=tagParentFlex.widgets().length;
    var newTextTag = self.view.flxFilterTag.clone(tagsCount.toString());
    var lblname = tagsCount + "lblTagName";
    var imgname = tagsCount + "flxCross";
    var flexWidth= this.AdminConsoleCommonUtils.getLabelWidth(customerName,"12px Lato-Regular");
    tagParentFlex.info.added.push([customerName,id]);
    newTextTag[lblname].text = customerName;
    newTextTag[lblname].toolTip = customerName;
    newTextTag.isVisible = true;a
    newTextTag.info=id;
    newTextTag.width=flexWidth+10+10+15+"px";//labelwidth+left padding+right padding+ cross image width
    var parentWidth=tagParentFlex.frame.width;
    var leftVal=20;
    var topVal=0;
    var lineCount=1;
    for(var a=tagsCount-1;a>=0;a--){
      var i=tagParentFlex.children[a];
      leftVal=leftVal+(tagParentFlex[i].frame.width+15);
      if((leftVal+flexWidth+50)>parentWidth){
        leftVal=20;
        lineCount=lineCount+1;
      }
    }
    newTextTag.left=leftVal+"px";
    if(lineCount>1){
      newTextTag.top=(lineCount-1)*30+"px";
    }else{
      newTextTag.top=topVal+"px";
    }
    tagParentFlex.addAt(newTextTag, -1);
    newTextTag[imgname].onTouchStart = function (id) {
      self.removeSelectedCustomer(tagParentFlex,id.parent.info);
      if(tagParentFlex.widgets().length === 1){
        self.AdminConsoleCommonUtils.setEnableDisableSkinForButton(self.view.commonButtonsContractSearchCust.btnSave,true,false);
        self.AdminConsoleCommonUtils.setEnableDisableSkinForButton(self.view.commonButtonsContractSearchCust.btnNext,false,false);
      }
      self.removeTagContracts(tagParentFlex,id.parent.info);
    };
    tagParentFlex.setVisibility(true);
    this.view.forceLayout();
  },
  /*
   * function to remove a selected tag
   * @param : selectedflex id
   */
  removeTagContracts: function(tagParentFlex,id) {
    //remove the flex tag
    for(let x=0;x<tagParentFlex.info.added.length;x++){
      if(tagParentFlex.info.added[x][1] === id)
        tagParentFlex.info.added.splice(x,1);
    }    
    tagParentFlex.removeAll();
    var addedCount=tagParentFlex.info.added.length;
    var addedCustomers=tagParentFlex.info.added;
    tagParentFlex.info.added=[];
    for (var x=0;x<addedCount;x++){
      this.addCustomerTag(tagParentFlex,addedCustomers[x][0],addedCustomers[x][1]);
    }
    this.view.forceLayout();
  },
  removeSelectedCustomer: function(tagParentFlex,id){
    var removedCustId=id;
    if(tagParentFlex.id!="flxTagsContainer"){
      var relativeCustomers=this.view.segRelatedCustomersContract.data;
      var self=this;
      for(var i=0;i<this.selectedCustomers.length;i++){
        if(this.selectedCustomers[i].coreCustomerId === removedCustId){
          this.selectedCustomers[i].isSelected=false;
          if(this.view.lblDataInfo11.text==removedCustId){//if its the last tag , the current customer checkbox should be unselected
            this.view.imgCheckbox.src=this.AdminConsoleCommonUtils.checkboxnormal;
          }else{//if that customer id displayed in the current screen
            for(let x=0;x<relativeCustomers.length;x++){
              if(relativeCustomers[x].lblData1.text === removedCustId){
                relativeCustomers[x].imgCheckbox.src=this.AdminConsoleCommonUtils.checkboxnormal;
                relativeCustomers[x].flxCheckbox.onClick = function(context){self.relatedCustomersCheckboxClick(context,self.selectedCustomers[i])};
                relativeCustomers[x].flxRelatedCustomerRow.onClick = function(){self.addCustomer(self.selectedCustomers[i])};
                this.view.segRelatedCustomersContract.setData(relativeCustomers);
                break;
              }
            }
          }
          break;
        }        
      }
    }else{
      //to set removed customer checkbox to unselected      
      var segData=this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
      segData[0][0].imgCheckBox.src=this.AdminConsoleCommonUtils.checkboxnormal;
      for(var i=0;i<segData[0][1].length;i++){
        if(segData[0][1][i].imgCheckBox.src === this.AdminConsoleCommonUtils.checkboxSelected&&segData[0][1][i].custInfo.coreCustomerId === removedCustId){        
          segData[0][0].imgCheckBox.src=this.AdminConsoleCommonUtils.checkboxnormal;
          break;
        }
      }
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData(segData); 
      for(let x=0;x<this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust.length;x++){
        if(removedCustId === this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust[x].coreCustomerId){
          this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust.splice(x,1);
          break;
        }
      }
    }
  },
  showContractAccountsScreen: function(isNextClick){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow3,this.view.verticalTabsContract.btnOption3);
    if(isNextClick)
      this.view.flxContractDetailsTab.setVisibility(false);
    else
      this.hideAllScreens();
    this.view.flxContractAccounts.setVisibility(true);
    this.view.flxContractAccountsSearch.setVisibility(false);
    this.view.tbxAccountsSearch.text="";
    this.view.flxClearAccountsSearch.setVisibility(false);
    this.setCustomersDropDownList("customersDropdown");
    this.view.ContractAccountsList.lblHeading.text = kony.i18n.getLocalizedString("i18n.frmCompanies.Selected_Accounts") + ":";
    this.view.forceLayout();
  },
  showContractFAScreen : function(isNextClick){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow4,this.view.verticalTabsContract.btnOption4);
    if(isNextClick)
      this.view.flxContractAccounts.setVisibility(false);
    else
      this.hideAllScreens();
    this.view.imgContractFA.setVisibility(true);
    this.view.lblNoCustomersSelectedFA.text= kony.i18n.getLocalizedString("i18n.contracts.selectCustomerFeatures");;
    this.view.flxNoCustomerSelectedFA.setVisibility(true);
    this.view.flxContractFAList.setVisibility(false);
    this.view.flxContractFA.setVisibility(true);
    this.view.flxContractFASearch.setVisibility(false);
    this.view.tbxContractFASearch.text="";
    this.view.flxClearContractFASearch.setVisibility(false);
    this.setCustomersDropDownList("customersDropdownFA");
    this.view.ContractFAList.lblHeading.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomersController.SelectedFeatures") + ":";
    this.view.forceLayout();
  },
  showContractLimitsScreen: function(isNextClick){
    this.toggleContractVerticalTabs(this.view.verticalTabsContract.flxImgArrow5,this.view.verticalTabsContract.btnOption5);
    if(isNextClick)
      this.view.flxContractFA.setVisibility(false);
    else
      this.hideAllScreens();
    this.view.imgContractLimits.setVisibility(true);
    this.view.lblNoCustomersSelectedLimits.text=kony.i18n.getLocalizedString("i18n.contracts.selectCustomerLimits");
    this.view.flxNoCustomerSelectedLimits.setVisibility(true);
    this.view.flxContractLimitsList.setVisibility(false);
    this.view.flxContractLimits.setVisibility(true);
    this.view.flxContractLimitsSearch.setVisibility(false);
    this.view.tbxContractLimitsSearch.text="";
    this.view.flxClearContractLimitsSearch.setVisibility(false);
    this.setCustomersDropDownList("customersDropdownContractLimits");
    this.view.forceLayout();
  },
  showContractSearch : function(currFlex){
    currFlex.setVisibility(false);
    this.view.flxContractServiceTab.setVisibility(true);
    this.view.flxCreateContract.setVisibility(false);
    this.view.flxSearchCompanies.setVisibility(true);
    this.view.flxNoFilterResults.setVisibility(true);
    this.view.segSearchResults.setVisibility(false);
    this.view.mainHeader.btnAddNewOption.setVisibility(true);
    this.view.mainHeader.btnDropdownList.setVisibility(true);
    this.view.btnAddOldCompany.setVisibility(true);
    this.view.flxSettings.setVisibility(false);
    this.view.flxBreadcrumb.setVisibility(false);
    this.view.forceLayout();
  },
  setContractSearchResults : function(){
    let contractInfo = {
      "contractId": this.view.txtSearchParam2.text.trim(),
      "contractName": this.view.txtSearchParam1.text.trim(),
      "coreCustomerId": this.view.txtSearchParam4.text.trim(),
      "coreCustomerName": this.view.txtSearchParam6.text.trim(),
      "email": this.view.txtSearchParam5.text.trim(),
      "phoneCountryCode": this.view.textBoxSearchContactNumber.txtISDCode.text.trim(),
      "phoneNumber": this.view.textBoxSearchContactNumber.txtContactNumber.text.trim() ,
      "country": this.view.txtSearchParam3.text.trim(),
      "serviceDefinitionId": this.view.lstbxSearchServiceDef.selectedKey == "" ? "" :this.view.lstbxSearchServiceDef.selectedKey.trim()
      };
    let srchTxt = 'Showing Results for ';
    let keys = Object.keys(contractInfo);
    keys.forEach(function(key){
      // return in a forEach() callback is equivalent to continue
      if(contractInfo[key] === ""){
         return;
      }

      srchTxt = srchTxt +' , '+contractInfo[key];
    });
    srchTxt = srchTxt.substring(0, srchTxt.length - 1);
    this.view.lblResultsFor.text = srchTxt;
    this.presenter.getSearchContract(contractInfo);
  },
  /*
  * create features card at customer level
  */
  setFeaturesDataCustomersContracts : function(featureData){
    this.view.ContractFAList.lblName.setVisibility(true);
    this.view.ContractFAList.toggleCollapseArrow(true);
    this.view.ContractFAList.flxArrow.setVisibility(false);
    this.view.ContractFAList.flxSelectAllOption.setVisibility(true);
    this.view.ContractFAList.flxCardBottomContainer.setVisibility(true);
    this.view.ContractFAList.flxCheckbox.onClick = this.onSelectAllFeaturesClickContracts.bind(this, this.view.ContractFAList,featureData);
    this.setFeaturesAtCustomerLevelContracts(this.view.ContractFAList.segAccountFeatures,featureData);
  },
   /*
  * set features and actions segment data in feature card
  * @param: segment widget path
  */
  setFeaturesAtCustomerLevelContracts : function(segmentPath,featureData){
    var self =this;
    var selectedFeaturesCount=0;
    var featuresSegData = featureData.map(function(rec){
      var segRowData = [];
      var segSecData = {
        "id":rec.id ||rec.featureId,
        "lblTopSeperator":{"isVisible":false},
        "flxCheckbox":{"onClick": self.onSectionCheckboxClickContracts.bind(self,segmentPath)},
        "imgSectionCheckbox":{"src": self.AdminConsoleCommonUtils.checkboxSelected},
        "lblIconToggleArrow":{"text":"\ue922","skin":"sknfontIconDescRightArrow14px"},
        "flxToggleArrow":{"onClick": self.toggleSegmentSectionArrowContracts.bind(self,segmentPath)},
        "lblFeatureName":rec.name||rec.featureName,
        "lblStatusValue":{"text":rec.status=== self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ||rec.featureStatus=== self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ?
                             kony.i18n.getLocalizedString("i18n.secureimage.Active") : kony.i18n.getLocalizedString("i18n.secureimage.Inactive")},
        "lblIconStatusTop":{"skin":rec.status === self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE||rec.featureStatus=== self.AdminConsoleCommonUtils.constantConfig.FEATURE_ACTIVE ?
                              "sknFontIconActivate":"sknfontIconInactive","text":"\ue921"},
        "lblBottomSeperator":"-",
        "lblAvailableActions": kony.i18n.getLocalizedString("i18n.contracts.availableActions"),
        "lblCountActions": {"text":rec.actions.length},
        "lblTotalActions":"of "+rec.actions.length,
        "featureData":rec,
        "template":"flxContractEnrollFeaturesEditSection"
      };
      var selectedActionsCount=0;
      var dependentActions=[];
      for(var i=0;i < rec.actions.length; i++){
        dependentActions=[];
        var actionImg= self.AdminConsoleCommonUtils.checkboxSelected;
        if(rec.actions[i].isEnabled){
          actionImg=rec.actions[i].isEnabled === "true"? self.AdminConsoleCommonUtils.checkboxSelected:self.AdminConsoleCommonUtils.checkboxnormal;
        }
        else{
          if(self.action === self.actionConfig.edit)
            actionImg=rec.actions[i].isAllowed === "true"? self.AdminConsoleCommonUtils.checkboxSelected:self.AdminConsoleCommonUtils.checkboxnormal;           
        }
        if(actionImg=== self.AdminConsoleCommonUtils.checkboxSelected)
          selectedActionsCount++;
        if(rec.actions[i].dependentActions&&rec.actions[i].dependentActions.length>0){
          if(typeof rec.actions[i].dependentActions === "string")//as we are getting string format in edit flow and object format in create flow
            dependentActions=(rec.actions[i].dependentActions.substring(1,rec.actions[i].dependentActions.length-1)).split(",");
          else
            dependentActions=rec.actions[i].dependentActions.map(function(rec){return rec.id});
        }
        segRowData.push({
          "id":rec.actions[i].id||rec.actions[i].actionId,
          "isRowVisible": false,
          "dependentActions": dependentActions,
          "flxContractEnrollFeaturesEditRow":{"isVisible":false},
          "flxFeatureNameCont":{"isVisible":true},
          "imgCheckbox":{"src":actionImg},
          "flxCheckbox":{"onClick":self.onClickFeaturesRowCheckboxContracts.bind(self,segmentPath)},
          "lblFeatureName":{"text":rec.actions[i].name||rec.actions[i].actionName},
          "lblStatus":{"text":rec.actions[i].actionStatus === self.AdminConsoleCommonUtils.constantConfig.ACTION_ACTIVE ?
                       kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Active") :kony.i18n.getLocalizedString("18n.frmPermissionsController.InActive")},
          "lblIconStatus":{"skin":rec.actions[i].actionStatus === self.AdminConsoleCommonUtils.constantConfig.ACTION_ACTIVE?"sknFontIconActivate":"sknfontIconInactive"},
          "template":"flxContractEnrollFeaturesEditRow",
        });
      }
      var headerImg=self.getHeaderCheckboxImage(segRowData,true, true);
      segSecData.imgSectionCheckbox.src=headerImg;
      segSecData.lblCountActions.text=selectedActionsCount.toString();
      if(headerImg=== self.AdminConsoleCommonUtils.checkboxSelected||headerImg === self.AdminConsoleCommonUtils.checkboxPartial)
        selectedFeaturesCount++;
      return [segSecData, segRowData];
    });
    segmentPath.widgetDataMap = this.getWidgetDataMapForFeatures();
    segmentPath.info = {"selectedFeaturesCount":selectedFeaturesCount};
    segmentPath.rowTemplate="flxContractEnrollFeaturesEditRow";
    segmentPath.setData(featuresSegData);
    this.view.ContractFAList.lblCount.text= this.getSelectedItemsCount(featuresSegData, false);
    this.view.ContractFAList.lblTotalCount.text= "of " + this.getTwoDigitNumber(featuresSegData.length) ;
    this.view.ContractFAList.imgSectionCheckbox.src = self.getHeaderCheckboxImage(featuresSegData,false, true);
    /*
    //To validate whether atleast one feature is selected or not
    var isValid = this.validateCheckboxSelections(segmentPath,true);
    if(isValid){
      this.view.flxCustomerDropdownFA.setEnabled(true);
      this.enableAllTabs(true);
    }else{
      this.view.flxCustomerDropdownFA.setEnabled(false);
      this.enableAllTabs(false);
    }
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnNext,false,isValid);
    */
    this.view.forceLayout();
  },
  onSectionCheckboxClickContracts : function(segmentWidPath,event){
    var selectedCustId=this.view.customersDropdownFA.lblSelectedValue.info.id;
    var selSecInd = event.rowContext.sectionIndex;
    var segData = segmentWidPath.data;
    var isActionEnabled="false";
    var img = (segData[selSecInd][0].imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?  this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
    var actionIds=[];
    segData[selSecInd][0].imgSectionCheckbox.src = img;
    for(var i =0;i<segData[selSecInd][1].length; i++){
      actionIds.push(segData[selSecInd][1][i].id);
      segData[selSecInd][1][i].imgCheckbox.src = img;
    }
    if(img===this.AdminConsoleCommonUtils.checkboxnormal){
      segData[selSecInd][0].lblCountActions.text="0";
    }
    else{
      segData[selSecInd][0].lblCountActions.text=segData[selSecInd][1].length.toString();
    }
    segmentWidPath.setSectionAt(segData[selSecInd],selSecInd);
    isActionEnabled=img === this.AdminConsoleCommonUtils.checkboxnormal?"false":"true";
    this.view.ContractFAList.lblCount.text="("+segmentWidPath.info.selectedFeaturesCount+")";
    for(var j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
      if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
        for(var k=0;k<this.createContractRequestParam.contractCustomers[j].features.length;k++){
          if(this.createContractRequestParam.contractCustomers[j].features[k].featureId === segData[selSecInd][0].id){
            for(var l=0;l<this.createContractRequestParam.contractCustomers[j].features[k].actions.length;l++){
              if(actionIds.includes(this.createContractRequestParam.contractCustomers[j].features[k].actions[l].actionId))
              this.createContractRequestParam.contractCustomers[j].features[k].actions[l].isEnabled=isActionEnabled;
            }
            break;
          }
        }
        break;
      }
    }
    //set image for select all features image
    this.view.ContractFAList.imgSectionCheckbox.src = this.getHeaderCheckboxImage(segData,false,true);
    this.view.ContractFAList.lblCount.text = this.getSelectedItemsCount(segData, false);
    /*
    var isValid = this.validateCheckboxSelections(segmentWidPath,true);
    if(isValid){
      this.view.flxCustomerDropdownFA.setEnabled(true);
      this.enableAllTabs(true);
    }else{
      this.view.flxCustomerDropdownFA.setEnabled(false);
      this.enableAllTabs(false);
    }
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnNext,false,isValid);
    */
    this.view.forceLayout();
  },
   /*
   * enroll form
  * select all features click
  * @param: selected card widget path
  */
  onSelectAllFeaturesClickContracts : function(cardWidgetPath){
    var selectedCustId=this.view.customersDropdownFA.lblSelectedValue.info.id;
    var segData = cardWidgetPath.segAccountFeatures.data;
    var img = (cardWidgetPath.imgSectionCheckbox.src  ===  this.AdminConsoleCommonUtils.checkboxnormal) ?
        this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
    var featureIds=[];
    cardWidgetPath.imgSectionCheckbox.src = img;
    cardWidgetPath.lblCount.text = (img === this.AdminConsoleCommonUtils.checkboxnormal ? "0": this.getTwoDigitNumber(segData.length));
    for(var i=0;i<segData.length; i++){
      segData[i][0].imgSectionCheckbox.src = img;
      segData[i][0].lblCountActions.text=img === this.AdminConsoleCommonUtils.checkboxnormal?"0":segData[i][1].length.toString();
      featureIds.push(segData[i][0].id);
      for(var j=0;j<segData[i][1].length; j++){
        segData[i][1][j].imgCheckbox.src = img;
      }
    }
    var isActionEnabled=img === this.AdminConsoleCommonUtils.checkboxnormal?"false":"true";
    for(var j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
      if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
        for(var k=0;k<this.createContractRequestParam.contractCustomers[j].features.length;k++){
          if(featureIds.includes(this.createContractRequestParam.contractCustomers[j].features[k].featureId)){
            for(var l=0;l<this.createContractRequestParam.contractCustomers[j].features[k].actions.length;l++){
              this.createContractRequestParam.contractCustomers[j].features[k].actions[l].isEnabled=isActionEnabled;
            }
          }
        }
        break;
      }
    }
    cardWidgetPath.segAccountFeatures.setData(segData);
   /* //enable/disable save buttons
    var isValid = this.validateSelForMultipleCardsContracts(cardWidgetPath,"segAccountFeatures",true);
    if(isValid){
      this.view.flxCustomerDropdownFA.setEnabled(true);
      this.enableAllTabs(true);
    }
    else{
      this.view.flxCustomerDropdownFA.setEnabled(false);
      this.enableAllTabs(false);
    }
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnNext,false,isValid);
    */
    this.view.forceLayout();
  },
    /*
  * expand/collapse the rows under a section
  * @param: segment widget path, event
  */
  toggleSegmentSectionArrowContracts : function(segmentWidgetPath,event){
    var segData = segmentWidgetPath.data;
    var selectedSecInd = event.rowContext.sectionIndex;
    //update remaining sections
    for(var i=0;i< segData.length;i++){
      segData[i][0].lblTopSeperator.isVisible = false;
      if(selectedSecInd !== i){
        segData[i][0].lblIconToggleArrow.text = "\ue922";
        segData[i][0].lblIconToggleArrow.skin = "sknfontIconDescRightArrow14px";
        segData[i][1] = this.showHideSegRowFlex(segData[i][1],false);
      }
    }
    //update selected section
    if(segData[selectedSecInd][1][0].isRowVisible === false){
      segData[selectedSecInd][0].lblIconToggleArrow.text = "\ue915";
      segData[selectedSecInd][0].lblIconToggleArrow.skin = "sknfontIconDescDownArrow12px";
      segData[selectedSecInd][1] = this.showHideSegRowFlex(segData[selectedSecInd][1],true);
      if(selectedSecInd < (segData.length-1)){
        segData[selectedSecInd+1][0].lblTopSeperator.isVisible = true;
      }
    } else{
      segData[selectedSecInd][0].lblIconToggleArrow.text = "\ue922";
      segData[selectedSecInd][0].lblIconToggleArrow.skin = "sknfontIconDescRightArrow14px";
      segData[selectedSecInd][1] = this.showHideSegRowFlex(segData[selectedSecInd][1],false);
      if(selectedSecInd < (segData.length-1)){
        segData[selectedSecInd+1][0].lblTopSeperator.isVisible = false;
      }
    }
    segmentWidgetPath.setData(segData);
  },
    /*
  * uncheck/check features row checkbox
  * @param: segment widget path, event
  */
  onClickFeaturesRowCheckboxContracts : function(segmentWidPath,event){
    var selectedCustId=this.view.customersDropdownFA.lblSelectedValue.info.id;
    var selSecInd = event.rowContext.sectionIndex;
    var selRowInd = event.rowContext.rowIndex;
    var segData = segmentWidPath.data;
    var dependentActions=[];
    var updatedActionIds=[];
    var isActionEnabled="true";
    segData[selSecInd][1][selRowInd].imgCheckbox.src = (segData[selSecInd][1][selRowInd].imgCheckbox.src === "checkboxnormal.png") ? "checkboxselected.png" : "checkboxnormal.png";
    updatedActionIds.push(segData[selSecInd][1][selRowInd].id);
    if(segData[selSecInd][1][selRowInd].dependentActions.length>0){
      dependentActions=segData[selSecInd][1][selRowInd].dependentActions;
      for(let x=0;x<dependentActions.length;x++){
        for(let y=0;y<segData[selSecInd][1].length;y++){
          if(segData[selSecInd][1][y].id===dependentActions[x]){
            segData[selSecInd][1][y].imgCheckbox.src =segData[selSecInd][1][selRowInd].imgCheckbox.src;
            updatedActionIds.push(segData[selSecInd][1][y].id);
          }
        }
      }
    }
    isActionEnabled=segData[selSecInd][1][selRowInd].imgCheckbox.src === "checkboxnormal.png"?"false":"true";
    var headerCheckImg = this.getHeaderCheckboxImage(segData[selSecInd][1],true, true);
    segData[selSecInd][0].imgSectionCheckbox.src=headerCheckImg;

    //to update the selected actions count (dependent actions also)    
    segData[selSecInd][0].lblCountActions.text=(segData[selSecInd][1][selRowInd].imgCheckbox.src==="checkboxnormal.png")?(parseInt(segData[selSecInd][0].lblCountActions.text)-updatedActionIds.length):(parseInt(segData[selSecInd][0].lblCountActions.text)+updatedActionIds.length);
    segmentWidPath.setSectionAt(segData[selSecInd],selSecInd);
    for(var j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
      if(this.createContractRequestParam.contractCustomers[j].coreCustomerId===selectedCustId){
        for(var k=0;k<this.createContractRequestParam.contractCustomers[j].features.length;k++){
          for(var l=0;l<this.createContractRequestParam.contractCustomers[j].features[k].actions.length;l++){
            if(updatedActionIds.includes(this.createContractRequestParam.contractCustomers[j].features[k].actions[l].actionId))
              this.createContractRequestParam.contractCustomers[j].features[k].actions[l].isEnabled=isActionEnabled;
          }
        }
        break;
      }
    }
    //set image for select all features image
    var headerCheckImg = this.getHeaderCheckboxImage(segData,false,true);
    this.view.ContractFAList.imgSectionCheckbox.src=headerCheckImg;
    this.view.ContractFAList.lblCount.text= this.getSelectedItemsCount(segData, false);
    /*
    var isValid = this.validateCheckboxSelections(segmentWidPath,true);
    if(isValid){
      this.view.flxCustomerDropdownFA.setEnabled(true);
      this.enableAllTabs(true);
    }else{
      this.view.flxCustomerDropdownFA.setEnabled(false);
      this.enableAllTabs(false);
    }
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractFA.btnNext,false,isValid);
    */
    this.view.forceLayout();
  },
    /*
  * set segment rows visibility
  * @params: rows array, visibility - true/false
  * @return: updated rows data with visibilty
  */
  showHideSegRowFlexContracts : function(rowsData,visibility){
    for(var i=0;i<rowsData.length;i++){
      if(rowsData[i].flxContractEnrollFeaturesEditRow){
        rowsData[i].flxContractEnrollFeaturesEditRow.isVisible = visibility;
      }else{
        rowsData[i].flxAssignLimits.isVisible =visibility;
      }
      rowsData[i].isRowVisible =visibility;
    }
    return rowsData;
  },
  /*
  * search in features tab contracts
  */
  searchFAContracts : function(features){
    var searchText=this.view.tbxContractFASearch.text.toLowerCase();
    var searchedActions=[];
    var featureName="";
    var actionName="";
    var searchResults=features.filter(function(feature){
      featureName=feature.name?feature.name.toLowerCase():feature.featureName.toLowerCase();
      if(featureName.indexOf(searchText)>=0)
        return feature;
      else{
          for(let x=0;x<feature.actions.length;x++){
            actionName=feature.actions[x].name?feature.actions[x].name.toLowerCase():feature.actions[x].actionName.toLowerCase();
            if(actionName.indexOf(searchText)>=0)
              searchedActions.push(feature.actions[x]);
          }
          if(searchedActions.length>0){
            feature.actions=searchedActions;
            return feature;
          }
        }
    });
    if(searchResults.length>0){
      this.setFeaturesAtCustomerLevelContracts(this.view.ContractFAList.segAccountFeatures,searchResults);
      this.view.flxNoCustomerSelectedFA.setVisibility(false);
      this.view.flxContractFAList.setVisibility(true);
    }
    else{
      this.view.lblNoCustomersSelectedFA.text= kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.No_results_found");
      this.view.imgContractFA.setVisibility(false);
      this.view.flxNoCustomerSelectedFA.setVisibility(true);
      this.view.flxContractFAList.setVisibility(false);
    }
  },
 /*
  * create limits card at customer level
  */
  setLimitsDataForCustomer : function(limitsData){
    this.view.flxContractLimits.info={"isValid":true};
    this.view.ContractLimitsList.flxCardBottomContainer.setVisibility(true);
    this.setLimitsAtCustomerLevelContracts(limitsData);
  },
   /*
  * widget map function for edit user limits segment at customer level
  * @returns: widget data map for limits segment
  */
  getWidgetMapForLimitsContract : function(){
    var widgetMap = {
      "flxContractsLimitsHeaderCreate":"flxContractsLimitsHeaderCreate",
      "flxHeader":"flxHeader",
      "flxActionDetails":"flxActionDetails",
      "flxRow1":"flxRow1",
      "flxToggle":"flxToggle",
      "lblToggle":"lblToggle",
      "lblFeatureName":"lblFeatureName",
      "flxRow2":"flxRow2",
      "lblMonetaryActions":"lblMonetaryActions",
      "lblCountActions":"lblCountActions",
      "flxViewLimitsHeader":"flxViewLimitsHeader",
      "lblActionHeader":"lblActionHeader",
      "flxPerLimitHeader":"flxPerLimitHeader",
      "lblPerLimitHeader":"lblPerLimitHeader",
      "flxLimitInfo1":"flxLimitInfo1",
      "fontIconInfo1":"fontIconInfo1",
      "flxDailyLimitHeader":"flxDailyLimitHeader",
      "lblDailyLimitHeader":"lblDailyLimitHeader",
      "flxLimitInfo2":"flxLimitInfo2",
      "fontIconInfo2":"fontIconInfo2",
      "flxWeeklyLimitHeader":"flxWeeklyLimitHeader",
      "lblWeeklyLimitHeader":"lblWeeklyLimitHeader",
      "flxLimitInfo3":"flxLimitInfo3",
      "fontIconInfo3":"fontIconInfo3",
      "lblFASeperator2":"lblFASeperator2",
      "lblFASeperator1":"lblFASeperator1",
      "lblFASeperatorTop":"lblFASeperatorTop",
      "flxContractsLimitsBodyCreate":"flxContractsLimitsBodyCreate",
      "flxLimitActionName":"flxLimitActionName",
      "flxRangeIcon":"flxRangeIcon",
      "lblIconRangeInfo":"lblIconRangeInfo",
      "flxViewLimits":"flxViewLimits",
      "lblAction":"lblAction",
      "flxPerLimitTextBox":"flxPerLimitTextBox",
      "tbxPerValue":"tbxPerValue",
      "lblCurrencySymbol1":"lblCurrencySymbol1",
      "flxDailyLimitTextBox":"flxDailyLimitTextBox",
      "tbxDailyValue":"tbxDailyValue",
      "lblCurrencySymbol2":"lblCurrencySymbol2",
      "flxWeeklyLimitTextBox":"flxWeeklyLimitTextBox",
      "tbxWeeklyValue":"tbxWeeklyValue",
      "lblCurrencySymbol3":"lblCurrencySymbol3",
      "flxLimitError":"flxLimitError",
      "lblLimitError":"lblLimitError",
      "lblLimitErrorIcon":"lblLimitErrorIcon",
      "lblLimitsSeperator":"lblLimitsSeperator",
      "id":"id",
      "featuresData":"featuresData"
    };
    return widgetMap;
  },
   /*
  * set limits segment data in limits card at account level
  */
  setLimitsAtCustomerLevelContracts : function(featuresData){
    var self=this;
    var segData=[];
    var segHeaderData=[];
    var segBodyData=[];
    var mappedData=[];
    for(var i=0;i<featuresData.length;i++){
      segBodyData=[];
      segHeaderData=this.mapContractLimitsHeader(featuresData[i],i);
      for(var j=0;j<featuresData[i].actions.length;j++){
        segBodyData.push(this.mapContractLimitsBody(featuresData[i].actions[j],featuresData,featuresData[i].id||featuresData[i].featureId));
      }
      //mappedData.push([segHeaderData,segBodyData]);
      segData.push([segHeaderData,segBodyData]);
    }
    this.view.ContractLimitsList.segAccountFeatures.widgetDataMap = this.getWidgetMapForLimitsContract();
    this.view.ContractLimitsList.segAccountFeatures.rowTemplate = "flxContractsLimitsBodyCreate";
    this.view.ContractLimitsList.segAccountFeatures.setData(segData);
    this.validateLimits();
    //this.view.ContractLimitsList.segAccountFeatures.info={"data":mappedData};
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set data to limits card in contracts
  */
  mapContractLimitsHeader : function(feature,limitCount){
    var self=this;
    return{
      "template":"flxContractsLimitsHeaderCreate",
      "flxToggle":{"onClick":function(){
        self.toggleLimits();
      }
                  },
      "lblToggle":{"text":"\ue922"},//right arrow
      "flxViewLimitsHeader":{"isVisible":false},
      "lblFASeperatorTop":{"isVisible":true},
      "lblFeatureName":{"text":feature.name||feature.featureName},
      "lblMonetaryActions":{"text":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.MonetaryActions")+": "},
      "lblCountActions":{"text":feature.actions.length},
      "lblActionHeader":{"text":kony.i18n.getLocalizedString("i18n.frmMfascenarios.ACTION_CAP")},
      "lblPerLimitHeader":{"text":kony.i18n.getLocalizedString("i18n.contracts.perTransaction_UC")},
      "flxLimitInfo1":{"onHover" : function(widget, context) {
			var info = kony.i18n.getLocalizedString("i18n.contracts.RangePerInfo")+" " + (feature.name||feature.featureName) + " " + kony.i18n.getLocalizedString("i18n.contracts.RangeMsg");
			self.onHoverLimitsCallBack(widget, context,info);
		}
                      },
      "fontIconInfo1":{"text":""},
      "lblDailyLimitHeader":{"text":kony.i18n.getLocalizedString("i18n.contracts.dailyTransaction_UC")},
      "flxLimitInfo2":{"onHover" : function(widget, context) {
			var info = kony.i18n.getLocalizedString("i18n.contracts.RangeDailyInfo")+" " + (feature.name||feature.featureName) + " " + kony.i18n.getLocalizedString("i18n.contracts.RangeMsg");
			self.onHoverLimitsCallBack(widget, context,info);
		}
                      },
      "fontIconInfo2":{"text":""},
      "lblWeeklyLimitHeader":{"text":kony.i18n.getLocalizedString("i18n.contracts.weeklyTransaction_UC")},
      "flxLimitInfo3":{"onHover" : function(widget, context) {
			var info = kony.i18n.getLocalizedString("i18n.contracts.RangeWeeklyInfo")+" " + (feature.name||feature.featureName) + " " + kony.i18n.getLocalizedString("i18n.contracts.RangeMsg");
			self.onHoverLimitsCallBack(widget, context,info);
		}
                      },
      "fontIconInfo3":{"text":""},
      "featureId":feature.id||feature.featureId,
      "lblFASeperator2":"-",
      "lblFASeperator1":"-"
    };
  },
  /*
  * enroll form
  * set data to limits card rows contracts
  */
  mapContractLimitsBody : function(action,featuresData,featureId){
   var self=this;
    var perLimit,dailyLimit,weeklyLimit=0;
    for(var x=0;x<action.limits.length;x++){
      if(action.limits[x].id === "DAILY_LIMIT")
        dailyLimit=action.limits[x].value;
      if(action.limits[x].id === "MAX_TRANSACTION_LIMIT")
        perLimit=action.limits[x].value;
      if(action.limits[x].id === "WEEKLY_LIMIT")
        weeklyLimit=action.limits[x].value;
    }
    var range=action.id?this.monetaryLimits[featureId][action.id]:this.monetaryLimits[featureId][action.actionId];
    return{
      "actionId":action.id||action.actionId,
      "featuresData":featuresData,
      "template":"flxContractsLimitsBodyCreate",
      "flxContractsLimitsBodyCreate":{"isVisible":false},
      "lblAction":{"text":action.name||action.actionName},
      "flxRangeIcon":{"onHover" : function(widget,context){self.showRangeTooltipContract(widget,context,range);},"info":{"range":range}},
      "lblIconRangeInfo":{"text":"\ue9b9"},
      "flxPerLimitTextBox":{"skin":"sknflxEnterValueNormal"},
      "tbxPerValue":{"text":perLimit},
      "lblCurrencySymbol1":{"text":""},
      "flxDailyLimitTextBox":{"skin":"sknflxEnterValueNormal"},
      "tbxDailyValue":{"text":dailyLimit},
      "lblCurrencySymbol2":{"text":""},
      "flxWeeklyLimitTextBox":{"skin":"sknflxEnterValueNormal"},
      "tbxWeeklyValue":{"text":weeklyLimit},
      "lblCurrencySymbol3":{"text":""},
      "flxLimitError1":{"isVisible":false},
      "lblLimitError1":{"text":""},
      "lblLimitErrorIcon1":{"text":""},
      "flxLimitError2":{"isVisible":false},
      "lblLimitError2":{"text":""},
      "lblLimitErrorIcon2":{"text":""},
      "flxLimitError3":{"isVisible":false},
      "lblLimitError3":{"text":""},
      "lblLimitErrorIcon3":{"text":""},
      "lblLimitsSeperator":"-"
    }
  },
  /*
  * enroll form
  * update the limit values entered in the payload object
  */
  updateLimitValues : function(context,featuresData,limitId){
    var selectedCustId=this.view.customersDropdownContractLimits.lblSelectedValue.info.id;
    var isValid=true;
    var segData=this.view.ContractLimitsList.segAccountFeatures.data;
    // To update limit values in global variable
    for(let a=0;a<segData.length;a++){
      for(let j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
        if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
          for(let k=0;k<this.createContractRequestParam.contractCustomers[j].features.length;k++){
            if((this.createContractRequestParam.contractCustomers[j].features[k].id&&this.createContractRequestParam.contractCustomers[j].features[k].id === segData[a][0].featureId)||(this.createContractRequestParam.contractCustomers[j].features[k].featureId&&this.createContractRequestParam.contractCustomers[j].features[k].featureId === segData[a][0].featureId)){
              for(var b=0;b<segData[a][1].length;b++){
                for(let l=0;l<this.createContractRequestParam.contractCustomers[j].features[k].actions.length;l++){
                  if((this.createContractRequestParam.contractCustomers[j].features[k].actions[l].id&&this.createContractRequestParam.contractCustomers[j].features[k].actions[l].id === segData[a][1][b].actionId)||
                     (this.createContractRequestParam.contractCustomers[j].features[k].actions[l].actionId&&this.createContractRequestParam.contractCustomers[j].features[k].actions[l].actionId === segData[a][1][b].actionId)){
                    this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits[1].value=segData[a][1][b].tbxPerValue.text;
                    this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits[2].value=segData[a][1][b].tbxDailyValue.text;
                    this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits[0].value=segData[a][1][b].tbxWeeklyValue.text;
                    break;
                  }
                }
              }
              break;
            }
          }
          break;
        }
      }
    }
  },
  /*
  * enroll form
  * To get customer Id's list where there is limit violation contract
  */
  validateAllLimitsContracts : function(){
    var range="";
    var featureId="";
    var actionId="";
    var errorCustIds=[];
    var isRangeValid=true;
    var isValid=true;
    this.updateLimitValues();
    for(var x=0;x<this.createContractRequestParam.contractCustomers.length;x++){
      for(let y=0;y<this.createContractRequestParam.contractCustomers[x].features.length;y++){
        if(this.createContractRequestParam.contractCustomers[x].features[y].type === "MONETARY"){
          featureId=this.createContractRequestParam.contractCustomers[x].features[y].featureId;
          for(let z=0;z<this.createContractRequestParam.contractCustomers[x].features[y].actions.length;z++){
            if(this.createContractRequestParam.contractCustomers[x].features[y].actions[z].type === "MONETARY"&&this.createContractRequestParam.contractCustomers[x].features[y].actions[z].isEnabled === "true"){
              actionId=this.createContractRequestParam.contractCustomers[x].features[y].actions[z].actionId;
              isRangeValid=true;
              range=this.monetaryLimits[featureId][actionId];
              var weekly=parseFloat(this.createContractRequestParam.contractCustomers[x].features[y].actions[z].limits[0].value);
              var daily=parseFloat(this.createContractRequestParam.contractCustomers[x].features[y].actions[z].limits[2].value);
              var per=parseFloat(this.createContractRequestParam.contractCustomers[x].features[y].actions[z].limits[1].value);
              if(weekly>parseFloat(range["WEEKLY_LIMIT"])||weekly<parseFloat(range["MIN_TRANSACTION_LIMIT"])||weekly<daily)
                isRangeValid=false;
              if(per>parseFloat(range["MAX_TRANSACTION_LIMIT"])||per<parseFloat(range["MIN_TRANSACTION_LIMIT"])||per>daily)
                isRangeValid=false;
              if(daily>parseFloat(range["DAILY_LIMIT"])||daily<parseFloat(range["MIN_TRANSACTION_LIMIT"]))
                isRangeValid=false;
              if(isRangeValid === false){
                errorCustIds.push(this.createContractRequestParam.contractCustomers[x].coreCustomerId);
                break;
              }
            }
          }
          //if this customer Id is already pushed
          if(errorCustIds.includes(this.createContractRequestParam.contractCustomers[x].coreCustomerId))
            break;
        }
      }
    }
    if(errorCustIds.length>0){
      isValid=false;
      if(errorCustIds.length>1){
      this.view.flxLimitsErrorFlag.setVisibility(true);
      this.view.flxContractLimitsContainer.top="55px";
      }else{
        this.view.flxLimitsErrorFlag.setVisibility(false);
      this.view.flxContractLimitsContainer.top="0px"
      }
      this.view.customersDropdownContractLimits.lblSelectedValue.info={"id":errorCustIds[0]};
      this.setSelectedText("customersDropdownContractLimits",errorCustIds[0]);
      this.setCustSelectedData("customersDropdownContractLimits",false);
    }else{
      isValid=true;
      this.view.flxLimitsErrorFlag.setVisibility(false);
      this.view.flxContractLimitsContainer.top="0px";
    }
    this.view.forceLayout();
    return isValid;
  },
  /*
  * enroll form
  * reset limit values in contracts
  */
  validateLimits : function(){
    var errMsg="";
    var isValid=true;
    var segData=this.view.ContractLimitsList.segAccountFeatures.data;
    var range="";
    var errorIndices=[];
    var isSectionValid=true;
    var errorLeft="75%";
    for(var a=0;a<segData.length;a++){
      isSectionValid=true;
      for(var b=0;b<segData[a][1].length;b++){
        range=segData[a][1][b].flxRangeIcon.info.range;
        //per transaction limit validation
        if(parseFloat(range["MAX_TRANSACTION_LIMIT"])<parseFloat(segData[a][1][b].tbxPerValue.text)||
           parseFloat(range["MIN_TRANSACTION_LIMIT"])>parseFloat(segData[a][1][b].tbxPerValue.text)||
           parseFloat(segData[a][1][b].tbxPerValue.text)>parseFloat(segData[a][1][b].tbxDailyValue.text)){
          isValid=false;
          isSectionValid=false;
          segData[a][1][b].lblLimitError1.skin="sknlblErrorIcon12px";
          if(parseFloat(range["MAX_TRANSACTION_LIMIT"])<parseFloat(segData[a][1][b].tbxPerValue.text)||
           parseFloat(range["MIN_TRANSACTION_LIMIT"])>parseFloat(segData[a][1][b].tbxPerValue.text))
            segData[a][1][b].lblLimitError1.text=kony.i18n.getLocalizedString("i18n.contracts.valueShouldBeWithin")+" "+this.defaultCurrencyCodeSymbol+range["MIN_TRANSACTION_LIMIT"]+" - "+this.defaultCurrencyCodeSymbol+range["MAX_TRANSACTION_LIMIT"];          
          else
            segData[a][1][b].lblLimitError1.text=kony.i18n.getLocalizedString("i18n.contracts.perLimitMsg");
          
          segData[a][1][b].flxLimitError1.isVisible=true;
          segData[a][1][b].flxPerLimitTextBox.skin="sknflxEnterValueError";
        }else{
          segData[a][1][b].flxLimitError1.isVisible=false;
          segData[a][1][b].flxPerLimitTextBox.skin="sknflxEnterValueNormal";
        }
        //daily transaction limit validation
        if(parseFloat(range["DAILY_LIMIT"])<parseFloat(segData[a][1][b].tbxDailyValue.text)||
           parseFloat(range["MIN_TRANSACTION_LIMIT"])>parseFloat(segData[a][1][b].tbxDailyValue.text)||
           parseFloat(segData[a][1][b].tbxDailyValue.text)>parseFloat(segData[a][1][b].tbxWeeklyValue.text)){
          isValid=false;
          isSectionValid=false;
          segData[a][1][b].lblLimitError2.skin="sknlblErrorIcon12px";
          if(parseFloat(range["DAILY_LIMIT"])<parseFloat(segData[a][1][b].tbxDailyValue.text)||
           parseFloat(range["MIN_TRANSACTION_LIMIT"])>parseFloat(segData[a][1][b].tbxDailyValue.text))
            segData[a][1][b].lblLimitError2.text=kony.i18n.getLocalizedString("i18n.contracts.valueShouldBeWithin")+" "+this.defaultCurrencyCodeSymbol+range["MIN_TRANSACTION_LIMIT"]+" - "+this.defaultCurrencyCodeSymbol+range["DAILY_LIMIT"];
          else
            segData[a][1][b].lblLimitError2.text=kony.i18n.getLocalizedString("i18n.contracts.dailyLimitMsg");
          segData[a][1][b].flxLimitError2.isVisible=true;
          segData[a][1][b].flxDailyLimitTextBox.skin="sknflxEnterValueError";
        }else{
          segData[a][1][b].flxLimitError2.isVisible=false;
          segData[a][1][b].flxDailyLimitTextBox.skin="sknflxEnterValueNormal";
        }
		//weekly transaction limit validation
        if(parseFloat(range["WEEKLY_LIMIT"])<parseFloat(segData[a][1][b].tbxWeeklyValue.text)||
           parseFloat(range["MIN_TRANSACTION_LIMIT"])>parseFloat(segData[a][1][b].tbxWeeklyValue.text)||
           parseFloat(segData[a][1][b].tbxDailyValue.text)>parseFloat(segData[a][1][b].tbxWeeklyValue.text)){
          isValid=false;
          isSectionValid=false;
          segData[a][1][b].lblLimitError3.skin="sknlblErrorIcon12px";
          if(parseFloat(range["WEEKLY_LIMIT"])<parseFloat(segData[a][1][b].tbxWeeklyValue.text)||
           parseFloat(range["MIN_TRANSACTION_LIMIT"])>parseFloat(segData[a][1][b].tbxWeeklyValue.text))
            segData[a][1][b].lblLimitError3.text=kony.i18n.getLocalizedString("i18n.contracts.valueShouldBeWithin")+" "+this.defaultCurrencyCodeSymbol+range["MIN_TRANSACTION_LIMIT"]+" - "+this.defaultCurrencyCodeSymbol+range["WEEKLY_LIMIT"];
          else
            segData[a][1][b].lblLimitError3.text=kony.i18n.getLocalizedString("i18n.contracts.weeklyLimitMsg");
          segData[a][1][b].flxLimitError3.isVisible=true;
          segData[a][1][b].flxWeeklyLimitTextBox.skin="sknflxEnterValueError";
        }else{
          segData[a][1][b].flxLimitError3.isVisible=false;
          segData[a][1][b].flxWeeklyLimitTextBox.skin="sknflxEnterValueNormal";
        }
      }
      if(isSectionValid === false)
      	errorIndices.push(a);
    }
    this.view.ContractLimitsList.segAccountFeatures.setData(segData);
    if(isValid === false){
      this.view.flxContractLimits.info={"isValid":false};
      this.toggleLimits(errorIndices);
    }else{
      this.view.flxContractLimits.info={"isValid":true};
    }
    this.view.forceLayout();
    return isValid;
  },
  /*
  * enroll form
  * reset limit values in contracts
  */
  resetLimitValues : function(){
    var selectedCustId=this.view.customersDropdownContractLimits.lblSelectedValue.info.id;
    var segData=this.view.ContractLimitsList.segAccountFeatures.data;
    var featureId="";
    var actionId="";
    var limitId="";
    //should update request param with actual values from limitsActualJSON
    for(let j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
      if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
        for(let k=0;k<this.createContractRequestParam.contractCustomers[j].features.length;k++){
          featureId=this.createContractRequestParam.contractCustomers[j].features[k].id||this.createContractRequestParam.contractCustomers[j].features[k].featureId;
          for(let l=0;l<this.createContractRequestParam.contractCustomers[j].features[k].actions.length;l++){
            if(this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits){
              actionId=this.createContractRequestParam.contractCustomers[j].features[k].actions[l].id||this.createContractRequestParam.contractCustomers[j].features[k].actions[l].actionId;
              for(var m=0;m<this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits.length;m++){
                limitId=this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits[m].id;
                this.createContractRequestParam.contractCustomers[j].features[k].actions[l].limits[m].value=this.limitsActualJSON[selectedCustId][featureId][actionId][limitId];
              }
            }
          }
        }
        this.setCustSelectedData("customersDropdownContractLimits",false);
        break;
      }
    }
    this.view.forceLayout();
  },
  /*
  *search in limits tab contracts
  */
  searchLimitsContract : function(features){
    var searchText=this.view.tbxContractLimitsSearch.text.toLowerCase();
    var searchedActions=[];
    var featureName="";
    var actionName="";
    var searchResults=features.filter(function(feature){
      featureName=feature.name?feature.name.toLowerCase():feature.featureName.toLowerCase();
      if(featureName.indexOf(searchText)>=0)
        return feature;
      else{
        for(let x=0;x<feature.actions.length;x++){
          actionName=feature.actions[x].name?feature.actions[x].name.toLowerCase():feature.actions[x].actionName.toLowerCase();
          if(actionName.indexOf(searchText)>=0)
            searchedActions.push(feature.actions[x]);
        }
        if(searchedActions.length>0){
          feature.actions=searchedActions;
          return feature;
        }
      }
    });
    if(searchResults.length>0){
      this.setLimitsAtCustomerLevelContracts(searchResults);
      this.view.ContractLimitsList.segAccountFeatures.setVisibility(true);
      this.view.ContractLimitsList.flxNoFilterResults.setVisibility(false);
    }
    else{
      this.view.ContractLimitsList.lblNoFilterResults.text=kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.No_results_found");
      this.view.ContractLimitsList.flxNoFilterResults.setVisibility(true);
      this.view.ContractLimitsList.segAccountFeatures.setVisibility(false);
    }
  },
  /*
  * enroll form
  * toggle limits section on click of arrow contracts
  */
  toggleLimits : function(errIndices){
    var self = this;
    var selectedRowData = [];
    var segData=self.view.ContractLimitsList.segAccountFeatures.data;
    var sectionIndex =self.view.ContractLimitsList.segAccountFeatures.selectedsectionindex;
    var isExpanded=false;
    if(sectionIndex!==null&&sectionIndex!==undefined)
      isExpanded=segData[sectionIndex][0].flxViewLimitsHeader.isVisible?true:false;
    for(let a=0;a<segData.length;a++){
      segData[a][0].lblToggle.text="\ue922";
      segData[a][0].flxViewLimitsHeader.isVisible=false;
      for(let b=0;b<segData[a][1].length;b++)
      segData[a][1][b].flxContractsLimitsBodyCreate.isVisible=false;
    }
    if(errIndices){
      for(let i=0;i<errIndices.length;i++){
        segData[errIndices[i]][0].lblToggle.text="\ue915";
        segData[errIndices[i]][0].flxViewLimitsHeader.isVisible=true;
        for(let j=0;j<segData[errIndices[i]][1].length;j++)
        segData[errIndices[i]][1][j].flxContractsLimitsBodyCreate.isVisible=true;
      }
    }else{
      if(!isExpanded){
        segData[sectionIndex][0].lblToggle.text="\ue915";
        segData[sectionIndex][0].flxViewLimitsHeader.isVisible=true;
        for(let c=0;c<segData[sectionIndex][1].length;c++)
        segData[sectionIndex][1][c].flxContractsLimitsBodyCreate.isVisible=true;
      }else{
        segData[sectionIndex][0].lblToggle.text="\ue922";
        segData[sectionIndex][0].flxViewLimitsHeader.isVisible=false;
        for(let c=0;c<segData[sectionIndex][1].length;c++)
        segData[sectionIndex][1][c].flxContractsLimitsBodyCreate.isVisible=false;
      }
    }
    this.view.ContractLimitsList.segAccountFeatures.setData(segData);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * limits range icon hover function
  */
  onHoverLimitsCallBack:function(widget, context,info) {
    var scopeObj = this;
    var widGetId = widget.id;
    if (widget) {
      if (context.eventType === constants.ONHOVER_MOUSE_ENTER) {
          scopeObj.showOnHoverInfo(context, widGetId, info);
      }else if (context.eventType === constants.ONHOVER_MOUSE_MOVE) {
        scopeObj.view.tooltipEnroll.setVisibility(true);
      } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
        scopeObj.view.tooltipEnroll.setVisibility(false);
      }
    }
  },
  /*
  * enroll form
  * limits on hover call 
  */
  showOnHoverInfo: function(featureSegment, widGetId, info) {
    var scopeObj = this;
    var leftVal = 0;
    var topVal=0;
    switch (widGetId) {
        case 'flxLimitInfo1':
            leftVal = featureSegment.pageX;
        	topVal = featureSegment.pageY;
            break;
        case 'flxLimitInfo2':
            leftVal = featureSegment.pageX ;
        	topVal = featureSegment.pageY;
            break;
        case 'flxLimitInfo3':
            leftVal = featureSegment.pageX ;
        	topVal = featureSegment.pageY;
            break;
    }
    topVal +=5;
    leftVal = leftVal - 190;
    scopeObj.view.tooltipEnroll.left = leftVal + "px";
    scopeObj.view.tooltipEnroll.top = topVal + "px";
    scopeObj.view.tooltipEnroll.lblNoConcentToolTip.text = info;
    scopeObj.view.tooltipEnroll.lblarrow.skin =  "sknfontIconDescRightArrow14px";
    scopeObj.view.tooltipEnroll.flxToolTipMessage.skin ="sknFlxFFFFFF";
    scopeObj.view.tooltipEnroll.lblNoConcentToolTip.skin = "sknLbl485C75LatoRegular13Px";
    scopeObj.view.tooltipEnroll.setVisibility(true);
    scopeObj.view.forceLayout();
  },
  /*
  * show the min-max range for limit in contracts screen
  */
  showRangeTooltipContract : function(widget,context,range){
    if (context.eventType === constants.ONHOVER_MOUSE_ENTER) {
      this.view.flxRangeTooltipContracts.top = (context.pageY -120)+"dp";
      this.view.flxRangeTooltipContracts.left = (context.pageX - 305 -230 -70) +"dp"; //(pageX -leftmenu-verticaltabs- left,right padding)
      if(this.view.flxRangeTooltipContracts.isVisible === false){
        this.view.lblRangeValueContract11.text=range["MIN_TRANSACTION_LIMIT"];
        this.view.lblRangeValueContract12.text=range["MAX_TRANSACTION_LIMIT"];
        this.view.lblRangeValueContract21.text=range["MIN_TRANSACTION_LIMIT"];
        this.view.lblRangeValueContract22.text=range["DAILY_LIMIT"];
        this.view.lblRangeValueContract31.text=range["MIN_TRANSACTION_LIMIT"];
        this.view.lblRangeValueContract32.text=range["WEEKLY_LIMIT"];
        this.view.flxRangeTooltipContracts.setVisibility(true);
        this.view.forceLayout();
      }    
    } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
      if(this.view.flxRangeTooltipContracts.isVisible === true)
        this.view.flxRangeTooltipContracts.setVisibility(false);
    }
  },
  /*
  * show popup to reset limits in contracts
  */
  showResetAllLimitsContractPopup: function() {
    var scopeObj = this;
    scopeObj.view.popUpDeactivate.lblPopUpMainMessage.text = kony.i18n.getLocalizedString("i18n.common.ResetLimits");
    scopeObj.view.popUpDeactivate.rtxPopUpDisclaimer.text = kony.i18n.getLocalizedString("i18n.common.Disclaimer");
    scopeObj.view.popUpDeactivate.btnPopUpCancel.text = kony.i18n.getLocalizedString("i18n.frmCustomers.CANCEL");
    scopeObj.view.popUpDeactivate.btnPopUpDelete.text = kony.i18n.getLocalizedString("i18n.common.RESET");
    scopeObj.view.popUpDeactivate.btnPopUpDelete.width = "116dp";
    scopeObj.view.popUpDeactivate.rtxPopUpDisclaimer.width = "80%";
    scopeObj.view.popUpDeactivate.setVisibility(true);
    scopeObj.view.popUpDeactivate.btnPopUpDelete.onClick = function() {
        scopeObj.view.flxEnrollCustConfirmationPopup.setVisibility(false);
        scopeObj.resetLimitValues();
    }
    scopeObj.view.forceLayout();
  },
  /*
  * enroll form
  * validate the selection in the create contract tabs
  */
  isValidSelection : function(){
    var isValid=true;
    if(this.view.flxContractDetailsTab.isVisible){
      isValid=this.validateContractDetails();
    }else if(this.view.flxContractAccounts.isVisible&&this.view.flxContractAccountsList.isVisible&&this.view.ContractAccountsList){
      if(this.view.ContractAccountsList.segAccountFeatures.data[0][0].imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal)
        isValid=false;
    }else if(this.view.flxContractLimits.isVisible&&this.view.flxContractLimitsSearch.isVisible){
      isValid=this.validateAllLimitsContracts();
    }
    return isValid; 
  },
  /*
  * enroll form
  * validate the search criteria in popup
  */
  validateCoreCustSearch : function(){
    if (this.view.textBoxEntryContractCust11.tbxEnterValue.text.trim() !== "") return true;
    if (this.view.textBoxEntryContractCust12.tbxEnterValue.text.trim() !== "") return true;
    if (this.view.textBoxEntryContractCust13.tbxEnterValue.text.trim() !== "") return true;
    if (this.view.textBoxEntryContractCust21.txtContactNumber.text.trim() !== ""&&this.view.textBoxEntryContractCust21.txtISDCode.text.trim()!=="") return true;
    if (this.view.customCalCustomerDOB.value !== "") return true;
    if (this.view.lblSelectedRows.text !== "Select Status") return true;
    if (this.view.textBoxEntryContractCust31.tbxEnterValue.text.trim() !== "") return true;
    if (this.view.textBoxEntryContractCust32.tbxEnterValue.text.trim() !== "") return true;
    if (this.view.textBoxEntryContractCust33.tbxEnterValue.text.trim() !== "") return true;
    this.setErrorSkinsToCoreSearch();
    return false;
  },
  /*
  * enroll form
  * set error skin to search fields in popup
  */
  setErrorSkinsToCoreSearch: function(){
    this.view.textBoxEntryContractCust11.flxEnterValue.skin = "sknflxEnterValueError";
    this.view.textBoxEntryContractCust12.flxEnterValue.skin = "sknflxEnterValueError";
    this.view.textBoxEntryContractCust13.flxEnterValue.skin = "sknflxEnterValueError";
    this.view.textBoxEntryContractCust21.txtContactNumber.skin = "skntbxBordereb30173px";
    this.view.textBoxEntryContractCust21.txtISDCode.skin = "skntbxBordereb30173px";
    this.view.flxCalendarDOB22.skin="sknflxEnterValueError";
    this.view.flxDropDown23.skin= "sknflxEnterValueError";
    this.view.textBoxEntryContractCust31.flxEnterValue.skin = "sknflxEnterValueError";
    this.view.textBoxEntryContractCust32.flxEnterValue.skin = "sknflxEnterValueError";
    this.view.textBoxEntryContractCust33.flxEnterValue.skin = "sknflxEnterValueError";
    this.view.imgCustomerSearchError.setVisibility(true);
    this.view.lblCustomerSearchError.setVisibility(true);
  },
  /*
  * enroll form
  * reset to default skins for search fields
  */
  setNormalSkinToCoreSearch: function(){
    this.view.textBoxEntryContractCust11.flxEnterValue.skin = "sknflxEnterValueNormal";
    this.view.textBoxEntryContractCust12.flxEnterValue.skin = "sknflxEnterValueNormal";
    this.view.textBoxEntryContractCust13.flxEnterValue.skin = "sknflxEnterValueNormal";
    this.view.textBoxEntryContractCust21.txtContactNumber.skin = "skntxtbxDetails0bbf1235271384a";
    this.view.textBoxEntryContractCust21.txtISDCode.skin = "skntxtbxDetails0bbf1235271384a";
    this.view.flxCalendarDOB22.skin="sknflxEnterValueNormal";
    this.view.flxDropDown23.skin= "sknflxEnterValueNormal";
    this.view.textBoxEntryContractCust31.flxEnterValue.skin = "sknflxEnterValueNormal";
    this.view.textBoxEntryContractCust32.flxEnterValue.skin = "sknflxEnterValueNormal";
    this.view.textBoxEntryContractCust33.flxEnterValue.skin = "sknflxEnterValueNormal";
    this.view.imgCustomerSearchError.setVisibility(false);
    this.view.lblCustomerSearchError.setVisibility(false);
  },
  /*
  * enroll form
  * reset search params for customer search
  */
  resetCoreCustomerSearch : function(){
    this.view.textBoxEntryContractCust11.tbxEnterValue.text = "";
    this.view.textBoxEntryContractCust12.tbxEnterValue.text= "";
    this.view.textBoxEntryContractCust13.tbxEnterValue.text= "";
    this.view.textBoxEntryContractCust21.txtContactNumber.text= "";
    this.view.textBoxEntryContractCust21.txtISDCode.text="";
    this.view.customCalCustomerDOB.resetData=kony.i18n.getLocalizedString("i18n.frmLogsController.Select_Date");
    this.view.customCalCustomerDOB.value="";
    this.view.lblSelectedRows.text = kony.i18n.getLocalizedString("i18n.frmCSRController.Select_Status");
    this.view.textBoxEntryContractCust31.tbxEnterValue.text= "";
    this.view.textBoxEntryContractCust32.tbxEnterValue.text= "";
    this.view.textBoxEntryContractCust33.tbxEnterValue.text= "";
    this.view.AdvancedSearchDropDown01.sgmentData.selectedRowIndex=null;
    this.view.forceLayout();
  },
  /*
  * enroll form
  * search for core customer in popup
  */
  searchCoreCustomers : function(){
    var dob=this.getDateFormatYYYYMMDD(this.view.customCalCustomerDOB.value);
    var selectedInd=this.view.AdvancedSearchDropDown01.sgmentData.selectedRowIndex?this.view.AdvancedSearchDropDown01.sgmentData.selectedRowIndex[1]:null;
    var status="";
    if(selectedInd)
      status=this.view.AdvancedSearchDropDown01.sgmentData.data[selectedInd].customerStatusId;
    var searchRequest={
      "id":this.view.textBoxEntryContractCust11.tbxEnterValue.text,
      "name":this.view.textBoxEntryContractCust12.tbxEnterValue.text,
      "email":this.view.textBoxEntryContractCust13.tbxEnterValue.text,
      "phoneNumber":this.view.textBoxEntryContractCust21.txtContactNumber.text,
      "phoneCountryCode":this.view.textBoxEntryContractCust21.txtISDCode.text,
      "dob":dob === "NaN-NaN-NaN"?"":dob,
      "customerStatus":status,
      "country":this.view.textBoxEntryContractCust31.tbxEnterValue.text,
      "town":this.view.textBoxEntryContractCust32.tbxEnterValue.text,
      "zipcode":this.view.textBoxEntryContractCust33.tbxEnterValue.text
    };
    this.view.flxLoading2.setVisibility(true);
    this.presenter.searchOtherCoreCustomers(searchRequest,"contracts");
  },
  /*
  * enroll form
  * show the core customr results screen UI
  */
  setCoreCustomersList : function(customers){
    if(this.view.flxRow2.isVisible){
      this.view.flxColumn13.setVisibility(false);
      this.view.flxRow2.setVisibility(false);
      this.view.flxRow3.setVisibility(false);
      this.view.fonticonrightarrowSearch.text="";
      this.view.btnShowHideAdvSearch.text=kony.i18n.getLocalizedString("i18n.contracts.showAdvancedSearch");
    }
    if(customers.length>0){
      this.view.flxNoCustomersSearched.setVisibility(false);
      this.view.flxRelatedCustomerSegContracts.setVisibility(true);
      this.setCustomerSearchData(customers);
    }else{
      this.view.lblNoCustomersSearched.text==kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.No_results_found");
      this.view.flxNoCustomersSearched.setVisibility(true);
      this.view.lblRelatedcustSubHeading.setVisibility(false);
      this.view.flxRelatedCustomerSegContracts.setVisibility(false);
    }
    this.view.flxLoading2.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * data map for customer search results
  */
  getCustomersDataMap : function(){
    return{
      "flxRelatedCustomerList":"flxRelatedCustomerList",
      "flxRelatedCustomerRow":"flxRelatedCustomerRow",
      "flxLeftDetailsCont":"flxLeftDetailsCont",
      "flxCheckbox":"flxCheckbox",
      "imgCheckbox":"imgCheckbox",
      "flxContractDetails":"flxContractDetails",
      "flxContractName":"flxContractName",
      "lblContractName":"lblContractName",
      "lblContractId":"lblContractId",
      "flxDetails":"flxDetails",
      "flxColumn1":"flxColumn1",
      "lblHeading1":"lblHeading1",
      "lblData1":"lblData1",
      "flxColumn2":"flxColumn2",
      "lblHeading2":"lblHeading2",
      "lblData2":"lblData2",
      "flxColumn3":"flxColumn3",
      "lblHeading3":"lblHeading3",
      "lblData3":"lblData3",
      "flxRightDetailsCont":"flxRightDetailsCont",
      "flxContractRelation":"flxContractRelation",
      "btnRelation":"btnRelation",
      "lblContractInfo":"lblContractInfo",
      "flxRightActionCont":"flxRightActionCont",
      "flxRemoveContract":"flxRemoveContract",
      "lblIconRemove":"lblIconRemove",
      "lblLine":"lblLine",
      "lblPrimaryText":"lblPrimaryText",
      "flxPrimaryBtn":"flxPrimaryBtn",
      "imgRadioButton":"imgRadioButton",
      "customerInfo":"customerInfo"
    };
  },
  /*
  * enroll form
  * set customer search results data
  */
  setCustomerSearchData : function(customers){
    var dataMap=this.getCustomersDataMap();
    var self=this;
    this.view.lblRelatedcustSubHeading.setVisibility(true);
    this.view.lblRelatedcustSubHeading.text=kony.i18n.getLocalizedString("i18n.contracts.searchResults")+" ("+customers.length+")";
    var details={};
    var address="";
    var data=customers.map(function(customer){
      if(customer.cityName||customer.country)
          address=self.AdminConsoleCommonUtils.getAddressText(customer.cityName,customer.country);
        else
          address="N/A";
      details ={
        "id": customer.coreCustomerId,
        "name": customer.coreCustomerName,
        "industry":customer.industry?customer.industry:"N/A",
        "email": customer.email,
        "phone":customer.phone,
        "address": address
      };
      return{
        "template":"flxRelatedCustomerList",
        "flxCheckbox":{"isVisible":false},
        "imgCheckbox":{"src":self.AdminConsoleCommonUtils.checkboxnormal},
        "flxRelatedCustomerRow":{"skin":customer.isAssociated === "true"?"sknFlxbgF3F3F3bdrd7d9e0":"sknFlxbgFFFFFFbdrD7D9E0rd4px",
                                 "onClick":customer.isAssociated === "true"?function(){}:function(){
                                   self.addCustomer(customer);
                                 }},
        "lblContractName":{"onTouchStart":self.showCustomerDetailsPopup.bind(self,details,true),"text":customer.coreCustomerName},
        "lblContractId":customer.coreCustomerId,
        "lblHeading1":{"text":kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.CUSTOMER_ID")},
        "lblData1":{"text":customer.coreCustomerId},
        "flxColumn2":{"left":"36%"},
        "lblHeading2":{"text":kony.i18n.getLocalizedString("i18n.View.ADDRESS")},
        "lblData2":{"text":address},
        "flxColumn3":{"isVisible":false},
        "flxRightDetailsCont":{"isVisible":customer.isAssociated === "true"?true:false},
        "lblContractInfo":{"text":kony.i18n.getLocalizedString("i18n.contracts.partOfAnotherContract"),"isVisible":customer.isAssociated === "true"?true:false},
        "btnRelation":{"isVisible":false},
        "flxRightActionCont":{"isVisible":false},
        "flxPrimaryBtn":{"isVisible":false},
        "customerInfo":customer
      }
    });
    this.view.segRelatedCustomersContract.widgetDataMap=dataMap;
    this.view.segRelatedCustomersContract.setData(data);
    this.view.flxRelatedCustomerSegContracts.setVisibility(true);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set the data on click of a related customer from list in popup 
  */
  setSelectedCustomerData : function(relatedCustomers,coreCustomerId){
    var selectedCustIndex=this.view.segRelatedCustomersContract.selectedRowIndex[1];
    var customerInfo;
    if(this.view.flxCustomerSearchPopUp.info.action!=="BREADCRUMBCLICK"){
      customerInfo=this.view.segRelatedCustomersContract.data[selectedCustIndex].customerInfo;
      var isAdded=false;
      for(var i=0;i<this.selectedCustomers.length;i++){
        if(this.selectedCustomers[i].coreCustomerId === customerInfo.coreCustomerId){
          isAdded=true;
          if(this.selectedCustomers[i].isSelected === false)
            this.selectedCustomers[i].isSelected=true;
        }
      }
      if(isAdded === false){
        customerInfo.isSelected=true;
        this.selectedCustomers.push(customerInfo);
      }
    }else{
      for(var i=0;i<this.selectedCustomers.length;i++){
        if(coreCustomerId === this.selectedCustomers[i].coreCustomerId){
          customerInfo=this.selectedCustomers[i];
        }
      }
    }
    var addressData="N/A";
    if(customerInfo.cityName||customerInfo.country)
      addressData=this.AdminConsoleCommonUtils.getAddressText(customerInfo.cityName,customerInfo.country);
    this.view.imgCheckbox.src=customerInfo.isSelected!==false? this.AdminConsoleCommonUtils.checkboxSelected:this.AdminConsoleCommonUtils.checkboxnormal;
    this.view.lblContractName.text=customerInfo.coreCustomerName;
    this.view.lblContractId.text=customerInfo.coreCustomerId;
    this.view.lblDataInfo11.text=customerInfo.coreCustomerId;
    this.view.lblDataInfo12.text=addressData;
    this.view.lblDataInfo13.text=customerInfo.industry?customerInfo.industry:"N/A";
    this.view.lblDataInfo21.text=customerInfo.email;
    this.view.lblDataInfo22.text=customerInfo.phone;
    if(relatedCustomers.length>0){
      this.view.lblRelatedcustSubHeading.text=kony.i18n.getLocalizedString("i18n.contracts.relatedCustomers")+" ("+relatedCustomers.length+")";
      var self=this;
      var isAdded=false;
      var details={};
      var address="";
      var relatedCustData=relatedCustomers.map(function(customer){
        isAdded=false;
        for(var i=0;i<self.selectedCustomers.length;i++){
          if(self.selectedCustomers[i].coreCustomerId === customer.coreCustomerId&&self.selectedCustomers[i].isSelected)
            isAdded=true;
        }
        if(customer.cityName||customer.country)
          address=self.AdminConsoleCommonUtils.getAddressText(customer.cityName,customer.country);
        else
          address="N/A";
        details ={
          "id": customer.coreCustomerId,
          "name": customer.coreCustomerName,
          "industry":customer.industry?customer.industry:"N/A",
          "email": customer.email,
          "phone":customer.phone,
          "address": address
        };        
        return{
          "template":"flxRelatedCustomerList",
          "flxCheckbox":{"isVisible":true,"onClick":(customer.isAssociated === "true")?function(){}:function(context){self.relatedCustomersCheckboxClick(context,customer)}},
          "imgCheckbox":{"src":isAdded?self.AdminConsoleCommonUtils.checkboxSelected:self.AdminConsoleCommonUtils.checkboxnormal},
          "flxRelatedCustomerRow":{"skin":customer.isAssociated === "true"?"sknFlxbgF3F3F3bdrd7d9e0":"sknFlxbgFFFFFFbdrD7D9E0rd4px",
                                   "onClick":(customer.isAssociated === "true")?function(){}:function(){
                                     var isBreadcrumb=false;
                                     for(let x=0;x<self.view.flxSearchBreadcrumb.info.added.length;x++){
                                       if(self.view.flxSearchBreadcrumb.info.added[x][0] === customer.coreCustomerId){
                                         isBreadcrumb=true;
                                       }
                                     }
                                     if(isBreadcrumb === true)
                                       self.onBreadcrumbClick(customer.coreCustomerId);           
                                     else
                                       self.addCustomer(customer);
                                   }
                                  },
          "lblContractName":{"onTouchStart":self.showCustomerDetailsPopup.bind(self,details,true),"text":customer.coreCustomerName},
          "lblContractId":customer.coreCustomerId,
          "lblHeading1":{"text":kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.CUSTOMER_ID")},
          "lblData1":{"text":customer.coreCustomerId},
          "flxColumn2":{"left":"37%"},
          "lblHeading2":{"text":kony.i18n.getLocalizedString("i18n.View.ADDRESS")},
          "lblData2":{"text":address},
          "flxColumn3":{"isVisible":false},
          "flxContractRelation":{"isVisible":false},
          "flxRightDetailsCont":{"isVisible":true},
          "btnRelation":{"isVisible":true,"text":customer.relationshipName},
          "lblContractInfo":{"text":kony.i18n.getLocalizedString("i18n.contracts.partOfAnotherContract"),"isVisible":customer.isAssociated === "true"?true:false},
          "flxRightActionCont":{"isVisible":true},
          "customerInfo":customer
        }
      });
      this.view.segRelatedCustomersContract.setData(relatedCustData);
      this.view.flxNoCustomersSearched.setVisibility(false);
      this.view.lblRelatedcustSubHeading.setVisibility(true);
      this.view.flxRelatedCustomerSegContracts.setVisibility(true);
    }else{
      this.view.lblNoCustomersSearched.text=kony.i18n.getLocalizedString("i18n.contracts.noRelatedCustomers");
      this.view.lblRelatedcustSubHeading.setVisibility(true);
      this.view.lblRelatedcustSubHeading.text=kony.i18n.getLocalizedString("i18n.contracts.relatedCustomers")+" (0)";
      this.view.flxNoCustomersSearched.setVisibility(true);
      this.view.flxRelatedCustomerSegContracts.setVisibility(false);
    }
    this.view.flxSelectedCustomerInfo.setVisibility(true);
    this.view.flxLoading2.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * click of related customers checkbox
  */
  relatedCustomersCheckboxClick : function(context){
    var selIndex=context.rowContext.rowIndex;
    var segData=this.view.segRelatedCustomersContract.data;
    var customer=segData[selIndex].customerInfo;
    var tags=this.view.flxSearchFilter.widgets();
    var isAdded=false;
    for(var x=0;x<this.selectedCustomers.length;x++){
        if(this.selectedCustomers[x].coreCustomerId === customer.coreCustomerId){
          isAdded=true;
          if(this.selectedCustomers[x].isSelected === false)
            this.selectedCustomers[x].isSelected=true;
          break;
        }
      }
    if(segData[selIndex].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal){
      if(isAdded){
        this.selectedCustomers[x].isSelected=true;
      }else{
        customer.isSelected=true;
        this.selectedCustomers.push(customer);
      }
      this.addCustomerTag(this.view.flxSearchFilter,this.selectedCustomers[x].coreCustomerName,this.selectedCustomers[x].coreCustomerId);
      segData[selIndex].imgCheckbox.src= this.AdminConsoleCommonUtils.checkboxSelected;
    }else{
      segData[selIndex].imgCheckbox.src=this.AdminConsoleCommonUtils.checkboxnormal;
      this.selectedCustomers[x].isSelected=false;
      this.removeTagContracts(this.view.flxSearchFilter,this.selectedCustomers[x].coreCustomerId);
        if(tags.length === 1){
          this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractSearchCust.btnSave,true,false);
          this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractSearchCust.btnNext,false,false);
        }
    }
    this.view.segRelatedCustomersContract.setData(segData);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set the data based on the selected customer in search
  */
  setSelectedCustomersData: function(){
    var customersData=this.selectedCustomers;
    var dataMap=this.getCustomersDataMap();
    var self=this;
    var details={};
    var relatedCustData=[];
    var primaryIndex="";
    var address="";
    for(var x=0;x<customersData.length;x++){
      if(customersData[x].isSelected!==false){
        if(customersData[x].cityName||customersData[x].country)
          address=this.AdminConsoleCommonUtils.getAddressText(customersData[x].cityName,customersData[x].country);
        else
          address="N/A";
        details ={
        "id": customersData[x].coreCustomerId,
        "name": customersData[x].coreCustomerName,
        "industry":customersData[x].industry?customersData[x].industry:"N/A",
        "email": customersData[x].email,
        "phone":customersData[x].phone,
        "address": address
      };
        if(this.action === this.actionConfig.edit&&customersData[x].isPrimary === "true")
          primaryIndex=x;
        relatedCustData.push({
          "template":"flxRelatedCustomerList",
          "lblContractName":{"onTouchStart":self.showCustomerDetailsPopup.bind(self,details,false),"text":customersData[x].coreCustomerName},
          "lblContractId":customersData[x].coreCustomerId,
          "lblHeading1":{"text":kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.CUSTOMER_ID")},
          "lblData1":{"text":customersData[x].coreCustomerId},
          "flxColumn2":{"left":"37%"},
          "lblHeading2":{"text":kony.i18n.getLocalizedString("i18n.View.ADDRESS")},
          "lblData2":{"text":address},
          "flxColumn3":{"isVisible":false},
          "flxContractRelation":{"isVisible":false},
          "flxRightActionCont":{"isVisible":true},
          "flxRemoveContract":{"enable":true,"isVisible":true,"onClick":function(context){self.deleteCoreCustomer(context)},"onHover":function(){}},
          "lblIconRemove":{"text":"","skin":"sknIcon00000015px"},
          "lblLine":{"isVisible":true},
          "lblPrimaryText":{"text":kony.i18n.getLocalizedString("i18n.userwidgetmodel.lblprimary1")},
          "flxPrimaryBtn":{"onClick":function(context){self.setCustomerAsPrimary(context)}},
          "imgRadioButton":{"src":"radio_notselected.png"},
          "customerInfo":customersData[x]
        });
      };
    }      
    this.view.segAddedCustomers.widgetDataMap=dataMap;
    if(relatedCustData.length === 1){
      relatedCustData[0].flxRemoveContract.isVisible=false;
      relatedCustData[0].lblLine.isVisible=false;
    }  
    this.view.segAddedCustomers.setData(relatedCustData);
    this.view.lblContractCustomersHeader.text=kony.i18n.getLocalizedString("i18n.contracts.summarySelectedCustomers") +" ("+relatedCustData.length+")";
    if(this.action === this.actionConfig.edit)
      relatedCustData[0].flxPrimaryBtn.onClick({rowContext:{rowIndex:primaryIndex}});
    else
      relatedCustData[0].flxPrimaryBtn.onClick({rowContext:{rowIndex:0}});
    this.view.forceLayout();
  },
  /*
  * enroll form
  * remove a coree customer added to contract
  */
  deleteCoreCustomer : function(context){
    var selIndex=context.rowContext.rowIndex;
    var segData=this.view.segAddedCustomers.data;
    var customer=segData[selIndex].customerInfo;
    var isDeleted=false;
    var self=this;
    for(let x=0;x<this.selectedCustomers.length;x++){
      if(this.selectedCustomers[x].coreCustomerId === customer.coreCustomerId){
          this.selectedCustomers.splice(x,1);
          this.view.segAddedCustomers.removeAt(selIndex,0);
          isDeleted=true;
          this.view.lblContractCustomersHeader.text=kony.i18n.getLocalizedString("i18n.contracts.summarySelectedCustomers") +" (" +this.view.segAddedCustomers.data.length+")";
          break;
      }
    }
    for(let y=0;y<this.createContractRequestParam.contractCustomers.length;y++){
      if(this.createContractRequestParam.contractCustomers[y].coreCustomerId === customer.coreCustomerId){
        this.createContractRequestParam.contractCustomers.splice(y,1);
        break;
      }
    }
    if(isDeleted){
      for(let x=0;x<this.view.segAddedCustomers.data.length;x++){
        if(this.view.segAddedCustomers.data[x].imgRadioButton.src === "radio_selected.png"){
          this.view.segAddedCustomers.data[x].flxPrimaryBtn.onClick({rowContext:{rowIndex:x}});
          break;
        }
      }
    }
    
    if(this.view.segAddedCustomers.data.length === 1){
      segData=this.view.segAddedCustomers.data[0];
      segData.flxRemoveContract.isVisible=false;
      segData.lblLine.isVisible=false;
      this.view.segAddedCustomers.setDataAt(segData,0);
    }
    this.view.forceLayout();
  },
  /*
  * enroll form
  * show delete icon
  */
  showPrimaryDeleteHover : function(widget,context){
    var scopeObj = this;
    var widGetId = widget.id;
    var topVal=0;
    if (widget) {
      if (context.eventType === constants.ONHOVER_MOUSE_ENTER) {
          topVal=context.screenY-125;
        scopeObj.view.ToolTipDelete.top=topVal+"px";
        scopeObj.view.ToolTipDelete.setVisibility(true)
      }else if (context.eventType === constants.ONHOVER_MOUSE_MOVE) {
        scopeObj.view.ToolTipDelete.setVisibility(true);
      } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
        scopeObj.view.ToolTipDelete.setVisibility(false);
      }
    }
    scopeObj.view.forceLayout();
  },
  /*
  * enroll form
  * set added customers as primary
  */
  setCustomerAsPrimary : function(contextObj){
    var self=this;
    var segData=this.view.segAddedCustomers.data;
    for(var x=0;x<this.selectedCustomers.length;x++)
      this.selectedCustomers[x].isPrimary="false";
    this.selectedCustomers[contextObj.rowContext.rowIndex].isPrimary="true";
    for(let i=0;i<this.createContractRequestParam.contractCustomers.length;i++){
      if(this.createContractRequestParam.contractCustomers[i].coreCustomerId === this.selectedCustomers[contextObj.rowContext.rowIndex].coreCustomerId)
        this.createContractRequestParam.contractCustomers[i].isPrimary="true";
      else
        this.createContractRequestParam.contractCustomers[i].isPrimary="false";
    }
    for(let a=0;a<segData.length;a++){
      segData[a].imgRadioButton.src="radio_notselected.png";
      segData[a].flxRemoveContract.onClick=function(context){self.deleteCoreCustomer(context)};
      segData[a].flxRemoveContract.onHover=function(){};
      segData[a].lblIconRemove.skin="sknIcon00000015px";
    }
    segData[contextObj.rowContext.rowIndex].imgRadioButton.src="radio_selected.png";
    segData[contextObj.rowContext.rowIndex].flxRemoveContract.onClick=function(){};
    segData[contextObj.rowContext.rowIndex].lblIconRemove.skin="sknIconb2b2b215px";
    segData[contextObj.rowContext.rowIndex].flxRemoveContract.onHover=function(widget,context){
      context.rowIndex=contextObj.rowContext.rowIndex;
      self.showPrimaryDeleteHover(widget,context);
    };
    this.primaryContractCustomer=segData[contextObj.rowContext.rowIndex].customerInfo;
    this.view.segAddedCustomers.setData(segData);
    this.setCustomersDropDownList("customersDropdown");
    this.setCustomersDropDownList("customersDropdownFA");
    this.setCustomersDropDownList("customersDropdownContractLimits");
    this.view.imgContractAccounts.setVisibility(true);
    this.view.lblNoCustomersSelected.text= kony.i18n.getLocalizedString("i18n.contracts.selectCustomerAccount");
    this.view.flxNoCustomerSelected.setVisibility(true);
    this.view.flxContractAccountsList.setVisibility(false);
    if(this.action === this.actionConfig.create&&this.createContractRequestParam.contractCustomers.length === 0){
      var coreCustomerIdList=[];
      for(var x=0;x<this.selectedCustomers.length;x++){
        if(this.selectedCustomers[x].isSelected!==false){
          coreCustomerIdList.push(this.selectedCustomers[x].coreCustomerId);
          this.createContractRequestParam.contractCustomers.push({
            "isPrimary": this.selectedCustomers[x].isPrimary?this.selectedCustomers[x].isPrimary:"false",
            "coreCustomerId": this.selectedCustomers[x].coreCustomerId,
            "coreCustomerName": this.selectedCustomers[x].coreCustomerName,
            "isBusiness": this.selectedCustomers[x].isBusiness,
            "sectorId": this.selectedCustomers[x].sectorId,
            "accounts":[],
            "features":[],
          });
        }
      }
      this.presenter.getCoreCustomerAccounts({"coreCustomerIdList":coreCustomerIdList});
      var serviceDefId=this.view[this.selectedServiceCard].lblCategoryName.info.catId;
      this.presenter.getServiceDefinitionFeaturesAndLimits({"serviceDefinitionId":serviceDefId},true);
      
    } else if(this.action === this.actionConfig.edit){
      if(this.createContractRequestParam.contractCustomers.length === 0){
        var coreCustomerIdList=[];
        for(var x=0;x<this.selectedCustomers.length;x++){
          if(this.selectedCustomers[x].isSelected!==false){
            coreCustomerIdList.push(this.selectedCustomers[x].coreCustomerId);
            this.createContractRequestParam.contractCustomers.push({
              "isPrimary": this.selectedCustomers[x].isPrimary,
              "coreCustomerId": this.selectedCustomers[x].coreCustomerId,
              "coreCustomerName": this.selectedCustomers[x].coreCustomerName,
              "sectorId": this.selectedCustomers[x].sectorId,
              "isBusiness": this.selectedCustomers[x].isBusiness,
              "accounts":[],
              "features":[],
            });
          }
        }
        this.presenter.getCoreCustomerAccounts({"coreCustomerIdList":coreCustomerIdList});
      }
    }
    this.setContractDetails();
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsCustomers.btnSave,true,true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsCustomers.btnNext,false,true);
    this.enableAllTabs(true);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * create breaadcrumb based on selected customers while search
  */
  addBreadcrumb : function(customerInfo){
    var self=this;
    var i=this.view.flxSearchBreadcrumb.widgets();
    var tagsCount=i.length;    
    var id=customerInfo.coreCustomerId;
    var name=customerInfo.coreCustomerName.toUpperCase();
    if(this.view.flxSearchBreadcrumb.info.added.length === 0){
      this.view.lblCurrentScreen.info=customerInfo;
      this.view.lblCurrentScreen.text=name;
      this.view.flxSearchBreadcrumb.info.added.push([id,customerInfo.coreCustomerName]);
    }else{
      var newButton = this.view.btnBackToMain.clone(tagsCount.toString());
      var newArrow=this.view.fontIconBreadcrumbsRight.clone(tagsCount.toString());
      var flexWidth= this.AdminConsoleCommonUtils.getLabelWidth(name,"12px Lato-Regular");
      newButton.text = JSON.parse(JSON.stringify(this.view.lblCurrentScreen.text));
      newArrow.text="";
      newButton.isVisible = true;
      newArrow.isVisible=true;
      newButton.info=JSON.parse(JSON.stringify(this.view.lblCurrentScreen.info));
      newButton.onClick = function(){
        self.onBreadcrumbClick(newButton.info.coreCustomerId);
      }
      this.view.flxSearchBreadcrumb.info.added.push([this.view.lblCurrentScreen.info,this.view.lblCurrentScreen.text]);
      this.view.lblCurrentScreen.info=customerInfo;
      this.view.lblCurrentScreen.text=name;
      var width=0;
      var parentWidth=this.view.flxPopupHeader.frame.width/2;
      if(this.view.segBreadcrumbs.data.length === 0){
        for(var a=tagsCount-1;a>=0;a--){
          width=width+(i[a].frame.width);
          if(i.indexOf("fontIconBreadcrumbsRight")){
            width=width+12;
          }
        }
        if(flexWidth+width>parentWidth){
          if(this.view["3btnBackToMain"]){
            this.setBreadcrumbSegData(JSON.parse(JSON.stringify(this.view["3btnBackToMain"].info)));
          }
          for(var x=5;x<tagsCount;x+2){//as the buttons are created as 3btnBackToMain,3fontIconBreadcrumbsRight,5btnBackToMainbtn...
            this.view[x+"btnBackToMain"].text=this.view[x+1+"btnBackToMain"]?this.view[x+1+"btnBackToMain"].text:newButton.text;
            this.view[x+"btnBackToMain"].info=this.view[x+1+"btnBackToMain"]?this.view[x+1+"btnBackToMain"].info:newButton.info;
          }
          //if only once contract is selected and the width exceeds half width
          if(this.view["3btnBackToMain"]){
            this.view["3btnBackToMain"].text="...";
            this.view["3btnBackToMain"].onClick =function(){
              self.view.flxSegMore.left=self.view["3btnBackToMain"].frame.x-120+"px";
              self.view.flxSegMore.setVisibility(!self.view.flxSegMore.isVisible);
            }
          }
            this.view.flxSearchBreadcrumb.addAt(newButton,tagsCount-1);
            this.view.flxSearchBreadcrumb.addAt(newArrow,tagsCount);
        }else{
          this.view.flxSearchBreadcrumb.addAt(newButton,tagsCount-1);
          this.view.flxSearchBreadcrumb.addAt(newArrow,tagsCount);
        }
      }else{
        var custId=JSON.parse(JSON.stringify(self.view["5btnBackToMain"].info.coreCustomerId));
        var rowData={
          "flxMore":{"onClick":function(){
            self.onBreadcrumbClick(custId);
            self.view.flxSegMore.setVisibility(false);}},
          "lblName":{"text":self.view["5btnBackToMain"].info.coreCustomerName,"skin":"sknLblLatoReg117eb013px","info":self.view["5btnBackToMain"].info},
          "template":"flxMore"
        }
        this.view.segBreadcrumbs.addDataAt(rowData,0);
        for(var x=5;x<tagsCount;x=x+2){//as the buttons are created as 3btnBackToMain,3fontIconBreadcrumbsRight,5btnBackToMainbtn...
            this.view[x+"btnBackToMain"].text=this.view[x+1+"btnBackToMain"]?this.view[x+1+"btnBackToMain"].text:newButton.text;
            this.view[x+"btnBackToMain"].info=this.view[x+1+"btnBackToMain"]?this.view[x+1+"btnBackToMain"].info:newButton.info;
          }
      }
    }
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set data to breadcrumb segment on truncated
  */
  setBreadcrumbSegData: function(customerInfo){
    var self=this;
    var dataMap={
      "flxMore":"flxMore",
      "lblName":"lblName"
    };
    var segData=[{
        "flxMore":{"onClick":function(){
          self.onBreadcrumbClick(customerInfo.coreCustomerId);
          self.view.flxSegMore.setVisibility(false);
          }},
        "lblName":{"text":customerInfo.coreCustomerName,"skin":"sknLblLatoReg117eb013px","info":customerInfo},
        "template":"flxMore"
      }]
    this.view.segBreadcrumbs.widgetDataMap=dataMap;
    this.view.segBreadcrumbs.setData(segData);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * add the selected customer from customer search in contracts flow
  */
  setAddedCustDataInRequest : function(){
    var customersData=this.selectedCustomers;
    var newlyAddedIds=[];
    var isNewlyAdded=true;
    for(var a=0;a<customersData.length;a++){
      isNewlyAdded=true;
      for(var b=0;b<this.createContractRequestParam.contractCustomers.length;b++){
        if(customersData[a].coreCustomerId === this.createContractRequestParam.contractCustomers[b].coreCustomerId){
          isNewlyAdded=false;
          break;
        }
      }
      if(isNewlyAdded){
        newlyAddedIds.push(customersData[a].coreCustomerId);
        this.createContractRequestParam.contractCustomers.push({
          "isPrimary": customersData[a].isPrimary? customersData[a].isPrimary : false,
          "coreCustomerId": customersData[a].coreCustomerId,
          "coreCustomerName": customersData[a].coreCustomerName,
          "sectorId":customersData[a].sectorId,
          "isBusiness": customersData[a].isBusiness,
          "accounts":[],
          "features":[],
        });
      }
    }
     this.presenter.getCoreCustomerAccounts({"coreCustomerIdList":newlyAddedIds});
  },
  /*
  * enroll form
  * rever added customers in contracts
  */
  revertAddedCustomers : function(){
    if(this.view.segAddedCustomers.isVisible){
      var segAddedData=this.view.segAddedCustomers.data;
      var custIds=[];
      for(let x=0;x<segAddedData.length;x++){
        custIds.push(segAddedData[x].customerInfo.coreCustomerId);
      }
      for(let y=0;y<this.selectedCustomers.length;y++){
        if(!custIds.includes(this.selectedCustomers[y].coreCustomerId))
          this.selectedCustomers[y].isSelected=false;
      }
    }else{
      this.selectedCustomers=[];
    }
  },
  /*
  * enroll form
  * set accounts of customer in create contract
  */
  setContractAccountsData : function(customerAccounts){
    if(this.action === this.actionConfig.create){
      for(var i=0;i<customerAccounts.length;i++){
        for(var j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
          if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === customerAccounts[i].coreCustomerId)
            this.createContractRequestParam.contractCustomers[j].accounts=customerAccounts[i].accounts;
        }
      }
    }else{
      var selectedAccIds={};
      var accIds=[];
      var contractDetails=JSON.parse(JSON.stringify(this.completeContractDetails));
      for(let x=0;x<contractDetails.contractCustomers.length;x++){
        if(contractDetails.contractCustomers[x].accounts){
        for(let y=0;y<contractDetails.contractCustomers[x].accounts.length;y++){
			accIds.push(contractDetails.contractCustomers[x].accounts[y].accountId);
        }
        }
        selectedAccIds[contractDetails.contractCustomers[x].coreCustomerId]=accIds;
      }
      for(var i=0;i<customerAccounts.length;i++){
        for(var j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
          if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === customerAccounts[i].coreCustomerId&&customerAccounts[i].accounts){
            for(var k=0;k<customerAccounts[i].accounts.length;k++){
              if(selectedAccIds[customerAccounts[i].coreCustomerId]){
                var accId = customerAccounts[i].accounts[k].accountNumber || customerAccounts[i].accounts[k].accountId;
              if(selectedAccIds[customerAccounts[i].coreCustomerId].includes(accId)||customerAccounts[i].accounts[k].isNew==="true")
                customerAccounts[i].accounts[k].isEnabled="true";
              else
                customerAccounts[i].accounts[k].isEnabled="false";
            }
            }
            this.createContractRequestParam.contractCustomers[j].accounts=customerAccounts[i].accounts;
          }
        }
      }
    }
  },
  /*
  * enroll form
  * set customers list to the dropdown in required tabs
  */
  setCustomersDropDownList : function(componentName){
    this.view[componentName].btnPrimary.setVisibility(true);//to get its width while calculating its parent flex width
    var selectedCustomers= this.selectedCustomers;
    var maxLengthText="";
    var data=[];
    var widgetMap={
      "flxCustomerName":"flxCustomerName",
      "flxCustomerNameCont":"flxCustomerNameCont",
      "lblCustomerName":"lblCustomerName",
      "btnPrimaryCustomers":"btnPrimaryCustomers"
    }
    var self=this;
    for(var x=0;x<selectedCustomers.length;x++){
      if(selectedCustomers[x].isSelected!==false){
        if((selectedCustomers[x].coreCustomerName+"("+selectedCustomers[x].coreCustomerId+")").length>maxLengthText.length)
          maxLengthText=selectedCustomers[x].coreCustomerName+"("+selectedCustomers[x].coreCustomerId+")";
        data.push({
          "flxCustomerName":{"onClick":function(){
            if(componentName === "customersDropdownContractLimits"&&self.view.flxContractLimitsList.isVisible){
              self.updateLimitValues();
            }
            self.setSelectedText(componentName);
            self.setCustSelectedData(componentName,false);
          }},
        "id":selectedCustomers[x].coreCustomerId,
        "lblCustomerName":{"text":selectedCustomers[x].coreCustomerName+"("+selectedCustomers[x].coreCustomerId+")"},
        "btnPrimaryCustomers":{"isVisible":selectedCustomers[x].isPrimary === "true"?true:false}
      });
      }
    }
    this.view[componentName].segList.widgetDataMap=widgetMap;
    this.view[componentName].segList.setData(data);
    this.view.forceLayout();//to get the primary button width, calling forceLayout
    this.view[componentName].segList.info={"records":data};
    this.view[componentName].lblSelectedValue.text=kony.i18n.getLocalizedString("i18n.contracts.selectACustomer")
    this.view[componentName].tbxSearchBox.text="";
    this.view[componentName].flxClearSearchImage.setVisibility(false);
    var maxTextWidth=this.AdminConsoleCommonUtils.getLabelWidth(maxLengthText,"13px Lato-Regular");
    var dropdownWidth=maxTextWidth+15+15+this.view[componentName].btnPrimary.frame.width+15;
    if(componentName === "customersDropdownContractLimits")
      this.view.flxCustomerDropdownLimits.width=dropdownWidth>270?dropdownWidth+"px":"270px";
    else if(componentName === "customersDropdown")
      this.view.flxCustomerDropdown.width=dropdownWidth>270?dropdownWidth+"px":"270px";
    else if(componentName === "customersDropdownFA")
      this.view.flxCustomerDropdownFA.width=dropdownWidth>270?dropdownWidth+"px":"270px";
    this.view[componentName].flxSegmentList.setVisibility(false);
    this.view[componentName].btnPrimary.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * search for customers in dropdown list
  */
  searchCustomersDropDownList : function(componentName){
    var segData=this.view[componentName].segList.info.records;
    var searchText=this.view[componentName].tbxSearchBox.text;
    var custName="";
    var searchResults=segData.filter(function(rec){
      custName=rec.lblCustomerName.text.toLowerCase();
      if(custName.indexOf(searchText)>=0)
        return rec;
    });
    this.view[componentName].segList.setData(searchResults);
    this.view[componentName].lblSelectedValue.text=kony.i18n.getLocalizedString("i18n.contracts.selectACustomer");
    this.view[componentName].btnPrimary.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set selected customer from the list to label
  */
  setSelectedText : function(componentName,selectedId){
    var selIndex="";
    var segData=this.view[componentName].segList.data;
    if(selectedId){
      for(let x=0;x<segData.length;x++){
        if(segData[x].id === selectedId){
          selIndex=x;
          break;
        }
      }
    }else{
      selIndex=this.view[componentName].segList.selectedRowIndex[1];
    }
    var isPrimary=segData[selIndex].btnPrimaryCustomers.isVisible?true:false;
    this.view[componentName].lblSelectedValue.text=this.AdminConsoleCommonUtils.getTruncatedString(segData[selIndex].lblCustomerName.text,isPrimary?25:30,isPrimary?22:27);
    this.view[componentName].lblSelectedValue.toolTip=segData[selIndex].lblCustomerName.text;
    this.view[componentName].lblSelectedValue.info={"id":segData[selIndex].id};
    this.view[componentName].btnPrimary.setVisibility(isPrimary);
    this.view[componentName].flxSegmentList.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * set selected customer realted features actions
  */
  setCustSelectedData : function(component,isSearch){
    var selectedCustId=this.view[component].lblSelectedValue.info?this.view[component].lblSelectedValue.info.id:this.view[component].segList.data[0].id;
    var dataToSet=[];
    var customerDetails={};
    for(var i=0;i<this.selectedCustomers.length;i++){
      if(this.selectedCustomers[i].coreCustomerId === selectedCustId){
        customerDetails=this.selectedCustomers[i];
        break;
      }
    }
    var address="";
    if(customerDetails.cityName||customerDetails.country)
      address=this.AdminConsoleCommonUtils.getAddressText(customerDetails.cityName,customerDetails.country);
    else
      address="N/A";
    var details = {
        "id": customerDetails.coreCustomerId,
        "name": customerDetails.coreCustomerName,
        "industry":customerDetails.industry?customerDetails.industry:"N/A",
        "email": customerDetails.email,
        "phone":customerDetails.phone,
        "address": address
      };
    if(component === "customersDropdown"){
      for(let j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
        if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
          dataToSet=JSON.parse(JSON.stringify(this.createContractRequestParam.contractCustomers[j].accounts));
          break;
        }
      }
      if(isSearch === false){
        this.view.tbxAccountsSearch.text="";
        this.view.flxClearAccountsSearch.setVisibility(false);
        this.view.ContractAccountsList.lblName.text=customerDetails.coreCustomerName;
        this.view.ContractAccountsList.lblName.onTouchStart = this.showCustomerDetailsPopup.bind(this,details,false);
        this.view.ContractAccountsList.lblData1.text=selectedCustId;
        this.view.ContractAccountsList.lblData2.text=customerDetails.taxId?customerDetails.taxId:"N/A";
        this.view.ContractAccountsList.lblData3.text=address;
        this.view.ContractAccountsList.flxPrimary.setVisibility(customerDetails.isPrimary === "true"?true:false);
        this.view.lblSeperatorAccounts.setVisibility(false);
        this.view.flxNoCustomerSelected.setVisibility(false);
        this.view.flxContractAccountsList.setVisibility(true);
        this.view.flxContractAccountsSearch.setVisibility(true);      
        this.setAccountsDataCustomers(dataToSet.concat([]));
        this.view.flxContractAccountsList.info={"totalRecords":dataToSet};
        this.setContractAccountsData(dataToSet)
        this.setContractsAccTypeFilterData(dataToSet);
        this.setContractOwnerShipFilterData(dataToSet);
      }else{
        this.searchAccountsContracts(dataToSet.concat([]));
      }
    }else if(component === "customersDropdownContractLimits"){
      var features=[];
      var limitFeatures=[];
      var limitActions=[]
      for(let j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
        if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
          features=JSON.parse(JSON.stringify(this.createContractRequestParam.contractCustomers[j].features));
          break;
        }
      }
      var isSelected=true;
      for(var a=0;a<features.length;a++){
        if(features[a].type === "MONETARY"&&features[a].actions.length>0){
          limitFeatures=JSON.parse(JSON.stringify(features[a]));
          limitActions = features[a].actions.filter(function(item) {
            isSelected=true;
            //to check whether this action is checked in features and actions tab or not
            if(item.isEnabled)
              isSelected=item.isEnabled === "true"?true:false;
            return item.type=="MONETARY"&&isSelected;
          });
          if(limitActions.length>0){
            limitFeatures.actions=limitActions;
            dataToSet.push(limitFeatures);
          }
        }
      }
      if(isSearch === false){
        this.view.lblSeperatorLimits.setVisibility(false);
        this.view.flxContractLimitsList.setVisibility(true);
        this.view.flxContractLimits.setVisibility(true);
        this.view.ContractLimitsList.lblName.text=customerDetails.coreCustomerName;
        this.view.ContractLimitsList.lblName.onTouchStart = this.showCustomerDetailsPopup.bind(this,details,false);
        this.view.ContractLimitsList.flxPrimary.setVisibility(customerDetails.isPrimary === "true"?true:false);
        this.view.ContractLimitsList.lblData1.text=selectedCustId;
        this.view.ContractLimitsList.lblData2.text=customerDetails.taxId?customerDetails.taxId:"N/A";
        this.view.ContractLimitsList.lblData3.text=address;
        if(dataToSet.length>0){
          this.view.tbxContractLimitsSearch.text="";
          this.view.flxClearContractLimitsSearch.setVisibility(false);
          this.view.ContractLimitsList.flxNoFilterResults.setVisibility(false);
          this.view.ContractLimitsList.segAccountFeatures.setVisibility(true);
          this.view.flxContractLimitsSearch.setVisibility(true);
          this.view.ContractLimitsList.btnReset.setVisibility(true);
          this.view.btnUpdateInBulkLimits.setVisibility(true);
          this.setLimitsDataForCustomer(JSON.parse(JSON.stringify(dataToSet)));
        }else{
          this.view.ContractLimitsList.lblNoFilterResults.text= kony.i18n.getLocalizedString("i18n.frmCompanies.NoLimits");
          this.view.ContractLimitsList.flxNoFilterResults.setVisibility(true);
          this.view.ContractLimitsList.segAccountFeatures.setVisibility(false);
          this.view.flxContractLimitsSearch.setVisibility(false);
          this.view.ContractLimitsList.btnReset.setVisibility(false);
          this.view.btnUpdateInBulkLimits.setVisibility(false);
        }
      }else{
        this.searchLimitsContract(JSON.parse(JSON.stringify(dataToSet)));
      }
    }else if(component === "customersDropdownFA"){
      for(let j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
        if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
          dataToSet=JSON.parse(JSON.stringify(this.createContractRequestParam.contractCustomers[j].features));
          break;
        }
      }
      if(isSearch === false){
        this.view.tbxContractFASearch.text="";
        this.view.flxClearContractFASearch.setVisibility(false);
        this.view.lblSeperatorFA.setVisibility(false);
        this.view.flxNoCustomerSelectedFA.setVisibility(false);
        this.view.flxContractFAList.setVisibility(true);
        this.view.flxContractFASearch.setVisibility(true);
        this.view.ContractFAList.lblName.text=customerDetails.coreCustomerName;
        this.view.ContractFAList.lblName.onTouchStart = this.showCustomerDetailsPopup.bind(this,details,false);
        this.view.ContractFAList.flxPrimary.setVisibility(customerDetails.isPrimary === "true"?true:false);
        this.view.ContractFAList.lblData1.text=selectedCustId;
        this.view.ContractFAList.lblData2.text=customerDetails.taxId?customerDetails.taxId:"N/A";
        this.view.ContractFAList.lblData3.text=address; 
        this.setFeaturesDataCustomersContracts(JSON.parse(JSON.stringify(dataToSet)));
      }else{
        this.searchFAContracts(JSON.parse(JSON.stringify(dataToSet)));
      }
    }
  },
   /*
  * enroll form
  * set features action limits data for create payload
  */
  setServiceDefinitionFAData : function(featuresLimits){
    var limits=featuresLimits.limits;
    var features=featuresLimits.features;

    for(let p=0;p<limits.length;p++){
      for(let q=0;q<features.length;q++){
        if(features[q].featureId === limits[p].featureId){
          features[q]=this.getCombinedFeature(features[q],limits[p]);
        }
      }
    }
    for(let j=0;j<this.createContractRequestParam.contractCustomers.length;j++)
      this.createContractRequestParam.contractCustomers[j].features=JSON.parse(JSON.stringify(features));
    this.bulkUpdateAllFeaturesListContract=JSON.parse(JSON.stringify(features));//used for bulk update popup data
    this.setGlobalMonetaryActions(limits);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * combine features limits from service
  */
  getCombinedFeature : function(feature,limits){
    for(let a=0;a<limits.actions.length;a++){
      for(let b=0;b<feature.actions.length;b++){
        if(limits.actions[a].actionId === feature.actions[b].actionId){
          feature.actions[b]["limits"]=limits.actions[a].limits;
          feature.actions[b]["type"]="MONETARY";
          feature["type"]="MONETARY";
        }
      }
    }
    return feature;
  },
  /*
  * enroll form
  * set accounts of selected customer to the component
  */
  setAccountsDataCustomers : function(customerAccounts){
    var self=this;
    var secData = {
      "flxCheckbox":{"onClick": this.onCheckAccountsCheckboxContract.bind(this,true,customerAccounts)},
      "flxAccountNumCont":{"onClick":this.sortAndSetData.bind(this,"lblAccountNumber",this.view.ContractAccountsList.segAccountFeatures, 4)},
      "lblIconSortAccName":"\ue92a",
      "lblAccountNumber": kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNUMBER"),
      "imgSectionCheckbox":{"src": this.AdminConsoleCommonUtils.checkboxSelected},
      "flxAccountType":{"onClick": this.showFilterForAccountsContract.bind(this,1)},
      "lblAccountType":kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTTYPE"),
      "lblIconFilterAccType":"\ue916",
      "lblAccountName":kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNAME"),
      "lblIconAccNameSort":"\ue92b",
      "flxAccountName":{"onClick": this.sortAndSetData.bind(this,"lblAccountName", this.view.ContractAccountsList.segAccountFeatures, 4)},
      "flxAccountHolder":{"onClick": this.showFilterForAccountsContract.bind(this,2)},
      "lblAccountHolder":kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.OWNERSHIP_TYPE"),
      "lblIconSortAccHolder":"\ue916",
      "lblSeperator":"-",
      "template":"flxContractEnrollAccountsEditSection",
    };
    var selectedAccountsCount=0;
    var imgCheckbox=this.AdminConsoleCommonUtils.checkboxnormal;
    var rowData = customerAccounts.map(function(account){
        // in edit/create , to check whether has made any selection changes or not
        if(account.isEnabled){
          if(account.isEnabled === "true"||account.isNew==="true"){
            selectedAccountsCount++;
            imgCheckbox=  self.AdminConsoleCommonUtils.checkboxSelected;
          }else
            imgCheckbox=self.AdminConsoleCommonUtils.checkboxnormal;
        }
        else{
          imgCheckbox= self.AdminConsoleCommonUtils.checkboxSelected;
          selectedAccountsCount++;
        }
      return{
        "flxCheckbox":{"onClick":self.onCheckAccountsCheckboxContract.bind(self,false,customerAccounts)},
        "imgCheckbox":{"src":imgCheckbox},
        "lblAccountNumber":account.accountNumber || account.accountId,
        "lblAccountType":account.accountType,
        "lblAccountName":account.accountName,
        "lblAccountHolder":account.ownerType?account.ownerType:"N/A",
        "flxAccFlag":{"isVisible":account.isNew==="true"?true:false},
        "lblNewText":{"text":"New"},
        "fontIconFlag":{"text":""},
        "lblSeperator":"-",
        "template":"flxContractEnrollAccountsEditRow"
      }
    });
    secData.imgSectionCheckbox.src=this.getHeaderCheckboxImage(rowData,true,true);
    this.sortBy = this.getObjectSorter("lblAccountNumber");
    this.sortBy.inAscendingOrder = true;
    rowData = rowData.sort(this.sortBy.sortData);
    this.view.ContractAccountsList.segAccountFeatures.widgetDataMap = this.widgetMapForAccounts();
    this.view.ContractAccountsList.segAccountFeatures.rowTemplate="flxContractEnrollAccountsEditRow";
    this.view.ContractAccountsList.segAccountFeatures.setData([[secData,rowData]]);
    this.view.ContractAccountsList.segAccountFeatures.info={"selectedAccountsCount":selectedAccountsCount};
    this.view.ContractAccountsList.lblCount.text= this.getSelectedItemsCount(rowData, true);
    this.view.ContractAccountsList.lblTotalCount.text = "of "+ this.getTwoDigitNumber(rowData.length);
    this.view.forceLayout();
  },
   /*
  * check/uncheck checkbox in accounts tab header of contract create
  */
  onCheckAccountsCheckboxContract : function(isHeader,customerAccounts) {
    var selectedCustId=this.view.customersDropdown.lblSelectedValue.info.id
    var segData = this.view.ContractAccountsList.segAccountFeatures.data;
    var segSecData = segData[0][0];
    var rowsData = segData[0][1];
    var updatedAccIds=[];
    var isEnableDisable="true";
    //on section checkbox click
    if(isHeader){
      var img = (segSecData.imgSectionCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?  this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
      segSecData.imgSectionCheckbox.src = img;
      isEnableDisable=(img === this.AdminConsoleCommonUtils.checkboxnormal)?"false":"true";
      for(var i=0; i<rowsData.length; i++){
        rowsData[i].imgCheckbox.src =img;
        updatedAccIds.push(rowsData[i].lblAccountNumber);
      }
      if(img === this.AdminConsoleCommonUtils.checkboxnormal)
        this.view.ContractAccountsList.segAccountFeatures.info.selectedAccountsCount=0;
      else
        this.view.ContractAccountsList.segAccountFeatures.info.selectedAccountsCount=rowsData.length;
    } 
    //on row checkbox click
    else{
      var selInd = this.view.ContractAccountsList.segAccountFeatures.selectedRowIndex[1];
      rowsData[selInd].imgCheckbox.src = (rowsData[selInd].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal) ?  this.AdminConsoleCommonUtils.checkboxSelected : this.AdminConsoleCommonUtils.checkboxnormal;
      updatedAccIds.push(rowsData[selInd].lblAccountNumber);
      if(rowsData[selInd].imgCheckbox.src === this.AdminConsoleCommonUtils.checkboxnormal){
        this.view.ContractAccountsList.segAccountFeatures.info.selectedAccountsCount=this.view.ContractAccountsList.segAccountFeatures.info.selectedAccountsCount-1;
        isEnableDisable="false";
      }else{
        this.view.ContractAccountsList.segAccountFeatures.info.selectedAccountsCount=this.view.ContractAccountsList.segAccountFeatures.info.selectedAccountsCount+1;
        isEnableDisable="true";
      }
      segSecData.imgSectionCheckbox.src = this.getHeaderCheckboxImage(rowsData,true,true);
    }

    for(var j=0;j<this.createContractRequestParam.contractCustomers.length;j++){
      if(this.createContractRequestParam.contractCustomers[j].coreCustomerId === selectedCustId){
        for(let k=0;k<this.createContractRequestParam.contractCustomers[j].accounts.length;k++){
          var accId = this.createContractRequestParam.contractCustomers[j].accounts[k].accountNumber || this.createContractRequestParam.contractCustomers[j].accounts[k].accountId;
          if(updatedAccIds.includes(accId))
            this.createContractRequestParam.contractCustomers[j].accounts[k].isEnabled=isEnableDisable;
        }
        break;
      }
    }
    this.view.ContractAccountsList.segAccountFeatures.setData([[segSecData,rowsData]]);
    this.view.ContractAccountsList.lblCount.text= this.getSelectedItemsCount(rowsData, true);
    var isValid = this.validateCheckboxSelections(this.view.ContractAccountsList.segAccountFeatures,true);
    if(isValid){
      this.view.flxCustomerDropdown.setEnabled(true);
      this.enableAllTabs(true);
    }else{
      this.view.flxCustomerDropdown.setEnabled(false);
      this.enableAllTabs(false);
    }
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractAccounts.btnSave,true,isValid);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtonsContractAccounts.btnNext,false,isValid);
    this.view.forceLayout();
  },
  /*
  * show filter for account types in account tab contracts
  *@param: option-(account type:1, ownership:2), event object, context object
  */
  showFilterForAccountsContract : function(option,event,context){
    if(option === 1)
      this.view.flxOwnershipFilterContracts.setVisibility(false);
    else if(option === 2)
      this.view.flxAccountsFilterContracts.setVisibility(false);
    var filterWidget = (option === 1) ? this.view.flxAccountsFilterContracts :this.view.flxOwnershipFilterContracts;
    var filterIcon = (option === 1) ? "lblIconFilterAccType":"lblIconSortAccHolder" ;

    var flxRight = context.widgetInfo.frame.width - event.frame.x - event.frame.width;
    var iconRight = event.frame.width - event[filterIcon].frame.x;
    filterWidget.right = (flxRight + iconRight - 7) + "dp";
    filterWidget.top =(this.view.ContractAccountsList.flxCardBottomContainer.frame.y + 40+110) +"dp";
    if(filterWidget.isVisible){
      filterWidget.setVisibility(false);
    } else{
      filterWidget.setVisibility(true);
    }
  },
  /*
  * search in accounts tab contracts
  */
  searchAccountsContracts : function(accounts){
    var searchText=this.view.tbxAccountsSearch.text.toLowerCase();
    var accountName="";
    var searchResults=accounts.filter(function(account){
      var accNum = account.accountNumber || account.accountId;
      accountName=account.accountName.toLowerCase();
      if(accountName.indexOf(searchText)>=0 || accNum.indexOf(searchText)>=0)
        return account;
    });
    if(searchResults.length>0){
      this.setAccountsDataCustomers(searchResults);
      this.view.flxNoCustomerSelected.setVisibility(false);
      this.view.flxContractAccountsList.setVisibility(true);
    }
    else{
      this.view.lblNoCustomersSelected.text=kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.No_results_found");
      this.view.imgContractAccounts.setVisibility(false);
      this.view.flxNoCustomerSelected.setVisibility(true);
      this.view.flxContractAccountsList.setVisibility(false);
    }
  },
  /*
  * enroll form
  * filter for monetart limits from all features list
  */
  setGlobalMonetaryActions : function(limits){
    var monetaryActions=[];
    var monetaryLimits={};
    var actionsJSON={};
    var limitsJSON={};
    for(var p=0;p<limits.length;p++){
      actionsJSON={};
      for(let b=0;b<limits[p].actions.length;b++){
        limitsJSON={};
        actionsJSON[limits[p].actions[b].actionId]={};
        limitsJSON[limits[p].actions[b].limits[0].id]=limits[p].actions[b].limits[0].value;
        limitsJSON[limits[p].actions[b].limits[1].id]=limits[p].actions[b].limits[1].value;
        limitsJSON[limits[p].actions[b].limits[2].id]=limits[p].actions[b].limits[2].value;
        if(limits[p].actions[b].limits[3])
          limitsJSON[limits[p].actions[b].limits[3].id]=limits[p].actions[b].limits[3].value;
        else
          limitsJSON["MIN_TRANSACTION_LIMIT"]="1.0";
        actionsJSON[limits[p].actions[b].actionId]=limitsJSON;
      }
      monetaryLimits[limits[p].featureId]=actionsJSON;
    }
    this.monetaryLimits=monetaryLimits;
  },
  /*
  * enroll form
  * check for checkbox selection for all the cards of container
  * @param: cards container path, segment name, is section level
  */
  validateSelForMultipleCardsContracts : function(flexPath,segmentName,isSection){
    var isValid = true;
    isValid = this.validateCheckboxSelections(flexPath[segmentName],isSection);
    return isValid;
  },
   /*
  * set accounts types filter data contracts
  * @param: data
  */
  setContractsAccTypeFilterData : function(data){
    var self = this;
    var accTypes=[],maxLenText = "";
    for(var i=0;i<data.length;i++){
      if(!accTypes.contains(data[i].accountType))
        accTypes.push(data[i].accountType);
    }
    var widgetMap = {
      "accountType": "accountType",
      "flxSearchDropDown": "flxSearchDropDown",
      "flxCheckBox": "flxCheckBox",
      "imgCheckBox": "imgCheckBox",
      "lblDescription": "lblDescription"
    };
    var statusData = accTypes.map(function(rec){
      maxLenText = (rec.length > maxLenText.length) ? rec : maxLenText;     
      return {
        "accountType": rec,
        "flxSearchDropDown": "flxSearchDropDown",
        "flxCheckBox": "flxCheckBox",
        "imgCheckBox": "checkbox.png",
        "lblDescription": rec
      };
    });
    self.view.accountTypesFilterContracts.segStatusFilterDropdown.widgetDataMap = widgetMap;
    self.view.accountTypesFilterContracts.segStatusFilterDropdown.setData(statusData);
    var selStatusInd = [];
    for(var j=0;j<accTypes.length;j++){
      selStatusInd.push(j);
    }
    self.view.accountTypesFilterContracts.segStatusFilterDropdown.selectedIndices = [[0,selStatusInd]];
    //set filter width
    self.view.flxAccountsFilterContracts.width = self.AdminConsoleCommonUtils.getLabelWidth(maxLenText)+55+"px";
    self.view.forceLayout();
  },
  /*
  * set ownership types filter data contracts
  * @param: data
  */
  setContractOwnerShipFilterData: function(data){
    var self = this;
    var accTypes=[],maxLenText = "";
    var ownerType="N/A";
    for(var i=0;i<data.length;i++){
      ownerType=data[i].ownerType?data[i].ownerType:"N/A";
      if(!accTypes.contains(ownerType))
        accTypes.push(ownerType);
    }
    var widgetMap = {
      "ownerType": "ownerType",
      "flxSearchDropDown": "flxSearchDropDown",
      "flxCheckBox": "flxCheckBox",
      "imgCheckBox": "imgCheckBox",
      "lblDescription": "lblDescription"
    };
    var statusData = accTypes.map(function(rec){
      maxLenText = (rec.length > maxLenText.length) ? rec : maxLenText;     
      return {
        "ownerType": rec,
        "flxSearchDropDown": "flxSearchDropDown",
        "flxCheckBox": "flxCheckBox",
        "imgCheckBox": "checkbox.png",
        "lblDescription": rec
      };
    });
    self.view.ownershipFilterContracts.segStatusFilterDropdown.widgetDataMap = widgetMap;
    self.view.ownershipFilterContracts.segStatusFilterDropdown.setData(statusData);
    var selStatusInd = [];
    for(var j=0;j<accTypes.length;j++){
      selStatusInd.push(j);
    }
    self.view.ownershipFilterContracts.segStatusFilterDropdown.selectedIndices = [[0,selStatusInd]];
    //set filter width
    self.view.flxOwnershipFilterContracts.width = self.AdminConsoleCommonUtils.getLabelWidth(maxLenText)+55+"px";
    self.view.forceLayout();
  },
  /*
  * filter accounts in contracts
  * @param: data
  */
  performAccountOwnerContractFilters : function(){
    var self = this;
    var selFilter = [[]];
    var dataToShow = [];
    var accountsList = self.view.flxContractAccountsList.info.totalRecords;
    var ownershipIndices = self.view.ownershipFilterContracts.segStatusFilterDropdown.selectedIndices;
    var typeIndices = self.view.accountTypesFilterContracts.segStatusFilterDropdown.selectedIndices;
    selFilter[0][1] = [];
    selFilter[0][0] = [];
    var selOwnershipInd = null;
    var selTypeInd = null;
    //get selected account types
    selTypeInd = typeIndices ? typeIndices[0][1] : [];
    for (var i = 0; i < selTypeInd.length; i++) {
      selFilter[0][0].push(self.view.accountTypesFilterContracts.segStatusFilterDropdown.data[selTypeInd[i]].accountType);
    }
    //get selected ownerships
    selOwnershipInd = ownershipIndices ? ownershipIndices[0][1] : [];
    for (var j = 0; j < selOwnershipInd.length; j++) {
      selFilter[0][1].push(self.view.ownershipFilterContracts.segStatusFilterDropdown.data[selOwnershipInd[j]].ownerType);
    }

    if (selFilter[0][0].length === 0 || selFilter[0][1].length === 0) { //none selected - show no results
      dataToShow = [];
    } else if (selFilter[0][0].length > 0 && selFilter[0][1].length > 0) {//both filters selected
      dataToShow = accountsList.filter(function (rec) {  
        if (selFilter[0][1].indexOf(rec.ownerType?rec.ownerType:"N/A") >= 0&&selFilter[0][0].indexOf(rec.accountType) >= 0) {
          return rec;
        }
      });
    } else { //single filter selected
    }
    return dataToShow;
  },
  /*
  * enroll form
  * assign features to variable and filter
  */
  getAllFeatures : function(res){
      this.allFeatures = res;
      //this.featureFilter();
  },
  /*
  * enroll form
  * filter all the features
  */
  featureFilter : function(){
    var companyType = this.AdminConsoleCommonUtils.constantConfig.BUSINESS_TYPE;
    var i;
    var temp_features=[];
    this.requiredFeatures.additional = [];
    this.requiredFeatures.mandatory = [];
    for(i=0;i<this.allFeatures.groups.length;i++){
    	if(this.allFeatures.groups[i].groupid === companyType){
          temp_features = this.allFeatures.groups[i].features;
        }
    }
    for(var j=0;j<temp_features.length;j++){
      if(temp_features[j].isPrimary === "false"){
        this.requiredFeatures.additional.push(temp_features[j]);
      }
      else if(temp_features[j].isPrimary === "true"){
        this.requiredFeatures.mandatory.push(temp_features[j]);
      }
    }
  },
  /*
  * show bulk update features/limits popup in contracts
  * @param: option for feature/limits - 1/2
  */
  showBulkUpdatePopupContracts: function(option){
    if(option === 1){
      this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UpdatePermissionsInBulk");
      this.view.bulkUpdateFeaturesLimitsPopup.lblTitle.text=kony.i18n.getLocalizedString("i18n.contract.addPermission");
      this.view.bulkUpdateFeaturesLimitsPopup.bulkUpdateAddNewFeatureRow.lblFieldName13.text="Permission Type";
      this.view.bulkUpdateFeaturesLimitsPopup.bulkUpdateAddNewFeatureRow.flxRow2.isVisible=false;
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.plusAddNewPermissions");
      this.view.bulkUpdateFeaturesLimitsPopup.lblRadioGroupTitle.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.PermissionType")
      this.setRadioGroupData(1);
    }else{
      this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.UpdateLimitsInBulk");
      this.view.bulkUpdateFeaturesLimitsPopup.lblTitle.text=kony.i18n.getLocalizedString("i18n.contracts.addLimits");
      this.view.bulkUpdateFeaturesLimitsPopup.bulkUpdateAddNewFeatureRow.lblFieldName13.text=kony.i18n.getLocalizedString("i18n.konybb.Common.TransactionType");
      this.view.bulkUpdateFeaturesLimitsPopup.bulkUpdateAddNewFeatureRow.flxRow2.isVisible=true;
      this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.plusAddNewLimits");
      this.view.bulkUpdateFeaturesLimitsPopup.lblRadioGroupTitle.text=kony.i18n.getLocalizedString("i18n.konybb.Common.TransactionType");
      this.setRadioGroupData(2);
    }
    this.view.bulkUpdateFeaturesLimitsPopup.flxSegmentContainer.top = "50dp";
    this.view.bulkUpdateFeaturesLimitsPopup.flxSearchContainer.setVisibility(false);
    this.view.bulkUpdateFeaturesLimitsPopup.lblDetailsHeading.info ={"option" : option};
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info={"added":[]};
    this.view.flxBulkUpdateFeaturesPopup.setVisibility(true);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnSave,true,false);
    this.showContractBulkUpdatePopupScreen1(false);
  },
  /*
  * show bulk update features/limits accounts selection screen for contracts
  */
  showContractBulkUpdatePopupScreen1 : function(isModify){
    if(!isModify)
      this.setBulkUpdateCustomersList();
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen1.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen2.setVisibility(false);
    this.view.forceLayout();
  },
  /*
  * show bulk update features/limits screen in popup for contracts
  */
  showContractBulkUpdatePopupScreen2 : function(){
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.lblIconArrow.text="";
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen1.setVisibility(false);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateScreen2.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.setVisibility(true);
    this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.setVisibility(true);
    var flxChildren = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.removeAll();
    for(var i=0;i<flxChildren.length;i++){
      this.view.bulkUpdateFeaturesLimitsPopup.remove(this.view.bulkUpdateFeaturesLimitsPopup[flxChildren[i].id]);
    }
    this.addBulkUpdateTags();
    this.view.forceLayout();
    var height = this.view.bulkUpdateFeaturesLimitsPopup.flxContractDetailsPopupContainer.frame.height - (70 + this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateListContainer.frame.y + 80);
    this.view.bulkUpdateFeaturesLimitsPopup.flxBulkUpdateListContainer.height = height + "dp";
    this.bulkUpdateListboxData = this.getListForListBoxContracts(this.bulkUpdateAllFeaturesListContract);
    if(this.view.bulkUpdateFeaturesLimitsPopup.btnAddNewRow.info === "Limits"){
      this.addNewLimitRowBulkUpdate("contract");
    }else{
      this.addNewFeatureRowBulkUpdate("contract");
    }
    this.getFeaturesForBulkUpdate(null,"contract");
  },
  /*
  * enroll form
  * to set customers list data to segment
  */
  setBulkUpdateCustomersList : function(customers){
    var customers=this.selectedCustomers;
    var self=this;
    var rowsData=[];
    var dataMap={
      "flxsegCustomersList":"flxsegCustomersList",
      "flxCheckBox":"flxCheckBox",
      "imgCheckBox":"imgCheckBox",
      "lblCustomerId":"lblCustomerId",
      "lblCustomerName":"lblCustomerName",
      "lblSeparator":"lblSeparator",
      "custInfo":"custInfo"
    };
    var secData={
      "template":"flxsegCustomersList",
      "flxCheckBox":{"onClick":function(){self.toggleBulkCheckbox();}},
      "imgCheckBox":{"src":this.AdminConsoleCommonUtils.checkboxnormal},
      "lblCustomerId":{"text":kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.CUSTOMER_ID")},
      "lblCustomerName":{"text":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.CustomerName_UC")},
      "lblSeparator":{"skin":"sknLblSeparator696C73","isVisible":true}
    }
    for (var x = 0; x < customers.length; x++) {
      if (customers[x].isSelected === true) {
        rowsData.push({
          "template": "flxsegCustomersList",
          "flxCheckBox": { "onClick": function () { self.toggleCustomerCheckbox(); } },
          "imgCheckBox": { "src": this.AdminConsoleCommonUtils.checkboxnormal },
          "lblCustomerId": { "text": customers[x].coreCustomerId },
          "lblCustomerName": { "text": customers[x].coreCustomerName },
          "lblSeparator": { "skin": "sknLblSeparatore7e7e7", "isVisible": true },
          "custInfo": customers[x]
        });
      }
    }
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.widgetDataMap=dataMap;
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData([[secData,rowsData]]);
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info={"selectedCust":[]};
    this.view.forceLayout();
  },
  /*
  * enroll form
  * toggle section header checkbox action in bulk update screen
  */
  toggleBulkCheckbox : function(){
    var imgSrc=this.AdminConsoleCommonUtils.checkboxnormal;
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust=[];
    var segData=this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    if(segData[0][0].imgCheckBox.src === this.AdminConsoleCommonUtils.checkboxnormal){
      segData[0][0].imgCheckBox.src= this.AdminConsoleCommonUtils.checkboxSelected;
      imgSrc= this.AdminConsoleCommonUtils.checkboxSelected;
    }else
      segData[0][0].imgCheckBox.src=this.AdminConsoleCommonUtils.checkboxnormal;
    for(var i=0;i<segData[0][1].length;i++){
      segData[0][1][i].imgCheckBox.src=imgSrc;
      if(imgSrc === this.AdminConsoleCommonUtils.checkboxnormal)
      	this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust.push(segData[0][1][i].custInfo);
    }
    var isValid = segData[0][0].imgCheckBox.src === this.AdminConsoleCommonUtils.checkboxnormal?false:true;
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnSave,true,isValid);
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData(segData);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * toggle row checkbox action in bulk update screen
  */
  toggleCustomerCheckbox : function(){
    var selCount=0;
    var segData=this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    var selIndex=this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.selectedRowIndex[1];
    for(var i=0;i<segData[0][1].length;i++){
      if(segData[0][1][i].imgCheckBox.src=== this.AdminConsoleCommonUtils.checkboxSelected)
        selCount=selCount+1;
    }
    if(segData[0][1][selIndex].imgCheckBox.src === this.AdminConsoleCommonUtils.checkboxnormal){
      segData[0][0].imgCheckBox.src=(selCount+1 === segData[0][1].length)? this.AdminConsoleCommonUtils.checkboxSelected:this.AdminConsoleCommonUtils.checkboxnormal;
      segData[0][1][selIndex].imgCheckBox.src= this.AdminConsoleCommonUtils.checkboxSelected;
      this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust.push(segData[0][1][selIndex].custInfo);
    }else{
      segData[0][0].imgCheckBox.src=this.AdminConsoleCommonUtils.checkboxnormal;
      segData[0][1][selIndex].imgCheckBox.src=this.AdminConsoleCommonUtils.checkboxnormal;
      for(let x=0;x<this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust.length;x++){
        if(segData[0][1][selIndex].custInfo.coreCustomerId === this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust[x].coreCustomerId)
          this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.info.selectedCust.splice(x,1);
      }
    }
    this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.setData(segData);
    var isValid = segData[0][0].imgCheckBox.src === this.AdminConsoleCommonUtils.checkboxnormal?false:true;
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.bulkUpdateFeaturesLimitsPopup.commonButtonsScreen1.btnSave,true,isValid);
    this.view.forceLayout();
  },
  /*
  * enroll form
  * cadd tags in bulk update screen for contracts
  */
  addBulkUpdateTags : function(){
    var selectedCustData=this.view.bulkUpdateFeaturesLimitsPopup.segSelectionList.data;
    this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.removeAll();
    var customers=[];
    for (var i=0;i<selectedCustData[0][1].length;i++){
      if(selectedCustData[0][1][i].imgCheckBox.src === this.AdminConsoleCommonUtils.checkboxSelected)
        this.addCustomerTag(this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer,selectedCustData[0][1][i].lblCustomerName.text,selectedCustData[0][1][i].lblCustomerId.text);
    }
    this.view.forceLayout();
  },
  /* 
  * function to return the required features in listbox masterdata format in contracts
  * @param: unselected features id's list
  * @retrun: masterdata with given features id's
  */
  getListForListBoxContracts: function(data) {
    var self = this;
    var finalList = [["select","Select a Feature"]];
    if(this.view.flxContractFA.isVisible){
    for (var i = 0; i < self.bulkUpdateAllFeaturesListContract.length; i++) {
      if (data.contains(self.bulkUpdateAllFeaturesListContract[i].featureId)) {
        finalList.push([self.bulkUpdateAllFeaturesListContract[i].featureId,self.bulkUpdateAllFeaturesListContract[i].featureName]);
      }
    }
    }else{
      var limitFeatures=[];
      var limitActions=[];
      var dataToSet=[];
      for(var a=0;a<self.bulkUpdateAllFeaturesListContract.length;a++){
        if(self.bulkUpdateAllFeaturesListContract[a].type === "MONETARY"&&self.bulkUpdateAllFeaturesListContract[a].actions.length>0){
          limitFeatures=JSON.parse(JSON.stringify(self.bulkUpdateAllFeaturesListContract[a]));
          limitActions = self.bulkUpdateAllFeaturesListContract[a].actions.filter(function(item) {
            return item.type=="MONETARY";
          });
          if(limitActions.length>0){
            limitFeatures.actions=limitActions;
            dataToSet.push(limitFeatures);
          }
        }
      }
      for (var i = 0; i < dataToSet.length; i++) {
      if (data.contains(dataToSet[i].featureId)) {
        finalList.push([dataToSet[i].featureId,dataToSet[i].featureName]);
      }
    }
    }
    return finalList;
  },
  /*
  * update the selected changes in bulk update popup
  */
  updateFeatureLimitsBulkContract : function(){
    var rowsList = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    var featureId="";
    var actionIds=[];
    var isEnable=false;
    var bulkUpdateList=[];
    var typeValue=this.getSelectedType();
    var selectedCust=this.view.bulkUpdateFeaturesLimitsPopup.flxTagsContainer.info.added;
    var limitVal=this.view.tbxValue21
    var selectedCustIds=[];
    var isFeatures=this.view.flxContractFA.isVisible;
    var dependentActions=[];
    for(let a=0;a<selectedCust.length;a++)
      selectedCustIds.push(selectedCust[a][1]);
    //get all assigned feature id's
    for (var i = 0; i < rowsList.length; i++) {
      if (rowsList[i].lstBoxFieldValue11.selectedKey !== "select")
        featureId=rowsList[i].lstBoxFieldValue11.selectedKey;
      actionIds=[];
      if(rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems){
        var selItems=rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems;
        for(let i=0;i<selItems.length;i++){
          if(!actionIds.includes(selItems[i].actionId)){
            actionIds.push(selItems[i].actionId);
            if(isFeatures){
              //To check dependent actions in bulk update permissions
              for(let j=0;j<selItems[i].dependentActions.length;j++){
                if(!actionIds.includes(selItems[i].dependentActions[j].trim()))
                  actionIds.push(selItems[i].dependentActions[j].trim());
              }
            }
          }
        }
      }
      if(actionIds.length>0){
        if(isFeatures){
          bulkUpdateList.push({"featureId":featureId,"actionIds":actionIds,"isEnable":typeValue === "enable"?"true":"false"});
        }else{
          bulkUpdateList.push({"featureId":featureId,"actionIds":actionIds,"limitId":typeValue,"limitVal":rowsList[i].tbxValue21.text});
        }
      }
    }
    for(var a=0;a<this.createContractRequestParam.contractCustomers.length;a++){
      if(selectedCustIds.includes(this.createContractRequestParam.contractCustomers[a].coreCustomerId)){
        for(var b=0;b<this.createContractRequestParam.contractCustomers[a].features.length;b++){
          for(let x=0;x<bulkUpdateList.length;x++){
            if(this.createContractRequestParam.contractCustomers[a].features[b].featureId === bulkUpdateList[x].featureId){
              for(var c=0;c<this.createContractRequestParam.contractCustomers[a].features[b].actions.length;c++){
                if(bulkUpdateList[x].actionIds.includes(this.createContractRequestParam.contractCustomers[a].features[b].actions[c].actionId)){
                  this.updateBulkRequestParam(a,b,c,isFeatures,bulkUpdateList[x]);
                }
              }
            }
          }
        }
      }
    }
    this.view.flxBulkUpdateFeaturesPopup.setVisibility(false);
    if(isFeatures){
      this.view.customersDropdownLimits.lblSelectedValue.info={"id":selectedCustIds[0]};
      this.setSelectedText("customersDropdownFA",selectedCustIds[0]);
      this.setCustSelectedData("customersDropdownFA",false);
      this.view.toastMessage.showToastMessage(kony.i18n.getLocalizedString("i18n.contracts.FeatureBulkUpdateMsg"), this);
    }
    else{
      this.view.customersDropdownContractLimits.lblSelectedValue.info={"id":selectedCustIds[0]};
      this.setSelectedText("customersDropdownContractLimits",selectedCustIds[0]);
      this.setCustSelectedData("customersDropdownContractLimits",false);
      this.view.toastMessage.showToastMessage(kony.i18n.getLocalizedString("i18n.contracts.LimitsBulkUpdateMsg"), this);
    }
  },
  /*
  * update the selected changes in bulk update popup
  */
  updateBulkRequestParam : function(custInd,featureInd,actionInd,isFA,data){
    if(isFA){
      this.createContractRequestParam.contractCustomers[custInd].features[featureInd].actions[actionInd].isEnabled=data.isEnable;
    }else{
      for(let x=0;x<3;x++){
        if(this.createContractRequestParam.contractCustomers[custInd].features[featureInd].actions[actionInd].limits[x].id === data.limitId)
          this.createContractRequestParam.contractCustomers[custInd].features[featureInd].actions[actionInd].limits[x].value=data.limitVal;
      }
    }
  },
  /*
  * enroll form
  * get state/country list for ontract details
  */
  getCountrySegmentData : function(){
    var self = this;
    var callBack = function(response){
      kony.print("listboxreponse",response);
      if(response !== "error") {
        self.segCountry = response.countries.reduce(
          function(list, country) {
            return list.concat([{"id":country.id,
                                 "lblAddress":{"text":country.Name,
                                               "left" : "10dp"},
                                 "template":"flxSearchCompanyMap"}]);
          },[]);
      }
      var widgetMap = {"flxSearchCompanyMap":"flxSearchCompanyMap",
                       "lblAddress":"lblAddress",
                       "id":"id",
                       "Region_id":"Region_id",
                       "Country_id":"Country_id"};
      self.view.typeHeadContractCountry.segSearchResult.widgetDataMap = widgetMap;
      self.view.typeHeadContractCountry.segSearchResult.setData(self.segCountry);
      self.view.forceLayout();
    };
    this.presenter.fetchLocationPrefillData(callBack);
  },
  /*
  * validation for bulk update screen in contracts
  */
  validateBulkSelectionContracts : function(){
    var rowsList = this.view.bulkUpdateFeaturesLimitsPopup.flxAddNewRowListCont.widgets();
    var isValid=true;
    var selCount=0;
    for (var i = 0; i < rowsList.length; i++) {
      if (rowsList[i].lstBoxFieldValue11.selectedKey !== "select"){
        selCount=selCount+1;
        if(rowsList[i].productTypeFilterMenu.segStatusFilterDropdown.selectedRowItems === null){
          isValid=false;
          rowsList[i].flxFieldValueContainer12.skin="sknFlxCalendarError";
          rowsList[i].lblErrorMsg12.text= kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAtleastOneAction");
          rowsList[i].flxErrorField12.setVisibility(true);
        }
        if(this.view.flxContractLimits.isVisible === true&&rowsList[i].tbxValue21.text.trim().length === 0){
          isValid=false;
          rowsList[i].lblErrorMsg21.text= kony.i18n.getLocalizedString("i18n.frmAlertsManagement.Value_cannot_be_empty");
          rowsList[i].flxErrorField21.setVisibility(true);
          rowsList[i].flxValue21.skin="sknFlxCalendarError";
        }
      }
    }
    if(selCount === 0){
      isValid=false;
      rowsList[0].lstBoxFieldValue11.skin="sknlbxError";
      rowsList[0].lblErrorMsg11.text=kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.SelectAtleastOneFeature");
      rowsList[0].flxErrorField11.setVisibility(true);
    }
    this.view.forceLayout();
    return isValid;
  },
  /*
  * enroll form
  * validation for contract details screen in create/edit contract
  */
  validateContractDetails : function(){
    // contract name
    var validation = true
    if(this.view.contractDetailsEntry1.tbxEnterValue.text.trim() === ""){
      this.view.contractDetailsEntry1.lblErrorText.text = kony.i18n.getLocalizedString("i18n.frmLocationsController.Enter_Company_Name");
      this.view.contractDetailsEntry1.flxInlineError.isVisible = true;
      this.view.contractDetailsEntry1.flxEnterValue.skin = "sknFlxCalendarError";
      validation = false;
    }
    // contact number
    var phoneRegex=/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var phn = this.view.contractContactNumber.txtContactNumber.text.trim();
    if (phn && this.view.contractContactNumber.txtContactNumber.text.trim().length > 15) {
      this.view.contractContactNumber.flxError.width = "61%";
      this.view.contractContactNumber.flxError.isVisible = true;
      this.view.contractContactNumber.lblErrorText.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ContactNo_cannot_exceed");
      this.view.contractContactNumber.txtContactNumber.skin = "skinredbg";
      validation = false;
    } else if (phn && phoneRegex.test(this.view.contractContactNumber.txtContactNumber.text) === false) {
      this.view.contractContactNumber.flxError.width = "61%";
      this.view.contractContactNumber.flxError.isVisible = true;
      this.view.contractContactNumber.lblErrorText.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ContactNo_not_valid");
      this.view.contractContactNumber.txtContactNumber.skin = "skinredbg";
      validation = false;
    } else if(phn === "" && this.view.contractContactNumber.txtISDCode.text.trim()){
      this.view.contractContactNumber.flxError.width = "61%";
      this.view.contractContactNumber.flxError.isVisible = true;
      this.view.contractContactNumber.lblErrorText.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ContactNo_not_valid");
      this.view.contractContactNumber.txtContactNumber.skin = "skinredbg";
      validation = false;
    } else if(phn && (!this.view.contractContactNumber.txtISDCode.text.trim() ||(this.view.contractContactNumber.txtISDCode.text === "+"))){
      this.view.contractContactNumber.flxError.width = "98%";
      this.view.contractContactNumber.flxError.isVisible = true;
      this.view.contractContactNumber.txtISDCode.skin = "skinredbg";
      this.view.contractContactNumber.lblErrorText.text = kony.i18n.getLocalizedString("i18n.common.Enter_valid_ISD_code");
      validation = false;
    }

    //ISD code
    var ISDRegex = /^\+(\d{1,3}|\d{1,3})$/;
    if(this.view.contractContactNumber.txtISDCode.text.trim() && (this.view.contractContactNumber.txtISDCode.text.trim().length > 4 || ISDRegex.test(this.view.contractContactNumber.txtISDCode.text) === false)){
      this.view.contractContactNumber.flxError.width = "98%";
      this.view.contractContactNumber.flxError.isVisible = true;
      this.view.contractContactNumber.lblErrorText.text = kony.i18n.getLocalizedString("i18n.common.Enter_valid_ISD_code");
      this.view.contractContactNumber.txtISDCode.skin = "skinredbg";
      validation = false;
    }

    // email id
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.view.contractDetailsEntry3.tbxEnterValue.text.trim() && emailRegex.test(this.view.contractDetailsEntry3.tbxEnterValue.text.trim()) === false) {
      this.view.contractDetailsEntry3.lblErrorText.text = kony.i18n.getLocalizedString("i18n.frmCompanies.EmailID_not_valid");
      this.view.contractDetailsEntry3.flxInlineError.isVisible = true;
      this.view.contractDetailsEntry3.flxEnterValue.skin = "sknFlxCalendarError";
      validation = false;
    }

    //ZipCode
    if (this.view.contractDetailsEntry6.tbxEnterValue.text.trim() && /^([a-zA-Z0-9_]+)$/.test(this.view.contractDetailsEntry6.tbxEnterValue.text) === false  ) {
      this.view.contractDetailsEntry6.lblErrorText.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ErrorZipCode");
      this.view.contractDetailsEntry6.flxInlineError.setVisibility(true);
      this.view.contractDetailsEntry6.flxEnterValue.skin = "sknFlxCalendarError";
      validation = false;
    }

    //Country
    if (this.view.typeHeadContractCountry.tbxSearchKey.text&&this.view.typeHeadContractCountry.tbxSearchKey.text.trim() === "" && (this.view.typeHeadContractCountry.segSearchResult.isVisible || this.view.typeHeadContractCountry.flxNoResultFound.isVisible)) {
      this.view.lblNoContractCountryError.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ErrorSelectCountry"); 
      this.view.flxNoContractCountry.isVisible = true;
      this.view.typeHeadContractCountry.tbxSearchKey.skin = "skinredbg";
      validation = false;
    } else if(this.view.typeHeadContractCountry.tbxSearchKey.text && this.view.typeHeadContractCountry.tbxSearchKey.info.isValid === false){
      this.view.lblNoContractCountryError.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ErrorCountry");
      this.view.flxNoContractCountry.isVisible = true;
      this.view.typeHeadContractCountry.tbxSearchKey.skin = "skinredbg";
      validation = false;
    }
    if(validation === true){
      this.view.contractDetailsEntry3.flxEnterValue.skin = "sknflxEnterValueNormal";
      this.view.contractDetailsEntry3.flxInlineError.isVisible = false;
      this.view.contractContactNumber.flxError.isVisible = false;
      this.view.contractContactNumber.txtISDCode.skin = "skntxtbxDetails0bbf1235271384a";
      this.view.contractContactNumber.txtContactNumber.skin = "skntxtbxDetails0bbf1235271384a";
      this.view.contractDetailsEntry6.flxInlineError.setVisibility(false);
      this.view.contractDetailsEntry6.flxEnterValue.skin = "sknflxEnterValueNormal";
      this.view.flxNoContractCountry.isVisible = false;
      this.view.typeHeadContractCountry.tbxSearchKey.skin = "skntbxLato35475f14px";
      this.view.contractDetailsEntry1.flxInlineError.isVisible = false;
      this.view.contractDetailsEntry1.flxEnterValue.skin = "sknflxEnterValueNormal";
    }
    return validation;
  },
  /*
  * function to clear inline error validations
  * widget path, error flex path, widget type
  */
  clearValidation : function(widget,errorFlex,type){
    if (type === 1)
      widget.skin = "skntxtbxDetails0bbf1235271384a";
    else if (type === 2)
      widget.skin = "sknLbxborderd7d9e03pxradius";
    else if (type === 3)
      widget.skin = "sknflxEnterValueNormal";
    errorFlex.setVisibility(false);
  },
  /*
  * enroll form
  * hide the address segment
  * @param: typehead widget path
  */
  hideAddressSegments : function(typeHeadPath){
    if(typeHeadPath){
      typeHeadPath.segSearchResult.setVisibility(true);
    }
    this.view.forceLayout();
  },
  /*
   * search on address fields while typing in textbox
   * @param: textbox path, sement path
   * @param: category ( 1-country, 2- state, 3-city)
   */
  searchForAddress : function(tbxPath,segPath,noResultFlex,category){
    var self = this;
    var searchText = tbxPath.text;
    var sourceData = [],dataToAssign = [];
    if(category === 1){
      sourceData =self.segCountry;
      dataToAssign = sourceData.filter(function(rec){
        var name = (rec.lblAddress.text).toLowerCase();
        return (name.indexOf(searchText.toLowerCase()) > -1);
      });
    }else if(category === 2){
      sourceData =self.segState;
      var country = self.view.typeHeadCountry.tbxSearchKey.info.data;
      dataToAssign = sourceData.filter(function(rec){
        var name = (rec.lblAddress.text).toLowerCase();
        return ((name.indexOf(searchText.toLowerCase()) > -1) && (rec.Country_id === country.id) );
      });

    }else if(category === 3){
      sourceData =self.segLocationCity;
      var state = self.view.typeHeadState.tbxSearchKey.info.data;
      dataToAssign = sourceData.filter(function(rec){
        var name = (rec.lblAddress.text).toLowerCase();
        return ((name.indexOf(searchText.toLowerCase()) > -1)&& (rec.Region_id === state.id));
      });
    }
    if(searchText === "") dataToAssign = [];
    segPath.setData(dataToAssign);
    if(dataToAssign.length > 0){
      segPath.setVisibility(true);
      noResultFlex.setVisibility(false);
      if(noResultFlex === this.view.typeHeadContractCountry.flxNoResultFound){
        this.view.flxContractCountry.zIndex = 2;
      }else{
       this.view.flxContractCountry.zIndex = 1;
      }
    }else{
      segPath.setVisibility(false);
      noResultFlex.setVisibility(true);
      if(noResultFlex === this.view.typeHeadContractCountry.flxNoResultFound){
        this.view.flxContractCountry.zIndex = 2;
      }else{
        this.view.flxContractCountry.zIndex = 1;
      }
    }
    self.view.forceLayout();
  },
  /*
  * enroll form
  * assign text from seg to textbox
  *  @param: segment path, textbox path
  */
  assignText : function(segment,textBox){
    var selectedRow = segment.data[segment.selectedRowIndex[1]];
    textBox.text =  selectedRow.lblAddress.text;
    textBox.info.isValid = true;
    textBox.info.data = selectedRow;
    segment.setVisibility(false);
    this.view.flxContractCountry.zIndex = 1;
    this.view.forceLayout();
  },
  /*
  * enroll form
  * create contract payload formation and call service
  */
  createContract : function(){
    var requestParam=JSON.parse(JSON.stringify(this.createContractRequestParam));
	var featureActions=[],disableAcc = [];
    if(this.action === this.actionConfig.edit)
      requestParam.contractId="";
    requestParam.contractName=this.view.contractDetailsEntry1.tbxEnterValue.text;
    requestParam.serviceDefinitionName=this.view[this.selectedServiceCard].lblCategoryName.toolTip;
    requestParam.serviceDefinitionId=this.view[this.selectedServiceCard].lblCategoryName.info.catId;
    requestParam.faxId= this.view.contractDetailsEntry2.tbxEnterValue.text || "";
    requestParam.communication=[{"phoneNumber":this.view.contractContactNumber.txtContactNumber.text,"phoneCountryCode":this.view.contractContactNumber.txtISDCode.text,"email":this.view.contractDetailsEntry3.tbxEnterValue.text}];
    requestParam.address=[{"country":this.view.typeHeadContractCountry.tbxSearchKey.text || "",
                           "cityName":this.view.contractDetailsEntry8.tbxEnterValue.text || "",
                           "state":this.view.contractDetailsEntry8.tbxEnterValue.text || "",
                           "zipCode":this.view.contractDetailsEntry6.tbxEnterValue.text || "",
                           "addressLine1":this.view.contractDetailsEntry4.tbxEnterValue.text || "",
                           "addressLine2":this.view.contractDetailsEntry5.tbxEnterValue.text || ""}]

    for(var a=0;a<this.createContractRequestParam.contractCustomers.length;a++){
      requestParam.contractCustomers[a].isBusiness=this.createContractRequestParam.contractCustomers[a].isBusiness;
      requestParam.contractCustomers[a].accounts=[];
      requestParam.contractCustomers[a].excludedAccounts=[];
      for(var b=0;b<this.createContractRequestParam.contractCustomers[a].accounts.length;b++){
        var currAccountObj = {
          "accountId":this.createContractRequestParam.contractCustomers[a].accounts[b].accountNumber||this.createContractRequestParam.contractCustomers[a].accounts[b].accountId,
          "accountType":this.createContractRequestParam.contractCustomers[a].accounts[b].accountType,
          "accountName":this.createContractRequestParam.contractCustomers[a].accounts[b].accountName,
          "typeId":this.createContractRequestParam.contractCustomers[a].accounts[b].typeId,
          "ownerType":this.createContractRequestParam.contractCustomers[a].accounts[b].ownerType,
          "arrangementId":this.createContractRequestParam.contractCustomers[a].accounts[b].arrangementId,
          "accountHolderName":this.createContractRequestParam.contractCustomers[a].accounts[b].accountHolderName,
          "accountStatus":this.createContractRequestParam.contractCustomers[a].accounts[b].accountStatus,
        };
        if(this.createContractRequestParam.contractCustomers[a].accounts[b].isEnabled){
          //to check if the user has selected this account or not
          if(this.createContractRequestParam.contractCustomers[a].accounts[b].isEnabled === "true"){
            requestParam.contractCustomers[a].accounts.push(currAccountObj);
          } else{
//             currAccountObj["isEnabled"] = "false";
//             disableAcc.push(currAccountObj);
            requestParam.contractCustomers[a].excludedAccounts.push(currAccountObj);
          }
        }else{//if the user has neither selected nor unselected this account
          requestParam.contractCustomers[a].accounts.push(currAccountObj);
        }
      }
      requestParam.contractCustomers[a].features=[];
      for(var b=0;b<this.createContractRequestParam.contractCustomers[a].features.length;b++){
        featureActions=[];
        for(var c=0;c<this.createContractRequestParam.contractCustomers[a].features[b].actions.length;c++){
          if(this.createContractRequestParam.contractCustomers[a].features[b].actions[c].isEnabled === undefined||this.createContractRequestParam.contractCustomers[a].features[b].actions[c].isEnabled === null){
            //if the user has neither selected nor unselected this actions
            this.createContractRequestParam.contractCustomers[a].features[b].actions[c].isEnabled="true";
          }
          featureActions[c]={
            "actionId":this.createContractRequestParam.contractCustomers[a].features[b].actions[c].id||this.createContractRequestParam.contractCustomers[a].features[b].actions[c].actionId,
            "actionName":this.createContractRequestParam.contractCustomers[a].features[b].actions[c].name||this.createContractRequestParam.contractCustomers[a].features[b].actions[c].actionName,
            "actionDescription":this.createContractRequestParam.contractCustomers[a].features[b].actions[c].description||this.createContractRequestParam.contractCustomers[a].features[b].actions[c].actionDescription,
            "isAllowed":this.createContractRequestParam.contractCustomers[a].features[b].actions[c].isEnabled,
          };
		  //store the type,status also in case of edit
          if(this.action === this.actionConfig.edit){
            featureActions[c]["type"] = this.createContractRequestParam.contractCustomers[a].features[b].actions[c].type;
            featureActions[c]["actionStatus"] = this.createContractRequestParam.contractCustomers[a].features[b].actions[c].actionStatus;
          }
          if(this.createContractRequestParam.contractCustomers[a].features[b].actions[c].limits)
            featureActions[c].limits=this.createContractRequestParam.contractCustomers[a].features[b].actions[c].limits;          
        }
        requestParam.contractCustomers[a].features[b]={
          "featureName":this.createContractRequestParam.contractCustomers[a].features[b].name||this.createContractRequestParam.contractCustomers[a].features[b].featureName,
          "featureId":this.createContractRequestParam.contractCustomers[a].features[b].id||this.createContractRequestParam.contractCustomers[a].features[b].featureId,
          "featureDescription":this.createContractRequestParam.contractCustomers[a].features[b].description||this.createContractRequestParam.contractCustomers[a].features[b].featureDescription,
          "actions":featureActions
        };
        //store the type,status also in case of edit
        if(this.action === this.actionConfig.edit){
          requestParam.contractCustomers[a].features[b]["type"] = this.createContractRequestParam.contractCustomers[a].features[b].type;
          requestParam.contractCustomers[a].features[b]["featureStatus"] = this.createContractRequestParam.contractCustomers[a].features[b].featureStatus;
        }		
      }
      //to concat disabled accounts in case of edit contract
//       if(this.action === this.actionConfig.edit){
//         var enabledAcc = requestParam.contractCustomers[a].accounts;
//         requestParam.contractCustomers[a].accounts = enabledAcc.concat(disableAcc);
//       }
    }
    if(this.action === this.actionConfig.create){
      this.presenter.createContract(requestParam);
    } else{
      var payload={};
      payload.contractName= requestParam.contractName;
      payload.serviceDefinitionName= requestParam.serviceDefinitionName;
      payload.serviceDefinitionId= requestParam.serviceDefinitionId;
      payload.faxId= requestParam.faxId;
      payload.communication=JSON.stringify(requestParam.communication);
      payload.address=JSON.stringify(requestParam.address);
      payload.contractCustomers=JSON.stringify(requestParam.contractCustomers);
      this.presenter.setCreateContractPayload(payload);
      this.addCustomersFromCreatedContract({"contractDetails":payload});
      this.removeContractDelCustFromEnrollSeg(payload);
    }
  },
  /*
  * show popup for creating a contract with customer in it
  */
  showCreateContractPopup : function(){
    var self =this;
    var contractCust = this.createContractRequestParam.contractCustomers;
    var custNames = "";
    var contractName = this.view.contractDetailsEntry1.tbxEnterValue.text || "";
    for(var i=0 ;i< contractCust.length;i++){
      custNames = "-"+ custNames + contractCust[i].coreCustomerName+ "<br>";
    }
    this.view.popUpDeactivate.lblPopUpMainMessage.text = kony.i18n.getLocalizedString("i18n.frmCompaniesPopup.confirmation");
    this.view.popUpDeactivate.rtxPopUpDisclaimer.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AreYouSureToCreateContract") + "\""+
      contractName+"\""+ kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.withBelowListOfCustomers")+"<br>"+custNames;
    this.view.popUpDeactivate.btnPopUpCancel.text = kony.i18n.getLocalizedString("i18n.frmCustomers.CANCEL");
    this.view.popUpDeactivate.btnPopUpDelete.text = kony.i18n.getLocalizedString("i18n.frmAdManagement.CreateCAPS");
    this.view.flxEnrollCustConfirmationPopup.setVisibility(true);
    
    this.view.popUpDeactivate.btnPopUpDelete.onClick = function(){
      self.createContract();
      self.view.flxEnrollCustConfirmationPopup.setVisibility(false);
    };
    
  },
  /*
  * show confirmation popup to add searched customer to selected contract
  */
  showEditContractConfirmationPopup : function(){
    var self =this;
    //get the selected contract id
    var selContractId ="",searchedCust = "", selContractName ="",custNameId = "";
    var contractCards = this.view.flxCustomerContractsList.widgets();
    for(var i=0;i <contractCards.length; i++){
      if(contractCards[i].imgCheckbox.src === this.AdminConsoleCommonUtils.radioSelected){
        selContractId = contractCards[i].info.contracts.id;
        selContractName = contractCards[i].info.contracts.name;
        searchedCust = contractCards[i].info.searchCustDetails.customers ?
                       contractCards[i].info.searchCustDetails.customers[0] :"";
        custNameId = searchedCust ? searchedCust.coreCustomerName + " ("+ searchedCust.coreCustomerId + ")" : "";
        break;
      }
    }
    //set popup message, action
    this.view.popUpDeactivate.lblPopUpMainMessage.text = kony.i18n.getLocalizedString("i18n.frmCompaniesPopup.confirmation");
    this.view.popUpDeactivate.rtxPopUpDisclaimer.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AreYouSureYouWantToAddCustomer") + "\""+
      custNameId+"\""  + kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.toTheContract") +"\"" +selContractName + "\"?" +
      "<br>" + kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.AddCustToContractPopupMsg");
    this.view.popUpDeactivate.btnPopUpCancel.text = kony.i18n.getLocalizedString("i18n.frmCustomers.CANCEL");
    this.view.popUpDeactivate.btnPopUpDelete.text = kony.i18n.getLocalizedString("i18n.ConfigurationBundles.buttonAdd");
    this.view.flxEnrollCustConfirmationPopup.setVisibility(true);
    
    this.view.popUpDeactivate.btnPopUpDelete.onClick = function(){
      self.presenter.getEditContractInformation(selContractId, searchedCust);
      self.view.flxEnrollCustConfirmationPopup.setVisibility(false);
    };
  },
  /*
  * form edit contract payload to add customer to existing contract
  * @param: selcted contract details
  */
  createEditContractPayload : function(editContractDetails){
    var contractAddress = editContractDetails.contractDetails.address;
    var contractComm = editContractDetails.contractDetails.communication;
    var contractCust =  editContractDetails.contractDetails.contractCustomers;
    var customerFeatures = editContractDetails.featuresLimits.features;
    var customerLimits = editContractDetails.featuresLimits.limits;
    var searchedCustDetails = editContractDetails.searchCust;
    var newCustAccounts = editContractDetails.custAccounts.coreCustomerAccounts.length > 0 ?
                               editContractDetails.custAccounts.coreCustomerAccounts[0].accounts : [];
    var addressArray = [{"country":contractAddress[0].country || "","cityName":contractAddress[0].cityName || "",
                          "state":contractAddress[0].state || "","zipCode":contractAddress[0].zipCode || "",
                          "addressLine1":contractAddress[0].addressLine1 || "","addressLine2": contractAddress[0].addressLine2 || ""}];
    //add new customer
    var contractCustArr =[{
      "isPrimary": "false",
      "coreCustomerId": searchedCustDetails.coreCustomerId,
      "coreCustomerName": searchedCustDetails.coreCustomerName,
      "sectorId":searchedCustDetails.sectorId,
      "isBusiness":searchedCustDetails.isBusiness,
      "accounts": newCustAccounts.map(this.getContracAccountsMapJson),
      "features":[]
    }];
    //add already assigned customers
    for(var i=0; i<contractCust.length; i++){
      var customerObject = {
        "isPrimary": contractCust[i].isPrimary,
		"coreCustomerId": contractCust[i].coreCustomerId,
		"coreCustomerName": contractCust[i].coreCustomerName,
        "sectorId":contractCust[i].sectorId,
        "isBusiness":contractCust[i].isBusiness,
		"accounts": contractCust[i].customerAccounts.map(this.getContracAccountsMapJson),
        "features":[]
      };
      contractCustArr.push(customerObject);
    }
    var updatedContractCust = this.setEditContractFeaturesLimits(contractCustArr,customerFeatures,customerLimits);
    //map features actions for edit payload structure
    for(var j=0;j<updatedContractCust.length; j++){
      updatedContractCust[j].features = this.getParsedFeaturesActionsForEditContract(updatedContractCust[j].features);
    }
    //form edit contract input payload
    var editContractPayLoad =  {
      "contractId":editContractDetails.contractDetails.id,
      "contractName": editContractDetails.contractDetails.name,
      "serviceDefinitionName": editContractDetails.contractDetails.servicedefinitionName,
      "serviceDefinitionId":editContractDetails.contractDetails.servicedefinitionId,
      "faxId":editContractDetails.contractDetails.faxId || "",
      "communication": JSON.stringify(contractComm) ,
      "address": JSON.stringify(addressArray),
      "contractCustomers": JSON.stringify(updatedContractCust)
    };
    this.presenter.editContract(editContractPayLoad);
  },
  
  /*
  *map accounts for create/edit contract payload
  */
  getContracAccountsMapJson : function(accountObj){
    return {
      "accountId": accountObj.accountNumber || accountObj.accountId,
      "accountType": accountObj.accountType,
      "accountName": accountObj.accountName,
      "typeId": accountObj.typeId || "",
      "ownerType": accountObj.ownerType,
      "arrangementId":accountObj.arrangementId,
      "accountHolderName":accountObj.accountHolderName,
      "accountStatus":accountObj.accountStatus,
    };
  },
  /*
  * enroll form
  * get combined features limits array for edit contract
  * @param: contract customer array, contract features,contract limits
  * @returns: updated contract customer arr with features
  */
  setEditContractFeaturesLimits : function(customerArr,features, limits){
    var selectedCustIds=[];
    var isNewlyAdded=true;
    for(let p=0;p<limits.length;p++){
      for(let q=0;q<features.length;q++){
        for(let x=0;x<limits[p].contractCustomerLimits.length;x++){
          for(let y=0;y<features[q].contractCustomerFeatures.length;y++){
            if(features[q].contractCustomerFeatures[y].featureId === limits[p].contractCustomerLimits[x].featureId){
              features[q].contractCustomerFeatures[y]=this.getCombinedFeature(features[q].contractCustomerFeatures[y],limits[p].contractCustomerLimits[x]);
            }
          }
        }
      }
    }
    for(let m=0;m<customerArr.length;m++){
      isNewlyAdded=true;
      for(let n=0;n<features.length;n++){
        if(features[n].coreCustomerId === customerArr[m].coreCustomerId){
          if(customerArr[m].features.length === 0)
          	customerArr[m].features=features[n].contractCustomerFeatures;        
          isNewlyAdded=false;
        }
      }
      if(isNewlyAdded === true)
        customerArr[m].features = this.setAllFeatures(m,features[0].contractCustomerFeatures);
    }
    return customerArr;
  },
  /*
  * enroll form
  * set all deatures for newly added customer in edit contract flow
  * @return :features list
  */
   setAllFeatures : function(index,features){
    for(let a=0;a<features.length;a++){
      for(let b=0;b<features[a].actions.length;b++){
        features[a].actions[b].isEnabled="true";
      }
    }
    return features;
  },
  /*
  * parse features actions for edit contract structure
  * @param: all features List
  * @returns: mapped features array for edit
  */
  getParsedFeaturesActionsForEditContract : function(featuresList){
    var featuresArr =[];
    for(var i=0; i<featuresList.length;i++){
      var actions = featuresList[i].actions;
      var actionsArr =[];
      for(var j=0; j<actions.length; j++){
        var actionObj = {
          "actionId": actions[j].id||actions[j].actionId,
          "actionName": actions[j].name||actions[j].actionName,
          "actionDescription": actions[j].description||actions[j].actionDescription,
          "isAllowed": actions[j].isEnabled,
        };
        if(actions[j].limits){
          actionObj["limits"] = actions[j].limits;
        }
        actionsArr.push(actionObj);
      }
      featuresArr.push({
        "featureName": featuresList[i].name||featuresList[i].featureName,
        "featureId": featuresList[i].id||featuresList[i].featureId,
        "featureDescription": featuresList[i].description||featuresList[i].featureDescription,
        "actions":actionsArr
      });
    }
    return featuresArr;
  },
  /*
  * edit contract option click
  */
  onEditContractClick : function(){
    var scopeObj =this;
    var enrollCustData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var tempContractDetails = this.presenter.getCreateContractPayload();
    scopeObj.action = scopeObj.actionConfig.edit;
    scopeObj.view.tbxRecordsSearch.text="";
    scopeObj.limitsActualJSON={};
    scopeObj.createContractRequestParam={
      "contractId": "",
      "contractName": tempContractDetails.contractName,
      "serviceDefinitionName": tempContractDetails.serviceDefinitionName,
      "serviceDefinitionId": tempContractDetails.serviceDefinitionId,
      "faxId": tempContractDetails.faxId,
      "communication": JSON.parse(tempContractDetails.communication),
      "address": JSON.parse(tempContractDetails.address),
      "contractCustomers": JSON.parse(tempContractDetails.contractCustomers)
    };
    scopeObj.presenter.getServiceDefinitionMonetaryActions({"serviceDefinitionId": tempContractDetails.serviceDefinitionId});
    scopeObj.updateButtonsText(true);
    scopeObj.view.flxClearRecordsSearch.setVisibility(false);
    scopeObj.setContractButtonsSkin(true);
    scopeObj.enableAllTabs(true);
    scopeObj.view.segAddedCustomers.setVisibility(true);
    scopeObj.view.btnSelectCustomers.setVisibility(true);
    scopeObj.view.flxNoCustomersAdded.setVisibility(false);
    scopeObj.showCreateContractScreen();
    scopeObj.showContractServiceScreen();
    
    scopeObj.addSelectedCustomersOfContract();
    scopeObj.setSelectedCustomersData();
    if(scopeObj.viewContractServiceDef.length === 0)
      scopeObj.presenter.getServiceDefinitionsForContracts({});
    else{
      scopeObj.setContractServiceCards(scopeObj.viewContractServiceDef);
      scopeObj.setDataToServiceTypeFilter(scopeObj.viewContractServiceDef);
      scopeObj.view.flxContractServiceCards.info={"totalRecords":scopeObj.viewContractServiceDef};
    }
    scopeObj.getCountrySegmentData();
    scopeObj.view.forceLayout();
  },
  /*
  * to add the customers added from contract while edit
  */
  addSelectedCustomersOfContract : function(){
    this.selectedCustomers = [];
    var segData = this.view.segEnrollCustList.data;
    for(var i=0; i<this.createContractRequestParam.contractCustomers.length; i++){
      var contractCust = this.createContractRequestParam.contractCustomers[i];
      for(var j=0; j<segData.length; j++){
        if(contractCust.coreCustomerId === segData[j].custDetails.coreCustomerId){  
          segData[j].custDetails["isSelected"] = contractCust.isPrimary === "true" ? "true" : "false";
          this.selectedCustomers.push(segData[j].custDetails);
        }
      }
    }
  },
  /*
  * get 2 digit string number
  * @param: number
  * @return: 2-digit sting number
  */
  getTwoDigitNumber : function(count){
    var updatedCount =0;
    count = parseInt(count,10);
    if(count > 9 || count === 0){
      updatedCount = count;
    } else{
      updatedCount = "0"+count;
    }
    return updatedCount;
  },
  callAddCustomer : function(){
    var widgetMap = {
      "custId": "custId",
      "flxEnrollCustomerList" : "flxEnrollCustomerList",
      "lblCustomerName":"lblCustomerName",
      "lblCustomerId":"lblCustomerId",
      "flxPrimary":"flxPrimary",
      "lblPrimary":"lblPrimary",
      "lstBoxService":"lstBoxService",
      "flxServiceError":"flxServiceError",
      "lblIconServiceError":"lblIconServiceError",
      "lblServiceErrorMsg":"lblServiceErrorMsg",
      "lstBoxRole":"lstBoxRole",
      "flxRoleError":"flxRoleError",
      "lblIconRoleError":"lblIconRoleError",
      "lblRoleErrorMsg":"lblRoleErrorMsg",
      "lblSeperator":"lblSeperator",
      "flxOptions":"flxOptions" ,
      "lblOptions":"lblOptions",
      "lblRemoved":"lblRemoved",
      "custDetails":"custDetails"
    };
    this.view.segEnrollCustList.setData([]);
    this.AdminConsoleCommonUtils.setEnableDisableSkinForButton(this.view.commonButtons.btnSave,true,false);
    this.view.btnAddCustomerId.onClick();
    this.view.forceLayout();
  },
  showEditSignatoryGroups : function(){
    this.view.flxEnrollEditAccountsContainer.setVisibility(false);
    this.view.flxEnrollEditFeaturesContainer.setVisibility(false);
    this.view.flxEnrollEditOtherFeaturesCont.setVisibility(false);
    this.view.flxEnrollEditLimitsContainer.setVisibility(false);
    this.view.flxEnrollEdiSignatoryContainer.setVisibility(true);
    var enrollUserData = this.view.segEnrollCustList.data[this.enrollSegRowInd];
    var custInfo, isPrimary = false;
    isPrimary = enrollUserData.flxPrimary.isVisible === true ? true : false;
    custInfo = enrollUserData.custDetails;
    var details = {
      "id": custInfo.coreCustomerId || custInfo.cif,
      "name": custInfo.coreCustomerName || custInfo.companyName || custInfo.contractName,
      "industry":custInfo.industry ||  kony.i18n.getLocalizedString("i18n.Applications.NA"),
      "email": custInfo.email,
      "phone":custInfo.phone,
      "address": custInfo.city ? (custInfo.country ? custInfo.city + ", "+ custInfo.country : custInfo.city) :
                                        (custInfo.country ? custInfo.country : kony.i18n.getLocalizedString("i18n.Applications.NA"))
    };
    var selectedCust = details.name +" ("+ details.id +")";
    this.view.customersDropdownSignatory.setEnabled(false);
    this.view.customersDropdownSignatory.flxSelectedText.skin = "sknFlxbgF3F3F3bdrd7d9e0";
    this.view.customersDropdownSignatory.flxSelectedText.hoverSkin = "sknFlxbgF3F3F3bdrd7d9e0";
    this.view.customersDropdownSignatory.lblSelectedValue.text = this.AdminConsoleCommonUtils.getTruncatedString(selectedCust,isPrimary?19:28,isPrimary?17:27);
    this.view.customersDropdownSignatory.lblSelectedValue.info = {"customerId": details.id,"customerDetails": custInfo};
    this.view.customersDropdownSignatory.lblSelectedValue.toolTip = selectedCust;
    this.view.customersDropdownSignatory.btnPrimary.isVisible = isPrimary;
    var widgetBtnArr = [this.view.enrollVerticalTabs.btnOption1,this.view.enrollVerticalTabs.btnOption2,this.view.enrollVerticalTabs.btnOption3, this.view.enrollVerticalTabs.btnOption4,this.view.enrollVerticalTabs.btnOption5];
    var widgetArrowArr = [this.view.enrollVerticalTabs.flxImgArrow1,this.view.enrollVerticalTabs.flxImgArrow2,this.view.enrollVerticalTabs.flxImgArrow3, this.view.enrollVerticalTabs.flxImgArrow4,this.view.enrollVerticalTabs.flxImgArrow5];
    this.tabUtilVerticleButtonFunction(widgetBtnArr,this.view.enrollVerticalTabs.btnOption5);
    this.tabUtilVerticleArrowVisibilityFunction(widgetArrowArr,this.view.enrollVerticalTabs.flxImgArrow5);
    this.view.searchEditSignatory.tbxSearchBox.text = "";
    this.view.searchEditSignatory.flxSearchCancel.setVisibility(false);
    this.view.flxAccountTypesFilter.setVisibility(false);
    this.view.flxEnrollEditSearchSignatory.setVisibility(true);
    var isValidApproval=this.hasValidateApprovalPermission();
    if(isValidApproval===true)
       this.setSignatoryGroupsData();
     else{
       this.view.flxEnrollEditSearchSignatory.setVisibility(false);
       this.view.lblNoResults.text="This user cannot be assigned to any signatory groups as this user doesnt have any approval permissions";
       this.view.flxNoResultsFound.setVisibility(true);
       this.view.flxResults.setVisibility(false);
     }
    this.view.forceLayout();
  },
  hasValidateApprovalPermission : function(){
    var custId = this.view.customersDropdownSignatory.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var isValid=false;
    var currCustAccFeatures = editUserObj.accountMapFeatures;
    var actions=[];
    for(let accId of currCustAccFeatures.keys()){
      var currSelAccObj = currCustAccFeatures .get(accId);
      var custfeatures = JSON.parse(currSelAccObj.features);
      for(var i=0;i<custfeatures.length;i++){
        actions=custfeatures[i].actions||custfeatures[i].permissions;
        for(var j=0; j< actions.length; j++){
          if(actions[j].isEnabled==="true"&&(actions[j].accessPolicyId==="APPROVE"||actions[j].accessPolicyId==="BULK_APPROVE")){
            isValid=true;
            break;
          }
        }
        if(isValid)
          break;
      }
      if(isValid)
          break;
    };
    return isValid;
  },
  setSignatoryGroupsData : function(){
    var custId = this.view.customersDropdownSignatory.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var signCustomerData= editUserObj.signatoryGroups;
    if(editUserObj.signatoryGroups.length===0){
      this.view.lblNoResults.text= "There are no signatory groups associated to this Customer."
      this.view.flxNoResultsFound.setVisibility(true);
      this.view.flxResults.setVisibility(false);
    }else{
      this.view.flxNoResultsFound.setVisibility(false);
      this.view.flxResults.setVisibility(true);
      if(editUserObj.signatoryGroups[0].signatoryGroupId!=="NONE"){
        signCustomerData.unshift({
          "signatoryGroupId":"NONE",
          "signatoryGroupName": "None",
          "signatoryGroupDescription":  "This option doesn’t have any association of the user to the customer.",
          "isAssociated": false
        });
      }
      this.setSignGroupsSegData(signCustomerData);
    }
  },
  setSignGroupsSegData : function(data){
    var self=this;
    var dataMap = {
      "flxCustomerProfileRoles": "flxCustomerProfileRoles",
      "flxRoleNameContainer": "flxRoleNameContainer",
      "flxRoleCheckbox": "flxRoleCheckbox",
      "flxRoleRadio": "flxRoleRadio",
      "imgRoleRadio":"imgRoleRadio",
      "flxRoleInfo": "flxRoleInfo",
      "lblRoleName": "lblRoleName",
      "lblRoleDesc": "lblRoleDesc",
      "btnViewDetails": "btnViewDetails",
    };
    var isAssociated=false;
    var toAdd=data.map(function(rec){
      if(rec.isAssociated==="true")
        isAssociated=true;
      return{
        "flxCustomerProfileRoles": "flxCustomerProfileRoles",
        "flxRoleNameContainer": {"onClick":self.toggleRadioButton},
        "flxRoleCheckbox": {"isVisible":false},
        "flxRoleRadio":{"isVisible":true},
        "imgRoleRadio": {"src": rec.isAssociated==="true" ? "radio_selected.png":"radio_notselected.png"},
        "lblRoleName": rec.signatoryGroupName,
        "lblRoleDesc": rec.signatoryGroupDescription,
        "btnViewDetails": {"isVisible":false},
        "template": "flxCustomerProfileRoles",
        "id": rec.signatoryGroupId,
      };
    });
    if(isAssociated===false)
      toAdd[0].imgRoleRadio.src="radio_selected.png";
    this.view.segCustomerSignGroups.widgetDataMap =dataMap;
    this.view.segCustomerSignGroups.setData(toAdd);
    this.view.segCustomerSignGroups.info={"data":toAdd};
    this.view.segCustomerSignGroups.selectionBehavior = constants.SEGUI_DEFAULT_BEHAVIOR;
    this.view.forceLayout();
  },
  toggleRadioButton : function(){
    var custId = this.view.customersDropdownSignatory.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var rowIndex = this.view.segCustomerSignGroups.selectedRowIndex[1];
    var segData = this.view.segCustomerSignGroups.data;
    var signatoryId="";
    for(var i=0;i<segData.length;i++){
      if(i === rowIndex){
        segData[i].imgRoleRadio.src = "radio_selected.png";
        signatoryId=segData[i].id;
      }
      else
        segData[i].imgRoleRadio.src = "radio_notselected.png";
    }
      this.view.segCustomerSignGroups.setData(segData);
    var signatoryList=editUserObj.signatoryGroups;
    for(let x=0;x<signatoryList.length;x++){
      if(signatoryList[x].signatoryGroupId===signatoryId)
        signatoryList[x].isAssociated="true";
      else
        signatoryList[x].isAssociated="false";
    }
    editUserObj.signatoryGroups=signatoryList;
    this.presenter.setAccountsFeaturesForEnrollCust(custId,editUserObj);
  },
  searchSignatoryGroups : function(){
    var custId = this.view.customersDropdownSignatory.lblSelectedValue.info.customerId;
    var editUserObj = this.presenter.getAccountsFeaturesForEnrollCust(custId);
    var signData=editUserObj.signatoryGroups;
    var searchText=this.view.searchEditSignatory.tbxSearchBox.text.trim();
    var dataToAssign=[];
    if(searchText.length===0){
      this.setSignatoryGroupsData();
    }else{
      dataToAssign = signData.filter(function(rec){
        var name = (rec.signatoryGroupName).toLowerCase();
        return (name.indexOf(searchText.toLowerCase()) > -1);
      });
      if(dataToAssign.length>0){
        this.view.flxNoResultsFound.setVisibility(false);
        this.view.flxResults.setVisibility(true);
        this.setSignGroupsSegData(dataToAssign);
      }else{
        this.view.flxNoResultsFound.setVisibility(true);
        this.view.flxResults.setVisibility(false);
      }
    }
  }
 });