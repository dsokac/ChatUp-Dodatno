// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

function getMessages(req, res)
{
	var email = req.body.email;
	var response = new Object();
	
	if (email) {
		database.view("view", "getAllMessages", function(error, body) {
			if (!error) {
				var data = getChatData(email, body.rows);
				if (data) {
                    database.view("view", "getAllDataForUser", function(error, body) {
                        if (!error) {
                            response.status = 0;
                            response.message = "Messages read successfully.";
                            response.data = getParticipantUsernames(data, body.rows);
                            res.send(JSON.stringify(response));
                        }
                        else {
                            response.status = 1;
                            response.message = "Data fetch failure. Error reading database (users).";
                            res.send(JSON.stringify(response));
                        }
                    });
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

function getChatData(email, data)
{
	var chatData = null;
	for (var i = 0; i < data.length; i++) 
	{
		if (data[i].value.participants.indexOf(email) > -1) {
            chatData = new Object();
            var participants = data[i].value.participants.split(",");
            
			chatData.chat = data[i].value.chat;
            chatData.participants = createUserObjectArray(participants);
			break;
		}
	}
	return chatData;
}

function createUserObjectArray(userArray)
{
    var userObjectArray = new Array();
    for (var i = 0; i < userArray.length; i++)
    {
        var userInfo = new Object();
        userInfo.email = userArray[i];
        userInfo.username = "";
        userObjectArray.push(userInfo);
    }
    return userObjectArray;
}

function getParticipantUsernames(responseData, data)
{
    for (var i = 0; i < data.length; i++)
    {
        var row = data[i].value;
        for (var j = 0; j < responseData.participants.length; j++)
        {
            if (row.mail == responseData.participants[j].email)
            {
                responseData.participants[j].username = row.username;
            }
        }
    }
    return responseData;
}

// Add getMessages() to export module.
module.exports = getMessages;