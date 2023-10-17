let sounds = [];
let currentSound = null; //flag for song playing
let colors = ['#fcec03', '#a5ada5', '#e61705', '#24d1f0'];
let emotions = ['happy', 'sad', 'angry', 'chill'];

function preload() {
  //sound files
  for (let i = 1; i <= 4; i++) {
    sounds.push(loadSound('sounds/sound' + i + '.mp3'));
  }
}

function setup() {
  createCanvas(400, 400);
  createGrid(2, 2);
}

//creates a grid of cells
function createGrid(rows, cols) {
  let spacing = width / cols;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * spacing;
      let y = i * spacing;
      let cell = new Cell(x, y, spacing, sounds[i * cols + j], colors[i * cols + j], emotions[i * cols + j]);
      cell.display();
    }
  }
}

function mouseClicked() {
  for (let cell of grid) {
    if (cell.contains(mouseX, mouseY)) {
      if (currentSound) {
        currentSound.stop(); //stops playing previous sound 
      }
      cell.playSound();
      currentSound = cell.sound;
      break; //stops checking after a cell is clicked
    }
  }
}

//class for the grid cells
class Cell {
  constructor(x, y, size, sound, color, emotion) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.sound = sound;
    this.color = color;
    this.emotion = emotion;
  }

  //displays the cell as a square with the emotion centered
  display() {
    stroke(0);
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.emotion, this.x + this.size / 2, this.y + this.size / 2);
  }
  
  //checks if point is in the cell
  contains(px, py) {
    return px > this.x && px < this.x + this.size && py > this.y && py < this.y + this.size;
  }

  //play sound of cell
  playSound() {
    this.sound.play();
  }
}

//creates grid of cells and adds them to grid array
let grid = []; 
function createGrid(rows, cols) {
  let spacing = width / cols;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * spacing;
      let y = i * spacing;
      let cell = new Cell(x, y, spacing, sounds[i * cols + j], colors[i * cols + j], emotions[i * cols + j]);
      cell.display();
      grid.push(cell);
    }
  }
}
