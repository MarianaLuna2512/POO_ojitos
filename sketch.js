class FiguraOjos {

 constructor(x, y, size) {

  this.x = x;

  this.y = y;

  this.size = size;

 }


 show() {

  fill(255);

  circle(this.x - this.size * 0.5, this.y, this.size);

  fill(0);

  circle(this.x - this.size * 0.3, this.y - this.size * 0.15, this.size * 0.33);



  fill(255);

  circle(this.x + this.size * 0.5, this.y, this.size);

  fill(0);

  circle(this.x + this.size * 0.7, this.y - this.size * 0.15, this.size * 0.33);

 }

}


let figura;
let video;
let faceMesh;
let eyeX = 200;
let eyeY = 200;


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

    eyeX = map((leftEye.x + rightEye.x) / 2, 0, 1, width, 0);
    eyeY = map((leftEye.y + rightEye.y) / 2, 0, 1, 0, height);
  }
}


function draw() {
  background(45, 150, 200);

  figura.x = eyeX;
  figura.y = eyeY;
  figura.show();
}
