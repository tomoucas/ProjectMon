//index of the currently selected monster
panelIndex = 0

//overwritten on the next line, irrelevant
space = "----------------"

//17 blank spaces to align text properly
space = "&nbsp;".repeat(17)

//workaround for holding buttons across ticks, similar to menuReady in every other part of the game
panelReady = false

//draws information about the currently selected monster
//was designed to work with a browser zoom of 150%, could be misaligned otherwise
function monsterPanel(){
	
	//clears the panel
	$("#monsters").empty()
	
	//used to gather information about the currently selected monster
	panelMonster = currentMonsters[panelIndex]
	
	//creates a new text element with jquery
	var panelItem = $("<p/>")
		
		//sets text content
		.html(panelMonster.name + " Level:" + panelMonster.level)
		
		//centres the text
		.prop("align","center")
		
		//changes the font size
		.css("font-size","1.1em");
		
	//adds element to the panel
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("Hp:"+ panelMonster.hp +"/" + panelMonster.maxhp)
		.prop("align","center")
		.css("font-size","0.8em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("Attack:"+Math.round(panelMonster.attack) + "&nbsp;".repeat(3) + "Defense:" + Math.round(panelMonster.defense) + "&nbsp;".repeat(3) + "Speed:"+panelMonster.speed)
		.prop("align","center")
		.css("font-size","0.8em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html(panelMonster.attacks[1].name + "(" + panelMonster.attacks[1].type +")"+":")
		.prop("align","center")
		.css("font-size","0.9em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("Damage: "+panelMonster.attacks[1].damage + space + "Accuracy: " + panelMonster.attacks[1].accuracy)
		.prop("align","left")
		.css("font-size","0.8em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html(panelMonster.attacks[2].name + "(" + panelMonster.attacks[2].type +")" + ":")
		.prop("align","center")
		.css("font-size","0.9em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("Damage: "+panelMonster.attacks[2].damage + space + "Accuracy: " + panelMonster.attacks[2].accuracy)
		.prop("align","left")
		.css("font-size","0.8em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html(panelMonster.attacks[3].name + "(" + panelMonster.attacks[3].type +")"+":")
		.prop("align","center")
		.css("font-size","0.9em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("Damage: "+panelMonster.attacks[3].damage + space + "Accuracy: " + panelMonster.attacks[3].accuracy)
		.prop("align","left")
		.css("font-size","0.8em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html(panelMonster.attacks[4].name +  "(" + panelMonster.attacks[4].type +")"+":")
		.prop("align","center")
		.css("font-size","0.9em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("Damage: "+panelMonster.attacks[4].damage + space + "Accuracy: " + panelMonster.attacks[4].accuracy)
		.prop("align","left")
		.css("font-size","0.8em");
	$("#monsters").append(panelItem)
	
	var panelItem = $("<p/>")
		.html("<:Previous Monster" + space + "&nbsp;".repeat(7)  +"Next Monster:>")
		.prop("align","left")
		.css("font-size","0.6em");
	$("#monsters").append(panelItem)
	
	//if neither arrow is pressed
	if(!(leftArrowDown || rightArrowDown)){
		panelReady = true
	}
	
	//selects the previous monster
	if (panelReady && leftArrowDown && currentMonsters[panelIndex - 1]){
		panelIndex--
		panelReady = false
	}
	
	//selected the next monster
	if(panelReady && rightArrowDown && currentMonsters[panelIndex + 1]){
		panelIndex++
		panelReady = false
	}
}