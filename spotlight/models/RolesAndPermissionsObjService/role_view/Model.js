/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "role_view", "objectService" : "RolesAndPermissionsObjService"};

    var setterFunctions = {
        permission_Count: function(val, state) {
            context["field"] = "permission_Count";
            context["metadata"] = (objectMetadata ? objectMetadata["permission_Count"] : null);
            state['permission_Count'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        roleType_id: function(val, state) {
            context["field"] = "roleType_id";
            context["metadata"] = (objectMetadata ? objectMetadata["roleType_id"] : null);
            state['roleType_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        role_Desc: function(val, state) {
            context["field"] = "role_Desc";
            context["metadata"] = (objectMetadata ? objectMetadata["role_Desc"] : null);
            state['role_Desc'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        role_id: function(val, state) {
            context["field"] = "role_id";
            context["metadata"] = (objectMetadata ? objectMetadata["role_id"] : null);
            state['role_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        role_Name: function(val, state) {
            context["field"] = "role_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["role_Name"] : null);
            state['role_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Status_Desc: function(val, state) {
            context["field"] = "Status_Desc";
            context["metadata"] = (objectMetadata ? objectMetadata["Status_Desc"] : null);
            state['Status_Desc'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Status_id: function(val, state) {
            context["field"] = "Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Status_id"] : null);
            state['Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Users_Count: function(val, state) {
            context["field"] = "Users_Count";
            context["metadata"] = (objectMetadata ? objectMetadata["Users_Count"] : null);
            state['Users_Count'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function role_view(defaultValues) {
        var privateState = {};
        context["field"] = "permission_Count";
        context["metadata"] = (objectMetadata ? objectMetadata["permission_Count"] : null);
        privateState.permission_Count = defaultValues ?
            (defaultValues["permission_Count"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["permission_Count"], context) :
                null) :
            null;

        context["field"] = "roleType_id";
        context["metadata"] = (objectMetadata ? objectMetadata["roleType_id"] : null);
        privateState.roleType_id = defaultValues ?
            (defaultValues["roleType_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["roleType_id"], context) :
                null) :
            null;

        context["field"] = "role_Desc";
        context["metadata"] = (objectMetadata ? objectMetadata["role_Desc"] : null);
        privateState.role_Desc = defaultValues ?
            (defaultValues["role_Desc"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["role_Desc"], context) :
                null) :
            null;

        context["field"] = "role_id";
        context["metadata"] = (objectMetadata ? objectMetadata["role_id"] : null);
        privateState.role_id = defaultValues ?
            (defaultValues["role_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["role_id"], context) :
                null) :
            null;

        context["field"] = "role_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["role_Name"] : null);
        privateState.role_Name = defaultValues ?
            (defaultValues["role_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["role_Name"], context) :
                null) :
            null;

        context["field"] = "Status_Desc";
        context["metadata"] = (objectMetadata ? objectMetadata["Status_Desc"] : null);
        privateState.Status_Desc = defaultValues ?
            (defaultValues["Status_Desc"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Status_Desc"], context) :
                null) :
            null;

        context["field"] = "Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Status_id"] : null);
        privateState.Status_id = defaultValues ?
            (defaultValues["Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Status_id"], context) :
                null) :
            null;

        context["field"] = "Users_Count";
        context["metadata"] = (objectMetadata ? objectMetadata["Users_Count"] : null);
        privateState.Users_Count = defaultValues ?
            (defaultValues["Users_Count"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Users_Count"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "permission_Count": {
                get: function() {
                    context["field"] = "permission_Count";
                    context["metadata"] = (objectMetadata ? objectMetadata["permission_Count"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.permission_Count, context);
                },
                set: function(val) {
                    setterFunctions['permission_Count'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "roleType_id": {
                get: function() {
                    context["field"] = "roleType_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["roleType_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.roleType_id, context);
                },
                set: function(val) {
                    setterFunctions['roleType_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "role_Desc": {
                get: function() {
                    context["field"] = "role_Desc";
                    context["metadata"] = (objectMetadata ? objectMetadata["role_Desc"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.role_Desc, context);
                },
                set: function(val) {
                    setterFunctions['role_Desc'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "role_id": {
                get: function() {
                    context["field"] = "role_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["role_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.role_id, context);
                },
                set: function(val) {
                    setterFunctions['role_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "role_Name": {
                get: function() {
                    context["field"] = "role_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["role_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.role_Name, context);
                },
                set: function(val) {
                    setterFunctions['role_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Status_Desc": {
                get: function() {
                    context["field"] = "Status_Desc";
                    context["metadata"] = (objectMetadata ? objectMetadata["Status_Desc"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Status_Desc, context);
                },
                set: function(val) {
                    setterFunctions['Status_Desc'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Status_id": {
                get: function() {
                    context["field"] = "Status_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Status_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Status_id, context);
                },
                set: function(val) {
                    setterFunctions['Status_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Users_Count": {
                get: function() {
                    context["field"] = "Users_Count";
                    context["metadata"] = (objectMetadata ? objectMetadata["Users_Count"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Users_Count, context);
                },
                set: function(val) {
                    setterFunctions['Users_Count'].call(this, val, privateState);
                },
                enumerable: true,
            },
        });

        //converts model object to json object.
        this.toJsonInternal = function() {
            return Object.assign({}, privateState);
        };

        //overwrites object state with provided json value in argument.
        this.fromJsonInternal = function(value) {
            privateState.permission_Count = value ? (value["permission_Count"] ? value["permission_Count"] : null) : null;
            privateState.roleType_id = value ? (value["roleType_id"] ? value["roleType_id"] : null) : null;
            privateState.role_Desc = value ? (value["role_Desc"] ? value["role_Desc"] : null) : null;
            privateState.role_id = value ? (value["role_id"] ? value["role_id"] : null) : null;
            privateState.role_Name = value ? (value["role_Name"] ? value["role_Name"] : null) : null;
            privateState.Status_Desc = value ? (value["Status_Desc"] ? value["Status_Desc"] : null) : null;
            privateState.Status_id = value ? (value["Status_id"] ? value["Status_id"] : null) : null;
            privateState.Users_Count = value ? (value["Users_Count"] ? value["Users_Count"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(role_view);

    //Create new class level validator object
    BaseModel.Validator.call(role_view);

    var registerValidatorBackup = role_view.registerValidator;

    role_view.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(role_view.isValid(this, propName, val)) {
                    return setterBackup.apply(null, arguments);
                } else {
                    throw Error("Validation failed for " + propName + " : " + val);
                }
            }
            setterFunctions[arguments[0]].changed = true;
        }
        return registerValidatorBackup.apply(null, arguments);
    }

    //Extending Model for custom operations
    //For Operation 'downloadRolesList' with service id 'downloadRolesList4209'
     role_view.downloadRolesList = function(params, onCompletion){
        return role_view.customVerb('downloadRolesList', params, onCompletion);
     };

    //For Operation 'getRoleList' with service id 'get_roles_view2023'
     role_view.getRoleList = function(params, onCompletion){
        return role_view.customVerb('getRoleList', params, onCompletion);
     };

    var relations = [];

    role_view.relations = relations;

    role_view.prototype.isValid = function() {
        return role_view.isValid(this);
    };

    role_view.prototype.objModelName = "role_view";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    role_view.registerProcessors = function(options, successCallback, failureCallback) {

        if(!options) {
            options = {};
        }

        if(options && ((options["preProcessor"] && typeof(options["preProcessor"]) === "function") || !options["preProcessor"])) {
            preProcessorCallback = options["preProcessor"];
        }

        if(options && ((options["postProcessor"] && typeof(options["postProcessor"]) === "function") || !options["postProcessor"])) {
            postProcessorCallback = options["postProcessor"];
        }

        function metaDataSuccess(res) {
            objectMetadata = kony.mvc.util.ProcessorUtils.convertObjectMetadataToFieldMetadataMap(res);
            successCallback();
        }

        function metaDataFailure(err) {
            failureCallback(err);
        }

        kony.mvc.util.ProcessorUtils.getMetadataForObject("RolesAndPermissionsObjService", "role_view", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    role_view.clone = function(objectToClone) {
        var clonedObj = new role_view();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return role_view;
});