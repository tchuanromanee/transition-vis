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

function getEntryByID(entryIDtoFind) {
  for (let i = 0; i < entriesArray.length; i++) {
    if (entriesArray[i].entryID == entryIDtoFind) {
      return entriesArray[i];
    }
  }
}

function getEntryIndexByID(entryIDtoFind) {
  for (let i = 0; i < entriesArray.length; i++) {
    if (entriesArray[i].entryID == entryIDtoFind) {
      return i;
    }
  }
}

function deleteVisibleEntry() {
  if (confirm('Are you sure you want to delete this?')) {
    console.log("Deleting entry");
  } else {
    return;
  }

  var indexToDelete = getEntryIndexByID(currentlyVisibleEntryID);
  entriesArray.splice(indexToDelete, 1);
  console.log(entriesArray);

  //Refresh to draw the circles and timeline again
  deleteAllDotsAndTimeline();
  drawDotsAndTimeline();
  resetEntryView();
  sendEntriesToServer();
}

function sendEntriesToServer() {
  console.log("Updating JSON");
  fetch('/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        entriesArray: JSON.stringify(entriesArray)
    })
});

}
//parseEntries();
var currentlyVisibleEntryID = -1;

function displayEntry() {
  var idOfCircle = d3.select(this).attr('id').slice(-1); // Circle ID and entry ID are the same when we created the circle elements
  var thisEntry = getEntryByID(idOfCircle); //-1 for offsetting (ASSUMES THE ENTRY ID AND)
  console.log(thisEntry); // returns the circle that was clicked
  currentlyVisibleEntryID = idOfCircle;
  // Show the entry attributes
  $("#dateLabel").text("Date: ");
  $("#dateSpan").text(thisEntry.Date);
  $("#titleSpan").text(thisEntry.Title);
  $("#captionSpan").text(thisEntry.Caption);

  // Show the buttons
  $("#editEntryButton").show();
  $("#deleteEntryButton").show();

  if (entriesArray[0].Type == "Body") {
    // Show the first dot
    document.getElementById("test1").style.display = "block";
  }
}

function resetEntryView() {
  $("#dateLabel").text("");
  $("#dateSpan").text("");
  $("#titleSpan").text("");
  $("#captionSpan").text("");

  // Show the buttons
  $("#editEntryButton").hide();
  $("#deleteEntryButton").hide();

  // hide the body dots
  $(".bodyCircle").hide();

}

function addNewEntry(){
  console.log("Add new entry");
  $('#addNewEntryMenuModal').modal();
  //Once option selected, close modal to open add screen $.modal.close();
}

function deleteAllDotsAndTimeline() {

  d3.selectAll(".timelineCircle").remove();
  d3.selectAll(".timeline").remove();


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
    var circleID = "circle" + entriesArray[i].entryID;
    svgTimelineContainer.append('circle')
      .attr('cx', xPos)
      .attr('cy', yPos)
      .attr('id', circleID)
      .attr('r', 8)
      .attr('class', "timelineCircle")
      .style('fill', emotionColor)
      .on("mouseover", function(d) {
          d3.select(this).style("fill", "#fff8ee");
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", emotionColor);
      })
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
      .attr('class', "timeline")
      .attr('id', "timeline")
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
      .attr('class', "bodyCircle")
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
