function setup() {
  createCanvas(400, 400);
  background(168, 230, 255); //light blue background color
  rectMode(CENTER);
  fill(0); //black color for hair
  rect(200, 180, 215, 340, 90); //hair
  fill(240, 211, 192); //tan face color
  rect(200, 239, 100, 100); //neck
  ellipse(200, 135, 145, 185); //head shape
  ellipse(123, 135, 15, 30); //left ear
  ellipse(279, 135, 15, 30); //right ear
  fill(255); //white color for eyes
  ellipse(165, 120, 50, 25); //left eye
  ellipse(235, 120, 50, 25); //right eye
  fill(51, 0 , 51); //dark brown color for eye
  ellipse(165, 120, 25, 25); //left iris shape
  ellipse(235, 120, 25, 25); //right iris shape
  fill(0); //black color for pupils
  ellipse(165, 120, 13, 13); //left pupil shape
  ellipse(235, 120, 13, 13); //right pupil shape
  fill (255); // white color
  ellipse(163, 116, 8, 8); // white highlight left eye
  ellipse(168, 123, 5, 5); // smaller white highlight left eye
  ellipse(237, 116, 8, 8); // white highlight right eye
  ellipse(235, 123, 5, 5); // smaller white highlight right eye
  fill(255, 222, 248); //pink color for mouth
  arc(200, 190, 40, 40, 0, PI, CHORD); //mouth
  noFill();
  arc(200, 160, 20, 20, 250, 90); //nose
  strokeWeight(3); //thicker for eyebrows
  arc(165, 95, 45, 10, PI, 50); //left eyebrow
  arc(240, 95, 45, 10, PI, 50); //right eyebrow
  fill(153, 153, 255); //purple color for body
  ellipse(200, 365, 180, 255); //body shape



}

