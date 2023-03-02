define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_Form_af28b8dd4547421b91987dc073f49cfa: function AS_Form_af28b8dd4547421b91987dc073f49cfa(eventobject) {
        var self = this;
        kony.sdk.util.deleteSSOToken();
        kony.sdk.util.deleteSSOTokenForProvider("KonyBankingAdminConsoleIdentityService");
    },
    AS_Form_e4cb462ee4f54821a534ae29712c76a2: function AS_Form_e4cb462ee4f54821a534ae29712c76a2(eventobject) {
        var self = this;
        kony.print("");
    },
    AS_Form_d80f17429434469ba228dc2bf1d92f17: function AS_Form_d80f17429434469ba228dc2bf1d92f17(eventobject) {
        var self = this;
        var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
        this.attachToModule(authModule);
        this.preshowLogin();
    },
});