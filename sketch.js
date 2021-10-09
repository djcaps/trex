var trex, trex_running,trex_collided;
var ground,groundimg,invisibleground;
var cloud,cloudimg,clouds_group;
var obstacles,obs1,obs2,obs3,obs4,obs5,obs6,obstacle_group;
var GameOver,GameOverimg;
var Restart,Restartimg;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var CheckPS,DieS,JumpS;

function preload(){
  // Precarga una animacion (entre un conjunto de imagenes)
  trex_running = loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  //Este es para precargar(imagenes)
  groundimg=loadImage("ground2.png");
  cloudimg=loadImage("cloud.png");
  obs1=loadImage("obstacle1.png");
  obs2=loadImage("obstacle2.png");
  obs3=loadImage("obstacle3.png");
  obs4=loadImage("obstacle4.png");
  obs5=loadImage("obstacle5.png");
  obs6=loadImage("obstacle6.png");
  GameOverimg=loadImage("gameOver.png");
  Restartimg=loadImage("restart.png");
  //Este es para precargar el sonido
  CheckPS = loadSound ("checkPoint.mp3");
  DieS = loadSound ("die.mp3");
  JumpS = loadSound ("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  //crea el sprite del trex
  trex = createSprite(30,180,20,50);
  //Aquí agrego la animacion precargada a mi trex/sprite
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  //Configuración para el rayo de colición
  trex.setCollider("circle",0,0,55);
  trex.debug=true;
 
  //Todo lo relacionado para el suelo
  ground=createSprite(200,180,400,20);  
  ground.addImage("suelo",groundimg);
  
  
  //crea el suelo invisible
  invisibleground=createSprite(200,190,400,10);
  invisibleground.visible=false;
  
  //Creacion de grupos
  clouds_group = new Group();
  obstacles_group = new Group();
  
  //crea los sprites para Gameover y restart
  GameOver=createSprite(300,100);
  GameOver.addImage(GameOverimg);
  GameOver.scale=0.5;
  GameOver.visible=false;
  Restart=createSprite(300,140);
  Restart.addImage(Restartimg);
  Restart.scale=0.5;
  Restart.visible=false;
  
  
  score=0;
}
 
function draw() {
  background("plum");
 
 //Añadir puntaje
  stroke("black");
  textSize(15);
  fill("white");
  text("Score: "+score,500,70);
  
  
  if (gameState===PLAY){
    //velocidad del suelo aumenta de acuerdo a mi score 
    ground.velocityX=-(3+2*score/100);
      score=score+Math.round(getFrameRate()/60); 
    // Aquí mi sonido de CheckPS se reproduce cada 250 puntos de mi score  
    if (score>0 && score%250===0){
        CheckPS.play();
      }
     //Condición para hacer el suelo infinito
      if(ground.x<0){
         ground.x=ground.width/2;
      }
    //Aquí mi trex no puede saltar cuando este sea mayor a 150
    if(keyDown("space")&&trex.y>=150){
         trex.velocityY = -10;
         JumpS.play();
      }
    //Asigna mi gravedad
    trex.velocityY = trex.velocityY + 0.5;
       //Aparecen las nubes
       spawnClouds();
       //Aparecen los obstaculos
       spawnObstacles();
       if(trex.isTouching(obstacles_group)){
         gameState=END;
         DieS.play();
       }
  }
  else if(gameState===END){
      ground.velocityX=0;
      clouds_group.setVelocityXEach(0);
      //cambia la animacioon del trex
      trex.changeAnimation("collided",trex_collided);
      obstacles_group.setVelocityXEach(0);
      //establece el ciclo de vida de los objetos     para que nunca sean destruidos
      obstacles_group.setLifetimeEach(-1);
      clouds_group.setLifetimeEach(-1);
      trex.velocityY=0;
      GameOver.visible=true;
      Restart.visible=true;
      if(mousePressedOver(Restart)){
        reset();
      }
 } 
  
  trex.collide(invisibleground);
  
  
 
  drawSprites();
  
}
function spawnClouds(){
  if(frameCount%60===0){
    cloud=createSprite(600,100,40,10);
    cloud.velocityX=-3;
    cloud.y=Math.round(random(20,60));
    cloud.addImage(cloudimg);
    cloud.scale=0.8;
    //tiempo de vida para las nubes
    cloud.lifetime=230;
    //Ajusta la profundidad
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    //Añade cada nube al grupo de nubes
    clouds_group.add(cloud);
  }
}
function spawnObstacles(){
  if(frameCount%60===0){
    obstacles=createSprite(600,165,10,40);
   // aumenta la velocidad de los obstaculos dependiendo el score
    obstacles.velocityX=-(6+score/100);
    //Genera ostaculos al azar
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1: obstacles.addImage(obs1);
        break;
      case 2: obstacles.addImage(obs2);
        break;
      case 3: obstacles.addImage(obs3);
        break;
      case 4: obstacles.addImage(obs4);
        break;
      case 5: obstacles.addImage(obs5);
        break;
      case 6: obstacles.addImage(obs6);
        break;
        default: break;  
    }
    //Asigna una escala
    obstacles.scale=0.5;
    //Asigna tiempo de vida
    obstacles.lifetime=230;
    //Añade cada obstaculo a cada grupo de obstaculos
    obstacles_group.add(obstacles);
  }
}
function reset(){
  gameState=PLAY;
  GameOver.visible=false;
  Restart.visible=false;
  obstacles_group.destroyEach();
  clouds_group.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
  
}
