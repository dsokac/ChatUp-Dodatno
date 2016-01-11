var express = require('express');
var	app = express();
var	http = require('http').Server(app);
var	io = require('socket.io')(http);

var registered_clients = new Array(); //[{id,socket}]

var queued_notifications = new Array(); //[{id:@@@@, numOfnotifs: # ,friendRequests:[{from,to}],messages:[{Message object}]}]

app.get('/', function(req, res) {
	res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket) {
	
	socket.on('registration',function(data){
		console.log(data);
		var client = {};
		client.id = data.id;
		client.socket = socket.id;
		
		registered_clients.push(client);
		console.log("Registered client "+data.id+"\n"+registered_clients+"\n");
		
		console.log("QUEUE: "+queued_notifications+"\n\n");
		
		
		var i = hasClientQueuedNotifs(client.id);
		
		if(i != -1)
		{
			console.log("QUEUE for me: "+queued_notifications[i]+"\n\n");
			sendQueuedNotifs(i,socket.id);
		}
		
	});
	
	socket.on('disconnect',function(){
		for(var i = 0; i < registered_clients.length; i++)
		{
			var current = registered_clients[i];
			if(current.socket = socket.id)
			{
				registered_clients.splice(i,1);
			}
		}
		console.log("user disconnected");
		console.log(registered_clients);
	});
	
	socket.on('newMessage',function(data){
		console.log("recieved message\n");
		console.log(data);

		var sender = data.from;
		var reciever = data.to;

		if(isClientConnected(reciever)) 
		{
			io.sockets.socket(getClientSocket(reciever)).emit("newMessage", sender+" send you new message");
		}
		else 
		{
			var index = hasClientQueuedNotifs(reciever);
				if(index != -1) addNewNotif(index,"newMessage",data);
				else
				{
					queued_notifications.push({id:reciever, numOfnotifs:0, friendRequests:[], messages:[]});
					index = hasClientQueuedNotifs(reciever);
					addNewNotif(index,"newMessage",data);
					console.log("MSG notif not send with data:"+queued_notifications+", saved in queued_notifications\n");
				}
		}

	});
	
	socket.on('friendRequest',function(data){
		     	
			var sender = data.from;
			var reciever = data.to;
					
			if(isClientConnected(reciever)) io.sockets.socket(getClientSocket(reciever)).emit("friendRequest","User "+sender+" added you as friend on ChatUp.");
			else 
			{
				var index = hasClientQueuedNotifs(reciever);
				if(index != -1) addNewNotif(index,"friendRequest",data);
				else
				{
					queued_notifications.push({id:reciever, numOfnotifs:0, friendRequests:[], messages:[]});
					index = hasClientQueuedNotifs(reciever);
					addNewNotif(index,"friendRequest",data);
				}
			}
			console.log("QUEUE"+queued_notifications+"\n");
	});
	
	console.log('one user connected');
});


function isClientConnected(id)
{
	
	for(var i = 0; i < registered_clients.length; i++)
	{
		var current = registered_clients[i];
		if(current.id == id) return true;
	}
	return false;
}

function getClientSocket(id)
{
	for(var i = 0; i< registered_clients.length; i++)
	{
		if(registered_clients[i].id == id) return registered_clients[i].socket;
	}
}

function hasClientQueuedNotifs(id)
{
	for(var i = 0; i < queued_notifications.length; i++)
	{
		if(queued_notifications[i].id == id) return i;
	}
	return -1;
}

function addNewNotif(clientIndex, notifType, notif)
{
	var currentClient = queued_notifications[clientIndex];
	var num = currentClient.numOfnotifs;
	if(num.isNaN) num = 0;
	num = parseInt(num);
	num++;
	currentClient.numOfnotifs = num;
	
	if(notifType == "friendRequest")
	{
		currentClient.friendRequests.push(notif);
	}
	else if (notifType == "newMessage") {
		currentClient.messages.push(notif);
	}
}

function sendQueuedNotifs(clientIndex, socketID)
{
	var friendRequests = queued_notifications[clientIndex].friendRequests;
	var numOfRequests = friendRequests.length;
	
	for(var i = 0; i < friendRequests.length; i++) sendFriendRequest(io.to(socketID),friendRequests[i]);
	
	queued_notifications[clientIndex].friendRequests = [];
	var num = parseInt(queued_notifications[clientIndex].numOfnotifs)
	num -= parseInt(numOfRequests);
	if(num < 0) num = 0;
	queued_notifications[clientIndex].numOfnotifs = num;
	
	var newMessagesStock = queued_notifications[clientIndex].messages;
	var numOfMessages = newMessagesStock.length;

	for (var i = 0; i < numOfMessages; i++) {
		sendMessageNotif(io.to(socketID), newMessagesStock[i]);
	};

	queued_notifications[clientIndex].messages = [];
	var num = parseInt(queued_notifications[clientIndex].numOfnotifs)
	num -= parseInt(numOfMessages);
	if(num < 0) num = 0;
	queued_notifications[clientIndex].numOfnotifs = num;
}

function sendFriendRequest(reciever,oNotif)
{
	var nFrom = oNotif.from;
	var message = "User "+nFrom+" added you as friend on ChatUP.";
	reciever.emit("friendRequest",message);
}

function sendMessageNotif(reciever, oNotif)
{
	var nFrom = oNotif.from;
	var message = "You received new message from "+nFrom+".";
	reciever.emit("newMessage",message);
}


http.listen(3000, function() {
	console.log('Server listening on port 3000!')
});