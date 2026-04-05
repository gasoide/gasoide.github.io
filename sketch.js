// PARAMETRI CONTROLLABILI DA GUI
const params = {
  numBlobs: 150,
  speed: 0.8,
  sizeMin: 10,
  sizeMax: 40,
  hueSpeed: 0.4,
  trail: 12,
};

let blobs = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  initBlobs();
  initGUI();
}

function initBlobs() {
  blobs = [];
  for (let i = 0; i < params.numBlobs; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      s: random(params.sizeMin, params.sizeMax),
      o: random(0.5, 1.5),
      h: random(360),
    });
  }
}

function initGUI() {
  const pane = new Tweakpane.Pane();

  pane.addInput(params, 'numBlobs', { min: 10, max: 500, step: 1 })
      .on('change', initBlobs);

  pane.addInput(params, 'speed', { min: 0.1, max: 3, step: 0.1 });
  pane.addInput(params, 'sizeMin', { min: 1, max: 50, step: 1 })
      .on('change', initBlobs);
  pane.addInput(params, 'sizeMax', { min: 5, max: 100, step: 1 })
      .on('change', initBlobs);

  pane.addInput(params, 'hueSpeed', { min: 0, max: 2, step: 0.01 });
  pane.addInput(params, 'trail', { min: 1, max: 50, step: 1 });
}

function draw() {
  background(0, 0, 0, params.trail);

  for (let b of blobs) {
    let n = noise(b.x * 0.002, b.y * 0.002, t);
    let angle = n * TWO_PI * 4;

    b.x += cos(angle) * params.speed;
    b.y += sin(angle) * params.speed;

    if (b.x < 0) b.x = width;
    if (b.x > width) b.x = 0;
    if (b.y < 0) b.y = height;
    if (b.y > height) b.y = 0;

    b.h = (b.h + params.hueSpeed) % 360;

    fill(b.h, 80, 100, 40);
    ellipse(b.x, b.y, b.s, b.s);
  }

  t += 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
