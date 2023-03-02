/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "dashboardalerts", "objectService" : "DashboardObjService"};

    var setterFunctions = {
        Type: function(val, state) {
            context["field"] = "Type";
            context["metadata"] = (objectMetadata ? objectMetadata["Type"] : null);
            state['Type'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Description: function(val, state) {
            context["field"] = "Description";
            context["metadata"] = (objectMetadata ? objectMetadata["Description"] : null);
            state['Description'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        created: function(val, state) {
            context["field"] = "created";
            context["metadata"] = (objectMetadata ? objectMetadata["created"] : null);
            state['created'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Priority: function(val, state) {
            context["field"] = "Priority";
            context["metadata"] = (objectMetadata ? objectMetadata["Priority"] : null);
            state['Priority'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Title: function(val, state) {
            context["field"] = "Title";
            context["metadata"] = (objectMetadata ? objectMetadata["Title"] : null);
            state['Title'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        id: function(val, state) {
            context["field"] = "id";
            context["metadata"] = (objectMetadata ? objectMetadata["id"] : null);
            state['id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function dashboardalerts(defaultValues) {
        var privateState = {};
        context["field"] = "Type";
        context["metadata"] = (objectMetadata ? objectMetadata["Type"] : null);
        privateState.Type = defaultValues ?
            (defaultValues["Type"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Type"], context) :
                null) :
            null;

        context["field"] = "Description";
        context["metadata"] = (objectMetadata ? objectMetadata["Description"] : null);
        privateState.Description = defaultValues ?
            (defaultValues["Description"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Description"], context) :
                null) :
            null;

        context["field"] = "created";
        context["metadata"] = (objectMetadata ? objectMetadata["created"] : null);
        privateState.created = defaultValues ?
            (defaultValues["created"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["created"], context) :
                null) :
            null;

        context["field"] = "Priority";
        context["metadata"] = (objectMetadata ? objectMetadata["Priority"] : null);
        privateState.Priority = defaultValues ?
            (defaultValues["Priority"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Priority"], context) :
                null) :
            null;

        context["field"] = "Title";
        context["metadata"] = (objectMetadata ? objectMetadata["Title"] : null);
        privateState.Title = defaultValues ?
            (defaultValues["Title"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Title"], context) :
                null) :
            null;

        context["field"] = "id";
        context["metadata"] = (objectMetadata ? objectMetadata["id"] : null);
        privateState.id = defaultValues ?
            (defaultValues["id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["id"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "Type": {
                get: function() {
                    context["field"] = "Type";
                    context["metadata"] = (objectMetadata ? objectMetadata["Type"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Type, context);
                },
                set: function(val) {
                    setterFunctions['Type'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Description": {
                get: function() {
                    context["field"] = "Description";
                    context["metadata"] = (objectMetadata ? objectMetadata["Description"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Description, context);
                },
                set: function(val) {
                    setterFunctions['Description'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "created": {
                get: function() {
                    context["field"] = "created";
                    context["metadata"] = (objectMetadata ? objectMetadata["created"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.created, context);
                },
                set: function(val) {
                    setterFunctions['created'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Priority": {
                get: function() {
                    context["field"] = "Priority";
                    context["metadata"] = (objectMetadata ? objectMetadata["Priority"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Priority, context);
                },
                set: function(val) {
                    setterFunctions['Priority'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Title": {
                get: function() {
                    context["field"] = "Title";
                    context["metadata"] = (objectMetadata ? objectMetadata["Title"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Title, context);
                },
                set: function(val) {
                    setterFunctions['Title'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "id": {
                get: function() {
                    context["field"] = "id";
                    context["metadata"] = (objectMetadata ? objectMetadata["id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.id, context);
                },
                set: function(val) {
                    setterFunctions['id'].call(this, val, privateState);
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
            privateState.Type = value ? (value["Type"] ? value["Type"] : null) : null;
            privateState.Description = value ? (value["Description"] ? value["Description"] : null) : null;
            privateState.created = value ? (value["created"] ? value["created"] : null) : null;
            privateState.Priority = value ? (value["Priority"] ? value["Priority"] : null) : null;
            privateState.Title = value ? (value["Title"] ? value["Title"] : null) : null;
            privateState.id = value ? (value["id"] ? value["id"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(dashboardalerts);

    //Create new class level validator object
    BaseModel.Validator.call(dashboardalerts);

    var registerValidatorBackup = dashboardalerts.registerValidator;

    dashboardalerts.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(dashboardalerts.isValid(this, propName, val)) {
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
    //For Operation 'GetDashboardAlerts' with service id 'get_dashboardalerts7007'
     dashboardalerts.GetDashboardAlerts = function(params, onCompletion){
        return dashboardalerts.customVerb('GetDashboardAlerts', params, onCompletion);
     };

    var relations = [];

    dashboardalerts.relations = relations;

    dashboardalerts.prototype.isValid = function() {
        return dashboardalerts.isValid(this);
    };

    dashboardalerts.prototype.objModelName = "dashboardalerts";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    dashboardalerts.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("DashboardObjService", "dashboardalerts", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    dashboardalerts.clone = function(objectToClone) {
        var clonedObj = new dashboardalerts();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return dashboardalerts;
});