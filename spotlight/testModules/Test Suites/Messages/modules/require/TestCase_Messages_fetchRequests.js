define([], function() {

  	function TestCase_Messages_fetchRequests(commandId) {
        kony.mvc.Business.CommandHandler.call(this, commandId);
    }
	
    inheritsFrom(TestCase_Messages_fetchRequests, kony.mvc.Business.CommandHandler);
  
  	TestCase_Messages_fetchRequests.prototype.execute = function(command){
		var CSRModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CSRModule");
        var self = this;
        var expect = chai.expect;
        var inputParam = {"csrRepID":"admin2","requestStatusID":"[SID_OPEN]","recordsPerPage":10,"currPageIndex":"1","sortCriteria":"","sortOrder":"asc","isFirstTime":true};
         function onCompletion(viewModel) {
            try {
				if(viewModel && viewModel.messages){
					expect(viewModel, 'to get Messages').to.include.keys(["messages"]);
                self.sendResponse(command, kony.mvc.constants.STATUS_SUCCESS, viewModel);
				}
            } catch (e) {
                self.sendResponse(command, kony.mvc.constants.STATUS_Failure, e);
            }
        }
        function onFetchCompletion(viewModel){
   try{
               if(viewModel){
                    command.context.onPresentForm('frmCSR', onCompletion);
                    CSRModule.presentationController.fetchRequests(inputParam);
              }
   }catch(e){
    self.sendResponse(command, kony.mvc.constants.STATUS_Failure, e);
   }
  }
        try {
            command.context.onPresentForm('frmCSR', onFetchCompletion);
            CSRModule.presentationController.navigateTo('CSRModule','showCSR');
        } catch (e) {
            this.sendResponse(command, kony.mvc.constants.STATUS_Failure, e);
        }
    };
	
	TestCase_Messages_fetchRequests.prototype.validate = function(){
		
    };
    
    return TestCase_Messages_fetchRequests;
    
});