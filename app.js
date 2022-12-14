var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express');
var url = require('url');
var http = require("http");
const fs = require('fs');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// use res.render to load up an ejs view file

var entriesArray;
const newEntry = {
  "entryID": 4,
  "Type": "Body",
  "Date": "Tue, 19 Aug 1975 23:15:30 GMT",
  "EmotionScale": 5,
  "EmotionColor": "#EEEEEE",
  "BodyPositionX": 300,
  "BodyPositionY": 100,
  "TimelineID": 1,
  "TimelinePositionX": 100,
  "TimelinePositionY": 0,
  "Title": "Top Surgery Consult",
  "Caption": "Got a consult with Dr. Y. He seemed nice and was able to answer my questions.",
  "ImgID": ""
};

function readEntries(_callback) {
  console.log("read entries called");
  // Write to the JSON File
  var hasReadFile = false;
  //Read the JSON file to get the entries
  fs.readFile("./data/sampleData.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }try {
      entriesArray = JSON.parse(jsonString);
      for (var i=0;i<entriesArray.length;i++) {
           console.log(entriesArray[i].entryID);
        }
        entriesArray.push(newEntry);
        //console.log(JSON.stringify(entriesArray))
        hasReadFile = true;
        console.log("calling write entries");
        _callback(); //https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
        } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });


    /* THE FOLLOWING APPEND WORKS!!! But writing to the file doesn't :()
    fs.appendFile('./data/sampleData.json', JSON.stringify(newEntry), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });*/


}

function writeEntries() {
  console.log("write entries called");
  var newString = JSON.stringify(entriesArray) //undefined
  console.log(typeof(newString)) //undefined

  fs.writeFile("./data/test.json", newString, (err) => {
????if (err)
????????console.log(err);
????else {
????????console.log("File written successfully\n");
????????//console.log("The written has the following contents:");
????????//console.log(fs.readFileSync("books.txt", "utf8"));
????}
});
}

// index page
app.get('/', function(req, res) {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  var tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    entriesArray: entriesArray,
    tagline: tagline
  });
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

readEntries(writeEntries);

app.listen(8080);
console.log('Server is listening on port 8080');
