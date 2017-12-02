class CalendarChart{

    constructor(data){
        console.log('in calendar');
        this.day = d3.timeFormat("%w");
        this.week = d3.timeFormat("%U");
        this.percent = d3.format(".1%");
        this.format = d3.timeFormat("%Y-%m-%d");
        this.format2 = d3.timeFormat("%d-%m-%Y");
        this.tformat = d3.timeFormat("%H:%M:%S");
        this.year = '2016';

        this.margin = { top: 20, right: 25, bottom: 20, left: 15 };
        this.width = 960 - this.margin.left - this.margin.right;
        this.height = 136 - this.margin.top - this.margin.bottom;
        this.cellSize = 15;
    };

    update(selectedTime){
        console.log(selectedTime);
        let that = this;
        let chosenDates=[];

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

        // Remove svg elements on update
        d3.selectAll("svg.cal").remove();
        d3.selectAll("svg.barchart").remove();

        // Drawing the outer svg for the calendar
        let svg_divCalendar = d3.select("#divCalendar").append("svg")
            .attr("class", "cal")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + 2.5*this.margin.left + "," + this.margin.top + ")");

        //Label for calendar months
        let monthlabels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        let multipliers = [1, 5.5, 10, 14.2, 18.8, 23.4, 27.7, 31.8, 35.2, 40.1, 44.3, 48.3];
        let weeklabels = ['S','M','T','W','T','F','S'];

        // Appending text labels for the months
        for(let i = 0; i < 12; i++){
            svg_divCalendar.append("text")
                .attr("transform", "translate(" + that.cellSize*(multipliers[i]+1) + ",-5)rotate(0)")
                .style("text-anchor", "left")
                .style("font", "11px sans-serif")
                .text(function(d) { return monthlabels[i]; });
        }

        // Appending text labels for the weeks
        for(let i = 0; i < 7; i++){
            svg_divCalendar.append("text")
                .attr("transform", "translate(" + (-18) + ","+ (i+0.4)*16    +")rotate(0)")
                .style("text-anchor", "left")
                .style("font", "10px sans-serif")
                .text(function(d) { return weeklabels[i]; });
        }

        // Adding the day boxes
        let rect = svg_divCalendar.selectAll(".day")
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
        svg_divCalendar.selectAll(".month")
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
                                let c = d.split("-");
                                let checkDate = new Date(c[2], parseInt(c[1])-1, c[0]);
                                if(checkDate >= fromDate && checkDate <= toDate){
                                    return d;
                                }
                            });

        rectFiltered.attr("class","daySelected")
                    .transition().duration(1500);
                   // .style("fill", "#FAF23A");




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