//type enum
type = {
		normal:"normal",
		fighting:"fighting",
		flying:"flying",
		poison:"poison",
		ground:"ground",
		rock:"rock",
		bug:"bug",
		ghost:"ghost",
		steel:"steel",
		fire:"fire",
		water:"water",
		grass:"grass",
		electric:"electric",
		psychic:"psychic",
		ice:"ice",
		dragon:"dragon",
		dark:"dark"
	}
	
//base monster class that all monsters inherit
class monster{
	constructor(){
		this.xp = 0
		this.level = 1
	}
	levelUp(level){
		this.level = level
		this.hp = Math.round(this.baseHp * level)
		this.maxhp = Math.round(this.baseHp * level)
		this.attack = Math.round(this.baseAttack * level)
		this.defense = Math.round(this.baseDefense * level)
		this.speed = Math.round(this.baseSpeed * level)
		
		//start learning new attacks
		this.attackslearnt = 0
		
		//from max level 100
		//looking back there is actually no need for this for loop, it just makes the
		//following code run 100 times when it only needs to run once
		for(var x=100;x>=0;x--){
			
			//loop through all the attacks that the monster can learn
			for(var y=0;y<=this.learnattacks.length;y++){
				
				//uses the 4 highest level attacks that the monster is
				//highly leveled enough for
				//index 0 is the minimum level to learn the attack, index 1 is the attack itself
				if(level >= this.learnattacks[y][0] && this.attackslearnt < 4){
					this.attacks[this.attackslearnt + 1] = this.learnattacks[y][1]
					
					//increment attacks learnt
					this.attackslearnt++
				}
				
				//stop if the monster has learned 4 attacks on this level up
				if(this.attackslearnt == 4){
					break
				}
		}
		}
	}
}
class dustox extends monster{
	constructor(){
		super()
		
		this.name = "Dustox"
		this.baseHp = 6
		this.baseAttack = 5
		this.baseDefense = 8
		this.baseSpeed = 6.5
		this.attacks={1:null,2:null,3:null,4:null}
		
		//must be ordered from highest level to lowest level for levelling up to work correctly (i never actually implemented any attacks higher than level 0)
		this.learnattacks = [[0,airCutter],[0,stinger],[0,confusion],[0,bugBuzz]]
		
		this.type = type.bug
	}
}
class muk extends monster{
	constructor(){
		super()
		
		this.name = "Muk"
		this.baseHp = 8
		this.baseAttack = 8
		this.baseDefense = 6
		this.baseSpeed = 5
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,acid],[0,belch],[0,assurance],[0,confusion]]
		this.type = type.poison
	}
}
class staravia extends monster{
	constructor(){
		super()
		
		this.name = "Staravia"
		this.baseHp = 5.5
		this.baseAttack = 7.5
		this.baseDefense = 5
		this.baseSpeed = 8
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,aeroblast],[0,airCutter],[0,beakBlast],[0,fly]]
		this.type = type.flying
	}
}
class bayleef extends monster{
	constructor(){
		super()
		
		this.name = "Bayleef"
		this.baseHp = 6
		this.baseAttack = 8.0
		this.baseDefense = 8
		this.baseSpeed = 6
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,vineWhip],[0,leafBlade],[0,forestsCurse],[0,feint]]
		this.type = type.grass
	}
}
class machop extends monster{
	constructor(){
		super()
		
		this.name = "Machop"
		this.baseHp = 7
		this.baseAttack = 8
		this.baseDefense = 5
		this.baseSpeed = 3.5
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,brickBreak],[0,auraSphere],[0,slam],[0,firePunch]]
		this.type = type.fighting
	}
}
class sandslash extends monster{
	constructor(){
		super()
		
		this.name = "Sandslash"
		this.baseHp = 7.5
		this.baseAttack = 10
		this.baseDefense = 11
		this.baseSpeed = 6.5
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,boneRush],[0,boomerang],[0,fissure],[0,rollout]]
		this.type = type.ground
	}
}
class metang extends monster{
	constructor(){
		super()
		
		this.name = "Metang"
		this.baseHp = 6
		this.baseAttack = 7.5
		this.baseDefense = 10
		this.baseSpeed = 5
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,flashCannon],[0,confusion],[0,metalClaw],[0,assurance]]
		this.type = type.steel
	}
}
class goldeen extends monster{
	constructor(){
		super()
		
		this.name = "Goldeen"
		this.baseHp = 4.5
		this.baseAttack = 6.7
		this.baseDefense = 6
		this.baseSpeed = 6.3
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,aquaJet],[0,brine],[0,feint],[0,waterfall]]
		this.type = type.water
	}
}
class geodude extends monster{
	constructor(){
		super()
		
		this.name = "Geodude"
		this.baseHp = 4
		this.baseAttack = 8
		this.baseDefense = 10
		this.baseSpeed = 2
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,boneRush],[0,rollout],[0,feint],[0,rockBlast]]
		this.type = type.rock
	}
}
class onix extends monster{
	constructor(){
		super()
		
		this.name = "Onix"
		this.baseHp = 4
		this.baseAttack = 8
		this.baseDefense = 10
		this.baseSpeed = 2
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,slam],[0,rollout],[0,stealthRock],[0,rockBlast]]
		this.type = type.rock
	}
}
class charmander extends monster{
	constructor(){
		super()
		
		this.name = "Charmander"
		this.baseHp = 3.9
		this.baseAttack = 5.2
		this.baseDefense = 4.3
		this.baseSpeed = 6.5
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,firePunch],[0,slam],[0,flamethrower],[0,highJumpKick]]
		this.type = type.fire
	}	
}
class bulbasaur extends monster{
	constructor(){
		super()
		this.name = "Bulbasaur"
		this.baseHp = 4.5
		this.baseAttack = 4.9
		this.baseDefense = 4.9
		this.baseSpeed = 4.5
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,feint],[0,leafBlade],[0,vineWhip],[0,forestsCurse]]
		this.type = type.grass
	}	
}
class pikachu extends monster{
	constructor(){
		super()
		this.name = "Pikachu"
		this.baseHp = 3.5
		this.baseAttack = 5.5
		this.baseDefense = 4.0
		this.baseSpeed = 9.0
		this.attacks={1:null,2:null,3:null,4:null}
		this.learnattacks = [[0,thunderbolt],[0,slam],[0,spark],[0,fusionBolt]]
		this.type = type.electric
	}	
}