


     	
		/* Lama's work */
		d3.csv("data/BostonStationsDataSet.csv", function(error, data) {
			let lineChart = new LineChart(null);
            let circleChart = new CircleChart(data);
            let selectionChart = new SelectionChart(circleChart);
            let timeChart = new TimeChart(selectionChart,lineChart);
			
		   
		 //  console.log(data);
           let map = new google.maps.Map(d3.select("#map").node(), {
 // zoom: 8,
  center: new google.maps.LatLng(42.362648, -71.10006094),
  mapTypeId: google.maps.MapTypeId.Satellite,
  zoom: 15,
  
  styles: [
				{stylers: [{saturation: -100}]},
                  {"featureType": "road.highway",elementType: "labels",stylers:[{visibility: "off"}]}, //turns off highway labels
                {"featureType": "road.arterial",elementType: "labels",stylers: [{visibility: "off"}]}, //turns off arterial roads labels
                {"featureType": "road.local",elementType: "labels",stylers: [{visibility: "off"}]},  //turns off local roads labels
				{"featureType": "poi",elementType: "labels",stylers:[{visibility: "off"}]}, //turns off highway labels
				{"featureType": "landscape",elementType: "labels",stylers:[{visibility: "off"}]} //turns off highway labels
  ]
});



		   
		   if (error) throw error;

  var overlay = new google.maps.OverlayView();

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
	  
	  var layer = d3.select(this.getPanes().overlayMouseTarget)

    .append("div")
        .attr("class", "stations");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;

	
		   var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed("tooltip",true);
	
	
			
     var  marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
          .enter().append("svg")
          .each(transform);
         // .attr("class", "stationsHovered");

		
       // Add a circle.
      marker.append("svg:circle")
    .attr("r", 6)
    .attr("cx", padding)
    .attr("cy", padding)
	 .on("mouseover", function(d){ 
         d3.select(this).style("fill", "red");
		 d3.select(this).attr("r", 16);
	 tooltip.text(d.value.station_name);
	 return tooltip.style("visibility", "visible");
	 
	 })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+20)+"px");})
    .on("mouseout", function(){d3.select(this).style("fill", "red");d3.select(this).attr("r", 6);return tooltip.style("visibility", "hidden");});
	
	
    

      function transform(d) {
		//  let dataVal = d;
        d = new google.maps.LatLng(d.value.station_lat, d.value.station_lon);
        d = projection.fromLatLngToDivPixel(d);
		
		
		
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")
			.append("text")
          .attr("x", padding +7)
          .attr("y", padding)
          .attr("dy", ".31em");
		//  .attr("title",function(d) {  return d.value.station_name; })
         // .text(function(d) {  return d.value.station_name; });
		
		  
		
      }
    };
  };

  // Bind our overlay to the map…
  overlay.setMap(map);
  
  
  
  

			
		});
		
			/* End of Lama's work */
   
