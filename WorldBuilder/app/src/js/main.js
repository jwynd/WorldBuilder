
/* jshint esversion: 6 */

import Point from './point.js';
import Map from './map.js';
import CoastAgent from './coastAgent.js';
import BiomeAgent from './biomeAgent.js';
import MountainAgent from './mountainAgent.js';
import RiverAgent from './riverAgent.js';
import BeachAgent from './beachAgent.js';
import P5Wrapper from 'react-p5-wrapper';
import Random from './random.js';

export default function sketch (p) {
  let heightmap;
  let m;
  let c;
  let ma; // mountain agent
  let r; // river agent
  let b; // biome agent
  let be; // beach agent
  const mWidth = 1280;
  const mHeight = 720;

  // CoastAgent parameters

  // User parameter (abstraction for number of tokens)
  // 0 <= size <= ceiling(lg(mWidth * mHeight))
  // Below ceiling(lg(mWidth * mHeight))/2 is very small
  // Approaching the ceiling (ceiling(lg(mWidth * mHeight)) and ceiling(lg(mWidth * mHeight))-1
  // result in the same island with two agents) too closely leads to suicides and no growth if few enough agents
  const size = 16;

  // User parameter (abstraction for number of agents)
  // 0 <= smoothness < size
  // 7-9 is when the star pattern usually starts developing (should probably stick below 7 or 8)
  const smoothness = 4;

  // 1 <= agents <= tokens
  const agents = Math.pow(2, smoothness);

  // 0 <= tokens <= mWidth * mHeight
  const tokens = Math.pow(2, size);

  // 1 <= limit <= tokens
  const limit = tokens / agents;

  // BeachAgent parameters

  // User parameter (abstraction for tokens)
  // Controls how far inland the coastline will go
  // 1 <= inland <= 3
  const inland = 3;

  // User parameter (Abstraction for beachNoiseMax)
  // Controls how high beaches can reach
  // 0 <= beachHeight <= 1
  const beachHeight = 0.5;

  // User parameter (abstraction for octave)
  // Controls how uniform the coastline is (i.e. is it one connected beach or many disconnected beaches?)
  // 0 <= coastUniformity <= 3
  const coastUniformity = 3;

  // 1 <= octave <= 1000
  const octave = Math.pow(10, coastUniformity);

  // RiverAgent parameters

  // User parameter (number of rivers)
  // 0 <= numRivers <= map.getPointsOfType('shore') / 10;
  const numRivers = 50;

  const worldSeed = 0xa12413adff;
  const debug = true;

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

  p.setup = function () {
    p.createCanvas(mWidth, mHeight);
    const rand = new Random(worldSeed);
    // console.log('Random number: ' + rand.callRandom());
    m = new Map(mWidth, mHeight, rand);
    p.randomSeed(worldSeed);
    p.noiseSeed(worldSeed);
    p.frameRate(1);
    const sPointX = p.floor(mWidth / 2);
    const sPointY = p.floor(mHeight / 2);
    const point = m.point(sPointX, sPointY);
    c = new CoastAgent(point, tokens, limit);
    b = new BiomeAgent();
    be = new BeachAgent(inland, beachHeight, octave);
    ma = new MountainAgent(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10);
    r = new RiverAgent(rand, numRivers);
    const l = [c, b, be, ma, r];
    for (let i = 0; i < l.length; i++) {
      l[i].generate(m);
    }
    p.makeHeightmap();
  };

  p.makeHeightmap = function () {
    heightmap = p.createImage(mWidth, mHeight);
    heightmap.loadPixels();

    for (let i = 0; i < heightmap.width; ++i) {
      for (let j = 0; j < heightmap.height; ++j) {
        const raw = m.point(i, j).getBiome();
        let col = 0;
        if (debug === true) {
          if (raw === 'lake') {
            col = p.color(0, 255, 0);
          } else if (raw === 'river') {
            col = p.color(0, 255, 255);
          } else if (raw === 'beach' || raw === 'shore') {
            col = p.color(255, m.point(i, j).getElevation(), 0);
          } else {
            col = p.color(m.point(i, j).getElevation(), 0, 255);
          }
        } else if (raw === 'ocean') {
          col = p.color(0, 0, 255);
        } else if (raw === 'coast') {
          col = p.color(0, 255, 0);
        } else if (raw === 'beach') {
          col = p.color(255, m.point(i, j).getElevation(), 0);
        } else if (raw === 'mountain') {
          const col1 = p.color(0, 255, 0);
          const col2 = p.color(255, 0, 0);
          const elvLerp = p.map(m.point(i, j).getElevation(), 0, 255, 0, 1, true);
          col = p.lerpColor(col1, col2, elvLerp);
        } else if (raw === 'river') {
          col = p.color(0, 0, 0);
        }
        heightmap.set(i, j, col);
      }
    }
    heightmap.updatePixels();
  };

  p.testRandom = function (r) {
    heightmap = p.createImage(mWidth, mHeight);
    heightmap.loadPixels();

    for (let i = 0; i < mWidth * mHeight; ++i) {
      const x = p.floor(r.callRandom(0, mWidth - 1));
      const y = p.floor(r.callRandom(0, mHeight - 1));
      heightmap.set(x, y, 0);
    }
    heightmap.updatePixels();
  };

  p.draw = function () {
    p.background(255);
    p.image(heightmap, 0, 0);
  };
}
// let heightmap;
// let m;
// let c;
// let ma; // mountain agent
// let r; // river agent
// let b; // biome agent
// const mWidth = 1280;
// const mHeight = 720;
// const tokens = 300000;
// const limit = 3000;
// const worldSeed = 0xa12413adff;
// const debug = true;

// // /////////////////
// // Mountain Params//
// // /////////////////
// const m1 = 30;
// const m2 = 1000;
// const m3 = 25;
// const m4 = 5;
// const m5 = 10;
// const m6 = 100;
// const m7 = 50;
// const m8 = 0.9;
// const m9 = 1;
// const m10 = 5;

// function setup () { // ignore error, called by p5
//   createCanvas(mWidth, mHeight);
//   m = new Map(mWidth, mHeight);
//   randomSeed(worldSeed);
//   noiseSeed(worldSeed);
//   const sPointX = floor(mWidth / 2);
//   const sPointY = floor(mHeight / 2);
//   const p = m.point(sPointX, sPointY);
//   c = new CoastAgent(p, tokens, limit);
//   b = new BiomeAgent();
//   ma = new MountainAgent(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10);
//   r = new RiverAgent(10);
//   const l = [c, b, ma, r];
//   for (let i = 0; i < l.length; i++) {
//     l[i].generate(m);
//   }
//   makeHeightmap(m);
// }

// function makeHeightmap (m) {
//   heightmap = createImage(mWidth, mHeight);
//   heightmap.loadPixels();

//   for (let i = 0; i < heightmap.width; ++i) {
//     for (let j = 0; j < heightmap.height; ++j) {
//       const raw = m.point(i, j).getBiome();
//       let col = 0;
//       if (debug === true) {
//         if (raw === 'lake') {
//           col = color(0, 255, 0);
//         } else if (raw === 'river') {
//           col = color(0, 255, 255);
//         } else {
//           col = color(m.point(i, j).getElevation(), 0, 255);
//         }
//       } else if (raw === 'ocean') {
//         col = color(0, 0, 255);
//       } else if (raw === 'coast' || raw === 'beach') {
//         col = color(0, 255, 0);
//       } else if (raw === 'mountain') {
//         const col1 = color(0, 255, 0);
//         const col2 = color(255, 0, 0);
//         const elvLerp = map(m.point(i, j).getElevation(), 0, 255, 0, 1, true);
//         col = lerpColor(col1, col2, elvLerp);
//       } else if (raw === 'river') {
//         col = color(0, 0, 0);
//       }
//       heightmap.set(i, j, col);
//     }
//   }
//   heightmap.updatePixels();
// }
// /*
// function mousePressed(){

// }
// */
// function draw() { // ignore error, called by p5
//   image(heightmap, 0, 0);
// }
