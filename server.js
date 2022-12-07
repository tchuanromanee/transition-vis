var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express');
var url = require('url');
var http = require("http");
const fs = require('fs');
var app = express();
var path = require('path');
const formidable = require('formidable');
const fileUpload = require('express-fileupload');

// set the view engine to ejs
app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
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

function readEntries(fileName) {
  console.log("read entries called");
  //Read the JSON file to get the entries
  var fullFileName = "./data/" + fileName;
  fs.readFile(fullFileName, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }try {
      entriesArray = JSON.parse(jsonString);
      for (var i=0;i<entriesArray.length;i++) {
           console.log(entriesArray[i].entryID);
        }
        //entriesArray.push(newEntry);
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

function writeEntries(fileName) {
  console.log("write entries called to..");
  var newString = JSON.stringify(entriesArray) //undefined
  console.log(typeof(newString)) //undefined
  var fullFileName = "./data/" + fileName;
  console.log(fullFileName);
  fs.writeFile(fullFileName, newString, (err) => {
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
  readEntries("test.json");
  res.render('pages/index', {
    entriesArray: entriesArray
  });
});

// test page
app.get('/test', function(req, res) {
  readEntries("sampleData.json");
  res.render('pages/test', {
    entriesArray: entriesArray
  });
});

// test page
app.get('/ma', function(req, res) {
  readEntries("ma.json");
  res.render('pages/ma', {
    entriesArray: entriesArray
  });
});

// test page
app.get('/bw', function(req, res) {
  readEntries("bw.json");
  res.render('pages/bw', {
    entriesArray: entriesArray
  });
});

// Access the parse results as request.body
app.post('/', function(request, response){
    console.log(request.body.entriesArray);
    //Update the server variable entriesarray with the new info sent from app
    entriesArray = JSON.parse(request.body.entriesArray);
    // Write the changes to the JSON file
    writeEntries("test.json");
});

// Access the parse results as request.body
app.post('/test', function(request, response){
    console.log(request.body.entriesArray);
    //Update the server variable entriesarray with the new info sent from app
    entriesArray = JSON.parse(request.body.entriesArray);
    // Write the changes to the JSON file
    writeEntries("test1.json");
});

// Access the parse results as request.body
app.post('/ma', function(request, response){
    console.log(request.body.entriesArray);
    //Update the server variable entriesarray with the new info sent from app
    entriesArray = JSON.parse(request.body.entriesArray);
    // Write the changes to the JSON file
    writeEntries("ma.json");
});

// Access the parse results as request.body
app.post('/bw', function(request, response){
    console.log(request.body.entriesArray);
    //Update the server variable entriesarray with the new info sent from app
    entriesArray = JSON.parse(request.body.entriesArray);
    // Write the changes to the JSON file
    writeEntries("bw.json");
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

    image.mv(__dirname + '/public/uploads/' + image.name);

    res.sendStatus(200);

});



// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});



app.listen(process.env.PORT || 8080);
console.log('Server is listening...');
