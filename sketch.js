class FiguraOjos {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show(state = "open") {
    const eyeDistance = this.size * 0.9;
    const pupilSize = this.size * 0.35;
    const leftX = this.x - eyeDistance * 0.5;
    const rightX = this.x + eyeDistance * 0.5;
    const eyeY = this.y;

    stroke(0);
    strokeWeight(2);
    fill(255);

    if (state === "closed" || state === "leftClosed") {
      line(leftX - this.size * 0.4, eyeY, leftX + this.size * 0.4, eyeY);
    } else {
      ellipse(leftX, eyeY, this.size, this.size * 0.75);
    }

    if (state === "closed" || state === "rightClosed") {
      line(rightX - this.size * 0.4, eyeY, rightX + this.size * 0.4, eyeY);
    } else {
      ellipse(rightX, eyeY, this.size, this.size * 0.75);
    }

    noStroke();
    fill(0);
    if (state === "open" || state === "leftClosed") {
      circle(rightX, eyeY - this.size * 0.15, pupilSize);
    }
    if (state === "open" || state === "rightClosed") {
      circle(leftX, eyeY - this.size * 0.15, pupilSize);
    }
  }
}

let figura;
let video;
let faceMesh;
let eyeX = 200;
let eyeY = 200;
let faceDetected = false;
let noFaceStartTime = null;
let showCatMode = false;
let eyeState = "closed";
let faceCircleActive = false;
let faceCircleStart = null;
let catImg = null;

function preload() {
  catImg = loadImage('Gatito.jpg');
}

function setup() {
  createCanvas(400, 400);
  frameRate(24);

  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  figura = new FiguraOjos(200, 200, 60);

  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(video.elt, {
    onFrame: async () => {
      await faceMesh.send({ image: video.elt });
    },
    width: 400,
    height: 400
  });
  camera.start();
}

function onResults(results) {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseTip = landmarks[1];

    faceDetected = true;
    showCatMode = false;
    noFaceStartTime = null;

    eyeX = map((leftEye.x + rightEye.x) / 2, 0, 1, width, 0);
    eyeY = map((leftEye.y + rightEye.y) / 2, 0, 1, 0, height);

    const noseCenterX = noseTip.x;
    const centered = abs(noseCenterX - 0.5) < 0.08;

    if (centered) {
      if (!faceCircleStart) {
        faceCircleStart = millis();
      }
      const heldTime = millis() - faceCircleStart;
      faceCircleActive = heldTime > 800;
    } else {
      faceCircleActive = false;
      faceCircleStart = null;
    }

    if (noseCenterX > 0.58) {
      eyeState = "rightClosed";
    } else if (noseCenterX < 0.42) {
      eyeState = "leftClosed";
    } else {
      eyeState = "open";
    }
  } else {
    if (faceDetected && !noFaceStartTime) {
      noFaceStartTime = millis();
    }
    faceDetected = false;
    faceCircleActive = false;
    faceCircleStart = null;
    eyeState = "closed";
  }
}

function draw() {
  const now = millis();

  if (!faceDetected) {
    background(0);
    if (noFaceStartTime && now - noFaceStartTime > 8000) {
      showCatMode = true;
    }
  } else {
    if (faceCircleActive) {
      background(240, 120, 190);
    } else {
      background(45, 150, 200);
    }
  }

  if (showCatMode) {
    drawCat();
    drawPhotoMessage();
    return;
  }

  if (!faceDetected) {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text("No se detecta rostro", width / 2, height - 40);
  }

  figura.x = eyeX;
  figura.y = eyeY;
  figura.show(eyeState);

  if (faceCircleActive) {
    noFill();
    stroke(255, 220, 0);
    strokeWeight(4);
    circle(eyeX, eyeY, 140);
  }
}

function drawCat() {
  if (catImg) {
    imageMode(CENTER);
    image(catImg, width / 2, height / 2, width * 0.9, height * 0.9);
    return;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const catSize = 180;

  stroke(0);
  strokeWeight(3);
  fill(255, 220, 180);
  ellipse(centerX, centerY, catSize, catSize * 0.9);

  fill(255, 220, 180);
  triangle(centerX - 70, centerY - 80, centerX - 20, centerY - 120, centerX - 10, centerY - 50);
  triangle(centerX + 70, centerY - 80, centerX + 20, centerY - 120, centerX + 10, centerY - 50);

  fill(255);
  ellipse(centerX - 35, centerY - 10, 40, 40);
  ellipse(centerX + 35, centerY - 10, 40, 40);

  fill(0);
  ellipse(centerX - 35, centerY - 10, 15, 20);
  ellipse(centerX + 35, centerY - 10, 15, 20);

  noFill();
  stroke(0);
  strokeWeight(4);
  arc(centerX, centerY + 20, 60, 50, 0, PI);
}

function drawPhotoMessage() {
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  text("Posa pa la foto", width / 2, height - 30);
}
