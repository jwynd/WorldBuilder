
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

// GLOBAL VALUES //

// Setup parameters

// User parameters
// 0 <= mWidth <= 2000
// 0 <= mHeight <= 2000
export var mWidth = 1280;
export var mHeight = 720;
export var worldSeed = 0xa127a3a25f;

const rand = new Random(worldSeed);

export function setWorldSeed (value) {
  worldSeed = Math.ceil(rand.callRandom(1, 1000000));
}

export function setWidth (value) {
  mWidth = value;
}

export function setHeight (value) {
  mHeight = value;
}

// User parameter
// Must be alphanumeric and between 1 and 30 characters
export var mapName = 'New Map';

export function setName (value) {
  mapName = value;
}

// Initially empty variable used to access heightmap once map is generated
export var heightmap;

// CoastAgent parameters

// User parameter (abstraction for number of tokens)
// 0 <= size <= ceiling(lg(mWidth * mHeight))
// Below ceiling(lg(mWidth * mHeight))/2 is very small
// Approaching the ceiling (ceiling(lg(mWidth * mHeight)) and ceiling(lg(mWidth * mHeight))-1
// results in the same island with two agents) too closely leads to suicides and no growth if few enough agents

export var size = 17;

export function setSize (value) {
  size = value;
}

// User parameter (abstraction for number of agents)
// 0 <= smoothness < size
// 7-9 is when the star pattern usually starts developing (should probably stick below 7 or 8)
export var coastSmoothness = 4;

export function setCoastSmoothness (value) {
  coastSmoothness = value;
}

// varraint Parameters
// Used to set the limits for some of the following variables
export var islandArea = Math.pow(2, size);

export function setIslandArea (value) {
  islandArea = value;
}

export var islandCircumference = 2 * Math.PI * Math.sqrt(islandArea / Math.PI);

export function setIslandCircumference (value) {
  islandCircumference = value;
}

// BeachAgent parameters

// User parameter (abstraction for tokens)
// Controls how far inland the coastline will go
// 1 <= inland <= 3
export var inland = 3;

export function setInland (value) {
  inland = value;
}

// User parameter (Abstraction for beachNoiseMax)
// Controls how high beaches can reach
// 0 <= beachHeight <= 10
export var beachHeight = 5;

export function setBeachHeight (value) {
  beachHeight = value;
}

// User parameter (abstraction for octave)
// Controls how uniform the coastline is (i.e. is it one connected beach or many disconnected beaches?)
// 0 <= coastUniformity <= 3
export var coastUniformity = 2;

export function setCoastUniformity (value) {
  coastUniformity = value;
}

// RiverAgent parameters

// User parameter (number of rivers)
// 0 <= numRivers <= .05(2 * pi * sqrt(islandArea/pi))
// Not an option if there's no mountains
export var numRivers = 10;

export function setNumRivers (value) {
  numRivers = value;
}

// MountainAgent parameters

// User parameter
// Set number of mountain ranges
// 0 <= numMountainRanges <= 10
export var numMountainRanges = 15;

export function setNumMountainRanges (value) {
  numMountainRanges = value;
}

// User parameter
// islandCircumference / 10 <= widthMountainRange <= islandCircumference / 3
export var widthMountainRange = 10;

export function setWidthMountainRange (value) {
  widthMountainRange = value;
}

// User parameter
// 150 <= maxHeightMountainRange <= 250
export var maxHeightMountainRange = 200;

export function setMaxHeightMountainRange (value) {
  maxHeightMountainRange = value;
}

// User Parameter
// 1 <= squiggliness <= 90
// Equal to minturnangle, maxturnangle = 2*squiggliness
export var squiggliness = 50;

export function setSquiggliness (value) {
  squiggliness = value;
}

// User parameter
// Controls how quickly mountains drop to the ground
// 0 <= smoothness <= 100
export var mountainSmoothness = 50;

export function setMountainSmoothness (value) {
  mountainSmoothness = value;
}

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

  // 1 <= octave <= 1000
  const octave = Math.pow(10, coastUniformity);

  // MountainAgent parameters

  // Controls the length of a mountain range
  const mountainTokens = Math.ceil((islandArea / widthMountainRange) * 0.02);

  // Controls height of mountain peaks
  const maxPeak = maxHeightMountainRange;
  const minPeak = maxPeak * 0.7;

  // Controls how long an agent walks before turning
  const maxWalkTime = Math.ceil((1 - (squiggliness / 100)) * mountainTokens * 0.05);
  const minWalkTime = Math.ceil(maxWalkTime * 0.5);

  // Turn angle in degrees
  const minTurnAngle = squiggliness;
  const maxTurnAngle = squiggliness * 2;

  p.setup = function () {
    console.log(mountainTokens);
    console.log(maxHeightMountainRange);
    console.log(maxPeak);
    console.log(minPeak);
    console.log(maxWalkTime);
    console.log(minWalkTime);
    console.log(minTurnAngle);
    console.log(maxTurnAngle);

    p.createCanvas(p.windowWidth, p.windowHeight);
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
    console.log(ma);

    r = new RiverAgent(rand, numRivers);
    console.log(r);
    const l = [c, b, be, ma, r];
    console.log('before generation');
    for (let i = 0; i < l.length; i++) {
      console.log(i);
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
        break;/*
      case 'coast':
        let bCoast = 60 + ((scorePoint(map, i, j) + 6) * 30 / 12);
        col = p.color('hsb(82, 47%, ' + bCoast + '%)');
        break;
      case 'mountain':
        col = p.color(205,142,99);
        let bMount = 50 + ((scorePoint(map, i, j) + 6) * 40 / 12);
        col = p.color('hsb(19, 55%, ' + bMount + '%)');
        break; *//*
      case 'ridge':
        col = p.color(0, 0, 0);
        console.log('ridge found');
        break; */
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
