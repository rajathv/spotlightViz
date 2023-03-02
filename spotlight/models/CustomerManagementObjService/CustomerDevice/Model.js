/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "CustomerDevice", "objectService" : "CustomerManagementObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function CustomerDevice(defaultValues) {
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
    BaseModel.isParentOf(CustomerDevice);

    //Create new class level validator object
    BaseModel.Validator.call(CustomerDevice);

    var registerValidatorBackup = CustomerDevice.registerValidator;

    CustomerDevice.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(CustomerDevice.isValid(this, propName, val)) {
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
    //For Operation 'RegisterCustomerDevice' with service id 'CustomerRegisterDevice4701'
     CustomerDevice.RegisterCustomerDevice = function(params, onCompletion){
        return CustomerDevice.customVerb('RegisterCustomerDevice', params, onCompletion);
     };

    //For Operation 'DeleteDevice' with service id 'deleteDevice3202'
     CustomerDevice.DeleteDevice = function(params, onCompletion){
        return CustomerDevice.customVerb('DeleteDevice', params, onCompletion);
     };

    //For Operation 'UpdateDeviceStatus' with service id 'updateDeviceStatus4113'
     CustomerDevice.UpdateDeviceStatus = function(params, onCompletion){
        return CustomerDevice.customVerb('UpdateDeviceStatus', params, onCompletion);
     };

    //For Operation 'GetCustomerDevices' with service id 'GetCustomerDevices9602'
     CustomerDevice.GetCustomerDevices = function(params, onCompletion){
        return CustomerDevice.customVerb('GetCustomerDevices', params, onCompletion);
     };

    //For Operation 'CustomerUpdateDeviceInformation' with service id 'CustomerUpdateDeviceInformation7699'
     CustomerDevice.CustomerUpdateDeviceInformation = function(params, onCompletion){
        return CustomerDevice.customVerb('CustomerUpdateDeviceInformation', params, onCompletion);
     };

    //For Operation 'IsDeviceRegistered' with service id 'IsDeviceRegistered3238'
     CustomerDevice.IsDeviceRegistered = function(params, onCompletion){
        return CustomerDevice.customVerb('IsDeviceRegistered', params, onCompletion);
     };

    //For Operation 'getUserDevices' with service id 'getUserDevices5815'
     CustomerDevice.getUserDevices = function(params, onCompletion){
        return CustomerDevice.customVerb('getUserDevices', params, onCompletion);
     };

    var relations = [];

    CustomerDevice.relations = relations;

    CustomerDevice.prototype.isValid = function() {
        return CustomerDevice.isValid(this);
    };

    CustomerDevice.prototype.objModelName = "CustomerDevice";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    CustomerDevice.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustomerManagementObjService", "CustomerDevice", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    CustomerDevice.clone = function(objectToClone) {
        var clonedObj = new CustomerDevice();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return CustomerDevice;
});