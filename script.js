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
    ctx.fillStyle="red";
    ctx.fillRect(0,0,width,height); 
    ctx.fillStyle="black";
    triangle(cursorX,cursorY);
    requestAnimationFrame(anime);
}

function fond(){
    
}


document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
function onMouseUpdate(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
}







  function triangle (x,y){

    ctx.beginPath();
    ctx.moveTo(x, y-30);
    ctx.lineTo(x-50, y+30);
    ctx.lineTo(x+50, y+30);
    ctx.fill();
    requestAnimationFrame( function(){
        triangle(cursorX,cursorY);
      })
  }

