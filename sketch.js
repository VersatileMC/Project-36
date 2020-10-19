//Create variables here
var dog;
var happyDog;
var Dog

var database;

var gameState = 0;
var gameStateRead;

var foodS;
var foodStock;

var feed,addFood;

var fedTime,lastFed;

var foodObj;

var bedroom,garden,washroom;

var sadDog

function preload()
{
  //load images here (okay whitehat :D)
  dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");

  bedroom = loadImage("virtual pet images/Bed Romm.pmg");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");

  sadDog = loadImage("virtual pet images/deadDog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);

  //read game state from database
  gameStateRead=database.ref("gameState");
  gameStateRead.on("value",function(data){
    gameState=data.val();
  });

  Dog = createSprite(250,250,10,10);
  Dog.addImage(dog);
  Dog.scale = 0.5;
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  foodObj = new Food();

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87)
  
  //add styles here

 foodObj.display();

  drawSprites();

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }else if (lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed + " AM", 350,30);
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    Dog.remove();
  }else{
    feed.show();
    addFood.show();
    Dog.addImage(sadDog);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

}

function update(state){
  database.ref("/").update({
    gameState:state
  });
}

//Function to read values from database
function readStock(data){
  foodS = data.val();
}

//Function to write vlues in Database
function writeStock(x){

  database.ref("/").update({
    Food:x
  })
}

//function to update food stock and last fed time
function feedDog(){
  Dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}