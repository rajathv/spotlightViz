define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_FlexContainer_d0b655f1f9284f149eb1e30bfdc44ad5: function AS_FlexContainer_d0b655f1f9284f149eb1e30bfdc44ad5(eventobject) {
        var self = this;
        this.nextPage();
    },
    AS_FlexContainer_f0a418b4f60c4b3aa94ca15c2d5cbcb7: function AS_FlexContainer_f0a418b4f60c4b3aa94ca15c2d5cbcb7(eventobject) {
        var self = this;
        this.prevPage();
    },
    AS_Form_jb75f86eee8d4ae7a1dc665136ca7a8d: function AS_Form_jb75f86eee8d4ae7a1dc665136ca7a8d(eventobject) {
        var self = this;
        //registered
        this.onBrowserBack();
    },
    AS_Form_ae86ce8d24c342a89e68d036c12fba87: function AS_Form_ae86ce8d24c342a89e68d036c12fba87(eventobject) {
        var self = this;
        this.permissionPreShow();
    },
    AS_Image_ed3c712efdb8401b8975d8b184830e46: function AS_Image_ed3c712efdb8401b8975d8b184830e46(eventobject, x, y) {
        var self = this;
        this.nextPage();
    },
    AS_Image_j56563ebfafd4b3d80502fec0c98cba7: function AS_Image_j56563ebfafd4b3d80502fec0c98cba7(eventobject, x, y) {
        var self = this;
        this.prevPage();
    },
    AS_ListBox_a5aff4bd4d3446d283199e7c0539af03: function AS_ListBox_a5aff4bd4d3446d283199e7c0539af03(eventobject) {
        var self = this;
        this.gotoPage();
    },
    AS_Segment_a0439cb31b4145b1bceae41287f27d42: function AS_Segment_a0439cb31b4145b1bceae41287f27d42(eventobject, sectionNumber, rowNumber) {
        var self = this;
        this.showViewRoleSegmentAndPermissionHeader();
        this.setPermissionsDataOnRowClick();
    },
});