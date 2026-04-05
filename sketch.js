let canvas;

// 3 LAYER INDIPENDENTI
let layers = [
  { media: null, type: null, x: 0, y: 0, scale: 1, rot: 0, alpha: 255, visible: true },
  { media: null, type: null, x: 0, y: 0, scale: 1, rot: 0, alpha: 255, visible: true },
  { media: null, type: null, x: 0, y: 0, scale: 1, rot: 0, alpha: 255, visible: true }
];

function setup() {
  canvas = createCanvas(windowWidth - 260, windowHeight);
  canvas.position(260, 0);
  canvas.elt.style.zIndex = -1;

  initGUI();

  // AGGANCIO EVENTI
  document.getElementById("media1").addEventListener("change", e => loadLayerMedia(e, 0));
  document.getElementById("media2").addEventListener("change", e => loadLayerMedia(e, 1));
  document.getElementById("media3").addEventListener("change", e => loadLayerMedia(e, 2));
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

function initGUI() {
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

function windowResized() {
  resizeCanvas(windowWidth - 260, windowHeight);
  canvas.position(260, 0);
}
