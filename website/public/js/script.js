
        let timeChart = new TimeChart();

        let selectionChart = new SelectionChart();

        let circleChart = new CircleChart(selectionChart);


        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
            let mapChart = new MapChart(circleChart, timeChart, electionWinners);
            mapChart.update();
        });
