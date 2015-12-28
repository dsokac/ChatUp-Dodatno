//including nano and connecting to database
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

/*
	addFriends function for adding friends	
	RETURNS
	** true if successfully added friend
	** false if adding friend failed in any way 
*/
function addFriends(req, res)
{
	var query = req.body;
	var query2 = req.body;
	var response = new Object();
	
	if(query.mail1 && query2.mail2)
	{
	     database.view("view","getRegisteredUsers",function(error,data){
		      if(!error)
			  {
			     if(addFriends_userExists(query.mail1, query2.mail2, data.rows))
				 {					
				    response.status = "0";
					response.message = "Successfully added friend. Logged user:"+query.mail1+"; selected user:"+query2.mail2;
					res.send(JSON.stringify(response));	
					//update friends field of logged in user
					updateFriendList(targetDoc,query2.mail2);
					//update friends field of selected user
					updateFriendList(targetDoc1,query.mail1);					
				 }
				 else
				 {
					response.status = "1";
					response.message = "The user doesn't exists in database.";
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
		response.message = "Adding friend failed. Data is missing.";
		res.send(JSON.stringify(response));
	}
}

/*
	addFriends_userExists function for checking if both users exists in database	
	RETURNS
	** true if both users exists in database
	** false if one or both users don't exists in database 
*/
function addFriends_userExists(email_prij, email_odab, data)
{
	var output = false;
	var output2 = false;
	var output3 = false;
	//check if email_prij exists in database
    for(var i = 0; i<data.length ; i++)
	{
		if(data[i].id === email_prij)
		{	
		    targetDoc = data[i].key;
			output=true;
			break;
		}						
	}	
	//check if email_odab exists in database
	for(var j = 0; j<data.length ; j++)
	{
		if(data[j].id === email_odab)
		{
			targetDoc1 = data[j].key;
			output2 = true;		   
			break;		
		}
	}

	if (output===true && output2===true){
		output3=true;		
	}
	else{
		output3=false;		
	}	
return output3 ;
}

/*
	updateFriendList function for update friend list field of selected user with unique check
*/
function updateFriendList(targetDoc, friends)
{
	var jsonObject = targetDoc;	
	if (!(jsonObject.friends.indexOf(friends) > -1)) {
		jsonObject.friends.push(friends);
		database.insert(jsonObject, jsonObject._id, function(error, body){
			if(error) console.log(error);
			else console.log("Document '"+jsonObject._id+"' has been updated successfully. The user '"+jsonObject._id+"' is added.");
		});
	}
	else console.log("Document '"+jsonObject._id+"' has failed to update. You are trying to add duplicate value in friends list.");
}
module.exports = addFriends;