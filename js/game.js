$(document).ready(function() {
	
	//everything is drawn onto a html canvas
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	//used to make sure there are 2 seconds between wild battles
	lastWildBattle = Date.now()

	//used in animating grass sprites
	tickCounter = 0

	//used in menus when holding buttons across ticks was causing problems
	menuReady = false

	//where the player needs to spawn when they leave a building
	outsideLocation = [0, 0]

	maps = {
		0: house0,
		1: town0,
		2: town1,
		3: hospital,
		4: shop,
		5: route0,
		6: town2,
		7: gym0,
		8: gym1,
		9: route1,
		10: finalLevel
	}
	//players spawns in house0, the map at index 0
	currentLevel = maps[0];
	levelIndex = 0

	//last level the user was in that was outside
	outsideIndex = 1

	//initializes the spawn level
	LoadLevel();

	playerCanMove = true



	//monsters that the player spawns with
	currentMonsters = [new pikachu, new bulbasaur, new charmander]

	//all the player's monsters must be level 15 when the game starts
	for (x = 0; x < currentMonsters.length; x++) {
		currentMonsters[x].levelUp(15)
	}

	//monsters that the player's friend will have in the tutorial
	enemyMonsters = [new charmander]
	for (x = 0; x < enemyMonsters.length; x++) {
		enemyMonsters[x].levelUp(10) //each of their monsters must be level 10
	}

	//monsters that can spawn in the long grass of each level
	wildMonsters = {
		1: [new goldeen, new machop, new bulbasaur, new metang, new sandslash],
		5: [new charmander, new staravia, new muk, new dustox],
		9: [new goldeen, new bulbasaur, new metang, new staravia, new muk]
	}

	//level of monsters that spawn in long grass for each level
	levelDifficulty = {
		1: 8,
		5: 14,
		9: 22
	}

	//type enumerator
	type = {
		normal: "normal",
		fighting: "fighting",
		flying: "flying",
		poison: "poison",
		ground: "ground",
		rock: "rock",
		bug: "bug",
		ghost: "ghost",
		steel: "steel",
		fire: "fire",
		water: "water",
		grass: "grass",
		electric: "electric",
		psychic: "psychic",
		ice: "ice",
		dragon: "dragon",
		dark: "dark"
	}

	//used to buy items
	playerMoney = 50

	//player inventory, items can be used during battle
	currentItems = [{
			name: "Capsule",
			"effect": "capture",
			"strength": 10,
			"price": 4
		}, {
			name: "Capsule",
			"effect": "capture",
			"strength": 10,
			"price": 4
		},
		{
			name: "Capsule",
			"effect": "capture",
			"strength": 10,
			"price": 4
		}, {
			name: "Capsule",
			"effect": "capture",
			"strength": 10,
			"price": 4
		}
	]

	//items in the shop
	shopItems = [{
			name: "HP Potion",
			"effect": "hpRestore",
			"strength": 10,
			"price": 2
		}, {
			name: "Capsule",
			"effect": "capture",
			"strength": 10,
			"price": 4
		},
		{
			name: "HP Potion",
			"effect": "hpRestore",
			"strength": 20,
			"price": 3
		}, {
			name: "Capsule",
			"effect": "capture",
			"strength": 20,
			"price": 6
		}
	]

	//every 16x16 sprite in the game assigned to a number to make map designing easier
	sprites = {
		0: grassSprite,
		1: longGrassSprite,
		2: bushSprite,
		3: treeTopSprite,
		4: treeMiddleSprite,
		5: treeBottomSprite,
		6: lampTopLeftSprite,
		7: lampMiddleLeftSprite,
		8: lampBottomLeftSprite,
		9: lampTopRightSprite,
		10: lampMiddleRightSprite,
		11: lampBottomRightSprite,
		12: flowerSprite,
		13: woodFenceBottomLeftSprite,
		14: woodFenceMiddleLeftSprite,
		15: woodFenceTopLeftSprite,
		16: woodFenceTopRightSprite,
		17: woodFenceTopSprite,
		18: woodFenceMiddleRightSprite,
		19: woodFenceBottomRightSprite,
		20: waterTopLeftSprite,
		21: waterMiddleLeftSprite,
		22: waterBottomLeftSprite,
		23: house00Sprite,
		24: house01Sprite,
		25: house02Sprite,
		26: house03Sprite,
		27: house04Sprite,
		28: house05Sprite,
		29: house06Sprite,
		30: house07Sprite,
		31: house08Sprite,
		32: house09Sprite,
		33: house010Sprite,
		34: house011Sprite,
		35: house012Sprite,
		36: house013Sprite,
		37: house014Sprite,
		38: house015Sprite,
		39: house016Sprite,
		40: house017Sprite,
		41: house018Sprite,
		42: house019Sprite,
		43: house020Sprite,
		44: house021Sprite,
		45: house022Sprite,
		46: house023Sprite,
		47: house024Sprite,
		48: waterBottomRightSprite,
		49: waterMiddleRightSprite,
		50: waterBottomMiddleSprite,
		51: waterSprite,
		52: waterTopSprite,
		53: waterTopRightSprite,
		55: woodFloorSprite,
		56: woodWallBottomLeftSprite,
		57: woodWallBottomMiddleSprite,
		58: woodWallBottomRightSprite,
		59: woodWallTopLeftSprite,
		60: woodWallTopMiddleSprite,
		61: woodWallTopRightSprite,
		62: redRug1Sprite,
		63: redRug2Sprite,
		64: woodTable1Sprite,
		65: woodTable2Sprite,
		66: woodTable3Sprite,
		67: woodTable4Sprite,
		68: woodTable5Sprite,
		69: woodTable6Sprite,
		70: curtain1Sprite,
		71: curtain2Sprite,
		72: curtain3Sprite,
		73: curtain4Sprite,
		74: tv1Sprite,
		75: tv2Sprite,
		76: tv3Sprite,
		77: tv4Sprite,
		78: blueStoolSprite,
		79: blueCushionSprite,
		80: blueRug1Sprite,
		81: blueRug2Sprite,
		82: blueRug3Sprite,
		83: blueRug4Sprite,
		84: blueRug5Sprite,
		85: blueRug6Sprite,
		86: blueRug7Sprite,
		87: blueRug8Sprite,
		88: blueRug9Sprite,
		89: friendSprite,
		90: path0MiddleSprite,
		91: path0TopMiddleSprite,
		92: path0TopRightSprite,
		93: longGrass2Sprite,
		94: longGrass3Sprite,
		95: path0BottomRightSprite,
		96: path0MiddleRightSprite,
		97: playerSprite,
		98: path0BottomLeftSprite,
		99: path0BottomMiddleSprite,
		100: path0MiddleLeftSprite,
		101: path0TopLeftSprite,
		102: ThumbSprite,
		103: shop0Sprite,
		104: shop1Sprite,
		105: shop10Sprite,
		106: shop11Sprite,
		107: shop12Sprite,
		108: shop13Sprite,
		109: shop14Sprite,
		110: shop15Sprite,
		111: shop16Sprite,
		112: shop17Sprite,
		113: shop2Sprite,
		114: shop3Sprite,
		115: shop4Sprite,
		116: shop5Sprite,
		117: shop6Sprite,
		118: shop7Sprite,
		119: shop8Sprite,
		120: shop9Sprite,
		121: shop18Sprite,
		122: shop19Sprite,
		123: shop20Sprite,
		124: shop21Sprite,
		125: shop22Sprite,
		126: shop23Sprite,
		127: shop24Sprite,
		128: path0LeftDownSprite,
		129: path0LeftUpSprite,
		130: path0RightDownSprite,
		131: path0RightUpSprite,
		132: hospital0Sprite,
		133: hospital1Sprite,
		134: hospital10Sprite,
		135: hospital11Sprite,
		136: hospital12Sprite,
		137: hospital13Sprite,
		138: hospital14Sprite,
		139: hospital15Sprite,
		140: hospital16Sprite,
		141: hospital17Sprite,
		142: hospital18Sprite,
		143: hospital19Sprite,
		144: hospital2Sprite,
		145: hospital20Sprite,
		146: hospital21Sprite,
		147: hospital22Sprite,
		148: hospital23Sprite,
		149: hospital24Sprite,
		150: hospital25Sprite,
		151: hospital26Sprite,
		152: hospital27Sprite,
		153: hospital28Sprite,
		154: hospital29Sprite,
		155: hospital3Sprite,
		156: hospital4Sprite,
		157: hospital5Sprite,
		158: hospital6Sprite,
		159: hospital7Sprite,
		160: hospital8Sprite,
		161: hospital9Sprite,
		162: gym00Sprite,
		163: gym01Sprite,
		164: gym010Sprite,
		165: gym011Sprite,
		166: gym012Sprite,
		167: gym013Sprite,
		168: gym014Sprite,
		169: gym015Sprite,
		170: gym016Sprite,
		171: gym017Sprite,
		172: gym018Sprite,
		173: gym019Sprite,
		174: gym02Sprite,
		175: gym020Sprite,
		176: gym021Sprite,
		177: gym022Sprite,
		178: gym023Sprite,
		179: gym024Sprite,
		180: gym025Sprite,
		181: gym026Sprite,
		182: gym027Sprite,
		183: gym028Sprite,
		184: gym029Sprite,
		185: gym03Sprite,
		186: gym030Sprite,
		187: gym031Sprite,
		188: gym032Sprite,
		189: gym033Sprite,
		190: gym034Sprite,
		191: gym035Sprite,
		192: gym04Sprite,
		193: gym05Sprite,
		194: gym06Sprite,
		195: gym07Sprite,
		196: gym08Sprite,
		197: gym09Sprite,
		198: hospitalDesk0Sprite,
		199: hospitalDesk1Sprite,
		200: hospitalDesk10Sprite,
		201: hospitalDesk11Sprite,
		202: hospitalDesk2Sprite,
		203: hospitalDesk3Sprite,
		204: hospitalDesk4Sprite,
		205: hospitalDesk5Sprite,
		206: hospitalDesk6Sprite,
		207: hospitalDesk7Sprite,
		208: hospitalDesk8Sprite,
		209: hospitalDesk9Sprite,
		210: potPlant0Sprite,
		211: potPlant1Sprite,
		212: healer0Sprite,
		213: healer1Sprite,
		214: healer2Sprite,
		215: healer3Sprite,
		216: nurseSprite,
		217: triggerMatSprite,
		218: npcSprite,
		220: rockBottomLeftSprite,
		221: rockBottomMiddleSprite,
		222: rockMiddleSprite,
		223: rockMiddleLeftSprite,
		224: rockMiddleRightSprite,
		225: rockStairsSprite,
		226: rockTopLeftSprite,
		227: rockTopMiddleSprite,
		228: rockTopRightSprite,
		229: rockBottomRightSprite,
		230: rockInsideTopLeftSprite,
		231: rockInsideTopRightSprite,
		232: finalStairs0Sprite,
		233: finalStairs1Sprite,
		234: finalStairs10Sprite,
		235: finalStairs11Sprite,
		236: finalStairs12Sprite,
		237: finalStairs13Sprite,
		238: finalStairs14Sprite,
		239: finalStairs15Sprite,
		240: finalStairs16Sprite,
		241: finalStairs17Sprite,
		242: finalStairs18Sprite,
		243: finalStairs19Sprite,
		244: finalStairs2Sprite,
		245: finalStairs20Sprite,
		246: finalStairs21Sprite,
		247: finalStairs22Sprite,
		248: finalStairs23Sprite,
		249: finalStairs24Sprite,
		250: finalStairs25Sprite,
		251: finalStairs26Sprite,
		252: finalStairs27Sprite,
		253: finalStairs28Sprite,
		254: finalStairs29Sprite,
		255: finalStairs3Sprite,
		256: finalStairs4Sprite,
		257: finalStairs5Sprite,
		258: finalStairs6Sprite,
		259: finalStairs7Sprite,
		260: finalStairs8Sprite,
		261: finalStairs9Sprite,
		262: finalFloorSprite,
		263: statue0Sprite,
		264: statue1Sprite
	}

	//sprites that the player can walk through, grass, floor, etc.				
	nocollision = [0, 1, 44, 39, 55, 62, 63, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 78, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100, 101, 128, 129, 130, 131, 125, 124, 152, 188, 189, 200, 201, 209, 222, 225, 233, 244, 255, 258, 259, 260, 235, 236, 237, 240, 241, 242, 246, 247, 248, 251, 252, 253, 262]

	//every non playable character in the game, besides gyms and the final boss
	npcs = [{
			map: maps[2],
			x: 5,
			y: 8,
			ready: true,
			level: 11,
			team: [new bulbasaur, new bayleef]
		},
		{
			map: maps[5],
			x: 9,
			y: 9,
			ready: true,
			level: 15,
			team: [new onix, new geodude]
		},
		{
			map: maps[5],
			x: 10,
			y: 4,
			ready: true,
			level: 15,
			team: [new dustox, new sandslash]
		}, 
		{
			map: maps[9],
			x: 5,
			y: 6,
			ready: true,
			level: 22,
			team: [new charmander, new metang, new bayleef]
		}
	]

	//levels every npc's monster to the appropriate level
	for (x = 0; x < npcs.length; x++) {
		for (y = 0; y < npcs[x]["team"].length; y++) {
			npcs[x]["team"][y].levelUp(npcs[x].level)
		}
	}

	//booleans for each key that the game uses
	wDown = false;
	aDown = false;
	sDown = false;
	dDown = false;
	zDown = false;
	xDown = false;
	cDown = false;
	vDown = false
	escDown = false
	leftArrowDown = false
	rightArrowDown = false

	//reads the keycode of any button that is pressed down and sets corresponding boolean to true
	document.addEventListener("keydown", function(key) {
		switch (key.keyCode) {
			case 87:
				wDown = true;
				break;
			case 65:
				aDown = true;
				break;
			case 83:
				sDown = true;
				break;
			case 68:
				dDown = true;
				break;
			case 90:
				zDown = true;
				break;
			case 88:
				xDown = true;
				break;
			case 67:
				cDown = true;
				break;
			case 86:
				vDown = true;
				break;
			case 27:
				escDown = true;
				break;
			case 188:
				leftArrowDown = true;
				break;
			case 190:
				rightArrowDown = true
				break;
		}
	});

	//reads the keycode of any button that is released and sets corresponding boolean to false
	document.addEventListener("keyup", function(key) {
		switch (key.keyCode) {
			case 87:
				wDown = false;
				break;
			case 65:
				aDown = false;
				break;
			case 83:
				sDown = false;
				break;
			case 68:
				dDown = false;
				break;
			case 90:
				zDown = false;
				break;
			case 88:
				xDown = false;
				break;
			case 67:
				cDown = false;
				break;
			case 86:
				vDown = false;
				break;
			case 27:
				escDown = false;
				break;
			case 188:
				leftArrowDown = false;
				break;
			case 190:
				rightArrowDown = false;
				break;
		}
	});

	//adjusts the game to fit a new map and places the player in a custom place if necessary
	function LoadLevel(x, y) {
		//PARAMETERS
		//x is the x coordinate that the player needs to be placed at
		//y is the y coordinate that the player needs to be placed at
		//VARIABLES
		//playerCol is the x coordinate that the player will be placed at
		//playerRow is the y coordinate that the player will be placed at
		//playerXTile performs the same function as playerRow, not actually necessary
		//playerYTile performs the same function as playerCol, not actually necessary
		//playerXPos is the player's x coordinate in terms of the canvas, each tile is 16x16 so playerXTile is * 16
		//playerYPos is the player's y coordinate in terms of the canvas, each tile is 16x16 so playerYTile is * 16
		//currentLevelCols is the number of columns in the current level, used to iterate through the map later on
		//currentLevelRows is the number of rows in the current level, used to iterate through the map later on
		
		//if no custom spawn coordinates are specified
		if (!x || !y) {
			
			//place the player on the spawn point of the new level
			playerCol = currentLevel.spawnPoint[0];
			playerRow = currentLevel.spawnPoint[1];
			
			//adjust player position variables accordingly
			playerXTile = playerRow
			playerYTile = playerCol
			playerXPos = playerCol * 16
			playerYPos = playerRow * 16
	
		//if custom coordinates are specified
		} else {
			//place the player on these custom coordinates
			playerXTile = x
			playerYTile = y
			
			//adjust player position variables accordingly
			playerXPos = playerXTile * 16
			playerYPos = playerYTile * 16
		}
		
		//adjust map size variables
		currentLevelCols = currentLevel.tiles[0].length;
		currentLevelRows = currentLevel.tiles.length
		
		//adjusts canvas to fit the map
		canvas.height = currentLevelRows * 16
		canvas.width = currentLevelCols * 16
	}

	//used in long grass animation
	currentGrassSprite = null

	function render() {
		
		//only draws if no events are running
		if (playerCanMove) {
			
			//iterates through the current map
			for (y = 0; y < currentLevelRows; y++) {
				for (x = 0; x < currentLevelCols; x++) {
					
					//draws the background of the map as some sprites have transparency
					context.drawImage(sprites[currentLevel.background], x * 16, y * 16)
				}
			}
			
			for (y = 0; y < currentLevelRows; y++) {
				for (x = 0; x < currentLevelCols; x++) {
					//i used arrays to represent tiles that need their own specific background
					if (currentLevel.tiles[y][x].constructor != Array) {
						context.drawImage(sprites[currentLevel.tiles[y][x]], x * 16, y * 16)
					} else {
						//index one is the special background
						context.drawImage(sprites[currentLevel.tiles[y][x][1]], x * 16, y * 16)
						//index zero is the foreground sprite, drawn on top of the background
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

	}
	//whether developer tools need to be available or not, used in testing and debugging
	devMode = false

	function update() {

		//used for animating long grass sprites
		tickCounter++;

		//resets tickCounter every 60 ticks
		if (tickCounter == 61) {
			tickCounter = 1
		}
		//if dev tools need to be drawn
		if (devMode) {
			
			//clears html div
			$("#devTools").empty()
			
			//create new text object with jquery
			var devTool = $("<p/>")
			
				//set the text content
				.html("playerXTile " + playerXTile);
				
			//add to the array of developer tools
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("playerYTile " + playerYTile);
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("menuReady " + menuReady);
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("monsterFound " + monsterFound);
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("currentBattleMenu " + currentBattleMenu);
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("canCapture " + canCapture);
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("outsideLocation " + outsideLocation);
			$("#devTools").append(devTool)

			var devTool = $("<p/>")
				.html("gymsBeaten" + gymsBeaten);
			$("#devTools").append(devTool)
		}

		//draws info about all the player's monsters
		monsterPanel()

		//property of map variable containing exit locations, iterates through each exit
		currentLevel.points.forEach(function(point) {
			
			//if the player is on an exit point
			//index 0 and 1 are the coordinates of the ecit point
			if (playerXTile == point[1] && playerYTile == point[0]) {
				
				//if the player is going outside
				//index 2 is the new map that needs to load
				if (point[2] == "outside") {

					//clear the current map
					context.clearRect(0, 0, canvas.width, canvas.height)
					
					//set the new map to the last outside map the player was on (outsideIndex is set in the next part of this function)
					currentLevel = maps[outsideIndex];
					levelIndex = outsideIndex

					//load the new map
					LoadLevel(outsideLocation[1], outsideLocation[0]);
					
				//if the player is not going outside
				} else {

					//clear the current map
					context.clearRect(0, 0, canvas.width, canvas.height)

					//custom tile for the player to be placed on
					x = point[3]
					y = point[4]
					
					//set the new map to the one specified by the exit point
					currentLevel = maps[point[2]];
					levelIndex = point[2]
					
					//specifies where the player needs to spawn when they next go outside
					//set adjacent to the location of the exit point, so for example if the player goes inside through a door,
					//when they go back outside they will be placed right outside that door
					outsideLocation = [point[0] + 1, point[1]]

					//if the player is not going inside
					if (![3, 4, 7, 8].includes(point[2])) {

						//set the current outside level to the level that the player is entering
						outsideIndex = point[2]
					}

					//load the new map
					LoadLevel(x, y);
				}
			}
		})

		//the coordinates of the tile that the player is currently on
		playerXTile = Math.round(playerXPos / 16);
		playerYTile = Math.round(playerYPos / 16);

		//runs the code to handle gyms
		gymsLoop();

		//loads events such as npc battles, hospital healing, etc.
		events();

		//moves the player if a movement button (wasd) is pressed and the player is able to go in the desired direction
		//run 60 times a second
		if (playerCanMove) {
			if (wDown && (nocollision.includes(currentLevel.tiles[Math.floor((playerYPos / 16))][playerXTile]) || nocollision.includes(currentLevel.tiles[Math.floor((playerYPos / 16))][playerXTile][0]))) {
				//moves the player up by 1/16 of a tile
				playerYPos -= 1;
			} else {
				if (aDown && (nocollision.includes(currentLevel.tiles[playerYTile][Math.floor((playerXPos / 16))]) || nocollision.includes(currentLevel.tiles[playerYTile][Math.floor((playerXPos / 16))][0]))) {
					//moves the player left by 1/16 of a tile
					playerXPos -= 1;
				} else {
					if (sDown && (nocollision.includes(currentLevel.tiles[Math.floor((playerYPos / 16) + 1)][playerXTile]) || nocollision.includes(currentLevel.tiles[Math.floor((playerYPos / 16) + 1)][playerXTile][0]))) {
						//moves the player down by 1/16 of a tile
						playerYPos += 1;
					} else {
						if (dDown && (nocollision.includes(currentLevel.tiles[playerYTile][Math.floor((playerXPos / 16) + 1)]) || nocollision.includes(currentLevel.tiles[playerYTile][Math.floor((playerXPos / 16) + 1)][0]))) {
							//moves the player right by 1/16 of a tile
							playerXPos += 1
						}
					}
				}
			}
		}

		//wild monster battles
		//if player is standing on a long grass tile
		if (currentLevel.tiles[playerYTile][playerXTile] == 1) {

			//set to false when the player is in a battle
			if (playerCanMove) {
				trigger = Math.floor(Math.random() * 100) // 1% chance per tick (60th of a second) that a wild monster battle will be triggered

				//must be a 2 second grace period after a battle ends
				if (trigger == 0 && Date.now() - lastWildBattle > 2000) {

					//random monster from the possible ones for this level
					index = Math.floor(Math.random() * wildMonsters[levelIndex].length)

					//so no more battles will load until this one is done
					playerCanMove = false

					//sets the enemy to the randomly chosen monster 
					enemyMonsters = [wildMonsters[levelIndex][index]]

					//levels them up according to the difficulty of the current level
					enemyMonsters[0].levelUp(levelDifficulty[levelIndex])
				}
			} else {
				//wild battle so the player is allowed to capture the monster
				canCapture = true

				//load the wild monster battle
				if (!LoadBattle(currentMonsters[currentMonsterIndex], enemyMonsters[enemyMonsterIndex])) {

					//player can move again
					playerCanMove = true

					//resets the canvas to fit the current level
					canvas.height = currentLevelRows * 16
					canvas.width = currentLevelCols * 16

					//2 seconds must pass from this point for another battle to be triggered
					lastWildBattle = Date.now()
				}
			}
		}

		//draws the map
		render();

	}
	//game loop runs every 60th of a second (60 frames per second)
	setInterval(update, 1000 / 60)

});