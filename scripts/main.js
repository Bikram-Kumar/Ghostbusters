var cnvs = document.getElementById('cnvs');
var ctx = cnvs.getContext('2d');
var gameArea = document.getElementById("gameArea");
var animationBucket = [];
var gameOver = false;
var hero;
var callerOfAnimationStarter;
var spawnerId;
var introPlayed = false;

var time1, deltaTime = 0;


function requestFullScreen() {
  gameArea.requestFullscreen();
  screen.orientation.lock("landscape");
}

window.onload = window.onresize = window.onorientationchange = fitCanvasToScreen ;

window.onclick = function () {
  if (!introPlayed) {
    intro.play();
    introPlayed = true;
  }
}
function gameLoop(timeSinceStart) {
  ctx.beginPath();
  ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  handleDrawingObjects();
  animationBucket.forEach(function (item) {
    item.draw();
  }
  );
  detectCollisions();
  removeBulletsOutsideCanvas();

  deltaTime = (timeSinceStart - time1) / 20;
  time1 = timeSinceStart;
  if (!gameOver) {
    callerOfAnimationStarter = requestAnimationFrame(gameLoop);
  }
}
function startGame() {
  hidePage("start");
  hero = new Hero(50, 150, 64);
  animationBucket.push(hero);
  spawnerId = setInterval(spawnGhosts, 4000);
  gameLoop();
  gameArea.addEventListener('click', shoot);
}

function stopGame() {
  gameArea.removeEventListener('click', shoot);
  hero.die();
  showPage("retry");
  document.getElementById("score-bar").style.top = cnvs.offsetTop + (140 * scaleFactor) + "px";
  document.getElementById("score-bar").innerHTML = "Your Score: " + score;
  setTimeout(function() {gameOver = true;}, 10);
  clearInterval(spawnerId);
  cancelAnimationFrame(callerOfAnimationStarter);
}
