class gym{
	constructor(){
		this.complete = false
		this.npcs = []
		this.bossReady = false
		this.map = null
		this.npcsRemaining = 0
		this.difficulty = 1
		this.bossLocation = []
	}
}

//array that contains every gym in the game
gyms = []

//initializes gym0
gym0Object = new gym
gym0Object.bossLocation = [6,2]
gym0Object.map = gym0
gym0Object.difficulty = 11
gym0Object.npcs = [{x:3,y:5,ready:true,level:gym0Object.difficulty, team:[new onix]},
					{x:6,y:5,ready:true,level:gym0Object.difficulty, team:[new geodude]},
					{x:10,y:5,ready:true,level:gym0Object.difficulty, team:[new geodude]},
					{x:13,y:5,ready:true,level:gym0Object.difficulty, team:[new onix]}
					]
gym0Object.boss = [new onix, new geodude]
for(y=0;y<gym0Object.boss.length;y++){
	gym0Object.boss[y].levelUp(Math.ceil(gym0Object.difficulty * 1.1))
}
gym0Object.npcsRemaining = gym0Object.npcs.length

//levels up all the npcs' monsters to the right level
for(x=0;x<gym0Object.npcs.length;x++){
		for(y=0;y<gym0Object.npcs[x]["team"].length;y++){
			gym0Object.npcs[x]["team"][y].levelUp(gym0Object.difficulty)
		}
	}
	
//adds gym to array
gyms.push(gym0Object)



//initializes gym1
gym1Object = new gym
gym1Object.bossLocation = [5,2]
gym1Object.map = gym1
gym1Object.difficulty = 18
gym1Object.npcs = [{x:7,y:7,ready:true,level:gym1Object.difficulty, team:[new bulbasaur]},
					{x:3,y:8,ready:true,level:gym1Object.difficulty, team:[new bayleef]},
					{x:2,y:6,ready:true,level:gym1Object.difficulty, team:[new bayleef]},
					{x:10,y:6,ready:true,level:gym1Object.difficulty, team:[new bulbasaur]}
					]
gym1Object.boss = [new bulbasaur, new bayleef]
for(y=0;y<gym1Object.boss.length;y++){
	gym1Object.boss[y].levelUp(Math.ceil(gym1Object.difficulty * 1.1))
}
gym1Object.npcsRemaining = gym1Object.npcs.length

//levels up all the npcs' monsters to the right level
for(x=0;x<gym1Object.npcs.length;x++){
		for(y=0;y<gym1Object.npcs[x]["team"].length;y++){
			gym1Object.npcs[x]["team"][y].levelUp(gym1Object.difficulty)
		}
	}
	
//adds gym to array
gyms.push(gym1Object)





function gymsLoop(){
	
	//run through every gym
	for (x=0;x<gyms.length;x++){
		gym = gyms[x]
		
		//if the player is currently in this gym
		if (gym.map == currentLevel){
			
			//loops through all the gym's npcs
			for (i=0;i<=gym.npcs.length - 1;i++){
				
				//if the player is within a 1 tile radius of an npc
				if((distanceTo(playerYTile * 16 + 7,(gym.npcs[i]["y"]-1)*16 + 7,playerXTile * 16 + 7,(gym.npcs[i]["x"]-1)*16 + 7))<23 && gym.npcs[i]["ready"] && !npcBattle){
					
					playerCanMove = false
					displayMessage("Gym battle", null)
					
					//when the player presses a button
					if(menuReady && (zDown||xDown||cDown||vDown)){
						menuReady = false
						
						//player is now in an npc battle
						npcBattle = true
						
					}
				}
				
				//if the player isn't pressing any buttons
				if (!(zDown||xDown||cDown||vDown)){
						menuReady = true
					}
					
				//if the player is in an npc battle, distance check is to make sure the player is battling the npc that they are next to, not just the first one in the npcs array
				if(gym.npcs[i].ready && npcBattle && menuReady && distanceTo(playerYTile * 16 + 7,(gym.npcs[i]["y"]-1)*16 + 7,playerXTile * 16 + 7,(gym.npcs[i]["x"]-1)*16 + 7)<23 ){
					
					//loads the npc battle
					enemyMonsters = gym.npcs[i]["team"]
					canCapture = false
					if(!LoadBattle(currentMonsters[currentMonsterIndex],enemyMonsters[enemyMonsterIndex])){
						
						//battle is over
						playerCanMove = true
						npcBattle = false
						
						//this npc is done with
						gym.npcs[i]["ready"] = false
						canvas.height = currentLevelRows*16
						canvas.width = currentLevelCols*16
						
						//one less npc remaining
						gym.npcsRemaining --
						
						//boss can only be fought after all the other npcs have been beaten
						if (gym.npcsRemaining == 0){
							gym.bossReady = true
						}
					}
				}
			
		
			}
			
			//if the player can fight the boss and is within one tile of him
			if (!npcBattle && !gym.complete && gym.bossReady && distanceTo(playerYTile * 16 + 7, gym.bossLocation[1] * 16, playerXTile * 16, gym.bossLocation[0] * 16) < 23){
				playerCanMove = false
					
					displayMessage("Gym boss battle", null)
					
					//when the player presses a button
					if(menuReady && (zDown||xDown||cDown||vDown)){
						menuReady = false
						
						//player is now battling the boss
						npcBattle = true
					}
			}
			
			//if the player isnt pressing any buttons
			if (!(zDown||xDown||cDown||vDown)){
						menuReady = true
					}
			
			//if the player is battling the boss
			if (npcBattle && menuReady && !gym.complete && distanceTo(playerYTile * 16 + 7, gym.bossLocation[1] * 16, playerXTile * 16, gym.bossLocation[0] * 16) < 23){
				
				//loads the boss battle
				enemyMonsters = gym.boss
				canCapture = false
				if(!LoadBattle(currentMonsters[currentMonsterIndex],enemyMonsters[enemyMonsterIndex])){
					
					//player is no longer in an npc battle
					npcBattle = false
					
					//playerCanMove is still false as the player still needs to go through the congratulations event
					
					//gym = gyms[x] from the start of the for loop
					gym.complete = true
					
					//adjust canvas to fit the map
					canvas.height = currentLevelRows*16
					canvas.width = currentLevelCols*16
					
					//which gym was just beaten? (x is from initial for loop)
					switch (x){
						
						//enables the right congratulations event
						case 0:
							gym0Event.ready = true
							break;
						case 1:
							gym1Event.ready = true
							break;
					}
					
				}
			}
		}
	}
}