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

  //let musicChoised = "./Star Trek U.S.S. Enterprise Theme.mp3";
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

  let imageHero = "USS_Enterprise.png";
  
  //let musicGame = new Music();
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
    let x = canvas.width / 2;
    let y = canvas.height - 350;
    hero = new Hero(imageHero, x, y, 67, 170);
  }

  function animate() {
    if (gameMode == 0) {
      menu();
    } 
    
    else if (gameMode == 1) {
      audioBackgroundGame.play();
      audioBackgroundGameOver.stop();
      audioBackgroundMenu.stop();
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
    audioBackgroundGameOver.currentTime = 0;
    audioBackgroundGame.currentTime = 0;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    imgJouerPress.src = "jouer3.png";
    imgJouer.src = "jouer2.png";
    img.src = "menuLayout.png";
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

  function gameOver() {
    audioBackgroundGameOver.play();
    audioBackgroundMenu.currentTime = 0;
    audioBackgroundMenu.currentTime = 0;
    //musicBackground.stop();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    imgGameOver.src = "GameOver.png";
    ctx.drawImage(imgGameOver, 0, 0, width, height);
    displayScore(messageScoreGameOver, height / 2, width / 2);
  }

  function createAsteroid(n) {
    for (var i = 0; i < n; i++) {
      let img = "./asteroid_brown.jpg";
      let x = width * Math.random();
      let y = 0;
      let w = 40 + 10 * Math.random();
      let h = 40 + 10 * Math.random();
      let vx = 0;
      let vy = 2 + 2 * Math.random();

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
        if(score != 0) {
          score -= 50;
        }
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
    audioShoot.currentTime = 0;
    audioShoot.play();
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
            audioExplosion.currentTime = 0;
            audioExplosion.play();
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
    hero.positionX = e.pageX -35;
    hero.positionY = e.pageY;
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
}

class Asteroid extends ObjectGraphical {
  constructor(imageSrc, positionX, positionY, vitesseX, vitesseY, width, height) {
    super(imageSrc, positionX, positionY, vitesseX, vitesseY, width, height);
  }

  draw(ctx) {
    super.draw(ctx);
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

/*function Music(musicChoised) {
  let audio;

  function playLoop() {
    audio = new Audio(musicChoised);
    audio.loop = true;
    audio.play();
  }

  function stop() {
    audio.pause();
    audio.currentTime = 0;
  }

  function changeAndPlay(newMusic) {
    audio = new Audio(newMusic);
    audio.loop = true;
    audio.play();
  }

  return {
    playLoop: playLoop,
    stop: stop,
    changeAndPlay: changeAndPlay
  }
}*/
