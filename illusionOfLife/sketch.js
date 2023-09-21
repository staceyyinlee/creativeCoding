let diameter = 50; //ball diameter
let x, y; //ball position
let xSpeed, ySpeed; //ball speed
let sadLevel = 0; //how sad the smiley face looks
let angle = 0; //angle for bouncing in arcs

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
  xSpeed = 2;
  ySpeed = 0;
}

function draw() {
  background(87, 170, 242); //light blue background color

  //changes ball's position
  x += xSpeed;
  y += ySpeed;

  //bounces when it hits the edges
  if (x + diameter / 2 > width || x - diameter / 2 < 0) {
    xSpeed *= -1;
    sadLevel += 10; //sadness will increase every time it bounces
  }

  //the arc for the bounces
  angle += 0.057;
  ySpeed = sin(angle) * 5;

  //makes sure the smiley face stays inside the canvas
  if (y - diameter / 4 < 0) {
    y = diameter / 4;
  } 
  else if (y + diameter / 4 > height) {
    y = height - diameter / 4;
  }

  //draws the ball
  fill(255);
  ellipse(x, y, diameter);

  drawSmiley(x, y, 50, sadLevel); //draws the smiley face

  //resets sadLevel when the color of the smiley face is solid red
  if (sadLevel > 255) {
    sadLevel = 0;
  }
}

//draws the smiley face
function drawSmiley(x, y, size, sadLevel) {
  //changes the smiley face color based on how sad it is
  let smileyColor = color(255, 255 - sadLevel, 0);

  //draws the face
  fill(smileyColor);
  ellipse(x, y, size);

  //draws the eyes
  fill(0);
  ellipse(x - size / 5, y - size / 5, size / 8);
  ellipse(x + size / 5, y - size / 5, size / 8);

  //draws the mouth
  let mouthAngle = map(sadLevel, 0, 255, 0, PI / 2);
  arc(x, y + size / 5, size / 3, size / 5, 0 + mouthAngle, PI - mouthAngle);
}