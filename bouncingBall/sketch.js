//Majority of the code is from the class demo
let x, y; // ball x and x position
let xDir, yDir; // direction of the ball
let size; // size of the ball

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  fill(0, 255, 0);

  // random directions
  xDir = random(-8, 8);
  yDir = random(-8, 8);

  // random size
  size = random(50, 300);

  // starting point is somewhere in the 
  // canvas, not touching a border
  x = random(size, width - size);
  y = random(size, height - size);
  noStroke();
  fill(0);
}

function draw() {
  // a little motion blur
   background(255, 50);
  // draw our ball
  ellipse(x, y, size);

  // if the ball touches the left or right side
  if (x >= width - size / 2 || x <= size / 2) {
    frameRate(30); //slows down so that the black blackground can flash
    background(0); //makes background black
    //reverse direction
    xDir *= -1;
    fill(255, 0 , 0); //turns ball red
  }

  // if the ball touches the ceilign or floor
  if (y >= height - size / 2 || y <= size / 2) {
    yDir = yDir * -1;
    fill(0, 255, 0); //turns ball green
    background(255); //makes background white
    frameRate(50); //makes faster frame rate
  }

  // update the position of the ball for the next loop
  x = x + xDir;
  y = y + yDir;
}