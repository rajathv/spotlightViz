/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "systemconfiguration", "objectService" : "MasterDataObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function systemconfiguration(defaultValues) {
        var privateState = {};

        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
        });

        //converts model object to json object.
        this.toJsonInternal = function() {
            return Object.assign({}, privateState);
        };

        //overwrites object state with provided json value in argument.
        this.fromJsonInternal = function(value) {
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(systemconfiguration);

    //Create new class level validator object
    BaseModel.Validator.call(systemconfiguration);

    var registerValidatorBackup = systemconfiguration.registerValidator;

    systemconfiguration.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(systemconfiguration.isValid(this, propName, val)) {
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
    //For Operation 'getSystemConfiguration' with service id 'get_systemconfiguration7161'
     systemconfiguration.getSystemConfiguration = function(params, onCompletion){
        return systemconfiguration.customVerb('getSystemConfiguration', params, onCompletion);
     };

    //For Operation 'updateSystemConfiguration' with service id 'updateSystemConfigurationService1319'
     systemconfiguration.updateSystemConfiguration = function(params, onCompletion){
        return systemconfiguration.customVerb('updateSystemConfiguration', params, onCompletion);
     };

    var relations = [];

    systemconfiguration.relations = relations;

    systemconfiguration.prototype.isValid = function() {
        return systemconfiguration.isValid(this);
    };

    systemconfiguration.prototype.objModelName = "systemconfiguration";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    systemconfiguration.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("MasterDataObjService", "systemconfiguration", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    systemconfiguration.clone = function(objectToClone) {
        var clonedObj = new systemconfiguration();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return systemconfiguration;
});