var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express');
var url = require('url');
var http = require("http");
const fs = require('fs');
var app = express();
const formidable = require('formidable');
const fileUpload = require('express-fileupload');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Use the express-fileupload middleware and limit size
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000, // Around 10MB
        },
        abortOnLimit: true,
    })
);


//Bypass CORS and network errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
  "TimelinePositionY": 75,
  "Links": [1],
  "Title": "Top Surgery Consult",
  "Caption": "Got a consult with Dr. Y. He seemed nice and was able to answer my questions.",
  "ImgID": ""
};

function readEntries() {
  console.log("read entries called");
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
        //console.log("calling write entries");
        //_callback(); //https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
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

// index page
app.get('/', function(req, res) {
  res.render('pages/index', {
    entriesArray: entriesArray
  });
});

// Access the parse results as request.body
app.post('/', function(request, response){
    console.log(request.body.entriesArray);
    //Update the server variable entriesarray with the new info sent from app
    entriesArray = JSON.parse(request.body.entriesArray);
    // Write the changes to the JSON file
    writeEntries();
});

app.post('/upload', (req, res) => {
    //console.log(req.body);
    //console.log(req.files); // Get the image file uploaded
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //var startup_image = req.files.foo;
    //var fileName = req.body.fileName;
   // Use the mv() method to place the file somewhere on your server
   //startup_image.mv(__dirname + '/images/' + fileName + '.jpg' , function(err) {
    // if(err){
    //   console.log(err);
     //}else{
    //console.log("uploaded");
//}
   //});
/*
   const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        console.log('fields: ', fields);
        console.log('files: ', files);
        res.send({ success: true });
    });
    console.log("FOrm read");
    console.log(form);*/

    //console.log(req.files);
    const {image} = req.files;

    if (!image) {
      console.log("Img blank");
      return res.sendStatus(400);
    }

    // If does not have image mime type prevent from uploading
  /*  if (/^image/.test(image.mimetype)) {
      console.log("Not image MIME type");
      return res.sendStatus(400);
    }*/

    image.mv(__dirname + '/uploads/' + image.name);

    res.sendStatus(200);

});



// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

readEntries();

app.listen(8080);
console.log('Server is listening on port 8080');
