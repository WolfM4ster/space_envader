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
  let tabShoot = [];
  let gameMode = 0;
  let compteurMenu = 0;
  let img = new Image();
  let imgJouerPress = new Image();
  let imgJouer = new Image();
  let imgGameOver = new Image();
  let messageScoreDuringGame = "Score : ";
  let messageScoreGameOver = "Votre score est de ";
  //let imagesAsteroid = ["", ]
  

  window.addEventListener('mousemove', onMouseUpdate, false);
  window.addEventListener('click', createShoot, false);
  window.addEventListener("keypress", keypress);
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
    hero = new Hero(imageHero, x, y, 67, 170);
  }

  function animate() {
    if (gameMode == 0) {
      menu();
    } 
    
    else if (gameMode == 1) {
      ctx.clearRect(0, 0, width, height);

      displayScore(messageScoreDuringGame, 10, 30);

      if (!isAlive) {
        gameMode = 2;
      }
      if (timerAstero === frequenceApparitionAsteroid) {
        createAsteroid(1);
        timerAstero = 0;
        frequenceApparitionAsteroid = (Math.floor(Math.random() * 40) + 10);
      }

      hero.draw(ctx);
      drawAsteroids();
      drawShoot();
      timerAstero++;
    }
    if (gameMode == 2) {
      gameOver();
    }

    requestAnimationFrame(animate);
  }

  function keypress(e) {
    if (gameMode == 0) {
      gameMode = 1;
    } else {
      gameMode = 1;
    }
  }

  function displayScore(message, x, y) {
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(message + score, x, y);
    ctx.restore();
  }

  function incrementScore() {
    if (isAlive) {
      score += 50;
    }
  }

  function menu() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    imgJouerPress.src = "jouer3.png";
    imgJouer.src = "jouer2.png";
    img.src = "menuLayout.png";
    ctx.drawImage(img, 0, 0, width, height);
    if (compteurMenu > 30) {
      ctx.drawImage(imgJouerPress, 0, 0, width, height);
      if (compteurMenu === 60) {
        compteurMenu = 0;
      }
    } else {
      ctx.drawImage(imgJouer, 0, 0, width, height);
    }
    compteurMenu++;
  }

  function gameOver() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    imgGameOver.src = "GameOver.png";
    ctx.drawImage(imgGameOver, 0, 0, width, height);
    displayScore(messageScoreGameOver, height / 2, width / 2);
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
    for (var i = 0; i < n; i++) {
      let img = "./asteroid_brown.jpg";
      let x = width * Math.random();
      let y = 0;
      let w = 40 + 10 * Math.random();
      let h = 40 + 10 * Math.random();
      let vx = 0;
      let vy = 3 + 2 * Math.random();

      let asteroid = new Asteroid(img, x, y, vx, vy, w, h);
      asteroids.push(asteroid);
    }
  }

  function drawAsteroids() {
    for (i = 0; i < asteroids.length; i++) {
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
    let x = hero.getX() + 30;
    let y = hero.getY();
    let w = 5;
    let h = 10;
    let vx = 0;
    let vy = 5;

    let shoot = new Shoot(x, y, vx, vy, w, h);
    tabShoot.push(shoot);
  }

  function drawShoot() {
    for (var i = 0; i < tabShoot.length; i++) {
      tabShoot[i].draw(ctx);
      tabShoot[i].move();

      for (var j = 0; j < asteroids.length; j++) {
        if (typeof tabShoot[i] !== "undefined") {
          if(detectCollision(tabShoot[i], asteroids[j])) {
            asteroids.splice(j, 1);
            tabShoot.splice(i, 1);
            incrementScore();
          }
        }
      }
      if (typeof tabShoot[i] !== "undefined") {
        if(tabShoot[i].getY() < 0) {
          tabShoot.splice(i, 1);
        }
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

  getX() {
    return this.positionX;
  }

  getY() {
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

  getX() {
    return this.positionX;
  }

  getY() {
    return this.positionY;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

class Shoot extends ObjectGraphical {
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

  getX() {
    return this.positionX;
  }

  getY() {
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
    play: play,
    stop: stop,
    change: change
  }
}

/*class Background {
  constructor(imageSrc) {
    this.imageSrc = imageSrc;
  }

  scroll() {

  }
}*/