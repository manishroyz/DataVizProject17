
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

            console.log(bikeData[39480]);
            let parser = d3.timeParse("%m/%d/%Y %H:%M:%S");
            let parsedDate = parser(bikeData[39480]['starttime']);
            console.log(bikeData[39480]['starttime']);
            console.log(parsedDate);

            /*
            let customTimeFormat = d3.timeFormat([
                [":%Y", function(d) { return d.getSeconds(); }],
                ["%I:%M", function(d) { return d.getMinutes(); }],
                ["%I %p", function(d) { return d.getHours(); }],
                ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
                ["%B", function(d) { return d.getMonth(); }],
                ["%Y", function() { return true; }]
            ]);
            let a = customTimeFormat(parsedDate);
            console.log(a);
            */

            // CREATING TIME OBJECT
            let times = []; //[{"Year": "", "Month": "", "Day": "", "Hour": ""}];
            let year = parsedDate.getFullYear();
            let month = parsedDate.getMonth();
            let day = parsedDate.getDate();
            let hour = parsedDate.getHours();
            console.log(year);
            console.log(month);
            console.log(day);
            console.log(hour);
            times.push({year, month, day, hour });
            console.log(times);

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


            // STATION DATA COLLATION
            let filteredStartStationNames = bikeDataFiltered.map(function (d) {
                return d['start station name'];
            });
            console.log(filteredStartStationNames);

            // STATION RELATION DATA -- TO BE USED FOR PLOTTING THE GRAPH NODES(STATIONS) AND EDGES(TRIPS)
            let filteredStationData = [];
            bikeDataFiltered.forEach(function (d) {
                filteredStationData.push( { "startStationId" : d['start station id'] ,
                    "startStationName" : d['start station name'],
                    "startStationLat" : d['start station latitude'] ,
                    "startStationLon" : d['start station longitude'],
                    "endStationId" : d['end station id'] ,
                    "endStationName" : d['end station name'],
                    "endStationLat" : d['end station latitude'] ,
                    "endStationLon" : d['end station longitude'],
                    "startTime" : d['starttime'] ,
                    "endTime" : d['stoptime'],
                    "tripTime" : d['tripduration']
                })
            });
            console.log(filteredStationData);

            // FETCHING ALL STATION IDS AND CONCATENATING THEM
            let filteredStartStationId = bikeDataFiltered.map(function (d) {
                return d['start station id'];
            });
            console.log(filteredStartStationId);
            let filteredEndStationId = bikeDataFiltered.map(function (d) {
                return d['end station id'];
            });
            console.log(filteredEndStationId);

            let filteredAllStationId = filteredStartStationId.concat(filteredEndStationId);
            console.log(filteredAllStationId);


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
                // console.log(stationIdsDistinct[j]);
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
                    //else
                    //return false;
                };
            }
            console.log(stationIdsDistinctData);

            let jso = JSON.stringify(stationIdsDistinctData);
            console.log(jso);




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
