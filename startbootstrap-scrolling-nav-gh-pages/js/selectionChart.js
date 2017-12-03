/** Class implementing the selectionChart. */
class SelectionChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(circleChart, calendarChart, bikeData){
        this.circleChart = circleChart;
        this.calendarChart = calendarChart;
        this.bikeData = bikeData;
        // this.divSelectionChart = d3.select("#selection-chart").classed("sideBar", true);
    };

    /**
     * Creates a list of time and criteria that have been selected by brushing over the Time Chart
     *
     * @param selectedTime data corresponding to the states selected on brush
     */
    update(selectedTime){
        let bikeData = this.bikeData;
        console.log(selectedTime);
        let that = this;

        //Update the visualization on brush events over the Circle chart

            console.log(bikeData);

            let startMonth = selectedTime['start']['month'];
            let endMonth = selectedTime['end']['month'];
            let startDay =selectedTime['start']['day'];
            let endDay = selectedTime['end']['day'];
            let startHour = selectedTime['start']['hour'];
            let endHour = selectedTime['end']['hour'];
            let startMinute = selectedTime['start']['minute'];
            let endMinute = selectedTime['end']['minute'];

            //console.log(startMonth);
            //console.log(endMonth);
            //console.log(startDay);
            //console.log(endDay);
            //console.log(startHour);
            //console.log(endHour);
            //console.log(startMinute);
            //console.log(endMinute);

            let parser = d3.timeParse("%m/%d/%Y %H:%M");

            let dateFrom = startDay  +"/" + startMonth + "/2016"+ "/" + startHour + "/" + startMinute;
            let dateTo = endDay +"/" + endMonth +"/2016" + "/" + endHour + "/" + endMinute;
            let d1 = dateFrom.split("/");
            let d2 = dateTo.split("/");
            let from = new Date(d1[2], parseInt(d1[1])-1, d1[0], d1[3], d1[4]);  // -1 because months are from 0 to 11
            let to   = new Date(d2[2], parseInt(d2[1])-1, d2[0], d2[3], d2[4] );
            console.log(from);
            console.log(to);

            // FILTERING DATA BASED ON DATE RANGE

            let bikeDataFiltered =[];
            bikeData.forEach(function (d) {
                let parsedDate = parser(d['starttime']);
                //console.log(parsedDate);
                let month = parsedDate.getMonth() + 1;  //0-11
                let day = parsedDate.getDate();  //1-31
                let hour = parsedDate.getHours(); //0-23
                let minute = parsedDate.getMinutes(); //0-59

                let dateCheck = day +"/" + month +"/2016" + "/" + hour + "/" + minute;
                let c = dateCheck.split("/");
                let check = new Date(c[2], parseInt(c[1])-1, c[0], c[3], c[4]);
                //console.log(check);

                if(check >= from && check <= to){
                    bikeDataFiltered.push(d);
                }
            });
            console.log(bikeDataFiltered);
            that.calendarChart.update(selectedTime, bikeDataFiltered);
            that.circleChart.update(bikeDataFiltered);

    };
}

