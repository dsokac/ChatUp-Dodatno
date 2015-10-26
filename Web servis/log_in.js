//including nano and connecting to database
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

/*
	Login function for signing into system.
	
	RETURNS
	** true if user does exists in database and provides correct credentials
	** false if login failed in any way 
*/
function log_in(req, res)
{
	var query = req.body;
	var response = new Object();
	
	if(query && query.mail && query.password)
	{
	     database.view("register","all",function(error,data){
		      if(!error)
			  {
			     if(login_userExists(query.email, query.password, data.rows))
				 {
				    response.status = "0";
					response.message = "Successfully logged in.";
					res.send(JSON.stringify(response));
				 }
				 else
				 {
					response.status = "0";
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
		response.message = "Log in failed. Data is missing.";
		res.send(JSON.stringfy(response));
	}
}

/*
Function which validates if given email and password exists in database
  
  PARAMS:
	**email, password - input of login form
	**data - rows returned by view
  RETURNS:
    **true if the user is valid
	**false if the user is not valid   
*/
function login_userExists(email, password, data)
{
	var output = false;
    for(var i = 0; i<data.length ; i++)
	{
		if(data[i].id === email && data[i].value.password === password)
		{
			output = true;
		}
	}
	return output;
}

module.exports = log_in;