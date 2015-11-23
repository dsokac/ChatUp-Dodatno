// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

function getMessages(req, res)
{
	var email1 = req.body.email1;
	var email2 = req.body.email2;
	var response = new Object();
	
	if (email1 && email2) {
		database.view("view", "getAllMessages", function(error, body) {
			if (!error) {
				var chat = getChatByParticipants(email1, email2, body.rows);
				if (chat) {
					response.status = 0;
					response.message = "Messages read successfully.";
					response.data = chat;
					res.send(JSON.stringify(response));	
				}
				else {
					response.status = 1;
					response.message = "Data fetch null. Non-existing chat.";
					res.send(JSON.stringify(response));
				}				
			}
			else {
				response.status = 1;
				response.message = "Getting messages failure. Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	} else {
		response.status = 1;
		response.message = "Data fetch failure. Missing data in req.";
		res.send(JSON.stringify(response));
	}
}

function getChatByParticipants(email1, email2, data)
{
	var chat = null;
	for (var i = 0; i < data.length; i++) 
	{
		if (data[i].value.participants.indexOf(email1) > -1 && data[i].value.participants.indexOf(email2) > -1) {
			chat = data[i].value.chat;
			break;
		}
	}
	return chat;
}

// Add getMessages() to export module.
module.exports = getMessages;