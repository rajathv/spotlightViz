define({ 

  //Type your controller code here 
  nationalId:"",
  auditLogData:[],
  fromDate:"",
  toDate:"",
  customerList:[],

  willUpdateUI : function(viewModel){
    this.updateLeftMenu(viewModel);
  },

  onPreShow: function(){
    this.view.forceLayout();

    let mydate = new Date();
    let currDate =[mydate.getDate(), mydate.getMonth() + 1, mydate.getFullYear(), 
                   mydate.getHours(), mydate.getMinutes(), mydate.getSeconds()];

    kony.print(currDate);
    this.view.calToDate.validEndDate = currDate;
    this.view.calToDate.dateComponents = currDate;

    let prevDate = new Date(new Date().setDate(new Date().getDate()-5));
    let fromDate =[prevDate.getDate(), prevDate.getMonth() + 1, prevDate.getFullYear(), 
                   prevDate.getHours(), prevDate.getMinutes(), prevDate.getSeconds()];

    kony.print("fromDate " + prevDate);
    this.view.calFromDate.validEndDate = currDate;
    this.view.calFromDate.dateComponents = fromDate;

    this.view.btnSearch.onClick = this.onSearchClick;
    this.view.btnOk.onClick = this.onClickOK;

    this.view.flxCus.setVisibility(false);
    this.view.flxShowAuditMess.setVisibility(false);

    this.view.lblSearchChannel.text = "";
    this.view.lblSearchChannel.setVisibility(false);


    /*
    this.view.tbSearch.text = "";
    this.view.flxCustomerDetail.setVisibility(false);
    this.view.flxCus.setVisibility(false);
    this.view.flxService.setVisibility(false);
    this.view.flxServiceGrid.setVisibility(false);
    this.view.flxShowAuditMess.setVisibility(false);

    this.view.btnSearch.onClick = this.onClickSearch;
    this.view.btnAuditLogs.onClick = this.onClickAudit;


    kony.print("USERID = " + kony.mvc.MDAApplication.getSharedInstance().appContext.userName);

    this.view.dropdownMainHeader.lblUserName.text = kony.mvc.MDAApplication.getSharedInstance().appContext.userName;*/


    // this.view.dgService.removeAll();
  },

  onSearchClick: function(){
    this.view.flxCus.setVisibility(false);
    this.view.lblSearchChannel.setVisibility(false);
    let txtSearch = this.view.tbSearch.text;
    if(txtSearch.length != 0 && txtSearch != null && txtSearch != ""){
      this.view.lblSearchChannel.text = "Search by Id";
      this.searchThroughNationalId(txtSearch);
    }else{
      this.view.lblSearchChannel.text = "Search by Date";

      let fromDate = this.fromDateSelection();
      let toDate = this.toDateSelection();
      this.searchThorughDateRange(fromDate, toDate);
    }


  },

  fromDateSelection:function(){
    let fromDay = this.view.calFromDate.day;
    let fromMonth = this.view.calFromDate.month;
    let fromYear = this.view.calFromDate.year;

    kony.print("FRom Selected date = " + fromDay + "-"+ fromMonth+"-"+fromYear);

    return fromYear + "-"+ fromMonth+"-"+fromDay+ " " + "00:00:00";
  },

  toDateSelection:function(){
    let toDay = this.view.calToDate.day;
    let toMonth = this.view.calToDate.month;
    let toYear = this.view.calToDate.year;

    kony.print("To Selected date = " + toDay + "-"+ toMonth+"-"+toYear);

    return toYear + "-"+ toMonth+"-"+toDay + " " + "00:00:00";
  },





  onClickOK: function(){
    this.view.flxShowAuditMess.setVisibility(false);
  },

  searchThorughDateRange: function(fromDate, toDate){
    var self = this;
    try{
      this.view.flxLoading.setVisibility(true);
      let serviceName = "Spotlight_CRUD";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "dbxdb_sp_get_all_specific_customer_range";
      let data= {"frmDate": fromDate,
                 "toDate": toDate};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccessRangeCB, this.operationFailureRangeCB);
    }catch(exception ){
      alert("searchThorughDateRange exception occured "+exception);
    }

  },

  operationSuccessRangeCB:  function (res){
    if(res.records.length > 0){
      this.mapCustomerData(res.records);
    }else{
      this.view.flxCus.setVisibility(false);
      this.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
      this.view.toastMessage.lbltoastMessage.text = "No Data Present";
      kony.timer.schedule("mytimer", this.callBackTimer, 3, false);
      this.view.flxToastMessage.setVisibility(true);
    }
    this.view.flxLoading.setVisibility(false);
    this.view.forceLayout();
  },

  operationFailureRangeCB:  function (res){
    this.view.flxCus.setVisibility(false);
    this.view.flxLoading.setVisibility(false);
    this.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
    this.view.toastMessage.lbltoastMessage.text = "Something went wrong";
    kony.timer.schedule("mytimer", this.callBackTimer, 3, false);
    this.view.flxToastMessage.setVisibility(true);
  },


  searchThroughNationalId: function(nationalId){
    var self = this;
    try{
      this.view.flxLoading.setVisibility(true);
      let serviceName = "Spotlight_CRUD";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "dbxdb_sp_get_specific_customer_data";
      let data= {"input": nationalId};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccessCB, this.operationFailureCB);
    }catch(exception ){
      alert("searchThroughNationalId exception occured "+exception);
    }

  },


  operationSuccessCB:  function (res){
    if(res.records.length > 0){
      this.mapCustomerData(res.records);
    }else{
      this.view.flxCus.setVisibility(false);
      this.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
      this.view.toastMessage.lbltoastMessage.text = "No Data Present";
      kony.timer.schedule("mytimer", this.callBackTimer, 3, false);
      this.view.flxToastMessage.setVisibility(true);
    }
    this.view.flxLoading.setVisibility(false);
    this.view.forceLayout();
  },

  operationFailureCB:  function (res){
    this.view.flxCus.setVisibility(false);
    this.view.flxLoading.setVisibility(false);
    this.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
    this.view.toastMessage.lbltoastMessage.text = "Something went wrong";
    kony.timer.schedule("mytimer", this.callBackTimer, 3, false);
    this.view.flxToastMessage.setVisibility(true);
  },

  mapCustomerData: function(resData){
    this.customerList = resData;
    this.view.segCustomerDetails.removeAll();


    let count = 0;
    resData.forEach(data => {
      count = count +1;
      data.count = count;
      data.btnDetailView = {"isVisible": true, "text": "View"};
    });

    this.view.segCustomerDetails.widgetDataMap = {
      "lblSerNum":"count",
      "lblNationalId":"nationalId",
      "lblMobileNumber":"mobile",
      "lblApplicationId": "applicationID",
      "lblScoreCardId": "scoredCardId",
      "btnDetail":"btnDetailView"
    }




    this.view.segCustomerDetails.setData(resData);
    this.view.flxCus.setVisibility(true);
    this.view.lblSearchChannel.setVisibility(true);

    // this.view.flxCustomerDetail.setVisibility(true);
    //  this.view.flxService.setVisibility(true);
  },

  viewMoreDetails: function(rowIndex){
    let nationalId = this.customerList[rowIndex].nationalId;
    this.callAuditLog(nationalId);
  },

  callAuditLog: function(nationalId){
    var self = this;
    try{
      this.view.flxLoading.setVisibility(true);
      let serviceName = "Spotlight_CRUD";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      let operationName =  "dbxlogs_sp_get_specific_customer_auditlogs";
      let data= {"input": nationalId};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccessAuditCB, this.operationFailureAuditCB);
    }catch(exception ){
      alert("exception occured "+exception);
    }
  },


  operationSuccessAuditCB:  function (res){
    if(res.records.length > 0){
      this.mapAuditData(res.records);
    }
    this.view.flxLoading.setVisibility(false);
    this.view.forceLayout();
  },

  operationFailureAuditCB:  function (res){
    this.view.flxLoading.setVisibility(false);
    this.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
    this.view.toastMessage.lbltoastMessage.text = "Something went wrong";
    kony.timer.schedule("mytimer", this.callBackTimer, 3, false);
    this.view.flxToastMessage.setVisibility(true);
  },

  mapAuditData: function(data){

    this.view.dgService.removeAll();
    this.view.dgService.gridHeight = 12;
    let mapData = [];

    for(let i = 0; i < data.length; i++){
      let obj = {};
      obj.col1 = i + "";
      // obj.col2 = data[i].apihost;

      obj.col2 = this.filterServiceName(data[i].apihost);

      obj.col3 = data[i].request_payload.substring(0, 20);
      obj.col4 = data[i].reponse_payload.substring(0, 20);
      obj.col5 = data[i].createdts;

      obj.apihost = data[i].apihost;
      obj.request_payload = data[i].request_payload;
      obj.reponse_payload = data[i].reponse_payload ;
      obj.createdts = data[i].createdts;
      mapData.push(obj);


    }
    this.auditLogData = mapData;
    this.view.dgService.setData(mapData);
    this.view.flxShowAuditMess.setVisibility(true);
  },

  onSelectedCellGrid: function(){
    this.view.tbLog.setEnabled(false);

    let selectedCellIndex = this.view.dgService.selectedCellIndex;
    kony.print("selectedCellIndex = " + JSON.stringify(selectedCellIndex));
    let selectedIndex = this.view.dgService.selectedIndex;
    kony.print("selectedIndex = " + JSON.stringify(selectedIndex));

    let dataObj = this.auditLogData[selectedIndex];
    kony.print("dataObj = " + JSON.stringify(dataObj));
    if (selectedCellIndex[1] == "col2"){
      this.view.lblLogName.text = "Service";

      let data = dataObj.apihost;

      this.view.tbLog.text = data;
    }
    else if(selectedCellIndex[1] == "col3"){
      this.view.lblLogName.text = "Mora Request";

      let data = dataObj.request_payload;
      let obj = JSON.parse(data);
      let prettyObj = JSON.stringify(obj, undefined, 4);
      this.view.tbLog.text = prettyObj;
    }
    else if (selectedCellIndex[1] == "col4"){
      this.view.lblLogName.text = "Third Party Response";

      let data = dataObj.reponse_payload;
      let obj = JSON.parse(data);
      let prettyObj = JSON.stringify(obj, undefined, 4);
      this.view.tbLog.text = prettyObj;
    }
    this.view.forceLayout();

  },


  callBackTimer : function() 
  {
    kony.print("Timer state");
    kony.timer.cancel("mytimer");
    this.view.toastMessage.flxRightImage.setVisibility(true);
    this.view.flxToastMessage.setVisibility(false);
  },

  filterServiceName: function(serviceName){
    let returnName = serviceName;
    if(serviceName == "MSDocumentMora : EmdhaSign"){
      returnName = "Emdha Signing";
    }else if(serviceName == "Scorecard:S1"){
      returnName = "Score Card-1";
    }else if(serviceName == "MoraT24Service : CustomerEmployeeDetails"){
      returnName = "T24-Employee Details";
    }else if(serviceName == "KnockoutService : CalculateScoreCardS2"){
      returnName = "Score Card-2";
    }else if(serviceName == "MoraT24Service : T24CustomerAddressUpdate"){
      returnName = "T24-Customer Address";
    }else if(serviceName == "NafaesRestAPI : TransferOrder"){
      returnName = "Nafaes TO";
    }else if(serviceName == "MoraT24Service : ActivateCustomer"){
      returnName = "T24-Activate Customer";
    }else if(serviceName == "YakeenSoapAPI : getCitizenAddressInfo"){
      returnName = "Yakeen-Customer Address";
    }else if(serviceName == "YAKEEN_TWO"){
      returnName = "Yakeen-Customer Bio";
    }else if(serviceName == "YAKEEN_TWO"){
      returnName = "Yakeen-Customer Bio";
    }else if(serviceName == "SimahService : ConusmerEnquiry"){
      returnName = "Simah-Enquiry";
    }else if(serviceName == "SimahServiceNew : getSalaryCertificate"){
      returnName = "Simah-Salary";
    }else if(serviceName == " MoraT24Service : LoanCreation"){
      returnName = "T24-Loan Creation";
    }


    return returnName;





  }

});