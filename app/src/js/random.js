// create the random class for use in agents

/* jshint esversion: 6 */
// /* global randomSeed random */

import p5 from 'p5';

class Random extends p5 {
  constructor (seed = 0xcafe00face) {
    super();
    this.seed = seed;
    this.randomSeed(seed);
  }

  setSeed (seed) {
    this.seed = seed;
    this.randomSeed(seed);
  }

  getSeed () {
    return this.seed;
  }

  callRandom (min = null, max = null) {
    if (min === null && max === null) {
      return this.random();
    } else if (min !== null && max === null) {
      return this.random(min);
    } else {
      return this.random(min, max);
    }
  }
}

export default Random;

// export default function randomGenerator (r) {

//   r.setSeed = function (seed) {
//     r.randomSeed(seed);
//   };

//   r.getSeed = function () {
//     return this.seed;
//   }

//   r.nextRandom = function (min = null, max = null) {
//     if Array.isArray(min)
//   }
// }
