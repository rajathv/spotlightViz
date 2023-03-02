/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "LocationServicesObject", "objectService" : "LocationObjService"};

    var setterFunctions = {
        ADDRESS: function(val, state) {
            context["field"] = "ADDRESS";
            context["metadata"] = (objectMetadata ? objectMetadata["ADDRESS"] : null);
            state['ADDRESS'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Address_id: function(val, state) {
            context["field"] = "Location_Address_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Address_id"] : null);
            state['Location_Address_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Code: function(val, state) {
            context["field"] = "Location_Code";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Code"] : null);
            state['Location_Code'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_DeleteFlag: function(val, state) {
            context["field"] = "Location_DeleteFlag";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_DeleteFlag"] : null);
            state['Location_DeleteFlag'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Description: function(val, state) {
            context["field"] = "Location_Description";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Description"] : null);
            state['Location_Description'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Display_Name: function(val, state) {
            context["field"] = "Location_Display_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Display_Name"] : null);
            state['Location_Display_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_EmailId: function(val, state) {
            context["field"] = "Location_EmailId";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_EmailId"] : null);
            state['Location_EmailId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_id: function(val, state) {
            context["field"] = "Location_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_id"] : null);
            state['Location_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_IsMainBranch: function(val, state) {
            context["field"] = "Location_IsMainBranch";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_IsMainBranch"] : null);
            state['Location_IsMainBranch'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Latitude: function(val, state) {
            context["field"] = "Location_Latitude";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Latitude"] : null);
            state['Location_Latitude'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Longitude: function(val, state) {
            context["field"] = "Location_Longitude";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Longitude"] : null);
            state['Location_Longitude'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Name: function(val, state) {
            context["field"] = "Location_Name";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Name"] : null);
            state['Location_Name'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Phone_Number: function(val, state) {
            context["field"] = "Location_Phone_Number";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Phone_Number"] : null);
            state['Location_Phone_Number'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Status_id: function(val, state) {
            context["field"] = "Location_Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Status_id"] : null);
            state['Location_Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_Type_id: function(val, state) {
            context["field"] = "Location_Type_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_Type_id"] : null);
            state['Location_Type_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Location_WorkScheduleId: function(val, state) {
            context["field"] = "Location_WorkScheduleId";
            context["metadata"] = (objectMetadata ? objectMetadata["Location_WorkScheduleId"] : null);
            state['Location_WorkScheduleId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Saturday_EndTime: function(val, state) {
            context["field"] = "Saturday_EndTime";
            context["metadata"] = (objectMetadata ? objectMetadata["Saturday_EndTime"] : null);
            state['Saturday_EndTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Saturday_StartTime: function(val, state) {
            context["field"] = "Saturday_StartTime";
            context["metadata"] = (objectMetadata ? objectMetadata["Saturday_StartTime"] : null);
            state['Saturday_StartTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
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
        Service_Status_id: function(val, state) {
            context["field"] = "Service_Status_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Status_id"] : null);
            state['Service_Status_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Service_Type_id: function(val, state) {
            context["field"] = "Service_Type_id";
            context["metadata"] = (objectMetadata ? objectMetadata["Service_Type_id"] : null);
            state['Service_Type_id'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Sunday_EndTime: function(val, state) {
            context["field"] = "Sunday_EndTime";
            context["metadata"] = (objectMetadata ? objectMetadata["Sunday_EndTime"] : null);
            state['Sunday_EndTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Sunday_StartTime: function(val, state) {
            context["field"] = "Sunday_StartTime";
            context["metadata"] = (objectMetadata ? objectMetadata["Sunday_StartTime"] : null);
            state['Sunday_StartTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Weekday_EndTime: function(val, state) {
            context["field"] = "Weekday_EndTime";
            context["metadata"] = (objectMetadata ? objectMetadata["Weekday_EndTime"] : null);
            state['Weekday_EndTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        Weekday_StartTime: function(val, state) {
            context["field"] = "Weekday_StartTime";
            context["metadata"] = (objectMetadata ? objectMetadata["Weekday_StartTime"] : null);
            state['Weekday_StartTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function LocationServicesObject(defaultValues) {
        var privateState = {};
        context["field"] = "ADDRESS";
        context["metadata"] = (objectMetadata ? objectMetadata["ADDRESS"] : null);
        privateState.ADDRESS = defaultValues ?
            (defaultValues["ADDRESS"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ADDRESS"], context) :
                null) :
            null;

        context["field"] = "Location_Address_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Address_id"] : null);
        privateState.Location_Address_id = defaultValues ?
            (defaultValues["Location_Address_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Address_id"], context) :
                null) :
            null;

        context["field"] = "Location_Code";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Code"] : null);
        privateState.Location_Code = defaultValues ?
            (defaultValues["Location_Code"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Code"], context) :
                null) :
            null;

        context["field"] = "Location_DeleteFlag";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_DeleteFlag"] : null);
        privateState.Location_DeleteFlag = defaultValues ?
            (defaultValues["Location_DeleteFlag"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_DeleteFlag"], context) :
                null) :
            null;

        context["field"] = "Location_Description";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Description"] : null);
        privateState.Location_Description = defaultValues ?
            (defaultValues["Location_Description"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Description"], context) :
                null) :
            null;

        context["field"] = "Location_Display_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Display_Name"] : null);
        privateState.Location_Display_Name = defaultValues ?
            (defaultValues["Location_Display_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Display_Name"], context) :
                null) :
            null;

        context["field"] = "Location_EmailId";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_EmailId"] : null);
        privateState.Location_EmailId = defaultValues ?
            (defaultValues["Location_EmailId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_EmailId"], context) :
                null) :
            null;

        context["field"] = "Location_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_id"] : null);
        privateState.Location_id = defaultValues ?
            (defaultValues["Location_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_id"], context) :
                null) :
            null;

        context["field"] = "Location_IsMainBranch";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_IsMainBranch"] : null);
        privateState.Location_IsMainBranch = defaultValues ?
            (defaultValues["Location_IsMainBranch"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_IsMainBranch"], context) :
                null) :
            null;

        context["field"] = "Location_Latitude";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Latitude"] : null);
        privateState.Location_Latitude = defaultValues ?
            (defaultValues["Location_Latitude"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Latitude"], context) :
                null) :
            null;

        context["field"] = "Location_Longitude";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Longitude"] : null);
        privateState.Location_Longitude = defaultValues ?
            (defaultValues["Location_Longitude"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Longitude"], context) :
                null) :
            null;

        context["field"] = "Location_Name";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Name"] : null);
        privateState.Location_Name = defaultValues ?
            (defaultValues["Location_Name"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Name"], context) :
                null) :
            null;

        context["field"] = "Location_Phone_Number";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Phone_Number"] : null);
        privateState.Location_Phone_Number = defaultValues ?
            (defaultValues["Location_Phone_Number"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Phone_Number"], context) :
                null) :
            null;

        context["field"] = "Location_Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Status_id"] : null);
        privateState.Location_Status_id = defaultValues ?
            (defaultValues["Location_Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Status_id"], context) :
                null) :
            null;

        context["field"] = "Location_Type_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_Type_id"] : null);
        privateState.Location_Type_id = defaultValues ?
            (defaultValues["Location_Type_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_Type_id"], context) :
                null) :
            null;

        context["field"] = "Location_WorkScheduleId";
        context["metadata"] = (objectMetadata ? objectMetadata["Location_WorkScheduleId"] : null);
        privateState.Location_WorkScheduleId = defaultValues ?
            (defaultValues["Location_WorkScheduleId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Location_WorkScheduleId"], context) :
                null) :
            null;

        context["field"] = "Saturday_EndTime";
        context["metadata"] = (objectMetadata ? objectMetadata["Saturday_EndTime"] : null);
        privateState.Saturday_EndTime = defaultValues ?
            (defaultValues["Saturday_EndTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Saturday_EndTime"], context) :
                null) :
            null;

        context["field"] = "Saturday_StartTime";
        context["metadata"] = (objectMetadata ? objectMetadata["Saturday_StartTime"] : null);
        privateState.Saturday_StartTime = defaultValues ?
            (defaultValues["Saturday_StartTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Saturday_StartTime"], context) :
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

        context["field"] = "Service_Status_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Status_id"] : null);
        privateState.Service_Status_id = defaultValues ?
            (defaultValues["Service_Status_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Status_id"], context) :
                null) :
            null;

        context["field"] = "Service_Type_id";
        context["metadata"] = (objectMetadata ? objectMetadata["Service_Type_id"] : null);
        privateState.Service_Type_id = defaultValues ?
            (defaultValues["Service_Type_id"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Service_Type_id"], context) :
                null) :
            null;

        context["field"] = "Sunday_EndTime";
        context["metadata"] = (objectMetadata ? objectMetadata["Sunday_EndTime"] : null);
        privateState.Sunday_EndTime = defaultValues ?
            (defaultValues["Sunday_EndTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Sunday_EndTime"], context) :
                null) :
            null;

        context["field"] = "Sunday_StartTime";
        context["metadata"] = (objectMetadata ? objectMetadata["Sunday_StartTime"] : null);
        privateState.Sunday_StartTime = defaultValues ?
            (defaultValues["Sunday_StartTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Sunday_StartTime"], context) :
                null) :
            null;

        context["field"] = "Weekday_EndTime";
        context["metadata"] = (objectMetadata ? objectMetadata["Weekday_EndTime"] : null);
        privateState.Weekday_EndTime = defaultValues ?
            (defaultValues["Weekday_EndTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Weekday_EndTime"], context) :
                null) :
            null;

        context["field"] = "Weekday_StartTime";
        context["metadata"] = (objectMetadata ? objectMetadata["Weekday_StartTime"] : null);
        privateState.Weekday_StartTime = defaultValues ?
            (defaultValues["Weekday_StartTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["Weekday_StartTime"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "ADDRESS": {
                get: function() {
                    context["field"] = "ADDRESS";
                    context["metadata"] = (objectMetadata ? objectMetadata["ADDRESS"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ADDRESS, context);
                },
                set: function(val) {
                    setterFunctions['ADDRESS'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Address_id": {
                get: function() {
                    context["field"] = "Location_Address_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Address_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Address_id, context);
                },
                set: function(val) {
                    setterFunctions['Location_Address_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Code": {
                get: function() {
                    context["field"] = "Location_Code";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Code"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Code, context);
                },
                set: function(val) {
                    setterFunctions['Location_Code'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_DeleteFlag": {
                get: function() {
                    context["field"] = "Location_DeleteFlag";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_DeleteFlag"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_DeleteFlag, context);
                },
                set: function(val) {
                    setterFunctions['Location_DeleteFlag'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Description": {
                get: function() {
                    context["field"] = "Location_Description";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Description"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Description, context);
                },
                set: function(val) {
                    setterFunctions['Location_Description'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Display_Name": {
                get: function() {
                    context["field"] = "Location_Display_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Display_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Display_Name, context);
                },
                set: function(val) {
                    setterFunctions['Location_Display_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_EmailId": {
                get: function() {
                    context["field"] = "Location_EmailId";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_EmailId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_EmailId, context);
                },
                set: function(val) {
                    setterFunctions['Location_EmailId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_id": {
                get: function() {
                    context["field"] = "Location_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_id, context);
                },
                set: function(val) {
                    setterFunctions['Location_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_IsMainBranch": {
                get: function() {
                    context["field"] = "Location_IsMainBranch";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_IsMainBranch"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_IsMainBranch, context);
                },
                set: function(val) {
                    setterFunctions['Location_IsMainBranch'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Latitude": {
                get: function() {
                    context["field"] = "Location_Latitude";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Latitude"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Latitude, context);
                },
                set: function(val) {
                    setterFunctions['Location_Latitude'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Longitude": {
                get: function() {
                    context["field"] = "Location_Longitude";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Longitude"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Longitude, context);
                },
                set: function(val) {
                    setterFunctions['Location_Longitude'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Name": {
                get: function() {
                    context["field"] = "Location_Name";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Name"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Name, context);
                },
                set: function(val) {
                    setterFunctions['Location_Name'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Phone_Number": {
                get: function() {
                    context["field"] = "Location_Phone_Number";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Phone_Number"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Phone_Number, context);
                },
                set: function(val) {
                    setterFunctions['Location_Phone_Number'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Status_id": {
                get: function() {
                    context["field"] = "Location_Status_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Status_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Status_id, context);
                },
                set: function(val) {
                    setterFunctions['Location_Status_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_Type_id": {
                get: function() {
                    context["field"] = "Location_Type_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_Type_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_Type_id, context);
                },
                set: function(val) {
                    setterFunctions['Location_Type_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Location_WorkScheduleId": {
                get: function() {
                    context["field"] = "Location_WorkScheduleId";
                    context["metadata"] = (objectMetadata ? objectMetadata["Location_WorkScheduleId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Location_WorkScheduleId, context);
                },
                set: function(val) {
                    setterFunctions['Location_WorkScheduleId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Saturday_EndTime": {
                get: function() {
                    context["field"] = "Saturday_EndTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["Saturday_EndTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Saturday_EndTime, context);
                },
                set: function(val) {
                    setterFunctions['Saturday_EndTime'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Saturday_StartTime": {
                get: function() {
                    context["field"] = "Saturday_StartTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["Saturday_StartTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Saturday_StartTime, context);
                },
                set: function(val) {
                    setterFunctions['Saturday_StartTime'].call(this, val, privateState);
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
            "Service_Type_id": {
                get: function() {
                    context["field"] = "Service_Type_id";
                    context["metadata"] = (objectMetadata ? objectMetadata["Service_Type_id"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Service_Type_id, context);
                },
                set: function(val) {
                    setterFunctions['Service_Type_id'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Sunday_EndTime": {
                get: function() {
                    context["field"] = "Sunday_EndTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["Sunday_EndTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Sunday_EndTime, context);
                },
                set: function(val) {
                    setterFunctions['Sunday_EndTime'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Sunday_StartTime": {
                get: function() {
                    context["field"] = "Sunday_StartTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["Sunday_StartTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Sunday_StartTime, context);
                },
                set: function(val) {
                    setterFunctions['Sunday_StartTime'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Weekday_EndTime": {
                get: function() {
                    context["field"] = "Weekday_EndTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["Weekday_EndTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Weekday_EndTime, context);
                },
                set: function(val) {
                    setterFunctions['Weekday_EndTime'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "Weekday_StartTime": {
                get: function() {
                    context["field"] = "Weekday_StartTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["Weekday_StartTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.Weekday_StartTime, context);
                },
                set: function(val) {
                    setterFunctions['Weekday_StartTime'].call(this, val, privateState);
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
            privateState.ADDRESS = value ? (value["ADDRESS"] ? value["ADDRESS"] : null) : null;
            privateState.Location_Address_id = value ? (value["Location_Address_id"] ? value["Location_Address_id"] : null) : null;
            privateState.Location_Code = value ? (value["Location_Code"] ? value["Location_Code"] : null) : null;
            privateState.Location_DeleteFlag = value ? (value["Location_DeleteFlag"] ? value["Location_DeleteFlag"] : null) : null;
            privateState.Location_Description = value ? (value["Location_Description"] ? value["Location_Description"] : null) : null;
            privateState.Location_Display_Name = value ? (value["Location_Display_Name"] ? value["Location_Display_Name"] : null) : null;
            privateState.Location_EmailId = value ? (value["Location_EmailId"] ? value["Location_EmailId"] : null) : null;
            privateState.Location_id = value ? (value["Location_id"] ? value["Location_id"] : null) : null;
            privateState.Location_IsMainBranch = value ? (value["Location_IsMainBranch"] ? value["Location_IsMainBranch"] : null) : null;
            privateState.Location_Latitude = value ? (value["Location_Latitude"] ? value["Location_Latitude"] : null) : null;
            privateState.Location_Longitude = value ? (value["Location_Longitude"] ? value["Location_Longitude"] : null) : null;
            privateState.Location_Name = value ? (value["Location_Name"] ? value["Location_Name"] : null) : null;
            privateState.Location_Phone_Number = value ? (value["Location_Phone_Number"] ? value["Location_Phone_Number"] : null) : null;
            privateState.Location_Status_id = value ? (value["Location_Status_id"] ? value["Location_Status_id"] : null) : null;
            privateState.Location_Type_id = value ? (value["Location_Type_id"] ? value["Location_Type_id"] : null) : null;
            privateState.Location_WorkScheduleId = value ? (value["Location_WorkScheduleId"] ? value["Location_WorkScheduleId"] : null) : null;
            privateState.Saturday_EndTime = value ? (value["Saturday_EndTime"] ? value["Saturday_EndTime"] : null) : null;
            privateState.Saturday_StartTime = value ? (value["Saturday_StartTime"] ? value["Saturday_StartTime"] : null) : null;
            privateState.Service_Description = value ? (value["Service_Description"] ? value["Service_Description"] : null) : null;
            privateState.Service_id = value ? (value["Service_id"] ? value["Service_id"] : null) : null;
            privateState.Service_Name = value ? (value["Service_Name"] ? value["Service_Name"] : null) : null;
            privateState.Service_Status_id = value ? (value["Service_Status_id"] ? value["Service_Status_id"] : null) : null;
            privateState.Service_Type_id = value ? (value["Service_Type_id"] ? value["Service_Type_id"] : null) : null;
            privateState.Sunday_EndTime = value ? (value["Sunday_EndTime"] ? value["Sunday_EndTime"] : null) : null;
            privateState.Sunday_StartTime = value ? (value["Sunday_StartTime"] ? value["Sunday_StartTime"] : null) : null;
            privateState.Weekday_EndTime = value ? (value["Weekday_EndTime"] ? value["Weekday_EndTime"] : null) : null;
            privateState.Weekday_StartTime = value ? (value["Weekday_StartTime"] ? value["Weekday_StartTime"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(LocationServicesObject);

    //Create new class level validator object
    BaseModel.Validator.call(LocationServicesObject);

    var registerValidatorBackup = LocationServicesObject.registerValidator;

    LocationServicesObject.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(LocationServicesObject.isValid(this, propName, val)) {
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
    //For Operation 'deleteLocation' with service id 'DeleteLocation1668'
     LocationServicesObject.deleteLocation = function(params, onCompletion){
        return LocationServicesObject.customVerb('deleteLocation', params, onCompletion);
     };

    //For Operation 'updateLocationAndLocationServices' with service id 'UpdateLocationAndLocationServices5979'
     LocationServicesObject.updateLocationAndLocationServices = function(params, onCompletion){
        return LocationServicesObject.customVerb('updateLocationAndLocationServices', params, onCompletion);
     };

    //For Operation 'getLocationAndLocationServices' with service id 'GetLocationAndLocationServices4061'
     LocationServicesObject.getLocationAndLocationServices = function(params, onCompletion){
        return LocationServicesObject.customVerb('getLocationAndLocationServices', params, onCompletion);
     };

    //For Operation 'createLocationAndAssignServices' with service id 'CreateLocationAndLocationServices7821'
     LocationServicesObject.createLocationAndAssignServices = function(params, onCompletion){
        return LocationServicesObject.customVerb('createLocationAndAssignServices', params, onCompletion);
     };

    var relations = [];

    LocationServicesObject.relations = relations;

    LocationServicesObject.prototype.isValid = function() {
        return LocationServicesObject.isValid(this);
    };

    LocationServicesObject.prototype.objModelName = "LocationServicesObject";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    LocationServicesObject.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("LocationObjService", "LocationServicesObject", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    LocationServicesObject.clone = function(objectToClone) {
        var clonedObj = new LocationServicesObject();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return LocationServicesObject;
});