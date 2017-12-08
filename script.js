window.onload = init;
var gf;

function init() {
  gf = new GameFramework();
  gf.init();
}

function GameFramework() {
  let canvas, ctx, width, height;
  let hero;

  function init() {
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    let x = canvas.width / 2;
    let y = canvas.height - 100;

    hero = new Hero(x, y);
  
    animate();
  }

  function animate() {
      ctx.clearRect(0, 0, width, height);
      
      hero.draw(ctx);

      //requestAnimationFrame(animate);
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



/*function onMouseUpdate(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
}*/

  /*function triangle (x,y){

    ctx.beginPath();
    ctx.moveTo(x, y-30);
    ctx.lineTo(x-50, y+30);
    ctx.lineTo(x+50, y+30);
    ctx.fill();
    requestAnimationFrame( function(){
        triangle(cursorX,cursorY);
      })
  }*/

