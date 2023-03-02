/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "systemuser_view", "objectService" : "RolesAndPermissionsObjService"};

    var setterFunctions = {
        Email: function(val, state) {
            context["field"] = "Email";
            context["metadata"] = (objectMetadata ? objectMetadata["Email"] : null);
            state['Email'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        FirstName: function(val, state) {
            context["field"] = "FirstName";
            context["metadata"] = (objectMetadata ? objectMetadata["FirstName"] : null);
            state['FirstName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        LastModifiedTimeStamp: function(val, state) {
            context["field"] = "LastModifiedTimeStamp";
            context["metadata"] = (objectMetadata ? objectMetadata["LastModifiedTimeStamp"] : null);
            state['LastModifiedTimeStamp'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        LastName: function(val, state) {
            context["field"] = "LastName";
            context["metadata"] = (objectMetadata ? objectMetadata["LastName"] : null);
            state['LastName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        MiddleName: function(val, state) {
            context["field"] = "MiddleName";
            context["metadata"] = (objectMetadata ? objectMetadata["MiddleName"] : null);
            state['MiddleName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Status_id: function(val, state) {
            context["field"] = "Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Status_id"] : null);
            state['Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        UpdatedBy: function(val, state) {
            context["field"] = "UpdatedBy";
            context["metadata"] = (objectMetadata ? objectMetadata["UpdatedBy"] : null);
            state['UpdatedBy'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        UserID: function(val, state) {
            context["field"] = "UserID";
            context["metadata"] = (objectMetadata ? objectMetadata["UserID"] : null);
            state['UserID'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Username: function(val, state) {
            context["field"] = "Username";
            context["metadata"] = (objectMetadata ? objectMetadata["Username"] : null);
            state['Username'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function systemuser_view(defaultValues) {
        var privateState = {};
        context["field"] = "Email";
        context["metadata"] = (objectMetadata ? objectMetadata["Email"] : null);
        privateState.Email = defaultValues ?
            (defaultValues["Email"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Email"], context) :
                null) :
            null;

        context["field"] = "FirstName";
        context["metadata"] = (objectMetadata ? objectMetadata["FirstName"] : null);
        privateState.FirstName = defaultValues ?
            (defaultValues["FirstName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["FirstName"], context) :
                null) :
            null;

        context["field"] = "LastModifiedTimeStamp";
        context["metadata"] = (objectMetadata ? objectMetadata["LastModifiedTimeStamp"] : null);
        privateState.LastModifiedTimeStamp = defaultValues ?
            (defaultValues["LastModifiedTimeStamp"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["LastModifiedTimeStamp"], context) :
                null) :
            null;

        context["field"] = "LastName";
        context["metadata"] = (objectMetadata ? objectMetadata["LastName"] : null);
        privateState.LastName = defaultValues ?
            (defaultValues["LastName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["LastName"], context) :
                null) :
            null;

        context["field"] = "MiddleName";
        context["metadata"] = (objectMetadata ? objectMetadata["MiddleName"] : null);
        privateState.MiddleName = defaultValues ?
            (defaultValues["MiddleName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["MiddleName"], context) :
                null) :
            null;

        context["field"] = "Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Status_id"] : null);
        privateState.Status_id = defaultValues ?
            (defaultValues["Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Status_id"], context) :
                null) :
            null;

        context["field"] = "UpdatedBy";
        context["metadata"] = (objectMetadata ? objectMetadata["UpdatedBy"] : null);
        privateState.UpdatedBy = defaultValues ?
            (defaultValues["UpdatedBy"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["UpdatedBy"], context) :
                null) :
            null;

        context["field"] = "UserID";
        context["metadata"] = (objectMetadata ? objectMetadata["UserID"] : null);
        privateState.UserID = defaultValues ?
            (defaultValues["UserID"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["UserID"], context) :
                null) :
            null;

        context["field"] = "Username";
        context["metadata"] = (objectMetadata ? objectMetadata["Username"] : null);
        privateState.Username = defaultValues ?
            (defaultValues["Username"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Username"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "Email": {
                get: function() {
                    context["field"] = "Email";
                    context["metadata"] = (objectMetadata ? objectMetadata["Email"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Email, context);
                },
                set: function(val) {
                    setterFunctions['Email'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "FirstName": {
                get: function() {
                    context["field"] = "FirstName";
                    context["metadata"] = (objectMetadata ? objectMetadata["FirstName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.FirstName, context);
                },
                set: function(val) {
                    setterFunctions['FirstName'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "LastModifiedTimeStamp": {
                get: function() {
                    context["field"] = "LastModifiedTimeStamp";
                    context["metadata"] = (objectMetadata ? objectMetadata["LastModifiedTimeStamp"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.LastModifiedTimeStamp, context);
                },
                set: function(val) {
                    setterFunctions['LastModifiedTimeStamp'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "LastName": {
                get: function() {
                    context["field"] = "LastName";
                    context["metadata"] = (objectMetadata ? objectMetadata["LastName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.LastName, context);
                },
                set: function(val) {
                    setterFunctions['LastName'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "MiddleName": {
                get: function() {
                    context["field"] = "MiddleName";
                    context["metadata"] = (objectMetadata ? objectMetadata["MiddleName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.MiddleName, context);
                },
                set: function(val) {
                    setterFunctions['MiddleName'].call(this, val, privateState);
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
            "UpdatedBy": {
                get: function() {
                    context["field"] = "UpdatedBy";
                    context["metadata"] = (objectMetadata ? objectMetadata["UpdatedBy"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.UpdatedBy, context);
                },
                set: function(val) {
                    setterFunctions['UpdatedBy'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "UserID": {
                get: function() {
                    context["field"] = "UserID";
                    context["metadata"] = (objectMetadata ? objectMetadata["UserID"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.UserID, context);
                },
                set: function(val) {
                    setterFunctions['UserID'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Username": {
                get: function() {
                    context["field"] = "Username";
                    context["metadata"] = (objectMetadata ? objectMetadata["Username"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Username, context);
                },
                set: function(val) {
                    setterFunctions['Username'].call(this, val, privateState);
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
            privateState.Email = value ? (value["Email"] ? value["Email"] : null) : null;
            privateState.FirstName = value ? (value["FirstName"] ? value["FirstName"] : null) : null;
            privateState.LastModifiedTimeStamp = value ? (value["LastModifiedTimeStamp"] ? value["LastModifiedTimeStamp"] : null) : null;
            privateState.LastName = value ? (value["LastName"] ? value["LastName"] : null) : null;
            privateState.MiddleName = value ? (value["MiddleName"] ? value["MiddleName"] : null) : null;
            privateState.Status_id = value ? (value["Status_id"] ? value["Status_id"] : null) : null;
            privateState.UpdatedBy = value ? (value["UpdatedBy"] ? value["UpdatedBy"] : null) : null;
            privateState.UserID = value ? (value["UserID"] ? value["UserID"] : null) : null;
            privateState.Username = value ? (value["Username"] ? value["Username"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(systemuser_view);

    //Create new class level validator object
    BaseModel.Validator.call(systemuser_view);

    var registerValidatorBackup = systemuser_view.registerValidator;

    systemuser_view.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(systemuser_view.isValid(this, propName, val)) {
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
    var relations = [];

    systemuser_view.relations = relations;

    systemuser_view.prototype.isValid = function() {
        return systemuser_view.isValid(this);
    };

    systemuser_view.prototype.objModelName = "systemuser_view";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    systemuser_view.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("RolesAndPermissionsObjService", "systemuser_view", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    systemuser_view.clone = function(objectToClone) {
        var clonedObj = new systemuser_view();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return systemuser_view;
});