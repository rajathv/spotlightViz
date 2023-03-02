define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_Button_ad742133b6444958bebfbace58ce5e65: function AS_Button_ad742133b6444958bebfbace58ce5e65(eventobject) {
        var self = this;
        return self.navigateToSearchCustomerScreen.call(this);
    },
    AS_FlexContainer_b2cf0804e52642d592da8109353a86f2: function AS_FlexContainer_b2cf0804e52642d592da8109353a86f2(eventobject) {
        var self = this;
        return self.resetPendingLoansListWithoutInvokingService.call(this);
    },
    AS_FlexContainer_fcbee1b7c9b14bfdbb14fea68099798e: function AS_FlexContainer_fcbee1b7c9b14bfdbb14fea68099798e(eventobject) {
        var self = this;
        return self.resetSubmittedLoansListWithoutInvokingService.call(this);
    },
    AS_Form_gcc53706fc58432f9caa621d7237c388: function AS_Form_gcc53706fc58432f9caa621d7237c388(eventobject) {
        var self = this;
        this.onBrowserBack();
    },
    AS_Form_df129253ad804fdfb39a916b3b67affe: function AS_Form_df129253ad804fdfb39a916b3b67affe(eventobject) {
        var self = this;
        this.frmLoansDashboardPreShow();
    },
    AS_Image_fc85e1cb4fa74b90883ede942e4ea59b: function AS_Image_fc85e1cb4fa74b90883ede942e4ea59b(eventobject, x, y) {
        var self = this;
        this.view.flxEligibilityCheck.isVisible = false;
        this.view.flxDisabledBackground.isVisible = false;
    },
    AS_Label_b5befc3b01724c89a3ada56766fe60f6: function AS_Label_b5befc3b01724c89a3ada56766fe60f6(eventobject, x, y) {
        var self = this;
        this.registrationOnClick();
    }
});