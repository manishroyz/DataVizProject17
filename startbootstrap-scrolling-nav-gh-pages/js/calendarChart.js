class CalendarChart{

    constructor(data){
        console.log('in calendar');
        this.day = d3.timeFormat("%w");
        this.week = d3.timeFormat("%U");
        this.percent = d3.format(".1%");
        this.format = d3.timeFormat("%Y-%m-%d");
        this.format2 = d3.timeFormat("%d/%m/%Y");
        this.tformat = d3.timeFormat("%H:%M:%S");
        this.year = '2016';

        //this.colors = ['rgb(226,247,207)', 'rgb(202,255,183)', 'rgb(186,228,179)', 'rgb(116,196,118)','rgb(35,139,69)' ];
        this.colors = ['rgb(232,246,243)', 'rgb(162,217,206)', 'rgb(115,198,182)', 'rgb(22,160,133)','rgb(17,122,101)' ];

        this.margin = { top: 20, right: 5, bottom: 20, left: 0 };

        let svgBounds = d3.select("#time-bars").node().getBoundingClientRect();
        this.width = svgBounds.width - this.margin.left - this.margin.right;
        this.height = 136 - this.margin.top - this.margin.bottom;
        this.cellSize = 15;

        // Drawing the outer svg for the calendar
        this.svg_divCalendar = d3.select("#divCalendar").append("svg")
            .attr("class", "cal")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + 2.5*this.margin.left + "," + this.margin.top + ")");

        this.aggregatedData=[];
        let that =this;
        // Reading Aggregated data day wise trips
        d3.csv("data/AggregatedByDay.csv", function (error, aggregatedData) {
            that.aggregatedData = aggregatedData;
        });

    };

    update(selectedTime){
        console.log(selectedTime);
        let that = this;
        let chosenDates=[];

        // Aggregated data day wise trips
        console.log(this.aggregatedData);
        // let a = this.aggregatedData.sort(function(a,b){
        //     return d3.ascending(a['trip_counts'],b['trip_counts'])
        // });
        // console.log(a);

        let max = '7000';
        //d3.max( that.aggregatedData, d=> +d['trip_counts']);
        console.log(max);
        let min = '0';
        //d3.min( that.aggregatedData, d=> +d['trip_counts']);
        console.log(min);

        let colorScale = d3.scaleQuantize()
            .domain([min, max])
            .range(that.colors);

        let catdata = [0,1400,2800,4200,5600];
        let catd = catdata[1] - catdata[0]-1;


        let startMonth = selectedTime['start']['month'];
        let endMonth = selectedTime['end']['month'];
        let startDay =selectedTime['start']['day'];
        let endDay = selectedTime['end']['day'];
        let dateFrom = startDay  +"/" + startMonth + "/2016";
        let dateTo = endDay +"/" + endMonth +"/2016";
        console.log('DATE RANGE CHOSEN............');
        //console.log(dateFrom);
        //console.log(dateTo);
        let d1 = dateFrom.split("/");
        let d2 = dateTo.split("/");
        let fromDate = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
        let toDate   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
        console.log(fromDate);
        console.log(toDate);

        // // Remove svg elements on update
        // d3.selectAll("svg.cal").remove();
        // d3.selectAll("svg.barchart").remove();


        //Label for calendar months
        let monthlabels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        let multipliers = [1, 5.5, 10, 14.2, 18.8, 23.4, 27.7, 31.8, 35.2, 40.1, 44.3, 48.3];
        let weeklabels = ['S','M','T','W','T','F','S'];

        // Appending text labels for the months
        for(let i = 0; i < 12; i++){
            this.svg_divCalendar.append("text")
                .attr("transform", "translate(" + that.cellSize*(multipliers[i]+1) + ",-5)rotate(0)")
                .style("text-anchor", "left")
                .style("font", "11px sans-serif")
                .text(function(d) { return monthlabels[i]; });
        }

        // Appending text labels for the weeks
        for(let i = 0; i < 7; i++){
            this.svg_divCalendar.append("text")
                .attr("transform", "translate(" + (-18) + ","+ (i+0.4)*16    +")rotate(0)")
                .style("text-anchor", "left")
                .style("font", "10px sans-serif")
                .text(function(d) { return weeklabels[i]; });
        }

        // Adding the day boxes
        let rect = this.svg_divCalendar.selectAll(".day")
            .data(function() {
                let d = that.year;
                //console.log(d);
                //console.log(d3.timeDay.range(new Date(d, 0, 1), new Date(d, 11, 31), 1));
                return d3.timeDay.range(new Date(d, 0, 1), new Date(d, 11, 32), 1)
            })
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", that.cellSize)
            .attr("height", that.cellSize)
            .attr("x", function(d) {
                return that.week(d) * that.cellSize;
            })
            .attr("y", function(d) {
                return that.day(d) * that.cellSize;
            })
            //this formats the data to YY-MM-DD
            .datum(that.format2)
            .on("click", function(d) {
                if(d3.select(this).attr("class") =="daySelected"){
                    d3.select(this).attr("class", function (d) {
                        return "daySelectedChosen";
                    });
                    console.log('Selected Day is--'+d);
                    chosenDates.push(d);
                    console.log('ALL CHOSEN DATES---->');
                    console.log(chosenDates);
                }
                else if(d3.select(this).attr("class") =="daySelectedChosen"){
                    d3.select(this).attr("class", function (d) {
                        return "daySelected";
                    });
                    if(chosenDates.indexOf(d)!= -1){
                        let index = chosenDates.indexOf(d);
                        console.log(index);
                        chosenDates.splice(index,1);
                        console.log('ALL CHOSEN DATES---->');
                        console.log(chosenDates);
                    }
                }
            });

        // Date information for each grid ---also text for the tooltip
        rect.append("title")
            .text(function(d) {
                //console.log(d);
                return d;
            });

        // heavy line separating the months of the year
        this.svg_divCalendar.selectAll(".month")
            .data(function() {
                let d= that.year;
                //console.log(d3.timeMonth.range(new Date(d, 0, 1), new Date(d, 11, 31), 1));
                return d3.timeMonth.range(new Date(d, 0, 1), new Date(d, 11, 31), 1);
            })
            .enter().append("path")
            .attr("class", "month")
            .attr("d", that.monthPath);

        let rectFiltered = rect.filter(function (d) {
            //console.log(d);
            let c = d.split("/");
            let checkDate = new Date(c[2], parseInt(c[1])-1, c[0]);
            if(checkDate >= fromDate && checkDate <= toDate){
                return d;
            }
        });

        rectFiltered
            .transition().duration(1500)
            .style("fill",function (d) {
                let dayNo = d3.timeFormat("%j");
                let c = d.split("/");
                let checkDate = new Date(c[2], parseInt(c[1])-1, c[0]);
                //console.log(d);

                // Gives the dayNumber which can be used to get the data from the Aggregated data set
                let dayNumber = dayNo(checkDate);
                //console.log(dayNumber);
                //console.log(that.aggregatedData[dayNumber-1]['trip_counts']);
                return colorScale(that.aggregatedData[dayNumber-1]['trip_counts']);

            })
            .attr("class","daySelected");
        // .style("fill", "#FAF23A");

        //Legend for heatmap calender
        let legend = this.svg_divCalendar.selectAll(".legend")
            .data(catdata)
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", that.width-100)
            .attr("y", function(d, i) { return that.cellSize * i; })
            .attr("width", that.cellSize)
            .attr("height", that.cellSize)
            .style("fill", function(d, i) { return that.colors[i]; })
            .style("stroke", "#000");


        legend.append("text")
            .text(function(d,i) {
                return i*1400 + " - " + (i+1)*1400;
            })
            .attr("y", function(d, i) { return that.cellSize * (i+0.8); })
            .attr("x", that.width-100 + that.cellSize + 5);



    };

    // Returns path to enclose the month ----based on first day of the month
    monthPath(t0) {
        let day = d3.timeFormat("%w");
        let week = d3.timeFormat("%U");
        let percent = d3.format(".1%");
        let format = d3.timeFormat("%Y-%m-%d");
        let tformat = d3.timeFormat("%H:%M:%S");
        let cellSize = 15;
        let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0),
            w0 = +week(t0),
            d1 = +day(t1),
            w1 = +week(t1);

        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }


}