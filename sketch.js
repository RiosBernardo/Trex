var trex, trexCorrendo, trexCollided;
var imagemChao, chao;
var imagemNuvem;
var chaoInvisivel;
var pontuacao = 0;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var estadoJogo = "estadoInicial";
var grupoDeObstaculos, grupoNuvens;
var gameOverImagem, gameOver;
var restart, restartImagem;
var somPulo, somMorte, somPlacar;
var larguraTela = window.innerWidth

function nuvens() {
  if (frameCount % 60 === 0){
    var nuvem = createSprite (larguraTela, 50, 40, 10);
    nuvem.y = Math.round (random (1,50))
    nuvem.velocityX = -5;
    nuvem.addImage (imagemNuvem);
    nuvem.depth = trex.depth
    trex.depth = trex.depth + 1
    nuvem.lifetime = larguraTela;
    grupoNuvens.add (nuvem)
  }
}

function restart2 (){
 estadoJogo = "estadoInicial";
 grupoDeObstaculos.destroyEach ()
 grupoNuvens.destroyEach ()
 restart.visible = false 
 gameOver.visible = false
 pontuacao = 0
 trex.changeAnimation ('correndo', trexCorrendo)
}

function obstaculos(){
  if (frameCount % 50 === 0){
    var obstaculo = createSprite (larguraTela, 180, 10, 40);
    obstaculo.velocityX = -(6+pontuacao/100);
    obstaculo.lifetime = larguraTela;
    obstaculo.scale = 0.95
    
    var tipo = Math.round (random(1, 6)) 
    switch (tipo){
      case 1 : obstaculo.addImage (obstaculo1)
        break
      case 2 : obstaculo.addImage (obstaculo2)
        break
      case 3 : obstaculo.addImage (obstaculo3)
        break
      case 4 : obstaculo.addImage (obstaculo4)
        break
      case 5 : obstaculo.addImage (obstaculo5)
        break
      case 6 : obstaculo.addImage (obstaculo6)
        break
        defaut : break
    }
        
        grupoDeObstaculos.add (obstaculo)
  }
}

function preload() {
  trexCorrendo = loadAnimation('trex1.png', 'trex3.png', 'trex4.png');
  trexCollided = loadAnimation ('trex_collided.png');
  
  imagemChao = loadAnimation ('ground2.png', 'ground2.png');  

  imagemNuvem = loadImage ('cloud.png');
  
  obstaculo1 = loadImage ('obstacle1.png');
  obstaculo2 = loadImage ('obstacle2.png');
  obstaculo3 = loadImage ('obstacle3.png');
  obstaculo4 = loadImage ('obstacle4.png');
  obstaculo5 = loadImage ('obstacle5.png');
  obstaculo6 = loadImage ('obstacle6.png');
  
  gameOverImage = loadImage ("gameOver.png");
  restartImage = loadImage ("restart.png");
  
  somPulo = loadSound ("jump.mp3");
  somMorte = loadSound ("die.mp3");
  somPlacar = loadSound ("checkPoint.mp3");
}

function setup(){
  createCanvas(larguraTela,200);
  
  trex = createSprite(50, 150, 20, 40);
  trex.addAnimation('correndo', trexCorrendo);
  trex.addAnimation('collided', trexCollided);
  trex.debug = false
  trex.setCollider ("circle", 0,0,35)
  
  chao = createSprite(300, 190, 600, 20);
  chao.addAnimation('chaoMovendo', imagemChao);
  
  chaoInvisivel = createSprite (300, 200, 600, 18);
  chaoInvisivel.visible = false;
  
  grupoDeObstaculos = new Group ()
  grupoNuvens = new Group ()
  
  gameOver = createSprite(larguraTela/2, 50, 40, 20);
  gameOver.addImage (gameOverImage);
  gameOver.visible = false;
  
  restart = createSprite(larguraTela/2, 100, 40, 20);
  restart.addImage (restartImage);
  restart.scale = 0.7
  restart.visible = false;
}

function draw(){
  background('white');

  text ('Sua Pontuação = ' + pontuacao, larguraTela-150, 40)
   
 trex.velocityY = trex.velocityY + 0.5;
  
  trex.collide(chaoInvisivel)
 
  if (estadoJogo === "estadoInicial"){
      pontuacao = pontuacao + Math.round (frameRate() / 60)
    
         if ((keyDown('space') || keyDown('up') || touches.length > 0 ) && trex.y > 100) {
    trex.velocityY = -10;
    somPulo.play ()
    touches = []
  }
      chao.velocityX = -(5+pontuacao);
    
      if (chao.x < larguraTela/2 ){
    chao.x = chao.width/2
  }
    
    obstaculos ();
    nuvens ();
    
    if (grupoDeObstaculos.isTouching (trex) ){
        estadoJogo = "estadoFinal"
        trex.changeAnimation ('collided', trexCollided)
        somMorte.play ()
        }
    
    if (pontuacao > 0 && pontuacao % 100 === 0){
        somPlacar.play ()
        }
    
      }else if(estadoJogo === "estadoFinal"){
        chao.velocityX = 0;
        grupoDeObstaculos.setVelocityXEach (0)
        grupoDeObstaculos.setLifetimeEach (-1)
        grupoNuvens.setVelocityXEach (0)
        grupoNuvens.setLifetimeEach (-1)
        gameOver.visible = true;
        restart.visible = true;
        
        if (mousePressedOver (restart) || touches.length > 0 ){
           restart2 ()
           touches = [];
            }
  }
  
  
  drawSprites();
}