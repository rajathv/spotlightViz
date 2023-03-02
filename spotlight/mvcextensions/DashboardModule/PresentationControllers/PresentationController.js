define(['Promisify', 'ErrorInterceptor', 'ErrorIsNetworkDown'], function (Promisify, ErrorInterceptor, isNetworkDown) {

    function Dashboard_PresentationController() {
        kony.mvc.Presentation.BasePresenter.call(this);
    }

    inheritsFrom(Dashboard_PresentationController, kony.mvc.Presentation.BasePresenter);

    Dashboard_PresentationController.prototype.initializePresentationController = function() {
      var self = this;
      ErrorInterceptor.wrap(this, 'businessController').match(function(on){
        return [
          on(isNetworkDown).do(function(){
            self.presentUserInterface('frmDashboard',{
              NetworkDownMessage : {}
            });
          })
        ];
      });
    };
    Dashboard_PresentationController.prototype.showProgressBar = function(){
      this.showDashboard({progressBar : {
        show : true
      }});
    };
    Dashboard_PresentationController.prototype.hideProgressBar = function(){
      this.showDashboard({progressBar : {
        show : false
      }});
    };
    Dashboard_PresentationController.prototype.toastMgs = function(){
      this.showDashboard({toast : {
        show : "success"
      }});
    };
    Dashboard_PresentationController.prototype.errorToastMgs = function(){
      this.showDashboard({toast : {
        show : "error"
      }});
    };
    Dashboard_PresentationController.prototype.showDashboard = function(context){
       this.presentUserInterface('frmDashboard',context);
    };
	
	/**
     * @name fetchDashBoardData
     * @member DashboardModule.presentationController
     * 
     */
    Dashboard_PresentationController.prototype.fetchDashBoardData = function () {
      this.showProgressBar();
      var viewModel = {
        count: {},
        alerts: {},
        alertsCount: "",
        action: ""
      };
      var self = this;
      var fetchDashBoardCounts = Promisify(self.businessController, 'fetchDashBoardCounts');
      var fetchDashBoardAlerts = Promisify(self.businessController, 'fetchDashBoardAlerts');

      Promise.all([
        fetchDashBoardCounts({}),
        fetchDashBoardAlerts({})
      ]).then(function onSuccess(response){
        var countsData = response[0];
        var alertsData = response[1];
        viewModel.count = countsData;
        viewModel.alertsCount = alertsData.length;
        var alerts = alertsData.reduce(function (result, alert) {
          var arr = result[alert.created] || [];
          result[alert.created] = arr.concat([alert]);
          return result;
        }, {});
        viewModel.alerts = alerts;
        viewModel.action = "fromBackend";
        self.showDashboard(viewModel);
        self.toastMgs();
        self.hideProgressBar();
      }).catch(function onError() {
        self.hideProgressBar();
        self.errorToastMgs();
      });
  };

  
  
  Dashboard_PresentationController.prototype.callingLeftMenu = function (param) {
    this.navigateTo('CSRModule', 'fetchAllCategories', param);
    };

    return Dashboard_PresentationController;
});