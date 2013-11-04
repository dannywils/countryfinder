$(document).ready(function () {

	var url = 'https://goinstant.net/dannywils/goFlag';
	var connection = new goinstant.Connection(url);
	var currentRoom = null;
	var userName = Math.random().toString(36).substring(7); //prompt('What is your name?');

	connection.connect(function (err, platform, lobby) {
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

		var joinRoom = function (roomName) {
			if (currentRoom != null) {
				currentRoom.leave(function (err) {
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
				console.log('Joined the room:', room.name);
				loadGame();
			});
		};

		//add a room to the list
		//passes the roomname to the callback on click
		var addRoom = function (roomName, callback) {
			var roomItem = $('<li class="list-group-item"><a href="#">')
			roomItem.find("a").text(roomName);
			roomItem.on('click', function () {
				$(".list-group-item.active").removeClass("active");
				$(this).addClass("active");
				callback(roomName);
			});
			$("#roomlist").append(roomItem);
		};


		var loadGame = function () {
			//remove any existing user lists
			$('.gi-userlist').remove();
			// Create a new instance of the UserList widget
			var userList = new goinstant.widgets.UserList({
				room: currentRoom,
				collapsed: true,
				position: 'right'
			});

			// Initialize the UserList widget
			userList.initialize(function (err) {
				if (err) {
					throw err;
				}
				// Now it should render on the page with any connected users
			});



			var modal = $('.modal');

			modal.modal('show');
			modal.find(".modal-title").text("Room: " + currentRoom.name);

			modal.on('shown', function () {
				google.maps.event.trigger(map, 'resize');
			});

			modal.on('hidden', function () {
				$('.gi-userlist').remove();
				$(".list-group-item.active").removeClass("active");
			});

			var country = currentRoom.key('country');

			var newCountry = function () {
				country.set(countries[Math.floor(Math.random() * countries.length)]);
			};


			var listener = function (value, context) {
				// Triggered when any user (local or remote) performs any action (set, add, or remove)
				// on '/foo'. Also triggered immediately with the current value of '/foo'.
				if (value == null) {
					newCountry();
				}
				modal.find(".modal-title small").html('');
				var countryText = modal.find(".country");
				countryText.text("Find the country: " + value.name);


				google.maps.event.addListener(map, 'click', function(event) {
					//console.log(event.latLng.toUrlValue(6));
					geocoder.geocode({
						'latLng': event.latLng
					}, function (results, status) {
						if (results !== null && results.length > 0) {
							var clickCountry = results[results.length - 1].address_components[0];
							console.log("clicked", clickCountry);
							if (value.code === clickCountry.short_name) {
								countryText.addClass("correct");
								window.setTimeout(function(){
									countryText.removeClass("correct");
									newCountry();
								}, 600);

							} else {
								countryText.addClass("incorrect");
								window.setTimeout(function(){
									countryText.removeClass("incorrect");
								}, 600);
							}
						}
					});
				});

			};

			country.watch(listener);



		};

		//when we create a room add it to the list
		$("#createroom").on('click', function () {
			var roomName = "";
			while (roomName == "") {
				roomName = prompt("What room would you like to create?");
			}
			if (roomName === null) {
				return;
			}
			addRoom(roomName, joinRoom);
			joinRoom(roomName);
		});
	});
});
