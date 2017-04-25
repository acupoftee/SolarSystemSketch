// svg width and height
var wind = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = wind.innerWidth || e.clientWidth || g.clientWidth,
    y = wind.innerHeight || e.clientHeight || g.clientHeight;

// svg margins
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    otherDivHeights = 150,
    width = x - margin.left - margin.right - 30,
    height = y - margin.top - margin.botton - 30 - otherDivHeights;

// initialie svg
var svg = d3.select("#chart").append("svg")
    .attr("class", "chartWrapper")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// container for all svg patterns
var patternContainer = svg.append("g").attr("class", "patternContainer");

// container for all svg planets
var planetContainer = svg.append("g").attr("class", "planetContainer");

// show planet name in tool tip
var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

var m = 3,
    padding = 5,
    radiusScale = 1,
    force,
    nodes, 
    circle,
    maxSize,
    labels;

// load planet data
d3.csv("planetSizes.csv", function(error, data) {
    // convert to numeric values
    // note that the value for Saturn's radius should be 9.14
    // 21.56 is the value needed to include Saturn's rings without clipping
    data.forEach(function(d) {
        d.meanRadiusEarth = +d.meanRadiusEarth;
    });

    // save sun size
    maxSize = d3.max(data, function(d) { return d.meanRadiusEarth; })

    // create planet dataset
    nodes = d3.range(data.length).map(function(d,i) {
        return {
            radius: data[i].meanRadiusEarth,
            body: data[i].body,
            type: data[i].type,
            imgsrc: data[i].imgsrc
        };
    });

    force = d3.forceSimulation()
        .nodes(nodes)
        .size([width, height])
        .gravity(.02)
        .charge(0)
        .on("tick", tick)
        .start();
})

