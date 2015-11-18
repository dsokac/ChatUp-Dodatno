// Create an instance of Express.js application.
var express = require("express");
var app = express();

// Include 'body-parser' library for reading POST data
// and make the application use it.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


// **************************************
// Include JavaScript functions from
// other files.
//
var register = require("./register.js");
var login = require("./log_in.js");
var logout = require("./log_out.js");
var getMessages = require("./get_messages.js");

// **************************************
// Register routes for Web services here.
//
app.post("/register", register);
app.post("/login",login);
app.post("/logout", logout);
app.post("/getMessages", getMessages);


// Listen to port 8080.
app.listen(8080, function() {
	console.log("Server has started...");
});