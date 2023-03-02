define([], function () { 

  /**
     * User defined business controller
     * @constructor
     * @extends kony.mvc.Business.Delegator
     */
  function CustomerAgentPortalManager() { 

    kony.mvc.Business.Delegator.call(this); 

  } 

  inheritsFrom(CustomerAgentPortalManager, kony.mvc.Business.Delegator); 

  CustomerAgentPortalManager.prototype.initializeBusinessController = function () {

  };


  CustomerAgentPortalManager.prototype.callNonSignedDoc=function(sucessCB,errorCB){
    try {
      let data= {};
      let headers= {};
      let serviceName = "Spotlight_CRUD";
      let operationName =  "dbxdb_getDocument_CustomQuery";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      integrationObj.invokeOperation(operationName, headers, data, operationSuccess, operationFailure);
    } catch (err) {
      kony.print("Error callNonSignedDoc = " + err);
    }

    function operationSuccess(res) {
      sucessCB(res);
    }

    function operationFailure(res) {
      errorCB(res);
    }
  };


  CustomerAgentPortalManager.prototype.emdhaSign=function(input,sucessCB,errorCB){
    try {
      let data= {};
      let headers= {};
      let serviceName = "Spotlight_CRUD";
      let operationName =  "dbxdb_getDocument_CustomQuery";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      integrationObj.invokeOperation(operationName, headers, data, operationSuccess, operationFailure);
    } catch (err) {
      kony.print("Error callNonSignedDoc = " + err);
    }

    function operationSuccess(res) {
      sucessCB(res);
    }

    function operationFailure(res) {
      errorCB(res);
    }



  };


  CustomerAgentPortalManager.prototype.sendOTPReq=function(input,sucessCB,errorCB){
    try {
      let data= {"userId":input};
      let headers= {};
      let serviceName = "EmdhaSigningService";
      let operationName =  "OTPforSign";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      integrationObj.invokeOperation(operationName, headers, data, operationSuccess, operationFailure);
    } catch (err) {
      kony.print("Error sendOTPReq = " + err);
    }

    function operationSuccess(res) {
      sucessCB(res);
    }

    function operationFailure(res) {
      errorCB(res);
    }



  };
  
  
    CustomerAgentPortalManager.prototype.signedIbanContracts=function(appLst, docList, userID,sucessCB,errorCB){
    try {
      kony.print("Application ID = " + appLst);
      let data= {"userId":userID, "documentList": docList, "applicationIdList" : appLst};
      let headers= {};
      let serviceName = "EmdhaSigningService";
      let operationName =  "emdhaSignDocuments";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      integrationObj.invokeOperation(operationName, headers, data, operationSuccess, operationFailure);
    } catch (err) {
      kony.print("Error signedIbanContracts = " + err);
    }

    function operationSuccess(res) {
      sucessCB(res);
    }

    function operationFailure(res) {
      errorCB(res);
    }



  };
  
  
  
  



  return CustomerAgentPortalManager;

});