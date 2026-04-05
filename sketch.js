let canvas;

// AUDIO
let mic;
let amp;
let audioLevel = 0;

// 3 LAYER INDIPENDENTI
let layers = [
  {
    media: null,
    type: null,
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    alpha: 255,
    visible: true,
    blend: 'NORMAL',
    flipH: false,
    flipV: false,
    lfoEnabled: false,
    lfoSpeed: 0.5,
    lfoAmount: 0.5,
    lfoPhase: 0,
    audioReactive: false,
    audioAmount: 0.7,
  },
  {
    media: null,
    type: null,
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    alpha: 255,
    visible: true,
    blend: 'NORMAL',
    flipH: false,
    flipV: false,
    lfoEnabled: false,
    lfoSpeed: 0.5,
    lfoAmount: 0.5,
    lfoPhase: 0,
    audioReactive: false,
    audioAmount: 0.7,
  },
  {
    media: null,
    type: null,
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    alpha: 255,
    visible: true,
    blend: 'NORMAL',
    flipH: false,
    flipV: false,
    lfoEnabled: false,
    lfoSpeed: 0.5,
    lfoAmount: 0.5,
    lfoPhase: 0,
    audioReactive: false,
    audioAmount: 0.7,
  },
];

function setup() {
  canvas = createCanvas(windowWidth - 260, windowHeight);
  canvas.position(260, 0);
  canvas.elt.style.zIndex = -1;

  // AUDIO IN
  mic = new p5.AudioIn();
  mic.start();
  amp = new p5.Amplitude();
  amp.setInput(mic);

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

    f.addInput(layers[i], 'visible', { label: 'Visibile' });
    f.addInput(layers[i], 'x', { min: -1000, max: 1000, label: 'Pos X' });
    f.addInput(layers[i], 'y', { min: -1000, max: 1000, label: 'Pos Y' });
    f.addInput(layers[i], 'scale', { min: 0.1, max: 5, label: 'Scala' });
    f.addInput(layers[i], 'rot', { min: 0, max: TWO_PI, label: 'Rotazione' });
    f.addInput(layers[i], 'alpha', { min: 0, max: 255, label: 'Opacità' });

    f.addInput(layers[i], 'blend', {
      label: 'Blend',
      options: {
        Normal: 'NORMAL',
        Add: 'ADD',
        Screen: 'SCREEN',
        Multiply: 'MULTIPLY',
        Difference: 'DIFFERENCE',
      },
    });

    f.addInput(layers[i], 'flipH', { label: 'Flip H' });
    f.addInput(layers[i], 'flipV', { label: 'Flip V' });

    const lfoFolder = f.addFolder({ title: 'LFO Scala' });
    lfoFolder.addInput(layers[i], 'lfoEnabled', { label: 'Attivo' });
    lfoFolder.addInput(layers[i], 'lfoSpeed', { min: 0, max: 5, label: 'Velocità' });
    lfoFolder.addInput(layers[i], 'lfoAmount', { min: 0, max: 1, label: 'Ampiezza' });

    const audioFolder = f.addFolder({ title: 'Audio Reactive' });
    audioFolder.addInput(layers[i], 'audioReactive', { label: 'Attivo' });
    audioFolder.addInput(layers[i], 'audioAmount', { min: 0, max: 2, label: 'Intensità' });
  }
}

function draw() {
  background(0);

  // AUDIO LEVEL
  audioLevel = amp.getLevel();
  let normLevel = constrain(map(audioLevel, 0, 0.3, 0, 1), 0, 1);

  blendMode(BLEND);

  for (let L of layers) {
    if (!L.media || !L.visible) continue;

    // LFO su scala
    let effectiveScale = L.scale;
    if (L.lfoEnabled) {
      L.lfoPhase += L.lfoSpeed * 0.02;
      let lfoValue = sin(L.lfoPhase);
      effectiveScale = L.scale * (1 + lfoValue * L.lfoAmount);
    }

    // Audio reactive su alpha
    let effectiveAlpha = L.alpha;
    if (L.audioReactive) {
      let boost = 0.3 + normLevel * L.audioAmount * 2.0;
      effectiveAlpha = constrain(L.alpha * boost, 0, 255);
    }

    // Blend mode
    switch (L.blend) {
      case 'ADD':
        blendMode(ADD);
        break;
      case 'SCREEN':
        blendMode(SCREEN);
        break;
      case 'MULTIPLY':
        blendMode(MULTIPLY);
        break;
      case 'DIFFERENCE':
        blendMode(DIFFERENCE);
        break;
      default:
        blendMode(BLEND);
        break;
    }

    push();
    translate(width / 2 + L.x, height / 2 + L.y);
    rotate(L.rot);

    // Flip
    let flipX = L.flipH ? -1 : 1;
    let flipY = L.flipV ? -1 : 1;
    scale(effectiveScale * flipX, effectiveScale * flipY);

    tint(255, effectiveAlpha);

    if (L.type === "image") {
      image(L.media, -L.media.width / 2, -L.media.height / 2);
    } else if (L.type === "video") {
      image(L.media, -L.media.width / 2, -L.media.height / 2);
    }

    pop();
  }

  // reset blend
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth - 260, windowHeight);
  canvas.position(260, 0);
}
