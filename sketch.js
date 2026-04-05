let t = 0;
let blobs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < 200; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      s: random(10, 40),
      o: random(0.5, 1.5),
      h: random(360)
    });
  }
}

function draw() {
  background(0, 0, 0, 10);

  for (let b of blobs) {
    let n = noise(b.x * 0.002, b.y * 0.002, t);
    let angle = n * TWO_PI * 4;

    b.x += cos(angle) * b.o;
    b.y += sin(angle) * b.o;

    let d = dist(mouseX, mouseY, b.x, b.y);
    if (d < 150) {
      b.x += (b.x - mouseX) * 0.02;
      b.y += (b.y - mouseY) * 0.02;
    }

    if (b.x < 0) b.x = width;
    if (b.x > width) b.x = 0;
    if (b.y < 0) b.y = height;
    if (b.y > height) b.y = 0;

    b.h = (b.h + 0.3) % 360;

    fill(b.h, 80, 100, 40);
    ellipse(b.x, b.y, b.s, b.s);
  }

  t += 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
