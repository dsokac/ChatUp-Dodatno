// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// Message sending logic
function sendMessage(req, res)
{
	var query = req.body;
	var response = new Object();
	if (query && query.id && query.sender && query.message && query.type)
	{
		database.view("view", "getAllMessages", function(error, body) {
			if (!error)
			{
				var conversation = filterConversationsByID(query.id, body.rows);
				if (conversation)
				{
					var newMessage = new Object();
					newMessage.sender = query.sender;
					newMessage.text = query.message;
					newMessage.timeSend = (new Date()).getTime().toString();
					newMessage.location = query.location ? query.location : "";
                    newMessage.type = query.type
					
					conversation.chat.push(newMessage);
					database.insert(conversation, function(error, body) {
						if (!error)
						{
							response.status = "0";
							response.message = "Message added to conversation.";
							response.data = newMessage;
							res.send(JSON.stringify(response));
						}
						else
						{
							response.status = "1";
							response.message = "Message sending error. Document update error.";
							res.send(JSON.stringify(response));
						}
					});
				}
				else
				{
					response.status = "1";
					response.message = "Message sending error. Conversation doesn't exist.";
					res.send(JSON.stringify(response));
				}
			}
			else
			{
				response.status = "1";
				response.message = "Message sending error. Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	}
	else
	{
		response.status = "1";
		response.message = "Message sending error. Missing data.";
		res.send(JSON.stringify(response));
	}
}

// Filter conversations by ID
function filterConversationsByID(id, data)
{
	var conversation = null;
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].value._id == id)
		{
			conversation = data[i].value;
			break;
		}
	}
	return conversation;
}


// Add sendMessage() to export module
module.exports = sendMessage;
