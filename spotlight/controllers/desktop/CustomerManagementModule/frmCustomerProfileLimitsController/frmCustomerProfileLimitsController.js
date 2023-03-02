define({  
  selectedFeatureIndex : 0,
  prevSelectedFeature:[],
  groupActionConfig :{
    CREATE:"CREATE",
    EDIT:"EDIT",
    COPY: "COPY"
  },
  limitsList:{},
  selectedContractAccounts:[],
  removeCount : 0,
  recordsSize:5,
  prevIndex : -1,
  allMonActionsList:null,
  customerType :"",
  loadMoreModel:{
    PAGE_OFFSET:0
  },
  prevContractSelected:{
    segRowNo : -1
  },
  AccountLevelFeaturesTab : false,
  selectedTab : 1,
  willUpdateUI: function (context) {
    if (context) {
      this.updateLeftMenu(context);

      if (context.LoadingScreen) {
        if (context.LoadingScreen.focus) {
          kony.adminConsole.utils.showProgressBar(this.view);
        } else {
          kony.adminConsole.utils.hideProgressBar(this.view);
        }
      } else if (context.toastModel) {
        if (context.toastModel.status === kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.SUCCESS")) {
          this.view.toastMessage.showToastMessage(context.toastModel.message, this);
        } else {
          this.view.toastMessage.showErrorToastMessage(context.toastModel.message, this);
        }
      } else if (context.CustomerBasicInfo) {
        this.view.flxGeneralInfoWrapper.setBasicInformation(context.CustomerBasicInfo, this);
        //this.showToggleButtons(context.CustomerBasicInfo.customer);
        this.view.tabs.setCustomerProfileTabs(this);
      } else if (context.UpdateDBPUserStatus) {
        this.view.flxGeneralInfoWrapper.setLockStatus(context.UpdateDBPUserStatus.status.toUpperCase(), this);

      } else if(context.featureDetails){
        this.showRoleDetailsPopup(context.featureDetails.features);
      } else if (context.StatusGroup) {
        this.view.flxGeneralInfoWrapper.processAndFillStatusForEdit(context.StatusGroup, this);

      } else if (context.CustomerNotes) {
        this.view.Notes.displayNotes(this, context.CustomerNotes);

      } else if (context.OnlineBankingLogin) {
        this.view.CSRAssist.onlineBankingLogin(context.OnlineBankingLogin, this);

      }else if (context.limitsList){
        this.limitsList.globalLevelLimits = this.groupBycontracts( context.limitsList.FeaturesAndActions.transactionLimits);
        this.limitsList.accountLevelLimits =  this.groupBycontracts(  context.limitsList.FeaturesAndActions.transactionLimits);
        this.showCustomerLimitsScreen();

        // intially we set the account level permission
        this.AccountLevelFeaturesTab = false;
        if(context.limitsList.FeaturesAndActions.transactionLimits.length===0){
          this.showNoLimitsScreen();
        }else{
          this.view.flxFeaturesSearchContainer.setVisibility(true);
          this.view.rtxMsgNoLimits.setVisibility(false);
          this.view.flxFeaturesByCustomerCont.setVisibility(true);
          this.createContractTemplate(this.limitsList.globalLevelLimits);
        }
        // createAccountFeatureCards
      }
      else if (context.allFeatures){
       // this.filterRetailFeatures(context.allFeatures);
      }
      else if(context.userNameRulesPolicy){
        this.view.delinkProfilePopup.setUsernameRules(context.userNameRulesPolicy);
      } 
      else if (context.FeaturesAndActions) {
        /*this.view.tabs.setSkinForInfoTabs(this.view.tabs.btnTabName5);
        if (context.FeaturesAndActions.target === "InfoScreen") {
          this.showFeaturesAndActionsScreen(context.FeaturesAndActions);
        } */
      } 
      else if(context.linkProfilesList){
        this.view.linkProfilesPopup.setSearchProfilesSegmentData(context.linkProfilesList,this);
      }
      else if(context.userNameIsAvailable){
        this.view.delinkProfilePopup.checkUserNameAvailability(context.userNameIsAvailable);
      } else if(context.checkAuthSignatory){ 
        //for business user,to get isauthSignatory flag in case not available in basicInfo
        var customerType = context.checkAuthSignatory.customer.CustomerType_id;
        var status = context.checkAuthSignatory.customer.CustomerStatus_id;
         //hiding link/delink profile buttons
        /*if (status === "LOCKED" || status === "SUSPENDED" || status === "NEW") {
          this.view.flxGeneralInfoWrapper.showLinkDelinkButtons(this,customerType,false);
        }  else {
          this.view.flxGeneralInfoWrapper.showLinkDelinkButtons(this,customerType,true);
        }*/
      }
    }
  },
  groupBycontracts: function(levelPermissions ){
    
    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    return groupBy(levelPermissions, 'contractId');
  },
  CustomerProfileFeaturesPreshow: function () {
    this.view.tabs.setSkinForInfoTabs(this.view.tabs.btnTabName10);
    this.view.Notes.setDefaultNotesData(this);
    var screenHeight = kony.os.deviceInfo().screenHeight;
    this.view.flxMainContent.height = screenHeight - 115 + "px";
    this.view.flxGeneralInfoWrapper.changeSelectedTabColour(this.view.flxGeneralInfoWrapper.dashboardCommonTab.btnProfile);
    this.view.flxGeneralInfoWrapper.generalInfoHeader.setDefaultHeaderData(this);
    this.view.flxGeneralInfoWrapper.setFlowActionsForGeneralInformationComponent(this);
    this.view.linkProfilesPopup.initializeLinkProfileActions(this);
    this.view.delinkProfilePopup.delinkProfilePreshow(this);
    this.view.searchBoxFeatures.tbxSearchBox.text ="";
    this.setFlowActions();
    this.view.flxFeaturesContainer.setVisibility(true);
    this.currencyValue=this.defaultCurrencyCode();
    
  },
  unloadOnScrollEvent: function () {
    document.getElementById("frmCustomerProfileLimits_flxMainContent").onscroll = function () { };
  },
  filterSearchResults : function (permissions , searchTxt) {
    /*
    format of the grouped data
    {
      'contractId' : { 'contractValue' , 'customerCoreValue'}
    }
    */
    var searchResults=[];
    var accountsList=[];
    var filteredPermissions=[]; 
    if(this.AccountLevelFeaturesTab){
      //account Id , feature name
      accountsList= permissions.filter(function(account) {
        if(account.accountNumber.toLowerCase().indexOf(searchTxt) !== -1)
          return account;
        else{
          var features=account.featurePermissions;
          var filteredFeatures=features.filter(function(rec){
            if(rec.featureName.toLowerCase().indexOf(searchTxt) !== -1)
              return rec;
          });
          if(filteredFeatures.length>0){
            account.featurePermissions=filteredFeatures;
            return account;
          }
        }

      });
      if(accountsList.length>0)
        searchResults=accountsList;
    }else{
      for(var i in permissions){//contract list
        //customer name and customer id
        for(var j=0;j<permissions[i].length;j++){//customers list under a contract
          filteredPermissions=[];
          var permission=permissions[i][j];
          if(permission.coreCustomerName.toLowerCase().indexOf(searchTxt) !==-1 || 
             permission.coreCustomerId.toLowerCase().indexOf(searchTxt) !==-1){
            filteredPermissions.push(permission);
          }
        }
        if(filteredPermissions.length>0)
          searchResults[i]=filteredPermissions;
      }
    }
    return searchResults;
  },
  
  setFlowActions: function () {
    var scopeObj = this;
        this.view.searchBoxFeatures.flxIconBackground.onClick = function(){
      // if text is empty we won't perform the search
          if(scopeObj.view.searchBoxFeatures.tbxSearchBox.text === ""){
            return;
          }  
          let searchTxt = scopeObj.view.searchBoxFeatures.tbxSearchBox.text;
          searchTxt = searchTxt.toLowerCase();

          if(scopeObj.AccountLevelFeaturesTab){
            // AccountLevelFeaturesTab tab
            scopeObj.createAccountFeatureCards(scopeObj.filterSearchResults(JSON.parse(JSON.stringify(scopeObj.selectedContractAccounts)),searchTxt ));
          }else{
            // other features tab
            scopeObj.createContractTemplate(scopeObj.filterSearchResults(scopeObj.limitsList.globalLevelLimits ,searchTxt ));
          }
          scopeObj.view.forceLayout();
        };
    const searchInternalUsers1 = function() {
      scopeObj.view.searchBoxFeatures.flxIconBackground.onClick();
    };
    const debounce = function(func, delay) {
      var self = this;
      let timer;
      return function() {
        let context = self,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
          func.apply(context, args);
        }, delay);
      };
    };
    const searchInternalUsersCall = debounce(searchInternalUsers1, 300);
    this.view.searchBoxFeatures.tbxSearchBox.onKeyUp = function(){

        if(scopeObj.view.searchBoxFeatures.tbxSearchBox.text === ""){
            scopeObj.view.searchBoxFeatures.flxClearSearch.onClick();
          }else{
            scopeObj.view.searchBoxFeatures.flxClearSearch.setVisibility(true);
          }
          searchInternalUsersCall();
          scopeObj.view.forceLayout();
    };
    this.view.searchBoxFeatures.flxClearSearch.onClick = function(){
        scopeObj.view.searchBoxFeatures.tbxSearchBox.text = "";
        scopeObj.view.searchBoxFeatures.flxClearSearch.setVisibility(false);
       
        if(scopeObj.AccountLevelFeaturesTab){
          // AccountLevelFeaturesTab tab
          scopeObj.createAccountFeatureCards(scopeObj.selectedContractAccounts);
        }else{
          // other features tab
          scopeObj.createContractTemplate(scopeObj.limitsList.globalLevelLimits);
        }
    };
    this.view.flxCloseLimits.onClick = function(){
      scopeObj.view.flxViewLimitsPopup.setVisibility(false);
      scopeObj.view.forceLayout();
    };
    this.view.flxFeatureDetailsClose.onClick = function(){
      scopeObj.view.flxFeatureDetails.setVisibility(false);
    };
    this.view.popUpConfirmation.btnPopUpCancel.onClick = function(){
      scopeObj.view.flxPopUpConfirmation.setVisibility(false);
    };
   /* this.view.btnfeaturesActionsEdit.onClick = function(){
      scopeObj.view.flxGeneralInfoWrapper.flxGeneralInfoEditButton.onClick();
    };
    this.view.btnEditAdditionalFeatures.onClick = function(){
      scopeObj.view.flxGeneralInfoWrapper.flxGeneralInfoEditButton.onClick();
    };
    this.view.toggleButtons.btnToggleLeft.onClick = function(){
      scopeObj.view.toggleButtons.info.selectedTab = 1;
      scopeObj.setFeturesAndActionsScreenData(scopeObj.view.toggleButtons.btnToggleLeft.info.featuresData,
                                              scopeObj.view.toggleButtons.btnToggleLeft.info.typeId);
      scopeObj.toggleButtonsUtilFunction([scopeObj.view.toggleButtons.btnToggleLeft,scopeObj.view.toggleButtons.btnToggleRight],1);
    };
    this.view.toggleButtons.btnToggleRight.onClick = function(){
      scopeObj.view.toggleButtons.info.selectedTab = 2;
      scopeObj.setFeturesAndActionsScreenData(scopeObj.view.toggleButtons.btnToggleRight.info.featuresData,
                                              scopeObj.view.toggleButtons.btnToggleRight.info.typeId);
      scopeObj.toggleButtonsUtilFunction([scopeObj.view.toggleButtons.btnToggleLeft,scopeObj.view.toggleButtons.btnToggleRight],2);
    };*/
    this.view.flxBackToFeaturesByCust.onClick = function(){
      scopeObj.showCustomerLimitsScreen();
    };
    this.view.flxRoleDetailsClose.onClick = function(){
      scopeObj.view.flxRoleDetailsPopup.setVisibility(false);
    };
  },
  saveScreenY: function (widget, context) {
    this.mouseYCoordinate = ((context.screenY + this.view.flxMainContent.contentOffsetMeasured.y) - (this.view.breadcrumbs.frame.height + this.view.mainHeader.flxMainHeader.frame.height));
  },
  onDropdownHoverCallback:function(widget, context) {
    var scopeObj = this;
    var widGetId = widget.id;
    if (widget) { //for filter dropdown
      if (context.eventType === constants.ONHOVER_MOUSE_ENTER || context.eventType === constants.ONHOVER_MOUSE_MOVE) {
        widget.setVisibility(true);
      } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
        widget.setVisibility(false);
      }
    }
  },
  /*
  * show features actions at customer level
  */
  showCustomerLimitsScreen : function(){
    this.view.flxCustFeaturesListContainer.setVisibility(true);
    this.view.flxAccFeaturesListContainer.setVisibility(false);
    this.view.flxBackToFeaturesByCust.setVisibility(false);
    this.view.searchBoxFeatures.tbxSearchBox.text="";
    this.view.searchBoxFeatures.flxClearSearch.setVisibility(false);
    this.view.searchBoxFeatures.tbxSearchBox.placeholder = kony.i18n.getLocalizedString("i18n.frmCompanies.searchByCustLimits");
    this.view.forceLayout();
  },
  /*
  * show the account level features actions for the customer screen
  */
  showFeaturesAtAccountLevel : function(contractId , coreCustomerJSON){
    this.view.lblSelectedCustValue.text = coreCustomerJSON.coreCustomerName + " ("+coreCustomerJSON.coreCustomerId+")";
    this.view.lblSelectedCustValue.info={"custId":coreCustomerJSON.coreCustomerId};
    this.view.flxBackToFeaturesByCust.setVisibility(true);
    this.view.flxCustFeaturesListContainer.setVisibility(false);
    this.view.flxAccFeaturesListContainer.setVisibility(true);
    this.view.searchBoxFeatures.tbxSearchBox.placeholder = kony.i18n.getLocalizedString("i18n.frmCustomerProfileFeaturesActions.SearchByAccountFeature");
	this.AccountLevelFeaturesTab = true;
    let coreCustomers = this.limitsList.accountLevelLimits[contractId];
    // getting the coreCustomer
    let coreCustomer =  coreCustomers.filter(function(rec){
      if(rec.coreCustomerId === coreCustomerJSON.coreCustomerId){
        return rec;
      }
    });
    this.selectedContractAccounts=JSON.parse(JSON.stringify(coreCustomer[0].accounts));
    this.createAccountFeatureCards(coreCustomer[0].accounts, coreCustomerJSON);
    this.view.forceLayout();
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
                    "limits":  allFeatureActions[i].limits,
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
  * create contract containers dynamically
  */
  createContractTemplate : function(lvlPermissions){
    this.view.flxFeaturesByCustomerCont.removeAll();
    var i = 0;
    if(Object.keys(lvlPermissions).length>0){
      this.view.flxFeaturesByCustomerCont.setVisibility(true);
      this.view.rtxMsgNoLimits.setVisibility(false);
      for(var contractId in lvlPermissions){
        var flxId = i>10 ? ""+i : "0"+i;
        var contractFlex = this.view.flxFeaturesContractCardTemplate.clone(flxId);
        contractFlex.top = "10dp";
        contractFlex.isVisible = true;
        this.view.flxFeaturesByCustomerCont.add(contractFlex);

        let coreCustomers = lvlPermissions[contractId];
        // the feature cards are used for mapping customers
        this.createCustFeatureCards(flxId , coreCustomers  , contractId);
        i = i+1;
      }
    }else{
      this.view.flxFeaturesByCustomerCont.setVisibility(false);
      this.view.rtxMsgNoLimits.text=kony.i18n.getLocalizedString("i18n.frmCustomerManagement.rtxMsgActivityHistory");
      this.view.rtxMsgNoLimits.setVisibility(true);
    }
    
  },
  /*
  * create feature cards for customer inside the contract containers
  * the feature cards are used for mapping customers
  * @param: contract container id
  */
  createCustFeatureCards : function(parentWidId ,coreCustomers , contractId){
    this.view[parentWidId+"flxFeatureCardsContainer"].removeAll();
    
    // setting the contract name
    this.view[parentWidId +'lblHeading'].text = coreCustomers[0].contractName +' (' +coreCustomers[0].contractId+')';

    for (var i = 0; i < coreCustomers.length; i++) {
      var num = i>10 ? ""+i : "0"+i;
      var id = parentWidId+"C"+num;
      var coreCustomer  = coreCustomers[i];
      var featureCardToAdd = new com.adminConsole.contracts.accountsFeaturesCard({
        "id": "featureCustCard" +id,
        "isVisible": true,
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "width":"100%",
        "top": "15dp"
      }, {}, {});
      featureCardToAdd.isVisible = true;
      featureCardToAdd.showThreeColumns();

      featureCardToAdd.lblName.text = coreCustomer.coreCustomerName;

      featureCardToAdd.lblData1.text = coreCustomer.coreCustomerId;
      featureCardToAdd.lblData2.text = coreCustomer.taxId?coreCustomer.taxId:"N/A";
      var address="N/A";
      if(coreCustomer.cityName||coreCustomer.country)
          address=this.AdminConsoleCommonUtils.getAddressText(coreCustomer.cityName,coreCustomer.country);
      featureCardToAdd.lblData3.text = address;
      // onTouchStart on the below label is not smooth updating to onClick
      featureCardToAdd.lblName.onTouchStart = function(){
        let details = {"id": featureCardToAdd.lblData1.text,
                      "name":featureCardToAdd.lblName.text,
                      "industry":coreCustomer.industry,
                      "email":coreCustomer.email,
                      "phone":coreCustomer.phone,
                      "address": address};
        this.view.contractDetailsPopup.setDataForPopup(details);

        this.view.contractDetailsPopup.showBackButton(false);
        this.view.flxContractDetailsPopup.setVisibility(true);
      }.bind(this);
      var custBasicInfo = this.presenter.getCurrentCustomerDetails();
      if(coreCustomer.coreCustomerId === custBasicInfo.primaryCustomerId){
        featureCardToAdd.flxPrimary.isVisible=true;
      }
      //hide edit button if customer is not accessable for current logged in user
      featureCardToAdd.btnEdit.isVisible = custBasicInfo.isCustomerAccessiable === true ? true : false;
      // assign data and actions for a feature card
      this.setDataActionsForCustFeatureCard(featureCardToAdd , coreCustomer , contractId);
      this.view[parentWidId+"flxFeatureCardsContainer"].add(featureCardToAdd);
    }
    this.view.forceLayout();
  },
  /*
  * assign data and actions for a feature card
  * @param: cust feature card path, data to set
  */
  setDataActionsForCustFeatureCard : function(featureCard,coreCustomer , contractId){
    var self=this;
    featureCard.flxDynamicWidgetsContainer.isVisible = false;
    featureCard.flxHeadingRightContainer.isVisible = true;
    featureCard.lblData4.skin = "sknLblLato13px117eb0Cursor";
    featureCard.lblCount.isVisible=false;
    featureCard.flxArrow.onClick = this.toggleCardListVisibility.bind(this,featureCard,1);
    featureCard.btnEdit.onClick = function(){
      self.editLimitsOnClick(featureCard,false, coreCustomer);
    };
    featureCard.lblData4.onClick = this.presenter.getGroupFeaturesAndActions.bind(this, coreCustomer.userRole ,'frmCustomerProfileEntitlements' );
    featureCard.lblHeading.text = kony.i18n.getLocalizedString("i18n.frmServiceManagement.Limits");
    featureCard.lblCount.text = "";
    featureCard.toggleCollapseArrow(false);
	if(coreCustomer.limitGroups.length===0)
      featureCard.btnView.setVisibility(false);
    else{
      featureCard.btnView.text = kony.i18n.getLocalizedString("i18n.frmCustomerProfileFeaturesActions.ViewByAccounts");
      featureCard.btnView.onClick = this.showFeaturesAtAccountLevel.bind(this, contractId ,coreCustomer );
    }
    if(this.AccountLevelFeaturesTab){
      // we append all account level features
      let acctLvlLimits = [];
      coreCustomer.accounts.forEach(function(account) {
        acctLvlLimits =  acctLvlLimits.concat(account.featurePermissions);
      });
      var features=this.getFeatureBasedActions(acctLvlLimits);
      this.setAccLevelLimitsCardSegmentData(featureCard.segAccountFeatures ,features );
    }else{
      this.setLimitsCardSegmentData(featureCard.segAccountFeatures , coreCustomer.limitGroups);
    } 
    
  },
  /*
  * widget map for features segments
  * @returns: widget map json
  */
  getWidgetDataMapForLimits : function(){
    var widgetMap ={
      "flxEnrollLimits":"flxEnrollLimits",
      "lblLimitsHeading":"lblLimitsHeading",
      "flxLimitsContainer":"flxLimitsContainer",
      "flxLimitsRow1":"flxLimitsRow1",
      "lblRowHeading1":"lblRowHeading1",
      "flxLimitValue1":"flxLimitValue1",
      "lblCurrency1":"lblCurrency1",
      "lblValue1":"lblValue1",
      "flxLimitsRow2":"flxLimitsRow2",
      "lblRowHeading2":"lblRowHeading2",
      "flxLimitValue2":"flxLimitValue2",
      "lblCurrency2":"lblCurrency2",
      "lblValue2":"lblValue2",
      "flxLimitsRow3":"flxLimitsRow3",
      "lblRowHeading3":"lblRowHeading3",
      "flxLimitValue3":"flxLimitValue3",
      "lblCurrency3":"lblCurrency3",
      "lblValue3":"lblValue3",
      "lblSeperator":"lblSeperator"
    };
    return widgetMap;
  },
 /*
  * set features and actions segment data in feature card
  * @param: segment widget path
  */
  setLimitsCardSegmentData : function(segmentPath , limits){
    var self =this;
    var featuresSegData = [];
    var limitGroupName="";
    for(var a=0;a<limits.length;a++){
      let limitOb = self.getObjectFromArrayOfObjects(limits[a].limits);
      if(limits[a].limitGroupId!=="ACCOUNT_TO_ACCOUNT"){
        if(limits[a].limitGroupId==="BULK_PAYMENT")
          limitGroupName="BULK TRANSACTION LIMITS";
        else if(limits[a].limitGroupId==="SINGLE_PAYMENT")
          limitGroupName="SINGLE TRANSACTION LIMITS";
        featuresSegData.push({
          "template":"flxEnrollLimits",
          "lblLimitsHeading":{"text":limitGroupName},
          "lblRowHeading1":{"text":kony.i18n.getLocalizedString("i18n.konybb.perTransaction")},
          "lblCurrency1":{"text":self.currencyValue},
          "lblValue1":{"text":limitOb['MAX_TRANSACTION_LIMIT']?limitOb['MAX_TRANSACTION_LIMIT']:"-"},
          "lblRowHeading2":{"text":kony.i18n.getLocalizedString("i18n.konybb.dailyTransaction")},
          "lblCurrency2":{"text":self.currencyValue},
          "lblValue2":{"text":limitOb['DAILY_LIMIT']?limitOb['DAILY_LIMIT']:"-"},
          "lblRowHeading3":{"text":kony.i18n.getLocalizedString("i18n.konybb.weeklyTransaction")},
          "lblCurrency3":{"text":self.currencyValue},
          "lblValue3":{"text":limitOb['WEEKLY_LIMIT']?limitOb['WEEKLY_LIMIT']:"-"},
          "lblSeperator":{"isVisible":true}
        });
      }
    }
    segmentPath.widgetDataMap = this.getWidgetDataMapForLimits();
    segmentPath.setData(featuresSegData);
    segmentPath.setVisibility(false);
    this.view.forceLayout();
  },
  getWidgetDataMapForAccLimits : function(){
    return{
       // segContractsFAHeaderView template
      "flxContractsFAHeaderView": "flxContractsFAHeaderView",
      "flxFeatureDetails": "flxFeatureDetails",
      "flxFeatureStatus": "flxFeatureStatus",
      "flxHeader": "flxHeader",
      "flxRow1": "flxRow1",
      "flxSelectedActions": "flxSelectedActions",
      "flxViewActionHeader": "flxViewActionHeader",
      "lblActionDescHeader": "lblActionDescHeader",
      "lblActionHeader": "lblActionHeader",
      "lblActionStatusHeader": "lblActionStatusHeader",
      "lblAvailableActions": "lblAvailableActions",
      "lblCountActions": "lblCountActions",
      "lblFASeperator1": "lblFASeperator1",
      "lblFASeperator2": "lblFASeperator2",
      "lblFASeperator3": "lblFASeperator3",
      "lblFeatureName": "lblFeatureName",
      "lblTotalActions": "lblTotalActions",
      "flxArrow":"flxArrow",
      "lblArrow":"lblArrow",
      
      "flxContractsLimitsBodyView": "flxContractsLimitsBodyView",
      "flxDailyLimitTextBox": "flxDailyLimitTextBox",
      "flxPerLimitTextBox": "flxPerLimitTextBox",
      "flxViewLimits": "flxViewLimits",
      "flxWeeklyLimitTextBox": "flxWeeklyLimitTextBox",
      "lblAction": "lblAction",
      "lblCurrencySymbol1": "lblCurrencySymbol1",
      "lblCurrencySymbol2": "lblCurrencySymbol2",
      "lblCurrencySymbol3": "lblCurrencySymbol3",
      "lblDailyTransactionLimit": "lblDailyTransactionLimit",
      "lblLimitsSeperator": "lblLimitsSeperator",
      "lblPerTransactionLimit": "lblPerTransactionLimit",
      "lblWeeklyTransactionLimit": "lblWeeklyTransactionLimit",
      "flxPerLimit": "flxPerLimit",
      "lblCurrencyPer": "lblCurrencyPer",
      "flxDailyLimit": "flxDailyLimit",
      "lblCurrencyDaily": "lblCurrencyDaily",
      "flxWeeklyLimit": "flxWeeklyLimit",
      "lblCurrencyWeekly": "lblCurrencyWeekly",
      "tbxDailyValue": "tbxDailyValue",
      "tbxPerValue": "tbxPerValue",
      "tbxWeeklyValue": "tbxWeeklyValue",

      // segContractsLimitsHeaderView template
      "flxActionDetails": "flxActionDetails",
      "flxActionStatus": "flxActionStatus",
      "flxContractsLimitsHeaderView": "flxContractsLimitsHeaderView",
      "flxDailyLimitHeader": "flxDailyLimitHeader",
      "flxLimitInfo1": "flxLimitInfo1",
      "flxLimitInfo2": "flxLimitInfo2",
      "flxLimitInfo3": "flxLimitInfo3",
      "flxPerLimitHeader": "flxPerLimitHeader",
      "flxViewLimitsHeader": "flxViewLimitsHeader",
      "flxWeeklyLimitHeader": "flxWeeklyLimitHeader",
      "fontIconInfo1": "fontIconInfo1",
      "fontIconInfo2": "fontIconInfo2",
      "fontIconInfo3": "fontIconInfo3",
      "lblActionName": "lblActionName",
      "lblDailyLimitHeader": "lblDailyLimitHeader",
      "lblPerLimitHeader": "lblPerLimitHeader",
      "lblWeeklyLimitHeader": "lblWeeklyLimitHeader",
      "statusIcon": "statusIcon",
      "statusValue": "statusValue",
      "lblLimitsSeperator3" :"lblLimitsSeperator3"
    };
  },
  setAccLevelLimitsCardSegmentData : function(segmentPath,limits){
    var segData=[];
    var segInd=-1;
    var self=this;
    segData = limits.map( function(limit){
      segInd = segInd +1;
      return  [
        {  
          /////////////////////////////////////////////////////////
          'flxActionDetails' :{"left" :"27dp"},
          'flxHeader' :{"left" :"30dp"},
          'flxViewLimitsHeader' :{
                "isVisible": false , 
                "left" :"57dp"
              },
          /////////////////////////////////////////////////////////
          "lblActionDesc": limit.featureDescription,
          "lblFASeperator1": {
            "text": ".",
            "isVisible": false
          },
          "lblLimitsSeperator3": ".",
          'fontIconInfo1':'',
          "flxLimitInfo1":{"onHover" : function(widget, context) {
              let info = "This is daily transaction value for " + limit.featureName + " submitted over the online banking channel.";
              self.onHoverCallBack(widget, context,info);
            }
          },
          "flxLimitInfo2":{"onHover" : function(widget, context) {
              let info = "This is daily transaction value for " + limit.featureName + " submitted over the online banking channel.";
              self.onHoverCallBack(widget, context,info);
            }
          },
          "flxLimitInfo3":{"onHover" : function(widget, context) {
              let info = "This is daily transaction value for " + limit.featureName + " submitted over the online banking channel.";
              self.onHoverCallBack(widget, context,info);
            }
          },
          'fontIconInfo2':'',
          'fontIconInfo3':'',
          "lblActionName": limit.featureName,          
          "lblActionHeader": kony.i18n.getLocalizedString("i18n.frmMfascenarios.ACTION_CAP"),
          "lblPerLimitHeader": "Per transaction",
          "lblDailyLimitHeader": "DAILY TRANSACTION",
          "lblWeeklyLimitHeader":"WEEKLY TRANSACTION",
          "lblAvailableActions": "Monetary Actions:",

          "lblCountActions":{
            'text':limit.actions.length ,
            'isVisible' : true
          },
          'template':'flxContractsLimitsHeaderView',
          'statusValue' : limit.featureStatus === 'SID_FEATURE_ACTIVE' ?'Active':'InActive',
          'statusIcon' : {
          "text" :  kony.i18n.getLocalizedString("i18n.frmAlertsManagement.lblViewAlertStatusKey"),
            "skin": "sknFontIconActivate"
          },
          'flxViewLimits':{"left" :"57dp"},
          "lblArrow": "\ue922", // side arrow
          "flxArrow": {
            "isVisible":true,
              "onClick": self.toggleCollapseArrowForSeg.bind(self, segmentPath, segInd , limit.actions)
          }
        },[
          {
            "template": "flxContractsFAHeaderView"
          }
        ]];
      });
    segmentPath.widgetDataMap = this.getWidgetDataMapForAccLimits();
    segmentPath.setData(segData);
    this.view.forceLayout();
  },
  /*
* set the collapse arrow images based on visibility
*/
  toggleCollapseArrowForSeg : function(segment , segInd  , resData){
      let rowData = segment.data[segInd];
      let arr = [
        {
          "template": "flxContractsFAHeaderView"
        }
      ];  
      let  check = false;

        check = rowData[0]["flxViewLimitsHeader"]["isVisible"];
        
        // check indicates is the segment row is collapse or not
        // if its collapsed than we push the data to this section
      
        if(!check){          
          arr = this.getRowDataForLimits(resData);
        }          
      rowData[1] = arr;

    // updating the current index  to expand
    // for limits tab updating the data
    check = rowData[0]["flxViewLimitsHeader"]["isVisible"];
    rowData[0]["flxViewLimitsHeader"]["isVisible"] = !check;
    rowData[0]['lblFASeperator1']["isVisible"] = !check;
    rowData[0]['lblLimitsSeperator3']["isVisible"] = check;
    rowData[0]['lblArrow'] = !check?"\ue915":"\ue922"; 

    // The previous row will collapse only if it's not matching current row 
    if (this.prevContractSelected.segRowNo !== segInd) {
      this.collapseSegmentSection(segment);
      this.prevContractSelected.segRowNo = segInd;
    }
      
      // if the section is collapse we reset the previous tab
      if(check) {
          this.prevContractSelected.segRowNo = -1;
      }
      
      segment.setSectionAt(rowData, segInd);
    this.view.forceLayout();
  },
    collapseSegmentSection: function(segment ){
    let prevInd = this.prevContractSelected.segRowNo;
    // if prevIndex is empty we reset to -1
    if(prevInd == -1){
      return;
    }
    let rowData = segment.data[prevInd];
    if(rowData[1].template=== "flxContractsFAHeaderView"){
      // the segment doesn't have section , returning from he function
      return;
    }
    
    rowData[1] = [
      {
        "template": "flxContractsFAHeaderView"
      }
    ];
    // collapsing the rowdata
    this.resetSectionsForViewContracts(rowData);
    
    // updating the index 
    segment.setSectionAt(rowData , prevInd);
    // segment.setData(segment.data);
  },
    resetSectionsForViewContracts :  function(rowData){
    // we expand/collapse the rowData
      let  check = false;
      // for limits tab updating the data
      check = rowData[0]["flxViewLimitsHeader"]["isVisible"];
      rowData[0]["flxViewLimitsHeader"]["isVisible"] = !check;
      rowData[0]['lblFASeperator1']["isVisible"] = !check;
      rowData[0]['lblLimitsSeperator3']["isVisible"] = check;

      rowData[0]['lblArrow'] = !check?"\ue915":"\ue922"; 
      // ue915 is the down arrow

    },
    getObjectFromArrayOfObjects : function(arr){
    ob = {};
    arr.map(function(ele){
      ob[ele.id] = ele.value;
    });
    return ob;
  },
  getRowDataForLimits: function(limit){
    var self = this;
    return 	limit.map(function(action) {
      let limitOb = self.getObjectFromArrayOfObjects(action.limits);
      return {
        "flxViewLimits":{"left":"57dp"},
        "lblAction": action.actionName,
        "lblCurrencyPer": {"text":self.currencyValue},
        "lblCurrencyDaily": {"text":self.currencyValue},
        "lblCurrencyWeekly": {"text":self.currencyValue},
        "lblPerTransactionLimit": limitOb['MAX_TRANSACTION_LIMIT'] ? limitOb['MAX_TRANSACTION_LIMIT'] :"-",
        "template": "flxContractsLimitsBodyView",
        "lblDailyTransactionLimit": limitOb['DAILY_LIMIT'] ? limitOb['DAILY_LIMIT'] :"-",
        "lblLimitsSeperator":".",
        "lblFASeperator1":{"isVisible" : false},
        "lblWeeklyTransactionLimit": limitOb['WEEKLY_LIMIT'] ? limitOb['WEEKLY_LIMIT'] :"-"
      };
    });
  },
  onHoverCallBack:function(widget, context,info) {
    var scopeObj = this;
    var widGetId = widget.id;
    if (widget) {
      if (context.eventType === constants.ONHOVER_MOUSE_ENTER) {
        scopeObj.showOnHvrInfo(context, widGetId, info);
      }else if (context.eventType === constants.ONHOVER_MOUSE_MOVE) {
        scopeObj.view.ToolTip.setVisibility(true);
      } else if (context.eventType === constants.ONHOVER_MOUSE_LEAVE) {
        scopeObj.view.ToolTip.setVisibility(false);
      }
    }
  },
  showOnHvrInfo: function(featureSegment, widGetId, info) {
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
    scopeObj.view.ToolTip.left = leftVal + "px";
    scopeObj.view.ToolTip.top = topVal + "px";
    scopeObj.view.ToolTip.lblNoConcentToolTip.text = info;
    scopeObj.view.ToolTip.lblarrow.skin =  "sknfontIconDescRightArrow14px";
    scopeObj.view.ToolTip.flxToolTipMessage.skin ="sknFlxFFFFFF";
    scopeObj.view.ToolTip.lblNoConcentToolTip.skin = "sknLbl485C75LatoRegular13Px";
    scopeObj.view.ToolTip.setVisibility(true);
    scopeObj.view.forceLayout();
  },
  /*
  * toggles the card to show the list of features container
  * @param: current card widget path, option(1/2)
  */
  toggleCardListVisibility : function(cardWidget,option){
    var custFeatureCards = [];
    if(option === 1){
      var contractFlex = this.view.flxFeaturesByCustomerCont.widgets(); 
      //get array of all card widgets
      for(var i=0;i<contractFlex.length;i++){
        var parentFlxId = contractFlex[i].id.substr(0,2);
        var cardsUnderContract = contractFlex[i][parentFlxId+"flxFeatureCardsContainer"].widgets();
        custFeatureCards = custFeatureCards.concat(cardsUnderContract);
      }
    } else{
      custFeatureCards = this.view.flxAccountFeaturesCardList.widgets();
    }
    
    for(var j=0; j<custFeatureCards.length; j++){
      if(custFeatureCards[j].id === cardWidget.id){
        var visibilityCheck = cardWidget.flxCardBottomContainer.isVisible;
        cardWidget.toggleCollapseArrow(!visibilityCheck);
        if(this.AccountLevelFeaturesTab){
        //collapses segment section inside the card
        var segData = cardWidget.segAccountFeatures.data;
        for(var k=0;k< segData.length;k++){
          if(segData[k][0].lblArrow.skin !== "sknfontIconDescRightArrow14px"){
            segData[k][0].flxViewLimitsHeader.isVisible = false;
            segData[k][0].lblLimitsSeperator3.isVisible = false;
            segData[k][0].lblArrow.text = "\ue922";
            segData[k][0].lblArrow.skin = "sknfontIconDescRightArrow14px";
            segData[k][1] = this.showHideSegRowFlex(segData[k][1],false);
          }
        }
        cardWidget.segAccountFeatures.setData(segData);
        }else{
          if(cardWidget.segAccountFeatures.data.length>0)
          cardWidget.segAccountFeatures.setVisibility(!cardWidget.segAccountFeatures.isVisible);
          else{
            cardWidget.lblNoFilterResults.text="There are no monetary features selected for this customer";
            cardWidget.flxNoFilterResults.setVisibility(!cardWidget.flxNoFilterResults.isVisible);
            cardWidget.segAccountFeatures.setVisibility(false);
          }
            
          this.view.forceLayout();
        }
      }
      else{
        this.view[custFeatureCards[j].id].toggleCollapseArrow(false);
      }
    }
  },
  /*
  * expand/collapse the rows under a section
  * @param: segment widget path, event
  */
  toggleSegmentSectionArrow : function(segmentWidgetPath,event){
    var segData = segmentWidgetPath.data;
    var selectedSecInd = event.rowContext.sectionIndex;
    //update remaining sections
    for(var i=0;i< segData.length;i++){
      segData[i][0].lblFASeperator3.isVisible = false;
      if(selectedSecInd !== i){
        segData[i][0].flxViewActionHeader.isVisible = false;
        segData[i][0].lblArrow.text = "\ue922";
        segData[i][0].lblArrow.skin = "sknfontIconDescRightArrow14px";
        segData[i][1] = this.showHideSegRowFlex(segData[i][1],false);
      }
    }
    //update selected section
    if(segData[selectedSecInd][1][0].isRowVisible === false){
      segData[selectedSecInd][0].flxViewActionHeader.isVisible = true;
      segData[selectedSecInd][0].lblArrow.text = "\ue915";
      segData[selectedSecInd][0].lblArrow.skin = "sknfontIconDescDownArrow12px";
      segData[selectedSecInd][1] = this.showHideSegRowFlex(segData[selectedSecInd][1],true);
      if(selectedSecInd < (segData.length-1)){
        segData[selectedSecInd+1][0].lblFASeperator3.isVisible = true;
      }
    } else{
      segData[selectedSecInd][0].flxViewActionHeader.isVisible = false;
      segData[selectedSecInd][0].lblArrow.text = "\ue922";
      segData[selectedSecInd][0].lblArrow.skin = "sknfontIconDescRightArrow14px";
      segData[selectedSecInd][1] = this.showHideSegRowFlex(segData[selectedSecInd][1],false);
      if(selectedSecInd < (segData.length-1)){
        segData[selectedSecInd+1][0].lblFASeperator3.isVisible = false;
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
      if(rowsData[i].flxContractsFABodyView){
        rowsData[i].isRowVisible =visibility;
        rowsData[i].flxContractsFABodyView.isVisible = visibility;
      }else if(rowsData[i].flxContractsLimitsBodyView){
        rowsData[i].flxContractsLimitsBodyView.isVisible = visibility;
      }
    }
    return rowsData;
  },
  /*
  * create feature cards for customer at acount level
  */
  createAccountFeatureCards : function(accounts, coreCustomer){
    this.view.flxAccountFeaturesCardList.removeAll();
    var i = 0;
    if(accounts.length>0){
      this.view.rtxMsgNoAccLimits.setVisibility(false);
      this.view.flxAccountFeaturesCardList.setVisibility(true);
      for(var a=0;a<accounts.length;a++){

        var num = i>10 ? ""+i : "0"+i;
        var featureCardToAdd = new com.adminConsole.contracts.accountsFeaturesCard({
          "id": "featureAccCard" +num,
          "isVisible": true,
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "width":"100%",
          "top": "15dp"
        }, {}, {});
        featureCardToAdd.isVisible = true;
        featureCardToAdd.showThreeColumns();
        //hide edit button if customer is not accessible for current logged in user
        var custBasicInfo = this.presenter.getCurrentCustomerDetails();
        featureCardToAdd.btnEdit.isVisible = custBasicInfo.isCustomerAccessiable === true ? true : false;
        
        this.setDataActionsForAccFeatureCard(featureCardToAdd  , accounts[a], coreCustomer);
        this.view.flxAccountFeaturesCardList.add(featureCardToAdd);
        i++;
      }
    }else{
      this.view.rtxMsgNoAccLimits.setVisibility(true);
      this.view.flxAccountFeaturesCardList.setVisibility(false);
    }
    this.view.forceLayout();
  },
  /*
  * assign data and actions for a feature card at account level
  * @param: cust feature card path, data to set, coreCustomer details
  */
  setDataActionsForAccFeatureCard : function(featureCard,account, coreCustomer){
    var self=this;
    featureCard.flxDynamicWidgetsContainer.isVisible = false;
    featureCard.flxHeadingRightContainer.isVisible = true;
    featureCard.btnView.isVisible = false;
    featureCard.lblName.skin = "sknLbl192B45LatoRegular14px";
    featureCard.lblName.text = "Account Number:"+account.accountNumber;
    featureCard.lblHeading1.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTTYPE");
    featureCard.lblData1.text = account.accountType;

    featureCard.lblHeading2.text = kony.i18n.getLocalizedString("i18n.frmCompanies.ACCOUNTNAME");
    featureCard.lblData2.text = account.accountName;

    featureCard.lblHeading3.text = kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.OWNERSHIP_TYPE");
    featureCard.lblData3.text = account.ownerType?account.ownerType:"N/A";
    featureCard.lblHeading.text = kony.i18n.getLocalizedString("i18n.frmServiceManagement.Limits");
    featureCard.lblCount.text = "";
    featureCard.flxArrow.onClick = this.toggleCardListVisibility.bind(this,featureCard,2);
    featureCard.btnEdit.onClick = function(){
      self.editLimitsOnClick(featureCard,true, coreCustomer);
    };
    featureCard.toggleCollapseArrow(false);
    var features=this.getFeatureBasedActions(account.featurePermissions);
    this.setAccLevelLimitsCardSegmentData(featureCard.segAccountFeatures , features);
    
  },
  /*
  * show popup for role related details
  */
  showRoleDetailsPopup : function(features){
    this.view.flxRoleDetailsPopup.setVisibility(true);
    this.view.flxRoleFeaturesList.removeAll();
    for (var i = 0; i < features.length; i++) {
      var num = i>10 ? ""+i : "0"+i;
      var featureCardToAdd = new com.adminConsole.customerRoles.ViewRoleFeaturesActions({
        "id": "featureActionCard" +num,
        "isVisible": true,
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "width":"100%",
        "top": "15dp"
      }, {}, {});
      featureCardToAdd.isVisible = true;
      featureCardToAdd.lblActionStatus.isVisible = true;
      let feature = features[i];
      featureCardToAdd.lblFeatureName.text= feature.name;
      featureCardToAdd.statusIcon.skin = ("SID_FEATURE_ACTIVE"===feature.status) ?"sknFontIconActivate":"sknfontIconInactive";
      featureCardToAdd.statusValue.text= ("SID_FEATURE_ACTIVE"===feature.status) ? kony.i18n.getLocalizedString("i18n.secureimage.Active"):kony.i18n.getLocalizedString("i18n.secureimage.Inactive");
      this.setActionSegCard(featureCardToAdd , feature.actions);
      this.view.flxRoleFeaturesList.add(featureCardToAdd);
    }
    this.view.forceLayout();
  },
  /*
  * set actions data for every feature in role details popup
  * @param: feature card widget path
  */
  setActionSegCard : function(featureCard , actions){
    var self = this;
    var actionsList = [{"name":"View Payments","description":"Ability to view the list of all transactions made to own accounts within the same FI","status":"SID_ACTIVE"},
                      {"name":"Create/Edit One-Time Payments","description":"Handle your business payables efficiently","status":"SID_ACTIVE"}]
    var widgetMap = {
      "flxRoleDetailsActions":"flxRoleDetailsActions",
      "lblActionName":"lblActionName",
      "lblActionDescription":"lblActionDescription",
      "lblIconStatus":"lblIconStatus",
      "lbActionStatus":"lbActionStatus",
      "flxStatus":"flxStatus"
    };
    var actionSegData = actions.map(function(rec){
      return {
        "lblActionName": rec.name,
        "lblActionDescription": {"text":rec.description,
                                 "width":"42%"},
        "lblIconStatus": {"skin": rec.actionStatus==='SID_ACTION_ACTIVE' ?
                          "sknFontIconActivate":"sknfontIconInactive"},
        "lbActionStatus": {"text": rec.actionStatus==='SID_ACTION_ACTIVE' ?
                           kony.i18n.getLocalizedString("i18n.secureimage.Active"):kony.i18n.getLocalizedString("i18n.secureimage.Inactive")},
        "flxStatus":{"isVisible":true},
        "template":"flxRoleDetailsActions",
      };
    });
    featureCard.SegActions.widgetDataMap = widgetMap;
    featureCard.SegActions.setData(actionSegData);
    this.view.forceLayout();
  },
  updatedEntitlementCollection: function (a1, a2) {
    return a1.filter(function (x) {
      var result = false;
      if (a2.indexOf(x) < 0) result = true;
      return result;
    });
  },
  /*
  * append more features data when scroll reaches to end for retail customer
  */
  appendMoreRecordsReachingEnd: function(context){
    var self = this ;
    if(Math.ceil(context.currentTarget.offsetHeight) + Math.ceil(context.currentTarget.scrollTop) === Math.ceil(context.currentTarget.scrollHeight)){
      var featuresToAppend;
      if(self.selectedTab === 1){
        var selectedInd = self.view.segRolesSubTabs.selectedRowIndex ? self.view.segRolesSubTabs.selectedRowIndex[1] : 0;
        featuresToAppend = self.view.segRolesSubTabs.data.length > 0 ? self.view.segRolesSubTabs.data[selectedInd].info : [];
        featuresToAppend = this.getAssignedFeaturesFromAllFeatures(featuresToAppend);
        if(self.loadMoreModel.PAGE_OFFSET < featuresToAppend.length){
          kony.adminConsole.utils.showProgressBar(this.view);
          self.createFeaturesRowForData(featuresToAppend.slice(self.loadMoreModel.PAGE_OFFSET,self.loadMoreModel.PAGE_OFFSET + self.recordsSize));
          self.loadMoreModel.PAGE_OFFSET = self.loadMoreModel.PAGE_OFFSET + self.recordsSize; 
        } 
      }else if(self.selectedTab === 2 && (self.view.flxOtherAddtionalFeaturesActionsContainer.isVisible === true)){
        featuresToAppend = self.otherFeaturesActions;
        var filteredFeaturesToAppend = this.getAssignedFeaturesFromAllFeatures(featuresToAppend);
        if(self.loadMoreModel.PAGE_OFFSET < filteredFeaturesToAppend.length){
          kony.adminConsole.utils.showProgressBar(this.view);
          self.createAdditionalFeaturesRow(filteredFeaturesToAppend.slice(self.loadMoreModel.PAGE_OFFSET,self.loadMoreModel.PAGE_OFFSET + self.recordsSize));
          self.loadMoreModel.PAGE_OFFSET = self.loadMoreModel.PAGE_OFFSET + self.recordsSize; 
        } 
      }
      
    }
  },
  /*
  * navigate to enroll form to edit the customers
  * @param: accountsFeaturesCard path,isccLevel(true/false), core customer details
  */
  editLimitsOnClick : function(accountsFeaturesCard,isAccountLevel, coreCustDetails){
    var customerDetails = this.presenter.getCurrentCustomerDetails();
    var input = {"id":customerDetails.Customer_id};
    var customerData = {"custId": coreCustDetails.coreCustomerId,
                        "taxId": coreCustDetails.taxId || kony.i18n.getLocalizedString("i18n.common.NA"),
                        "address": this.AdminConsoleCommonUtils.getAddressText(coreCustDetails.cityName,coreCustDetails.country)};
    var navigationParam = {"formName":"frmCustomerProfileLimits",
                           "isEnrollEditUser" : true,
                           "tabName":"LIMITS",
                           "data": customerData,
                           "isAccountLevel":isAccountLevel};
    this.presenter.getInfinityUserAllDetails(input,navigationParam);
  },
  showNoLimitsScreen : function(){
    this.view.flxFeaturesSearchContainer.setVisibility(false);
    var custStatus=this.presenter.getCurrentCustomerDetails().CustomerStatus_id;
    var isAssociated=this.presenter.getCurrentCustomerDetails().isAssociated;
    if(custStatus==="SID_CUS_SUSPENDED"&&isAssociated==="false"){
      this.view.rtxMsgNoLimits.text=kony.i18n.getLocalizedString("i18n.customerProfileContracts.noContractsMsg");
    }else
      this.view.rtxMsgNoLimits.text="There are no monetary features selected.";
    this.view.rtxMsgNoLimits.setVisibility(true);
    this.view.flxFeaturesByCustomerCont.setVisibility(false);
    this.view.forceLayout();
  }
});