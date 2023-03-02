/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "ServiceAndServiceComm", "objectService" : "CustServiceObjService"};

    var setterFunctions = {
        ServiceCommunication_createdby: function(val, state) {
            context["field"] = "ServiceCommunication_createdby";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_createdby"] : null);
            state['ServiceCommunication_createdby'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_createdts: function(val, state) {
            context["field"] = "ServiceCommunication_createdts";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_createdts"] : null);
            state['ServiceCommunication_createdts'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_Description: function(val, state) {
            context["field"] = "ServiceCommunication_Description";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Description"] : null);
            state['ServiceCommunication_Description'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_Extension: function(val, state) {
            context["field"] = "ServiceCommunication_Extension";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Extension"] : null);
            state['ServiceCommunication_Extension'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_id: function(val, state) {
            context["field"] = "ServiceCommunication_id";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_id"] : null);
            state['ServiceCommunication_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_lastmodifiedts: function(val, state) {
            context["field"] = "ServiceCommunication_lastmodifiedts";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_lastmodifiedts"] : null);
            state['ServiceCommunication_lastmodifiedts'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_modifiedby: function(val, state) {
            context["field"] = "ServiceCommunication_modifiedby";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_modifiedby"] : null);
            state['ServiceCommunication_modifiedby'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_Priority: function(val, state) {
            context["field"] = "ServiceCommunication_Priority";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Priority"] : null);
            state['ServiceCommunication_Priority'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_SoftDeleteFlag: function(val, state) {
            context["field"] = "ServiceCommunication_SoftDeleteFlag";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_SoftDeleteFlag"] : null);
            state['ServiceCommunication_SoftDeleteFlag'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_Status_id: function(val, state) {
            context["field"] = "ServiceCommunication_Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Status_id"] : null);
            state['ServiceCommunication_Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_synctimestamp: function(val, state) {
            context["field"] = "ServiceCommunication_synctimestamp";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_synctimestamp"] : null);
            state['ServiceCommunication_synctimestamp'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_Typeid: function(val, state) {
            context["field"] = "ServiceCommunication_Typeid";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Typeid"] : null);
            state['ServiceCommunication_Typeid'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        ServiceCommunication_Value: function(val, state) {
            context["field"] = "ServiceCommunication_Value";
            context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Value"] : null);
            state['ServiceCommunication_Value'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_Channel_id: function(val, state) {
            context["field"] = "Service_Channel_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Channel_id"] : null);
            state['Service_Channel_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_Description: function(val, state) {
            context["field"] = "Service_Description";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Description"] : null);
            state['Service_Description'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_id: function(val, state) {
            context["field"] = "Service_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_id"] : null);
            state['Service_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_Name: function(val, state) {
            context["field"] = "Service_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Name"] : null);
            state['Service_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_Notes: function(val, state) {
            context["field"] = "Service_Notes";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Notes"] : null);
            state['Service_Notes'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_SoftDeleteFlag: function(val, state) {
            context["field"] = "Service_SoftDeleteFlag";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_SoftDeleteFlag"] : null);
            state['Service_SoftDeleteFlag'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_Status_id: function(val, state) {
            context["field"] = "Service_Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Status_id"] : null);
            state['Service_Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function ServiceAndServiceComm(defaultValues) {
        var privateState = {};
        context["field"] = "ServiceCommunication_createdby";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_createdby"] : null);
        privateState.ServiceCommunication_createdby = defaultValues ?
            (defaultValues["ServiceCommunication_createdby"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_createdby"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_createdts";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_createdts"] : null);
        privateState.ServiceCommunication_createdts = defaultValues ?
            (defaultValues["ServiceCommunication_createdts"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_createdts"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_Description";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Description"] : null);
        privateState.ServiceCommunication_Description = defaultValues ?
            (defaultValues["ServiceCommunication_Description"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_Description"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_Extension";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Extension"] : null);
        privateState.ServiceCommunication_Extension = defaultValues ?
            (defaultValues["ServiceCommunication_Extension"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_Extension"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_id";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_id"] : null);
        privateState.ServiceCommunication_id = defaultValues ?
            (defaultValues["ServiceCommunication_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_id"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_lastmodifiedts";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_lastmodifiedts"] : null);
        privateState.ServiceCommunication_lastmodifiedts = defaultValues ?
            (defaultValues["ServiceCommunication_lastmodifiedts"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_lastmodifiedts"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_modifiedby";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_modifiedby"] : null);
        privateState.ServiceCommunication_modifiedby = defaultValues ?
            (defaultValues["ServiceCommunication_modifiedby"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_modifiedby"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_Priority";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Priority"] : null);
        privateState.ServiceCommunication_Priority = defaultValues ?
            (defaultValues["ServiceCommunication_Priority"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_Priority"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_SoftDeleteFlag";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_SoftDeleteFlag"] : null);
        privateState.ServiceCommunication_SoftDeleteFlag = defaultValues ?
            (defaultValues["ServiceCommunication_SoftDeleteFlag"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_SoftDeleteFlag"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Status_id"] : null);
        privateState.ServiceCommunication_Status_id = defaultValues ?
            (defaultValues["ServiceCommunication_Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_Status_id"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_synctimestamp";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_synctimestamp"] : null);
        privateState.ServiceCommunication_synctimestamp = defaultValues ?
            (defaultValues["ServiceCommunication_synctimestamp"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_synctimestamp"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_Typeid";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Typeid"] : null);
        privateState.ServiceCommunication_Typeid = defaultValues ?
            (defaultValues["ServiceCommunication_Typeid"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_Typeid"], context) :
                null) :
            null;

        context["field"] = "ServiceCommunication_Value";
        context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Value"] : null);
        privateState.ServiceCommunication_Value = defaultValues ?
            (defaultValues["ServiceCommunication_Value"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ServiceCommunication_Value"], context) :
                null) :
            null;

        context["field"] = "Service_Channel_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Channel_id"] : null);
        privateState.Service_Channel_id = defaultValues ?
            (defaultValues["Service_Channel_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Channel_id"], context) :
                null) :
            null;

        context["field"] = "Service_Description";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Description"] : null);
        privateState.Service_Description = defaultValues ?
            (defaultValues["Service_Description"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Description"], context) :
                null) :
            null;

        context["field"] = "Service_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_id"] : null);
        privateState.Service_id = defaultValues ?
            (defaultValues["Service_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_id"], context) :
                null) :
            null;

        context["field"] = "Service_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Name"] : null);
        privateState.Service_Name = defaultValues ?
            (defaultValues["Service_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Name"], context) :
                null) :
            null;

        context["field"] = "Service_Notes";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Notes"] : null);
        privateState.Service_Notes = defaultValues ?
            (defaultValues["Service_Notes"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Notes"], context) :
                null) :
            null;

        context["field"] = "Service_SoftDeleteFlag";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_SoftDeleteFlag"] : null);
        privateState.Service_SoftDeleteFlag = defaultValues ?
            (defaultValues["Service_SoftDeleteFlag"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_SoftDeleteFlag"], context) :
                null) :
            null;

        context["field"] = "Service_Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Status_id"] : null);
        privateState.Service_Status_id = defaultValues ?
            (defaultValues["Service_Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Status_id"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "ServiceCommunication_createdby": {
                get: function() {
                    context["field"] = "ServiceCommunication_createdby";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_createdby"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_createdby, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_createdby'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_createdts": {
                get: function() {
                    context["field"] = "ServiceCommunication_createdts";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_createdts"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_createdts, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_createdts'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_Description": {
                get: function() {
                    context["field"] = "ServiceCommunication_Description";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Description"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_Description, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_Description'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_Extension": {
                get: function() {
                    context["field"] = "ServiceCommunication_Extension";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Extension"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_Extension, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_Extension'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_id": {
                get: function() {
                    context["field"] = "ServiceCommunication_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_id, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_lastmodifiedts": {
                get: function() {
                    context["field"] = "ServiceCommunication_lastmodifiedts";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_lastmodifiedts"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_lastmodifiedts, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_lastmodifiedts'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_modifiedby": {
                get: function() {
                    context["field"] = "ServiceCommunication_modifiedby";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_modifiedby"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_modifiedby, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_modifiedby'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_Priority": {
                get: function() {
                    context["field"] = "ServiceCommunication_Priority";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Priority"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_Priority, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_Priority'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_SoftDeleteFlag": {
                get: function() {
                    context["field"] = "ServiceCommunication_SoftDeleteFlag";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_SoftDeleteFlag"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_SoftDeleteFlag, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_SoftDeleteFlag'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_Status_id": {
                get: function() {
                    context["field"] = "ServiceCommunication_Status_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Status_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_Status_id, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_Status_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_synctimestamp": {
                get: function() {
                    context["field"] = "ServiceCommunication_synctimestamp";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_synctimestamp"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_synctimestamp, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_synctimestamp'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_Typeid": {
                get: function() {
                    context["field"] = "ServiceCommunication_Typeid";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Typeid"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_Typeid, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_Typeid'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "ServiceCommunication_Value": {
                get: function() {
                    context["field"] = "ServiceCommunication_Value";
                    context["metadata"] = (objectMetadata ? objectMetadata["ServiceCommunication_Value"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ServiceCommunication_Value, context);
                },
                set: function(val) {
                    setterFunctions['ServiceCommunication_Value'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_Channel_id": {
                get: function() {
                    context["field"] = "Service_Channel_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_Channel_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_Channel_id, context);
                },
                set: function(val) {
                    setterFunctions['Service_Channel_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_Description": {
                get: function() {
                    context["field"] = "Service_Description";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_Description"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_Description, context);
                },
                set: function(val) {
                    setterFunctions['Service_Description'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_id": {
                get: function() {
                    context["field"] = "Service_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_id, context);
                },
                set: function(val) {
                    setterFunctions['Service_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_Name": {
                get: function() {
                    context["field"] = "Service_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_Name, context);
                },
                set: function(val) {
                    setterFunctions['Service_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_Notes": {
                get: function() {
                    context["field"] = "Service_Notes";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_Notes"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_Notes, context);
                },
                set: function(val) {
                    setterFunctions['Service_Notes'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_SoftDeleteFlag": {
                get: function() {
                    context["field"] = "Service_SoftDeleteFlag";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_SoftDeleteFlag"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_SoftDeleteFlag, context);
                },
                set: function(val) {
                    setterFunctions['Service_SoftDeleteFlag'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Service_Status_id": {
                get: function() {
                    context["field"] = "Service_Status_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_Status_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_Status_id, context);
                },
                set: function(val) {
                    setterFunctions['Service_Status_id'].call(this, val, privateState);
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
            privateState.ServiceCommunication_createdby = value ? (value["ServiceCommunication_createdby"] ? value["ServiceCommunication_createdby"] : null) : null;
            privateState.ServiceCommunication_createdts = value ? (value["ServiceCommunication_createdts"] ? value["ServiceCommunication_createdts"] : null) : null;
            privateState.ServiceCommunication_Description = value ? (value["ServiceCommunication_Description"] ? value["ServiceCommunication_Description"] : null) : null;
            privateState.ServiceCommunication_Extension = value ? (value["ServiceCommunication_Extension"] ? value["ServiceCommunication_Extension"] : null) : null;
            privateState.ServiceCommunication_id = value ? (value["ServiceCommunication_id"] ? value["ServiceCommunication_id"] : null) : null;
            privateState.ServiceCommunication_lastmodifiedts = value ? (value["ServiceCommunication_lastmodifiedts"] ? value["ServiceCommunication_lastmodifiedts"] : null) : null;
            privateState.ServiceCommunication_modifiedby = value ? (value["ServiceCommunication_modifiedby"] ? value["ServiceCommunication_modifiedby"] : null) : null;
            privateState.ServiceCommunication_Priority = value ? (value["ServiceCommunication_Priority"] ? value["ServiceCommunication_Priority"] : null) : null;
            privateState.ServiceCommunication_SoftDeleteFlag = value ? (value["ServiceCommunication_SoftDeleteFlag"] ? value["ServiceCommunication_SoftDeleteFlag"] : null) : null;
            privateState.ServiceCommunication_Status_id = value ? (value["ServiceCommunication_Status_id"] ? value["ServiceCommunication_Status_id"] : null) : null;
            privateState.ServiceCommunication_synctimestamp = value ? (value["ServiceCommunication_synctimestamp"] ? value["ServiceCommunication_synctimestamp"] : null) : null;
            privateState.ServiceCommunication_Typeid = value ? (value["ServiceCommunication_Typeid"] ? value["ServiceCommunication_Typeid"] : null) : null;
            privateState.ServiceCommunication_Value = value ? (value["ServiceCommunication_Value"] ? value["ServiceCommunication_Value"] : null) : null;
            privateState.Service_Channel_id = value ? (value["Service_Channel_id"] ? value["Service_Channel_id"] : null) : null;
            privateState.Service_Description = value ? (value["Service_Description"] ? value["Service_Description"] : null) : null;
            privateState.Service_id = value ? (value["Service_id"] ? value["Service_id"] : null) : null;
            privateState.Service_Name = value ? (value["Service_Name"] ? value["Service_Name"] : null) : null;
            privateState.Service_Notes = value ? (value["Service_Notes"] ? value["Service_Notes"] : null) : null;
            privateState.Service_SoftDeleteFlag = value ? (value["Service_SoftDeleteFlag"] ? value["Service_SoftDeleteFlag"] : null) : null;
            privateState.Service_Status_id = value ? (value["Service_Status_id"] ? value["Service_Status_id"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(ServiceAndServiceComm);

    //Create new class level validator object
    BaseModel.Validator.call(ServiceAndServiceComm);

    var registerValidatorBackup = ServiceAndServiceComm.registerValidator;

    ServiceAndServiceComm.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(ServiceAndServiceComm.isValid(this, propName, val)) {
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
    //For Operation 'contactUs' with service id 'getCustomerServiceAndCommunicationRecords2226'
     ServiceAndServiceComm.contactUs = function(params, onCompletion){
        return ServiceAndServiceComm.customVerb('contactUs', params, onCompletion);
     };

    //For Operation 'editServiceAndServiceCommunicationRecords' with service id 'editServiceAndCommunicationRecords8919'
     ServiceAndServiceComm.editServiceAndServiceCommunicationRecords = function(params, onCompletion){
        return ServiceAndServiceComm.customVerb('editServiceAndServiceCommunicationRecords', params, onCompletion);
     };

    //For Operation 'deleteServiceAndServiceCommunicationRecords' with service id 'deleteServiceAndCommunicationRecords3776'
     ServiceAndServiceComm.deleteServiceAndServiceCommunicationRecords = function(params, onCompletion){
        return ServiceAndServiceComm.customVerb('deleteServiceAndServiceCommunicationRecords', params, onCompletion);
     };

    //For Operation 'createServiceAndServiceCommunicationRecords' with service id 'createServiceAndCommunicationRecords6537'
     ServiceAndServiceComm.createServiceAndServiceCommunicationRecords = function(params, onCompletion){
        return ServiceAndServiceComm.customVerb('createServiceAndServiceCommunicationRecords', params, onCompletion);
     };

    //For Operation 'getServiceAndServiceCommunicationRecords' with service id 'getCustomerServiceAndCommunicationRecords3348'
     ServiceAndServiceComm.getServiceAndServiceCommunicationRecords = function(params, onCompletion){
        return ServiceAndServiceComm.customVerb('getServiceAndServiceCommunicationRecords', params, onCompletion);
     };

    var relations = [];

    ServiceAndServiceComm.relations = relations;

    ServiceAndServiceComm.prototype.isValid = function() {
        return ServiceAndServiceComm.isValid(this);
    };

    ServiceAndServiceComm.prototype.objModelName = "ServiceAndServiceComm";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    ServiceAndServiceComm.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("CustServiceObjService", "ServiceAndServiceComm", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    ServiceAndServiceComm.clone = function(objectToClone) {
        var clonedObj = new ServiceAndServiceComm();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return ServiceAndServiceComm;
});