var svgContainer = d3.select("#main").append("svg")
  	.attr("width", 560)
  	.attr("height", 1000)
  	.attr("id", "#mainSVG");


//Bezier Curve: P1, P2, Pfinal
var path = d3.path();
path.moveTo(300,120);
path.bezierCurveTo(325, 110, 300, 50, 350, 50) //the head (left and a little of the top)
path.bezierCurveTo(375, 50, 360, 120, 390, 119) //the head (right)
path.bezierCurveTo(400, 119, 459, 180, 490, 200) //the right arm, top
path.bezierCurveTo(495, 240, 400, 150, 395, 190) //the bottom of the right arm
path.bezierCurveTo(380, 250, 450, 395, 425, 400) //the right leg, right side
path.bezierCurveTo(390, 390, 400, 305, 350, 260) //the right leg, left side
path.bezierCurveTo(300, 240, 300, 390, 275, 400) //the left leg, right side
path.bezierCurveTo(235, 390, 320, 220, 300, 180) //the left leg, left sideside
path.bezierCurveTo(300, 150, 185, 245, 210, 190) //the left arm, bottom
path.bezierCurveTo(250, 170, 285, 120, 299, 120) //the left arm, top
//path.quadraticCurveTo(250, 170, 300, 120);

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
