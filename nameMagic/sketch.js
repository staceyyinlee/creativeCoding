let balls = []; //array for bouncing balls
let nameInput; //input for user's name
let currLetterInd = 0; //index of current letter in name
let letterTime = 1000; //milliseconds between letters appearing
let isAnimating = false; //flag for starting the animation

function setup() {
  createCanvas(400, 400);
  nameInput = createInput(); //input field for the user's name
  nameInput.position(width / 3, height - 50);
  let startButton = createButton('Start Animation'); //button to start animation
  startButton.position(width / 2.6, height - 25);
  startButton.mousePressed(startAnimation); //when button is clicked, starts animation
  noStroke();
}

function startAnimation() {
  if (isAnimating) {
    return; //prevents starting animation when it's already running
  }
  const name = nameInput.value(); //name entered by the user
  nameInput.value(''); //clears input box
  isAnimating = true;
  animateName(name); //starts animating name
}

function animateName(name) {
  if (currLetterInd < name.length) {
    let letter = name[currLetterInd];
    let ball = new Ball(letter, currLetterInd);
    balls.push(ball); //adds ball to array
    currLetterInd++;
    setTimeout(animateName, letterTime, name); //starts next bouncing ball letter
  } else {
    isAnimating = false;
  }
}

function draw() {
  background(173, 216, 230); //light blue background color

  //updates and displays all balls in array
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
}

class Ball {
  constructor(letter, index) {
    this.x = index * 40 + 40; //horizontal position of ball
    this.y = height / 2; //vertical position starts in middle
    this.letter = letter; //letter displayed on ball
    this.ySpeed = random(1, 3); //random vertical speed
    this.size = random(20, 40); //random size for ball
    this.ballColor = color(random(255), random(255), random(255)); //random ball color
    this.letterColor = color(random(255), random(255), random(255)); //random letter color
  }

  update() {
    //balls bounce by changing vertical position
    let bounceHeight = height / 2;
    let bounceAmp = 40;
    this.y = bounceHeight + bounceAmp * sin(frameCount / 20.0);
  }

  display() {
    fill(this.ballColor);
    ellipse(this.x, this.y, this.size, this.size); 

    fill(this.letterColor);
    textSize(20); 
    textAlign(CENTER, CENTER);
    text(this.letter, this.x, this.y);
  }
}
