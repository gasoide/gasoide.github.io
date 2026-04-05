let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  background(0, 0, 0, 10); // scia morbida

  translate(width / 2, height / 2);

  let numBlobs = 40;
  for (let i = 0; i < numBlobs; i++) {
    let angle = (TWO_PI / numBlobs) * i + t * 0.3;
    let radius = 150 + 80 * sin(t + i * 0.3);

    let x = radius * cos(angle);
    let y = radius * sin(angle);

    let hue = (t * 40 + i * 10) % 360;
    fill(hue, 80, 100, 70);

    let r = 40 + 20 * sin(t * 2 + i);
    ellipse(x, y, r, r);
saveFrameIfNeeded();
  }

  t += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let recording = false;
let frameId = 0;

function keyPressed() {
  if (key === 'r') {
    recording = !recording;
    if (recording) {
      frameId = 0;
      console.log("REC ON");
    } else {
      console.log("REC OFF");
    }
  }
}

function saveFrameIfNeeded() {
  if (recording) {
    saveCanvas('frame_' + nf(frameId, 5), 'png');
    frameId++;
  }
}

