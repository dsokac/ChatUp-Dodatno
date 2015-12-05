// Create a connection to CouchDB database.
var nano = require("nano")("http://localhost:5984");
var database = nano.use("chat_app");

// for sending e-mail  ->   https://www.npmjs.com/package/nodemailer
var nodemailer = require('nodemailer');

function forgot_password(req, res)
{
	//email_forgot - entered 'forgot password mail'
	var email_forgot = req.body.email1;
	//pass -  password for 'entered forgot password mail'
	var pass="";
	//string_password - 'text:' parameter
	var string_password="";
	//string_email - 'to:' parameter
	var string_email="";
	var response = new Object();
	
	//if req has data
	if (email_forgot) {
		database.view("view", "getRegisteredUsers", function(error, data) {
		if(!error)
		{	//if mail exist in database
			if(checkMail(email_forgot, data.rows))
			{
				//for each document in database
				for(var i = 0; i< data.length ; i++)
				{
					//check if 'mail in database' is equal to 'entered mail'?
					if(data[i].key.mail === email_forgot)
					{
						//save password key for this e-mail in  var 'pass'
						pass=data[i].key.password;
						
						//mail settings
						var transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: 'air.chatup@gmail.com',
								pass: 'MoramoKoristitiScrum'
								}
							},{
							// default values for sendMail method 
							from: 'air.chatup@gmail.com',
							headers: {
								'ChatUp': 'Your Password'
							}
						});
						string_password="'Your password for mail: "+email_forgot+" is: "+pass+"'";
						string_email="'"+email_forgot+"'";
						//sent mail
						transporter.sendMail({
							to: string_email,
							subject: 'ChatUp - Your Password',
							text: string_password
						});
					}
				}
				response.status = "0";
				response.message = "Mail sent successfuly!";
				res.send(JSON.stringify(response));
					
			}
			//else if mail doesnt exists in database 
			else
			{
				response.status = 1;
				response.message = "Mail doesnt exist in database.";
				res.send(JSON.stringify(response));
			}
		} 
		else {
			response.status = 1;
			response.message = "Getting users failure. Error reading database.";
			res.send(JSON.stringify(response));
			}
		});	
	}
	 else 
	{
		response.status = 1;
		response.message = "Data fetch failure. Missing data in req.";
		res.send(JSON.stringify(response));
	}
}

//function checkMail - check if e-mail exist in database
//returns 
//   check (true) - mail exist in database
//	 check (false) - mail doesnt exist in database
function checkMail(email1, data)
{
	var check = false;

    for(var i = 0; i< data.length ; i++)
	{
		//check if email1 exists in database (entered forgot password email)
		if(data[i].key.mail === email1)
		{
			check = true;	    
		}
	}
	//returns true if mail exist in database
	return check;
}

module.exports = forgot_password;