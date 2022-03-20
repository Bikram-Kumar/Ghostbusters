var imageFolder;
var imageScalar;
var score = 0;
var intro = createSound("introSound.aac");
var bells = createSound("bells.wav");
var gunshot = createSound("gunshot.m4a");
var zombieGrowl = createSound("zombie-growl.aac");
var skeletonMoan = createSound("skelMoan.aac");
var zomDie = createSound("zomDie.aac");
var skelDie = createSound("skelDie.aac");

var soundsList = {
  intro: "introSound.aac",
  bells: "bells.wav",
  gunshot: "gunshot.m4a",
  zombieGrowl: "zombie-growl.aac",
  skeletonMoan: "skelMoan.aac",
  zomDie: "zomDie.aac",
  skelDie: "skelDie.aac"
} ;
for (var soundName in soundsList) {
  soundsList[soundName] = createSound(soundsList[soundName]);
}


function fitCanvasToScreen() {
  var sW = window.innerWidth;
  var sH = window.innerHeight;

  if (sW > sH) {
    cnvs.height = sH;
    cnvs.width = 3/2 * sH;
  } else {
    cnvs.width = sW;
    cnvs.height = 2/3 * sW;
  }
  scaleFactor = (cnvs.width/480).toFixed(4); // scaleFactor = cnvs.height/320; both have same value
  document.documentElement.style.fontSize = (20 * scaleFactor) + "px";

  if (scaleFactor < 2) {
    imageFolder = "assets/images/sd/";
    imageScalar = 1;
  } else {
    imageFolder = "assets/images/hd/";
    imageScalar = 2;
  }
  rearrangeLayout();
}

function rearrangeLayout() {
  var title = document.getElementById('GHOSTBUSTERS');
  title.style.top = cnvs.offsetTop + (60 * scaleFactor) + "px";
  document.getElementById('game-over').style.top = cnvs.offsetTop + (50 * scaleFactor) + "px";
}

function hidePage(name) {
  if (name == "start") {
    document.getElementById("start-page").style.display = "none";
    document.getElementById("score-bar").style.display = "inline-block";
  } else if (name == "retry") {
    document.getElementById("retry-page").style.display = "none";
  }
}
function showPage(name) {
  if (name == "start") {
    document.getElementById("start-page").style.display = "inline-block";
  } else if (name == "retry") {
    document.getElementById("retry-page").style.display = "inline-block";
    document.getElementById("retryBtn").style.top = cnvs.offsetTop + (250 * scaleFactor) + "px";
  }
}

function updateScore() {
  document.getElementById('score-bar').innerHTML = "Score: " + score;
}

function createSound(fileName) {
  var soundFolder = "assets/sounds/";
  var tempAud = new Audio(soundFolder + fileName);
  return tempAud;
}