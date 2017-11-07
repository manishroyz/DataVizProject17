/** Class implementing the selectionChart. */
class SelectionChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divSelectionChart = d3.select("#selection-chart").classed("sideBar", true);
    };

    /**
     * Creates a list of time and criteria that have been selected by brushing over the Time Chart
     *
     * @param selectedTime data corresponding to the states selected on brush
     */
    update(selectedTime){


        //Update the visualization on brush events over the Circle chart

    };


}
