import random
print("Hey!!!......I'm PLUTO....\n Let's have some fun !!\n come play with me")
print("your choices are \n 1.stone \n 2.paper \n 3.scissors\n")
round = int(input("Enter the no. of times you want to play :"))
things = ["stone","paper","scissors"]
mypoint=0
systmpoint=0
while(round>0):
 your_action = str(input("Give your choice :"))
 pluto = random.choice(things)
 print("choice of the pluto :",pluto)
 if pluto =="stone":
 
   if your_action == "stone":
 
     print("its a tie")
 
   elif your_action == "paper":
    print("you won a point..!!")
 
    mypoint+=1
 
 else :
 
  print("I won a point..!!")
 
  systmpoint+=1
 
 if pluto == "paper":
 
  if your_action == "paper":
 
   print("it's a tie")
 
  elif your_action == "scissors":
 
   print("you won a point..!!")
   mypoint+=1
 else:
  print("I won a point..!!")
  systmpoint+=1
 if pluto == 'scissors' :
 
   if your_action =='scissors':
 
    print("its a tie")
 
   elif your_action== 'stone':
    print("you won a point..!!")
    mypoint+=1
 else:
  print("I won a point..!!")
  systmpoint+=1
 
 round-=1
if(mypoint>systmpoint):
 print("Congratz!!..you won the game")
elif(mypoint==systmpoint):
 print("woah!! Its a tie")
else:
 print("I won the game..!!..Better luck next time")
