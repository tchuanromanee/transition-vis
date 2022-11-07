console.log(entriesArray); // EntrisArray is an OBJECT

function serverget()
{
   xmlhttp = new XMLHttpRequest();
   xmlhttp.open("GET","http://localhost:8080/getstring", true);
   xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           string=xmlhttp.responseText;
         }
   }
   xmlhttp.send();
}

function parseEntries() {
  for (let i = 0; i < entriesArray.length; i++) {
    console.log(entriesArray[i].Title);
  }
}

//parseEntries();

function drawDots() {
  // For each entry, draw the dot on the timeline
  for (let i = 0; i < entriesArray.length; i++) {
    console.log(entriesArray[i].TimelinePositionX);
    var xPos = entriesArray[i].TimelinePositionX;
    var yPos = entriesArray[i].TimelinePositionY;

    svgContainer.append('circle')
      .attr('cx', xPos)
      .attr('cy', yPos)
      .attr('r', 8)
      .style('fill', 'green');
  }
}

// Draw the timeline

var timeline = d3.line();
// Eventually, we will populate the timelinepoints with data taken from the entries
var timelinePoints = [
    [100, 20],
    [150, 30],
    [600, 20]
];
var timelinePath = timeline(timelinePoints);

svgContainer.append("path")
    .attr("d", timelinePath)
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("Stroke-width", "2");


drawDots();
