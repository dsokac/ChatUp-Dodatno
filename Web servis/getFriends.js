//including nano and connecting to database
var nano = require("nano")("http://localhost:5984/");
var database = nano.use("chat_app");

function getFriends(req, res)
{
	var query = req.body;
	var response = new Object();
	
	
	
	//empty array to store all friends of chosen user
	var friends = [];
	
	if(query && query.id)
	{    //view fetching all users and their friends
		
	     database.view("view","getAllFriends",function(error,data){
		      if(!error)
			  {
				  //filtering view to get only friends of chosen user
			      for(var i = 0; i<data.rows.length ; i++)
				  {
					  if(query.id == data.rows[i].id)
					  {
						   friends = data.rows[i].value;
						   break;
					  }
				  }
				  //empty array for all registered users
				  var allUsers = [];
				  //empty array for all friends of chosen user with their information
				  var friendsDetails = [];
				  
				  //view to fetch all registered users
				  database.view("view","getRegisteredUsers",function(error,data){
						  if(!error)
						  {
							  //storing all user into array for later operations
							  for(var i = 0; i<data.rows.length ; i++)
							  {
								  var userInfo = data.rows[i];
								  allUsers.push(userInfo);
							  }
							  
							  //filtering only chosen users friends and storing their information into object and pushing it into array
							  for(var i = 0; i<friends.length ; i++)
							  {
								for(var j = 0; j < allUsers.length ; j++)
								{
									if(friends[i] == allUsers[j].id)
									{
										var userInfo = allUsers[j].key;
										friendsDetails.push({id:userInfo._id, username:userInfo.username, status:userInfo.status});
									}
								}

							  }
							  response.data = friendsDetails;
							  response.status = "0";
							  response.message = "Data loaded successfully";
							  res.send(JSON.stringify(response));
						  }
					 });
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
		response.message = "Data is missing.";
		res.send(JSON.stringify(response));
	}
}

module.exports = getFriends;