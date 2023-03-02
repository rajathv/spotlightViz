/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "internalUserProfile_view", "objectService" : "InternalusersObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function internalUserProfile_view(defaultValues) {
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
    BaseModel.isParentOf(internalUserProfile_view);

    //Create new class level validator object
    BaseModel.Validator.call(internalUserProfile_view);

    var registerValidatorBackup = internalUserProfile_view.registerValidator;

    internalUserProfile_view.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(internalUserProfile_view.isValid(this, propName, val)) {
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
    //For Operation 'GetUserProfile' with service id 'getUserProfile3307'
     internalUserProfile_view.GetUserProfile = function(params, onCompletion){
        return internalUserProfile_view.customVerb('GetUserProfile', params, onCompletion);
     };

    var relations = [];

    internalUserProfile_view.relations = relations;

    internalUserProfile_view.prototype.isValid = function() {
        return internalUserProfile_view.isValid(this);
    };

    internalUserProfile_view.prototype.objModelName = "internalUserProfile_view";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    internalUserProfile_view.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("InternalusersObjService", "internalUserProfile_view", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    internalUserProfile_view.clone = function(objectToClone) {
        var clonedObj = new internalUserProfile_view();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return internalUserProfile_view;
});