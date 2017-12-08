window.onload = init;
var gf;

function init() {
  gf = new GameFramework();
  gf.init();
}

function GameFramework() {
  let canvas, ctx, width, height;
  let hero;
  let audio;

  window.addEventListener('mousemove', onMouseUpdate, false);
  window.addEventListener('keydown', handleKeydown, false);
 
  function handleKeydown(e){
    switch(e.keyCode) {
      case 37:
        //left arrow
        hero.x -=10;
        break;
      
      case 38:
        //up arrow
        hero.y -=10;
        break;

      case 39: 
        //right arrow
        hero.x +=10;
        break;
      
      case 40:
        //down arrow
        hero.y +=10;
      default:
        break;
    }
  };

  function init() {
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    playMusic();

    initialiseHeroAndPosition();
  
    animate();
  }

  function initialiseHeroAndPosition() {
    let x = canvas.width / 2;
    let y = canvas.height - 100;

    hero = new Hero(x, y);
  }

  function animate() {
      ctx.clearRect(0, 0, width, height);
      
      hero.draw(ctx);

      requestAnimationFrame(animate);
  }

  function onMouseUpdate(e) {
    hero.x = e.pageX;
    hero.y = e.pageY;
  }

  function playMusic() {
    audio = new Audio('Undertale OST - Battle Against A True Hero Extended.mp3');
    audio.play();
  }

  function stopMusic() {
    audio.stop();
  }
  
  return {
    init:init
  }
}

class Hero {
  constructor(positionX, positionY) {
    this.x = positionX;
    this.y = positionY;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 50, this.y + 40);
    ctx.lineTo(this.x + 50, this.y + 40);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore();
  }
}

