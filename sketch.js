let canvas;

let params = {
  numBlobs: 200,
  speed: 1.0,
  noiseScale: 0.002,
  sizeMin: 10,
  sizeMax: 40,
  hueSpeed: 0.4,
  trail: 12,
  saturation: 80,
  brightness: 100,
};

let blobs = [];
let t = 0;

function setup() {
  canvas = createCanvas(windowWidth - 260, windowHeight);

  canvas.position(260, 0);
  canvas.elt.style.zIndex = -1;

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
      h: random(360),
    });
  }
}

function initGUI() {
  const pane = new Tweakpane.Pane({
    container: document.getElementById('pane-container')
  });

  const f1 = pane.addFolder({ title: 'Forme' });
  f1.addInput(params, 'numBlobs', { min: 10, max: 500, step: 1 }).on('change', initBlobs);
  f1.addInput(params, 'sizeMin', { min: 1, max: 50, step: 1 }).on('change', initBlobs);
  f1.addInput(params, 'sizeMax', { min: 5, max: 100, step: 1 }).on('change', initBlobs);

  const f2 = pane.addFolder({ title: 'Movimento' });
  f2.addInput(params, 'speed', { min: 0.1, max: 3, step: 0.1 });
  f2.addInput(params, 'noiseScale', { min: 0.0005, max: 0.01, step: 0.0001 });

  const f3 = pane.addFolder({ title: 'Colore' });
  f3.addInput(params, 'hueSpeed', { min: 0, max: 2, step: 0.01 });
  f3.addInput(params, 'saturation', { min: 0, max: 100, step: 1 });
  f3.addInput(params, 'brightness', { min: 0, max: 100, step: 1 });

  const f4 = pane.addFolder({ title: 'FX' });
  f4.addInput(params, 'trail', { min: 1, max: 50, step: 1 });
}

function draw() {
  background(0, 0, 0, params.trail);

  for (let b of blobs) {
    let n = noise(b.x * params.noiseScale, b.y * params.noiseScale, t);
    let angle = n * TWO_PI * 4;

    b.x += cos(angle) * params.speed;
    b.y += sin(angle) * params.speed;

    if (b.x < 0) b.x = width;
    if (b.x > width) b.x = 0;
    if (b.y < 0) b.y = height;
    if (b.y > height) b.y = 0;

    b.h = (b.h + params.hueSpeed) % 360;

    fill(b.h, params.saturation, params.brightness, 40);
    ellipse(b.x, b.y, b.s, b.s);
  }

  t += 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth - 260, windowHeight);
  canvas.position(260, 0);
}
