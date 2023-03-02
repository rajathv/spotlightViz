define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_Form_g4cef829c2384a968122661209cb0326: function AS_Form_g4cef829c2384a968122661209cb0326(eventobject) {
        var self = this;
        this.onBrowserBack();
    },
    AS_Form_a7af3565c840460f98fbc9638c2db7e1: function AS_Form_a7af3565c840460f98fbc9638c2db7e1(eventobject) {
        var self = this;
        var vizServerURL = window.location.href;
        var qpExists = vizServerURL.indexOf("qp=");
        this.preshowLoginError();
        if (qpExists !== -1) {
            this.view.flxChangePassword.isVisible = false;
            this.view.flxErrorLoginInner.isVisible = false;
            kony.adminConsole.utils.showProgressBar(this.view);
            var qp = vizServerURL.substring(qpExists + 3);
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
            authModule.presentationController.openResetPasswordForm({
                "qp": qp
            });
        }
    }
});