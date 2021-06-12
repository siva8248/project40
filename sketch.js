var START = 0;
var PLAY = 1;
var END = 2;
var gameState = START;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart,bg1;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  bg1  =  loadImage("bg.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  trex = createSprite(50,height-180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;
  ground = createSprite(200,height-70,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 3;
  ground.velocityX = -(6 + 3*score/100);
  gameOver = createSprite(width/2,height-500);
  gameOver.addImage(gameOverImg);
  restart = createSprite(width/2,height-350);
  restart.addImage(restartImg);
  gameOver.scale = 1.5;
  restart.scale = 1.5;
  gameOver.visible = false;
  restart.visible = false;
  invisibleGround = createSprite(width /2,height-10,width,125);
  invisibleGround.visible = false;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}

function draw() {
  background(bg1);
  fill("red");
  textSize(30);
  text("Score: "+ score,width-180,50);
  if (gameState===START){
    fill("red");
    text("SCORE 1000 TO WIN THE GAME",width-900,height/3);
    text("AVOID OBSTACLES OR YOU WILL HAVEW TO PLAY FROM START",width/6,height/3-100);
    text("PRESS 'ENTER' TO START",width-850, height-370);
    if(keyDown("enter") && gameState ===START){
      gameState = PLAY;
    }    
  }
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/50);
    if(touches.length>0||keyDown("space") && trex.y >= height-250) {
      trex.velocityY = -13;
      touches=[];
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles(); 
    if(score >1000){
      gameState = END;     
    }
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width-50,120,40,10);
    cloud.y = Math.round(random(40,height-250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -4; 
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.depth = restart.depth;
    restart.depth = restart.depth + 1;
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    cloudsGroup.add(cloud);
  } 
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(width-50,height-110,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = START;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}
