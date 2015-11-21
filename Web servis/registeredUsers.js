var nano = require("nano")("http://localhost:5984/");
var database = nano.use("chat_app");

function getRegisteredUsers(req, res)
{
	var response = new Object();
	
	database.view("view","getRegisteredUsers",function(error, data){
		
		if(!error)
		{
		    var databaseRows = data.rows;
			response.status = "0";
			response.message = new Array();
			for(var i = 0; i < databaseRows.length ; i++)
			{
				var rowDetails = databaseRows[i].key;
			    				
				response.message.push(rowDetails);
			}
			
		}
		else
		{
			response.status = "1";
			response.message = "An error occured while fetching registered users.";
		}
		
		res.send(JSON.stringify(response));
		
	});

}

module.exports = getRegisteredUsers;