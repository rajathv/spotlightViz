/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "TravelNotification", "objectService" : "AccountRequestsObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function TravelNotification(defaultValues) {
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
    BaseModel.isParentOf(TravelNotification);

    //Create new class level validator object
    BaseModel.Validator.call(TravelNotification);

    var registerValidatorBackup = TravelNotification.registerValidator;

    TravelNotification.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(TravelNotification.isValid(this, propName, val)) {
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
    //For Operation 'deleteTravelNotification' with service id 'deleteTravelNotification1376'
     TravelNotification.deleteTravelNotification = function(params, onCompletion){
        return TravelNotification.customVerb('deleteTravelNotification', params, onCompletion);
     };

    //For Operation 'cancelTravelNotification' with service id 'cancelTravelNotification6424'
     TravelNotification.cancelTravelNotification = function(params, onCompletion){
        return TravelNotification.customVerb('cancelTravelNotification', params, onCompletion);
     };

    //For Operation 'getTravelNotification' with service id 'getTravelNotification1347'
     TravelNotification.getTravelNotification = function(params, onCompletion){
        return TravelNotification.customVerb('getTravelNotification', params, onCompletion);
     };

    //For Operation 'createTravelNotification' with service id 'createTravelNotification3601'
     TravelNotification.createTravelNotification = function(params, onCompletion){
        return TravelNotification.customVerb('createTravelNotification', params, onCompletion);
     };

    //For Operation 'updateTravelNotification' with service id 'updateTraveNotification4429'
     TravelNotification.updateTravelNotification = function(params, onCompletion){
        return TravelNotification.customVerb('updateTravelNotification', params, onCompletion);
     };

    //For Operation 'getTravelNotificationStatus' with service id 'getTravelNotificationStatus4726'
     TravelNotification.getTravelNotificationStatus = function(params, onCompletion){
        return TravelNotification.customVerb('getTravelNotificationStatus', params, onCompletion);
     };

    var relations = [];

    TravelNotification.relations = relations;

    TravelNotification.prototype.isValid = function() {
        return TravelNotification.isValid(this);
    };

    TravelNotification.prototype.objModelName = "TravelNotification";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    TravelNotification.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("AccountRequestsObjService", "TravelNotification", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    TravelNotification.clone = function(objectToClone) {
        var clonedObj = new TravelNotification();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return TravelNotification;
});