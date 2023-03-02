/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "TransactionReport", "objectService" : "ReportsObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function TransactionReport(defaultValues) {
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
    BaseModel.isParentOf(TransactionReport);

    //Create new class level validator object
    BaseModel.Validator.call(TransactionReport);

    var registerValidatorBackup = TransactionReport.registerValidator;

    TransactionReport.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(TransactionReport.isValid(this, propName, val)) {
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
    //For Operation 'getTransactionValueVolumeByService' with service id 'getTransactionValueVolumeByType3114'
     TransactionReport.getTransactionValueVolumeByService = function(params, onCompletion){
        return TransactionReport.customVerb('getTransactionValueVolumeByService', params, onCompletion);
     };

    //For Operation 'exportTransactionReport' with service id 'exportTransactionReport1610'
     TransactionReport.exportTransactionReport = function(params, onCompletion){
        return TransactionReport.customVerb('exportTransactionReport', params, onCompletion);
     };

    var relations = [];

    TransactionReport.relations = relations;

    TransactionReport.prototype.isValid = function() {
        return TransactionReport.isValid(this);
    };

    TransactionReport.prototype.objModelName = "TransactionReport";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    TransactionReport.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("ReportsObjService", "TransactionReport", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    TransactionReport.clone = function(objectToClone) {
        var clonedObj = new TransactionReport();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return TransactionReport;
});