/** Class implementing the timeChart. */
class TimeChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(selectionChart){
        this.selectionChart = selectionChart;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divTimeChart = d3.select("#time-chart").classed("content", true);

        //fetch the svg bounds
        this.svgBounds = divTimeChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 200;

        //add the svg to the div
        this.svg = divTimeChart.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    }


    /**
     * Renders the HTML content for tool tip
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for toop tip
     */
    // tooltip_render (tooltip_data) {
    //     let text = "<ul>";
    //     tooltip_data.result.forEach((row)=>{
    //         text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    //     });
    //
    //     return text;
    // }

    /**
     * NOTE TO US: DO WE NEED AN ARGUMENT OR AN UPDATE FUNCTION?
     * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
     *
     * @param cityBikeData bike data for the city
     */
    update (cityBikeData, colorScale){

        let that = this;
        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
            .html(function(d) {
                // /* populate data in the following formatx`
                // let tooltip_data = {
                //     "result":[
                //         {
                //             "nominee": electionResult[0]['D_Nominee_prop'],
                //             "votecount": electionResult[0]['D_Votes_Total'],
                //             "percentage": electionResult[0]['D_PopularPercentage'],
                //             "party":"D"
                //         } ,
                //         {
                //             "nominee": electionResult[0]['R_Nominee_prop'],
                //             "votecount": electionResult[0]['R_Votes_Total'],
                //             "percentage": electionResult[0]['R_PopularPercentage'],
                //             "party":"R"
                //         } ,
                //         {
                //             "nominee": electionResult[0]['I_Nominee_prop'],
                //             "votecount": electionResult[0]['I_Votes_Total'],
                //             "percentage": electionResult[0]['I_PopularPercentage'],
                //             "party":"I"
                //         }
                //     ]
                // };

                //  * pass this as an argument to the tooltip_render function then,
                //  * return the HTML content returned from that method.
                //  * */
                // return that.tooltip_render(tooltip_data);
                return;
            });

        
        //add brush info here!!
    };


}