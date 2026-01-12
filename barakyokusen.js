/*バラ曲線:極座標の大きさに三角関数を使うことで模様を描ける
r=sin(θ*n/d)
*/
let sakura = [];
let Num = 100;

// --- 変更点：メッセージに \n を入れて改行 ---
const MSG1 = "３年生の皆さん\nご卒業おめでとうございます🌸";
const MSG2 = "皆さんの輝かしい未来に\n幸多からんことを！";

// 時間設定（フレーム単位）
const FADE_FRAMES = 60;  
const STAY_FRAMES = 120; 
const BASE_TEXT_SIZE = 36; // 改行して横幅に余裕ができたので、少し大きくしました
// -------------------------------------------

const TIME_PER_MSG = FADE_FRAMES + STAY_FRAMES + FADE_FRAMES;
const TOTAL_CYCLE = TIME_PER_MSG * 2;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB);
  noStroke();
  for (let i = 0; i < Num; i++) {
    sakura.push(new Sakura());
  }
}

function draw() {
  colorMode(RGB);
  background(180, 208, 255);
  colorMode(HSB);
  
  for (let i = 0; i < Num; i++) {
    sakura[i].update();
    sakura[i].render();
  }

  displayGraduationMessage();
}

function displayGraduationMessage() {
  push();
  let currentFrame = frameCount % TOTAL_CYCLE;
  let currentScale = 0;
  let currentMsg = "";

  if (currentFrame < TIME_PER_MSG) {
    currentMsg = MSG1;
    let t = currentFrame;
    if (t < FADE_FRAMES) {
      currentScale = map(t, 0, FADE_FRAMES, 0, 1);
    } else if (t < FADE_FRAMES + STAY_FRAMES) {
      currentScale = 1;
    } else {
      currentScale = map(t, FADE_FRAMES + STAY_FRAMES, TIME_PER_MSG, 1, 0);
    }
  } else {
    currentMsg = MSG2;
    let t = currentFrame - TIME_PER_MSG;
    if (t < FADE_FRAMES) {
      currentScale = map(t, 0, FADE_FRAMES, 0, 1);
    } else if (t < FADE_FRAMES + STAY_FRAMES) {
      currentScale = 1;
    } else {
      currentScale = map(t, FADE_FRAMES + STAY_FRAMES, TIME_PER_MSG, 1, 0);
    }
  }

  if (currentScale > 0.001) {
    translate(width / 2, height / 2);
    scale(currentScale);
    
    textAlign(CENTER, CENTER);
    textFont('sans-serif');
    textStyle(BOLD);
    fill(255);
    colorMode(RGB);
    stroke(340, 50, 50);
    colorMode(HSB);
    strokeWeight(4 / currentScale);
    
    // 行間を少し広げる設定（必要に応じて調整してください）
    textLeading(BASE_TEXT_SIZE * 1.2); 
    
    textSize(BASE_TEXT_SIZE);
    text(currentMsg, 0, 0);
  }
  pop();
}

class Sakura {
  constructor() {
    this.n = 4;
    this.size = random(20, 50);
    this.xBase = random(width);
    this.xRadius = random(50, 100);
    this.xTheta = random(360);
    this.xaVelocity = random(1, 2);
    this.vecLocation = createVector(this.xBase, random(height));
    this.yVelocity = this.size / 20;
    this.hue = random(347, 353);
    this.saturation = random(25, 31);
    this.brightness = 100;
    this.alpha = random(0.6, 1);
    this.ySizeTheta = random(360);
    this.ySizeAVelocity = this.size / 20;
    this.yScale = 1;
  }

  update() {
    this.vecLocation.x = this.xBase + this.xRadius * sin(radians(this.xTheta));
    this.xTheta += this.xaVelocity;
    this.vecLocation.y += this.yVelocity;
    this.yScale = abs(sin(radians(this.ySizeTheta)));
    this.ySizeTheta += this.ySizeAVelocity;
    if (this.vecLocation.y > height) {
      this.vecLocation.y = -this.size;
    }
  }

  render() {
    fill(this.hue, this.saturation, this.brightness, this.alpha);
    push();
    translate(this.vecLocation.x, this.vecLocation.y);
    rotate(radians(this.xTheta));
    beginShape();
    for (let theta = 0; theta < 360 / 4; theta++) {
      let A = this.n / PI * radians(theta);
      let mod = floor(A) % 2;
      let r0 = pow(-1, mod) * (A - floor(A)) + mod;
      let r = r0 + 2 * this.calculateH(r0);
      let x = this.size * r * cos(radians(theta));
      let y = this.size * this.yScale * r * sin(radians(theta));
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  calculateH(x) {
    if (x < 0.8) {
      return 0;
    } else {
      return 0.8 - x;
    }
  }
}
