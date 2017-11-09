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
        this.monthsvg = divTimeChart.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight);

        this.daysvg = divTimeChart.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight);

        this.hoursvg = divTimeChart.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight);

        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let dates = [];
        let hours = [
            {
                'text':"MIDNIGHT",
                'value':0
            }
        ];
        for(let i =1; i<=31; ++i){
            dates.push(i);
        }
        for(let i = 1; i<=11; ++i){
            hours.push({
                'text': i + "AM",
                'value':i
            });
        }
        hours.push({
            'text':"NOON",
            'value':12
        });
        for(let i = 1; i<=11; ++i){
            hours.push({
                'text': i + "PM",
                'value':i
            });
        }
        hours.push({
            'text':"MIDNIGHT",
            'value':0
        });

        let monthsum = 12;
        let daysum = 31;
        let hoursum = 25;

        let monthscale = d3.scaleLinear()
            .domain([0, monthsum ])
            .range([0, this.svgWidth]);
        let dayscale = d3.scaleLinear()
            .domain([0, daysum ])
            .range([0, this.svgWidth]);
        let hourscale = d3.scaleLinear()
            .domain([0, hoursum ])
            .range([0, this.svgWidth]);

        let monthrects = this.monthsvg.selectAll("rect").data(months);
        monthrects = monthrects.enter().append("rect").merge(monthrects);
        monthrects.exit().remove();
        monthrects.attr("height", 20)
            .attr("width", this.svgWidth/monthsum)
            .attr("x", function(d,i){
                return monthscale(i);
            })
            .attr("y",0);

        let dayrects = this.daysvg.selectAll("rect").data(days);
        dayrects = dayrects.enter().append("rect").merge(dayrects);
        dayrects.exit().remove();
        dayrects.attr("height", 20)
            .attr("width", this.svgWidth/daysum)
            .attr("x", function(d,i){
                return dayscale(i);
            })
            .attr("y",0);

        let hourrects = this.hoursvg.selectAll("rect").data(hours);
        hourrects = hourrects.enter().append("rect").merge(hourrects);
        hourrects.exit().remove();
        hourrects.attr("height", 20)
            .attr("width", this.svgWidth/hoursum)
            .attr("x", function(d,i){
                return hourscale(i);
            })
            .attr("y",0);

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


        // let rects = this.svg.selectAll("rect").data(data_for_bars);
        // rects.exit().remove();
        // rects = rects.enter().append("rect").merge(rects);


        if(electionResult[0]['I_PopularPercentage'].length>0)
            this.svg.append("rect").attr("x", xscale(0))
                .attr("y", 80)
                .attr("width", xscale(x1))
                .attr("height", 30)
                .classed('independent', true)
                .classed('votePercentage', true)
                .data(electionResult);

        this.svg.append("rect").attr("x", xscale(x1))
            .attr("y", 80)
            .attr("width", xscale(+electionResult[0]['D_PopularPercentage'].substring(0, electionResult[0]['D_PopularPercentage'].length-1)))
            .attr("height", 30)
            .classed('democrat', true)
            .classed('votePercentage', true)
            .data(electionResult);

        this.svg.append("rect").attr("x",
            xscale(x1
                + +electionResult[0]['D_PopularPercentage'].substring(0, electionResult[0]['D_PopularPercentage'].length-1)))
            .attr("y", 80)
            .attr("width", xscale(electionResult[0]['R_PopularPercentage'].substring(0, electionResult[0]['R_PopularPercentage'].length-1)))
            .attr("height", 30)
            .classed('republican', true)
            .classed('votePercentage', true)
            .data(electionResult);

        //Display the total percentage of votes won by each party
        //on top of the corresponding groups of bars.
        //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        this.svg.selectAll("text").remove();
        if(electionResult[0]['I_PopularPercentage'].length>0)
            this.svg.append("text").attr('x', xscale(0))
                .attr('y', 70)
                .classed('votesPercentageText', true)
                .classed('independent', true)
                .text(electionResult[0]['I_PopularPercentage']);

        if(electionResult[0]['I_PopularPercentage'].length>0)
            this.svg.append("text").attr('x', xscale(0))
                .attr('y', 40)
                .classed('votesPercentageText', true)
                .classed('independent', true)
                .text(electionResult[0]['I_Nominee_prop']);

        this.svg.append("text").attr('x', xscale(sum/2-sum/4))
            .attr('y', 70)
            .classed('votesPercentageText', true)
            .classed('democrat', true)
            .text(electionResult[0]['D_PopularPercentage']);

        this.svg.append("text").attr('x', xscale(sum/2-sum/4))
            .attr('y', 40)
            .classed('votesPercentageText', true)
            .classed('democrat', true)
            .text(electionResult[0]['D_Nominee_prop']);


        this.svg.append("text").attr('x', xscale(sum))
            .attr('y', 70)
            .classed('votesPercentageText', true)
            .classed('republican', true)
            .text(electionResult[0]['R_PopularPercentage']);
        this.svg.append("text").attr('x', xscale(sum))
            .attr('y', 40)
            .classed('votesPercentageText', true)
            .classed('republican', true)
            .text(electionResult[0]['I_Nominee_prop']);

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        this.svg.append("rect").attr("y", 70)
            .attr('x', xscale(sum/2))
            .attr('width', 5)
            .attr('height', 50)
            .classed('middlePoint', true);

        //Just above this, display the text mentioning details about this mark on top of this bar
        //HINT: Use .votesPercentageNote class to style this text element

        this.svg.append("text")
            .attr('x',xscale(sum/2))
            .attr("y",60)
            .classed("votesPercentageNote", true)
            .text("Popular Vote (50%)");


        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote percentage and number of votes won by each party.

        this.svg.call(tip);
        this.svg.selectAll("rect").on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        //add brush info here!!
    };


}