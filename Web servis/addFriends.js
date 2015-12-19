//including nano and connecting to database
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

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
					response.message = "Successfully added frined. Logged user:"+query.mail1+"; selected user:"+query2.mail2;
					res.send(JSON.stringify(response));					
					updateFriendList(targetDoc,query2.mail2);
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

function addFriends_userExists(email_prij, email_odab, data)
{
	var output = false;
	var output2 = false;
	var output3 = false;

    for(var i = 0; i<data.length ; i++)
	{
		if(data[i].id === email_prij)
		{	
		    targetDoc = data[i].key;
			output=true;
			break;
		}
						
	}	
	
	for(var j = 0; j<data.length ; j++)
	{
		if(data[j].id === email_odab)
		{
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

function updateFriendList(targetDoc, friends)
{
	var jsonObject = targetDoc;	
	jsonObject.friends.push(friends);
	database.insert(jsonObject, jsonObject._id, function(error, body){
		if(error) console.log(error);
		else console.log("Document '"+jsonObject._id+"' has been updated successfully. The user '"+jsonObject._id+"' is added.");
	});
}

module.exports = addFriends;