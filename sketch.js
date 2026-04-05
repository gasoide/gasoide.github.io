let layers = [
  { media: null, type: null, x: 0, y: 0, scale: 1, rot: 0, alpha: 255, visible: true },
  { media: null, type: null, x: 0, y: 0, scale: 1, rot: 0, alpha: 255, visible: true },
  { media: null, type: null, x: 0, y: 0, scale: 1, rot: 0, alpha: 255, visible: true }
];

let media = null;
let mediaType = null;

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
  document.getElementById("media1").addEventListener("change", e => loadLayerMedia(e, 0));
document.getElementById("media2").addEventListener("change", e => loadLayerMedia(e, 1));
document.getElementById("media3").addEventListener("change", e => loadLayerMedia(e, 2));

  document.getElementById("mediaLoader").addEventListener("change", handleMedia);
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
    const pane = new Tweakpane.Pane({
  container: document.getElementById('pane-container')
});

for (let i = 0; i < 3; i++) {
  const f = pane.addFolder({ title: `Layer ${i+1}` });

  f.addInput(layers[i], 'visible');
  f.addInput(layers[i], 'x', { min: -1000, max: 1000 });
  f.addInput(layers[i], 'y', { min: -1000, max: 1000 });
  f.addInput(layers[i], 'scale', { min: 0.1, max: 5 });
  f.addInput(layers[i], 'rot', { min: 0, max: TWO_PI });
  f.addInput(layers[i], 'alpha', { min: 0, max: 255 });
}

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
  background(0);

  for (let L of layers) {
    if (!L.media || !L.visible) continue;

    push();
    translate(width/2 + L.x, height/2 + L.y);
    rotate(L.rot);
    scale(L.scale);
    tint(255, L.alpha);

    if (L.type === "image") {
      image(L.media, -L.media.width/2, -L.media.height/2);
    } else if (L.type === "video") {
      image(L.media, -L.media.width/2, -L.media.height/2);
    }

    pop();
  }
}


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
function handleMedia(e) {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image")) {
    media = loadImage(url);
    mediaType = "image";
  } else if (file.type.startsWith("video")) {
    media = createVideo(url);
    media.hide(); // non mostra il player HTML
    media.loop();
    mediaType = "video";
  }
  function loadLayerMedia(e, index) {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image")) {
    layers[index].media = loadImage(url);
    layers[index].type = "image";
  } else if (file.type.startsWith("video")) {
    let vid = createVideo(url);
    vid.hide();
    vid.loop();
    layers[index].media = vid;
    layers[index].type = "video";
  }
}


