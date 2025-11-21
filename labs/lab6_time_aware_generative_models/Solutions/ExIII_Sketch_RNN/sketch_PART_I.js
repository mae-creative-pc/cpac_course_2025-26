let model;
let canvasWidth, canvasHeight;
let strokePath;
let previous_pen = "down";
let x,y;

function setup() {
  canvasHeight = 400;
  canvasWidth = 400;
  canvas = createCanvas(canvasWidth, canvasHeight);
  background(245);
  canvas.hide();
  model = ml5.sketchRNN("crabrabbitfacepig", modelReady);

  let button = createButton("generate");
  button.position(20, 120);
  button.mousePressed(generateDrawing);
}

function modelReady() {
  canvas.show();
  select("#status").html("Model ready!");
  
}

function generateDrawing() {
  // clear the canvas when we generate a new drawing
  background(245);
  // location of our first pen stroke
  x = canvasWidth/2;
  y = canvasHeight/2;
  model.reset();
  model.generate(gotStroke);
}

function gotStroke(err, s) {
  if(err){
    console.log(err);
  }else{
    strokePath = s;
    console.log(strokePath)
  }
}

function draw() {
  // If SketchRNN has something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen == "down") {
      stroke(0, 119, 119); 
      strokeWeight(4);
      line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state refers to the next stroke
    previous_pen = strokePath.pen;

    // If the model is still generating
    if (strokePath.pen != "end") {
      strokePath = null;
      model.generate(gotStroke);
    } else {
      model.reset();
    }
  }
}
