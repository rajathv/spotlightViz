define({  
  selectedFeatureIndex : 0,
  prevSelectedFeature:[],
  groupActionConfig :{
    CREATE:"CREATE",
    EDIT:"EDIT",
    COPY: "COPY"
  },
  contractsView:[],
  signatoryGroupsView:[],
  removeCount : 0,
  recordsSize:5,
  prevIndex : -1,
  allMonActionsList:null,
  customerType :"",
  loadMoreModel:{
    PAGE_OFFSET:0
  },
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
        this.view.tabs.setCustomerProfileTabs(this);
      } else if (context.UpdateDBPUserStatus) {
        this.view.flxGeneralInfoWrapper.setLockStatus(context.UpdateDBPUserStatus.status.toUpperCase(), this);

      } else if (context.StatusGroup) {
        this.view.flxGeneralInfoWrapper.processAndFillStatusForEdit(context.StatusGroup, this);

      } else if (context.CustomerNotes) {
        this.view.Notes.displayNotes(this, context.CustomerNotes);

      } else if (context.OnlineBankingLogin) {
        this.view.CSRAssist.onlineBankingLogin(context.OnlineBankingLogin, this);

      }else if(context.contractsView){
        this.view.lblContractsTitle.text = kony.i18n.getLocalizedString("i18n.frmCustomerProfileFeaturesActions.ListOfContractsCustomersAssociated") +
        ' ' + this.presenter.getCurrentCustomerDetails().Name;
        this.contractsView = context.contractsView;
      this.signatoryGroupsView=context.signatoryGroupsView || [];
        this.showContractsScreen();
      }
      else if(context.userNameRulesPolicy){
        this.view.delinkProfilePopup.setUsernameRules(context.userNameRulesPolicy);
      } 
      else if (context.FeaturesAndActions) {
        this.view.tabs.setSkinForInfoTabs(this.view.tabs.btnTabName4);
        if (context.FeaturesAndActions.target === "InfoScreen") {
          this.showFeaturesAndActionsScreen(context.FeaturesAndActions);
        } 
      } else if(context.featureDetails){
        this.showRoleDetailsPopup(context.featureDetails.features);
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
  CustomerProfileContractsPreshow: function () {
    this.view.tabs.setSkinForInfoTabs(this.view.tabs.btnTabName4);
    this.view.Notes.setDefaultNotesData(this);
    var screenHeight = kony.os.deviceInfo().screenHeight;
    this.view.flxMainContent.height = screenHeight - 115 + "px";
    this.view.flxGeneralInfoWrapper.changeSelectedTabColour(this.view.flxGeneralInfoWrapper.dashboardCommonTab.btnProfile);
    this.view.flxGeneralInfoWrapper.generalInfoHeader.setDefaultHeaderData(this);
    this.view.flxGeneralInfoWrapper.setFlowActionsForGeneralInformationComponent(this);
    this.view.linkProfilesPopup.initializeLinkProfileActions(this);
    this.view.delinkProfilePopup.delinkProfilePreshow(this);
	//hiding the contracts list flex as old data shown until list data is set
    this.view.flxContractsWrapper.setVisibility(false);
    this.setFlowActions();
  },
  unloadOnScrollEvent: function () {
    document.getElementById("frmCustomerProfileEntitlements_flxMainContent").onscroll = function () { };
  },
  filterSearchResults : function(searchTxt){
    searchTxt = searchTxt.toLowerCase();
    return this.contractsView.filter(function(contract){
              // contract name 
              if(contract.contractName.toLowerCase().indexOf(searchTxt)  !=-1){
                return true;
            } 
            // service type
            if(contract.serviceDefinitionType.toLowerCase().indexOf(searchTxt)  !=-1){
                return true;
            }
            // customer name
            // customer id 
            return contract.contractCustomers.some(function(customer){
                if(customer.id.toLowerCase().indexOf(searchTxt)  !=-1 || 
                    customer.name.toLowerCase().indexOf(searchTxt)  !=-1){
                    return true;
                }
            });                              
        }
    );
  },
  setFlowActions: function () {
    var scopeObj = this;
    this.view.searchBoxContracts.flxIconBackground.onClick = function(){
      // if text is empty we won't perform the search
      if(scopeObj.view.searchBoxContracts.tbxSearchBox.text === ""){
          return;
      }  
      scopeObj.isSearchPerformedViewCont = true;
      
      let searchTxt = scopeObj.view.searchBoxContracts.tbxSearchBox.text;
      scopeObj.createCustFeatureCards(scopeObj.filterSearchResults(searchTxt));
      scopeObj.view.forceLayout();
    };
    const searchInternalUsers1 = function() {
      scopeObj.view.searchBoxContracts.flxIconBackground.onClick();
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
    this.view.searchBoxContracts.tbxSearchBox.onKeyUp = function(){
        
        if(scopeObj.view.searchBoxContracts.tbxSearchBox.text === ""){
            scopeObj.view.searchBoxContracts.flxClearSearch.onClick();
          }else{
            scopeObj.view.searchBoxContracts.flxClearSearch.setVisibility(true);
          }
          searchInternalUsersCall();
          scopeObj.view.forceLayout();
    };
    this.view.searchBoxContracts.flxClearSearch.onClick = function(){
        scopeObj.view.searchBoxContracts.tbxSearchBox.text = "";
        scopeObj.view.searchBoxContracts.flxClearSearch.setVisibility(false);
        // resetting the search
        scopeObj.createCustFeatureCards( scopeObj.contractsView);
    }; 
    this.view.popUpConfirmation.btnPopUpCancel.onClick = function(){
      scopeObj.view.flxPopUpConfirmation.setVisibility(false);
    };
    this.view.flxCloseViewContractPopup.onClick = function(){
      scopeObj.view.flxViewContractPopup.setVisibility(false);
    };
    this.view.flxRoleDetailsClose.onClick = function(){
      scopeObj.view.flxRoleDetailsPopup.setVisibility(false);
    };
    this.view.btnContractsEditCust.onClick = function(){
      scopeObj.editContractOnClick(false);
    };
    
    // add customer button action when there are no contracts
    this.view.btnSearchContractCustomers.onClick = function(){
      scopeObj.editContractOnClick(true);
    };
  },
  saveScreenY: function (widget, context) {
    this.mouseYCoordinate = ((context.screenY + this.view.flxMainContent.contentOffsetMeasured.y) - (this.view.breadcrumbs.frame.height + this.view.mainHeader.flxMainHeader.frame.height));
  },
  /*
  * hide widet on hover out for dropdowns
  */
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
  * show the list of contracts
  */
  showContractsScreen : function(){
    var custDetails = this.presenter.getCurrentCustomerDetails();
    //hide edit button if customer is not accessable for current logged in user
    this.view.btnContractsEditCust.setVisibility(custDetails.isCustomerAccessiable === true);
    this.view.searchBoxContracts.tbxSearchBox.text = "";
    if(this.contractsView.length===0){
      this.view.flxNoContractAdded.setVisibility(true);
      this.view.flxContractsWrapper.setVisibility(false);
    }else{
      this.view.flxNoContractAdded.setVisibility(false);
      this.createCustFeatureCards(this.contractsView,this.signatoryGroupsView);
    }
    kony.adminConsole.utils.hideProgressBar(this.view);
  },
  /*
  * create contract cards for customer
  * @param: 
  */
  createCustFeatureCards : function(contracts,signatoryGroups){
    this.view.flxContractCardListContainer.removeAll();
	this.view.flxContractsWrapper.setVisibility(true);
    this.view.rtxMsgProducts.setVisibility(false);
    if(!contracts || contracts.length ==0){
      this.view.rtxMsgProducts.setVisibility(true);
      this.view.forceLayout();
      return;
    }
    for (var i = 0; i < contracts.length; i++) {
      var num = i>10 ? ""+i : "0"+i;
      let contract = contracts[i];
      var contractCardToAdd = new com.adminConsole.contracts.accountsFeaturesCard({
        "id": "contractCard" +num,
        "isVisible": true,
        "masterType": constants.MASTER_TYPE_DEFAULT,
        "width":"100%",
        "top": "15dp"
      }, {}, {});
      contractCardToAdd.isVisible = true;
      this.setDataActionsForContractCard(contractCardToAdd , contract,signatoryGroups);
      this.view.flxContractCardListContainer.add(contractCardToAdd);
    }
    this.view.forceLayout();
  },
  /*
  * set the data and assign actions for the card
  * @param: current card widget path
  */
  setDataActionsForContractCard: function(contractCard , contract,signatoryGroups){
    contractCard.flxDynamicWidgetsContainer.isVisible = false;
    contractCard.lblCount.isVisible = false;
    contractCard.flxContractTag.isVisible = true;
    contractCard.btnViewEdit.isVisible = true;
    contractCard.lblName.skin = "sknLbl192B45LatoRegular14px";
    contractCard.btnViewEdit.text = kony.i18n.getLocalizedString("i18n.frmCustomerProfileFeaturesActions.ViewContract");
    contractCard.flxArrow.onClick = this.toggleCardListVisibility.bind(this,contractCard,this.view.flxContractCardListContainer);
    contractCard.btnViewEdit.onClick = this.showViewContractsPopup.bind(this, contract);
    contractCard.toggleCollapseArrow(false);
    
    contractCard.lblName.text = contract.contractName;
    contractCard.lblHeading.text = kony.i18n.getLocalizedString("i18n.frmGroupsController.Customers");

    contractCard.lblHeading1.text = kony.i18n.getLocalizedString("i18n.frmCompanies.Contract_ID");
    contractCard.lblHeading2.text = kony.i18n.getLocalizedString("i18n.frmCompanies.Service_Type");
    contractCard.lblHeading3.text = kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.Service_UC");
    if (contract.isPrimary === "true") {
        contractCard.flxPrimary.setVisibility(true);
    }
    contractCard.lblData1.text = contract.contractId;
    contractCard.lblData2.text = contract.serviceDefinitionType;
    contractCard.lblData3.text = contract.serviceDefinitionName;
    this.setContractCardSegmentData(contractCard.segAccountFeatures, contract,signatoryGroups);
  },
  /*
  * toggles the card to show the list of customers container
  * @param: current card widget path, parent container widget path
  */
  toggleCardListVisibility : function(cardWidget,parentFlexPath){
    var contractCards = parentFlexPath.widgets();
    
    for(var j=0; j<contractCards.length; j++){
      if(contractCards[j].id === cardWidget.id){
        var visibilityCheck = cardWidget.flxCardBottomContainer.isVisible;
        cardWidget.toggleCollapseArrow(!visibilityCheck);
      } else{
        this.view[contractCards[j].id].toggleCollapseArrow(false);
      }
    }
  },
   /*
  * widget map for customer segments
  * @returns: widget map json
  */
  getWidgetDataMapForCustomers : function(){
    var widgetMap ={
      "lblCustName":"lblCustName",
      "lblCustId":"lblCustId",//SIGNATORY GROUP
      "lblTaxId":"lblTaxId",
      "lblCustAddress":"lblCustAddress",
      "lblCustRole":"lblCustRole",
      "flxStatus":"flxStatus",
      "lblSeperator":"lblSeperator",
      "flxCustMangContracts":"flxCustMangContracts"     
    };
    return widgetMap;
  },
  /*
  * set customers segment data in contract card
  * @param: segment widget path
  */
  setContractCardSegmentData : function(segmentPath , contract,signatoryGroups){
    var self =this;
    var customerData = [
      {"id":"13133","name":"John Doe","taxId":"9662","address":"Bloomington, Unitd States","role":"Full Access"},
      {"id":"45232","name":"George","taxId":"8123","address":"New York","role":"Full Access"},
                       ];
    var segSecData = {
      "lblCustName": {"text":kony.i18n.getLocalizedString("i18n.View.CUSTOMER_UC"),
                           "skin":"sknlblLato696c7311px"},
      "lblCustId":{"text":kony.i18n.getLocalizedString("i18n.Contracts.signatory_groups_UC"),
                        "skin":"sknlblLato696c7311px"},
      "lblTaxId":{"text":kony.i18n.getLocalizedString("i18n.frmEnrollCustomer.TaxId_UC"),
                       "skin":"sknlblLato696c7311px"},
      "lblCustAddress":{"text":kony.i18n.getLocalizedString("i18n.View.ADDRESS"),"skin":"sknlblLato696c7311px"},
      "lblCustRole":{"text":kony.i18n.getLocalizedString("i18n.roles.ROLE"),"skin":"sknlblLato696c7311px" },
      "lblSeperator":{"text":"-","skin":"sknLblSeparator696C73"},    
      "template":"flxCustMangContracts"
    };
    let associatedCustomer = contract.contractCustomers.filter(function(cust){
      return cust.isAssociated === "true";
    });       
    var customerRowsData = associatedCustomer.map(function(rec){     
     var auth = self.checkAuthGroups(rec.id,signatoryGroups); 
      return {
        "lblCustName":{"text":rec.name +" ("+rec.id+")"},
        "lblCustId":{"text":auth},
        "lblTaxId":{"text":rec.taxId},
        "lblCustAddress":{"text":rec.addressLine1+","+rec.addressLine2},
        "lblCustRole":{"text":rec.userRoleName ? rec.userRoleName :"N/A","skin":"sknLblLato13px117eb0Cursor",
                       "onClick": ()=>{
                          if(rec.userRole){
                            self.view.lblRoleDetailsHeader1.text = rec.userRoleName ? rec.userRoleName: "N/A" ;
                            self.view.lblRoleDescriptionValue.text = rec.userRoleDescription ?rec.userRoleDescription  : "N/A" ;
                           self.presenter.getGroupFeaturesAndActions(rec.userRole , 'frmCustomerProfileContracts');
                          }
                        }
                      },
        "lblSeperator":"-",
        "template":"flxCustMangContracts",
      };
    });
    segmentPath.widgetDataMap = this.getWidgetDataMapForCustomers();
    segmentPath.setData([[segSecData,customerRowsData]]);
    this.view.forceLayout();
  },
  /*
  * to check if the Signatory Group Name is present or not
  */
     checkAuthGroups: function(rec, signatoryGroups) {    
     
        var authSignatory = "N/A";
	for(var x = 0; x<signatoryGroups.length; x++)
       {
          if (signatoryGroups[x].coreCustomerId === rec)
            {
                for( var i =0 ;i<signatoryGroups[x].groups.length;i++)
                {
                    if(signatoryGroups[x].groups[i].isAssociated===true)
                        {
                               authSignatory= signatoryGroups[x].groups[i].signatoryGroupName;
                        return authSignatory;
                        }
                }               
            
       }}
  return authSignatory;
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
  /*
  * show contract details popup on click of view contract button
  */
  showViewContractsPopup : function(contract){
    this.view.flxViewContractPopup.setVisibility(true);
    var widgetMap = {
      "flxCheckbox":"flxCheckbox",
      "lblContractName":"lblContractName",
      "lblContractId":"lblContractId",
      "lblContractAddress":"lblContractAddress",
      "lblSeperator":"lblSeperator",
      "flxEnrollCustomerContractList":"flxEnrollCustomerContractList"
    };
    this.view.viewContractCard.segRelatedContractsList.widgetDataMap = widgetMap;
    this.view.viewContractCard.lblContractName.text = contract.contractName +" ("+ contract.contractId+")";
    this.view.viewContractCard.flxArrow.onClick = function(){
      let check = this.view.viewContractCard.flxBottomContainer.isVisible;
      this.view.viewContractCard.flxBottomContainer.isVisible =  !check;
      this.view.viewContractCard.lblArrow.text = !check ? "\ue915":"\ue922";
      // ue915 is the down arrow
    }.bind(this);
    this.setViewContractPopupSegData(contract.contractCustomers);
  },
  /*
  * set customer list in view contract popup
  */
  setViewContractPopupSegData : function(customersList){
    var segData = customersList.map(function(rec){
      return{
        "flxCheckbox":{"isVisible":false},
        "lblContractName":{"text": rec.name},
        "lblContractId": {"text":rec.id},
        "lblContractAddress": {"text":rec.addressLine1 +','+rec.addressLine2},
        "lblSeperator":"-",
        "template":"flxEnrollCustomerContractList"
      }
    });
    this.view.viewContractCard.segRelatedContractsList.setData(segData);
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
  * create rows dynamically for given additional features
  * @param: additional features list
  */
  createAdditionalFeaturesRow : function(addFeatures){
    var flag = false;
    var c = this.loadMoreModel.PAGE_OFFSET;
    for (var i = 0; i < addFeatures.length; i++) {
      if(addFeatures[i].isAssigned && (addFeatures[i].isAssigned === "1")){
        flag=true;
        var collapsibleSegmentToAdd = new com.adminConsole.customerRoles.collapsibleSegment({
          "id": "additionalFeatureRow" + c,
          "isVisible": true,
          "width": "100%",
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "top": "20px"
        }, {}, {});
        this.view.flxOtherAddtionalFeaturesActions.add(collapsibleSegmentToAdd);
      }
      c=c+1;
    }
    if(i === addFeatures.length)
        kony.adminConsole.utils.hideProgressBar(this.view);
    if(flag === false && (this.loadMoreModel.PAGE_OFFSET === 0)){
      this.view.flxOtherAddtionalFeaturesActionsContainer.setVisibility(false);
      this.view.flxNoFeaturesActionsCont.setVisibility(true);
    }else if (flag === true && (this.loadMoreModel.PAGE_OFFSET === 0)){
      this.view.flxOtherAddtionalFeaturesActionsContainer.setVisibility(true);
      this.view.flxNoFeaturesActionsCont.setVisibility(false);
    }
    
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
  */
  editContractOnClick : function(isSuspendedUser){
    var customerDetails = this.presenter.getCurrentCustomerDetails();
    var input = {"id":customerDetails.Customer_id};
    var navigationParam = {"formName":"frmCustomerProfileContracts",
                           "isEnrollEditUser" : false,
                           "tabName":"CONTRACTS"};
    this.presenter.getInfinityUserAllDetails(input,navigationParam,isSuspendedUser);
  },
});