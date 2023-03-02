/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "managePermissions", "objectService" : "RolesAndPermissionsObjService"};

    var setterFunctions = {
        AssignedTo: function(val, state) {
            context["field"] = "AssignedTo";
            context["metadata"] = (objectMetadata ? objectMetadata["AssignedTo"] : null);
            state['AssignedTo'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Permission_Details: function(val, state) {
            context["field"] = "Permission_Details";
            context["metadata"] = (objectMetadata ? objectMetadata["Permission_Details"] : null);
            state['Permission_Details'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        RemovedFrom: function(val, state) {
            context["field"] = "RemovedFrom";
            context["metadata"] = (objectMetadata ? objectMetadata["RemovedFrom"] : null);
            state['RemovedFrom'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        User_id: function(val, state) {
            context["field"] = "User_id";
            context["metadata"] = (objectMetadata ? objectMetadata["User_id"] : null);
            state['User_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function managePermissions(defaultValues) {
        var privateState = {};
        context["field"] = "AssignedTo";
        context["metadata"] = (objectMetadata ? objectMetadata["AssignedTo"] : null);
        privateState.AssignedTo = defaultValues ?
            (defaultValues["AssignedTo"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["AssignedTo"], context) :
                null) :
            null;

        context["field"] = "Permission_Details";
        context["metadata"] = (objectMetadata ? objectMetadata["Permission_Details"] : null);
        privateState.Permission_Details = defaultValues ?
            (defaultValues["Permission_Details"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Permission_Details"], context) :
                null) :
            null;

        context["field"] = "RemovedFrom";
        context["metadata"] = (objectMetadata ? objectMetadata["RemovedFrom"] : null);
        privateState.RemovedFrom = defaultValues ?
            (defaultValues["RemovedFrom"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["RemovedFrom"], context) :
                null) :
            null;

        context["field"] = "User_id";
        context["metadata"] = (objectMetadata ? objectMetadata["User_id"] : null);
        privateState.User_id = defaultValues ?
            (defaultValues["User_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["User_id"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "AssignedTo": {
                get: function() {
                    context["field"] = "AssignedTo";
                    context["metadata"] = (objectMetadata ? objectMetadata["AssignedTo"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.AssignedTo, context);
                },
                set: function(val) {
                    setterFunctions['AssignedTo'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Permission_Details": {
                get: function() {
                    context["field"] = "Permission_Details";
                    context["metadata"] = (objectMetadata ? objectMetadata["Permission_Details"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Permission_Details, context);
                },
                set: function(val) {
                    setterFunctions['Permission_Details'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "RemovedFrom": {
                get: function() {
                    context["field"] = "RemovedFrom";
                    context["metadata"] = (objectMetadata ? objectMetadata["RemovedFrom"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.RemovedFrom, context);
                },
                set: function(val) {
                    setterFunctions['RemovedFrom'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "User_id": {
                get: function() {
                    context["field"] = "User_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["User_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.User_id, context);
                },
                set: function(val) {
                    setterFunctions['User_id'].call(this, val, privateState);
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
            privateState.AssignedTo = value ? (value["AssignedTo"] ? value["AssignedTo"] : null) : null;
            privateState.Permission_Details = value ? (value["Permission_Details"] ? value["Permission_Details"] : null) : null;
            privateState.RemovedFrom = value ? (value["RemovedFrom"] ? value["RemovedFrom"] : null) : null;
            privateState.User_id = value ? (value["User_id"] ? value["User_id"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(managePermissions);

    //Create new class level validator object
    BaseModel.Validator.call(managePermissions);

    var registerValidatorBackup = managePermissions.registerValidator;

    managePermissions.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(managePermissions.isValid(this, propName, val)) {
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
    //For Operation 'updatePermission' with service id 'managePermission8225'
     managePermissions.updatePermission = function(params, onCompletion){
        return managePermissions.customVerb('updatePermission', params, onCompletion);
     };

    var relations = [];

    managePermissions.relations = relations;

    managePermissions.prototype.isValid = function() {
        return managePermissions.isValid(this);
    };

    managePermissions.prototype.objModelName = "managePermissions";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    managePermissions.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("RolesAndPermissionsObjService", "managePermissions", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    managePermissions.clone = function(objectToClone) {
        var clonedObj = new managePermissions();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return managePermissions;
});