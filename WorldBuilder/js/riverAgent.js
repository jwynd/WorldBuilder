// River agent file
// Contains class definition and generate function
/* global
  getRandomPointOfType
  random
*/
/* jshint esversion: 6 */
class RiverAgent {
  constructor (maxRivers = 1) {
    this.maxRivers = maxRivers;
  }

  // will generate maxRivers
  generate (map) {
    const altered = [];
    for (let i = 0; i < this.maxRivers; ++i) {
      Array.prototype.push.apply(altered, this.generateRiver(map)); // only way I found to concatinate arrays
    }
    return altered;
  }

  // will generate 1 river
  generateRiver (map) {
    this.defineBeach(map);
    const b = getRandomPointOfType('beach');
    const m = getRandomPointOfType('mountain');
    let p = b;
    const d = b.dist(m); // want to reduce the distance between b and m
    const altered = [];
    while (p.getBiome() !== 'mountain') {
      // move towards a mountain
      p.setBiome('river');
      altered.push(p);
      const nRaw = map.getNeighbors(p);
      const n = [];
      for (const point of nRaw) {
        const biome = point.getBiome();
        if (biome === 'ocean' || biome === 'river' || biome === 'beach') {
          continue;
        }
        if (point.dist(m) > d) {
          continue;
        }
        n.push(point);
      }
      if (n.length === 0) {
        console.error('failed river');
        for (const point of altered) {
          point.setBiome('xriver');
        }
      }
      p = random(n);
    }
    return altered;
  }

  defineBeach (map) {
    const o = map.getPointsOfType('ocean');
    for (const p of o) {
      const ns = map.getNeighborsOfType(p, 'coast');
      for (const n of ns) {
        n.setBiome('beach');
      }
    }
  }
}
