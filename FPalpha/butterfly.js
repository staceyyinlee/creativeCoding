let video;
let poseNet;

//eye movement variables
let leftX = 0;
let leftY = 0;
let rightX = 0;
let rightY = 0;

var yoff = 0;

function setup() {
  createCanvas(640, 480);
  //basic camera setup
  video = createCapture(VIDEO);
  poseNet = ml5.poseNet(video, modelLoad);
  video.hide();
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
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

function modelLoad() {
  console.log('model ready');
}

function draw() {
  image(video, 0, 0);
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
  endShape();

  yoff += 0.05;
}

