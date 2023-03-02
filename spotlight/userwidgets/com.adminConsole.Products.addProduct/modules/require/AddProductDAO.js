define(function () {
  function AddProductDAO() {
  }
  
  AddProductDAO.prototype.fetchProductInformation = function(objServiceName, objName, operationName, payload, callBack, isCreateEditJSON){
    let isCreateProduct = false;
    let isEditProduct = false;
    let createEditMsg = "";
    if(isCreateEditJSON!==null){
      isCreateProduct = isCreateEditJSON.isCreateProduct;
      isEditProduct = isCreateEditJSON.isEditProduct;
      if(isCreateProduct) createEditMsg="New Product Added Successfully.";
      else if(isEditProduct) createEditMsg="Product Edited Successfully.";
    }
    
    callBack({ 
      progressBar: {show:"success"}
    });
    let objSvc = kony.sdk.getCurrentInstance().getObjectService(objServiceName, {
      "access": "online"
    });
    var dataObject = new kony.sdk.dto.DataObject(objName);
    for(let key in payload){
      dataObject.addField(key,payload[key]);
    }
    let options = {
      "dataObject": dataObject
    };
    
    function successcallback(response){
      kony.print("Backend Call for " + operationName + " is successful. " + JSON.stringify(response));
      response.action = operationName;
      if(isCreateProduct || isEditProduct){
        callBack({
          progressBar: {show:"hide"},
        });
        callBack({
          toastModel:{
            status : "success",
            message: createEditMsg
          }
        });
        callBack(response);
      } else {
        callBack(response); 
        callBack({
          progressBar: {show:"hide"},
        });  
      }
    }
    
    function failurecallback(error) {
      kony.print("Backend Call for " + operationName + " has failed. " + JSON.stringify(error));
      callBack({
        progressBar: {show : "hide"},
        toastModel:{
          status : "fail",
          message: "Backend Call for Operation Name: " + operationName + " Failed."
        }
      });
    }
    
    objSvc.customVerb(operationName,options,successcallback,failurecallback);
  };
  
  return AddProductDAO;
});