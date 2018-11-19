hit = ""
effect = ""
enemyMoved = false
enemyDied = false
battleWon = null
monsterFound = false
battleWon2 = null
canRun = true
xpModifier = 150

//first battle when the friend comes into the spawn house
function Tutorial(){
	context.fillStyle = "#FF0000"
	switch (currentBattleMenu){
		case "main":
			context.fillText("Press Z to attack", 10, 55)
		break;
		case "attack":
			context.fillText("Press Z to use "+currentMonsters[currentMonsterIndex].attacks[1].name, 10, 55)
		break;
	}
}

//second battle when the friends shows the player how to capture monsters
function CaptureTutorial(){
	
	//red text
	context.fillStyle = "#FF0000"
	switch (currentBattleMenu){
		case "main":
			context.fillText("Press X to use an item", 10, 55)
			break;
		case "item":
			context.fillText("Press Z to use a capsule",10,55)
			break;
	}
}
function LoadBattle(playerMonster, enemyMonster){
	//sets the canvas to the right size for the battle ui
	canvas.width = 176
	canvas.height = 144
	drawMonsters(playerMonster, enemyMonster);
	
	context.font = "9px Verdana"
	switch(currentBattleMenu){
		case "main":
		itemIndex = 0
			drawControls();
			break;
		case "attack":
		
			//if no controls are being pressed
			if (!(zDown||xDown||cDown||vDown)){
				menuReady = true
			}
			//Z1 C2 V3 X4
			drawAttacks(playerMonster);
			if(zDown && menuReady){
				
				currentBattleMenu = "message"
				useAttack(playerMonster["attacks"][1],playerMonster, enemyMonster)
			}
			if(xDown && menuReady){
				currentBattleMenu = "message"
				useAttack(playerMonster["attacks"][4],playerMonster, enemyMonster)
			}
			if(cDown && menuReady){
				currentBattleMenu = "message"
				useAttack(playerMonster["attacks"][2],playerMonster, enemyMonster)
			}
			if(vDown && menuReady){
				currentBattleMenu = "message"
				useAttack(playerMonster["attacks"][3],playerMonster, enemyMonster)
			}
			break;
		case "item":
		
			//draw controls for using items
			drawItems();
			if(zDown && menuReady && currentItems[itemIndex]){
				currentBattleMenu = "message"
				useItem(currentItems[itemIndex],playerMonster)
				
				//remove the used item from inventory
				currentItems.splice(itemIndex,1);
				
				//reset the menu
				itemIndex = 0
			}
			if(xDown && menuReady && currentItems[itemIndex + 1]){
				currentBattleMenu = "message"
				useItem(currentItems[itemIndex + 1],playerMonster)
				
				//remove the used item from inventory
				currentItems.splice(itemIndex + 1,1);
				
				//reset the menu
				itemIndex = 0 
			}
			
			//if there are more items to be shown
			if(cDown && menuReady && currentItems.length > itemIndex + 2){	
				menuReady = false
				
				//load the next 2 items
				itemIndex += 2
				
				//if no controls are being pressed
				if (!(zDown||xDown||cDown||vDown)){
					menuReady = true
				}
			}
			
			//if there are no more items to be shown
			else{
				if(cDown && menuReady){
				
					//go back to main menu
					currentBattleMenu = "main"
					
					//reset the menu
					itemIndex = 0
					menuReady = false
				}
				
			}
			break;
		case "switch":
		
			//draws the controls for monster switching
			drawSwitch();
			
			if(zDown && menuReady){
				currentBattleMenu = "message"
				
				//switch monster
				Switch(switchIndex)
				
				//reset the menu
				switchIndex = 0
			}
			if(xDown && menuReady){
				currentBattleMenu = "message"
				
				//switch monster
				Switch(switchIndex + 1)
				
				//reset the menu
				switchIndex = 0
			}
			
			//if there are more monsters left to be shown
			if(cDown && menuReady && currentMonsters.length > switchIndex + 2){	
				menuReady = false
				
				//loads the next 2 monsters
				switchIndex += 2
				
				//if no controls are being pressed
				if (!(zDown||xDown||cDown||vDown)){
					menuReady = true
				}
			}
			
			//if there are no more monsters to show
			else{
				
				//if there are no more monsters go back to main menu
				if(cDown && menuReady){
					currentBattleMenu = "main"
					
					//reset the menu
					switchIndex = 0
					menuReady = false
				}
			}
			break;
		case "message":
			displayMessage(hit,effect)
			
			//if an enemy monster has been killed
			if(enemyMonster["hp"] < 1 && menuReady && (zDown||xDown||cDown||vDown)){

				//add xp based on the level difference between the 2 monsters
				//more xp is awarded if the enemy is a higher level than the player
				currentMonsters[currentMonsterIndex].xp += xpModifier*(enemyMonsters[enemyMonsterIndex].level/currentMonsters[currentMonsterIndex].level)
				
				//can't get any higher than level 100
				if(currentMonsters[currentMonsterIndex].xp >= 100 && currentMonsters[currentMonsterIndex].level < 100){
					currentMonsters[currentMonsterIndex].levelUp(currentMonsters[currentMonsterIndex].level + 1)//if xp has reached the max then level up
					
					//reset xp
					currentMonsters[currentMonsterIndex].xp = 0
				}
				monsterFound = false
				menuReady = true
				
				//see if the enemy has any more monsters left to fight
				for(x=0;x<currentMonsters.length;x++){
					if (enemyMonsters[x] && enemyMonsters[x]["hp"] >= 1 && !monsterFound){
						monsterFound = true
						
						//switch in the enemy's monster if there is one
						enemySwitch(x)
					}
				}
				
				//if there are no more enemy monsters then the player wins
				if(!monsterFound){
					battleWon = "player"
					
					//load battle ending sequence
					currentBattleMenu = "battleWon"
					menuReady = false
					break;
				}
			}
			
			//if no controls are being pressed
			if (!(zDown||xDown||cDown||vDown)){
				menuReady = true
			}
			if ((zDown||xDown||cDown||vDown) && menuReady &&!monsterFound){
				enemyMoved = false
				currentBattleMenu = "enemyTurn"
				menuReady = false
			}
			if (!(zDown||xDown||cDown||vDown) && monsterFound){
				menuReady = true
			}
			if ((zDown||xDown||cDown||vDown) && menuReady){
				currentBattleMenu = "main"
				menuReady = false
				monsterFound = false
			}
			break;
		case "enemyMessage":
			displayMessage(hit,effect)
			monsterFound = false
			
			//if the players monster has been killed
			if(playerMonster["hp"] < 1 && menuReady && (zDown||xDown||cDown||vDown)){
					effect = playerMonster["name"] + " was killed"
					monsterFound = false
					
					//see if the player has any more monsters to fight
					for(x=0;x<currentMonsters.length;x++){
						if (currentMonsters[x] && currentMonsters[x]["hp"] >= 1 && !monsterFound){
							monsterFound = true
							
							//switch in the next monster if there is one
							Switch(x)
						}
					}
					
					//if the player has no more monsters then the enemy wins
					if(!monsterFound){
						
						//battle is over
						battleWon = "enemy"
						currentBattleMenu = "battleWon"
						menuReady = false
						break;
					}
				}
			
			//if no controls are being pressed
			if (!(zDown||xDown||cDown||vDown)){
				menuReady = true
			}
			if ((zDown||xDown||cDown||vDown) && menuReady && !monsterFound){
				currentBattleMenu = "main"
				menuReady = false
			}
			if ((zDown||xDown||cDown||vDown) && menuReady && monsterFound){
				currentBattleMenu = "enemyMessage"
				menuReady = false
				monsterFound = false
			}
			break;
		case "enemyTurn":
			if(!enemyMoved && !enemyDied){
				
				//uses a random attack from their 4
				attack = Math.ceil(Math.random() * 4)
				useAttack(enemyMonster.attacks[attack], enemyMonster, playerMonster)
				hit = enemyMonster.name + " used " + enemyMonster.attacks[attack].name
				enemyMoved = true
				displayMessage()
				currentBattleMenu = "enemyMessage"
			}
			else{
				
				//if no controls are being pressed
				if (!(zDown||xDown||cDown||vDown)){
					menuReady = true
				}	
				
				//if a button is pressed
			if ((zDown||xDown||cDown||vDown) && menuReady){
				currentBattleMenu = "main"
				menuReady = false
			}
				}
			if(enemyDied){
				
				//reset the enemyDied variable for the next monster
				enemyDied = false
				
				currentBattleMenu = "main"
			}
			break;
		case "battleWon":
			if (battleWon == "player")
				displayMessage("You Win, £5 has been awarded",null)
				playerMoney+=5
			if (battleWon == "enemy"){
				displayMessage("You lose, £5 has been removed",null)
				playerMoney-=5
				
			}
			
			//need a variable for the event loop to determine if an npc has been beaten
			battleWon2 = battleWon
			if (battleWon == "captured"){
				displayMessage(enemyMonsters[enemyMonsterIndex].name + " was captured")
			}
			
			//if no controls are being pressed
			if (!(zDown||xDown||cDown||vDown)){
				menuReady = true
			}
			if ((zDown||xDown||cDown||vDown) && menuReady){
				
				//reset battle variables
				currentBattleMenu = "main"
				enemyMonsterIndex = 0
				menuReady = false
				
				if (battleWon == "enemy"){
					//player must be sent to the hospital to regain hp
					
					//if the player is in a gym
					if([7,8].includes(levelIndex)){
						
						//set the spawn point to outside the gym
						outsideLocation = maps[outsideIndex].spawnPoint
					}
					else{
						outsideLocation[0] = currentLevel.spawnPoint[1]
						outsideLocation[1] = currentLevel.spawnPoint[0]
					}
					
					//go to the hospital
					currentLevel = maps[3]
					levelIndex = 3
					
					//places the user on the healing spot in the hospital so they can't go outside without healing
					LoadLevel(5,2)
					battleWon = null
					
				}
				battleWon = null
				
				//end the battle
				return false
			}
			break;
		case "run":
			if (canCapture){
				
				//higher chance of escaping if player is faster
				chance = currentMonsters[currentMonsterIndex].speed / enemyMonsters[enemyMonsterIndex].speed 
				
				//can't run from npc battles
				if (runSuccess(chance) && canRun){
				
					//reset battle variables
					battleWon = null
					currentBattleMenu = "main"
					displayMessage("You ran away")
					enemyMonsterIndex = 0
					currentMonsterIndex = 0
					
					//end the battle
					return false
				}
				else{
					displayMessage("You didn't manage to escape")
					canRun = false
					
					//if no controls are being pressed
					if (!(zDown||xDown||cDown||vDown)){
						menuReady = true
					}
					if ((zDown||xDown||cDown||vDown) && menuReady){
						currentBattleMenu = "enemyTurn"
						menuReady = false
						canRun = true
						enemyMoved = false
					}
				}
			}
			else{
				displayMessage("You can't run from this battle")
				
				//if no controls are being pressed
				if (!(zDown||xDown||cDown||vDown)){
					menuReady = true
				}
				
				//if a button is pressed
				if ((zDown||xDown||cDown||vDown) && menuReady){
					currentBattleMenu = "main"
					menuReady = false
				}
			}
			break;
	}
	
	//workaround for the cross tick button holding problem
	if (!(zDown||xDown||cDown||vDown)){
				menuReady = true
	}
	if (menuReady){
		if(escDown){
			currentBattleMenu = "main"
			menuReady = false
		}
		if(zDown && !tutorialCapture){
			currentBattleMenu = "attack"
			menuReady = false
		}
		if(xDown && !tutorial){
			currentBattleMenu = "item"
			menuReady = false
		}
		if(cDown && !tutorial && !tutorialCapture){
			currentBattleMenu = "switch"
			menuReady = false
		}
		if(vDown && !tutorial && !tutorialCapture){
			currentBattleMenu = "run"
			menuReady = false
		}
	}
	if (tutorial){
		//for the introduction battle
		Tutorial()
	}
	if(tutorialCapture){
		//for when the user is shown how to capture monsters
		CaptureTutorial()
	}
	
	//if the battle is to carry on
	return true
}
function runSuccess(chance){
	if (chance > 1.2){
		random = 0.25
	}
	if (chance>=0.8 && chance <= 1.2){
		random = 0.5
	}
	if (chance<0.8){
		random = 0.75
	}
	return Math.random() > random
}
function displayMessage(hit,effect){
	//context.clearRect(0,0,canvas.width, canvas.height);
	//currentBattleMenu = "message"
	//menuReady = false
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, canvas.height - 40, canvas.width, 39);
	context.rect(0, canvas.height - 40, canvas.width, 39);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText(hit, 10, canvas.height - 30)
	if(effect){//if effect isn't null
		context.fillText(effect, 10, canvas.height - 20)
	}
}
function useAttack(attack, user, target){
	menuReady = false
	
	//if the user's monster has a status effect
	if (user["effect"] != null){
		if (Math.random() < 0.1){
			
			//1/10 chance of removing effect
			user["effect"] = null
		}
		if (user["effect"] == "frozen"){
			console.log("frozen")
		}
	}
	effect = ""
	damage = Math.round(attack["damage"] * user["attack"] / target["defense"])
	if (attackIsStrong(target["type"],attack["type"])){
		
		//double damage for a good type matchup
		damage *= 2
		effect="Attack is strong"
	}
	else{
		if (defenceIsStrong(target["type"],attack["type"])){
			
			//half damage for a bad type matchup
			damage *= 0.5
			effect="Defense is strong"
		}
	}
	hit = ""
	chance = Math.random()
	
	//accuracy of an attack is its % chance of hitting
	if (chance < attack["accuracy"] / 100) {
		
		//deals damage
		target["hp"] -= Math.round(damage)
		hit = "Attack landed"
	}
	else{
		hit = "Attack missed"
		}
	if (target["hp"] <= 0){
		target["hp"] = 0
	}
	
	//if the attack has a chance of applying an effect
	if (attack["effect"] != null) {
		if (Math.random() <= attack["effect"][1] / 100){

			//adds the effect to the target
			target["effect"] = attack["effect"][0]
			effect = "Added effect ," + attack["effect"]
		}
		else{effect = "Failed to apply effect"
		}
	}
}
function Switch(index){
	menuReady = false
	hit = currentMonsters[currentMonsterIndex]["name"] + " switched out"
	
	//sets the current monster to the one with the specified index
	currentMonsterIndex = index
	
	effect = currentMonsters[currentMonsterIndex]["name"] + " switched in"
	
	//reset switch menu
	switchIndex = 0
	}
	
function enemySwitch(index){
	menuReady = false
	hit = enemyMonsters[enemyMonsterIndex]["name"] + " switched out"
	
	//sets the enemy monster to the one with the specified index
	enemyMonsterIndex = index
	
	effect = enemyMonsters[enemyMonsterIndex]["name"] + " switched in"
	switchIndex = 0
	}

function useItem(item,playerMonster){
	menuReady = false
	
	//health potion
	if (item["effect"] == "hpRestore"){
		playerMonster["hp"] += item["strength"]
		
		//makes sure hp doesn't go over the maximum
		if(playerMonster["hp"] > playerMonster["maxhp"]){
			playerMonster["hp"] = playerMonster["maxhp"]	
		}
	hit = "Used healing potion"
	effect = "Restored "+ item["strength"]+" health"
	}
	
	//capsule
	if (item["effect"] == "capture"){
		
		//false for npc battles
		if(canCapture){
		
			//adds the enemy monster to the user's monsters list
			currentMonsters.push(enemyMonsters[enemyMonsterIndex])
			
			//battle is over
			currentBattleMenu = "battleWon"
			battleWon = "captured"
		}
		else{
			hit = "Can't capture"
			effect = "This is an NPC battle"
		}
	}
}
function drawAttacks(playerMonster){
	attacks = playerMonster["attacks"]
	
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(0, canvas.height - 40, canvas.width, 39);
	context.fillStyle = "#FFFFFF"
	context.fillRect(0, canvas.height - 40, canvas.width, 39);
	context.stroke();
	
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(10, canvas.height - 16, 60, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("Z:"+attacks[1]["name"],15, canvas.height - 27)
	
	
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(10, canvas.height - 35, 60, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("C:"+attacks[2]["name"],15, canvas.height - 8)
	
	
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(canvas.width - 70, canvas.height - 34, 60, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("V:"+attacks[3]["name"],110, canvas.height - 8)
	
	
	
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(canvas.width - 70, canvas.height - 17, 60, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("X:"+attacks[4]["name"],110, canvas.height - 26)
}
function drawSwitch(){
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(0, canvas.height - 40, canvas.width, 39);
	context.fillStyle = "#FFFFFF"
	context.fillRect(0, canvas.height - 40, canvas.width, 39);
	context.stroke();
	
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(10, canvas.height - 36, 60, 31);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("Z:"+ currentMonsters[switchIndex]["name"],15, canvas.height - 27)
	context.fillText("HP:",15, canvas.height - 17)
	context.fillText(currentMonsters[switchIndex]["hp"],30, canvas.height - 7)
	
	//if the monster exists
	if (currentMonsters[switchIndex + 1]){
		context.beginPath();
		context.lineWidth=1;
		context.strokeStyle="#000000";
		context.rect(75, canvas.height - 36, 60, 31);
		context.stroke();
		context.fillStyle = "#000000"
		context.fillText("X:"+currentMonsters[switchIndex + 1]["name"],80, canvas.height - 27)
		context.fillText("HP:",80, canvas.height - 17)
		context.fillText(currentMonsters[switchIndex + 1]["hp"],95, canvas.height - 7)
		
		
		context.fillText("C:",150, canvas.height -27)
		context.fillText("Next",145, canvas.height -17)
		context.fillText("Page",145, canvas.height -7)
	}
	
	
}

function drawItems(){
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(0, canvas.height - 40, canvas.width, 39);
	context.fillStyle = "#FFFFFF"
	context.fillRect(0, canvas.height - 40, canvas.width, 39);
	context.stroke();
	
	//if the item exists
	if(currentItems[itemIndex]){
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(10, canvas.height - 36, 60, 31);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("Z:"+ currentItems[itemIndex]["name"],15, canvas.height - 27)
	context.fillText("Strength:",15, canvas.height - 17)
	context.fillText(currentItems[itemIndex]["strength"],30, canvas.height - 7)
	}
	
	//if the item exists
	if (currentItems[itemIndex + 1]){
		context.beginPath();
		context.lineWidth=1;
		context.strokeStyle="#000000";
		context.rect(75, canvas.height - 36, 60, 31);
		context.stroke();
		context.fillStyle = "#000000"
		context.fillText("X:"+currentItems[itemIndex + 1]["name"],80, canvas.height - 27)
		context.fillText("Strength:",80, canvas.height - 17)
		context.fillText(currentItems[itemIndex + 1]["strength"],95, canvas.height - 7)
		
		
		context.fillText("C:",150, canvas.height -27)
		context.fillText("Next",145, canvas.height -17)
		context.fillText("Page",145, canvas.height -7)
	}
	
	
}
function drawControls(){
	//control panel
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(0, canvas.height - 40, canvas.width, 39);
	context.fillStyle = "#FFFFFF"
	context.fillRect(0, canvas.height - 40, canvas.width, 39);
	context.stroke();
	
	//attack button
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(10, canvas.height - 16, 50, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("Z:Attack",15, canvas.height - 27)
	
	//switch button
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(10, canvas.height - 35, 50, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("C:Switch",15, canvas.height - 8)
	
	//run button
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(canvas.width - 60, canvas.height - 34, 50, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("V:Run",125, canvas.height - 8)
	
	
	//item button
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(canvas.width - 60, canvas.height - 17, 50, 10);
	context.stroke();
	context.fillStyle = "#000000"
	context.fillText("X:Item",125, canvas.height - 26)}
	
function drawMonsters(playerMonster, enemyMonster){
	//players monster stats
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(100, canvas.height - 75, 75, 30);
	context.stroke();
	context.beginPath()
	context.rect(105, canvas.height - 55, 65, 5)
	context.stroke()
	playerHealthPercent = playerMonster.hp / playerMonster.maxhp
	if(playerHealthPercent >= 0.75){
		
	context.fillStyle = "#00FF00"
	}
	if(playerHealthPercent < 0.75 && playerHealthPercent >= 0.25){
		context.fillStyle = "orange"
	}
	if(playerHealthPercent < 0.25){
		context.fillStyle = "#FF0000"
	}
	
	context.fillRect(105,canvas.height - 55, 65 * playerHealthPercent, 5)
	context.fillStyle = "#000000"
	context.font = ("7px Verdana")
	context.fillText(playerMonster.name,102, canvas.height - 65)
	context.fillText("HP:"+playerMonster.hp+"/"+playerMonster.maxhp,110, canvas.height-58)
	context.fillStyle = "#7777FF"
	context.fillRect(100,canvas.height-47,75*(playerMonster.xp / 100),1)
	context.fillStyle = "#000000"
	context.fillText("Lvl."+playerMonster.level,145,canvas.height-65)
	
	//enemy monster stats
	context.beginPath();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.rect(5, canvas.height - 130, 75, 30);
	context.stroke();
	context.beginPath()
	context.rect(10, canvas.height - 110, 65, 5)
	context.stroke()
	enemyHealthPercent = enemyMonster.hp / enemyMonster.maxhp
	if(enemyHealthPercent >= 0.75){
		
	context.fillStyle = "#00FF00"
	}
	if(enemyHealthPercent < 0.75 && enemyHealthPercent >= 0.25){
		context.fillStyle = "orange"
	}
	if(enemyHealthPercent < 0.25){
		context.fillStyle = "#FF0000"
	}	
	context.fillRect(10,canvas.height - 110, 65 * enemyMonster.hp / enemyMonster.maxhp, 5)
	context.fillStyle = "#000000"
	context.font = ("7px Verdana")
	context.fillText(enemyMonster.name,7, canvas.height - 120)
	context.fillText("HP:"+enemyMonster.hp+"/"+enemyMonster.maxhp,15, canvas.height-113)
	context.fillText("Lvl."+enemyMonster.level,55,canvas.height-120)
	
	//player monster sprite
	spritePath = "sprites/monsters/back/"+playerMonster.name+".png"
	playerMonsterSprite = new Image();
	playerMonsterSprite.src = spritePath;
	playerMonsterSprite.height = 64;
	playerMonsterSprite.width = 64;
	context.drawImage(playerMonsterSprite,10, 40);
	
	//enemy monster sprite
	spritePath = "sprites/monsters/front/"+enemyMonster.name+".png"
	enemyMonsterSprite = new Image();
	enemyMonsterSprite.src = spritePath;
	enemyMonsterSprite.height = 64;
	enemyMonsterSprite.width = 64;
	context.drawImage(enemyMonsterSprite,100, 5);
}