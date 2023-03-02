/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "CustomerGroup", "objectService" : "CustomerManagementObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function CustomerGroup(defaultValues) {
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
    BaseModel.isParentOf(CustomerGroup);

    //Create new class level validator object
    BaseModel.Validator.call(CustomerGroup);

    var registerValidatorBackup = CustomerGroup.registerValidator;

    CustomerGroup.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(CustomerGroup.isValid(this, propName, val)) {
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
    //For Operation 'GetCustomerGroup' with service id 'GetCustomerGroup6154'
     CustomerGroup.GetCustomerGroup = function(params, onCompletion){
        return CustomerGroup.customVerb('GetCustomerGroup', params, onCompletion);
     };

    //For Operation 'createCustomerGroup' with service id 'createCustomerGroup7380'
     CustomerGroup.createCustomerGroup = function(params, onCompletion){
        return CustomerGroup.customVerb('createCustomerGroup', params, onCompletion);
     };

    //For Operation 'GetAllGroups' with service id 'GetAllGroups8267'
     CustomerGroup.GetAllGroups = function(params, onCompletion){
        return CustomerGroup.customVerb('GetAllGroups', params, onCompletion);
     };

    //For Operation 'EditCustomerGroup' with service id 'EditCustomerGroup1451'
     CustomerGroup.EditCustomerGroup = function(params, onCompletion){
        return CustomerGroup.customVerb('EditCustomerGroup', params, onCompletion);
     };

    var relations = [];

    CustomerGroup.relations = relations;

    CustomerGroup.prototype.isValid = function() {
        return CustomerGroup.isValid(this);
    };

    CustomerGroup.prototype.objModelName = "CustomerGroup";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    CustomerGroup.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustomerManagementObjService", "CustomerGroup", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    CustomerGroup.clone = function(objectToClone) {
        var clonedObj = new CustomerGroup();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return CustomerGroup;
});