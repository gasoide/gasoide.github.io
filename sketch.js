let t = 0;
let intensity = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  background(0, 0, 0, 10);

  translate(width / 2, height / 2);

  let num = 40;
  for (let i = 0; i < num; i++) {
    let angle = (TWO_PI / num) * i + t * 0.3;
    let radius = 150 + 80 * sin(t + i * 0.3) * intensity;

    let x = radius * cos(angle);
    let y = radius * sin(angle);

    let hue = (t * 40 + i * 10) % 360;
    fill(hue, 80, 100, 70);

    let r = 40 + 20 * sin(t * 2 + i) * intensity;
    ellipse(x, y, r, r);
  }

  t += 0.01;
}

function mouseMoved() {
  intensity = map(mouseX, 0, width, 0.2, 3);
}

function keyPressed() {
  if (key === 'c') {
    background(0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
