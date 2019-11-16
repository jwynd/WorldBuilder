/* global
  noise
*/
/* jshint esversion: 6 */
//Want a low octave for large beaches, high for small beaches
//over ten octave looks good

import Point from './point.js';
import Map from './map.js';

class BeachAgent {
  constructor (tokens, beachNoiseMax) {
    this.tokens = tokens;
    this.beachList = null;
    this.beachNoiseMax = beachNoiseMax;
  }

  generate (map) {
    this.beachList = map.getPointsOfType('beach');
    for (const s of this.beachList) {
      if (noise(s.getX(), s.getY()) >= 0.5) {
        s.setBiome('coast');
      }
    }
    while (this.tokens > 0) {
      this.beachify(this.beachList, map);
      this.tokens--;
      this.beachList = map.getPointsOfType('beach');
    }
  }

  beachify (beachList, map) {
    while (beachList.length > 0) {
      const beachPoint = beachList.pop();
      const point = map.getRandomNeighborOfType(beachPoint, 'coast');
      if (point !== undefined && this.tokens > 1 && noise(point.getX() / 10, point.getY() / 10) < this.beachNoiseMax) {
        point.setBiome('beach');
      }
      if (beachPoint.getElevation() > 1) {
        beachPoint.setBiome('beach');
        beachPoint.setElevation(beachPoint.getElevation() - 1);
      }
    }
  }
}
export default BeachAgent;
