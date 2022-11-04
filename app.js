var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express');
var http = require("http");
const fs = require('fs');


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
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    //console.log("The written has the following contents:");
    //console.log(fs.readFileSync("books.txt", "utf8"));
  }
});
}



//Start up the server
const host = 'localhost';
const port = 8080;
var path = "";
let handleRequest = connect().use(express.static(__dirname + path));/*(request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
};*/


const server = http.createServer(handleRequest).listen(8080);


//const server = http.createServer(requestListener);
//server.listen(port, host, () => {
//    console.log(`Server is running on http://${host}:${port}`);
      //readEntries();
//      readEntries(writeEntries);
      //writeEntries();

//});

// connect()
//     .use(serveStatic(__dirname))
//     .listen(8080, () => console.log('Server running on 8080...'));
