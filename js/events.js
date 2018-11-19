currentBattleMenu = "main"

//copied from game.js
function LoadLevel(x, y) {
	if (!x || !y) {
		playerCol = currentLevel.spawnPoint[0];
		playerRow = currentLevel.spawnPoint[1];
		playerXTile = playerRow
		playerYTile = playerCol
		playerXPos = playerCol * 16
		playerYPos = playerRow * 16

	} else {
		playerXTile = x
		playerYTile = y
		playerXPos = playerXTile * 16
		playerYPos = playerYTile * 16
	}
	currentLevelCols = currentLevel.tiles[0].length;
	currentLevelRows = currentLevel.tiles.length

	canvas.height = currentLevelRows * 16
	canvas.width = currentLevelCols * 16
}

function eventMessage(one, two, three) {
	//PARAMETERS
	//one is the first line of the message
	//two is the second line of the message
	//three is the third line of the message
	
	//fills in a white rectangle at the bottom of the game
	context.fillStyle = "#FFFFFF"
	context.fillRect(0, canvas.height - 40, canvas.width, 40)
	
	//if one exists
	if (one) {
		
		//draws the text
		context.fillStyle = "#000000"
		context.fillText(one, 5, canvas.height - 30)
	}
	
	//if two exists
	if (two) {
		
		//draws the text
		context.fillStyle = "#000000"
		context.fillText(two, 5, canvas.height - 20)
	}
	
	//if three exists
	if (three) {
		
		//draws the text
		context.fillStyle = "#000000"
		context.fillText(three, 5, canvas.height - 10)
	}
	
	//draws the black border around the rectangle
	context.rect(0, canvas.height - 40, canvas.width, 40);

	context.stroke();
}
class event {
	constructor() {
		this.ready = true // FALSE SO THAT EVENTS DONT RUN FOR DEVELOPMENT
		this.running = false
		this.done = []
	}
}
finalBoss = new event()
finalBoss.ready = false //TRUE FOR DEVELOPMENT
firstBattle = new event()
firstCapture = new event()
outsideGym = new event()

//these 2 events are the only ones that need certain conditions to be met before they can be run
//so they aren't ready at the start of the game
gym0Event = new event()
gym0Event.ready = false
gym1Event = new event()
gym1Event.ready = false

//there are no gyms beaten when the game is loaded
gymsBeaten = 0

numberOfGyms = 2

//these 2 could actually have been made using the event class
healing = {
	"running": false
}
shopping = {
	"running": false
}

//whether or not the player can capture a monster or run during combat (there will never be a time when the player can run but not capture or vice versa)
canCapture = false

//used in the items menu of the battle ui
itemIndex = 0

//used in the switch menu of the battle ui
switchIndex = 0

//used to reference the monsters that are currently in a battle
currentMonsterIndex = 0
enemyMonsterIndex = 0

//if the tutorial needs to be run
tutorial = false
tutorialCapture = false

//pythagoras to determine the distance between 2 points
function distanceTo(y1, y2, x1, x2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

//checks type matchups
function attackIsStrong(defend, attack) {
	switch (defend) {
		case type.fire:
			return [type.ground, type.rock, type.water].includes(attack)
			break;
		case type.water:
			return [type.grass, type.electric].includes(attack)
			break;
		case type.rock:
			return [type.fighting, type.ground, type.steel, type.water, type.grass].includes(attack)
			break;
		case type.fighting:
			return [type.flying, type.psychic].includes(attack)
			break;
		case type.ground:
			return [type.water, type.grass, type.ice].includes(attack)
			break;
		case type.ice:
			return [type.fighting, type.rock, type.steel, type.fire].includes(attack)
			break;
		case type.bug:
			return [type.flying, type.rock, type.fire].includes(attack)
			break;
		case type.ghost:
			return [type.ghost].includes(attack)
			break;
		case type.steel:
			return [type.fighting, type.ground, type.fire].includes(attack)
			break;
		case type.normal:
			return [type.fighting].includes(attack)
			break;
		case type.poison:
			return [type.ground, type.psychic].includes(attack)
			break;
		case type.dragon:
			return [type.ice, type.dragon].includes(attack)
			break;
		case type.electric:
			return [type.ground].includes(attack)
			break;
		case type.dark:
			return [type.fighting, type.bug].includes(attack)
			break;
		case type.psychic:
			return [type.bug, type.ghost, type.dark].includes(attack)
			break;
		case type.flying:
			return [type.rock, type.electric, type.ice].includes(attack)
			break;
		case type.grass:
			return [type.flying, type.poison, type.bug, type.fire, type.ice].includes(attack)
			break;
	}
}

//checks type matchups
function defenceIsStrong(defend, attack) {
	switch (defend) {
		case type.fire:
			return [type.bug, type.steel, type.fire, type.grass, type.ice].includes(attack)
			break;
		case type.water:
			return [type.steel, type.fire, type.ice, type.water].includes(attack)
			break;
		case type.rock:
			return [type.normal, type.flying, type.poison, type.fire].includes(attack)
			break;
		case type.fighting:
			return [type.rock, type.bug, type.dark].includes(attack)
			break;
		case type.ground:
			return [type.poison, type.rock].includes(attack)
			break;
		case type.ice:
			return [type.ice].includes(attack)
			break;
		case type.bug:
			return [type.fighting, type.grass].includes(attack)
			break;
		case type.ghost:
			return [type.normal, type.fighting, type.poison, type.bug].includes(attack)
			break;
		case type.steel:
			return [type.normal, type.flying, type.rock, type.bug, type.steel, type.grass, type.psychic, type.ice, type.dragon, ].includes(attack)
			break;
		case type.normal:
			return [type.ghost].includes(attack)
			break;
		case type.poison:
			return [type.fighting, type.poison, type.grass].includes(attack)
			break;
		case type.dragon:
			return [type.fire, type.water, type.grass, type.electric].includes(attack)
			break;
		case type.electric:
			return [type.flying, type.steel, type.electric].includes(attack)
			break;
		case type.dark:
			return [type.ghost, type.psychic, type.dark].includes(attack)
			break;
		case type.psychic:
			return [type.fighting, type.psychic].includes(attack)
			break;
		case type.flying:
			return [type.ground, type.bug, type.grass].includes(attack)
			break;
		case type.grass:
			return [type.ground, type.water, type.grass, type.electric].includes(attack)
			break;
	}

}
//final boss' monsters
finalBossTeam = [new pikachu, new metang, new dustox]

//levels all the final boss' monsters to 25
for (x = 0; x < finalBossTeam.length; x++) {
	finalBossTeam[x].levelUp(25)
}

//if the player is currently battling an npc
npcBattle = false

//run every tick (60 times per second)
function events() {

	//if the player has beaten all the gyms and is standing next to the final boss
	if (finalBoss.ready && playerYTile == 1 && playerXTile == 6 && currentLevel == finalLevel) {
		playerCanMove = false

		//first stage of the event
		if (!finalBoss.done[0]) {
			eventMessage("Well done, you have beaten every gym.", "Now let's see if you are worthy of the title", "of champion.")
			
			//if no buttons are being pressed
			if (!(zDown || xDown || cDown || vDown)) {
				menuReady = true
			}
			
			//if a button is pressed
			if ((zDown || xDown || cDown || vDown) && menuReady) {

				//this stage of the event is finished
				finalBoss.done[0] = true

				menuReady = false
			}
		}
		
		//if no buttons are being pressed
		if (!(zDown || xDown || cDown || vDown)) {
			menuReady = true
		}

		//second stage of the event
		if (menuReady && finalBoss.done[0] && !finalBoss.done[1]) {
			
			//load final boss battle
			npcBattle = true
			canCapture = false
			enemyMonsters = finalBossTeam
			if (!LoadBattle(currentMonsters[currentMonsterIndex], enemyMonsters[enemyMonsterIndex])) {

				//this stage of the event is finished
				finalBoss.done[1] = true
			}
		}

		//final stage of the event
		if (finalBoss.done[1]) {
			LoadLevel(playerXTile, playerYTile)
			eventRender()

			//game over
			eventMessage("Well done, you have proven yourself to be", "the strongest trainer in the world!")
		}
	}

	//final boss can only be triggered once all the gyms have been beaten
	if (gymsBeaten == numberOfGyms) {
		finalBoss.ready = true
	}

	//displays a message when the player beats the first gym, increments the gymsBeaten variable and disables the gym
	if (gym0Event.ready) {
		eventRender()

		//displays congratulations message
		eventMessage("Well done, you have beaten the first", "gym! If you beat all the others you", "can become the champion.")
		
		//if no buttons are being pressed
		if (!(zDown || xDown || cDown || vDown)) {
			menuReady = true
		}
		//if a button is pressed
		if ((zDown || xDown || cDown || vDown) && menuReady) {
			
			//increments gymsBeaten
			gymsBeaten++
			
			menuReady = false
			playerCanMove = true

			//this event is done with
			gym0Event.ready = false
		}

	}

	//exactly the same thing for the second gym
	if (gym1Event.ready) {
		eventRender()
		eventMessage("Wow, that's 2 gyms beaten now!")
		
		//if no buttons are being pressed
		if (!(zDown || xDown || cDown || vDown)) {
			menuReady = true
		}
		
		//if a button is pressed
		if ((zDown || xDown || cDown || vDown) && menuReady) {
			
			//increment gymsBeaten
			gymsBeaten++
			
			menuReady = false
			playerCanMove = true
			
			//this event is done with
			gym1Event.ready = false
		}

	}

	//iterates through every npc in the game
	for (i = 0; i <= npcs.length - 1; i++) {

		//if the player is on the same map as the npc
		if (npcs[i]["map"] == currentLevel) {

			//if the player is within a 1 tile radius of the npc, the npc hasn't already been beaten and the player isn't currently battling an npc
			if ((distanceTo(playerYTile * 16 + 7, (npcs[i]["y"] - 1) * 16 + 7, playerXTile * 16 + 7, (npcs[i]["x"] - 1) * 16 + 7)) < 23 && npcs[i]["ready"] && !npcBattle) {

				playerCanMove = false

				displayMessage("NPC battle!", null)
				
				//if a button is pressed
				if (menuReady && (zDown || xDown || cDown || vDown)) {
					menuReady = false
					npcBattle = true

				}
			}
			
			//if no button is being pressed
			if (!(zDown || xDown || cDown || vDown)) {
				menuReady = true
			}
			//if player is battling an npc
			if (npcs[i].ready && npcBattle && menuReady && distanceTo(playerYTile * 16 + 7, (npcs[i]["y"] - 1) * 16 + 7, playerXTile * 16 + 7, (npcs[i]["x"] - 1) * 16 + 7) < 23) {
				
				//loads the npc battle
				enemyMonsters = npcs[i]["team"]
				canCapture = false
				if (!LoadBattle(currentMonsters[currentMonsterIndex], enemyMonsters[enemyMonsterIndex])) {
					
					//battle is over
					playerCanMove = true
					npcBattle = false

					//if the player won the battle
					if (battleWon2 == "player") {

						//disable the npc
						npcs[i]["ready"] = false
					}
					//reset the npcs monsters for the next battle
					for (y = 0; y < npcs[i]["team"].length; y++) {
						npcs[i]["team"][y].levelUp(npcs[i].level)
					}
					canvas.height = currentLevelRows * 16
					canvas.width = currentLevelCols * 16
				}
			}
		}

	}

	//when the player's friend tells them about the gyms
	if (outsideGym.ready && currentLevel == maps[2]) {
		
		//initialize the event
		if (!outsideGym.running) {

			//sets the friend coordinates to the door of the gym
			friendXPos = 8 * 16
			friendYPos = 6 * 16

			playerCanMove = false

			//event is now running
			outsideGym.running = true

			menuReady = false
			
		//if the event is running
		} else {
			if (!outsideGym.done[0]) {
				
				//draw the map
				eventRender()
				
				//draw the friend on top
				context.drawImage(friendSprite, friendXPos, friendYPos);

				eventMessage("Hey, over here!")
				
				//if no button is being pressed
				if (!(zDown || xDown || cDown || vDown)) {
					menuReady = true
				}
				
				//if a button is being pressed
				if ((zDown || xDown || cDown || vDown) && menuReady) {

					//this stage of the event is done
					outsideGym.done[0] = true

					menuReady = false
				}
			}
			if (outsideGym.done[0] && !outsideGym.done[1]) {
				if (Math.floor(friendXPos / 16) != 4) {
					eventRender();
					context.drawImage(friendSprite, friendXPos, friendYPos);

					//moves the friend left until they are at x coordinate 4
					friendXPos--;

				} else {

					//this stage of the event is done
					outsideGym.done[1] = true
				}
			}

			//if the previous stage is done and the current stage isn't
			if (outsideGym.done[1] && !outsideGym.done[2]) {
				if (Math.floor(friendYPos / 16) != 16) {
					eventRender();
					context.drawImage(friendSprite, friendXPos, friendYPos);

					//moves the friend down until they are at y coordinate 16
					friendYPos++;

				} else {
					//this stage of the event is done
					outsideGym.done[2] = true
				}
			}

			//if the previous stage is done and the current stage isn't
			if (outsideGym.done[2] && !outsideGym.done[3]) {
				
				//draws the map
				eventRender()
				
				//draws the friend on top of the map
				context.drawImage(friendSprite, friendXPos, friendYPos);
				
				eventMessage("I just beat the gym, it wasn't even that hard.", "I'm going to beat every gym and become", "the best trainer in the world, just you wait!")
				
				//if no button is being pressed
				if (!(zDown || xDown || cDown || vDown)) {
					menuReady = true
				}
				
				//if a button is pressed
				if ((zDown || xDown || cDown || vDown) && menuReady) {

					//this stage of the event is done
					outsideGym.done[3] = true
					menuReady = false
				}
			}

			//if the previous stage is done and the current stage isn't
			if (outsideGym.done[3] && !outsideGym.done[4]) {
				if (Math.floor(friendYPos / 16) != 0) {
					
					//draws the map
					eventRender();
					
					//draws the friend on top
					context.drawImage(friendSprite, friendXPos, friendYPos);

					//moves the friend up until they are at y coordinate 0
					friendYPos--;
					
				} else {
					//event is over
					playerCanMove = true
					outsideGym.running = false
					outsideGym.ready = false
				}
			}
		}

	}
	
	//when the friend shows the player how to capture monsters
	if (firstCapture.ready && currentLevel == town0) {
		
		//initialize the event
		if (!firstCapture.running) {
			playerCanMove = false
			
			//draw the map
			eventRender()

			//places the friend just outside the house
			friendXTile = 4
			friendYTile = 15
			friendXPos = friendXTile * 16
			friendYPos = friendYTile * 16
			
			//draws the friend on top
			context.drawImage(friendSprite, friendXPos, friendYPos);

			firstCapture.running = true;
			tutorialCapture = true
		}

		//if firstCapture is running
		else {
			if (Math.floor(friendXPos / 16) != 7) {
				eventRender();
				context.drawImage(friendSprite, friendXPos, friendYPos);

				//moves the player right until they are at x coordinate 7
				friendXPos++;
			} else {
				//this stage of the event is done
				firstCapture.done[0] = true
			}

			//if the previous stage is done and the current stage isn't
			if (firstCapture.done[0] && !firstCapture.done[1])
				if (Math.floor(friendYPos / 16) != 7) {
					eventRender();
					context.drawImage(friendSprite, friendXPos, friendYPos);
					
					//moves the friend up until their y coordinate is 7
					friendYPos--;
				}
			else {
				//this stage of the event is done
				firstCapture.done[1] = true
			}

			//if the previous stage is done and the current stage isn't
			if (firstCapture.done[1] && !firstCapture.done[2]) {
				eventMessage("Here, I'll show you how to", "capture monsters.")
				
				//if a button is pressed
				if (zDown || xDown || cDown || vDown) {
					menuReady = false

					//this stage of the event is done
					firstCapture.done[2] = true

					canCapture = true

					//sets the enemy monster to a goldeen
					enemyMonsters = [wildMonsters[levelIndex][0]]

					//levels the goldeen up to the correct difficulty for this map
					enemyMonsters[0].levelUp(levelDifficulty[levelIndex])
				}
			}

			//if the previous stage is done and the current stage isn't
			if (firstCapture.done[2] && !firstCapture.done[3]) {
				//load battle
				if (!LoadBattle(currentMonsters[currentMonsterIndex], enemyMonsters[enemyMonsterIndex])) {

					//this stage of the event is done
					firstCapture["done"][3] = true

					menuReady = false
					
					//make canvas fit the map
					canvas.height = currentLevelRows * 16
					canvas.width = currentLevelCols * 16
				}
			}

			//if the previous stage is done and the current stage isn't
			if (firstCapture.done[3] && !firstCapture.done[4]) {
				eventRender()
				eventMessage("Well done, it's best to lower a", "monster's HP or give it a status ", "effect before trying to capture it.")
				
				//if no button is being pressed
				if (!(zDown || xDown || cDown || vDown)) {
					menuReady = true
				}
				
				//if a button is pressed
				if ((zDown || xDown || cDown || vDown) && menuReady) {

					//this stage of the event is done
					firstCapture.done[4] = true

					menuReady = false
				}
			}

			//if the previous stage is done and the current stage isn't
			if (firstCapture.done[4] && !firstCapture.done[5]) {
				eventRender()
				eventMessage("OK, I'm off to the next town to", "challenge the gym.", "Here's some capsules to get you started.")
				context.fillText("", 5, canvas.height - 2)
				
				//if no button is pressed
				if (!(zDown || xDown || cDown || vDown)) {
					menuReady = true
				}
				
				//if a button is pressed
				if ((zDown || xDown || cDown || vDown) && menuReady) {
					
					//this stage of the event is done
					firstCapture.done[5] = true
				}
			}
			if (firstCapture.done[5] && !firstCapture.done[6]) {
				if (Math.floor(friendYPos / 16) != 0) {
					eventRender();
					context.drawImage(friendSprite, friendXPos, friendYPos);
					
					//moves the friend up until their y coordinate is 0
					friendYPos--;
					
				} else {
					
					//end the event
					playerCanMove = true
					tutorialCapture = false
					firstCapture.running = false
					firstCapture.ready = false
				}
			}
		}
	}

	//tutorial battle
	if (firstBattle.ready && currentLevel == house0) {

		if (!firstBattle.running) {
			playerCanMove = false

			//sets the friend's coordinates to the entrance of the house
			friendXTile = 4
			friendYTile = 8
			friendXPos = friendXTile * 16
			friendYPos = friendYTile * 16

			firstBattle.running = true;
			tutorial = true
		} else {
			friendXTile = Math.round(friendXPos / 16)
			friendYTile = Math.round(friendYPos / 16)
			if (Math.floor(friendYPos / 16) != 6 - 1 && !firstBattle.done[0]) {
				eventRender();
				context.drawImage(friendSprite, friendXPos, friendYPos);

				//moves the friend up until they are at y coordinate 5
				friendYPos -= 1;

			} else {

				//this stage of the event is done
				firstBattle.done[0] = true
			}


			if (Math.floor(friendXPos / 16) != 2 - 1 && !firstBattle.done[1] && firstBattle.done[0]) {

				eventRender();
				context.drawImage(friendSprite, friendXPos, friendYPos);

				//moves the friend left until their x coordinate is 1
				friendXPos -= 1;

			} else {
				if (firstBattle.done[0]) {
					firstBattle.done[1] = true
				}
			}

			if (firstBattle.done[1] && firstBattle.done[0] && !firstBattle.done[2]) {
				eventMessage("Let's see who's stronger")
				
				//if a button is pressed
				if (zDown || xDown || cDown || vDown) {
					menuReady = false
					
					//this stage of the event is done
					firstBattle.done[2] = true
				}
			}
			if (firstBattle.done[0] && firstBattle.done[1] && firstBattle.done[2] && !firstBattle.done[3]) {
				canCapture = false
				if (!LoadBattle(currentMonsters[currentMonsterIndex], enemyMonsters[enemyMonsterIndex])) {
					
					//this stage of the event is done
					firstBattle["done"][3] = true
					
					menuReady = false
				}
			}
			if (firstBattle.done[0] && firstBattle.done[1] && firstBattle.done[2] && firstBattle.done[3] && !firstBattle.done[4]) {
				LoadLevel()
				eventRender()
				eventMessage("Wow you won!", "I'm going to improve my team!")
				
				//if no button is being pressed
				if (!(zDown || xDown || cDown || vDown)) {
					menuReady = true
				}
				
				//if a button is pressed
				if ((zDown || xDown || cDown || vDown) && menuReady) {
					
					//this stage of the event is done
					firstBattle["done"][4] = true
				}

			}
			if (firstBattle.done[4] && !firstBattle.done[5]) {
				if (Math.floor(friendXPos / 16) != 4) {
					eventRender();
					context.drawImage(friendSprite, friendXPos, friendYPos);
					
					//moves the friend right until their x coordinate is 4
					friendXPos++
				} else {
					
					//this stage of the event is done
					firstBattle.done[5] = true
				}
			}
			if (firstBattle.done[5]) {
				if (Math.floor(friendYPos / 16) != 8) {
					eventRender();
					context.drawImage(friendSprite, friendXPos, friendYPos);
					
					//moves the friend down until their y coordinate is 8
					friendYPos++
				} else {
					
					//end the event
					firstBattle.ready = false
					firstBattle.running = false
					playerCanMove = true
					tutorial = false
				}
			}
		}


	} //end of introduction battle

	//hospital
	if (currentLevel == maps[3] && healing["running"] == false) {

		//if the player is on the healing tile
		if (playerXTile == 5 && playerYTile == 2) {
			eventRender()
			healing["running"] = true
			menuReady = false
		}
	}
	if (healing["running"]) {
		playerCanMove = false
		displayMessage("Let me heal your monsters", "for you.", null)
		
		//heal all monsters to max hp and remove all effects
		currentMonsters.forEach(function(monster) {
			monster["hp"] = monster.maxhp
			monster["effect"] = null
		})

		//if no controls are being pressed
		if (!(zDown || xDown || cDown || vDown)) {
			menuReady = true
		}
		
		//if a button is pressed
		if (menuReady && (zDown || xDown || cDown || vDown)) {
			playerCanMove = true
			healing["running"] = false
			
			//move the player off the healing tile to avoid an endless loop
			playerYPos = 3 * 16
			
			menuReady = true
		}


	}
	
	//shop
	if (currentLevel == maps[4] && shopping["running"] == false) {

		//if the player is standing on the tile by the desk
		if (playerXTile == 2 && playerYTile == 2) {
			shopping["running"] = true
			menuReady = false
		}
	}
	if (shopping["running"]) {
		playerCanMove = false
		//LoadShop() returns true when the player wants to exit the shop
		if (LoadShop()) {
			playerCanMove = true
			LoadLevel()
			shopping["running"] = false
		}


	} //end of shop
}
currentSelection = 0

function LoadShop() {
	canvas.width = 200
	canvas.height = 300
	context.strokeStyle = "#000000"
	context.fillStyle = "#000000"
	context.rect(0, 0, canvas.width, canvas.height)
	context.stroke()
	
	//draws the players money at the top right
	context.fillText("£" + playerMoney, 160, 10)
	
	//first item is drawn at x=10 y=20
	xOffset = 10
	yOffset = 20
	newRow = true
	
	for (x = 0; x < shopItems.length; x++) {
		
		//draws the currently selected item in blue, the rest in black
		if (x == currentSelection) {
			context.fillStyle = "#0000FF"
		} else {
			context.fillStyle = "#000000"
		}
		
		
		context.rect(xOffset, yOffset, 80, 40)
		context.stroke()
		context.fillText(shopItems[x]["name"], xOffset + 5, yOffset + 10)
		context.fillText("Strength: " + shopItems[x]["strength"], xOffset + 5, yOffset + 20)
		context.fillText("Price: " + "5", xOffset + 5, yOffset + 30)
		xOffset += 100
		
		//every other item needs to be drawn on a new line as there are 2 items per line
		newRow = !newRow
		if (newRow) {
			
			//if a new row is being drawn then x is moved left back to 10 and y is moved down by 50
			xOffset = 10
			yOffset += 50
			
		}
	}
	if ((zDown || xDown || cDown || vDown) && menuReady) {
		if (playerMoney >= 5) {
			menuReady = false
			playerMoney -= 5
			
			//adds the bought item to the player's inventory
			currentItems.push(shopItems[currentSelection])
		}
	}
	
	//changes the selected item based on wasd
	if (wDown && menuReady) {
		menuReady = false
		currentSelection -= 2
		
		//if the player tries to select an item less than the 1st item
		//eg the "0th" or "-1st" item then set the selection back to the 1st item
		//to avoid an undefined error
		if (currentSelection < 0) {
			currentSelection = 0
		}
	}
	
	if (aDown && menuReady) {
		menuReady = false
		currentSelection -= 1
		//if the player tries to select an item less than the 1st item
		//eg the "0th" or "-1st" item then set the selection back to the 1st item
		//to avoid an undefined error
		if (currentSelection < 0) {
			currentSelection = 0
		}
	}
	if (sDown && menuReady) {
		menuReady = false
		currentSelection += 2
		
		//if the player tries to go past the x number of items in the shop
		//e.g. if there are 4 items in the shop and the player tried to select the 5th
		//sets the selection back to the last item in the array to avoid an undefined error
		if (currentSelection > x - 1) {
			currentSelection = x - 1
		}
	}
	if (dDown && menuReady) {
		menuReady = false
		currentSelection += 1
		
		//if the player tries to go past the x number of items in the shop
		//e.g. if there are 4 items in the shop and the player tried to select the 5th
		//sets the selection back to the last item in the array to avoid an undefined error
		if (currentSelection > x - 1) {
			currentSelection = x - 1
		}
	}
	if (!(wDown || aDown || sDown || dDown || zDown || xDown || cDown || vDown)) {
		menuReady = true
	}
	if (escDown && menuReady) {
		return true
	}
}

function eventRender() {
	for (y = 0; y < currentLevelRows; y++) {
		for (x = 0; x < currentLevelCols; x++) {
			context.drawImage(sprites[currentLevel.background], x * 16, y * 16)
		}
	}
	for (y = 0; y < currentLevelRows; y++) {
		for (x = 0; x < currentLevelCols; x++) {
			if (currentLevel.tiles[y][x].constructor != Array) {
				context.drawImage(sprites[currentLevel.tiles[y][x]], x * 16, y * 16)
			} else {
				context.drawImage(sprites[currentLevel.tiles[y][x][1]], x * 16, y * 16)
				context.drawImage(sprites[currentLevel.tiles[y][x][0]], x * 16, y * 16)
			}
		}
	}
	//animates long grass sprite if the player is standing on one
	//1 is the index for the long grass sprite
	if (currentLevel.tiles[playerYTile][playerXTile] == 1) {
		//alternates between slightly different sprites to appear to be moving
		if (currentGrassSprite == longGrass2Sprite) {
			//changes every 7/60 of a second
			//game is run at 60fps so one tick is 1/60 of a second
			if (tickCounter % 7 == 0) {
				currentGrassSprite = longGrass3Sprite
				context.drawImage(longGrass3Sprite, Math.round((playerXPos) / 16) * 16, Math.round((playerYPos) / 16) * 16)
			}
		} else {
			if (tickCounter % 7 == 0) {
				currentGrassSprite = longGrass2Sprite
				context.drawImage(longGrass2Sprite, Math.round((playerXPos) / 16) * 16, Math.round((playerYPos) / 16) * 16)
			}
		}
	}
	//draws the player on top of everything
	context.drawImage(playerSprite, playerXPos, playerYPos);
}