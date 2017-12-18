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
  let imageHero = 'USS_Enterprise.png';
  let music = new Music(musicChoised);
  let background = new Background("./space.jpg");

  window.addEventListener('mousemove', onMouseUpdate, false);
  window.addEventListener('keydown', handleKeydown, false);

  function handleKeydown(e) {
    if (hero.isInsideZone(width, height)) {
      switch (e.keyCode) {
        default: break;
      }
    }
  };

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
    hero.draw(ctx);

    requestAnimationFrame(animate);
  }

  function isInsideZone(e) {
    return (
      (e.pageX >= 0 && e.pageX <= width) &&
      ((e.pageX + hero.width) >= 0 && (e.pageX + hero.width) <= width) &&

      (e.pageY >= 0 && e.pageY <= height) &&
      ((e.pageY + hero.height) >= 0 && (e.pageY + hero.height) <= height)
    )
  }

  function onMouseUpdate(e) {
    if (hero.isInsideZone(width, height) && isInsideZone(e)) {
      hero.x = e.pageX;
      hero.y = e.pageY;
    }
  }

  return {
    init: init
  }
}

function Music(musicChoised) {
  let audio;

  function play() {
    audio = new Audio(musicChoised);
    audio.play();

    audio.addEventListener("ended", function () {
      audio.play();
    });
  }

  function stop() {
    audio.stop();
  }

  function change(newMusic) {
    musicChoised = newMusic;
  }

  return {
    play: play,
    change: change,
    stop: stop
  }
}

class Background {
  constructor(imageSrc) {
    this.imageSrc = imageSrc;
  }

  move() {

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
    )
  }
}
