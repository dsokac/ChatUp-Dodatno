// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// Get messages logic
function getMessages(req, res)
{
	var query = req.body;
	var response = new Object();
	if (query && query.participants && query.type) {
		database.view("view", "getAllMessages", function(error, body) {
			if (!error) {
				response.status = "0";
				response.message = "Messages read successfully.";
				res.send(JSON.stringify(response));					
			}
			else {
				response.status = "1";
				response.message = "Getting messages failure. Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	}
	else {
		response.status = "1";
		response.message = "Getting messages failure. Missing data.";
		res.send(JSON.stringify(response));
	}
}

// Add getMessages() to export module.
module.exports = getMessages;