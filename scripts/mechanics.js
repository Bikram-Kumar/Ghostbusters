var ghostSpeed = 1;
var skeletonSpeed = 3;
var bulletSpeed = 15;

class AllObjects {
  constructor(x1, y1, width) {
    this.x1 = x1;
    this.y1 = y1;
    this.width = width;
  }
  get x2() {
    return Math.round(this.x1 + this.width);
  }
  get height() {
    return Math.round(this.width * this.sh/this.sw);
  }
  get y2() {
    return Math.round(this.y1 + this.height);
  }

  draw() {
    let s = scaleFactor;
    ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x1 * s, this.y1 * s, this.width * s, this.height * s);
  }
}

class Hero extends AllObjects {
  constructor(x1, y1, width) {
    super(x1, y1, width);
    this.img = ImageObject('gb-hero.png');
    this.sx = 0;
    this.sy = 0;
  }
  get sw() {
    return 112 * imageScalar;
  }
  get sh() {
    return 108 * imageScalar;
  }
  die() {
    this.sx = 2 * this.sw;
    this.draw();
    zombieGrowl.play();
  }
  
}

class Bullet extends AllObjects {
  constructor(x1, y1, width) {
    super(x1, y1, width);
    this.img = ImageObject('bullet.png');
  }
  draw() {
    let s = scaleFactor;
    ctx.drawImage(this.img, this.x1 * s, this.y1 * s, this.width * s, this.height * s);
  }

  get height() {
    return Math.round(this.width * this.img.height/this.img.width);
  }
}

class Ghost extends AllObjects {
  constructor(x1, y1, width) {
    super(x1, y1, width);
    this.health = 100;
    this.img = ImageObject('gb-ghost.png');
    this.deathImg = ImageObject('gb-ghost-die.png');
    this.sx = 0;
    this.sy = 0;
    this.frameNumber = 1;
    this.growlSound = zombieGrowl.cloneNode();
    this.dieSound = zomDie.cloneNode();
    this.died = false;
  }
  get sw() {
    return 64 * imageScalar;
  }
  get sh() {
    return 124 * imageScalar;
  }
  static frameCount = 4;

  animate() {
    var obj = this;
    obj.sx += obj.sw;
    obj.frameNumber += 1;

    if (obj.frameNumber > Ghost.frameCount) {
      obj.sx = 0;
      obj.frameNumber = 1;
    }
  }
  
  die() {
    this.img = this.deathImg;
    this.growlSound.pause();
    this.dieSound.play();
  }
  
  growl() {
    if (!this.died) {
    this.growlSound.currentTime = 0;
    this.growlSound.play();
    }
  }
}



class Skeleton extends AllObjects {
  constructor(x1, y1, width) {
    super(x1, y1, width);
    this.health = 100;
    this.img = ImageObject('skeleton.png');
    this.deathImg = ImageObject('skeleton-die.png');
    this.sx = 0;
    this.sy = 0;
    this.frameNumber = 1;
    this.moanSound = skeletonMoan.cloneNode();
    this.dieSound = skelDie.cloneNode();
    this.died = false;
  }
  get sw() {
    return 72 * imageScalar;
  }
  get sh() {
    return 112 * imageScalar;
  }
  static frameCount = 4;
  
  animate() {
    var obj = this;
    obj.sx += obj.sw;
    obj.frameNumber += 1;

    if (obj.frameNumber > Skeleton.frameCount) {
      obj.sx = 0;
      obj.frameNumber = 1;
    }
  }
  die() {
    this.img = this.deathImg;
    this.dieSound.play();
  }
  
  moan() {
    if (!this.died) {
      this.moanSound.currentTime = 0;
      this.moanSound.play();
    }
  }

}

function handleDrawingObjects() {
  animationBucket.forEach(function(item) {
    if (item instanceof Ghost) {
      item.x1 -= ghostSpeed * deltaTime;

    } else if (item instanceof Skeleton) {
      item.x1 -= skeletonSpeed * deltaTime;

    } else if (item instanceof Bullet) {
      item.x1 += bulletSpeed * deltaTime;

    }
  }
  );
}

function detectCollisions() {
  let h = hero;
  let bullets = animationBucket.filter((i) =>  i instanceof Bullet);
  let ghosts = animationBucket.filter((i) =>  i instanceof Ghost);
  let skeletons = animationBucket.filter((i) =>  i instanceof Skeleton);
  let enemies = ghosts.concat(skeletons);

  bullets.forEach(function (b) {
    ghosts.forEach (function (g) {
      if (b.x1 < g.x2 && b.x2 > g.x1 && b.y1 < g.y2 && b.y2 > g.y1) {
        animationBucket = animationBucket.filter((i) =>  (i != b ));
        g.die();
        setTimeout(function() {
          animationBucket = animationBucket.filter((i) =>  (i != g));
        }, 300);

        score += 100;
        updateScore();
      }
    }
    );
    skeletons.forEach (function (s) {
      if (b.x1 < s.x2 && b.x2 > s.x1 && b.y1 < s.y2 && b.y2 > s.y1) {
        s.health -= 50;
        animationBucket = animationBucket.filter((i) =>  (i != b));
        if (s.health == 0) {
          s.die();
           setTimeout(function() {
             animationBucket = animationBucket.filter((i) =>  (i != s));
           }, 300);
          
          score += 500;
          updateScore();
        }
      }
    }
    );
  }
  );
  enemies.forEach(function (e) {
    if (h.x1 < e.x2 && h.x2 > e.x1 && h.y1 < e.y2 && h.y2 > e.y1) {
      stopGame();
      
    }
  }
  );

}

function spawnGhosts() {
  var randNum = Math.random();
  var randNum2 = Math.random();
  if (randNum < 0.5) {
    var ghost = new Ghost(500, 140, 35);
    setInterval( function() { ghost.animate();}, 300);
    ghost.growl();
    
    animationBucket.push(ghost);

  } else if (randNum <= 1) {
    var skeleton = new Skeleton(500, 140, 35);
    setInterval( function() { skeleton.animate();}, 300);
    skeleton.moan();
    animationBucket.push(skeleton);

  }
  if (randNum2 < 0.2) {
    setTimeout(spawnGhosts, 600);
  }
}

function shoot() {
  gunshot.currentTime = 0;
  gunshot.play();
  var bullet = new Bullet(hero.x1 + hero.width, hero.y1 + 18, 5);
  animationBucket.push(bullet);
  hero.sx += hero.sw;
  gameArea.removeEventListener('click', shoot);
  setTimeout(function() {
    hero.sx = 0; 
    gameArea.addEventListener('click', shoot);
  }, 500);
}

function ImageObject(source) {
  let tempImage = new Image();
  tempImage.src = imageFolder + source;
  return tempImage;
}

function removeBulletsOutsideCanvas() {
  let bullets = animationBucket.filter((i) =>  i instanceof Bullet);
  bullets.forEach(function (b) {
    if (b.x1 > 480) {
      animationBucket = animationBucket.filter((i) =>  (i != b));
 
    }
  }
  );
}