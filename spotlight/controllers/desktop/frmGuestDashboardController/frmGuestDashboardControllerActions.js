define({
    /*
      This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    /** onRowClick defined for segSimulationResultsGuestSimulation **/
    AS_Segment_jec912334ef745e5ad45dc0d2de9b73f: function AS_Segment_jec912334ef745e5ad45dc0d2de9b73f(eventobject, sectionNumber, rowNumber) {
        var self = this;
        //this.simulationResultSelected();
    },
    /** onHover defined for flxGuestSimulateResults **/
    AS_FlexContainer_a6aad10e5e1c4961aa8fb21ef1aa9b6d: function AS_FlexContainer_a6aad10e5e1c4961aa8fb21ef1aa9b6d(eventobject, context) {
        var self = this;
        this.setDummyDataToSimulationResults();
    },
    /** onClick defined for flxGuestSimulationBack **/
    AS_FlexContainer_de8bb540898d425c83095fb257783f2d: function AS_FlexContainer_de8bb540898d425c83095fb257783f2d(eventobject) {
        var self = this;
        this.navigateBackToLoans();
    },
    /** onKeyUp defined for txtLoanAmountGuestSimulation **/
    AS_TextField_gf4d08da5a0749d591a0c3a28a9b8fc0: function AS_TextField_gf4d08da5a0749d591a0c3a28a9b8fc0(eventobject) {
        var self = this;
        this.view.txtLoanAmountGuestSimulation.skin = "sknTbxFFFFFFBorDEDEDE13pxKA";
        this.view.lblGuestSimulationLoanAmountError.setVisibility(false);
    },
    /** onSelection defined for lstBoxEmploymentStatusGuestSimulation **/
    AS_ListBox_b735d13044624f8fbb4bc312274e59c4: function AS_ListBox_b735d13044624f8fbb4bc312274e59c4(eventobject) {
        var self = this;
        this.view.lstBoxEmploymentStatusGuestSimulation.skin = "sknlstbx485c7513px";
        this.view.lblGuestSimulationEmploymentStatusError.setVisibility(false);
    },
    /** onClick defined for btnSimulateGuestSimulation **/
    AS_Button_g8a5fbbeb3b44b32a3a47ccf0575b7be: function AS_Button_g8a5fbbeb3b44b32a3a47ccf0575b7be(eventobject) {
        var self = this;
        this.getGuestSimulationResults();
    },
});