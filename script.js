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
    if(hero.isInsideZone(width, height)) {
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
    }
  };

  function init() {
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    //playMusic();

    initialiseHeroAndPosition();
  
    animate();
  }

  function initialiseHeroAndPosition() {
    let x = canvas.width / 2;
    let y = canvas.height - 350;
    
    hero = new Hero(x, y, 67, 200);
  }

  function animate() {
      ctx.clearRect(0, 0, width, height);
      
      hero.draw(ctx);

      requestAnimationFrame(animate);
  }

  function onMouseUpdate(e) {
    if(hero.isInsideZone(width, height)) {
      hero.x = e.pageX;
      hero.y = e.pageY;
    } 
  }

  function playMusic() {
    audio = new Audio('C:/Users/Hichem/Music/zelda/Song of Unhealing - The legend of Zelda Majoras Mask.mp3');
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
  constructor(positionX, positionY, width, height) {
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.save();
    var img = new Image();
    img.src = 'USS_Enterprise.png';
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    ctx.restore();
  };

  isInsideZone(width, height) {
    if (
        (this.x >= 0 && this.x <= width) &&
        ((this.x + this.width) >= 0 && (this.x + this.width) <= width) &&

        (this.y >= 0 && this.y <= height) &&
        ((this.y + this.height) >= 0 && (this.y + this.height) <= height)
    ) {
        return true;
    }
    return false;
}
}
