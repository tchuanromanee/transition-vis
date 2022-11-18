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

var placeNewTextEntry = false;
var placeNewBodyEntry = false;
var placeNewImgEntry = false;
var bodyDotPlaced = false;
var editingBodyEntry = false;
var editingEntry = false;
var links = []; // for new links to be added
var allLinks = []; // for all links in the timeline graph
var bodyPosX = -1;
var bodyPosY = -1;


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
  // Re-connect links so that deleting does not sever the nodes timeline

  // Search for links with currentlyVisibleEntryID
  var linkedNodes = [];
  var newAllLinksWithoutOverwrite = []; // ALL links without any reference to node to be deleted
  for (var i = 0; i < allLinks.length; i++) {
    if (allLinks[i][0] == currentlyVisibleEntryID) {
      // Once found, push all links to a separate array
      if (!linkedNodes.includes(allLinks[i][1])) { // these if statements prevent duplicates
        linkedNodes.push(allLinks[i][1]);
      }

    }
    else if (allLinks[i][1] == currentlyVisibleEntryID) {
      if (!linkedNodes.includes(allLinks[i][0])) {
        linkedNodes.push(allLinks[i][0]);
      }
    }
    else {
      newAllLinksWithoutOverwrite.push(allLinks[i]);
    }
  }

  /*console.log("Found matches for node:");
  console.log(currentlyVisibleEntryID);
  console.log(linkedNodes);*/
  // generate new links
  var newLinksGenerated = [];
  for (var i = 0; i < linkedNodes.length-1; i++) {
    var newLink = [linkedNodes[i], linkedNodes[i+1]];
    newLinksGenerated.push(newLink);
  }

  //console.log("New Links Generated!:");
  //console.log(newLinksGenerated);

  // Link array in order: rewrite allLinks and commit to entriesArray
  // APPEND newAllLinksWithoutOverwrite with new links to write
  allLinks = newAllLinksWithoutOverwrite.concat(newLinksGenerated);

  //console.log("Brand New AllLinks:");
  //console.log(allLinks);



  entriesArray.splice(indexToDelete, 1);

  updateEntryLinks();

  //console.log("Updated entriesArray:");
  //console.log(entriesArray);

  //Refresh to draw the circles and timeline again
  deleteAllDotsAndTimeline();
  drawDotsAndTimeline();
  drawBodyDots();
  resetEntryView();
  sendEntriesToServer();
}

function updateEntryLinks() {
  // grab from AllLinks
  for (var i = 0; i < allLinks.length; i++) {
    var thisEntryID = allLinks[i][0];
    var entryToLinkID = allLinks[i][1];
    var thisEntryIndex = getEntryIndexByID(thisEntryID);
    entriesArray[thisEntryIndex].Links = []; // Clear links first
    if (!entriesArray[thisEntryIndex].Links.includes(entryToLinkID)) {
      entriesArray[thisEntryIndex].Links.push(entryToLinkID);
    }
  }
}

function sendEntriesToServer() {

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



var currentlyVisibleEntryID = -1;

function circleClick(event) {
  if (editingEntry || editingBodyEntry) {
    return;
  }
  if (event.defaultPrevented) return; // dragged
  // Clear previously selected circle
  $('.timelineCircle').attr("stroke", "none");

  var fullCircleID = d3.select(this).attr('id');
  var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
  currentlyVisibleEntryID = idOfCircle;
  if (!placeNewTextEntry && !placeNewBodyEntry && !placeNewImgEntry) {
    // Click on circle and draw stroke to indicate it has been selected
    d3.select(this).attr("stroke", "#000000");
    //console.log(links);
    displayEntry(idOfCircle);
  }
  else if (placeNewTextEntry || (placeNewBodyEntry && bodyDotPlaced) || placeNewImgEntry) {
    // If circle has already been clicked, undo it and remove from links
    indexOfCircleinLinks = links.indexOf(idOfCircle);
    if (indexOfCircleinLinks > -1) {
      links.splice(indexOfCircleinLinks, 1); // 2nd parameter means remove one item only
      //console.log("Circle removed from links!");
      d3.select(this).attr("stroke", "#ffffff");
    }
    else {

      // Click on circle and draw stroke to indicate it has been selected
      d3.select(this).attr("stroke", "#000000");
      links.push(idOfCircle);
      console.log("Circle clicked in add mode!");
      //console.log(links);
    }
  }

}

function editEntry() {
  // Hide and show irrelevant info
  resetEntryView();
  $("#saveEntryButton").show();
  $("#cancelEntryEditButton").show();

  document.body.style.cursor = 'crosshair';

  //get entry info from currentlyVisibleEntryID
  var thisEntry = getEntryByID(currentlyVisibleEntryID);
  editingEntry = true;
  if (thisEntry.Type == "Body") {
    var bodyDotID = "#bodyDot" + thisEntry.entryID;
    $(bodyDotID).show();// = "block";
    displayEditBodyGuidance();
    editingBodyEntry = true;
  }
  else {
    displayEditGuidance();
  }


  //prepend form fields
  $('#infoDiv').prepend('<form id ="editTextBodyEntryForm"><div class="form-group"><label for="formEditInputDate">Date of Entry</label><input type="date" id="formEditInputDate" name="form-date" value="' + thisEntry.Date + '" min="1920-01-01" max="2040-12-31"></div><div class="form-group"><label for="formEditInputTitle">Title for Entry</label><input type="text"  name="form-title" class="form-control" id="formEditInputTitle" value="' + thisEntry.Title + '"</div><div class="form-group"><label for="formInputCaption" id="editCaptionLabel">Edit text</label><textarea class="form-control"  name="form-caption" id="editCaptionInput" rows="3">' + thisEntry.Caption + '</textarea></div></form>')
}

function commitEdits() {
  // Main function to write new changes of the edited entry to JSON

  //ask user to confirm
  if (confirm('Are you sure you want to save these changes?')) {
    console.log("Committing edits");
  } else {
    return;
  }

  document.body.style.cursor = 'default';
  // Pull from form and write to JSON, then reset view
  //var thisEntry = getEntryByID(currentlyVisibleEntryID);
  var arrayIndex = getEntryIndexByID(currentlyVisibleEntryID);

  var formData = $('#editTextBodyEntryForm').serializeArray();

  var newDate = formData[0].value;
  var newTitle = formData[1].value;
  var newCaption = formData[2].value;
  /*
  var newColor = formData[3].value;
  */
  // Overwrite variables
  entriesArray[arrayIndex].Date = newDate;
  entriesArray[arrayIndex].Title = newTitle;
  entriesArray[arrayIndex].Caption = newCaption;
  sendEntriesToServer();
  hideGuidance();
  // Redraw links and timeline
  deleteAllDotsAndTimeline();
  drawDotsAndTimeline();
  if (editingBodyEntry) {

    drawBodyDots();
  }
  displayEntry(currentlyVisibleEntryID);
  // Reset variables
  editingBodyEntry = false;
  editingEntry = false;
}

function cancelEdits() {

  if (confirm('Are you sure you want to go back?')) {
    // Reset to entry view
    displayEntry(currentlyVisibleEntryID);
    document.body.style.cursor = 'default';
    editingBodyEntry = false;
    editingEntry = false;
    return;
  } else {
    console.log("Continuing to edit");
  }

}

function displayEntry(idOfCircle) {
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

  //Hide any edit fields if exist or shown
  $("#saveEntryButton").hide();
  $("#cancelEntryEditButton").hide();
  $("#editTextBodyEntryForm").remove();
  //$("#editCaptionInput").remove();
//  $("#e").remove();
  $("#editCaptionInput").remove();
  // Hide all dots on body by default
  $('.bodyCircle').hide();

  if ($('#entryImg').length) {
    $('#entryImg').remove();
  }
  if (thisEntry.Type == "Body") {
    // Show the dot if a body entry is selected
    var bodyDotID = "#bodyDot" + thisEntry.entryID;
    $(bodyDotID).show();// = "block";
  }
  else if (thisEntry.Type == "Img") {
    //$("#captionSpan").text(thisEntry.Caption);
    var imgName = thisEntry.ImgID;
    $('#infoDiv').prepend('<img id="entryImg" src="uploads/' + imgName + '" /> <br />')

  }

}

function displayGuidance() {
  // Show the entry attributes
  $("#guidanceText").text("Click on any dot(s) to create a link to your new entry. Once you're done clicking on all the dots you want, click anywhere on the canvas to place the new dot. Right click to cancel.");
}

function displayBodyGuidance() {
  // Show the entry attributes
  $("#guidanceText").text("Click on the point on the body where you want to add the new dot. Then, click on any dot(s) to create a link to your new entry. Once you're done clicking on all the dots you want, click anywhere on the canvas to place the new dot. Right click to cancel.");
}

function displayEditGuidance() {
  // Show the entry attributes
  $("#guidanceText").text("You can click and drag the dots to reposition them. The line(s) will be redrawn when you save your changes. Unfortunately, you can't edit or remove images.");
}

function displayEditBodyGuidance() {
  // Show the entry attributes
  $("#guidanceText").text("You can click and drag the dots on the timeline and/or body to reposition them. The line(s) will be redrawn when you save your changes.");
}


function hideGuidance() {
  // Show the entry attributes
  $("#guidanceText").text("");
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

function showNewEntryMenu(){

  $('#addNewEntryMenuModal').modal();

}

function addBodyEntry() {
  //Once option selected, close modal to open add screen
  $.modal.close();
  resetEntryView();
  // Show modal form
  $('#addNewBodyEntryModal').modal();

  // Edit the date input so that it's today's dateSpan
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  const dateControl = document.querySelector('input[type="date"]');
  dateControl.value = today;
}

function addTextOnlyEntry() {
  //Once option selected, close modal to open add screen
  $.modal.close();
  resetEntryView();
  // Show modal form
  $('#addNewTextEntryModal').modal();


  // Edit the date input so that it's today's dateSpan
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  const dateControl = document.querySelector('input[type="date"]');
  dateControl.value = today;
}

function addImageEntry() {
  //Once option selected, close modal to open add screen
  $.modal.close();
  resetEntryView();

  // Show modal form
  $('#addNewImageEntryModal').modal();
  // Edit the date input so that it's today's dateSpan
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  const dateControl = document.querySelector('input[type="date"]');
  dateControl.value = today;

}

$(document).ready(function(event) {
  document.oncontextmenu = function() {return false;};

  $('#timelineSVG').mousedown(function(event) { // right click to cancel add mode
    if( event.button == 2 ) {  // Right mouse button clicked!
      if (placeNewImgEntry || placeNewTextEntry || placeNewBodyEntry) { // Right clicked in PLACE mode
        if (confirm('Cancel adding a new entry?')) {
          // Reset variables
          links = [];
          placeNewImgEntry = false;
          placeNewTextEntry = false;
          placeNewBodyEntry = false;
          document.body.style.cursor = 'default';
          hideGuidance();

        } else {
          return false;
        }
      }
      return false;
    }
    var pageX = event.pageX;
    var pageY = event.pageY;
    timelineSvgClick(pageX,pageY)
    return true;


  });

  $('#bodySVG').mousedown(function(event) { // right click to cancel add mode
    if( event.button == 2 ) {  // Right mouse button clicked!
      if (placeNewBodyEntry) { // Right clicked in PLACE mode
        if (confirm('Cancel adding a new entry?')) {
          // Reset variables
          links = [];
          placeNewImgEntry = false;
          placeNewTextEntry = false;
          placeNewBodyEntry = false;
          document.body.style.cursor = 'default';
          hideGuidance();

        } else {
          return false;
        }
      }
      return false;
    }
    console.log("Event handler for SVG Body clicked");
    var pageX = event.pageX;
    var pageY = event.pageY;
    bodySvgClick(pageX,pageY);
    return true;


  });

  // Prevent people from pressing enter to submit form, which results in a networkerror
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

});

function dragstarted(d) {
    if (editingEntry || editingBodyEntry) {
      var fullCircleID = d3.select(this).attr("id");
      var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
      //currentlyVisibleEntryID = idOfCircle;

      if (currentlyVisibleEntryID == idOfCircle) {
        d3.select(this).raise().classed("active", true);
        d3.select(this).attr("stroke", "#000000");
      }
    }

        }

        function dragged(d) {
          if (editingEntry || editingBodyEntry) {
            // Only allow the currently edited circle to be dragged
            var fullCircleID = d3.select(this).attr("id");
            var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
            //currentlyVisibleEntryID = idOfCircle;

            if (currentlyVisibleEntryID == idOfCircle) {
              //calculate the timeline coordinates
              var offsetX = $('#timelineSVG').offset().left;
              var offsetY = $('#timelineSVG').offset().top;
              var x = event.x - offsetX;
              var y = event.y - offsetY;
              // TODO: Prevent dot from being dragged out of bounds of the svg
              //https://stackoverflow.com/questions/60163388/javascript-prevent-draggable-div-outside-parent-div
              var boun = document.getElementById("timelineSVG").offsetWidth-document.getElementById(fullCircleID).offsetWidth;
              //  if((x>0)&&(x<boun)&&(y>0)&&(y<boun)) {
                            d3.select(this).attr("cx", d.x = x).attr("cy", d.y = y);
                //        }


          }

          }
        }

        function dragended(d) {
          if (editingEntry || editingBodyEntry) {
            var fullCircleID = d3.select(this).attr("id");
            var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
            //currentlyVisibleEntryID = idOfCircle;

            if (currentlyVisibleEntryID == idOfCircle) {
            d3.select(this).classed("active", false);
          //  d3.select(this).attr("stroke", "none");
            // Update entry attribute with position x and y
            // write to entry
            var arrayIndex = getEntryIndexByID(currentlyVisibleEntryID);
            entriesArray[arrayIndex].TimelinePositionX = d3.select(this).attr('cx');
            entriesArray[arrayIndex].TimelinePositionY = d3.select(this).attr('cy');
            //sendEntriesToServer();
          }
          }
        }

        function bodyCircleDragStarted(d) {
            if (editingBodyEntry) {
              //var fullCircleID = d3.select(this).attr("id");
              //var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
              //currentlyVisibleEntryID = idOfCircle;

              //if (currentlyVisibleEntryID == idOfCircle) {
                d3.select(this).raise().classed("active", true);
              //  d3.select(this).attr("stroke", "#000000");
              //}
            }

                }

                function bodyCircleDragged(d) {
                  if (editingBodyEntry) {
                    // Only allow the currently edited circle to be dragged
                    var fullCircleID = d3.select(this).attr("id");
                    var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
                    //currentlyVisibleEntryID = idOfCircle;

                    if (currentlyVisibleEntryID == idOfCircle) {
                      //calculate the timeline coordinates
                      var offsetX = $('#bodySVG').offset().left;
                      var offsetY = $('#bodySVG').offset().top;
                      bodyPosX = event.x - offsetX;
                      bodyPosY = event.y - offsetY;
                      // TODO: Prevent dot from being dragged out of bounds of the svg
                      d3.select(this).attr("cx", bodyPosX).attr("cy", bodyPosY);
                  }

                  }
                }

                function bodyCircleDragEnded(d) {
                  if (editingBodyEntry) {
                    var fullCircleID = d3.select(this).attr("id");
                    var idOfCircle = fullCircleID.slice(-1); // Circle ID and entry ID are the same when we created the circle elements
                    //currentlyVisibleEntryID = idOfCircle;

                    if (currentlyVisibleEntryID == idOfCircle) {
                    d3.select(this).classed("active", false);
                  //  d3.select(this).attr("stroke", "none");
                    // Update entry attribute with position x and y
                    // write to entry
                    var arrayIndex = getEntryIndexByID(currentlyVisibleEntryID);
                    entriesArray[arrayIndex].BodyPositionX = bodyPosX;
                    entriesArray[arrayIndex].BodyPositionY = bodyPosY;
                    bodyPosX = -1;
                    bodyPosY = -1;
                    //sendEntriesToServer();
                  }
                  }
                }



function timelineSvgClick(pageX, pageY) { //this function will be the master for handling all svg clicks on the timeline


  // check for the mode to see if we're ready to place
  if ($('.timelineCircle:hover').length != 0) {
    // Not done placing it yet, so let's try again later when we click on SVG only
    console.log("Circle AND SVG");
    return;
  }
  else if (placeNewTextEntry || placeNewImgEntry || (placeNewBodyEntry && bodyDotPlaced)) { // Awesome, place it!
    // No matter if we've clicked on a circle yet, we're gonna read the Links
    console.log("SVG but not circle");
    // Ask if user wants to place
    if (confirm('Place the new dot here?')) {
      console.log("Place the new dot here and continue.");
    } else {
      return;
    }

    // Reset all the clicked circles' colors by retrieving from links
    for (let i = 0; i < links.length; i++) {
      var idOfSelectedCircle = "#circle" + links[i];
      d3.select(idOfSelectedCircle).attr("stroke", "#ffffff");

    }

    //calculate the timeline coordinates
    var offsetX = $('#timelineSVG').offset().left;
    var offsetY = $('#timelineSVG').offset().top;
    var x = pageX - offsetX;
    var y = pageY - offsetY;
    console.log(x);
    console.log(y);

    // Reset cursor
    document.body.style.cursor = 'default';

    // Hide the guidance
    hideGuidance();

   // Write the Data depending on the type of entry
    if (placeNewTextEntry) {
      writeNewTextEntry(x,y);
    }
    else if (placeNewBodyEntry && bodyDotPlaced) {
      writeNewBodyEntry(x,y);
    }
    else if (placeNewImgEntry) {
      writeNewImageEntry(x,y);
    }

  }

  else {
    console.log("SVG clicked but not doing anything bc not adding or editing");
    return;
  }


}


function bodySvgClick(pageX, pageY) { //this function will be the master for handling all svg clicks on the body

  // check for the mode to see if we're ready to place
  if (placeNewBodyEntry && !bodyDotPlaced) { // Awesome, place it!
    // Ask if user wants to place
    if (confirm('Place the new dot here?')) {
      console.log("Place the new dot here and continue.");
    } else {
      return;
    }
    bodyDotPlaced = true;

    //calculate the timeline coordinates
    var offsetX = $('#bodySVG').offset().left;
    var offsetY = $('#bodySVG').offset().top;
    bodyPosX = pageX - offsetX;
    bodyPosY = pageY - offsetY;

    svgContainer.append('circle')
      .attr('cx', bodyPosX)
      .attr('cy', bodyPosY)
      .attr('r', 8)
      .attr('class', "bodyCircle")
      .style('fill', '#EEEEEE');


  }

  else {
    console.log("SVG clicked but not doing anything bc not adding or editing");
    return;
  }


}

function processNewBodyEntry() {
  console.log("Processing new body entry...")
  placeNewBodyEntry = true;

  // Add guidance for placement
  displayBodyGuidance();

  document.body.style.cursor = 'crosshair';
  $.modal.close();

}

function processNewTextEntry() {
  // Place the new dot
  placeNewTextEntry = true;

  // Add guidance for placement
  displayGuidance();


  // Make the cursor a crosshair for add mode
  document.body.style.cursor = 'crosshair';
  $.modal.close();
}

function processNewImageEntry() {
  // Place the new dot
  placeNewImgEntry = true;

  // Add guidance for placement
  displayGuidance();


  // Make the cursor a crosshair for add mode
  document.body.style.cursor = 'crosshair';
  $.modal.close();
}

function writeNewTextEntry(timelinePosX, timelinePosY) {
  //console.log($('#addTextEntryForm').serializeArray());
  //Data: form-date=2022-07-22&form-title=asd&form-caption=&color=%23e66465
  var formData = $('#addTextEntryForm').serializeArray();

  var newDate = formData[0].value;
  var newTitle = formData[1].value;
  var newCaption = formData[2].value;
  var newColor = formData[3].value;

  // Generate an Entry ID (highest + 1)
  var newEntryID = findHighestEntryID() + 1;
  console.log(newEntryID);

  // Need to convert links to int in order to write in correct format to JSON
  var linksAsInt = []

  for (var i = 0; i < links.length; i++) {
    linksAsInt.push(parseInt(links[i]));
  }


  // Add new entry to entriesarray
  var newEntryToAdd = {
    "entryID": newEntryID,
    "Type": "TextOnly",
    "Date": newDate,
    "EmotionScale": 5,
    "EmotionColor": newColor,
    "BodyPositionX": -1,
    "BodyPositionY": -1,
    "TimelineID": 1,
    "TimelinePositionX": timelinePosX,
    "TimelinePositionY": timelinePosY,
    "Links": linksAsInt,
    "Title": newTitle,
    "Caption": newCaption,
    "ImgID": ""
  };


  entriesArray.push(newEntryToAdd);

  // Send the data to the server

  sendEntriesToServer();


  // Add the new dot in
  drawDotsAndTimeline();

  // Reset variables
  placeNewTextEntry = false;
  placeNewBodyEntry = false;
  bodyDotPlaced = false;
  placeNewImgEntry = false;


  // Clear the links
  links = [];


}

function writeNewImageEntry(timelinePosX, timelinePosY) {
  //console.log($('#addTextEntryForm').serializeArray());
  //Data: form-date=2022-07-22&form-title=asd&form-caption=&color=%23e66465
  var formData = $('#addImageEntryForm').serializeArray();

  var newDate = formData[0].value;
  var newTitle = formData[1].value;
  var newCaption = formData[2].value;
  var newColor = formData[3].value;

    //File data: Extrct image upload from form data
    var imgData = new FormData();
    var file_data = $('input[name="image"]')[0].files;
    var imgName = "";
    if (file_data.length == 1) {
      imgName = file_data[0].name;
      imgData.append("image", file_data[0]);
    }
    // Send the uploaded image to the server
  $.ajax({
    url: '/upload',
    data: imgData,
    type: 'POST',
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false, // NEEDED, DON'T OMIT THIS
    // ... Other options like success and etc
});


  // Generate an Entry ID (highest + 1)
  var newEntryID = findHighestEntryID() + 1;

  // Need to convert links to int in order to write in correct format to JSON
  var linksAsInt = []

  for (var i = 0; i < links.length; i++) {
    linksAsInt.push(parseInt(links[i]));
  }


  // Add new entry to entriesarray
  var newEntryToAdd = {
    "entryID": newEntryID,
    "Type": "Img",
    "Date": newDate,
    "EmotionScale": 5,
    "EmotionColor": newColor,
    "BodyPositionX": -1,
    "BodyPositionY": -1,
    "TimelineID": 1,
    "TimelinePositionX": timelinePosX,
    "TimelinePositionY": timelinePosY,
    "Links": linksAsInt,
    "Title": newTitle,
    "Caption": newCaption,
    "ImgID": imgName
  };


  entriesArray.push(newEntryToAdd);

  // Send the data to the server

  sendEntriesToServer(); // Send the rest of the entries to the server


  // Add the new dot in
  drawDotsAndTimeline();

  // Reset variables
  placeNewTextEntry = false;
  placeNewBodyEntry = false;
  bodyDotPlaced = false;
  placeNewImgEntry = false;


  // Clear the links
  links = [];


}


function writeNewBodyEntry(timelinePosX, timelinePosY) {
  //Data: form-date=2022-07-22&form-title=asd&form-caption=&color=%23e66465
  var formData = $('#addBodyEntryForm').serializeArray();

  var newDate = formData[0].value;
  var newTitle = formData[1].value;
  var newCaption = formData[2].value;
  var newColor = formData[3].value;

  // Generate an Entry ID (highest + 1)
  var newEntryID = findHighestEntryID() + 1;
  console.log(newEntryID);

  // Need to convert links to int in order to write in correct format to JSON
  var linksAsInt = []

  for (var i = 0; i < links.length; i++) {
    linksAsInt.push(parseInt(links[i]));
  }


  // Add new entry to entriesarray
  var newEntryToAdd = {
    "entryID": newEntryID,
    "Type": "Body",
    "Date": newDate,
    "EmotionScale": 5,
    "EmotionColor": newColor,
    "BodyPositionX": bodyPosX,
    "BodyPositionY": bodyPosY,
    "TimelineID": 1,
    "TimelinePositionX": timelinePosX,
    "TimelinePositionY": timelinePosY,
    "Links": linksAsInt,
    "Title": newTitle,
    "Caption": newCaption,
    "ImgID": ""
  };


  entriesArray.push(newEntryToAdd);

  // Send the data to the server

  sendEntriesToServer();


  // Add the new dot in
  drawDotsAndTimeline();

  // Also add new body dot in
  drawBodyDots();

  resetEntryView();

  // Reset variables
  placeNewTextEntry = false;
  placeNewBodyEntry = false;
  bodyDotPlaced = false;
  placeNewImgEntry = false;
  bodyPosX = -1;
  bodyPosY = -1;


  // Clear the links
  links = [];
}

function findHighestEntryID() {
  var highestID = -1;
  for (let i = 0; i < entriesArray.length; i++) {
    var currID = entriesArray[i].entryID;
    if (currID > highestID) {
      highestID = currID;
    }
  }
  return highestID;
}



function deleteAllDotsAndTimeline() {

  d3.selectAll(".timelineCircle").remove();
  d3.selectAll(".timeline").remove();


}

function getCoords(entryIDtoFind) {

  var coordsToReturn = []; //(x, y)
  for (let i = 0; i < entriesArray.length; i++) {
    if (entriesArray[i].entryID == entryIDtoFind) {
      var xCoord = entriesArray[i].TimelinePositionX;
      var yCoord = entriesArray[i].TimelinePositionY;
      coordsToReturn = [xCoord, yCoord];
      return coordsToReturn;
    }
  }
  return coordsToReturn;

}

function drawDotsAndTimeline() {
  var timelinePoints = [];
  // For each entry, draw the dot on the timeline and populate links
  var timelineCoords = [];
  for (let i = 0; i < entriesArray.length; i++) {
    // Read the x and y coordinates of the timeline
    var thisEntryID = entriesArray[i].entryID;
    var xPos = entriesArray[i].TimelinePositionX;
    var yPos = entriesArray[i].TimelinePositionY;
    var emotionColor = entriesArray[i].EmotionColor;

    // Grab the links and populate
    var theseLinks = entriesArray[i].Links;
    var otherEntryCoords = [];
    for (let j = 0; j < theseLinks.length; j++) {
      var oneLink = [thisEntryID, theseLinks[j]];
      otherEntryCoords = getCoords(theseLinks[j])
      //if (!allLinks.includes(oneLink)) {
      allLinks.push(oneLink);
      //}

      // Push x and y coords for timeline if reading for this particular ID
      var xPosOther = otherEntryCoords[0];
      var yPosOther = otherEntryCoords[1];
      let newLink = {x1: xPos, y1: yPos, x2: xPosOther, y2: yPosOther};
      timelineCoords.push(newLink);
    }


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
          // TODO: Show a tiny tooltip with basic info on the entry
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", emotionColor);
          // TODO: Remove tiny tooltip with basic info on the entry
      })
      .on("click", circleClick)
      .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  );
  }
  // Draw the timeline

  var timeline = d3.line();

  // Draw the links
  for (let i = 0; i < timelineCoords.length; i++) {
    var newLine = svgTimelineContainer.append("line")
    .attr("x1",timelineCoords[i].x1)
    .attr("y1", timelineCoords[i].y1)
    .attr('x2', timelineCoords[i].x2)
    .attr("y2", timelineCoords[i].y2)
    .attr('class', "timeline")
    .attr("stroke-width", 2)
    .attr("stroke", "black");
  }

}


function drawBodyDots() {
  var bodyPoints = [];
  // For each entry, draw the dot on the timeline
  for (let i = 0; i < entriesArray.length; i++) {
    if (entriesArray[i].Type == "Body") {
      // Read the x and y coordinates of the timeline
      var xPos = entriesArray[i].BodyPositionX;
      var yPos = entriesArray[i].BodyPositionY;
      var emotionColor = entriesArray[i].EmotionColor;
      bodyPoints.push([xPos, yPos]);
      var stringID = "bodyDot" + entriesArray[i].entryID;
      svgContainer.append('circle')
        .attr('cx', xPos)
        .attr('cy', yPos)
        .attr('r', 8)
        .attr('id', stringID)
        .attr('class', "bodyCircle")
        .style('fill', emotionColor)
        .style('display', 'none')
        .call(d3.drag()
                    .on("start", bodyCircleDragStarted)
                    .on("drag", bodyCircleDragged)
                    .on("end", bodyCircleDragEnded)
                    );
    }
  }
}

var svgTimelineContainer = d3.select("#timelinediv").append("svg")
  	.attr("width", 960)
  	.attr("id", "timelineSVG");


drawBodyDots();

drawDotsAndTimeline();
