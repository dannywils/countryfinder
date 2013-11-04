$(document).ready(function () {

	var url = 'https://goinstant.net/dannywils/goFlag';
	var connection = new goinstant.Connection(url);
	var currentRoom = null;
	var userName = "Danny"//prompt("What is your name? ");

	connection.connect(function (err) {
		if (err) {
			throw err; // Could not connect to GoInstant
		}
		var userObject = {
			  displayName: userName,
		};


		var listRooms = function (err, roomsArray) {
			if (err) {
					throw err; // A problem occurred during the get.
			}
			if (roomsArray !== null) {
				roomsArray.forEach(function (room) {
					addRoom(room.name, joinRoom);
				});
			} else {
				console.log("There are no rooms!");
			}
		};

		//list all the rooms once we are connected
		connection.rooms.get(listRooms);

		var joinRoom = function(roomName){
			if(currentRoom != null){
				currentRoom.leave(function(err) {
			    	if (err) {
			    		console.log('error while leaving the room:', err);
			    	}
			     });
			}
			var room = connection.room(roomName);
			currentRoom = room;
			room.join(userObject, function (err) {
				if (err) {
					console.log('Error joining the room:', err);
					return;
				}
				console.log('Joined the room:', room.name)
			});
		};

		//add a room to the list
		//passes the roomname to the callback on click
		var addRoom = function(roomName, callback){
			var roomItem = $('<li class="list-group-item"><a href="#">')
			roomItem.find("a").text(roomName);
			roomItem.on('click', function () {
				$(".list-group-item.active").removeClass("active");
				$(this).addClass("active");
				callback(roomName);
			});
			$("#roomlist").append(roomItem);
		};

		//when we create a room add it to the list
		$("#createroom").on('click', function () {
			var roomName = "";
			while(roomName == ""){
				roomName = prompt("What room would you like to create?");
			}
			if(roomName === null){
				return;
			}
			addRoom(roomName, joinRoom);
			joinRoom(roomName);
		});

	});
});




