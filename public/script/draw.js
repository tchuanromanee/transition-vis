

var svgContainer = d3.select("#main").append("svg")
  	.attr("width", 560)
  	.attr("height", 460)
  	.attr("id", "bodySVG");


//Bezier Curve: P1, P2, Pfinal
var path = d3.path();
path.moveTo(200,120);
path.bezierCurveTo(225, 110, 200, 50, 250, 50) //the head (left and a little of the top)
path.bezierCurveTo(275, 50, 260, 120, 290, 119) //the head (right)
path.bezierCurveTo(300, 119, 359, 180, 390, 200) //the right arm, top
path.bezierCurveTo(395, 240, 300, 150, 295, 190) //the bottom of the right arm
path.bezierCurveTo(280, 250, 350, 395, 325, 400) //the right leg, right side
path.bezierCurveTo(290, 390, 300, 305, 250, 260) //the right leg, left side
path.bezierCurveTo(200, 240, 200, 390, 175, 400) //the left leg, right side
path.bezierCurveTo(135, 390, 220, 220, 200, 180) //the left leg, left sideside
path.bezierCurveTo(200, 150, 85, 245, 110, 190) //the left arm, bottom
path.bezierCurveTo(150, 170, 185, 120, 199, 120) //the left arm, top
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
