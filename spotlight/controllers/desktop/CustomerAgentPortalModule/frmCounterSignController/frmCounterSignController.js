define({ 
  documentData:"",
  approveLst:"",
  otpVerify:"",

  willUpdateUI : function(viewModel){
    this.updateLeftMenu(viewModel);
  },

  onPreShow: function(){
    this.view.forceLayout();
    kony.print("onPreShow = ");
    this.getAllNonSignedDocuments();

    this.view.flxNoUserData.setVisibility(false);
    this.view.flxContent.setVisibility(true);
    this.view.btnApprove.setVisibility(true);
    this.view.btnCancel.setVisibility(true);
    this.view.lblwarning.setVisibility(false);



    this.view.segApproval.onRowClick = this.onSelectedRowItem;
    this.view.btnApprove.onClick = this.onApproveBtnClick;
    this.view.btnCancel.onClick = this.onCancelBtnClick;



    this.view.flxPopupOtp.setVisibility(false);
    this.view.lblOTPwarning.text = "* Please enter correct OTP";
    this.view.tbOtp.text = "";
    this.view.btnOtpCancel.onClick = this.onCancelOtpPopup;
    this.view.btnOtpSubmit.onClick = this.otpSubmit;

    this.view.dropdownMainHeader.lblUserName.text = kony.mvc.MDAApplication.getSharedInstance().appContext.userName;

    this.view.forceLayout();

  },

  setSegData: function(resData){
    this.documentData = resData;
    this.view.segApproval.removeAll();
    let count = 0;
    resData.forEach(data => {
      count = count +1;
      data.count = count;
      data.btnPdfVisi = {"isVisible": true, "text": "View"};
      //data.loanContract = data.loan_contract;
      if(data.iban_number == undefined || data.iban_number == null || data.iban_number == "")
        data.iban_number = "           ";
      data.toggleImg = "circle.png"
    });

    /*   for(let index = 0; i < resData.length; index++){
      count = count +1;
      resData[index].count = count;
      resData[index].btnPdfVisi = {"isVisible": true, "text": "View"};
      resData[index].loanContract = resData[index].loan_contract;
      resData[index].iban_number = "1234567891011";
      resData[index].toggleImg = "circle.png"
    }*/
    this.view.segApproval.widgetDataMap = {
      "lblSerNum":"count",
      "lblApplicationId":"application_id",
      "lblNationalId":"national_id",
      "lblMobileNumber":"mobile_number",
      "lblIban": "createdts",
      "btnShowPdf": "btnPdfVisi",
      "imgCheck":"toggleImg",
    };

    this.view.segApproval.setData(resData);
  },

  onSelectedRowItem: function(){
    let selectedRowItems = this.view.segApproval.selectedRowItems;
    if(selectedRowItems.length > 10){
      this.view.lblwarning.setVisibility(true);
    }else{
      this.view.lblwarning.setVisibility(false);
    }
  },

  onApproveBtnClick: function(){
    try{
      var self = this;

      this.approveLst = this.view.segApproval.selectedRowItems;

      let userID = kony.mvc.MDAApplication.getSharedInstance().appContext.userID;


      if(this.approveLst.length < 10){
        kony.print("finalList = " + JSON.stringify(this.approveLst));
        kony.adminConsole.utils.showProgressBar(this.view);
        //send OTP
        this.otpVerify = "";
        let data = this.presenter.sendOTPReq(
          function(success){
            kony.print("otp request CB = " + JSON.stringify(success));
            if(success.status == "success"){
              self.otpVerify = success.otpResponse.verificationCode;
              self.view.tbOtp.text = "";
              kony.adminConsole.utils.hideProgressBar(self.view);
              self.view.flxPopupOtp.setVisibility(true);
              self.view.forceLayout();
            }else{
              self.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
              self.view.toastMessage.lbltoastMessage.text = "You are not authorize to signed";
              kony.timer.schedule("mytimer", self.callBackTimer, 3, false);
              self.view.flxToastMessage.setVisibility(true);
              self.view.flxPopupOtp.setVisibility(false);
              self.view.forceLayout();
              kony.adminConsole.utils.hideProgressBar(self.view);
            }

          }, 
          function(error){
            self.view.flxPopupOtp.setVisibility(false);
            kony.adminConsole.utils.hideProgressBar(self.view);
            kony.print("otp error request CB = " + JSON.stringify(error));
          });

        // let selLst = this.approveLst.map(data => data.iban_contract);
      }

    }catch(e){
		kony.print("Exception approvebutton = " + e);
    }



  },

  onCancelBtnClick: function(){
    this.view.segApproval.selectedRowIndices = null;
  },

  showLoanContract: function(rowIndex){
    try{
      let pdfBase64 = this.documentData[rowIndex].loan_contract;
      // let pdfBase64 = data['loan_contract'];


      let pdfWindow = window.open("");
      //     pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, "
      //                            + pdfBase64+"'></iframe>");
      var file = 'data:application/pdf;base64,' + pdfBase64;
      pdfWindow.document.write("<html><head><title>Loan Contract</title></head><body>"
                               + '<embed width="100%" height="100%" name="plugin" src="'+ file + '" '
                               + 'type="application/pdf" internalinstanceid="21"></body></html>');
      pdfWindow.document.close(); }catch(e){
        kony.print("Exception in get loan contract file::::" +e);
      }

    return;

  },
  fetchloancontractoperationSuccess: function(res){
    try{
      var self = this;
      this.view.flxLoading.setVisibility(false);
      if(res.document_storage.length >0){
        var data = res.document_storage[0];
        let pdfBase64 = data['loan_contract'];


        let pdfWindow = window.open("");
        //     pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, "
        //                            + pdfBase64+"'></iframe>");
        var file = 'data:application/pdf;base64,' + pdfBase64;
        pdfWindow.document.write("<html><head><title>Loan Contract</title></head><body>"
                                 + '<embed width="100%" height="100%" name="plugin" src="'+ file + '" '
                                 + 'type="application/pdf" internalinstanceid="21"></body></html>');
        pdfWindow.document.close();

      }


    }catch (e){
      kony.print("Error in PDf Show = " + e);
    }

  },

  fetchloancontractoperationFailure: function(){
    this.view.flxLoading.setVisibility(false);
    alert("failed to fetch iban");
  },


  getAllNonSignedDocuments: function(){
    let data = this.presenter.getAllDocuments();
    (data.length > 0) ? this.setSegData(data) : this.noDataPresent();
  },

  onCancelOtpPopup: function(){
    this.view.flxPopupOtp.setVisibility(false);
    this.view.tbOtp.text = "";
    this.view.lblOTPwarning.setVisibility(false);
  },
  otpSubmit: function(txtBox){
    var self = this;
    if(this.view.tbOtp.text.length > 6){
      this.view.lblOTPwarning.setVisibility(true);
      this.view.lblOTPwarning.text = "OTP is incorrect";
    }else{
      if(this.view.tbOtp.text == this.otpVerify){
        this.view.flxPopupOtp.setVisibility(false);
        this.view.lblOTPwarning.setVisibility(false);
        kony.adminConsole.utils.showProgressBar(this.view);



        let selIbanContract = "@";
        let selApplicationId = "@";
        for(let i =0; i <this.approveLst.length; i++){
          //kony.print("Iban contract = " + )
          let lc = this.approveLst[i].loan_contract;
          // selIbanContract = selIbanContract + "@";
          selIbanContract = selIbanContract + lc + "@";
          selApplicationId = selApplicationId +this.approveLst[i].application_id + "@";
        }
        //for remove @ from first and last character
        selIbanContract = selIbanContract.slice(1, -1);
        selApplicationId = selApplicationId.slice(1, -1);


        // call emdha signing service
        let data = this.presenter.signedIbanContracts(
          selApplicationId,
          selIbanContract,
          function(success){
            kony.print("signedIbanContracts CB = " + JSON.stringify(success));
            if(success.status == "success"){
              self.refreshPage();
            }else{
              self.view.toastMessage.flxToastContainer.skin = "sknFlxErrorToastBgE61919";
              self.view.toastMessage.lbltoastMessage.text = "Unable to sign. Something went wrong";
              kony.timer.schedule("mytimer", self.callBackTimer, 3, false);
              self.view.flxToastMessage.setVisibility(true);
              self.view.forceLayout();
            }

          }, 
          function(error){
            kony.print("signedIbanContracts error CB = " + JSON.stringify(error));

          });   
        this.view.flxPopupOtp.setVisibility(false);
      }

    }
  },





  refreshPage: function(){
    var self = this;
    kony.adminConsole.utils.hideProgressBar(this.view);
    this.view.toastMessage.lbltoastMessage.text = "Successfully Signed Document";
    kony.timer.schedule("mytimer", self.callBackTimer, 3, false);
    this.view.flxToastMessage.setVisibility(true);

    this.presenter.recallNonEmdhaSign(
      function(success){
        let data = success;
        (data.length > 0) ? self.setSegData(data) : self.noDataPresent();
      },
      function(error){
        kony.print("Response Error= " + JSON.stringify(error));

      });
    this.view.forceLayout();
    //  this.onPreShow();
  },

  callBackTimer : function() 
  {
    kony.print("Timer state");
    kony.timer.cancel("mytimer");
    this.view.toastMessage.flxRightImage.setVisibility(true);
    this.view.flxToastMessage.setVisibility(false);
  },

  noDataPresent: function(){
    this.view.flxNoUserData.setVisibility(true);
    this.view.flxContent.setVisibility(false);
    this.view.btnApprove.setVisibility(false);
    this.view.btnCancel.setVisibility(false);
    this.view.lblwarning.setVisibility(false);
  }

});