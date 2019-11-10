// create the random class for use in agents

/* jshint esversion: 6 */

class Random {
  constructor (seed = 0xcafe00face) {
    this.seed = seed;
  }

  setSeed (seed) {
    this.seed = seed;
  }

  getSeed () {
    return this.seed;
  }

  random (min = null, max = null) {
    if (Array.isArray(min) && max === null) {
      const l = min;
      const len = l.length;
      return l[this.rand(0, len - 1)];
    } else if (min === null && max === null) {
      return this.rand(0, 1);
    } else if (min !== null && max !== null) {
      this.setSeed((this.getSeed() * 9301 + 49297) % 233280); // common psuedorandom algorithm
      const rnd = this.getSeed() / 233280;
      return min + rnd * (max - min);
    } else {
      console.error('Random number generator failed');
      return null;
    }
  }
}

export default Random;
