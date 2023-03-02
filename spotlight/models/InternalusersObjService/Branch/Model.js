/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "Branch", "objectService" : "InternalusersObjService"};

    var setterFunctions = {
        Address_id: function(val, state) {
            context["field"] = "Address_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Address_id"] : null);
            state['Address_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Branch_Complete_Addr: function(val, state) {
            context["field"] = "Branch_Complete_Addr";
            context["metadata"] = (objectMetadata ? objectMetadata["Branch_Complete_Addr"] : null);
            state['Branch_Complete_Addr'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Branch_id: function(val, state) {
            context["field"] = "Branch_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Branch_id"] : null);
            state['Branch_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Branch_Name: function(val, state) {
            context["field"] = "Branch_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["Branch_Name"] : null);
            state['Branch_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        City_id: function(val, state) {
            context["field"] = "City_id";
            context["metadata"] = (objectMetadata ? objectMetadata["City_id"] : null);
            state['City_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        City_Name: function(val, state) {
            context["field"] = "City_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["City_Name"] : null);
            state['City_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function Branch(defaultValues) {
        var privateState = {};
        context["field"] = "Address_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Address_id"] : null);
        privateState.Address_id = defaultValues ?
            (defaultValues["Address_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Address_id"], context) :
                null) :
            null;

        context["field"] = "Branch_Complete_Addr";
        context["metadata"] = (objectMetadata ? objectMetadata["Branch_Complete_Addr"] : null);
        privateState.Branch_Complete_Addr = defaultValues ?
            (defaultValues["Branch_Complete_Addr"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Branch_Complete_Addr"], context) :
                null) :
            null;

        context["field"] = "Branch_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Branch_id"] : null);
        privateState.Branch_id = defaultValues ?
            (defaultValues["Branch_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Branch_id"], context) :
                null) :
            null;

        context["field"] = "Branch_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["Branch_Name"] : null);
        privateState.Branch_Name = defaultValues ?
            (defaultValues["Branch_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Branch_Name"], context) :
                null) :
            null;

        context["field"] = "City_id";
        context["metadata"] = (objectMetadata ? objectMetadata["City_id"] : null);
        privateState.City_id = defaultValues ?
            (defaultValues["City_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["City_id"], context) :
                null) :
            null;

        context["field"] = "City_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["City_Name"] : null);
        privateState.City_Name = defaultValues ?
            (defaultValues["City_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["City_Name"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "Address_id": {
                get: function() {
                    context["field"] = "Address_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Address_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Address_id, context);
                },
                set: function(val) {
                    setterFunctions['Address_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Branch_Complete_Addr": {
                get: function() {
                    context["field"] = "Branch_Complete_Addr";
                    context["metadata"] = (objectMetadata ? objectMetadata["Branch_Complete_Addr"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Branch_Complete_Addr, context);
                },
                set: function(val) {
                    setterFunctions['Branch_Complete_Addr'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Branch_id": {
                get: function() {
                    context["field"] = "Branch_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Branch_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Branch_id, context);
                },
                set: function(val) {
                    setterFunctions['Branch_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Branch_Name": {
                get: function() {
                    context["field"] = "Branch_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["Branch_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Branch_Name, context);
                },
                set: function(val) {
                    setterFunctions['Branch_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "City_id": {
                get: function() {
                    context["field"] = "City_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["City_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.City_id, context);
                },
                set: function(val) {
                    setterFunctions['City_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "City_Name": {
                get: function() {
                    context["field"] = "City_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["City_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.City_Name, context);
                },
                set: function(val) {
                    setterFunctions['City_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
        });

        //converts model object to json object.
        this.toJsonInternal = function() {
            return Object.assign({}, privateState);
        };

        //overwrites object state with provided json value in argument.
        this.fromJsonInternal = function(value) {
            privateState.Address_id = value ? (value["Address_id"] ? value["Address_id"] : null) : null;
            privateState.Branch_Complete_Addr = value ? (value["Branch_Complete_Addr"] ? value["Branch_Complete_Addr"] : null) : null;
            privateState.Branch_id = value ? (value["Branch_id"] ? value["Branch_id"] : null) : null;
            privateState.Branch_Name = value ? (value["Branch_Name"] ? value["Branch_Name"] : null) : null;
            privateState.City_id = value ? (value["City_id"] ? value["City_id"] : null) : null;
            privateState.City_Name = value ? (value["City_Name"] ? value["City_Name"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(Branch);

    //Create new class level validator object
    BaseModel.Validator.call(Branch);

    var registerValidatorBackup = Branch.registerValidator;

    Branch.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(Branch.isValid(this, propName, val)) {
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
    //For Operation 'getAllBranches' with service id 'get_branch_view7806'
     Branch.getAllBranches = function(params, onCompletion){
        return Branch.customVerb('getAllBranches', params, onCompletion);
     };

    var relations = [];

    Branch.relations = relations;

    Branch.prototype.isValid = function() {
        return Branch.isValid(this);
    };

    Branch.prototype.objModelName = "Branch";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    Branch.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("InternalusersObjService", "Branch", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    Branch.clone = function(objectToClone) {
        var clonedObj = new Branch();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return Branch;
});