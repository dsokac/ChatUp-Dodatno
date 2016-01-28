// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// Adds new participants to the conversation
function addParticipantsToConversation(req, res)
{
    var query = req.body;
    var response = new Object();
    
    if (query.id && query.emails && Array.isArray(query.emails))
    {
        database.view("view", "getAllMessages", function(error, body)
        {
            if (!error)
            {
                var conversation = getConversationByID(body.rows, query.id);
                if (conversation)
                {
                    conversation.participants = addNewParticipants(conversation.participants, query.emails);
                    database.insert(conversation, function(error, body)
                    {
                        if (!error)
                        {
                            response.status = 0;
                            response.message = "Adding participants success!";
                            response.data = query.emails;
                            res.send(JSON.stringify(response));
                        }
                        else
                        {
                            response.status = 1;
                            response.message = "Adding participants failed. Database insertion error.";
                            res.send(JSON.stringify(response));
                        }
                    });
                }
                else
                {
                    response.status = 1;
                    response.message = "Adding participants failed. Conversation doesn't exist.";
                    res.send(JSON.stringify(response));
                }
            }
            else 
            {
                response.status = 1;
                response.message = "Adding participants failed. Error reading database.";
                res.send(JSON.stringify(response));
            }
        });
    }
    else
    {
        response.status = 1;
        response.message = "Adding participants failed. Missing or empty data.";
        res.send(JSON.stringify(response));
    }
}

// Filters the conversations by ID. Result of filtering should
// be a list of one conversation. That one conversation returns.
function getConversationByID(data, id)
{
    var conversation = null;
    var found = false;
    
    for (var i = 0; i < data.length && !found; i++)
    {
        var row = data[i].value;
        if (row._id == id)
        {
            conversation = row;
            found = true;
        }
    }
    
    return conversation;
}

function addNewParticipants(currentString, newArray)
{
    return currentString + "," + newArray.join();
}

// Add getNewMessages() to export module.
module.exports = addParticipantsToConversation;
