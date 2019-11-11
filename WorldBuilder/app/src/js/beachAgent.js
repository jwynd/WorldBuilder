/* jshint esversion: 6 */
import Point from './point.js';
import Map from './map.js';

class BeachAgent {
  constructor (tokens, extremity) {
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
      if (this.tokens > 1) {
        for (const n of map.getNeighborsOfType(beachPoint, 'coast')) {
          n.setBiome('beach');
        }
      }
      beachPoint.setElevation(beachPoint.getElevation() - this.extremity);
    }
  }
}
export default BeachAgent;
