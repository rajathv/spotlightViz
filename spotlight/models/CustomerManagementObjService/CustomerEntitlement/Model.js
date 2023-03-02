/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "CustomerEntitlement", "objectService" : "CustomerManagementObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function CustomerEntitlement(defaultValues) {
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
    BaseModel.isParentOf(CustomerEntitlement);

    //Create new class level validator object
    BaseModel.Validator.call(CustomerEntitlement);

    var registerValidatorBackup = CustomerEntitlement.registerValidator;

    CustomerEntitlement.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(CustomerEntitlement.isValid(this, propName, val)) {
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
    //For Operation 'GetAllEntitlements' with service id 'get_service8801'
     CustomerEntitlement.GetAllEntitlements = function(params, onCompletion){
        return CustomerEntitlement.customVerb('GetAllEntitlements', params, onCompletion);
     };

    //For Operation 'GetCustomerEntitlement' with service id 'GetCustomerEntitlement6638'
     CustomerEntitlement.GetCustomerEntitlement = function(params, onCompletion){
        return CustomerEntitlement.customVerb('GetCustomerEntitlement', params, onCompletion);
     };

    //For Operation 'GetIndirectEntitlements' with service id 'get_customer_indirect_permissions_view5446'
     CustomerEntitlement.GetIndirectEntitlements = function(params, onCompletion){
        return CustomerEntitlement.customVerb('GetIndirectEntitlements', params, onCompletion);
     };

    //For Operation 'EditCustomerEntitlement' with service id 'EditCustomerEntitlement7975'
     CustomerEntitlement.EditCustomerEntitlement = function(params, onCompletion){
        return CustomerEntitlement.customVerb('EditCustomerEntitlement', params, onCompletion);
     };

    var relations = [];

    CustomerEntitlement.relations = relations;

    CustomerEntitlement.prototype.isValid = function() {
        return CustomerEntitlement.isValid(this);
    };

    CustomerEntitlement.prototype.objModelName = "CustomerEntitlement";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    CustomerEntitlement.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustomerManagementObjService", "CustomerEntitlement", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    CustomerEntitlement.clone = function(objectToClone) {
        var clonedObj = new CustomerEntitlement();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return CustomerEntitlement;
});