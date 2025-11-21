let model;
let canvasWidth, canvasHeight;
let strokePath;
let previous_pen = "down";
let x, y;
let listOfModels = [
  "alarm_clock",
  "ambulance",
  "angel",
  "ant",
  "antyoga",
  "backpack",
  "barn",
  "basket",
  "bear",
  "bee",
  "beeflower",
  "bicycle",
  "bird",
  "book",
  "brain",
  "bridge",
  "bulldozer",
  "bus",
  "butterfly",
  "cactus",
  "calendar",
  "castle",
  "cat",
  "catbus",
  "catpig",
  "chair",
  "couch",
  "crab",
  "crabchair",
  "crabrabbitfacepig",
  "cruise_ship",
  "diving_board",
  "dog",
  "dogbunny",
  "dolphin",
  "duck",
  "elephant",
  "elephantpig",
  "eye",
  "face",
  "fan",
  "fire_hydrant",
  "firetruck",
  "flamingo",
  "flower",
  "floweryoga",
  "frog",
  "frogsofa",
  "garden",
  "hand",
  "hedgeberry",
  "hedgehog",
  "helicopter",
  "kangaroo",
  "key",
  "lantern",
  "lighthouse",
  "lion",
  "lionsheep",
  "lobster",
  "map",
  "mermaid",
  "monapassport",
  "monkey",
  "mosquito",
  "octopus",
  "owl",
  "paintbrush",
  "palm_tree",
  "parrot",
  "passport",
  "peas",
  "penguin",
  "pig",
  "pigsheep",
  "pineapple",
  "pool",
  "postcard",
  "power_outlet",
  "rabbit",
  "rabbitturtle",
  "radio",
  "radioface",
  "rain",
  "rhinoceros",
  "rifle",
  "roller_coaster",
  "sandwich",
  "scorpion",
  "sea_turtle",
  "sheep",
  "skull",
  "snail",
  "snowflake",
  "speedboat",
  "spider",
  "squirrel",
  "steak",
  "stove",
  "strawberry",
  "swan",
  "swing_set",
  "the_mona_lisa",
  "tiger",
  "toothbrush",
  "toothpaste",
  "tractor",
  "trombone",
  "truck",
  "whale",
  "windmill",
  "yoga",
  "yogabicycle",
  "everything",
];
let seedStrokes = [];
let dropdown;

function setup() {
  canvasWidth = 600;
  canvasHeight = 600;
  canvas = createCanvas(canvasWidth, canvasHeight);
  // Hide the canvas until the model is ready
  canvas.hide();

  background(245);

  dropdown = createSelect();
  dropdown.position(20, 150);
  for (const val of listOfModels) {
    dropdown.option(val);
  }

  dropdown.changed(() => {
    model.reset();
    let modelSelected = dropdown.value();
    model = ml5.sketchRNN(modelSelected, modelReady);
  });
  // Load the model
  // See a list of all supported models: https://github.com/ml5js/ml5-library/blob/master/src/SketchRNN/models.js
  model = ml5.sketchRNN(dropdown.value(), modelReady);

  let button = createButton("clear");
  button.position(20, 120);
  button.mousePressed(clearDrawing);
}

// The model is ready
function modelReady() {
  canvas.show();
  canvas.mouseReleased(startSketchRNN);
  select("#status").html(
    "model ready - sketchRNN will begin after you draw with the mouse"
  );
}

// Reset the drawing
function clearDrawing() {
  background(244);
  // clear seed strokes
  seedStrokes = [];
  // Reset model
  model.reset();
  select("#status").html(
    "model ready - sketchRNN will begin after you draw with the mouse"
  );
}

// sketchRNN takes over
function startSketchRNN() {
  // Start where the mouse left off
  x = mouseX;
  y = mouseY;
  // Generate with the seedStrokes
  model.generate(seedStrokes, gotStroke);
}

// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}

function draw() {
  // If the mosue is pressed capture the user strokes
  if (mouseIsPressed) {

    // Draw line
    stroke(0);
    strokeWeight(random(3, 9));
    line(pmouseX, pmouseY, mouseX, mouseY);
    // Create a "stroke path" with dx, dy, and pen
    let userStroke = {
      dx: mouseX - pmouseX,
      dy: mouseY - pmouseY,
      pen: "down",
    };
    // Add to the array
    seedStrokes.push(userStroke);
  }

  // If SketchRNN has something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen == "down") {
      stroke(0, random(100,255), random(115, 255));
      strokeWeight(random(3, 9));
      line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state refers to the next stroke
    previous_pen = strokePath.pen;

    // If the model is still generating
    if (strokePath.pen !== "end") {
      select("#status").html("drawing...");
      strokePath = null;
      model.generate(gotStroke);
    } else {
      model.reset();
      select("#status").html("done drawing!");
    }
  }
}
