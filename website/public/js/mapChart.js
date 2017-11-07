
class mapChart {

    /**
     * Constructor for the Map Chart
     *
     * @param circleChart instance of CircleChart
     * @param timeChart instance of TimeChart
     * @param citiesWithData data corresponding to the winning parties over mutiple election years
     */
    constructor (circleChart, timeChart, citiesWithData) {

        //Creating Mapchart instance
        this.circleChart = circleChart;
        this.timeChart = timeChart;

        // the data
        this.citiesWithData = citiesWithData;

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divmapChart = d3.select("#map-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divmapChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divmapChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);
    };


    /**
     * Creates a chart with the map, populates required elements for the Map Chart
     */
    update () {

        //Domain definition for global color scale
        //let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        //let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        // this.colorScale = d3.scaleQuantile()
        //     .domain(domain)
        //     .range(range);

        // ******* TODO: DRAW MAP *******

        // ******* TODO: CALL UPDATE ON OTHER CHARTS WHEN A CITY ON MAP IS CLICKED *******
    };


};