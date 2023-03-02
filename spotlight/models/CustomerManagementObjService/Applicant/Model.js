/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "Applicant", "objectService" : "CustomerManagementObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function Applicant(defaultValues) {
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
    BaseModel.isParentOf(Applicant);

    //Create new class level validator object
    BaseModel.Validator.call(Applicant);

    var registerValidatorBackup = Applicant.registerValidator;

    Applicant.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(Applicant.isValid(this, propName, val)) {
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
    //For Operation 'createApplicantAO' with service id 'createApplicantViaAssistedOnboarding4284'
     Applicant.createApplicantAO = function(params, onCompletion){
        return Applicant.customVerb('createApplicantAO', params, onCompletion);
     };

    //For Operation 'getApplicantStatus' with service id 'getApplicantStatus3171'
     Applicant.getApplicantStatus = function(params, onCompletion){
        return Applicant.customVerb('getApplicantStatus', params, onCompletion);
     };

    //For Operation 'deleteApplicant' with service id 'deleteApplicant6232'
     Applicant.deleteApplicant = function(params, onCompletion){
        return Applicant.customVerb('deleteApplicant', params, onCompletion);
     };

    //For Operation 'createApplicantViaAssistedOnboarding' with service id 'createApplicantViaAssistedOnboarding3503'
     Applicant.createApplicantViaAssistedOnboarding = function(params, onCompletion){
        return Applicant.customVerb('createApplicantViaAssistedOnboarding', params, onCompletion);
     };

    //For Operation 'createApplicant' with service id 'createApplicant9796'
     Applicant.createApplicant = function(params, onCompletion){
        return Applicant.customVerb('createApplicant', params, onCompletion);
     };

    var relations = [];

    Applicant.relations = relations;

    Applicant.prototype.isValid = function() {
        return Applicant.isValid(this);
    };

    Applicant.prototype.objModelName = "Applicant";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    Applicant.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustomerManagementObjService", "Applicant", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    Applicant.clone = function(objectToClone) {
        var clonedObj = new Applicant();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return Applicant;
});