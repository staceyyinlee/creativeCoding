let video;
let poseNet;
let poses = [];
let selectedFilter = '';
let photos = [];
let buttons = [];
let buttonSpacing = 40;
let photoStripWidth;
let butterflyFilter;
let myCanvas;

//eye movement vars
let leftX = 0;
let leftY = 0;
let rightX = 0;
let rightY = 0;
let yoff = 0;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
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
  butterflyFilter = new ButterflyFilter();
}

function modelReady() {
  console.log('Model Loaded');
}

//makes buttons for filters and the capture button to take pics
function createButtons() {
  let butterflyButton = createButton('butterfly');
  butterflyButton.position(10, 20);
  butterflyButton.size(80, 30);
  butterflyButton.mousePressed(() => {
    selectedFilter = 'butterfly';
    butterflyFilter.toggleVisibility();
  });
  buttons.push(butterflyButton);

  for (let i = 1; i < 5; i++) {
    let button = createButton(`${i + 1}`);
    button.position(10, 20 + i * buttonSpacing);
    button.size(40, 30);
    button.mousePressed(() => {
      selectedFilter = i;
      butterflyFilter.hide();
    });
    buttons.push(button);
  }

  //capture button to take a pic
  let captureButton = createButton('Capture');
  captureButton.position(width / 4 - 40, video.height + 10);
  captureButton.size(80, 40);
  captureButton.mousePressed(takePicture);
  buttons.push(captureButton);
}

//takes a pic from the video stream
function takePicture() {
  let photo = createImage(photoStripWidth / 3, (photoStripWidth / 3) / 1.33);
  
  //gets content of photo from canvas
  photo.copy(get(0, 0, video.width, video.height), 0, 0, video.width, video.height, 0, 0, photoStripWidth / 3, (photoStripWidth / 3) / 1.33);
  
  //applies the selected filter to the pic
  applyFilter(photo, selectedFilter);
  photos.push(photo);

  //sets a limit of only 3 pics in the photostrip
  if (photos.length > 3) {
    photos.shift();
  }
}

//applies the selected filter to the pic
function applyFilter(img, filterType) {
  switch (filterType) {
    case 'butterfly':
      butterflyFilter.apply(img);
      break;
    //will add more cases for more filters
    default:
      break;
  }
}

//class for the butterfly filter
class ButterflyFilter {
  constructor() {
    this.visible = false;
    this.img = createImage(width / 2, (width / 2) * 0.75);
  }

  //shows filter
  show() {
    this.visible = true;
  }

  //hides filter
  hide() {
    this.visible = false;
  }

  //changes if the filter is visible or not
  toggleVisibility() {
    this.visible = !this.visible;
  }

  //gets the image
  getImage() {
    return this.img;
  }

  //applies the filter to the image
  apply() {
    if (this.visible) {
      //copies the video stream to the image
      this.img.copy(video, 0, 0, video.width, video.height, 0, 0, width / 2, (width / 2) * 0.75);

      //butterfly filter inspired by https://editor.p5js.org/hlipski/sketches/NdvF17ES7
      //draws butterfly shape with orange and yellow gradient

      //scales the butterfly shape and places it between the eyes
      let space = dist(leftX, leftY, rightX, rightY);
      let midX = (leftX + rightX) / 2;
      let midY = (leftY + rightY) / 2;

      this.img.loadPixels();
      for (let i = 0; i < this.img.pixels.length; i += 4) {
        let r = this.img.pixels[i];
        let g = this.img.pixels[i + 1];
        let b = this.img.pixels[i + 2];
        let bright = (r + g + b) / 3;
        this.img.pixels[i] = bright;
        this.img.pixels[i + 1] = bright;
        this.img.pixels[i + 2] = bright;
      }
      this.img.updatePixels();

      translate(midX, midY);
      rotate(PI / 2);

      let colorStart = color(255, 165, 0); //orange
      let colorEnd = color(255, 255, 0); //yellow

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
  }
}

function gotPoses() {
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

function draw() {
  background(255); //white background
  image(video, 0, 0, width / 2, (width / 2) * 0.75); //video feed
  text("Press 's' on your keyboard to save your photos!", width / 4 - 120, video.height+ 80);
  drawPhotos();

  //applies the selected filter
  applyFilter(butterflyFilter.getImage(), selectedFilter);
}

//draws the photos in the photostrip to the right of the video feed
function drawPhotos() {
  let photoX = width / 2;
  let photoHeight = (photoStripWidth / 3) / 1.33;

  //put each photo in the photostrip
  for (let i = 0; i < photos.length; i++) {
    if (photos[i]) {
      image(photos[i], photoX, i * photoHeight, photoStripWidth / 3, photoHeight);
    }
  }
}

//resizes the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width / 2, (width / 2) * 0.75);
  //updates button positions and sizes
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].position(10, 20 + i * buttonSpacing);
    buttons[i].size(80, 30);
  }

  photoStripWidth = width / 2;
}

//saves photostrip to downloads when the 's' key is pressed
function keyTyped(){
  if(key == 's'){
  savedImg = myCanvas.get(video.width,0,photoStripWidth/3,video.height);
  savedImg.save('myPhotos', 'png');
   }
}