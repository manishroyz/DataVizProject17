
        let timeChart = new timeChart();

        let circleChart = new circleChart(selectionChart);

        let selectionChart = new selectionChart();

        // let circleChart = new ElectoralVoteChart(shiftChart);



        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
            let mapChart = new mapChart(circleChart, timeChart, electionWinners);
            mapChart.update();
        });
