define([],function () {

  function CustomerAgentPortalModule_BusinessController(){
    kony.mvc.Business.Delegator.call(this);
  }

  inheritsFrom(CustomerAgentPortalModule_BusinessController, kony.mvc.Business.Delegator);

  CustomerAgentPortalModule_BusinessController.prototype.initializeBusinessController = function(){
  };
 
  CustomerAgentPortalModule_BusinessController.prototype.execute = function(command){
    kony.mvc.Business.Controller.prototype.execute.call(this,command);
  };
  
  return CustomerAgentPortalModule_BusinessController;
});