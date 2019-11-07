/* This is based off of code by playfuljs-demos
 * https://github.com/hunterloftis/playfuljs-demos/blob/gh-pages/terrain/index.html
 */
/* global
  createCanvas
  createImage
  image
  color
  randomSeed
  floor
  CoastAgent
  MountainAgent
  map
  lerpColor
  RiverAgent
*/
/* jshint esversion: 6 */
let heightmap;
let m;
let c;
let ma; // mountain agent
let r; // river agent
const mWidth = 1280;
const mHeight = 720;
const tokens = 300000;
const limit = 3000;
const worldSeed = 0xa12413adff;

// /////////////////
// Mountain Params//
// /////////////////
const m1 = 30;
const m2 = 1000;
const m3 = 25;
const m4 = 5;
const m5 = 10;
const m6 = 100;
const m7 = 50;
const m8 = 0.9;
const m9 = 1;
const m10 = 5;

function setup () { // ignore error, called by p5
  createCanvas(mWidth, mHeight);
  m = new Map(mWidth, mHeight);
  randomSeed(worldSeed);
  const sPointX = floor(mWidth / 2);
  const sPointY = floor(mHeight / 2);
  const p = m.point(sPointX, sPointY);
  c = new CoastAgent(p, tokens, limit);
  ma = new MountainAgent(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10);
  r = new RiverAgent(10);
  const l = [c, ma, r];
  for (let i = 0; i < l.length; i++) {
    l[i].generate(m);
  }
  makeHeightmap(m);
}

function makeHeightmap (m) {
  heightmap = createImage(mWidth, mHeight);
  heightmap.loadPixels();

  for (let i = 0; i < heightmap.width; ++i) {
    for (let j = 0; j < heightmap.height; ++j) {
      const raw = m.point(i, j).getBiome();
      let col = 0;
      if (raw === 'ocean') {
        col = color(0, 0, 255);
      } else if (raw === 'coast' || raw === 'beach') {
        col = color(0, 255, 0);
      } else if (raw === 'mountain') {
        const col1 = color(0, 255, 0);
        const col2 = color(255, 0, 0);
        const elvLerp = map(m.point(i, j).getElevation(), 0, 255, 0, 1, true);
        col = lerpColor(col1, col2, elvLerp);
      } else if (raw === 'river') {
        col = color(0, 0, 0);
      }
      heightmap.set(i, j, col);
    }
  }
  heightmap.updatePixels();
}
/*
function mousePressed(){

}
*/
function draw() { // ignore error, called by p5
  image(heightmap, 0, 0);
}
