class LineChart {




    constructor(data) {
        let divLineChart = d3.select("#line-chart").classed("content", true);
        let divHoursLineChart = d3.select("#hours-line-chart").classed("content", true);

        this.margin = {top: 20, right: 200, bottom: 100, left: 50};
        let svgBounds = divLineChart.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width -this.margin.left;
        this.svgHeight = 500 - this.margin.top - this.margin.bottom;

        this.svg = divLineChart.append("svg")
            .attr("width",this.svgWidth+ this.margin.left + this.margin.right)
            .attr("height",this.svgHeight+ this.margin.top + this.margin.bottom);
        // .attr("transform", "translate(" + this.margin.right + "," + this.margin.top + ")");


        // Set the dimensions of the canvas / graph
        this.marginHoursChart = {top: 20, right: 100, bottom: 20, left: 50},
            this.widthHoursLineChart = this.svgWidth - this.marginHoursChart.left,
            this.heightHoursLineChart = 500 - this.marginHoursChart.top - this.marginHoursChart.bottom;

        this.svgHoursLineChart = divHoursLineChart.append("svg")
            .attr("width", this.widthHoursLineChart + this.marginHoursChart.left + this.marginHoursChart.right)
            .attr("height", this.heightHoursLineChart+ this.marginHoursChart.top+this.marginHoursChart.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.marginHoursChart.left + ",0)");



        let colors = [
            'steelblue',
            'green',
            'red',
            'purple'
        ]


    };

    update(selectedStationsData, cityBikeInfo){

        let data = cityBikeInfo;

        let mySelf = this;
        console.log(mySelf);
        this.svg.selectAll("*").remove();

        let startDate = selectedStationsData[2];
        let endDate = selectedStationsData[3];

        let neededData = new Array();

        data.forEach(function(d) {

            if( (d.start_station_id == selectedStationsData[0] || d.start_station_id == selectedStationsData[1]) && (d.end_station_id == selectedStationsData[0] || d.end_station_id == selectedStationsData[1])  &&
                ( d.starttime >=  startDate  && d.stoptime <= endDate) )
                neededData.push(d);
        });

        console.log(neededData);
        if(neededData == null ) return true;


        // tripsWithCount holds the dates as days in the interval selected and their counts as key value pairs
        let tripsWithCount = d3.nest()
            .key(function(d) {
                let DateWithoutTime = (new Date(d.starttime).getMonth() + 1) + "/" + new Date(d.starttime).getDate() + "/" + new Date(d.starttime).getFullYear();
                return DateWithoutTime;
            })
            .rollup(function(d) {
                return d3.sum(d, function(g) {return 1; });
            }).entries(neededData);


        if(tripsWithCount == null)
            return true;
        else{

            let g =	mySelf.svg.append("g")
                .attr("transform", "translate(" + 50+ "," + mySelf.margin.top + ")")
            //.attr("transform","translate(10,200)");
            // parse the date / time
            let parseTime = d3.timeParse("%m/%d/%Y");

            // set the ranges
            let x = d3.scaleTime().range([0, mySelf.svgWidth]);
            let y = d3.scaleLinear().range([mySelf.svgHeight, 0]);

            // define the line
            let valueline = d3.line()
                .x(function(d) {
                    return x(d.key);
                })
                .y(function(d) {
                    return y(d.value);
                });
            let tripsCountSelected = 0;

            // format the data
            tripsWithCount.forEach(function(d) {
                d.key = parseTime(d.key);
                d.value = d.value;
                tripsCountSelected++;
            });

            // Scale the range of the data
            x.domain(d3.extent(tripsWithCount, function(d) { return d.key; }));
            y.domain([0, d3.max(tripsWithCount, function(d) { return d.value; })]);

            // Add the valueline path.
            g.append("path")
                .data([tripsWithCount])
                .attr("class", "line")
                .attr("d", valueline);

            // Add the X Axis
            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + mySelf.svgHeight  + ")")
                .call(d3.axisBottom(x)
                    .ticks((tripsCountSelected<=20)?(tripsCountSelected-1): 20)
                    .tickFormat(d3.timeFormat("%m-%d-%Y")))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            // Add the Y Axis
            let max = (d3.max(tripsWithCount, function(d) { return d.value; }));
            g.append("g")
                .attr("class", "axis")
                // .attr("transform", "translate(" +mySelf.svgWidth  + ",0)")
                .call(d3.axisLeft(y)
                    .ticks((max<=15)?max:15).tickFormat(d3.format("d")))
                .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", -43)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Trips Count");

            // Add X GridLines
            g.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + mySelf.svgHeight + ")")
                .call(d3.axisBottom(x)
                    .ticks((tripsCountSelected<=31)?(tripsCountSelected-1): 20)
                    .tickSize(-mySelf.svgHeight)
                    .tickFormat("")
                );

            // add the Y gridlines
            g.append("g")
                .attr("class", "grid")
                .call(d3.axisLeft(y)
                    .ticks((max<=15)?max:15)
                    .tickSize(-mySelf.svgWidth)
                    .tickFormat("")
                );

            g.selectAll("circle")
                .data(tripsWithCount)
                .enter().append("circle")
                .classed('testCircle',true)
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.key);})
                .attr("cy", function(d) { return y(d.value); })
                .style("fill","none")
                .style("stroke","none")
                .style("pointer-events","all")
                .append("title")
                .text(function(d) { return "Day: " + (d.key.getMonth()+1) +"-"+ d.key.getDate() +"-"+ d.key.getFullYear() + " ,Value: " + d.value; });
        }
    }


/////////////////////////////////////////////Hours Line Chart//////////////////////////////////////


    updateHoursLineChart(selectedDays, bikeDataFiltered){
        let data =bikeDataFiltered;

        this.svgHoursLineChart.selectAll("*").remove();
        let mySelf = this;





        let neededDaysData = new Array();

        data.forEach(function(d) {
                let DateWithoutTime = (d.starttime.split(" "))[0];
                let day = DateWithoutTime.split("/")[1];
                let month = DateWithoutTime.split("/")[0];
                let realDate = day+"/"+month+"/2016";
                console.log("real date is: " + realDate);
                if( selectedDays.indexOf(realDate)  != null && selectedDays.indexOf(realDate)  >= 0)
                    neededDaysData.push(d);
        });

        // console.log(neededDaysData);
        if(neededDaysData == null ) return true;


        // tripsWithCount holds the dates as days in the interval selected and their counts as key value pairs
        let tripsHoursWithCount = d3.nest()
            .key(function(d) {
                let DatWithTime = (new Date(d.starttime).getMonth() + 1) + "/" + new Date(d.starttime).getDate() + "/" + new Date(d.starttime).getFullYear() + " "+ new Date(d.starttime).getHours();
                return DatWithTime;
            })
            .rollup(function(d) {
                return d3.sum(d, function(g) {return 1; });
            }).entries(neededDaysData);




        // console.log(tripsHoursWithCount);
        if(tripsHoursWithCount == null)
            return true;


        tripsHoursWithCount.forEach(function(d) {
            d.day = d.key.split(" ")[0];
            d.key = d.key.split(" ")[1];
            d.value = d.value;
        });




        // Set the dimensions of the canvas / graph
        let margin = mySelf.marginHoursChart,
            width = mySelf.widthHoursLineChart,
            height = mySelf.heightHoursLineChart;


// Adds the svg canvas
        let svg = mySelf.svgHoursLineChart;



// Set the ranges
        let x = d3.scaleLinear().range([0, width]).nice(); //d3.scaleBand().rangeRound([0, width]).paddingInner(1);//
        let y = d3.scaleLinear().range([height, 0]);   //d3.scaleBand().rangeRound([height, 0])paddingInner(1);

// Define the line
        let priceline = d3.line()
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y(d.value); });



        // Scale the range of the data

        //x.domain(d3.extent(tripsHoursWithCount, function(d) { return d.key; }));
        y.domain([0, d3.max(tripsHoursWithCount, function(d) { return d.value + 1; })]);
        x.domain([0,24]);

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(24)
                .tickSize(-height)
                .tickFormat("")
            ).append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(0) translate("+ (width)+",15)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("hours");

        let max = (d3.max(tripsHoursWithCount, function(d) { return d.value + 1; }));
        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(max >15?15: max)
                .tickSize(-width)
                .tickFormat("")
            )
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Trips Count");



        // Nest the entries by symbol
        let dataNest = d3.nest()
            .key(function(d) {return d.day;})
            .entries(tripsHoursWithCount);


        console.log(dataNest);
        // set the colour scale
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        let legendSpace = width/dataNest.length; // spacing for the legend

        // Add the X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        // let max = d3.max(tripsHoursWithCount, function(d) { return d.value; });
        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(max >15?15: max).tickFormat(d3.format("d")));
        // Loop through each day
        dataNest.forEach(function(d,i) {


            svg.append("path")
                .attr("class", "line")
                .style("stroke", function() { // Add the colours dynamically
                    return d.color = color(d.key); })
                .attr("data-legend",function() { return d.key})
                .attr("d", priceline(d.values));



            let legendRectSize = 18;
            let legendSpacing = 8;



            let legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d, i) {
                    let height = legendRectSize + legendSpacing;
                    let offset =  height * color.domain().length / 2;
                    let horz = 2 * legendRectSize;
                    let vert = 1.4*i * height - offset*0.1;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .classed('legendInner_rect',true)
                .style('stroke', color);


            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function() { return d.key; });





        });



        svg.selectAll("circle")
            .data(tripsHoursWithCount)
            .enter().append("circle")
            .classed('testCircle',true)
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.key);})
            .attr("cy", function(d) { return y(d.value); })
            .style("fill","none")
            .style("stroke","none")
            .style("pointer-events","all")
            .append("title")
            .text(function(d) { return "Day:" + d.day+", Hour: " + d.key+ " , Value: " + d.value; });


    };
};
