
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
import dbWrite from './dbWrite.js';
import dbRead from './dbRead.js';

// GLOBAL VALUES //

// Setup parameters

// User parameters
// 0 <= mWidth <= 2000
// 0 <= mHeight <= 2000
let mWidth = 1280;
let mHeight = 720;

// User parameter
// Must be alphanumeric and between 1 and 30 characters
let mapName = 'New Map';

// Initially empty variable used to access heightmap once map is generated
let heightmap;

// CoastAgent parameters

// User parameter (abstraction for number of tokens)
// 0 <= size <= ceiling(lg(mWidth * mHeight))
// Below ceiling(lg(mWidth * mHeight))/2 is very small
// Approaching the ceiling (ceiling(lg(mWidth * mHeight)) and ceiling(lg(mWidth * mHeight))-1
// results in the same island with two agents) too closely leads to suicides and no growth if few enough agents
let size = 16;

// User parameter (abstraction for number of agents)
// 0 <= smoothness < size
// 7-9 is when the star pattern usually starts developing (should probably stick below 7 or 8)
let coastSmoothness = 6;

// Constraint Parameters
// Used to set the limits for some of the following variables
const islandArea = Math.pow(2, size);

const islandCircumference = 2 * Math.PI * Math.sqrt(islandArea / Math.PI);

// BeachAgent parameters

// User parameter (abstraction for tokens)
// Controls how far inland the coastline will go
// 1 <= inland <= 3
let inland = 3;

// User parameter (Abstraction for beachNoiseMax)
// Controls how high beaches can reach
// 0 <= beachHeight <= 10
let beachHeight = 5;

// User parameter (abstraction for octave)
// Controls how uniform the coastline is (i.e. is it one connected beach or many disconnected beaches?)
// 0 <= coastUniformity <= 3
let coastUniformity = 1;

// RiverAgent parameters

// User parameter (number of rivers)
// 0 <= numRivers <= .05(2 * pi * sqrt(islandArea/pi))
// Not an option if there's no mountains
let numRivers = 10;

// MountainAgent parameters

// User parameter
// Set number of mountain ranges
// 0 <= numMountainRanges <= 0.05 * islandArea
let numMountainRanges = 5;

// User parameter
// islandCircumference / 10 <= widthMountainRange <= islandCircumference / 3
let widthMountainRange = 10;

// User Parameter
// 0 <= squiggliness <= 90
// Equal to minturnangle, maxturnangle = 2*squiggliness
let squiggliness = 70;

// User parameter
// Controls how quickly mountains drop to the ground
// 0 <= smoothness <= 100
let mountainSmoothness = 50;

//testing
let minCoast = 255;
let maxCoast = 0;
let minMount = 255;
let maxMount = 0;
let minScoreCoast = 10000;
let maxScoreCoast = -10000;
let minScoreMount = 10000;
let maxScoreMount = -10000;

export default function sketch (p) {
  let heightmap;
  let m;
  let c;
  let ma; // mountain agent
  let r; // river agent
  let b; // biome agent
  let be; // beach agent

  // CoastAgent parameters

  // 1 <= agents <= tokens
  const agents = Math.pow(2, coastSmoothness);

  // 0 <= tokens <= mWidth * mHeight
  const tokens = islandArea;

  // 1 <= limit <= tokens
  const limit = tokens / agents;

  // BeachAgent parameters

  // 1 <= octave <= 1000
  const octave = Math.pow(10, coastUniformity);

  // MountainAgent parameters

  // Controls the length of a mountain range
  const mountainTokens = 150/* (islandArea / widthMountainRange) * 0.1 */;

  // Controls height of mountain peaks
  const maxPeak = 220;
  const minPeak = maxPeak * 0.5;

  // Controls how long an agent walks before turning
  const maxWalkTime = 20/* (1 - (squiggliness / 100)) * mountainTokens */;
  const minWalkTime = 5/* maxWalkTime * 0.5 */;

  // Turn angle in degrees
  const minTurnAngle = 10/* squiggliness */;
  const maxTurnAngle = 70/* squiggliness * 2 */;

  // Misc fields
  const worldSeed = 0xa127a3a25f;
  const debug = true;
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(182, 228, 251); // set this to the same color as the ocean.
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
    be = new BeachAgent(inland, beachHeight / 10, octave);
    ma = new MountainAgent(numMountainRanges, mountainTokens, widthMountainRange, minPeak, maxPeak,
      minWalkTime, maxWalkTime, minTurnAngle, maxTurnAngle, mountainSmoothness, 1, rand);

    r = new RiverAgent(rand, numRivers);
    const l = [c, b, be, ma, r];
    for (let i = 0; i < l.length; i++) {
      l[i].generate(m);
    }
    console.log(m.getPointsOfType('mountain'));
    p.makeHeightmap();
  };

  p.makeHeightmap = function () {
    heightmap = p.createImage(mWidth, mHeight);
    heightmap.loadPixels();

    for (let i = 0; i < heightmap.width; ++i) {
      for (let j = 0; j < heightmap.height; ++j) {
        const raw = m.point(i, j).getBiome();
        if (raw !== 'ocean' && raw !== 'mountain') {
          smoothPoint(m, i, j);
        }
      }
    }

    for (let i = 0; i < heightmap.width; ++i) {
      for (let j = 0; j < heightmap.height; ++j) {
        const raw = m.point(i, j).getBiome();
        if (raw !== 'ocean') {
          smoothPoint(m, i, j);
        }
        if (raw === 'coast') {
          const score = scorePoint(m, i, j);
          if (score < minScoreCoast) {
            minScoreCoast = score;
          } else if (score > maxScoreCoast) {
            maxScoreCoast = score;
          }
          if (m.point(i, j).getElevation() < minCoast) {
            minCoast = m.point(i, j).getElevation();
          } else if (m.point(i, j).getElevation() > maxCoast) {
            maxCoast = m.point(i, j).getElevation();
          }
        } else if (raw === 'mountain') {
          const score = scorePoint(m, i, j);
          if (score < minScoreMount) {
            minScoreMount = score;
          } else if (score > maxScoreMount) {
            maxScoreMount = score;
          }
          if (m.point(i, j).getElevation() < minMount) {
            minMount = m.point(i, j).getElevation();
          } else if (m.point(i, j).getElevation() > maxMount) {
            maxMount = m.point(i, j).getElevation();
          }
        }
      }
    }

    for (let i = 0; i < heightmap.width; ++i) {
      for (let j = 0; j < heightmap.height; ++j) {
        const raw = m.point(i, j).getBiome();
        let col = 0;
        col = determineColor(m, raw, col, i, j);
        heightmap.set(i, j, col);
      }
    }
    heightmap.updatePixels();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(182, 228, 251); // set this to the same color as the ocean.
    p.imageMode(p.CENTER);
    if (p.windowHeight > p.windowWidth * 0.5625) {
      p.image(heightmap, p.width / 2, p.height / 2, p.windowWidth, p.windowWidth * (mHeight / mWidth));
    } else {
      p.image(heightmap, p.width / 2, p.height / 2, p.windowHeight * (mWidth / mHeight), p.windowHeight);
    }
    if (debug) { // Get debug information and test database
      mapName = 'Map 1';
      p.textSize(24);
      p.text('Name: ' + mapName, 0, 30);
      p.text('Size: ' + size, 0, 60);
      p.text('Coast Smoothness: ' + coastSmoothness, 0, 90);
      p.text('Inland: ' + inland, 0, 120);
      p.text('Beach Height: ' + beachHeight, 0, 150);
      p.text('Coast Uniformity: ' + coastUniformity, 0, 180);
      p.text('Rivers: ' + numRivers, 0, 210);
      p.text('Mountain Ranges: ' + numMountainRanges, 0, 240);
      p.text('Mountain Range Width: ' + widthMountainRange, 0, 270);
      p.text('Squiggliness: ' + squiggliness, 0, 300);
      p.text('Mountain Smoothness: ' + mountainSmoothness, 0, 330);
      if (mapName === 'Map 1' && p.mouseIsPressed) {
        dbWrite();
        mapName = 'Map 2';
        size = 20;
        coastSmoothness = 4;
        inland = 6;
        beachHeight = 1;
        coastUniformity = 2;
        numRivers = 30;
        numMountainRanges = 10;
        widthMountainRange = 2;
        squiggliness = 10;
        mountainSmoothness = 30;
      } else if (mapName === 'Map 2' && p.mouseIsPressed) {
        const map1 = dbRead();
        mapName = map1.mapName;
        size = map1.size;
        coastSmoothness = map1.coastSmoothness;
        inland = map1.inland;
        beachHeight = map1.beachHeight;
        coastUniformity = map1.coastUniformity;
        numRivers = map1.numRivers;
        numMountainRanges = map1.numMountainRanges;
        widthMountainRange = map1.widthMountainRange;
        squiggliness = map1.squiggliness;
        mountainSmoothness = map1.mountainSmoothness;
      }
    }
  };

  function determineColor (map, raw, col, i, j) {
    switch (raw) {
      case 'ocean':
        col = p.color(182, 228, 251);
        break;
      case 'lake':
        col = p.color(182, 228, 251);
        break;
      case 'river':
        col = p.color(148, 235, 242);
        break;
      case 'beach':
        col = p.color(255, 255, 192);
        break;
      case 'shore':
        col = p.color(255, 255, 192);
        break;
      case 'tallShore':
        col = p.color(133, 190, 139);
        break;
        /*
      case 'coast':
        let bCoast = 60 + ((scorePoint(map, i, j) + 6) * 30 / 12);
        col = p.color('hsb(82, 47%, ' + bCoast + '%)');
        break;
      case 'mountain':
        col = p.color(205,142,99);
        let bMount = 50 + ((scorePoint(map, i, j) + 6) * 40 / 12);
        col = p.color('hsb(19, 55%, ' + bMount + '%)');
        break;
        *//*
      case 'ridge':
        col = p.color(0, 0, 0);
        console.log('ridge found');
        break;
        */
      default:
        const elevation = map.point(i, j).getElevation();
        if (elevation < 25) {
          const bCoast = 60 + ((scorePoint(map, i, j) + 6) * 30 / 12);
          col = p.color('hsb(82, 47%, ' + bCoast + '%)');
        } else if (elevation < 35) {
          const bMount = 80 + ((scorePoint(map, i, j) + 6) * 15 / 12);
          col = p.color('hsb(45, 33%, ' + bMount + '%)');
        } else if (elevation < 100) {
          const bMount = 70 + ((scorePoint(map, i, j) + 6) * 20 / 12);
          col = p.color('hsb(39, 42%, ' + bMount + '%)');
        } else if (elevation < 130) {
          const bMount = 70 + ((scorePoint(map, i, j) + 6) * 20 / 12);
          col = p.color('hsb(31, 43%, ' + bMount + '%)');
        } else if (elevation < 200) {
          const bMount = 50 + ((scorePoint(map, i, j) + 6) * 40 / 12);
          col = p.color('hsb(19, 55%, ' + bMount + '%)');
        } else {
          const bMount = 50 + ((scorePoint(map, i, j) + 6) * 50 / 12);
          col = p.color('hsb(19, 0%, ' + bMount + '%)');
        }
    }
    return col;
  }

  function scorePoint (map, i, j) {
    let score = 0;
    const elevation = map.point(i, j).getElevation();
    const diff = 0.75;
    // console.log(map.point(i+1, j).getElevation() - elevation);

    if (elevation < map.point(i + 1, j).getElevation() && map.point(i + 1, j).getElevation() - elevation > diff) {
      score++;
    } else if (elevation - map.point(i + 1, j).getElevation() > diff) {
      score--;
    }
    if (elevation < map.point(i + 1, j + 1).getElevation() && map.point(i + 1, j + 1).getElevation() - elevation > diff) {
      score++;
    } else if (elevation - map.point(i + 1, j + 1).getElevation() > diff) {
      score--;
    }
    if (elevation < map.point(i, j + 1).getElevation() && map.point(i, j + 1).getElevation() - elevation > diff) {
      score++;
    } else if (elevation - map.point(i, j + 1).getElevation() > diff) {
      score--;
    }

    if (elevation > map.point(i, j - 1).getElevation() && elevation - map.point(i, j - 1).getElevation() > diff) {
      score++;
    } else if (map.point(i, j - 1).getElevation() - elevation > diff) {
      score--;
    }
    if (elevation > map.point(i - 1, j - 1).getElevation() && elevation - map.point(i - 1, j - 1).getElevation() > diff) {
      score++;
    } else if (map.point(i - 1, j - 1).getElevation() - elevation > diff) {
      score--;
    }
    if (elevation > map.point(i - 1, j).getElevation() && elevation - map.point(i - 1, j).getElevation() > diff) {
      score++;
    } else if (map.point(i - 1, j).getElevation() - elevation > diff) {
      score--;
    }
    return score;
  }

  function smoothPoint (map, i, j) {
    let total = map.point(i, j).getElevation() * 3;
    total += map.point(i - 1, j).getElevation();
    total += map.point(i - 2, j).getElevation();
    total += map.point(i, j - 1).getElevation();
    total += map.point(i, j - 2).getElevation();
    total += map.point(i + 1, j).getElevation();
    total += map.point(i + 2, j).getElevation();
    total += map.point(i, j + 1).getElevation();
    total += map.point(i, j + 2).getElevation();
    total /= 11;
    map.point(i, j).setElevation(total);
  }
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
