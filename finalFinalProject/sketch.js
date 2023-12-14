let video;
let poseNet;
let poses = [];
let selectedFilter = '';
let photos = [];
let buttons = [];
let buttonSpacing = 40;
let photoStripWidth;
let butterflyFilter;
let heartsFilter;
let sparklesFilter;
let myCanvas;

// eye movement vars
let leftX = 0;
let leftY = 0;
let rightX = 0;
let rightY = 0;
let yoff = 0;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width / 2, (width / 2) * 0.75);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
    gotPoses();
  });

  createButtons();

  photoStripWidth = width / 2;
  butterflyFilter = new ButterflyFilter();
  heartsFilter = new HeartsFilter();
  sparklesFilter = new SparklesFilter();
}

function modelReady() {
  console.log('Model Loaded');
}

//makes buttons for filters and the capture button to take pics
function createButtons() {
  //butterfly button
  let butterflyButton = createButton('butterfly');
  let orange = color(255,165,0);
  butterflyButton.position(10, 20);
  butterflyButton.size(80, 30);
  butterflyButton.style('font-size', '18px');
  butterflyButton.style('background-color', orange);
  butterflyButton.mousePressed(() => {
  selectedFilter = 'butterfly';
  butterflyFilter.toggleVisibility();
  heartsFilter.hide();
  sparklesFilter.hide();
  });
  buttons.push(butterflyButton);
  //hearts button
  let heartsButton = createButton('hearts');
  let pink = color(248,200,220);
  heartsButton.position(10, 20 + buttonSpacing);
  heartsButton.size(80, 30);
  heartsButton.style('font-size', '18px');
  heartsButton.style('background-color', pink);
  heartsButton.mousePressed(() => {
  selectedFilter = 'hearts';
  heartsFilter.toggleVisibility();
  butterflyFilter.hide();
  sparklesFilter.hide();
  });
  buttons.push(heartsButton);
  //sparkles button
  let sparklesButton = createButton('sparkles');
  let yellow = color(255,255,0);
  sparklesButton.position(10, 20 + 2 * buttonSpacing);
  sparklesButton.size(80, 30);
  sparklesButton.style('font-size', '18px');
  sparklesButton.style('background-color', yellow);
  sparklesButton.mousePressed(() => {
  selectedFilter = 'sparkles';
  sparklesFilter.toggleVisibility();
  butterflyFilter.hide();
  heartsFilter.hide();
  });
  buttons.push(sparklesButton);

  //capture button to take a pic
  let captureButton = createButton('Capture');
  let red = color(255,0,0);
  captureButton.position(width / 4 - 40, video.height + 10);
  captureButton.size(80, 40);
  captureButton.style('font-size', '18px');
  captureButton.style('background-color', red);
  captureButton.mousePressed(takePicture);
  buttons.push(captureButton);
}


//takes a pic from the video stream
function takePicture() {
  let originalPhoto = createImage(photoStripWidth / 3, (photoStripWidth / 3) / 1.33);
  originalPhoto.copy(get(0, 0, width / 2, (width / 2) * 0.75), 0, 0, width / 2, (width / 2) * 0.75, 0, 0, photoStripWidth / 3, (photoStripWidth / 3) / 1.33);

  let filteredPhoto = createImage(photoStripWidth / 3, (photoStripWidth / 3) / 1.33);
  filteredPhoto.copy(originalPhoto, 0, 0, originalPhoto.width, originalPhoto.height, 0, 0, photoStripWidth / 3, (photoStripWidth / 3) / 1.33);

  //apply the selected filter to the filtered photo
  switch (selectedFilter) {
    case 'butterfly':
      butterflyFilter.apply(filteredPhoto);
      break;
    case 'hearts':
      heartsFilter.drawHearts(filteredPhoto);
      break;
    case 'sparkles':
      sparklesFilter.apply(filteredPhoto);
      break;
    // Add more cases for other filters if needed
    default:
      break;
  }

  //calculate the correct photoX position based on the selected filter
  let photoX = width / 2;
  if (selectedFilter === 'butterfly') {
    photoX += photoStripWidth / 3;
  } 
  else if (selectedFilter === 'hearts') {
    photoX += photoStripWidth / 3;
  } 
  else if (selectedFilter === 'sparkles') {
    photoX += (photoStripWidth / 3);
  }

  photos.push({ original: originalPhoto, filtered: filteredPhoto, filter: selectedFilter, x: photoX });

  if (photos.length > 3) {
    photos.shift();
  }
}

class ButterflyFilter {
  constructor() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  apply() {
  if (this.visible) {
  //scales the butterfly shape
  //distance between eyes
  let space = dist(leftX, leftY, rightX, rightY);

  //calculates midpoint between eyes
  let midX = (leftX + rightX) / 2;
  let midY = (leftY + rightY) / 2;

  //draws butterfly shape with orange and yellow gradient
  //code inspired by https://editor.p5js.org/hlipski/sketches/NdvF17ES7
  translate(midX, midY);
  rotate(PI / 2);

  let colorStart = color(255, 165, 0); //orange
  let colorEnd = color(255, 255, 0);   //yellow

  stroke(255); //white stroke
  strokeWeight(1);

  var da = PI / 100;
  var dx = 0.1;

  var xoff = 0;
  beginShape();
  for (var a = -PI / 2; a <= PI / 2; a += da) {
    var n = noise(xoff, yoff);
    var interpColor = lerpColor(colorStart, colorEnd, map(n, 0, 1, 0, 1));
    fill(interpColor);
    var r = sin(2 * a) * map(n, 0, 1, 40, space);
    var x = r * cos(a);
    var y = sin(frameCount * 0.001) * r * sin(a);
    xoff += dx;
    vertex(x, y);
  }

  for (var a = PI / 2; a <= 3 * PI / 2; a += da) {
    var n = noise(xoff, yoff);
    var interpColor = lerpColor(colorStart, colorEnd, map(n, 0, 1, 0, 1));
    fill(interpColor);
    var r = sin(2 * a) * map(n, 0, 1, 40, space);
    var x = r * cos(a);
    var y = sin(frameCount * 0.001) * r * sin(a);
    xoff -= dx;
    vertex(x, y);
  }
  endShape(CLOSE);

  yoff += 0.05;
    }
  }
}


class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = random(1, 3);
  }

  display() {
    fill(255, 0, 0);
    beginShape();
    vertex(this.x, this.y);
    bezierVertex(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, this.y + this.size / 3, this.x, this.y + this.size);
    bezierVertex(this.x + this.size, this.y + this.size / 3, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y);
    endShape();
  }

  move() {
    this.y += this.speed;
  }

  offscreen() {
    return this.y > height + this.size;
  }
}
//class for the hearts filter
class HeartsFilter {
  constructor() {
    this.visible = false;
    this.hearts = [];
  }

  //shows filter
  show() {
    this.visible = true;
  }

  //hides filter
  hide() {
    this.visible = false;
  }

  //changes if the filter is visible or not
  toggleVisibility() {
    this.visible = !this.visible;
  }

  //draws hearts
  drawHearts() {
    if (this.visible) {
      for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        let head = pose.keypoints[0];

        if (head.score > 0.2) {
          // Draw multiple hearts spread out
          for (let j = 0; j < 8; j++) {
            let heart = new Heart(head.position.x + random(-80, 80), head.position.y - 200 + random(-20, 20));
            heart.display();
            heart.move();
            this.hearts.push(heart);
          }
        }
      }

      //removes hearts that are off-screen
      for (let i = this.hearts.length - 1; i >= 0; i--) {
        if (this.hearts[i].offscreen()) {
          this.hearts.splice(i, 1);
        }
      }
    }
  }
}

class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
  }

  update() {
    this.alpha -= 5;
  }

  display() {
    fill(255, 255, 0, this.alpha);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }
}
class SparklesFilter {
  constructor() {
    this.visible = false;
    this.sparkleParticles = [];
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  apply() {
    if (this.visible) {

      for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;

        //adds sparkles above the user's head
        if (pose.keypoints[0].score > 0.2) {
          for (let j = 0; j < 5; j++) {
            let sparkle = new Sparkle(pose.keypoints[0].position.x + random(-90, 70), pose.keypoints[0].position.y - 30 + random(-110, -90));
            this.sparkleParticles.push(sparkle);
          }
        }
      }

      //draws and moves sparkles
      for (let i = this.sparkleParticles.length - 1; i >= 0; i--) {
        let sparkle = this.sparkleParticles[i];
        sparkle.update();
        sparkle.display();
        if (sparkle.alpha <= 0) {
          //remove sparkle if it becomes transparent
          this.sparkleParticles.splice(i, 1);
        }
      }
    }
  }
}

function gotPoses() {
  //for tracking keypoints in the eye
  if (poses.length > 0) {
    let newLX = poses[0].pose.keypoints[1].position.x;
    let newLY = poses[0].pose.keypoints[1].position.y;
    let newRX = poses[0].pose.keypoints[2].position.x;
    let newRY = poses[0].pose.keypoints[2].position.y;

    //lerp calculates the transition when moving head around
    leftX = lerp(leftX, newLX, 0.2);
    leftY = lerp(leftY, newLY, 0.2);
    rightX = lerp(rightX, newRX, 1);
    rightY = lerp(rightY, newRY, 0.2);
  }
}

function draw() {
  background(255);
  image(video, 0, 0, width / 2, (width / 2) * 0.75);
  text("Press 's' on your keyboard to save your photos!", width / 4 - 120, video.height+ 80);
  textStyle(BOLD);
  if (selectedFilter === 'butterfly') {
    butterflyFilter.apply();
  }
  else if (selectedFilter === 'hearts') {
    heartsFilter.drawHearts();
  } else if (selectedFilter === 'sparkles') {
    sparklesFilter.apply(); 
  }
  drawPhotos();
}


//draws the photos in the photostrip to the right of the video feed
function drawPhotos() {
  let photoX = width / 2;
  let photoHeight = (photoStripWidth / 3) / 1.33;

  for (let i = 0; i < photos.length; i++) {
    if (photos[i] && photos[i].original && photos[i].filtered) {
      let originalPhoto = photos[i].original;
      let filteredPhoto = photos[i].filtered;

      //display the original photo if the selected filter matches the filter type
      if (selectedFilter === photos[i].filter) {
        image(originalPhoto, photoX, i * photoHeight, photoStripWidth / 3, photoHeight);
      } 
      else {
        //apply filter based on stored filter to the filtered photo
        switch (photos[i].filter) {
          case 'butterfly':
            butterflyFilter.apply(filteredPhoto);
            break;
          case 'hearts':
            heartsFilter.drawHearts(filteredPhoto);
            break;
          case 'sparkles':
            sparklesFilter.apply(filteredPhoto);
            break;
          //add more cases for other filters if needed
          default:
            break;
        }

        //displays the filtered photo
        image(filteredPhoto, photoX, i * photoHeight, photoStripWidth / 3, photoHeight);
      }
    }
  }
}

//resizes the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width / 2, (width / 2) * 0.75);
  //updates button positions and sizes
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].position(10, 20 + i * buttonSpacing);
    buttons[i].size(80, 30);
  }
  photoStripWidth = width / 2;
}

//saves photostrip to downloads when the 's' key is pressed
function keyTyped(){
  if(key == 's'){
  savedImg = myCanvas.get(video.width,0,photoStripWidth/3,video.height);
  savedImg.save('myPhotos', 'png');
   }
}