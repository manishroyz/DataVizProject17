
        let timeChart = new TimeChart();

        let selectionChart = new SelectionChart();

        let circleChart = new CircleChart(selectionChart);


        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        /*
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
            let mapChart = new MapChart(circleChart, timeChart, electionWinners);
            mapChart.update();
        });
        */

        d3.csv("data/201601-citibike-tripdata.csv", function (error, bikeData) {

            let parser = d3.timeParse("%m/%d/%Y %H:%M:%S");

            // CREATING TIME OBJECT
            //let times = []; //[{"Year": "", "Month": "", "Day": "", "Hour": ""}];
            //let year = parsedDate.getFullYear();
            //let month = parsedDate.getMonth();
            //let day = parsedDate.getDate();
            //let hour = parsedDate.getHours();
            //console.log(year);
            //console.log(month);
            //console.log(day);
            //console.log(hour);
            //times.push({year, month, day, hour });
            //console.log(times);

            // FILTERING DATA BASED ON DATE RANGE
            let bikeDataFiltered =[];
            let startDay = 5;
            let endDay = 7;
            bikeData.forEach(function (d) {
                let parsedDate = parser(d['starttime']);
                let day = parsedDate.getDate();
                if(day >= startDay && day <= endDay){
                    bikeDataFiltered.push(d);
                }
            });
            console.log(bikeDataFiltered);

            // FETCHING ALL STATION IDS AND CONCATENATING THEM
            let filteredStartStationId = bikeDataFiltered.map(function (d) {
                return d['start station id'];
            });
            //console.log(filteredStartStationId);
            let filteredEndStationId = bikeDataFiltered.map(function (d) {
                return d['end station id'];
            });
            //console.log(filteredEndStationId);
            let filteredAllStationId = filteredStartStationId.concat(filteredEndStationId);
            //console.log(filteredAllStationId);

            window.stationIdsDistinct = [];
            filteredAllStationId.forEach(function (d) {
                let check = checkIfPresent(d);
                if(!check){
                    stationIdsDistinct.push(d);
                }
            });
            console.log(stationIdsDistinct);

            let stationIdsDistinctData = [];
            for(let i=0; i< stationIdsDistinct.length; i++){
                for(let j=0; j< bikeDataFiltered.length; j++){
                    let flag = false;
                    if(stationIdsDistinct[i] == bikeDataFiltered[j]['start station id'] ){
                        stationIdsDistinctData.push( {  "stationId" : bikeDataFiltered[j]['start station id'] ,
                            "stationName" : bikeDataFiltered[j]['start station name'],
                            "stationLat" : bikeDataFiltered[j]['start station latitude'],
                            "stationLon" : bikeDataFiltered[j]['start station longitude'] });
                        flag = true;
                    }
                    else if(stationIdsDistinct[i] == bikeDataFiltered[j]['end station id'] ){
                        stationIdsDistinctData.push( {  "stationId" : bikeDataFiltered[j]['end station id'] ,
                            "stationName" : bikeDataFiltered[j]['end station name'],
                            "stationLat" : bikeDataFiltered[j]['end station latitude'] ,
                            "stationLon" : bikeDataFiltered[j]['end station longitude'] });
                        flag = true;
                    }
                    if(flag == true)
                        break;
                }
            }
            console.log(stationIdsDistinctData);

            let jso = JSON.stringify(stationIdsDistinctData);
            //console.log(jso);
        });

        function checkIfPresent(inputVal) {
            let flag = false;
            stationIdsDistinct.forEach(function (d) {
                if(inputVal == d ){
                    flag = true;
                }
            });
            return flag;
        }
