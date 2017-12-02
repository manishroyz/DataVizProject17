/** Class implementing the timeChart. */
class TimeChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(selectionChart,lineChart){
		let lineChrt = lineChart;
        this.selectionChart = selectionChart;
        let that = this;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divTimeChart = d3.select("#time-bars").classed("content", true);

        //fetch the svg bounds
        this.svgBounds = divTimeChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 30;

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

        this.buttonsvg = d3.select("#update-button").append("svg")
            .attr("width", 90)
            .attr("height",90);

        this.buttonsvg.append("rect")
            .attr("x",0)
            .attr("y", 0)
            .attr("width", 90)
            .attr("height", 90)
            .classed("timeBar", true);

        let months = [{
            'text': "Jan",
            'value': 1
            },
            {
                'text': "Feb",
                'value': 2
            },
            {
                'text': "Mar",
                'value': 3
            },
            {
                'text': "Apr",
                'value': 4
            },
            {
                'text': "May",
                'value': 5
            },
            {
                'text': "Jun",
                'value': 6
            },
            {
                'text': "Jul",
                'value': 7
            },
            {
                'text': "Aug",
                'value': 8
            },
            {
                'text': "Sep",
                'value': 9
            },
            {
                'text': "Oct",
                'value': 10
            },
            {
                'text': "Nov",
                'value': 11
            },
            {
                'text': "Dec",
                'value': 12
            }];

        let days = [];
        let hours = [
            {
                'text':"12AM",
                'value':0
            }
        ];
        for(let i =1; i<=31; ++i){
            days.push(i);
        }
        for(let i = 1; i<=11; ++i){
            hours.push({
                'text': i + "AM",
                'value':i
            });
        }
        hours.push({
            'text':"12PM",
            'value':12
        });
        for(let i = 13; i<=23; ++i){
            hours.push({
                'text': (12-i) + "PM",
                'value':i
            });
        }
        hours.push({
            'text':"12AM",
            'value':0
        });

        this.selectedMonths = months.map(d=>d.value);
        this.selectedDays = days;
        this.selectedHours = hours.map(d=>d.value);

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
        monthrects.attr("height", this.svgHeight)
            .attr("width", this.svgWidth/monthsum)
            .attr("x", function(d,i){
                return monthscale(i);
            })
            .attr("y",0)
            .classed("timeBar", true);

        let dayrects = this.daysvg.selectAll("rect").data(days);
        dayrects = dayrects.enter().append("rect").merge(dayrects);
        dayrects.exit().remove();
        dayrects.attr("height", this.svgHeight)
            .attr("width", this.svgWidth/daysum)
            .attr("x", function(d,i){
                return dayscale(i);
            })
            .attr("y",0)
            .classed("timeBar", true);

        let hourrects = this.hoursvg.selectAll("rect").data(hours);
        hourrects = hourrects.enter().append("rect").merge(hourrects);
        hourrects.exit().remove();
        hourrects.attr("height", this.svgHeight)
            .attr("width", this.svgWidth/hoursum)
            .attr("x", function(d,i){
                return hourscale(i);
            })
            .attr("y",0)
            .classed("timeBar", true);

        let monthtexts = this.monthsvg.selectAll("text").data(months);
        monthtexts = monthtexts.enter().append("text").merge(monthtexts);
        monthtexts.exit().remove();
        monthtexts.text(d=>d.text)
            .attr("x", function(d,i){
                return monthscale(i+0.5);
            })
            .attr("y",this.svgHeight-5)
            .classed("timeBarText", true);

        let daytexts = this.daysvg.selectAll("text").data(days);
        daytexts = daytexts.enter().append("text").merge(daytexts);
        daytexts.exit().remove();
        daytexts.text(d=>d)
            .attr("x", function(d,i){
                return dayscale(i+0.5);
            })
            .attr("y",this.svgHeight-5)
            .classed("timeBarText", true);

        let hourtexts = this.hoursvg.selectAll("text").data(hours);
        hourtexts = hourtexts.enter().append("text").merge(hourtexts);
        hourtexts.exit().remove();
        hourtexts.text(d=>d.text)
            .attr("x", function(d,i){
                return hourscale(i+0.5);
            })
            .attr("y",this.svgHeight-5)
            .classed("timeBarText", true);

        this.buttonsvg.append("text")
            .attr("x",45)
            .attr("y", 55)
            .text("Update")
            .classed("timeBarText", true);

        this.selection = {
            'selectedMonths': this.selectedMonths,
            'selectedDays' : this.selectedDays,
            'selectedHours' : this.selectedHours
        };

        //add brush info here!
        var monthbrush = d3.brushX().extent([[0,0],[monthscale(monthsum),this.svgHeight]]).on("end", function(){
            // console.log(d3.event.selection);
            let selection = months.filter((d,i)=>{
                // console.log(d['x']);
                if(d3.event.selection==null)
                    return false;
                if(monthscale(i)>=d3.event.selection[0] && monthscale(i+1)<=d3.event.selection[1])
                    return true;
                return false;
            })
                .map(d=>d.value);
            // console.log(selection.data().map(d=>d['__data__']));
            that.selection.selectedMonths = selection;
            // that.selectionChart.update(that.selection);
        });
        this.monthsvg.append("g").attr("class", "brush").call(monthbrush);

        var daybrush = d3.brushX().extent([[0,0],[dayscale(daysum),this.svgHeight]]).on("end", function(){
            // console.log(d3.event.selection);
            let selection = days.filter((d,i)=>{
                // console.log(d['x']);
                if(d3.event.selection==null)
                    return false;
                if(dayscale(i)>=d3.event.selection[0] && dayscale(i+1)<=d3.event.selection[1])
                    return true;
                return false;
            });
            // console.log(selection.data().map(d=>d['__data__']));
            that.selection.selectedDays = selection;
            // that.selectionChart.update(that.selection);
        });
        this.daysvg.append("g").attr("class", "brush").call(daybrush);

        var hourbrush = d3.brushX().extent([[0,0],[hourscale(hoursum),this.svgHeight]]).on("end", function(){
            // console.log(d3.event.selection);
            let selection = hours.filter((d,i)=>{
                // console.log(d['x']);
                if(d3.event.selection==null)
                    return false;
                if(hourscale(i)>=d3.event.selection[0] && hourscale(i+1)<=d3.event.selection[1])
                    return true;
                return false;
            })
                .map(d=>d.value);
            // console.log(selection.data().map(d=>d['__data__']));
            that.selection.selectedHours = selection;
            // that.selectionChart.update(that.selection);
        });

        this.hoursvg.append("g").attr("class", "brush").call(hourbrush);

        this.buttonsvg.on("click",function(){
         //  that.selectionChart.update(that.selection);
		   
		   let selectedStationsData=[];
			selectedStationsData.push("178");//("67");
			selectedStationsData.push("80");//("22");
			//passing the Start date by day and month 
			selectedStationsData.push("06/01/2016 00:00");
			selectedStationsData.push("10/15/2016 23:59");  //This is the end date
			
			selectedStationsData.push(100);
			
			
				lineChrt.update(selectedStationsData);
				
				
				  let selectedDays=[];
			selectedDays.push("01/01/2016");
			selectedDays.push("10/20/2016");
			selectedDays.push("06/06/2016");
			selectedDays.push("07/06/2016");
				lineChrt.updateHoursLineChart(selectedDays,selectedStationsData[0],selectedStationsData[1]);
		
        });
		
		
	


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


        //add brush info here!!
    };


}