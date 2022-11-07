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
//serverget();

//misc left off: https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module
