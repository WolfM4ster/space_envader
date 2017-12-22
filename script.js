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
  let monsters = [];
  let isAlive = true;
  let numberMonsters = 1;
  let score = 0;
  let timerAstero = 0;
  let frequenceApparitionMonster = 60;

  window.addEventListener('mousemove', onMouseUpdate, false);
  //window.addEventListener('keydown', handleKeydown, false);
  
  function init() {
    width = canvas.width;
    height = canvas.height;
    music.play();
    initialiseHeroAndPosition();
  
    animate();
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
    if(timerAstero === frequenceApparitionMonster){
      createMonster(1);
      timerAstero=0;
      frequenceApparitionMonster = (Math.floor(Math.random() * 40) + 10);
    }
    hero.draw(ctx);
    drawMonsters();
    timerAstero++;

    requestAnimationFrame(animate);
  }

  function incrementScore() {
    if(isAlive) {
      score++;
      console.log(score);
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

  function createMonster(n) {
    for(var i = 0; i < n; i++) {
      let img = "./asteroid.jpg";
      let x = width * Math.random();
      let y = 0;
      let w = 40 + 10 * Math.random();
      let h = 40 + 10 * Math.random();
      let vx = 0;
      let vy = 2.5;
  
      let monster = new Monster(img, x, y, vx, vy, w, h);
      monsters.push(monster);
    }
  }

  function drawMonsters() {
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

  /*function createShoot(n) {
    for(var i = 0; i < n; i++) {
      let img = "./asteroid.jpg";
      let x = width * Math.random();
      let y = 0;
      let w = 40 + 10 * Math.random();
      let h = 40 + 10 * Math.random();
      let vx = 0;
      let vy = 2.5;
  
      let monster = new Monster(img, x, y, vx, vy, w, h);
      monsters.push(monster);
    }
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
  }*/
  /*function removeEnnemiesOutCanvas() {
    for(var i = 0; i < monsters["length"]; i++) {
      if(ennemi.getY() > 650) {
        monsters.splice(i, 1);
      }
    }
  }*/

  function onMouseUpdate(e) {
    if (hero.isInsideZone(width, height) && isInsideZone(e)) {
      hero.x = e.pageX;
      hero.y = e.pageY;
    }
  }

  function detectCollision(player, ennemi) {
    return ((player.getX() < ennemi.getX() + ennemi.getWidth()) && 
            (player.getX() + player.getWidth() > ennemi.getX()) &&
            (player.getY() < ennemi.getY() + ennemi.getHeight()) &&
            (player.getHeight() + player.getY() > ennemi.getY()));
  }

  return {
    init: init
  }
}

class Monster {
  constructor(imageSrc, positionX, positionY, vitesseX, vitesseY, width, height) {
    this.imageSrc = imageSrc;
    this.x = positionX;
    this.y = positionY;
    this.vitesseX = vitesseX;
    this.vitesseY = vitesseY;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.save();
    var img = new Image();
    img.src = this.imageSrc;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  move() {
    this.y += this.vitesseY;
  }

  isInsideZone(width, height) {
    return (
      (this.x >= 0 && this.x <= width) &&
      ((this.x + this.width) >= 0 && (this.x + this.width) <= width) &&

      (this.y >= 0 && this.y <= height) &&
      ((this.y + this.height) >= 0 && (this.y + this.height) <= height)
    );
  }

  getX(){
    return this.x;
  }  
  
  getY(){
    return this.y;
  }   

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

class Hero {
  constructor(imageSrc, positionX, positionY, width, height) {
    this.imageSrc = imageSrc;
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.save();
    var img = new Image();
    img.src = this.imageSrc;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  isInsideZone(width, height) {
    return (
      (this.x >= 0 && this.x <= width) &&
      ((this.x + this.width) >= 0 && (this.x + this.width) <= width) &&

      (this.y >= 0 && this.y <= height) &&
      ((this.y + this.height) >= 0 && (this.y + this.height) <= height)
    );
  }

  getX(){
    return this.x;
  }  
  
  getY(){
    return this.y;
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
