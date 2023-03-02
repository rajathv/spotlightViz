/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "email", "objectService" : "EmailObjService"};

    var setterFunctions = {
        AdditionalContext: function(val, state) {
            context["field"] = "AdditionalContext";
            context["metadata"] = (objectMetadata ? objectMetadata["AdditionalContext"] : null);
            state['AdditionalContext'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        cc: function(val, state) {
            context["field"] = "cc";
            context["metadata"] = (objectMetadata ? objectMetadata["cc"] : null);
            state['cc'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        emailSubject: function(val, state) {
            context["field"] = "emailSubject";
            context["metadata"] = (objectMetadata ? objectMetadata["emailSubject"] : null);
            state['emailSubject'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        emailType: function(val, state) {
            context["field"] = "emailType";
            context["metadata"] = (objectMetadata ? objectMetadata["emailType"] : null);
            state['emailType'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        password: function(val, state) {
            context["field"] = "password";
            context["metadata"] = (objectMetadata ? objectMetadata["password"] : null);
            state['password'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        recipientEmailId: function(val, state) {
            context["field"] = "recipientEmailId";
            context["metadata"] = (objectMetadata ? objectMetadata["recipientEmailId"] : null);
            state['recipientEmailId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        senderEmailId: function(val, state) {
            context["field"] = "senderEmailId";
            context["metadata"] = (objectMetadata ? objectMetadata["senderEmailId"] : null);
            state['senderEmailId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        userid: function(val, state) {
            context["field"] = "userid";
            context["metadata"] = (objectMetadata ? objectMetadata["userid"] : null);
            state['userid'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        vizServerURL: function(val, state) {
            context["field"] = "vizServerURL";
            context["metadata"] = (objectMetadata ? objectMetadata["vizServerURL"] : null);
            state['vizServerURL'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        XKonyAuthorization: function(val, state) {
            context["field"] = "XKonyAuthorization";
            context["metadata"] = (objectMetadata ? objectMetadata["XKonyAuthorization"] : null);
            state['XKonyAuthorization'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function email(defaultValues) {
        var privateState = {};
        context["field"] = "AdditionalContext";
        context["metadata"] = (objectMetadata ? objectMetadata["AdditionalContext"] : null);
        privateState.AdditionalContext = defaultValues ?
            (defaultValues["AdditionalContext"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["AdditionalContext"], context) :
                null) :
            null;

        context["field"] = "cc";
        context["metadata"] = (objectMetadata ? objectMetadata["cc"] : null);
        privateState.cc = defaultValues ?
            (defaultValues["cc"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["cc"], context) :
                null) :
            null;

        context["field"] = "emailSubject";
        context["metadata"] = (objectMetadata ? objectMetadata["emailSubject"] : null);
        privateState.emailSubject = defaultValues ?
            (defaultValues["emailSubject"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["emailSubject"], context) :
                null) :
            null;

        context["field"] = "emailType";
        context["metadata"] = (objectMetadata ? objectMetadata["emailType"] : null);
        privateState.emailType = defaultValues ?
            (defaultValues["emailType"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["emailType"], context) :
                null) :
            null;

        context["field"] = "password";
        context["metadata"] = (objectMetadata ? objectMetadata["password"] : null);
        privateState.password = defaultValues ?
            (defaultValues["password"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["password"], context) :
                null) :
            null;

        context["field"] = "recipientEmailId";
        context["metadata"] = (objectMetadata ? objectMetadata["recipientEmailId"] : null);
        privateState.recipientEmailId = defaultValues ?
            (defaultValues["recipientEmailId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["recipientEmailId"], context) :
                null) :
            null;

        context["field"] = "senderEmailId";
        context["metadata"] = (objectMetadata ? objectMetadata["senderEmailId"] : null);
        privateState.senderEmailId = defaultValues ?
            (defaultValues["senderEmailId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["senderEmailId"], context) :
                null) :
            null;

        context["field"] = "userid";
        context["metadata"] = (objectMetadata ? objectMetadata["userid"] : null);
        privateState.userid = defaultValues ?
            (defaultValues["userid"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["userid"], context) :
                null) :
            null;

        context["field"] = "vizServerURL";
        context["metadata"] = (objectMetadata ? objectMetadata["vizServerURL"] : null);
        privateState.vizServerURL = defaultValues ?
            (defaultValues["vizServerURL"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["vizServerURL"], context) :
                null) :
            null;

        context["field"] = "XKonyAuthorization";
        context["metadata"] = (objectMetadata ? objectMetadata["XKonyAuthorization"] : null);
        privateState.XKonyAuthorization = defaultValues ?
            (defaultValues["XKonyAuthorization"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["XKonyAuthorization"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "AdditionalContext": {
                get: function() {
                    context["field"] = "AdditionalContext";
                    context["metadata"] = (objectMetadata ? objectMetadata["AdditionalContext"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.AdditionalContext, context);
                },
                set: function(val) {
                    setterFunctions['AdditionalContext'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "cc": {
                get: function() {
                    context["field"] = "cc";
                    context["metadata"] = (objectMetadata ? objectMetadata["cc"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.cc, context);
                },
                set: function(val) {
                    setterFunctions['cc'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "emailSubject": {
                get: function() {
                    context["field"] = "emailSubject";
                    context["metadata"] = (objectMetadata ? objectMetadata["emailSubject"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.emailSubject, context);
                },
                set: function(val) {
                    setterFunctions['emailSubject'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "emailType": {
                get: function() {
                    context["field"] = "emailType";
                    context["metadata"] = (objectMetadata ? objectMetadata["emailType"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.emailType, context);
                },
                set: function(val) {
                    setterFunctions['emailType'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "password": {
                get: function() {
                    context["field"] = "password";
                    context["metadata"] = (objectMetadata ? objectMetadata["password"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.password, context);
                },
                set: function(val) {
                    setterFunctions['password'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "recipientEmailId": {
                get: function() {
                    context["field"] = "recipientEmailId";
                    context["metadata"] = (objectMetadata ? objectMetadata["recipientEmailId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.recipientEmailId, context);
                },
                set: function(val) {
                    setterFunctions['recipientEmailId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "senderEmailId": {
                get: function() {
                    context["field"] = "senderEmailId";
                    context["metadata"] = (objectMetadata ? objectMetadata["senderEmailId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.senderEmailId, context);
                },
                set: function(val) {
                    setterFunctions['senderEmailId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "userid": {
                get: function() {
                    context["field"] = "userid";
                    context["metadata"] = (objectMetadata ? objectMetadata["userid"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.userid, context);
                },
                set: function(val) {
                    setterFunctions['userid'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "vizServerURL": {
                get: function() {
                    context["field"] = "vizServerURL";
                    context["metadata"] = (objectMetadata ? objectMetadata["vizServerURL"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.vizServerURL, context);
                },
                set: function(val) {
                    setterFunctions['vizServerURL'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "XKonyAuthorization": {
                get: function() {
                    context["field"] = "XKonyAuthorization";
                    context["metadata"] = (objectMetadata ? objectMetadata["XKonyAuthorization"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.XKonyAuthorization, context);
                },
                set: function(val) {
                    setterFunctions['XKonyAuthorization'].call(this, val, privateState);
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
            privateState.AdditionalContext = value ? (value["AdditionalContext"] ? value["AdditionalContext"] : null) : null;
            privateState.cc = value ? (value["cc"] ? value["cc"] : null) : null;
            privateState.emailSubject = value ? (value["emailSubject"] ? value["emailSubject"] : null) : null;
            privateState.emailType = value ? (value["emailType"] ? value["emailType"] : null) : null;
            privateState.password = value ? (value["password"] ? value["password"] : null) : null;
            privateState.recipientEmailId = value ? (value["recipientEmailId"] ? value["recipientEmailId"] : null) : null;
            privateState.senderEmailId = value ? (value["senderEmailId"] ? value["senderEmailId"] : null) : null;
            privateState.userid = value ? (value["userid"] ? value["userid"] : null) : null;
            privateState.vizServerURL = value ? (value["vizServerURL"] ? value["vizServerURL"] : null) : null;
            privateState.XKonyAuthorization = value ? (value["XKonyAuthorization"] ? value["XKonyAuthorization"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(email);

    //Create new class level validator object
    BaseModel.Validator.call(email);

    var registerValidatorBackup = email.registerValidator;

    email.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(email.isValid(this, propName, val)) {
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
    var relations = [];

    email.relations = relations;

    email.prototype.isValid = function() {
        return email.isValid(this);
    };

    email.prototype.objModelName = "email";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    email.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("EmailObjService", "email", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    email.clone = function(objectToClone) {
        var clonedObj = new email();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return email;
});