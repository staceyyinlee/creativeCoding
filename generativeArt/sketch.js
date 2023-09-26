//Rules:
//Draw random colored bezier curves on the screen until:
//the user presses 's' to stop
//or the user presses 'r' to reset the canvas

//boolean to determine when the drawing should continue or stop
let drawing = true;

//array to store the curves
let curves = [];

function setup() {
  createCanvas(400, 400);
  background(0); //make background black
}

function draw() {
  if (drawing) {
    //random color for curve
    let curveColor = color(random(255), random(255), random(255));
    stroke(curveColor);
    noFill();
    //make random points for the bezier curve
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);
    let x3 = random(width);
    let y3 = random(height);
    let x4 = random(width);
    let y4 = random(height);
  
    //bezier curve with random points
    bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    //put bezier curve info into the array
    curves.push({ x1, y1, x2, y2, x3, y3, x4, y4, curveColor });
  }

  //checks if certain keys are pressed
  if (keyIsPressed) {
    if (key === 's' || key === 'S') {
      drawing = false; //stops drawing when 's' or 'S' is pressed
    } 
    else if (key === 'r' || key === 'R') {
      drawing = true; //resets when 'r' or 'R' is pressed
      background(0); //clears the canvas
      curves = []; //resets the bezier curve array to be empty
    }
  }
}

//by default return false that the key is pressed
function keyPressed() {
  return false;
}