//Rules:
//Draw random colored bezier curves on the screen until:
//the user presses 's' to stop
//or the user presses 'r' to reset the canvas

let drawTool;

function setup() {
  createCanvas(400, 400);
  background(0); //make background black
  drawTool = new DrawTool(); 
}

function draw() {
  drawTool.update();
}

//by default return false that the key is pressed
function keyPressed() {
  return false;
}

class DrawTool {
  constructor() {
    this.drawing = true;
    this.curves = [];
  }

  update() {
    if (this.drawing) {
      //random for the curve
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
      this.curves.push({ x1, y1, x2, y2, x3, y3, x4, y4, curveColor });
    }

    //checks if certain keys are pressed
    if (keyIsPressed) {
      if (key === 's' || key === 'S') {
        this.drawing = false; //stops drawing when 's' or 'S' is pressed
      } else if (key === 'r' || key === 'R') {
        this.drawing = true; //resets when 'r' or 'R' is pressed
        background(0); //clears the canvas
        this.curves = []; //resets the bezier curve array to be empty
      }
    }
  }
}