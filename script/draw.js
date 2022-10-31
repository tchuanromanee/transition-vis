var svgContainer = d3.select("#main").append("svg")
  	.attr("width", 560)
  	.attr("height", 1000)
  	.attr("id", "#mainSVG");


//Bezier Curve: P1, P2, Pfinal
var path = d3.path();
path.moveTo(300,120);
path.bezierCurveTo(315, 110, 300, 50, 350, 50) //the head (left and a little of the top)
path.bezierCurveTo(365, 50, 380, 120, 395, 120) //the head (right)
path.bezierCurveTo(440, 170, 485, 170, 490, 200) //the right arm, top
path.bezierCurveTo(475, 220, 400, 150, 395, 190) //the bottom of the right arm
path.bezierCurveTo(380, 250, 450, 395, 425, 400) //the right leg, right side
path.bezierCurveTo(390, 390, 400, 305, 350, 260) //the right leg, left side
path.bezierCurveTo(300, 240, 300, 390, 275, 400) //the left leg, right side
path.bezierCurveTo(265, 390, 250, 300, 300, 190) //the left leg, left side
//path.quadraticCurveTo(500, 220, 490, 240);

path.closePath();


//var line = d3.line()
//    .x((d) => xScale(d.x))
//    .y((d) => yScale(d.y))
    // curveBasis is used
//    .curve(d3.curveBasisClosed);

svgContainer.append("path")
    .attr("d", path)
    .attr("fill", "steelblue")
    .attr("stroke", "green");
