/* global
  noise
*/
/* jshint esversion: 6 */
import Point from './point.js';
import Map from './map.js';

class BeachAgent {
  constructor (tokens, extremity, uniformity) {
    this.tokens = tokens;
    this.beachList = null;
    this.extremity = extremity;
  }

  generate (map) {
    while (this.tokens > 0) {
      this.beachList = map.getPointsOfType('beach');
      this.beachify(this.beachList, map);
      this.tokens--;
    }
  }

  beachify (beachList, map) {
    while (beachList.length > 0) {
      const beachPoint = beachList.pop();
      let p = map.getRandomNeighborOfType(beachPoint, 'coast');
      if (this.tokens > 1 && p !== undefined) {
        p.setBiome('beach');
      }
      if (beachPoint.getElevation() > 1) {
        beachPoint.setElevation(beachPoint.getElevation() - this.extremity);
      }
    }
  }
}
export default BeachAgent;
