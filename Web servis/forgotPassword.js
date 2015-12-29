//including nano and connecting to database
var nano = require("nano")("http://localhost:5984/");
var database = nano.use("chat_app");

function forgotPassword(req, res) {
    var query = req.body;
    var response = new Object();

    if (query && query.id) {
        //empty array for all registered users
        var allUsers = [];
        //empty array for all registered users with their information
        var usersDetails = [];

        //view to fetch all registered users
        database.view("view", "getRegisteredUsers", function(error, data) {
            if (!error) {
                //storing all users into array for later operations
                for (var i = 0; i < data.rows.length; i++) {
                    var userInfo = data.rows[i];
                    allUsers.push(userInfo);
                }

                for (var j = 0; j < allUsers.length; j++) {
                    var userInfo = allUsers[j].key;
                    usersDetails.push({
                        id: userInfo._id,
                        username: userInfo.username,                        
						gender: userInfo.gender,
						dateOfBirth: userInfo.dateOfBirth,
						password: userInfo.password					
                    });
                }

                response.data = usersDetails;
                response.status = "0";
                response.message = "Data loaded successfully";
                res.send(JSON.stringify(response));
            }
        });

    } else {
        response.status = "1";
        response.message = "Data is missing.";
        res.send(JSON.stringify(response));
    }
}
module.exports = forgotPassword;