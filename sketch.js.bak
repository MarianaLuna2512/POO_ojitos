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



function setup() {

 createCanvas(400, 400);

 frameRate(24);

 figura = new FiguraOjos(200, 200, 60);

}



function draw() {

 background(45, 150, 200);

 figura.x = mouseX;

 figura.y = mouseY;

 figura.show();

}

