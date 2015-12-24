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
var getMessages = require("./get_messages_2.js");
var getUserData = require("./get_userData.js");
var getUserDataEditProfile = require("./getUserDataEditProfile.js");
//var registeredUsers = require("./registeredUsers.js");
var registeredUsers2 = require("./registeredUsers2.js");
var addFriends = require("./addFriends.js");
var forgotPassword = require("./forgot_password.js");
var getFriends = require("./getFriends.js");
var saveProfilePic = require("./save_profile_pic.js");
var sendMessage = require("./sendMessage.js");
var createConversation = require("./createConversation.js");
var getNewMessages = require("./getNewMessages.js");

// **************************************
// Register routes for Web services here.
//
app.post("/register", register);
app.post("/login",login);
app.post("/logout", logout);
app.post("/getMessages", getMessages);
app.post("/getUserData", getUserData);
app.post("/getUserDataEditProfile", getUserDataEditProfile);
//app.post("/registeredUsers",registeredUsers);
app.post("/registeredUsers2",registeredUsers2);
app.post("/addFriends",addFriends);
app.post("/forgotPassword",forgotPassword);
app.post("/getFriends",getFriends);
app.post("/saveProfilePic", saveProfilePic);
app.post("/sendMessage", sendMessage);
app.post("/createConversation", createConversation);
app.post("/getNewMessages", getNewMessages);

app.get("/", function(req, res) {
	res.send("Server is running.");
});

// Listen to port 8080.
app.listen(8080, function() {
	console.log("Server has started...");
});
