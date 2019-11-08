/* global
noise
*/
/* jshint esversion: 6 */
class beachAgent {
  constructor (seedPoint, tokens, limit, range, max, min, walk) {
    this.location = seedPoint;
    this.tokens = tokens;
    this.heightLimit = limit;
    this.heightMax = max;
    this.heightMin = min;
    this.walkSize = walk;
  }

  generate (map) {
    while (this.tokens > 0) {
      while (this.location.getElevation() >= this.limit) {
        this.location = map.getRandomPointOfType('shore');
      }
      this.beachify(this.location);
      this.location = map.getRandomPointOfType('shore');
    }
  }

  beachify (point) {
    let newElevation = Math.ceil(this.heightMax * noise(point.getX(), point.getY()));
    newElevation = Math.max(newElevation, this.heightMin);
    point.setElevation(newElevation);
    point.setBiome('beach');
  }
}
