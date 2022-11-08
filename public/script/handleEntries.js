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

function displayEntry() {
  $("#dateLabel").text("Date: ");
  $("#dateSpan").text("Date test");
  $("#titleSpan").text("Title test");
  $("#captionSpan").text("Caption test");
}

function drawDotsAndTimeline() {
  var timelinePoints = [];
  // For each entry, draw the dot on the timeline
  for (let i = 0; i < entriesArray.length; i++) {
    // Read the x and y coordinates of the timeline
    var xPos = entriesArray[i].TimelinePositionX;
    var yPos = entriesArray[i].TimelinePositionY;
    var emotionColor = entriesArray[i].EmotionColor;
    timelinePoints.push([xPos, yPos]);
    svgTimelineContainer.append('circle')
      .attr('cx', xPos)
      .attr('cy', yPos)
      .attr('r', 8)
      .style('fill', emotionColor)
      .on("mousedown", displayEntry); // TODO: Check if click and drag will change
  }
  // Draw the timeline

  var timeline = d3.line();
  // Eventually, we will populate the timelinepoints with data taken from the entries

  var timelinePath = timeline(timelinePoints);

  svgTimelineContainer.append("path")
      .attr("d", timelinePath)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("Stroke-width", "2");
}


function drawBodyDots() {
  var bodyPoints = [];
  // For each entry, draw the dot on the timeline
  for (let i = 0; i < entriesArray.length; i++) {
    // Read the x and y coordinates of the timeline
    var xPos = entriesArray[i].BodyPositionX;
    var yPos = entriesArray[i].BodyPositionY;
    var emotionColor = entriesArray[i].EmotionColor;
    bodyPoints.push([xPos, yPos]);
    var stringID = "test" + i;
    svgContainer.append('circle')
      .attr('cx', xPos)
      .attr('cy', yPos)
      .attr('r', 8)
      .attr('id', stringID)
      .style('fill', emotionColor)
      .style('display', 'none');
  }
  if (entriesArray[0].Type == "Body") {
    // Show the first dot
    document.getElementById("test1").style.display = "block";

  }
}

var svgTimelineContainer = d3.select("#timelinediv").append("svg")
  	.attr("width", 960)
  	.attr("id", "#timelineSVG");


drawBodyDots();

drawDotsAndTimeline();
