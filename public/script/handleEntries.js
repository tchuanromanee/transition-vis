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
//serverget();

//misc left off: https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module
