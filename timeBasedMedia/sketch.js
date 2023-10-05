let cupX;
let cupY;
let coffeeY; //starting y-coordinate of coffee rectangle
let coffeeHeight = 90; //starting height of coffee rectangle
let iceCubes = [];
let raindrops = [];
let lastTime;

function setup() {
  createCanvas(400, 400);
  background(255); //background to white

  //calculates cup position to center
  cupX = width / 2;
  cupY = height / 2;

  //sets starting y-coordinate of coffee rectangle
  coffeeY = cupY - 80;

  //makes ice cubes
  for (let i = 0; i < 3; i++) {
    iceCubes.push({
      x: cupX - 20 + i * 20,
      y: cupY - 40,
      meltingSpeed: random(0.01, 0.05), //slow melting speed for each cube
      melted: false
    });
  }

  //green straw
  fill(60, 201, 79); //green color for straw
  rect(cupX - 5, cupY - 160, 10, 100); //straw body
  
  lastTime = millis(); //stores the current time
}

function draw() {
  //plastic clear cup
  stroke(0); //black outline
  strokeWeight(2);
  fill(200); //light gray for cup
  rect(cupX - 50, cupY - 90, 100, 10); //cup lid
  rect(cupX - 40, cupY - 80, 80, 90); //cup body

  //decreases coffee level over time
  let currentTime = millis();
  if (currentTime - lastTime >= 1000 && coffeeHeight > 0) {
    //decreases coffee level by 1 unit every second
    coffeeHeight -= 1;
    coffeeY += 1; //movse coffee downward as it decreases
    lastTime = currentTime; //update lastTime
  }

  //draws coffee
  fill(100, 70, 30); //brown color for coffee
  noStroke();
  rect(cupX - 40, coffeeY, 80, coffeeHeight); //coffee inside the cup

  //updates and draws the ice cubes
  for (let i = 0; i < iceCubes.length; i++) {
    let cube = iceCubes[i];
    if (!cube.melted) {
      cube.y += cube.meltingSpeed;
      if (cube.y > cupY - 20) {
        cube.y = cupY - 20;
        cube.melted = true;
      }
    }
    if (cube.melted) {
      //makes the ice cube disappear
      iceCubes.splice(i, 1);
      i--;
    }
    fill(0, 0, 255, 100); //light blue color with transparency for ice cubes
    rect(cube.x, cube.y, 20, 20); //ice cube
  }

  //Craete and draws raindrops
  if (coffeeHeight > 0) {
    if (random(1) < 0.02) {
      let raindropX = random(cupX - 30, cupX + 30);
      let raindropY = cupY - 80;

      if (
        raindropY + 10 <= coffeeY &&
        raindropY < cupY - 80 + coffeeHeight
      ) {
        raindrops.push({
          x: raindropX,
          y: raindropY,
          length: random(10, 20),
          speed: random(0.1, 0.3)
        });
      }
    }
  }

  for (let i = raindrops.length - 1; i >= 0; i--) {
    let raindrop = raindrops[i];
    raindrop.y += raindrop.speed;

    if (raindrop.y > cupY - 80 + coffeeHeight) {
      //removes raindrops that reach the bottom of the coffee
      raindrops.splice(i, 1);
    } else {
      stroke(0, 100, 255); //light blue color for raindrops
      strokeWeight(2);
      line(raindrop.x, raindrop.y, raindrop.x, raindrop.y + raindrop.length);
    }
  }
}
