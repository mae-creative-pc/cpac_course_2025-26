let model;
let canvasWidth, canvasHeight;
let strokePath;
let previous_pen = "down";
let listOfModels = [ "alarm_clock", "ambulance", "angel", "ant", "antyoga", "backpack", "barn", "basket", "bear", "bee", "beeflower", "bicycle", "bird", "book", "brain", "bridge", "bulldozer", "bus", "butterfly", "cactus", "calendar", "castle", "cat", "catbus", "catpig", "chair", "couch", "crab", "crabchair", "crabrabbitfacepig", "cruise_ship", "diving_board", "dog", "dogbunny", "dolphin", "duck", "elephant", "elephantpig", "eye", "face", "fan", "fire_hydrant", "firetruck", "flamingo", "flower", "floweryoga", "frog", "frogsofa", "garden", "hand", "hedgeberry", "hedgehog", "helicopter", "kangaroo", "key", "lantern", "lighthouse", "lion", "lionsheep", "lobster", "map", "mermaid", "monapassport", "monkey", "mosquito", "octopus", "owl", "paintbrush", "palm_tree", "parrot", "passport", "peas", "penguin", "pig", "pigsheep", "pineapple", "pool", "postcard", "power_outlet", "rabbit", "rabbitturtle", "radio", "radioface", "rain", "rhinoceros", "rifle", "roller_coaster", "sandwich", "scorpion", "sea_turtle", "sheep", "skull", "snail", "snowflake", "speedboat", "spider", "squirrel", "steak", "stove", "strawberry", "swan", "swing_set", "the_mona_lisa", "tiger", "toothbrush", "toothpaste", "tractor", "trombone", "truck", "whale", "windmill", "yoga", "yogabicycle", "everything", ];

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
  background(245);
  // set the initial position of the pen
  x = canvasWidth/2;
  y = canvasHeight/2;
  
  r = random(0, 10);
  g = random(0, 255);
  b = random(0, 255);
  
  w = random(4, 15);
  
    // load a random model
  select("#status").html("Loading new model..");
  model = ml5.sketchRNN(
    listOfModels[int(random(0,listOfModels.length))],
    modelReady);
  
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
      x = canvasWidth/2;
      y = canvasHeight/2;
      model.reset();
    }
  }
}
