let model;
let canvasWidth, canvasHeight;
let strokePath;
let previous_pen = "down";


function setup() {
  canvasWidth = 600;
  canvasHeight = 600;
  canvas = createCanvas(canvasWidth, canvasHeight);
  // Hide the canvas until the model is ready
  canvas.hide();

  background(245);
  // Load the model
  // See a list of all supported models: https://github.com/ml5js/ml5-library/blob/master/src/SketchRNN/models.js
  model = ml5.sketchRNN("crabrabbitfacepig", modelReady);

  let button = createButton("generate");
  button.position(20, 120);
  button.mousePressed(generateDrawing);
}

// The model is ready
function modelReady() {
  canvas.show();
  select("#status").html("Model ready!");
}

function generateDrawing() {
  // set the initial position of the pen
  x = random(0, canvasWidth);
  y = random(0, canvasHeight);
  
  r = random(0, 10);
  g = random(0, 255);
  b = random(0, 255);
  
  w = random(4, 15);
  
  model.reset();
  model.generate(gotStroke);
}

// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}

function draw() {
  
  // If SketchRNN has something new to draw
  if (strokePath) {
    
    // If the pen is down, draw a line
    if (previous_pen == "down") {
      stroke(r, g, b);
      strokeWeight(w);
      line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state refers to the next stroke
    previous_pen = strokePath.pen;

    // If the model is still generating
    if (strokePath.pen !== "end") {
      strokePath = null;
      model.generate(gotStroke);
    } else {
      model.reset();
    }
  }
}
