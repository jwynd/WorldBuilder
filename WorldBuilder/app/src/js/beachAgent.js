/* global
  noise
*/
/* jshint esversion: 6 */
//Want a low octave for large beaches, high for small beaches
//over ten octave looks good

import Point from './point.js';
import Map from './map.js';

class BeachAgent {
  constructor (tokens, beachNoiseMax, octave) {
    this.tokens = tokens;
    this.beachList = null;
    this.beachNoiseMax = beachNoiseMax;
    this.octave = octave;
  }

  generate (map) {
    this.defineShoreline(map);
    while (this.tokens > 0) {
      const beachList = map.getPointsOfType('beach');
      this.beachify(beachList, map);
      this.tokens--;
    }
  }

  beachify (beachList, map) {
    while (beachList.length > 0) {
      const beachPoint = beachList.pop();
      const point = map.getRandomNeighborOfType(beachPoint, 'coast');
      if (point !== undefined && this.tokens > 1 && noise(point.getX() / this.octave, point.getY() / this.octave) < this.beachNoiseMax) {
        point.setBiome('beach');
      }
      if (beachPoint.getElevation() > 1) {
        beachPoint.setElevation(beachPoint.getElevation() - 1);
      }
    }
  }

  defineShoreline (map) {
    const c = map.getPointsOfType('coast');
    for (const p of c) {
      if (map.getNeighborsOfType(p, 'ocean').length > 0 && noise(p.getX() / this.octave, p.getY() / this.octave) < this.beachNoiseMax) {
        p.setBiome('beach');
      }
    }
  }
}
export default BeachAgent;
