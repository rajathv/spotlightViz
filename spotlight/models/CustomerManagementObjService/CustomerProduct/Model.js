/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "CustomerProduct", "objectService" : "CustomerManagementObjService"};

    var setterFunctions = {
    };

    //Create the Model Class
    function CustomerProduct(defaultValues) {
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
    BaseModel.isParentOf(CustomerProduct);

    //Create new class level validator object
    BaseModel.Validator.call(CustomerProduct);

    var registerValidatorBackup = CustomerProduct.registerValidator;

    CustomerProduct.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(CustomerProduct.isValid(this, propName, val)) {
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
    //For Operation 'GetCustomerProducts' with service id 'GetCustomerProducts5310'
     CustomerProduct.GetCustomerProducts = function(params, onCompletion){
        return CustomerProduct.customVerb('GetCustomerProducts', params, onCompletion);
     };

    //For Operation 'GetAllProducts' with service id 'get_product3611'
     CustomerProduct.GetAllProducts = function(params, onCompletion){
        return CustomerProduct.customVerb('GetAllProducts', params, onCompletion);
     };

    //For Operation 'GetAccountSpecificAlerts' with service id 'GetAccountSpecificAlerts9991'
     CustomerProduct.GetAccountSpecificAlerts = function(params, onCompletion){
        return CustomerProduct.customVerb('GetAccountSpecificAlerts', params, onCompletion);
     };

    //For Operation 'updateEstatementStatus' with service id 'updateEstatementStatus1504'
     CustomerProduct.updateEstatementStatus = function(params, onCompletion){
        return CustomerProduct.customVerb('updateEstatementStatus', params, onCompletion);
     };

    var relations = [];

    CustomerProduct.relations = relations;

    CustomerProduct.prototype.isValid = function() {
        return CustomerProduct.isValid(this);
    };

    CustomerProduct.prototype.objModelName = "CustomerProduct";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    CustomerProduct.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustomerManagementObjService", "CustomerProduct", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    CustomerProduct.clone = function(objectToClone) {
        var clonedObj = new CustomerProduct();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return CustomerProduct;
});