// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// Create conversation logic
function createConversation(req, res)
{
	var query = req.body;
	var response = new Object();
	if (query && query.mail1 && query.mail2) {
		database.view("view", "getAllMessages", function(error, body) {
			if (!error) {
				if (!conversationExists(query.mail1, query.mail2, body.rows)) {
                    
                }
                else {
                    response.status = "2";
                    response.message = "Conversation creation suspended. Conversation already exists."
                    res.send(JSON.stringify(response));
                }
			}
			else {
				response.status = "1";
				response.message = "Conversation creation failure. Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	}
	else {
		response.status = "1";
		response.message = "Conversation creation failure. Missing data.";
		res.send(JSON.stringify(response));
	}
}

// Check if conversation already exists
function conversationExists(mail1, mail2, data)
{
    var exists = false;
    for (var i = 0; i < data.length; i++)
    {
        var row = data[i].value;
        if (row.participants.indexOf(mail1) > -1 && row.participants.indexOf(mail2) > -1) 
        {
			exists = true;
			break;
		}
    }
    return exists;
}

// Add register() to export module.
module.exports = createConversation;