/*バラ曲線:極座標の大きさに三角関数を使うことで描ける
r=sin(θ*n/d)
*/
let sakura = [];
let Num = 250;
let endImage; 

// --- メッセージとアニメーションの設定 ---
const MSG1 = "３年生の皆さん\nご卒業おめでとうございます🌸";
const MSG2 = "皆さんの輝かしい未来に\n幸多からんことを！";
const MSG3 = "次のステージへ!"

const MOVE_FRAMES = 80;   
const STAY_FRAMES = 120;  
const BASE_TEXT_SIZE = 36; 

const TIME_PER_ITEM = MOVE_FRAMES + STAY_FRAMES + MOVE_FRAMES;
// サイクルを「3つ分（メッセージ2つ + 画像1つ）」に増やす
const TOTAL_CYCLE = TIME_PER_ITEM * 3; 

// --- 画像の読み込み ---
function preload() {
  // 表示したい画像ファイル名に書き換えてください
  endImage = loadImage('graduate1.png'); 
}

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
  background(180, 210, 255);
  colorMode(HSB);
  
  // 桜は常に降らせる
  for (let i = 0; i < Num; i++) {
    sakura[i].update();
    sakura[i].render();
  }

  // 循環表示（メッセージと画像）の呼び出し
  displayCirculatingContent();
}

function displayCirculatingContent() {
  let currentFrame = frameCount % TOTAL_CYCLE;
  let t = currentFrame % TIME_PER_ITEM; // 各アイテムごとの経過時間(0〜TIME_PER_ITEM)
  let currentY = 0;

  // 共通の動き（y座標）の計算
  if (t < MOVE_FRAMES) {
    currentY = map(t, 0, MOVE_FRAMES, height + 150, height / 2); // 下から中央へ
  } else if (t < MOVE_FRAMES + STAY_FRAMES) {
    currentY = height / 2; // 中央で停止
  } else {
    currentY = map(t, MOVE_FRAMES + STAY_FRAMES, TIME_PER_ITEM, height / 2, -200); // 中央から上へ
  }

  push();
  translate(width / 2, currentY);

  if (currentFrame < TIME_PER_ITEM) {
    // --- 1つ目のメッセージ ---
    drawMessage(MSG1);
  } else if (currentFrame < TIME_PER_ITEM * 2) {
    // --- 2つ目のメッセージ ---
    drawMessage(MSG2);
  } else {
    // --- 画像 ---
    drawImageContent();
    drawMessage(MSG3);
  }
  pop();
}

// 文字を描画する専用の関数
function drawMessage(txt) {
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  textStyle(BOLD);
  fill(255);
  colorMode(RGB);
  stroke(255, 100, 150); 
  strokeWeight(6);
  colorMode(HSB);
  textLeading(BASE_TEXT_SIZE * 1.2); 
  textSize(BASE_TEXT_SIZE);
  text(txt, 0, 0);
}

// 画像を描画する専用の関数
function drawImageContent() {
  imageMode(CENTER);
  // 画面に収まるようにサイズ調整
  let scaleFactor = min(width / endImage.width, (height * 0.7) / endImage.height);
  let w = endImage.width * scaleFactor;
  let h = endImage.height * scaleFactor;
  
  // 画像の周りに白い枠線をつける（写真風）
  //fill(255);
  //noStroke();
  //rectMode(CENTER);
  //rect(0, 0, w + 10, h + 10);
  
  image(endImage, 0, 0, w, h);
}

// --- Sakuraクラス（変更なし） ---
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
    if (x < 0.8) return 0;
    else return 0.8 - x;
  }
}
