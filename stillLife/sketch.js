function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
  rectMode(CENTER);
  fill(0); //black for background
  rect(width / 2, height / 2, width, height); //black part of background
  fill(239, 223, 128); //yellow for background
  rect(width / 2, height, width, height / 1.5); //yellow part of background
 

  let rindColor = color(207, 50, 48); // red color for the rind

  //red rind of watermelon slice
  fill(rindColor);
  arc(width / 2, height / 2.5, 300, 300, 0, PI, PI);

  //white part of watermelon
  fill(255);
  arc(width / 2, height / 2.5, 240, 240, 0, PI, PI);

  //red dots inside the watermelon
  fill(rindColor);
  let numDots = 120;
  for (let i = 0; i < numDots; i++) {
    let dotX = random(width / 2 - 100, width / 2 + 100); //change dot's x-coordinate
    let dotY = random(height / 2.5, 270); //change dot's y-coordinate
    let dotR = random(1,8); //change dot's width and height
    ellipse(dotX, dotY, dotR, dotR); // Draw a seed as a small ellipse
  }
  
  //black watermelon seeds
  fill(0);
  let seedX = 100; //x-coordinate for first watermelon seed in first row
  let numSeedsr1 = 9;
  //first row of seeds
  for (let i = 0; i < numSeedsr1; i++) {
    seedX += 20;
    ellipse(seedX, 170, 7, 13);
  }
  seedX = 120;
  let numSeedsr2 = 7;
  //second row of seeds
  for (let i = 0; i < numSeedsr2; i++) {
    seedX += 20;
    ellipse(seedX, 190, 7, 13);
  }

  seedX = 140;
  let numSeedsr3 = 5;
  //third row of seeds
  for (let i = 0; i < numSeedsr3; i++) {
    seedX += 20;
    ellipse(seedX, 210, 7, 13);
  }

  //changed color for the bottom part of the watermelon slice
  //dark red part of rind
  fill(126, 15, 21); //dark red color
  arc(width / 2, height/ 1.5, 210, 90, 0, PI, PI);

  //cyan bootom part of watermelon slice
let cyan = color(6, 205, 195);
fill(6, 205, 195, 130); //lighter opacity
arc(width / 2, height/ 1.5, 105, 26, 0, PI, PI);

//red fork at bottom left
stroke(rindColor);
strokeWeight(11);
line(60, 360, 160, 360); //fork handle with middle prong
line(130, 345, 130, 375); //fork middle
line(130, 345, 160, 345); //left prong
line(130, 375, 160, 375); //right prong

//black fork above the red fork
stroke(0);
line(90, 320, 190, 330); //fork handle with middle prong
line(120, 305, 118, 340); //fork middle
line(90, 303, 118, 305); //top prong
line(90, 338, 118, 340); //bottom prong

//black spoon in bottom center
line(220, 325, 210, 365); //spoon handle
ellipse(210, 370, 10, 25); //spoon top

//red fork in bottom right
stroke(rindColor);
line(345, 310, 290, 370); //fork handle with middle prong
line(310, 320, 335, 345); //fork middle
line(310, 320, 330, 300); //left prong
line(335, 345, 360, 320); //right prong

//cyan knife in bottom right
stroke(0);
line(380, 360, 360, 370); //black knife handle
fill(cyan);
noStroke();
triangle(320, 390, 360, 360, 380, 370); //cyan knife blade
}









