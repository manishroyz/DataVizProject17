
/* Lama's work */
d3.csv("data/BostonStationsDataSet.csv", function(error, data) {
    let calendarChart = new CalendarChart(null);
    let lineChart = new LineChart(null);
    let circleChart = new CircleChart(data, lineChart);
    let selectionChart = new SelectionChart(circleChart);
    let timeChart = new TimeChart(selectionChart, lineChart, calendarChart);

    //  console.log(data);
    let map = new google.maps.Map(d3.select("#map").node(), {
        // zoom: 8,
        center: new google.maps.LatLng(42.362648, -71.10006094),
        mapTypeId: google.maps.MapTypeId.Satellite,
        zoom: 15,

        styles: [
            {stylers: [{saturation: -100}]},
            {"featureType": "road.highway", elementType: "labels", stylers: [{visibility: "off"}]}, //turns off highway labels
            {"featureType": "road.arterial", elementType: "labels", stylers: [{visibility: "off"}]}, //turns off arterial roads labels
            {"featureType": "road.local", elementType: "labels", stylers: [{visibility: "off"}]},  //turns off local roads labels
            {"featureType": "poi", elementType: "labels", stylers: [{visibility: "off"}]}, //turns off highway labels
            {"featureType": "landscape", elementType: "labels", stylers: [{visibility: "off"}]} //turns off highway labels
        ]
    });


    if (error) throw error;

    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function () {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "stations");

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function () {
            var projection = this.getProjection(),
                padding = 10;


            // Define the div for the tooltip
            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


            var marker = layer.selectAll("svg")
                .data(d3.entries(data))
                // .each(transform) // update existing markers
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker");

            // Add a circle.
            marker.append("circle")
                .attr("r", 4.5)
                .attr("cx", padding)
                .attr("cy", padding);

            function transform(d) {
                //  let dataVal = d;
                d = new google.maps.LatLng(d.value.station_lat, d.value.station_lon);
                d = projection.fromLatLngToDivPixel(d);

                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px")
                    .append("text")
                    .attr("x", padding + 7)
                    .attr("y", padding)
                    .attr("dy", ".31em")
                    .text(function (d) {
                        return d.value.station_name;
                    });


            }
        };

        // Bind our overlay to the map…
        overlay.setMap(map);

    };
});

/* End of Lama's work */
   
