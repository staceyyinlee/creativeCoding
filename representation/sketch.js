//classifier variable
let classifier;
//model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/xWTjHhVeF/';

//video
let video;
let flippedVideo;
//stores different emotions
let label = "";
let sunshines = [];
let raindrops = [];
let fireFlames = [];
let hearts = [];

//loads model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320, 260);
  //creates video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  //starts classifying
  classifyVideo();
}

function draw() {
  background(0);
  //draws video
  image(flippedVideo, 0, 0);

  //draws label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);

  //checks label and displays corresponding shapes
  if (label === "happy") {
    sunshines.push(new Sunshine(random(width), 0));
  } 
  else if (label === "sad") {
    raindrops.push(new Raindrop(random(width), 0));
  } 
  else if (label === "angry") {
    fireFlames.push(new FireFlame(random(width), 0));
  } 
  else if (label === "in love") {
    hearts.push(new Heart(random(width), 0));
  }

  //updates and displays sunshines
  for (let sunshine of sunshines) {
    sunshine.update();
    sunshine.display();
  }

  //updates and displays raindrops
  for (let raindrop of raindrops) {
    raindrop.update();
    raindrop.display();
  }

  //updates and displays fire flames
  for (let fireFlame of fireFlames) {
    fireFlame.update();
    fireFlame.display();
  }

  //updates and displays hearts
  for (let heart of hearts) {
    heart.update();
    heart.display();
  }
  

  //removes shapes when no longer on canvas
  sunshines = sunshines.filter(function(s) {
    return s.y < height;
  });

  raindrops = raindrops.filter(function(r) {
    return r.y < height;
  });

  fireFlames = fireFlames.filter(function(f) {
    return f.y < height;
  });

  hearts = hearts.filter(function(h) {
    return h.y < height;
  });

}

//gets a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

//when we get a result
function gotResult(error, results) {
  //if there is an error
  if (error) {
    console.error(error);
    return;
  }
  //the results are in an array ordered by confidence.
  //console.log(results[0]);
  label = results[0].label;
  //classify again!
  classifyVideo();
}

//sunshine class
class Sunshine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 3);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    //draws sunshine rays
    stroke(255, 255, 0);
    strokeWeight(4);
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let rayX = this.x + 20 * cos(angle);
      let rayY = this.y + 20 * sin(angle);
      line(this.x, this.y, rayX, rayY);
    }

    //draws sunshine circle
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, 15, 15);
  }
}

//raindrop class
class Raindrop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(3, 5);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    //draws raindrop
    stroke(0, 0, 255);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y + 10);
  }
}

//FireFlame class
class FireFlame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(2, 4);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    //draws fire flame
    noStroke();
    let flameColor = color(random(255, 255), random(50, 150), 0); //red-orange color
    fill(flameColor);
    
    //draws flame glitch effect with rectangles
    for (let i = 0; i < 3; i++) {
      let flameHeight = random(5, 15);
      rect(this.x - 2, this.y - i * 15, 4, flameHeight);
    }
  }
}

//heart class
class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 40);
    this.speed = random(2, 4);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    //draws heart
    fill(255, 0, 0); //red color
    noStroke();

    this.drawHeart(this.x, this.y, this.size);
  }
//heart shape logic found from https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg
  drawHeart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
  }
}