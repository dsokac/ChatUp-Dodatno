//including nano and connecting to database
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

//global variable for getting wanted couchDB document for later update
var targetDoc_login  = {};

/*
	Logout function for signing out of the system.
	
	RETURNS
	** true if user does exists in database and provides correct credentials
	** false if logout failed in any way 
*/
function log_out(req, res)
{
	var query = req.body;
	var response = new Object();
	
	if(query && query.mail)
	{
	     database.view("view","getOnlineUsers",function(error,data){
		      if(!error)
			  {
			     if(logout_userExists(query.mail, data.rows))
				 {
					
				    response.status = "0";
					response.message = "Successfully logged out.";
					res.send(JSON.stringify(response));
					
					updateStatus(targetDoc,"offline");
				 }
				 else
				 {
					response.status = "1";
					response.message = "The user doesn't exists in database or already offline.";
					res.send(JSON.stringify(response));
				 }
			  }
			  else
			  {
				response.status = "1";
				response.message = "An error occured while connecting to database.";
				res.send(JSON.stringify(response));
			  }
		 });
	}
	else
	{	
		response.status = "1";
		response.message = "Log out failed. Data is missing.";
		res.send(JSON.stringify(response));
	}
}

/*
Function validates if given email and password exists in view and 
sets value of targetDoc variable to wanted couchDB document.
  
  PARAMS:
	**email, password - input of logout form
	**data - rows returned by view
  RETURNS:
    **true if the user is valid
	**false if the user is not valid   
*/
function logout_userExists(email, data)
{
	var output = false;
    for(var i = 0; i<data.length ; i++)
	{
		if(data[i].id === email)
		{
			output = true;
		    targetDoc = data[i].key;
			break;
		}
	}
	return output;
}

/*
	Function updates user's status to offline.
	
	PARAMS:
	** targetDoc - JSON object of wanted document from couchDB, document which references the user that is logging out.
	** status - new wanted value for status field in database
	
*/

function updateStatus(targetDoc, status)
{
	var jsonObject = targetDoc;
	jsonObject.status = status;

	database.insert(jsonObject, jsonObject._id, function(error, body){
		if(error) console.log(error);
		else console.log("Document '"+jsonObject._id+"' has been updated successfully. The user '"+jsonObject._id+"' is logged out.");
	});
}

module.exports = log_out;