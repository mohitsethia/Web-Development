const express = require("express");
const app = express();
app.get("/", function(request, response){
	response.send("<h1>Hello, World!</h1>");
});
app.get("/about", function(request, response){
	response.send("Hi, I am Mohit Sethia, pursuing BTech from BPPIMT in CSE dept. I am also joining the course Crio Winter of Doing which is starting on 9th January 2021.");
});
app.listen(2500, function(){
	console.log("Server started on port 2500.");
});