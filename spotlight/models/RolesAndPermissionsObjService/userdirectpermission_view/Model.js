/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "userdirectpermission_view", "objectService" : "RolesAndPermissionsObjService"};

    var setterFunctions = {
        createdby: function(val, state) {
            context["field"] = "createdby";
            context["metadata"] = (objectMetadata ? objectMetadata["createdby"] : null);
            state['createdby'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        createdts: function(val, state) {
            context["field"] = "createdts";
            context["metadata"] = (objectMetadata ? objectMetadata["createdts"] : null);
            state['createdts'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
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
        Permission_Description: function(val, state) {
            context["field"] = "Permission_Description";
            context["metadata"] = (objectMetadata ? objectMetadata["Permission_Description"] : null);
            state['Permission_Description'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Permission_id: function(val, state) {
            context["field"] = "Permission_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Permission_id"] : null);
            state['Permission_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Permission_Name: function(val, state) {
            context["field"] = "Permission_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["Permission_Name"] : null);
            state['Permission_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Permission_Status_id: function(val, state) {
            context["field"] = "Permission_Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Permission_Status_id"] : null);
            state['Permission_Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        softdeleteflag: function(val, state) {
            context["field"] = "softdeleteflag";
            context["metadata"] = (objectMetadata ? objectMetadata["softdeleteflag"] : null);
            state['softdeleteflag'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        updatedby: function(val, state) {
            context["field"] = "updatedby";
            context["metadata"] = (objectMetadata ? objectMetadata["updatedby"] : null);
            state['updatedby'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        updatedts: function(val, state) {
            context["field"] = "updatedts";
            context["metadata"] = (objectMetadata ? objectMetadata["updatedts"] : null);
            state['updatedts'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        UserName: function(val, state) {
            context["field"] = "UserName";
            context["metadata"] = (objectMetadata ? objectMetadata["UserName"] : null);
            state['UserName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        User_id: function(val, state) {
            context["field"] = "User_id";
            context["metadata"] = (objectMetadata ? objectMetadata["User_id"] : null);
            state['User_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        User_Status_id: function(val, state) {
            context["field"] = "User_Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["User_Status_id"] : null);
            state['User_Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function userdirectpermission_view(defaultValues) {
        var privateState = {};
        context["field"] = "createdby";
        context["metadata"] = (objectMetadata ? objectMetadata["createdby"] : null);
        privateState.createdby = defaultValues ?
            (defaultValues["createdby"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["createdby"], context) :
                null) :
            null;

        context["field"] = "createdts";
        context["metadata"] = (objectMetadata ? objectMetadata["createdts"] : null);
        privateState.createdts = defaultValues ?
            (defaultValues["createdts"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["createdts"], context) :
                null) :
            null;

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

        context["field"] = "Permission_Description";
        context["metadata"] = (objectMetadata ? objectMetadata["Permission_Description"] : null);
        privateState.Permission_Description = defaultValues ?
            (defaultValues["Permission_Description"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Permission_Description"], context) :
                null) :
            null;

        context["field"] = "Permission_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Permission_id"] : null);
        privateState.Permission_id = defaultValues ?
            (defaultValues["Permission_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Permission_id"], context) :
                null) :
            null;

        context["field"] = "Permission_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["Permission_Name"] : null);
        privateState.Permission_Name = defaultValues ?
            (defaultValues["Permission_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Permission_Name"], context) :
                null) :
            null;

        context["field"] = "Permission_Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Permission_Status_id"] : null);
        privateState.Permission_Status_id = defaultValues ?
            (defaultValues["Permission_Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Permission_Status_id"], context) :
                null) :
            null;

        context["field"] = "softdeleteflag";
        context["metadata"] = (objectMetadata ? objectMetadata["softdeleteflag"] : null);
        privateState.softdeleteflag = defaultValues ?
            (defaultValues["softdeleteflag"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["softdeleteflag"], context) :
                null) :
            null;

        context["field"] = "updatedby";
        context["metadata"] = (objectMetadata ? objectMetadata["updatedby"] : null);
        privateState.updatedby = defaultValues ?
            (defaultValues["updatedby"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["updatedby"], context) :
                null) :
            null;

        context["field"] = "updatedts";
        context["metadata"] = (objectMetadata ? objectMetadata["updatedts"] : null);
        privateState.updatedts = defaultValues ?
            (defaultValues["updatedts"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["updatedts"], context) :
                null) :
            null;

        context["field"] = "UserName";
        context["metadata"] = (objectMetadata ? objectMetadata["UserName"] : null);
        privateState.UserName = defaultValues ?
            (defaultValues["UserName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["UserName"], context) :
                null) :
            null;

        context["field"] = "User_id";
        context["metadata"] = (objectMetadata ? objectMetadata["User_id"] : null);
        privateState.User_id = defaultValues ?
            (defaultValues["User_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["User_id"], context) :
                null) :
            null;

        context["field"] = "User_Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["User_Status_id"] : null);
        privateState.User_Status_id = defaultValues ?
            (defaultValues["User_Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["User_Status_id"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "createdby": {
                get: function() {
                    context["field"] = "createdby";
                    context["metadata"] = (objectMetadata ? objectMetadata["createdby"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.createdby, context);
                },
                set: function(val) {
                    setterFunctions['createdby'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "createdts": {
                get: function() {
                    context["field"] = "createdts";
                    context["metadata"] = (objectMetadata ? objectMetadata["createdts"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.createdts, context);
                },
                set: function(val) {
                    setterFunctions['createdts'].call(this, val, privateState);
                },
                enumerable: true,
            },
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
            "Permission_Description": {
                get: function() {
                    context["field"] = "Permission_Description";
                    context["metadata"] = (objectMetadata ? objectMetadata["Permission_Description"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Permission_Description, context);
                },
                set: function(val) {
                    setterFunctions['Permission_Description'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Permission_id": {
                get: function() {
                    context["field"] = "Permission_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Permission_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Permission_id, context);
                },
                set: function(val) {
                    setterFunctions['Permission_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Permission_Name": {
                get: function() {
                    context["field"] = "Permission_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["Permission_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Permission_Name, context);
                },
                set: function(val) {
                    setterFunctions['Permission_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Permission_Status_id": {
                get: function() {
                    context["field"] = "Permission_Status_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Permission_Status_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Permission_Status_id, context);
                },
                set: function(val) {
                    setterFunctions['Permission_Status_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "softdeleteflag": {
                get: function() {
                    context["field"] = "softdeleteflag";
                    context["metadata"] = (objectMetadata ? objectMetadata["softdeleteflag"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.softdeleteflag, context);
                },
                set: function(val) {
                    setterFunctions['softdeleteflag'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "updatedby": {
                get: function() {
                    context["field"] = "updatedby";
                    context["metadata"] = (objectMetadata ? objectMetadata["updatedby"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.updatedby, context);
                },
                set: function(val) {
                    setterFunctions['updatedby'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "updatedts": {
                get: function() {
                    context["field"] = "updatedts";
                    context["metadata"] = (objectMetadata ? objectMetadata["updatedts"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.updatedts, context);
                },
                set: function(val) {
                    setterFunctions['updatedts'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "UserName": {
                get: function() {
                    context["field"] = "UserName";
                    context["metadata"] = (objectMetadata ? objectMetadata["UserName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.UserName, context);
                },
                set: function(val) {
                    setterFunctions['UserName'].call(this, val, privateState);
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
            "User_Status_id": {
                get: function() {
                    context["field"] = "User_Status_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["User_Status_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.User_Status_id, context);
                },
                set: function(val) {
                    setterFunctions['User_Status_id'].call(this, val, privateState);
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
            privateState.createdby = value ? (value["createdby"] ? value["createdby"] : null) : null;
            privateState.createdts = value ? (value["createdts"] ? value["createdts"] : null) : null;
            privateState.Email = value ? (value["Email"] ? value["Email"] : null) : null;
            privateState.FirstName = value ? (value["FirstName"] ? value["FirstName"] : null) : null;
            privateState.LastName = value ? (value["LastName"] ? value["LastName"] : null) : null;
            privateState.MiddleName = value ? (value["MiddleName"] ? value["MiddleName"] : null) : null;
            privateState.Permission_Description = value ? (value["Permission_Description"] ? value["Permission_Description"] : null) : null;
            privateState.Permission_id = value ? (value["Permission_id"] ? value["Permission_id"] : null) : null;
            privateState.Permission_Name = value ? (value["Permission_Name"] ? value["Permission_Name"] : null) : null;
            privateState.Permission_Status_id = value ? (value["Permission_Status_id"] ? value["Permission_Status_id"] : null) : null;
            privateState.softdeleteflag = value ? (value["softdeleteflag"] ? value["softdeleteflag"] : null) : null;
            privateState.updatedby = value ? (value["updatedby"] ? value["updatedby"] : null) : null;
            privateState.updatedts = value ? (value["updatedts"] ? value["updatedts"] : null) : null;
            privateState.UserName = value ? (value["UserName"] ? value["UserName"] : null) : null;
            privateState.User_id = value ? (value["User_id"] ? value["User_id"] : null) : null;
            privateState.User_Status_id = value ? (value["User_Status_id"] ? value["User_Status_id"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(userdirectpermission_view);

    //Create new class level validator object
    BaseModel.Validator.call(userdirectpermission_view);

    var registerValidatorBackup = userdirectpermission_view.registerValidator;

    userdirectpermission_view.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(userdirectpermission_view.isValid(this, propName, val)) {
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

    userdirectpermission_view.relations = relations;

    userdirectpermission_view.prototype.isValid = function() {
        return userdirectpermission_view.isValid(this);
    };

    userdirectpermission_view.prototype.objModelName = "userdirectpermission_view";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    userdirectpermission_view.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("RolesAndPermissionsObjService", "userdirectpermission_view", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    userdirectpermission_view.clone = function(objectToClone) {
        var clonedObj = new userdirectpermission_view();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return userdirectpermission_view;
});