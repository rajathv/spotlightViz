define({
  servData :"",
  willUpdateUI : function(viewModel){
    this.updateLeftMenu(viewModel);
  },
  onPreShowCall: function () {
    try{
      this.view.dropdownMainHeader.lblUserName.text = kony.mvc.MDAApplication.getSharedInstance().appContext.userName;


      var self = this;
      self.view.segLoanDetails.onRowClick= this.onRowClickCallBck.bind(this);
      self.view.flxCustomerDetails.setVisibility(false);
      self.view.flxLoading.setVisibility(true);
      self.view.flxClose.onClick  = () => {
        self.view.flxCustomerDetails.setVisibility(false);
      };
      self.view.imgApprove.onTouchStart = () => {
        if(self.view.imgApprove.src === "checkboxnormal.png") {
          self.view.imgApprove.src = "checkboxselected.png";
          self.view.btnCusApr.setVisibility(true);
        } else {
          self.view.imgApprove.src = "checkboxnormal.png";
          self.view.btnCusApr.setVisibility(false);
        }
        self.view.forceLayout();
      };
      serviceName = "CustomerAgentDBService";
      integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      operationName =  "dbxdb_customer_loan_view_get";
      data= {};
      headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess, this.operationFailure);
    }catch(exception ){
      alert("exception occured "+exception);
    }
  },
  operationSuccess:  function (res){
    var self =this;
    kony.print("Data from the service ========>>>>> " + JSON.stringify(res));
    self.servData = res.customer_loan_view;
    if(self.servData.length > 0){
      self.addSegData();
      self.view.flxLoading.setVisibility(false);
    }else{
      //       self.view.flxUsersContainer.isVisible = false;
      self.noDataPresent();
    }
    this.view.forceLayout();
  },

  noDataPresent: function(){
    this.view.flxSegContainer.setVisibility(false);
    this.view.flxLoading.setVisibility(false);
    this.view.flxNoUserData.setVisibility(true);

  },

  onRowClickCallBck :function (segment, dataIndex, rowIndex) 
  {
    try {
      this.view.tbFeedback.text = "";
      var self = this;
      var item = segment.data[rowIndex];
      var natIdSelected =  item.customer_Username;
      var appId =  item.application_id;
      self.showCustomerDetails(item);
    } catch(e) {
      kony.print("onRowClickCallBck,frmCSAPortal"+e);
    }
  },

  showCustomerDetails : function(data){
    try{
      var self = this;
      //customer details
      self.view.flxCustomerDetails.setVisibility(true);
      self.view.lblCustomerName.text  = data.customer_Name;
      self.view.lblNationalId.text = data.customer_Username;
      self.view.lblCusPhoneValue.text = data.mobile;
      self.view.lblDOBVal.text = data.customer_DateOfBirth;
      self.view.lblCusGenderVal.text =data.customer_Gender;
      self.view.lblCusArName.text = data.customer_arName;
      self.view.lblIbanNumberValue.text = data.ibanNumber;
      self.view.lblZipValue.text  =data.zipcode;
      self.view.lblcityVal.text = data.city,
        self.view.lblAddressValue.text = data.addressLine1 + data.addressLine2;
      self.view.lblEmpNAmeVal.text = data.agencyName;
      self.view.lblAgencyNameVal.text = data.agencyName;
      self.view.lblSalAmountVal.text = data.salary;
      self.view.lblStartDateVal.text = data.startDate;
      self.view.imgPdfIban.onTouchStart = () =>{

        self.openPdfFile(data.ibanNumber);
        self.view.toastMessage.flxRightImage.setVisibility(false);
        self.view.toastMessage.lbltoastMessage.text = "Fetching Iban.";
        kony.timer.schedule("mytimer", self.callBackTimer, 2, false);
        self.view.flxToastMessage.setVisibility(true);

      };
      //loan details
      self.view.lblOfferAmount.text = data.loan_amount;
      self.view.lblTenorvalue.text = data.tenor;
      self.view.lblLoanRate.text = data.approx;
      self.view.lblProdName.text = data.product_name;

      if(!data.sanadApproval){
        self.view.lblSanadStatus.text = "Sanad waiting approval";
        self.view.lblSanadStatus.skin = "sknlbl13latoRegularB2BDCBRed";
      }else{
        self.view.lblSanadStatus.text = "Sanad approved";
        self.view.lblSanadStatus.skin = "sknlbl13latoRegularB2BDCBGreen";
      }
      self.view.btnCusApr.onClick =()=> {
        this.approveRecord( data.aid,data.application_id);
      };
      self.view.btnCusCancel.onClick =()=> {
        this.rejectRecord( data.aid,data.application_id);
      };
      
      //
      self.view.btnCusApr.setVisibility(false);
      self.view.imgApprove.src = "checkboxnormal.png";
    }catch(e){
      kony.print("Error in showcustomer details "+e);
    }

  },

  openPdfFile : function(ibanNumber){
    try{
      this.view.flxLoading.setVisibility(true);
      serviceName = "CustomerAgentDBService";
      integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      operationName =  "dbxdb_document_storage_get";
      data= {
        "$filter": "iban_number eq "+ibanNumber,
      };
      headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.fetchIbanoperationSuccess, this.fetchIbanoperationFailure);
    }catch(e){
      kony.print("Exception in get iban file::::" +e);
    }

    this.view.forceLayout();

  },

  fetchIbanoperationSuccess: function(res){
    try{
      var self = this;
      this.view.flxLoading.setVisibility(false);
      if(res.document_storage.length >0){
        var data = res.document_storage[0];
        let pdfBase64 = data['iban_contract'];

        if(pdfBase64 != undefined && pdfBase64 != null){

          if(this.hasWhiteSpace(pdfBase64)){
            pdfBase64 = pdfBase64.replace(/ /g,"+");
          }

          if(pdfBase64.startsWith("/")){
            let imgWindow = window.open("");
            imgWindow.document.write('<iframe src="' + "data:image/gif;base64," + pdfBase64 + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');


            imgWindow.document.close();

          }else{
            let pdfWindow = window.open("");
            //    pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, "
            //                         + pdfBase64+"'></iframe>");

            var file = 'data:application/pdf;base64,' + pdfBase64;
            pdfWindow.document.write("<html><head><title>IBAN Contract</title></head><body>"
                                     + '<embed width="100%" height="100%" name="plugin" src="'+ file + '" '
                                     + 'type="application/pdf" internalinstanceid="21"></body></html>');
            pdfWindow.document.close();
          }
        }else{
          this.view.toastMessage.lbltoastMessage.text = "No Iban Document found";
          kony.timer.schedule("mytimer", self.callBackTimer, 4, false);
          this.view.flxToastMessage.setVisibility(true);
        }

      }



    }catch (e){
      kony.print("Error in PDf Show = " + e);
    }


  },

  fetchIbanoperationFailure: function(){
    this.view.flxLoading.setVisibility(false);
    alert("failed to fetch iban");
  },

  approveRecord : function(natid, appid){
    let feedback = this.view.tbFeedback.text;
    var self = this;
    self.view.flxLoading.setVisibility(true);
    alert("You are approving Application:"+appid);
    serviceName = "CustomerAgentDBService";
    integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
    operationName =  "csaApprovalUpdate";
    data= {
      "id":natid,
      "applicationStatus":"SID_PRO_ACTIVE",
      "csaApporval":"1",
      "feedback":feedback,
    };
    headers= {};
    integrationObj.invokeOperation(operationName, headers, data, this.operationSuccessApr, this.operationFailureApr);

  },
  operationSuccessApr: function(){
    var self = this;
    self.view.toastMessage.lbltoastMessage.text = "Loan Approved Successfully.";
    kony.timer.schedule("mytimer", self.callBackTimer, 10, false);
    self.view.flxToastMessage.setVisibility(true);

    self.view.flxLoading.setVisibility(false);
    self.view.flxCustomerDetails.setVisibility(false);
    this.onPreShowCall();
  },
  operationFailureApr:function(){

  },
  rejectRecord : function(natid, appid){
    let feedback = this.view.tbFeedback.text;
    alert("You are rejecting Application:"+appid);
    serviceName = "CustomerAgentDBService";
    integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
    operationName =  "csaApprovalUpdate";
    data= {
      "id":natid,
      "applicationStatus":"CSA_SUSPENDED",
      "csaApporval":"0",
      "feedback":feedback,
    };
    headers= {};
    integrationObj.invokeOperation(operationName, headers, data, this.operationSuccessRej, this.operationFailureRej);
  },
  callBackTimer : function() 
  {
    kony.timer.cancel("mytimer");
    this.view.toastMessage.flxRightImage.setVisibility(true);
    this.view.flxToastMessage.setVisibility(false);
  },
  operationSuccessRej:function(){
    var self = this;
    alert("Application suspended");
    this.view.flxCustomerDetails.setVisibility(false);
    this.onPreShowCall();
  },
  addSegData: function(){

    this.view.flxSegContainer.setVisibility(true);
    this.view.segLoanDetails.removeAll();
    var i =0;
    this.servData = this.removeRedundantData(this.servData);
    this.servData.forEach(data => {
      i=i+1;
      data.seqId =i;
      if(data.loan_status === "SID_PRO_ACTIVE"){
        data.loanStatus = "Pending";
      }
      else{
        data.loanStatus = "Approved";
      }
    });
    kony.print("service data for segment: " + JSON.stringify(this.servData));

    this.view.segLoanDetails.widgetDataMap = {
      "lblAppId":"seqId",
      "lblDateTime":"date",
      "lblNationalId":"customer_Username",
      "lblName":"customer_arName",
      "lblDOB": "mobile",
      "lblStatus" : "application_id",
    };

    this.view.segLoanDetails.setData(this.servData);
  },
  operationFailure:  function (res){
    var self = this;

    self.view.flxSegContainer.setVisibility(false);
    self.view.flxNoUserData.isVisible = true;
    self.view.flxLoading.setVisibility(false);
  },

  removeRedundantData: function(arr){
    var uniqueArray = [];
    var uniqueJson = {};
    for(i=0;i<arr.length;i++)
    {
      if(!uniqueArray.find(x => x.application_id === arr[i].application_id))
      {
        uniqueArray.push(arr[i]);
      }
    }

    return uniqueArray;
  },

  hasWhiteSpace:function(s) {
    return /\s/g.test(s);
  }
});
