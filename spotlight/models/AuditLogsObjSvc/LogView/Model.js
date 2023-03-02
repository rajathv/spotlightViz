/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "LogView", "objectService" : "AuditLogsObjSvc"};

    var setterFunctions = {
    };

    //Create the Model Class
    function LogView(defaultValues) {
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
    BaseModel.isParentOf(LogView);

    //Create new class level validator object
    BaseModel.Validator.call(LogView);

    var registerValidatorBackup = LogView.registerValidator;

    LogView.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(LogView.isValid(this, propName, val)) {
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
    //For Operation 'deleteFilter' with service id 'deleteFilter8127'
     LogView.deleteFilter = function(params, onCompletion){
        return LogView.customVerb('deleteFilter', params, onCompletion);
     };

    //For Operation 'getFilters' with service id 'getFilters7294'
     LogView.getFilters = function(params, onCompletion){
        return LogView.customVerb('getFilters', params, onCompletion);
     };

    //For Operation 'createFilter' with service id 'createFilter1418'
     LogView.createFilter = function(params, onCompletion){
        return LogView.customVerb('createFilter', params, onCompletion);
     };

    var relations = [];

    LogView.relations = relations;

    LogView.prototype.isValid = function() {
        return LogView.isValid(this);
    };

    LogView.prototype.objModelName = "LogView";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    LogView.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("AuditLogsObjSvc", "LogView", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    LogView.clone = function(objectToClone) {
        var clonedObj = new LogView();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return LogView;
});