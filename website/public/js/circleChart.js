/** Class implementing the circleChart. */
class CircleChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(data, lineChart){
        this.lineChart = lineChart;
        console.log(data);
        this.stationData = data;
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
        this.legendSvg = legend.select("legendSvg");
        this.legendSvg
            .attr("width",this.svgWidth)
            .attr("height",legendHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)")
        this.svg = divCircles.select("#circleSvg");
        this.svg
            .attr("width",1000)
            .attr("height",1000)
            .attr("transform", "translate(" + this.margin.left + ",0)");
    };


    // /**
    //  * Renders the HTML content for tool tip.
    //  *
    //  * @param tooltip_data information that needs to be populated in the tool tip
    //  * @return text HTML content for tool tip
    //  */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ='count' > Total: " + tooltip_data.count + "</h2><h2>Click to see detailed visualization!</h2>";

        console.log("in tooltip")
        return text;
    }

    /**
     * Creates circles, edges and tool tip for each edge, legend for encoding the color scale information.
     *
     * @param cityBikeInfo bike data for the time and city selected
     * @param colorScale global quantile scale based on the selection
     *
     */
    update (cityBikeInfo){
        console.log(cityBikeInfo);

        //find out top 7 stations
        let stationList =this.stationData;
        let that = this;
        let edges = [];
        for(let i = 0; i < stationList.length; ++i){
            for(let j = i+1; j<stationList.length; ++j){
                let x = [];
                x['station1'] = stationList[i];
                x['station2'] = stationList[j];
                x['total'] = 0;
                edges.push(x);
            }
        }
        console.log(edges);
        cityBikeInfo.forEach(function(r){
            edges.forEach(function(e) {
                   if ((e['station1']['station_id'] === r['start_station_id'] && e['station2']['station_id'] === r['end_station_id']) ||
                       (e['station2']['station_id'] === r['start_station_id'] && e['station1']['station_id'] === r['end_station_id'])) {
                       e['total']++;
                   }
               });
        });
        edges.sort((a,b)=>{
            if(a['total']>b['total'])
                return -1;
            else return 1;
        });
        console.log(edges);
        stationList.forEach(function(d){
            d['count']=0;
            cityBikeInfo.forEach(c=>{
                if(c['start_station_id'] === d['station_id'])
                    d['count']++;
                if(c['end_station_id'] === d['station_id'])
                    d['count']++;
            });
        });
        stationList = stationList.sort((a,b)=>{
            if(a['count']>b['count'])
            return -1;
            else return 1;
        });
        let pairs = [];
        let topstations = [];
        for(let i = 0 ; i < 10; ++i){
            if(!topstations.includes(edges[i]['station1'])){
                topstations.push(edges[i]['station1']);
            }
            if(!topstations.includes(edges[i]['station2'])){
                topstations.push(edges[i]['station2']);
            }
            pairs.push(edges[i]);
            if(topstations.length==7 ||topstations.length == 8)
                break;
        }
        console.log(topstations);
        console.log(pairs);
        let mult = 100;
        let odd_positions = [
            {
                'x': mult*5,
                'y': 1.838*mult
            },
            {
                'x': mult*7.74,
                'y': 3.421*mult
            },
            {
                'x': mult*7.72,
                'y': 6.613*mult
            },
            {
                'x': mult*5.84,
                'y': 8.049*mult
            },
            {
                'x': mult*3.16,
                'y': 7.752*mult
            },
            {
                'x': mult*1.864,
                'y': 5.407*mult
            },
            {
                'x': mult*2.56,
                'y': 2.988*mult
            }
        ];

        let even_positions = [
            {
                'x': mult*5,
                'y': 1.838*mult
            },
            {
                'x': mult*7.38,
                'y': 2.92*mult
            },
            {
                'x': mult*8.16,
                'y': 4.88*mult
            },
            {
                'x': mult*7.2,
                'y': 7.27*mult
            },
            {
                'x': mult*5,
                'y': 8.16*mult
            },
            {
                'x': mult*2.7,
                'y': 7.17*mult
            },
            {
                'x': mult*1.84,
                'y': 4.88*mult
            },
            {
                'x': mult*2.72,
                'y': 2.81*mult
            }
        ];

        if(topstations.length==7){
            for(let i = 0; i<7; ++i){
                topstations[i]['x']= odd_positions[i]['x'];
                topstations[i]['y']= odd_positions[i]['y'];
            }
        }
        else{
            for(let i = 0; i<8; ++i){
                topstations[i]['x']= even_positions[i]['x'];
                topstations[i]['y']= even_positions[i]['y'];
            }
        }
        console.log(topstations);

        // this.circleLoadingG.attr("opacity",0);

        let linegroups = this.svg.selectAll("g .linegroup").data(pairs);
        linegroups.exit().remove();
        linegroups = linegroups.enter().append("g").merge(linegroups);
        linegroups.classed("linegroup",true);

        let linewidthscale = d3.scaleLinear()
            .domain([d3.min(pairs, p=>p['total']), d3.max(pairs, p=>p['total'])])
            .range([5, 30]);

        linegroups.each(function(d){
            d3.select(this).selectAll('*').remove();
            d3.select(this).append('line').attr("x1", d['station1']['x'])
                .attr('y1', d['station1']['y'])
                .attr('x2', d['station2']['x'])
                .attr('y2', d['station2']['y'])
                .style('stroke-width', linewidthscale(d['total']));
        });

        let circles = this.svg.selectAll("circle").data(topstations);
        circles.exit().remove();
        circles = circles.enter().append("circle").merge(circles);

        circles.attr("cx", d=> d['x'])
            .attr("cy", d=> d['y'])
            .attr("r", 30)
            .classed("circles", true);

        this.svg.attr("transform", "translate(600, -300)");

        let circle_texts = this.svg.selectAll("text").data(topstations);
        circle_texts.exit().remove();
        circle_texts = circle_texts.enter().append("text").merge(circle_texts);

        circle_texts.attr("x", d=> d['x'])
            .attr("y", d=> d['y']+45)
            .text(d=> d['station_name'])
            .classed("circleText", true);


        //Creates a legend element and assigns a scale that needs to be visualized
        // this.legendSvg.append("g")
        //     .attr("class", "legendQuantile")
        //     .attr("transform", "translate(0,50)");
        //
        // let legendQuantile = d3.legendColor()
        //     .shapeWidth(100)
        //     .cells(10)
        //     .orient('horizontal')
        //     .scale(colorScale);
        //
        // this.legendSvg.select(".legendQuantile")
        //     .call(legendQuantile);


        // //for reference:https://github.com/Caged/d3-tip
        // //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                // return the HTML content returned from that method.
                let tooltip_data = { "count": d['total']};
                return that.tooltip_render(tooltip_data);
            });
        this.svg.call(tip);
        linegroups.on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        linegroups.on('click', function(d){

            console.log(d);
            let selectedStationsData=[];
            selectedStationsData.push(d['station1']['station_id']);//("67");
            selectedStationsData.push(d['station2']['station_id']);//("22");
            //passing the Start date by day and month
            selectedStationsData.push(cityBikeInfo[0]['starttime']);
            selectedStationsData.push(cityBikeInfo[cityBikeInfo.length-1]['starttime']);  //This is the end date

            that.lineChart.update(selectedStationsData);

            // let selectedDays=[];
            // selectedDays.push("01/01/2016");
            // selectedDays.push("09/15/2016");
            // selectedDays.push("07/01/2016");
            // that.lineChart.updateHoursLineChart(selectedDays,selectedStationsData[0],selectedStationsData[1]);
        });
    };
}
