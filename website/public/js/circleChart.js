/** Class implementing the circleChart. */
class CircleChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let divCircles = d3.select("#circle-chart-content").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divCircles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",legendHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)")
        this.svg = divCircles.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)")
    };


    // /**
    //  * Renders the HTML content for tool tip.
    //  *
    //  * @param tooltip_data information that needs to be populated in the tool tip
    //  * @return text HTML content for tool tip
    //  */
    // tooltip_render(tooltip_data) {
    //     let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    //     text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    //     text += "<ul>"
    //     tooltip_data.result.forEach((row)=>{
    //         //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    //         text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    //     });
    //     text += "</ul>";
    //
    //     return text;
    // }

    /**
     * Creates circles, edges and tool tip for each edge, legend for encoding the color scale information.
     *
     * @param cityBikeInfo bike data for the time and city selected
     * @param colorScale global quantile scale based on the selection
     *
     */
    update (cityBikeInfo, colorScale){


        //Creates a legend element and assigns a scale that needs to be visualized
        this.legendSvg.append("g")
            .attr("class", "legendQuantile")
            .attr("transform", "translate(0,50)");

        let legendQuantile = d3.legendColor()
            .shapeWidth(100)
            .cells(10)
            .orient('horizontal')
            .scale(colorScale);

        this.legendSvg.select(".legendQuantile")
            .call(legendQuantile);

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                /* populate data in the following format */
                // let tooltip_data = {
                //     "state": d['State'],
                //     "winner":d['State_Winner'],
                //     "electoralVotes" : d['Total_EV'],
                //     "result":[
                //         {"nominee": d['D_Nominee_prop'],"votecount": d['D_Votes'],"percentage": d['D_Percentage'],"party":"D"} ,
                //         {"nominee": d['R_Nominee_prop'],"votecount": d['R_Votes'],"percentage": d['R_Percentage'],"party":"R"} ,
                //         {"nominee": d['I_Nominee_prop'],"votecount": d['I_Votes'],"percentage": d['I_Percentage'],"party":"I"}
                //     ]
                // };
                //* pass this as an argument to the tooltip_render function then,
                // return the HTML content returned from that method.

                // return that.tooltip_render(tooltip_data);
                return;
            });

    };


}
