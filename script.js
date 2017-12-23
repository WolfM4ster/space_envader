/*
  Pour mardi 19 décembre:
  - Créer une classe Monster
  - dans le constructor, on initialise un setInterval pour update la position du monstre en fonction de la vitesse (par exemple: 2pixels en Y/10 ms)
  1pixels en Y/10 ms
  1pixels en Y/50 ms
  Ajouter fonction detectCollision
  dedans, on va verifier que le hero ne touche aucun monstre en considérant la position du hero, des monstres avec leur tailles
  Et s'il y a collision, arret du jeu
  window.alert('STOP')
*/

window.onload = init;
var gf;

function init() {
  gf = new GameFramework();
  gf.init();
}

function GameFramework() {
  let canvas = document.querySelector("#myCanvas");
  let ctx = canvas.getContext("2d");
  let width, height;
  let hero;
  let musicChoised = "./Star Trek U.S.S. Enterprise Theme.mp3";
  let imageHero = "USS_Enterprise.png";
  let music = new Music(musicChoised);
  //let background = new Background("./space.jpg");
  let asteroids = [];
  let isAlive = true;
  let numberAsteroids = 1;
  let score = 0;
  let timerAstero = 0;
  let frequenceApparitionAsteroid = 60;
  let maxNumberShoot = 5;

  window.addEventListener('mousemove', onMouseUpdate, false);
  //window.addEventListener('click', shoot, false);
  //window.addEventListener('keydown', handleKeydown, false);
  
  function init() {
    width = canvas.width;
    height = canvas.height;
    music.play();
    initialiseHeroAndPosition();
  
    animate();
  }

  function displayMessage(ctx) {
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillText("Hello World",10,50);
    ctx.restore();
  }

  function initialiseHeroAndPosition() {
    let x = canvas.width / 2;
    let y = canvas.height - 350;
    hero = new Hero(imageHero, x, y, 67, 200);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    incrementScore();

    if(!isAlive) {
      window.alert("Game over");
    }
    if(timerAstero === frequenceApparitionAsteroid){
      createAsteroid(1);
      timerAstero=0;
      frequenceApparitionAsteroid = (Math.floor(Math.random() * 40) + 10);
    }
    hero.draw(ctx);
    drawAsteroids();
    timerAstero++;

    requestAnimationFrame(animate);
  }

  function incrementScore() {
    if(isAlive) {
      score++;
    }
  }

  function isInsideZone(e) {
    return (
      (e.pageX >= 0 && e.pageX <= width) &&
      ((e.pageX + hero.width) >= 0 && (e.pageX + hero.width) <= width) &&

      (e.pageY >= 0 && e.pageY <= height) &&
      ((e.pageY + hero.height) >= 0 && (e.pageY + hero.height) <= height)
    );
  }

  function createAsteroid(n) {
    for(var i = 0; i < n; i++) {
      let img = "./asteroid_brown.jpg";
      let x = width * Math.random();
      let y = 0;
      let w = 40 + 10 * Math.random();
      let h = 40 + 10 * Math.random();
      let vx = 0;
      let vy = 2.5;
  
      let asteroid = new Asteroid(img, x, y, vx, vy, w, h);
      asteroids.push(asteroid);
    }
  }

  function drawAsteroids() {
    for(i = 0; i < asteroids["length"]; i++){
      asteroids[i].draw(ctx);
      asteroids[i].move();
      
      if(detectCollision(hero, asteroids[i])) {
        isAlive = false;
      }

      if(asteroids[i].getY() > 650) {
        asteroids.splice(i, 1);
      }
    }
  }

  function createShoot() {
      let x = hero.getX();
      let y = hero.getY();
      let w = 10;
      let h = 20;
      let vx = 0;
      let vy = 5;

      let shoot = new Shoot(x, y, vx, vy, w, h);
      monsters.push(monster);
  }

  function drawShoot() {
    for(i = 0; i < monsters["length"]; i++){
      monsters[i].draw(ctx);
      monsters[i].move();
      
      if(detectCollision(hero, monsters[i])) {
        isAlive = false;
      }

      if(monsters[i].getY() > 650) {
        monsters.splice(i, 1);
      }
    }
  }

  function onMouseUpdate(e) {
    if (hero.isInsideZone(width, height) && isInsideZone(e)) {
      hero.positionX = e.pageX;
      hero.positionY = e.pageY;
    }
  }

  function detectCollision(target, enemy) {
    return ((target.getX() < enemy.getX() + enemy.getWidth()) && 
            (target.getX() + target.getWidth() > enemy.getX()) &&
            (target.getY() < enemy.getY() + enemy.getHeight()) &&
            (target.getHeight() + target.getY() > enemy.getY()));
  }

  return {
    init: init
  }
}

class ObjectGraphical {
  constructor(imageSrc, positionX, positionY, vitesseX, vitesseY, width, height) {
    this.imageSrc = imageSrc;
    this.positionX = positionX;
    this.positionY = positionY;
    this.vitesseX = vitesseX;
    this.vitesseY = vitesseY;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.save();
    var img = new Image();
    img.src = this.imageSrc;
    ctx.drawImage(img, this.positionX, this.positionY, this.width, this.height);
    ctx.restore();
  }

  isInsideZone(width, height) {
    return (
      (this.positionX >= 0 && this.positionX <= width) &&
      ((this.positionX + this.width) >= 0 && (this.positionX + this.width) <= width) &&

      (this.positionY >= 0 && this.positionY <= height) &&
      ((this.positionY + this.height) >= 0 && (this.positionY + this.height) <= height)
    );
  }
}

class Asteroid extends ObjectGraphical {
  constructor(imageSrc, positionX, positionY, vitesseX, vitesseY, width, height) {
    super(imageSrc, positionX, positionY, vitesseX, vitesseY, width, height);
  }

  draw(ctx) {
    super.draw(ctx);
  }

  isInsideZone(width, height) {
    return super.isInsideZone(width, height);
  }

  move() {
    this.positionY += this.vitesseY;
  }

  getX(){
    return this.positionX;
  }  
  
  getY(){
    return this.positionY;
  }   

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

class Hero extends ObjectGraphical {
  constructor(imageSrc, positionX, positionY, width, height) {
    super(imageSrc, positionX, positionY, 0, 0, width, height);
  }

  draw(ctx) {
    super.draw(ctx);
  }

  isInsideZone(width, height) {
    return super.isInsideZone(width, height);
  }

  getX(){
    return this.positionX;
  }  
  
  getY(){
    return this.positionY;
  }   

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

class Shoot extends ObjectGraphical{
  constructor(positionX, positionY, vitesseX, vitesseY, width, height) {
    super(null, positionX, positionY, vitesseX, vitesseY, width, height);
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#ff6666";
    ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    ctx.restore();
  }

  move() {
    this.positionY -= this.vitesseY;
  }

  getX(){
    return this.positionX;
  }  
  
  getY(){
    return this.positionY;
  }   

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

function Music(musicChoised) {
  let audio;

  function play() {
    audio = new Audio(musicChoised);
    audio.loop = true;
    audio.play(); 
  }

  function stop() {
    audio.stop();
  }

  function change(newMusic) {
    musicChoised = newMusic;
  }

  return {
    play:play,
    stop:stop,
    change:change
  }
}

class Background {
  constructor(imageSrc) {
    this.imageSrc = imageSrc;
  }

  scroll() {

  }
}
