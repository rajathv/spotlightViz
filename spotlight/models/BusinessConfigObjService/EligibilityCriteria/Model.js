/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "EligibilityCriteria", "objectService" : "BusinessConfigObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function EligibilityCriteria(defaultValues) {
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
    BaseModel.isParentOf(EligibilityCriteria);

    //Create new class level validator object
    BaseModel.Validator.call(EligibilityCriteria);

    var registerValidatorBackup = EligibilityCriteria.registerValidator;

    EligibilityCriteria.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(EligibilityCriteria.isValid(this, propName, val)) {
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
    //For Operation 'getEligibilityCriteria' with service id 'get_eligibilitycriteria4800'
     EligibilityCriteria.getEligibilityCriteria = function(params, onCompletion){
        return EligibilityCriteria.customVerb('getEligibilityCriteria', params, onCompletion);
     };

    //For Operation 'addEligibilityCriteria' with service id 'addEligibilityCriteria5582'
     EligibilityCriteria.addEligibilityCriteria = function(params, onCompletion){
        return EligibilityCriteria.customVerb('addEligibilityCriteria', params, onCompletion);
     };

    //For Operation 'editEligibilityCriteria' with service id 'editEligibilityCriteria1276'
     EligibilityCriteria.editEligibilityCriteria = function(params, onCompletion){
        return EligibilityCriteria.customVerb('editEligibilityCriteria', params, onCompletion);
     };

    //For Operation 'deleteEligibilityCriteria' with service id 'deleteEligibilityCriteria7366'
     EligibilityCriteria.deleteEligibilityCriteria = function(params, onCompletion){
        return EligibilityCriteria.customVerb('deleteEligibilityCriteria', params, onCompletion);
     };

    var relations = [];

    EligibilityCriteria.relations = relations;

    EligibilityCriteria.prototype.isValid = function() {
        return EligibilityCriteria.isValid(this);
    };

    EligibilityCriteria.prototype.objModelName = "EligibilityCriteria";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    EligibilityCriteria.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("BusinessConfigObjService", "EligibilityCriteria", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    EligibilityCriteria.clone = function(objectToClone) {
        var clonedObj = new EligibilityCriteria();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return EligibilityCriteria;
});