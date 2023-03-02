/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "transferFeeGroup", "objectService" : "ManageLimitsAndFees"};

    var setterFunctions = {
    };

    //Create the Model Class
    function transferFeeGroup(defaultValues) {
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
    BaseModel.isParentOf(transferFeeGroup);

    //Create new class level validator object
    BaseModel.Validator.call(transferFeeGroup);

    var registerValidatorBackup = transferFeeGroup.registerValidator;

    transferFeeGroup.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(transferFeeGroup.isValid(this, propName, val)) {
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
    //For Operation 'fetchTransferFeeUserGroup' with service id 'getTransferFeeUserGroup4167'
     transferFeeGroup.fetchTransferFeeUserGroup = function(params, onCompletion){
        return transferFeeGroup.customVerb('fetchTransferFeeUserGroup', params, onCompletion);
     };

    var relations = [];

    transferFeeGroup.relations = relations;

    transferFeeGroup.prototype.isValid = function() {
        return transferFeeGroup.isValid(this);
    };

    transferFeeGroup.prototype.objModelName = "transferFeeGroup";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    transferFeeGroup.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("ManageLimitsAndFees", "transferFeeGroup", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    transferFeeGroup.clone = function(objectToClone) {
        var clonedObj = new transferFeeGroup();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return transferFeeGroup;
});