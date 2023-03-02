/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "CustomerSecurityQuestions", "objectService" : "CustomerManagementObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function CustomerSecurityQuestions(defaultValues) {
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
    BaseModel.isParentOf(CustomerSecurityQuestions);

    //Create new class level validator object
    BaseModel.Validator.call(CustomerSecurityQuestions);

    var registerValidatorBackup = CustomerSecurityQuestions.registerValidator;

    CustomerSecurityQuestions.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(CustomerSecurityQuestions.isValid(this, propName, val)) {
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
    //For Operation 'verifyCustomerSecurityQuestions' with service id 'verifyCustomerSecurityQuestions9039'
     CustomerSecurityQuestions.verifyCustomerSecurityQuestions = function(params, onCompletion){
        return CustomerSecurityQuestions.customVerb('verifyCustomerSecurityQuestions', params, onCompletion);
     };

    //For Operation 'fetchRandomSecurityQuestions' with service id 'getRandomCustomerSecurityQuestion6014'
     CustomerSecurityQuestions.fetchRandomSecurityQuestions = function(params, onCompletion){
        return CustomerSecurityQuestions.customVerb('fetchRandomSecurityQuestions', params, onCompletion);
     };

    //For Operation 'createCustomerSecurityQuestions' with service id 'createCustomerSecurityQuestions9416'
     CustomerSecurityQuestions.createCustomerSecurityQuestions = function(params, onCompletion){
        return CustomerSecurityQuestions.customVerb('createCustomerSecurityQuestions', params, onCompletion);
     };

    var relations = [];

    CustomerSecurityQuestions.relations = relations;

    CustomerSecurityQuestions.prototype.isValid = function() {
        return CustomerSecurityQuestions.isValid(this);
    };

    CustomerSecurityQuestions.prototype.objModelName = "CustomerSecurityQuestions";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    CustomerSecurityQuestions.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustomerManagementObjService", "CustomerSecurityQuestions", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    CustomerSecurityQuestions.clone = function(objectToClone) {
        var clonedObj = new CustomerSecurityQuestions();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return CustomerSecurityQuestions;
});