window.onload = init;

let canvas;
let ctx;
let width;
let height;
let cursorX;
let cursorY;

function init() {
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;
  x = 50;
  y = 30;

// triangle(cursorX,cursorY);

anime();

}


function anime(){
    ctx.clearRect(0, 0, width, height);
    
    triangle(cursorX,cursorY);

    requestAnimationFrame(anime);
}


document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function onMouseUpdate(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
}

  function triangle (x,y){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y-30);
    ctx.lineTo(x-50, y+30);
    ctx.lineTo(x+50, y+30);
    ctx.fill();
    ctx.restore();
  }

