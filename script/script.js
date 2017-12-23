// Space Marine Game on js by used the canvas element
// Edited By Abdoullah REZGUI & Adrien ZOCCO

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

  //All the music used in the game
  let musicExplosion = "./music/explosion.mp3";
  let musicShoot = "./music/shoot.mp3";
  let musicGameOver = "./music/gameOver.wav";
  let musicDuringGame = "./music/jeu.mp3";
  let musicMenu = "./music/musicMenu.mp3";

  let audioShoot = new Audio(musicShoot);
  let audioExplosion = new Audio(musicExplosion);
  let audioBackgroundMenu = new Audio(musicMenu);
  let audioBackgroundGame = new Audio(musicDuringGame);
  let audioBackgroundGameOver = new Audio(musicGameOver);

  audioBackgroundMenu.loop = true;
  audioBackgroundGame.loop = true;
  audioBackgroundGameOver.loop = true;

  let hero;
  let imageHero = "./images/airCombat.png";
  let isAlive = true;
  let score = 0;
  let initialPostionHeroX = canvas.width / 2;
  let initialPostionHeroY = canvas.height - 350;

  let diminutionScoreByAsteroidPassage = 10;

  let asteroids = [];
  let numberAsteroids = 1;
  let imageAsteroid = "./images/asteroid_brown.jpg";

  let timerAstero = 0;
  let frequenceApparitionAsteroid = 60;
  let bonusOnShootAsteroid = 50;

  let tabShoot = [];
  let gameMode = 0;
  let compteurMenu = 0;

  let img = new Image();
  let imgJouerPress = new Image();
  let imgJouer = new Image();
  let imgGameOver = new Image();

  let messageScoreDuringGame = "Score : ";
  let messageScoreGameOver = "Votre score est de ";

  let weightShoot = 5;
  let heightShoot = 10;
  let rangeXShoot = 0;
  let rangeYShoot = 10;

  window.addEventListener('mousemove', onMouseUpdate, false);
  window.addEventListener('click', createShoot, false);
  window.addEventListener("keypress", keypress);

  function init() {
    width = canvas.width;
    height = canvas.height;
    audioBackgroundMenu.play();
    initialiseHeroAndPosition();

    animate();
  }

  function initialiseHeroAndPosition() {
    let x = initialPostionHeroX;
    let y = initialPostionHeroY;
    hero = new Hero(imageHero, x, y, 95, 120);
  }

  //Main interation function of the game, we sorry to put so much elements on it :'(
  function animate() {
    if (gameMode === 0) {
      displayMainMenu();
    } 
    else if (gameMode === 1) {
      audioBackgroundGame.play();
      audioBackgroundGameOver.currentTime = 0;
      audioBackgroundMenu.currentTime = 0;
      ctx.clearRect(0, 0, width, height);
      displayScore(messageScoreDuringGame, 10, 30);

      //if we died gameMode = 2 -> gameOver
      if (!isAlive) {
        gameMode = 2;
      }
      //timer for create asteroids
      if (timerAstero === frequenceApparitionAsteroid) {
        createAsteroid(1);
        timerAstero = 0;
        frequenceApparitionAsteroid = (Math.floor(Math.random() * 40) + 10);
      }

      //draw ship, asteroids and shoot
      hero.draw(ctx);
      drawAsteroids();
      drawShoot();
      timerAstero++;
    }
    //game over
    if (gameMode === 2) {
      displayMenuGameOver();
    }

    requestAnimationFrame(animate);
  }

  // Display the first menu on the canvas
  function displayMainMenu() {
    audioBackgroundMenu.play();
    audioBackgroundGameOver.currentTime = 0;
    audioBackgroundGame.currentTime = 0;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    imgJouerPress.src = "./images/jouer3.png";
    imgJouer.src = "./images/jouer2.png";
    img.src = "./images/menuLayout.png";
    ctx.drawImage(img, 0, 0, width, height);
    if (compteurMenu > 30) {
      ctx.drawImage(imgJouerPress, 0, 0, width, height);
      if (compteurMenu == 60) {
        compteurMenu = 0;
      }
    } else {
      ctx.drawImage(imgJouer, 0, 0, width, height);
    }
    compteurMenu++;
  }

  //Display the current score of player
  function displayScore(message, x, y) {
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(message + score, x, y);
    ctx.restore();
  }

  // create asteroid, in random x position
  function createAsteroid(n) {
    for (var i = 0; i < n; i++) {
      let img = imageAsteroid;
      let x = width * Math.random();
      let y = 0;
      let w = 40 + 10 * Math.random();
      let h = 40 + 10 * Math.random();
      let vx = 0;
      let vy = 2 + 1 * Math.random();

      let asteroid = new Asteroid(img, x, y, vx, vy, w, h);
      asteroids.push(asteroid);
    }
  }

  //Draw Asteroid object, move it, detect collision with Hero, and discrease score when element isn't shoot by player
  function drawAsteroids() {
    for (i = 0; i < asteroids.length; i++) {
      asteroids[i].draw(ctx);
      asteroids[i].move();

      //condition for verify if we dead or not
      if (detectCollision(hero, asteroids[i])) {
        isAlive = false;
      }

      //deletion of asteroids out of the screen
      if (asteroids[i].getY() > 650) {
        asteroids.splice(i, 1);
        if (score != 0) {
          score -= diminutionScoreByAsteroidPassage;
        }
      }
    }
  }

  //Draw shoot object, move it, and play sound when it detect collision with asteroid
  function drawShoot() {
    for (var i = 0; i < tabShoot.length; i++) {
      tabShoot[i].draw(ctx);
      tabShoot[i].move();

      for (var j = 0; j < asteroids.length; j++) {
        if (typeof tabShoot[i] !== "undefined") {
          if (detectCollision(tabShoot[i], asteroids[j])) {
            asteroids.splice(j, 1);
            tabShoot.splice(i, 1);
            playSound(audioExplosion);
            incrementScoreOnShootAsteroid();
          }
        }
      }

      if (typeof tabShoot[i] !== "undefined") {
        if (tabShoot[i].getY() < 0) {
          tabShoot.splice(i, 1);
        }
      }
    }
  }

  // Display the menu of gameOver
  function displayMenuGameOver() {
    audioBackgroundGameOver.play();
    audioBackgroundMenu.currentTime = 0;
    audioBackgroundGame.currentTime = 0;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    imgGameOver.src = "./images/GameOver.png";
    ctx.drawImage(imgGameOver, 0, 0, width, height);
    displayScore(messageScoreGameOver, height / 2, width / 2);
  }

  //Detect collision between two elements
  function detectCollision(target, enemy) {
    return ((target.getX() < enemy.getX() + enemy.getWidth()) &&
      (target.getX() + target.getWidth() > enemy.getX()) &&
      (target.getY() < enemy.getY() + enemy.getHeight()) &&
      (target.getHeight() + target.getY() > enemy.getY()));
  }

  function playSound(objectAudio) {
    objectAudio.currentTime = 0;
    objectAudio.play();
  }

  function incrementScoreOnShootAsteroid() {
    score += bonusOnShootAsteroid;
  }

  //position of hero = position of mouse
  function onMouseUpdate(e) {
    hero.positionX = e.pageX - 35;
    hero.positionY = e.pageY;
  }

  function createShoot() {
    let x = hero.getX() + 47;
    let y = hero.getY();
    let weightShoot = 5;
    let heightShoot = 10;
    let rangeXShoot = 0;
    let rangeYShoot = 10;

    let shoot = new Shoot(x, y, rangeXShoot, rangeYShoot, weightShoot, heightShoot);
    tabShoot.push(shoot);
    playSound(audioShoot);
  }

  //if we are in the menu and we press button, we play
  function keypress() {
    if (gameMode === 0) {
      gameMode = 1;
    } else if (gameMode === 2) {
      renitialiseGame();
    }
  }

  function renitialiseGame() {
    gameMode = 1;
    isAlive = true;
    tabShoot = [];
    asteroids = [];
    score = 0;
  }

  return {
    init: init
  }
}

class ObjectGraphical {
  constructor(imageSrc, positionX, positionY, rangeX, rangeY, width, height) {
    this.imageSrc = imageSrc;
    this.positionX = positionX;
    this.positionY = positionY;
    this.rangeX = rangeX;
    this.rangeY = rangeY;
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
}

class Asteroid extends ObjectGraphical {
  constructor(imageSrc, positionX, positionY, rangeX, rangeY, width, height) {
    super(imageSrc, positionX, positionY, rangeX, rangeY, width, height);
  }

  draw(ctx) {
    super.draw(ctx);
  }

  move() {
    this.positionY += this.rangeY;
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
  constructor(positionX, positionY, rangeX, rangeY, width, height) {
    super(null, positionX, positionY, rangeX, rangeY, width, height);
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#ff6666";
    ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    ctx.restore();
  }

  move() {
    this.positionY -= this.rangeY;
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