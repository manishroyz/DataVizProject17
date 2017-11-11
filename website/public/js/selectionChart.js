/** Class implementing the selectionChart. */
class SelectionChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(circleChart){
        this.circleChart = circleChart;
        // this.divSelectionChart = d3.select("#selection-chart").classed("sideBar", true);
    };

    /**
     * Creates a list of time and criteria that have been selected by brushing over the Time Chart
     *
     * @param selectedTime data corresponding to the states selected on brush
     */
    update(selectedTime){
        console.log(selectedTime);
        let that = this;

        //Update the visualization on brush events over the Circle chart
        d3.csv("data/BostonMA.csv", function (error, bikeData) {
            console.log(bikeData);

            let selectedMonths = selectedTime['selectedMonths'];
            let selectedDays = selectedTime['selectedDays'];
            let selectedHours = selectedTime['selectedHours'];

            console.log(selectedMonths);
            console.log(selectedDays);
            console.log(selectedHours);

            let startMonth =selectedMonths[0];
            let endMonth = selectedMonths[(selectedMonths.length)-1];
            let startDay =selectedDays[0];
            let endDay = selectedDays[(selectedDays.length)-1];
            let startHour = selectedHours[0];
            let endHour = selectedHours[(selectedHours.length)-2];

            //console.log(startMonth);
            //console.log(endMonth);
            //console.log(startDay);
            //console.log(endDay);
            //console.log(startHour);
            //console.log(endHour);

            let parser = d3.timeParse("%m/%d/%Y %H:%M");

            // FILTERING DATA BASED ON DATE RANGE
            let bikeDataFiltered =[];
            bikeData.forEach(function (d) {
                let parsedDate = parser(d['starttime']);
                //console.log(parsedDate);
                let month = parsedDate.getMonth() + 1;  //0-11
                let day = parsedDate.getDate();  //1-31
                let hour = parsedDate.getHours(); //0-23
                //console.log(month);
                //console.log(day);
                //console.log(hour);

                if ((month >= startMonth && month <=endMonth) && (day >= startDay && day <= endDay) && (hour >= startHour && hour < endHour)) {
                    bikeDataFiltered.push(d);
                }
            });


            console.log(bikeDataFiltered);
            that.circleChart.update(bikeDataFiltered);
        });

    };


}
