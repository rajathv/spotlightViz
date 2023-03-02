/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "messageTemplate", "objectService" : "CustServiceObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function messageTemplate(defaultValues) {
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
    BaseModel.isParentOf(messageTemplate);

    //Create new class level validator object
    BaseModel.Validator.call(messageTemplate);

    var registerValidatorBackup = messageTemplate.registerValidator;

    messageTemplate.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(messageTemplate.isValid(this, propName, val)) {
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
    //For Operation 'deleteMessageTemplate' with service id 'deleteMessageTemplate1285'
     messageTemplate.deleteMessageTemplate = function(params, onCompletion){
        return messageTemplate.customVerb('deleteMessageTemplate', params, onCompletion);
     };

    //For Operation 'updateMessageTemplate' with service id 'updateMessageTemplate3193'
     messageTemplate.updateMessageTemplate = function(params, onCompletion){
        return messageTemplate.customVerb('updateMessageTemplate', params, onCompletion);
     };

    //For Operation 'getMessageTemplate' with service id 'get_messagetemplate2807'
     messageTemplate.getMessageTemplate = function(params, onCompletion){
        return messageTemplate.customVerb('getMessageTemplate', params, onCompletion);
     };

    //For Operation 'createMessageTemplate' with service id 'createMessageTemplate7858'
     messageTemplate.createMessageTemplate = function(params, onCompletion){
        return messageTemplate.customVerb('createMessageTemplate', params, onCompletion);
     };

    var relations = [];

    messageTemplate.relations = relations;

    messageTemplate.prototype.isValid = function() {
        return messageTemplate.isValid(this);
    };

    messageTemplate.prototype.objModelName = "messageTemplate";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    messageTemplate.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustServiceObjService", "messageTemplate", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    messageTemplate.clone = function(objectToClone) {
        var clonedObj = new messageTemplate();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return messageTemplate;
});