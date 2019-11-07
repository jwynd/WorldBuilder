// River agent file
// Contains class definition and generate function
/* global floor random */
/* jshint esversion: 6 */
import Point from './point.js';
import Map from './map.js';
class RiverAgent {
  constructor (maxRivers = 1, wanderSteps = 1000, wanderCut = 50) {
    this.maxRivers = maxRivers;
    this.wanderSteps = wanderSteps;
    this.wanderCut = wanderCut;
  }

  // will generate maxRivers
  generate (map) {
    const altered = [];
    for (let i = 0; i < this.maxRivers; ++i) {
      console.log('river ' + (i + 1));
      Array.prototype.push.apply(altered, this.generateRiver(map)); // only way I found to concatinate arrays
    }
    return altered;
  }

  // will generate 1 river
  generateRiver (map) {
    const b = map.getRandomPointOfType('beach');
    const m = map.getRandomPointOfType('mountain');
    let p = b;
    let wander = null;
    let d = b.dist(m); // want to reduce the distance between b and m
    const altered = [];
    let count = 0;
    while (p.getBiome() !== 'mountain') {
      // move towards a mountain
      count++;
      p.setBiome('river');
      altered.push(p);
      const nRaw = map.getNeighbors(p);

      if (wander === null) {
        nRaw.sort(function (p1, p2) { return p1.dist(m) - p2.dist(m); });
        for (const point of nRaw) {
          wander = this.generateWanderPoint(map, p, p.dir(point));
          if (wander !== null) break;
        }
      }
      // console.log('Wander Point:\n' + wander.toString());
      d = p.dist(wander);
      const n = [];

      for (const point of nRaw) {
        const biome = point.getBiome();
        if (biome === 'ocean') {
          continue;
        }
        if (point.dist(wander) <= d) {
          n.push(point);
        }
      }
      if (n.length === 0) {
        console.error('failed river');
        return altered;
      }
      p = pickN(n, wander);
      if (p.dist(wander) === 0 || count > this.wanderCut) wander = null;
    }
    return altered;
  }

  // pick a random point to wander to.
  generateWanderPoint (map, p, dir) {
    const points = [];
    let x;
    let y;
    switch (dir) {
      case 'north':
        x = [floor(-this.wanderSteps / 2), floor(this.wanderSteps / 2)];
        y = [-this.wanderSteps, 0];
        break;
      case 'northeast':
        x = [0, this.wanderSteps];
        y = [-this.wanderSteps, 0];
        break;
      case 'east':
        x = [0, this.wanderSteps];
        y = [floor(-this.wanderSteps / 2), floor(this.wanderSteps / 2)];
        break;
      case 'southeast':
        x = [0, this.wanderSteps];
        y = [0, this.wanderSteps];
        break;
      case 'south':
        x = [floor(-this.wanderSteps / 2), floor(this.wanderSteps / 2)];
        y = [0, this.wanderSteps];
        break;
      case 'southwest':
        x = [-this.wanderSteps, 0];
        y = [0, this.wanderSteps];
        break;
      case 'west':
        x = [-this.wanderSteps, 0];
        y = [floor(-this.wanderSteps / 2), floor(this.wanderSteps / 2)];
        break;
      case 'northwest':
        x = [-this.wanderSteps, 0];
        y = [-this.wanderSteps, 0];
        break;
      default:
        console.error('generateWanderPoints invalid direction');
        return null;
    }
    if (x[0] < 0) x[0] = 0;
    if (x[1] > map.width - 1) x[1] = map.width - 1;
    if (y[0] < 0) y[0] = 0;
    if (y[1] > map.height - 1) y[1] = map.height - 1;
    for (let i = x[0]; i < x[1]; ++i) {
      for (let j = y[0]; j < y[1]; ++j) {
        points.push(map.point(i, j));
      }
    }
    if (points.length === 0) return null;
    return random(points);
  }
}

function pickN (ns, dest) {
  let min = ns[0];
  for (const n of ns) {
    if (dest.dist(n) < dest.dist(min)) {
      min = n;
    }
  }
  return min;
}
export default RiverAgent;
