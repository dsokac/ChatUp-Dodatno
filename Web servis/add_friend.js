// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

function addFriends(req, res)
{
	//email_prijavljeni - email of user who is logged in
	var email_prijavljeni = req.body.email1;
	
	//email_odabrani - email of user who will be added to friend list
	var email_odabrani = req.body.email2;
	
	var response = new Object();
	
	//if req has data
	if (email_prijavljeni && email_odabrani) {
		database.view("view", "getRegisteredUsers", function(error, data) {
		if(!error)
		{	//if both mails exists in database
			if(checkMails(email_prijavljeni, email_odabrani, data.rows))
			{
				for(var i = 0; i< data.length ; i++)
				{
					//for each email in database who is equal to email of 'user who is logged in'
					if(data[i].key.mail === email_prijavljeni)
					{
						//add 'email_odabrani' to friend list
						data[i].key.friends.push(email_odabrani);
						//insert into database
						database.insert(data[i].key, data[i].key._id, function(error, body){
						if(error) console.log(error);
						else console.log("Document '"+data[i].key._id+"' has been updated successfully. The user '"+data[i].key._id+"' has new friend.");
						});
					}
					//for each email in database who is equal to email of 'user who will be added to friend list'
					if(data[i].key.mail === email_odabrani)
					{
						//add 'email_prijavljeni' to friend list
						data[i].key.friends.push(email_prijavljeni);
						//insert into database
						database.insert(data[i].key, data[i].key._id, function(error, body){
						if(error) console.log(error);
						else console.log("Document '"+data[i].key._id+"' has been updated successfully. The user '"+data[i].key._id+"' has new friend.");
					});
					}
				}
				response.status = "0";
				response.message = "Successfully added friend.";
				res.send(JSON.stringify(response));
				
			} else
			{
				response.status = 1;
				response.message = "Mails doesnt exist in database.";
				res.send(JSON.stringify(response));
			}
		} 
		else {
			response.status = 1;
			response.message = "Getting users failure. Error reading database.";
			res.send(JSON.stringify(response));
			}
		}	
	} else 
	{
		response.status = 1;
		response.message = "Data fetch failure. Missing data in req.";
		res.send(JSON.stringify(response));
	}
}

//function checkMails - check if both e-mails exists in database
//returns 
//   output (true) - both mail exists in database
//	 output (false) - one or both mails dont exists in database
function checkMails(email1, email2, data)
{
	var check1 = false;
	var check2 = false;
	var output = false;
	
    for(var i = 0; i< data.length ; i++)
	{
		//check if email1 exists in database (email of logged in user)
		if(data[i].key.mail === email1)
		{
			check1 = true;	    
		}
		//check if email2 exists in database (email of friend who will be added)
		if(data[i].key.mail === email2)
		{
			check2 = true;
		}
	}
	//returns true if both mail exists in database
	output = (check1 && check2);
	return output;
}

module.exports = add_friend;