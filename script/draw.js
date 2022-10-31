var svgContainer = d3.select("#main").append("svg")
  	.attr("width", 560)
  	.attr("height", 1000)
  	.attr("id", "#mainSVG");

var data = [
            { x: 0, y: 0 },
            { x: 1, y: 3 },
            { x: 2, y: 15 },
            { x: 5, y: 15 },
            { x: 6, y: 1 },
            { x: 7, y: 5 },
            { x: 8, y: 1 },
            { x: 9, y: -3 }];

var xScale = d3.scaleLinear()
    .domain([0, 8]).range([25, 175]);
var yScale = d3.scaleLinear()
    .domain([0, 20]).range([175, 25]);

var line = d3.line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    // curveBasis is used
    .curve(d3.curveBasisClosed);

svgContainer.append("path")
    .attr("d", line(data))
    .attr("fill", "steelblue")
    .attr("stroke", "green");
