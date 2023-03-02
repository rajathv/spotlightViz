define(['Promisify', 'ErrorInterceptor', 'ErrorIsNetworkDown'], function(Promisify, ErrorInterceptor, isNetworkDown) {

  var RoleStatusConstants = {
    active : 'SID_ACTIVE',
    inactive : 'SID_INACTIVE'
  };
  function Role_PresentationController() {
    kony.mvc.Presentation.BasePresenter.call(this);
    this.roleModel = {
      fetchRoleList: null,
      fetchRoleUpdates:{
        fetchActiveUsers:null,
        fetchRolePermissions:null,
        fetchRoleUsers:null,
        fetchActivePermissions:null,
        fetchAllServiceDef:null,
        fetchRoleServiceDef:null
      },
      fetchRoleDetails : {
        roleDetails : null ,
        rolePermissions : null,
        roleUsers : null,
        roleServiceDefinition : null,
        allServiceDefinitions : null
      },
      fetchCompositeActions: null,
      context:null
    };
    this.context={
      toast:null,
      message:null
    };
    this.isKeyCloakEnabled=null;
  }

  inheritsFrom(Role_PresentationController, kony.mvc.Presentation.BasePresenter);

  Role_PresentationController.prototype.reqCSVObj = null;

  Role_PresentationController.prototype.initializePresentationController = function() {
    var self = this;
    ErrorInterceptor.wrap(this, 'businessController').match(function(on){
      return [
        on(isNetworkDown).do(function(){
          self.presentUserInterface("frmRoles",{
            NetworkDownMessage : {}
          });
        })
      ];
    });
  };

  Role_PresentationController.prototype.showErrorToastMessage = function(message){
    var self= this;
    self.context.toast="Error";
    self.context.message = message;
    self.presentUserInterface("frmRoles",self.context);
  };

  /**
   * Opening Method for the Roles module fetches and presents the Roles List
   * @name fetchRoleList
   * @member RoleModule.presentationController
   */
  Role_PresentationController.prototype.fetchRoleList = function(){
    var self = this;
    // this.presentUserInterface("frmRoles",{});
    var promiseFetchAllRoles = Promisify(this.businessController, 'fetchAllRoles');
    var promiseList=[];
    promiseList.push(promiseFetchAllRoles({}));
    if(self.isKeyCloakEnabled===null){
      var promiseLoginType = Promisify(this.businessController, 'getLoginTypeConfiguration');
      promiseList.push(promiseLoginType({}));
    }
    Promise.all(promiseList).then(function (responses) {      
      self.isKeyCloakEnabled=(self.isKeyCloakEnabled===null)?responses[1].isKeyCloakEnabled:self.isKeyCloakEnabled;
      self.presentUserInterface("frmRoles",{"isKeyCloakEnabled":self.isKeyCloakEnabled});
      self.roleModel.context = "viewRoles";
      self.reqCSVObj = responses[1];
      self.roleModel.fetchRoleList = responses[0].roles_view;
      self.presentUserInterface("frmRoles",self.roleModel);
      self.presentUserInterface('frmRoles',{"LoadingScreen":{focus:false}});
    }).catch(function (res) {
      self.context.toast="Error";
      self.context.message=ErrorInterceptor.errorMessage(res);
      self.presentUserInterface("frmRoles",self.context);
      self.presentUserInterface('frmRoles',{"LoadingScreen":{focus:false}});
    });
  };


  /**
   * @name createRoleDetails
   * @member RoleModule.presentationController
   * @param FormController fController
   * @param {Role_Name : string, Role_Desc : string, Status_id : string, system_user : string, Permission_ids : [string], User_ids : [string]} param
   */
  Role_PresentationController.prototype.createRoleDetails = function(fController,param) {
    var self = this;

    function successCallback(response) {
      self.fetchRoleList();
    }

    function failureCallback(error) {
      kony.print("error" );
      self.context.toast="Error";
      self.context.message=ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
    }

    this.businessController.createRole(param, successCallback.bind(this), failureCallback.bind(this));
  };

  /**
   * @name UpdateRoleDetails
   * @member RoleModule.presentationController
   * @param {User_id : string, Role_Details : {id : string, Name : string, Description : string, Status_id : string}, AssignedTo : {permissionsList : [string], usersList : []}, RemovedFrom : {permissionsList : [], usersList : []}} param
   */
  Role_PresentationController.prototype.UpdateRoleDetails = function(param) {
    var self = this;

    function successCallback(response) {
      self.fetchRoleList();
    }

    function failureCallback(error) {
      self.context.toast="Error";
      self.context.message = ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
      self.fetchRoleList();
    }

    this.businessController.updateRole(param, successCallback.bind(this), failureCallback.bind(this));
  }; 


  /**
   * @name fetchAllActiveUsersAndAllActivePermissions
   * @member RoleModule.presentationController
   * @param FormController fController
   */
  Role_PresentationController.prototype.fetchAllActiveUsersAndAllActivePermissions = function(fController) {
    var self = this;
    var promiseActivePermissions = Promisify(this.businessController, 'fetchActivePermissions');
    var promiseAllServiceDefinitions = Promisify(this.businessController, 'fetchAllServiceDefinitions');
    
	var promiseList =[];
    promiseList.push(promiseActivePermissions({}),
      promiseAllServiceDefinitions({}));
	if(self.isKeyCloakEnabled===false){
      var promiseActiveUsers = Promisify(this.businessController, 'fetchActiveUsers');
      promiseList.push(promiseActiveUsers({}));      
    }
    Promise.all(promiseList).then(function(response){
      self.roleModel.context = "createRole";
      if(self.isKeyCloakEnabled===false){
      self.roleModel.fetchRoleUpdates.fetchActiveUsers = response[2];
      }
      self.roleModel.fetchRoleUpdates.fetchRoleUsers = [];
      self.roleModel.fetchRoleUpdates.fetchActivePermissions = response[0];
      self.roleModel.fetchRoleUpdates.fetchRolePermissions = [];
      self.roleModel.fetchRoleUpdates.fetchAllServiceDef = response[1].ServiceDefinitionRecords;
      self.roleModel.fetchRoleUpdates.fetchRoleServiceDef = [];
      self.presentUserInterface("frmRoles", self.roleModel);
    }).catch(function failureCallback(error) {
      self.context.toast="Error";
      self.context.message= ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
    });
  };


  /**
   * @name fetchUpdateRoleData
   * @member RoleModule.presentationController
   * @param FormController fController
   * @param {role_id : string} param
   */
  Role_PresentationController.prototype.fetchUpdateRoleData = function (fController, param) {
    var self = this;

    var promiseRolePermissions = Promisify(this.businessController, 'fetchRolePermissions');
    var promiseActivePermissions = Promisify(this.businessController, 'fetchActivePermissions');
    var promiseCustomerRoleForUserRole =  Promisify(this.businessController, 'getInternalRoleToCustomerRoleMapping');
    var promiseAllServiceDefinitions = Promisify(this.businessController, 'fetchAllServiceDefinitions');
    var promiseList =[];
    promiseList.push(
      promiseRolePermissions(param.role_id),
      promiseActivePermissions({}),
      promiseCustomerRoleForUserRole({"InternalRole_id":param.role_id}),
      promiseAllServiceDefinitions({}));    
	if(self.isKeyCloakEnabled===false){
      var promiseActiveUsers = Promisify(this.businessController, 'fetchActiveUsers');
      var promiseRoleUsers = Promisify(this.businessController, 'fetchRoleUsers');
      promiseList.push(promiseActiveUsers({}),promiseRoleUsers(param.role_id));      
    }
    Promise.all(promiseList).then(function onSuccess(responses) {
      self.roleModel.context = "updateRole";
      self.roleModel.fetchRoleUpdates.fetchRolePermissions = responses[0];
      self.roleModel.fetchRoleUpdates.fetchActivePermissions = responses[1];
      self.roleModel.fetchRoleUpdates.fetchRoleServiceDef = responses[2].internal_role_to_servicedefinition_mapping;
      self.roleModel.fetchRoleUpdates.fetchAllServiceDef = responses[3].ServiceDefinitionRecords;  
      if(self.isKeyCloakEnabled===false){
      self.roleModel.fetchRoleUpdates.fetchActiveUsers = responses[4];
      self.roleModel.fetchRoleUpdates.fetchRoleUsers = responses[5];
      }
      self.presentUserInterface("frmRoles", self.roleModel);
    }).catch(function failureCallback(error) {
      self.context.toast="Error";
      self.context.message= ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
    });
  };

  /**
   * @name changeStatusOf
   * @member RoleModule.presentationController
   * @param string roleId
   * @param string statusId
   * @param string user_id
   */
  Role_PresentationController.prototype.changeStatusOf = function(roleId, statusId,user_id){
    var self = this;
    var updateStatusTo = null;

    if(RoleStatusConstants.active === statusId) {
      updateStatusTo = RoleStatusConstants.inactive;
    } else {
      updateStatusTo = RoleStatusConstants.active;
    }

    var params={
      "User_id":user_id,
      "Role_Details": {
        "id": roleId,
        "Status_id": updateStatusTo
      }
    };

    function successCallback(response) {
      self.context.toast="Success";
      if(updateStatusTo===RoleStatusConstants.inactive)
        self.context.message=kony.i18n.getLocalizedString("i18n.frmRolesController.Role_successfully_deactivated");
      else
        self.context.message=kony.i18n.getLocalizedString("i18n.frmRolesController.Role_successfully_activated");
      self.presentUserInterface("frmRoles",self.context);
      self.fetchRoleList();
    }

    function failureCallback(error) {
      self.context.toast="Error";
      self.context.message= ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
    }

    self.businessController.updateRoleStatus(params, successCallback, failureCallback);
  };


  /**
   * @name fetchRoleDetails
   * @member RoleModule.presentationController
   * @param FormController fController
   * @param {roleId : string, roleName : string, roleDesc : string, roleStatus : string} param
   */
  Role_PresentationController.prototype.fetchRoleDetails = function(fController, param) {
    var self = this;
    var promiseRolePermissions = Promisify(this.businessController, 'fetchRolePermissions');
    var promiseRoleServiceDef = Promisify(this.businessController, 'getInternalRoleToCustomerRoleMapping');
    var promiseallServiceDef = Promisify(this.businessController, 'fetchAllServiceDefinitions');
    
    var promiseList =[];
    promiseList.push(promiseRolePermissions(param.roleId),
                    promiseRoleServiceDef({"InternalRole_id":param.roleId}));
    if(self.isKeyCloakEnabled===false){
      var promiseRoleUsers = Promisify(this.businessController, 'fetchRoleUsers');
      promiseList.push(promiseRoleUsers(param.roleId));     
    }
    if(self.roleModel.fetchRoleDetails.allServiceDefinitions === null || self.roleModel.fetchRoleDetails.allServiceDefinitions === undefined){
      promiseList.push(promiseallServiceDef({}));
    }
    Promise.all(promiseList
    ).then(function onSuccess(responses) {
      self.roleModel.context = "fetchRoleDetails";
      var allServiceDef = self.roleModel.fetchRoleDetails.allServiceDefinitions;
      self.roleModel.fetchRoleDetails = {};
      self.roleModel.fetchRoleDetails.roleDetails = param;
      self.roleModel.fetchRoleDetails.rolePermissions = responses[0];
      self.roleModel.fetchRoleDetails.roleServiceDefinition = responses[1].internal_role_to_servicedefinition_mapping;   
      if(self.isKeyCloakEnabled===false)    
        self.roleModel.fetchRoleDetails.roleUsers = responses[2];
      if(responses && responses.length === 3 && self.isKeyCloakEnabled===true){ // 3 promise call -if keycloak enabled contains 
        self.roleModel.fetchRoleDetails.allServiceDefinitions = responses[2].ServiceDefinitionRecords;
      }else if(responses && responses.length === 4 && self.isKeyCloakEnabled===false){ // 4 promise call - if keycloak disabled contains 
        self.roleModel.fetchRoleDetails.allServiceDefinitions = responses[3].ServiceDefinitionRecords;
      } else{
        self.roleModel.fetchRoleDetails.allServiceDefinitions = allServiceDef;
      }
      self.presentUserInterface("frmRoles", self.roleModel);
    }).catch(function failureCallback(error) {
      //assign only role details as data is always available
      self.roleModel.fetchRoleDetails = {};
      self.roleModel.context = "fetchRoleDetails";
      self.roleModel.fetchRoleDetails.roleDetails = param;
      self.presentUserInterface("frmRoles", self.roleModel);
      self.context.toast="Error";
      self.context.message= ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
    });	
  };

  /**
   * @name fetchCompositeActions
   * @member RoleModule.presentationController
   * @param {Role_id : string, Permission_id : string} params
   */
  Role_PresentationController.prototype.fetchCompositeActions = function(params){
    var self = this;

    function successCallback(response) {
      self.roleModel.fetchCompositeActions = response;
      self.roleModel.context = "fetchCompositeActions";
      self.presentUserInterface("frmRoles", self.roleModel);
    }

    function failureCallback(error) {
      kony.print("error");
      self.context.toast="Error";
      self.context.message= ErrorInterceptor.errorMessage(error);
      self.presentUserInterface("frmRoles",self.context);
    }

    this.businessController.getUserOrRoleCompositeActions(params, successCallback, failureCallback);
  };

  /**
   * @name updateRoleCompositeActions
   * @member RoleModule.presentationController
   * @param {roleId : string, addedCompositeActions : [string], removedCompositeActions : [string]} params
   * @param string opt
   */
  Role_PresentationController.prototype.updateRoleCompositeActions = function(params,opt){
    var self = this;
    var operation = "";
    self.presentUserInterface('frmRoles',{"LoadingScreen":{focus:true}});
    if(opt === kony.i18n.getLocalizedString("i18n.frmPermissionsController.Add")) {
      operation ="addCompositeActions";
    } else if(opt === kony.i18n.getLocalizedString("i18n.frmCustomerManagementController.Remove")) {
      operation = "removedCompositeActions";
    }

    function successCallback(response) {
      self.context.toast="Success";
      self.context.message="CSR assist action successfully configured";
      self.context.LoadingScreen = {focus:false};
      self.presentUserInterface("frmRoles",self.context);
      
    }

    function failureCallback(error) {
      self.context.toast="Error";
      self.context.message= ErrorInterceptor.errorMessage(error);
      self.context.LoadingScreen = {focus:false};
      self.presentUserInterface("frmRoles",self.context);
    }

    this.businessController.updateRoleCompositeActions(params, successCallback, failureCallback);
  };
  /**
   * @name fetchAllServiceDefinitions
   * @member RoleModule.presentationController
   */
  Role_PresentationController.prototype.fetchAllServiceDefinitions = function() {
    var self = this;
    self.presentUserInterface('frmRoles',{"LoadingScreen":{focus:true}});

    function onSuccess(response) {
      self.presentUserInterface('frmRoles', {
        "allServiceDefinitions": response.ServiceDefinitionRecords
      });
      self.presentUserInterface('frmRoles',{"LoadingScreen":{focus:true}});

    }
    function onError(error) {
      self.presentUserInterface('frmRoles',{"LoadingScreen":{focus:false}});
      self.showToastMessageFlex(ErrorInterceptor.errorMessage(error), "error");
    }
    self.businessController.fetchAllServiceDefinitions({}, onSuccess, onError);
  };

  return Role_PresentationController;
});