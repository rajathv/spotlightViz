/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "region", "objectService" : "InternalusersObjService"};

    var setterFunctions = {
        Code: function(val, state) {
            context["field"] = "Code";
            context["metadata"] = (objectMetadata ? objectMetadata["Code"] : null);
            state['Code'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Country_id: function(val, state) {
            context["field"] = "Country_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Country_id"] : null);
            state['Country_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        id: function(val, state) {
            context["field"] = "id";
            context["metadata"] = (objectMetadata ? objectMetadata["id"] : null);
            state['id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Name: function(val, state) {
            context["field"] = "Name";
            context["metadata"] = (objectMetadata ? objectMetadata["Name"] : null);
            state['Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function region(defaultValues) {
        var privateState = {};
        context["field"] = "Code";
        context["metadata"] = (objectMetadata ? objectMetadata["Code"] : null);
        privateState.Code = defaultValues ?
            (defaultValues["Code"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Code"], context) :
                null) :
            null;

        context["field"] = "Country_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Country_id"] : null);
        privateState.Country_id = defaultValues ?
            (defaultValues["Country_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Country_id"], context) :
                null) :
            null;

        context["field"] = "id";
        context["metadata"] = (objectMetadata ? objectMetadata["id"] : null);
        privateState.id = defaultValues ?
            (defaultValues["id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["id"], context) :
                null) :
            null;

        context["field"] = "Name";
        context["metadata"] = (objectMetadata ? objectMetadata["Name"] : null);
        privateState.Name = defaultValues ?
            (defaultValues["Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Name"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "Code": {
                get: function() {
                    context["field"] = "Code";
                    context["metadata"] = (objectMetadata ? objectMetadata["Code"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Code, context);
                },
                set: function(val) {
                    setterFunctions['Code'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Country_id": {
                get: function() {
                    context["field"] = "Country_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Country_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Country_id, context);
                },
                set: function(val) {
                    setterFunctions['Country_id'].call(this, val, privateState);
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
            "Name": {
                get: function() {
                    context["field"] = "Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Name, context);
                },
                set: function(val) {
                    setterFunctions['Name'].call(this, val, privateState);
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
            privateState.Code = value ? (value["Code"] ? value["Code"] : null) : null;
            privateState.Country_id = value ? (value["Country_id"] ? value["Country_id"] : null) : null;
            privateState.id = value ? (value["id"] ? value["id"] : null) : null;
            privateState.Name = value ? (value["Name"] ? value["Name"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(region);

    //Create new class level validator object
    BaseModel.Validator.call(region);

    var registerValidatorBackup = region.registerValidator;

    region.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(region.isValid(this, propName, val)) {
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
    //For Operation 'getDetails' with service id 'get_region_details_view8077'
     region.getDetails = function(params, onCompletion){
        return region.customVerb('getDetails', params, onCompletion);
     };

    var relations = [];

    region.relations = relations;

    region.prototype.isValid = function() {
        return region.isValid(this);
    };

    region.prototype.objModelName = "region";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    region.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("InternalusersObjService", "region", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    region.clone = function(objectToClone) {
        var clonedObj = new region();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return region;
});