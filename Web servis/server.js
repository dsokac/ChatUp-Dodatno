// Create an instance of Express.js application.
var express = require("express");
var app = express();


// **************************************
// Include JavaScript functions from
// other files.
//
var register = require("./register.js");

// **************************************
// Register routes for Web services here.
//
app.post("/register", register);


// Listen to port 8080.
app.listen(8080, function() {
	console.log("Server has started...");
});