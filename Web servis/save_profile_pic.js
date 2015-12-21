// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

//global variable for getting wanted couchDB document for later update
var targetDoc  = {};

// Saving picture logic
function saveProfilePic(req, res)
{
	var query = req.body;
	var response = new Object();
	if (query && query.mail && query.picture) {
		database.view("view", "getUserData", function(error, body) {
			if (!error) {
				if (userExists(query.mail, body.rows))
				{

					var bitmap = new Buffer(query.picture, 'base64');
					
					database.attachment.insert( query.mail, 'profile.jpeg', bitmap, 'image/jpeg', {rev: targetDoc.rev}, function(error, body) {
						if (!error) {
							response.status = "0";
							response.message = "Update profile picture success.";
							res.send(JSON.stringify(response));

						}
						else {
							response.status = "1";
							response.message = "Update picture failure. Failed to insert new pictures.";
							res.send(JSON.stringify(response));
						}
					})
				}
				else {
					response.status = "1";
					response.message = "Data fetching false. User doesn't exist.";
					res.send(JSON.stringify(response));
				}
			}
			else {
				response.status = "1";
				response.message = "Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	}
	else {
		response.status = "1";
		response.message = "Failure. Missing data.";
		res.send(JSON.stringify(response));
	}
}

// Check if user with given e-mail already exists.
function userExists(mail, data)
{
	var exists = false;
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].value.mail == mail) {
			exists = true;
			targetDoc = data[i].value;
			break;
		}
	}
	return exists;
}

// Add saveProfilePic() to export module.
module.exports = saveProfilePic;
