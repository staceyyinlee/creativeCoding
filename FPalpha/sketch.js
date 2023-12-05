let video;
let poseNet;
let poses = [];
let selectedFilter = '';
let photos = [];
let buttons = [];
let buttonSpacing = 40;
let photoStripWidth;

//eye movement variables
let leftX = 0;
let leftY = 0;
let rightX = 0;
let rightY = 0;
let yoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
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
}

function modelReady() {
  console.log('Model Loaded');
}

function createButtons() {
  let butterflyButton = createButton('butterfly');
  butterflyButton.position(10, 20);
  butterflyButton.size(80, 30);
  butterflyButton.mousePressed(butterflyFilter);
  buttons.push(butterflyButton);

  for (let i = 1; i < 5; i++) {
    let button = createButton(`${i + 1}`);
    button.position(10, 20 + i * buttonSpacing);
    button.size(40, 30);
    button.mousePressed(() => {
      selectedFilter = i;
    });
    buttons.push(button);
  }

  let captureButton = createButton('Capture');
  captureButton.position(width / 4 - 40, height - 50);
  captureButton.size(80, 40);
  captureButton.mousePressed(takePicture);
  buttons.push(captureButton);
}

function takePicture() {
  let photo = createImage(photoStripWidth / 3, (photoStripWidth / 3) / 1.33);
  photo.copy(video, 0, 0, video.width, video.height, 0, 0, photoStripWidth / 3, (photoStripWidth / 3) / 1.33);
  applyFilter(photo, selectedFilter);
  photos.push(photo);

  if (photos.length > 3) {
    photos.shift();
  }
}

function applyFilter(img, filterType) {
  switch (filterType) {
    case 'butterfly':
      butterflyFilter(img);
      break;
    //put more cases for additional filters

    default:
      break;
  }
}

function butterflyFilter(img) {
  image(img, 0, 0, width / 2, (width / 2) * 0.75);

  let space = dist(leftX, leftY, rightX, rightY);
  let midX = (leftX + rightX) / 2;
  let midY = (leftY + rightY) / 2;

  translate(midX, midY);
  rotate(PI / 2);

  let colorStart = color(255, 165, 0);
  let colorEnd = color(255, 255, 0);

  stroke(255);
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
  endShape();

  yoff += 0.05;
}

function gotPoses() {
  if (poses.length > 0) {
    let newLX = poses[0].pose.keypoints[1].position.x;
    let newLY = poses[0].pose.keypoints[1].position.y;
    let newRX = poses[0].pose.keypoints[2].position.x;
    let newRY = poses[0].pose.keypoints[2].position.y;
    leftX = lerp(leftX, newLX, 0.2);
    leftY = lerp(leftY, newLY, 0.2);
    rightX = lerp(rightX, newRX, 1);
    rightY = lerp(rightY, newRY, 0.2);
  }
}

function draw() {
  background(255);
  image(video, 0, 0, width / 2, (width / 2) * 0.75);
  drawKeypoints();
  drawPhotos();
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

function drawPhotos() {
  let photoX = width / 2;
  let photoHeight = (photoStripWidth / 3) / 1.33;
  for (let i = 0; i < photos.length; i++) {
    if (photos[i]) {
      image(photos[i], photoX, i * photoHeight, photoStripWidth / 3, photoHeight);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width / 2, (width / 2) * 0.75);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].position(10, 20 + i * buttonSpacing);
    buttons[i].size(80, 30);
  }

  photoStripWidth = width / 2;
}
