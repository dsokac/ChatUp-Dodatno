// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// Register logic
function register(req, res)
{
	var query = req.body;
	var response = new Object();
	if (query && query.mail && query.username && query.password && query.gender && query.dateOfBirth) {
		database.view("view", "getUserIDs", function(error, body) {
			if (!error) {
				if (!userExists(query.mail, body.rows))
				{
					var newUser = new Object();
					newUser._id = query.mail;
					newUser.mail = query.mail;
					newUser.username = query.username;
					newUser.password = query.password;
					newUser.status = "offline";
					newUser.gender = query.gender;
					newUser.dateOfBirth = query.dateOfBirth;
					newUser.friends = [];
					newUser.type = "user";
					database.insert(newUser, function(error, body) {
						if (!error) {
							response.status = "0";
							response.message = "Registration success.";
							res.send(JSON.stringify(response));
						}
						else {
							response.status = "1";
							response.message = "Registration failure. Failed to insert new user.";
							res.send(JSON.stringify(response));
						}
					})
				}
				else {
					response.status = "1";
					response.message = "Registration failure. User already registered with this e-mail.";
					res.send(JSON.stringify(response));
				}
			}
			else {
				response.status = "1";
				response.message = "Registration failure. Error reading database.";
				res.send(JSON.stringify(response));
			}
		});
	}
	else {
		response.status = "1";
		response.message = "Registration failure. Missing data.";
		res.send(JSON.stringify(response));
	}
}

// Check if user with given e-mail already exists.
function userExists(mail, data)
{
	var exists = false;
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].id == mail) {
			exists = true;
			break;
		}
	}
	return exists;
}

// Add register() to export module.
module.exports = register;