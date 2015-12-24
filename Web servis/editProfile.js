//including nano and connecting to database
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

function editProfile(req, res)
{
	var query = req.body;
	var query2 = req.body;
	var query3 = req.body;
	var query4 = req.body;
	var response = new Object();
	
	if(query && query.mail && query2.mail2 && query3.mail3 && query4.mail4 )
	{
	     database.view("view","getRegisteredUsers",function(error,data){
		      if(!error)
			  {
			     if(editFriends_userExists(query.mail, data.rows))
				 {
										
					updateUsername(targetDoc,query2.mail2,query3.mail3,query4.mail4);
					response.status = "0";
					response.message = "Successfully updated field ";
					res.send(JSON.stringify(response));
				 }
				 else
				 {
					response.status = "1";
					response.message = "The user doesn't exists in database";
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
		response.message = "Edit profile failed. Data is missing.";
		res.send(JSON.stringify(response));
	}
}

function editFriends_userExists(email, data)
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

function updateUsername(targetDoc, username,gender,password)
{
	var jsonObject = targetDoc;
	jsonObject.username = username;
	jsonObject.gender=gender;
	jsonObject.password=password;

	database.insert(jsonObject, jsonObject._id, function(error, body){
		if(error) console.log(error);
		else console.log("Document '"+jsonObject._id+"' has been updated successfully. The user '"+jsonObject._id+"' has new username, password or gender.");
	});
}

module.exports = editProfile;