// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// Getting new messages logic
function getNewMessages(req, res)
{
	var query = req.body;
	var response = new Object();
	if (query && query.chatID && query.timestamp) {
		database.view("view", "getAllMessages", function(error, body) {
			if (!error) {
				var messages = filterMessagesByChatID(query.chatID, body.rows);
                var newMessages = filterMessagesByTimestamp(messages, query.timestamp);
                
                response.status = "0";
				response.message = "Message fetch success.";
                response.data = newMessages;
				res.send(JSON.stringify(response));
			}
			else {
				response.status = "1";
				response.message = "Message fetch failure. Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	}
	else {
		response.status = "1";
		response.message = "Message fetch failure. Missing data.";
		res.send(JSON.stringify(response));
	}
}

// Filters conversations by ID
function filterMessagesByChatID(chatID, data)
{
    var messages = null;
    for (var i = 0; i < data.length; i++)
    {
        var row = data[i].value;
        if (chatID == row._id)
        {
            messages = row.chat;
            break;
        }
    }
    return messages;
}

// Compares two messages
function compareMessages(messageA, messageB)
{
    var returnValue;
    var timestampA = parseInt(messageA.timeSend);
    var timestampB = parseInt(messageB.timeSend);
    
    if (timestampA > timestampB)
        returnValue = 1;
    else if (timestampA < timestampB)
        returnValue = -1;
    else
        returnValue = 0;
        
    return returnValue;
}

// Filters messages by timestamp. It returns messages
// newer than the given timestamp.
function filterMessagesByTimestamp(messages, timestamp)
{
    var newMessages = new Array();
    messages.sort(compareMessages);
    for (var i = messages.length - 1; i >= 0; i--)
    {
        var msgTimestamp = messages[i].timeSend;
        if (parseInt(msgTimestamp) > parseInt(timestamp))
            newMessages.push(messages[i]);
        else
            break;
    }
    return newMessages;
}

// Add getNewMessages() to export module.
module.exports = getNewMessages;