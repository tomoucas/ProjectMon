from os import listdir
#files = listdir(r"C:\Users\Tom\Documents\GitHub\ProjectMon\sprites\overworld")
#text = open(r"C:\Users\Tom\Documents\GitHub\ProjectMon\js\sprites.js", "w")
files = listdir(r"C:\Users\s171159\Documents\GitHub\ProjectMon\sprites\overworld")
text = open(r"C:\Users\s171159\Documents\GitHub\ProjectMon\js\sprites.js", "w")
for f in files:
    name = f[:-4]
    string = """var {}Sprite = new Image();
		{}Sprite.src = "sprites/overworld/{}"
		{}Sprite.height = 16
		{}Sprite.width = 16""".format(name,name,f,name,name)
    text.write(string)
    text.write("\n")

text.close()
text = open("spriteArray.txt","w")
array = input("paste sprites array")
number = int(input("number"))
for f in files:
    if f[:-4] not in array:
        text.write(str(number))
        text.write(":")
        text.write(f[:-4])
        text.write("Sprite")
        text.write(",")
        number += 1
text.close()
