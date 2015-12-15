//including nano and connecting to database
var nano = require("nano")("http://localhost:5984/");
var database = nano.use("chat_app");

function registeredUsers2(req, res) {
    var query = req.body;
    var response = new Object();

    if (query && query.id) {
        //empty array for all registered users
        var allRegisteredUsers = [];
        //informations about registered users
        var usersDetails = [];

        //view to fetch all registered users
        database.view("view", "getRegisteredUsers", function(error, data) {
            if (!error) {
                //storing all users into array for later operations
                for (var i = 0; i < data.rows.length; i++) {
                    var userInfo = data.rows[i];
                    allRegisteredUsers.push(userInfo);
                }

                for (var j = 0; j < allRegisteredUsers.length; j++) {
                    var userInfo = allRegisteredUsers[j].key;
                    usersDetails.push({
                        id: userInfo._id,
                        username: userInfo.username,
                        status: userInfo.status
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
module.exports = registeredUsers2;