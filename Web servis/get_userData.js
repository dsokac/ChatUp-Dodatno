// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");


function getUserData(req, res)
{
	var email = req.body.email;
	var response = new Object();
	if (email) {
		database.view("view", "getUserData", function(error, body) {
			if(!error) {
				var user = getSpecificUser(email, body.rows);
				if (user) {
					response.status = 0;
					response.message = "Data fetch success.";
					response.data = user;
					res.send(response);
				}
				else {
					response.status = 1;
					response.message = "Data fetch failure. Non-existant user.";
					res.send(JSON.stringify(response));
				}
			}
			else {
				response.status = 1;
				response.message = "Data fetch failure. Error reading database."
				res.send(JSON.stringify(response));
			}
		});
	}
	else {
		response.status = 1;
		response.message = "Data fetch failure. Missing data.";
		res.send(JSON.stringify(response));
	}
}


function getSpecificUser(email, data)
{
	var user = null;
	for (var i = 0; i < data.length; i++) 
	{
		if (data[i].id == email) {
			user = data[i].value;
			break;
		}
	}
	return user;
}


module.exports = getUserData;