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
*/
/* jshint esversion: 6 */
let heightmap;
let m;
let c;
let ma; // mountain agent
const mWidth = 1280;
const mHeight = 720;
const tokens = 300000;
const limit = 3000;
const worldSeed = 0xa12413edff;

// /////////////////
// Mountain Params//
// /////////////////
const numberOfMountains = 1;
const mountainTokens = 400;
const width = 50;
const heightMin = .5;
const heightMax = 1;
const turnPeriod = 100;
const foothillPeriod = 50;
const dropoff = .9;
const minElevation = 0;
const noiseAmount = 5;

function setup () { // ignore error, called by p5
  createCanvas(mWidth, mHeight);
  m = new Map(mWidth, mHeight);
  randomSeed(worldSeed);
  const sPointX = floor(mWidth / 2);
  const sPointY = floor(mHeight / 2);
  const p = m.point(sPointX, sPointY);
  c = new CoastAgent(p, tokens, limit);
  //ma = new MountainAgent(numberOfMountains, mountainTokens, width, heightMin, heightMax, turnPeriod, foothillPeriod, dropoff, minElevation, noiseAmount);
  ma = new MountainAgent(100, 50);
  ma.newTestMountainAgent(m, 600, 500, 500, 500);
  c.generate(m);
  /*const l = [c, ma];
  for (let i = 1; i < l.length; i++) {
    l[i].generate(m);
  }*/
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
      } else if (raw === 'coast') {
        console.log('c_elevation ' + m.point(i, j).getElevation());
        col = color(0, 255, 0);
      } else if (raw === 'mountain') {
        const col1 = color(0, 255, 0);
        const col2 = color(255, 0, 0);
        const elvLerp = map(m.point(i, j).getElevation(), 0, 255, 0, 1, true);
        //console.log('M_elevation ' + m.point(i, j).getElevation());
        col = lerpColor(col1, col2, elvLerp);
        col = floor(col / 10) * 10;
        
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
