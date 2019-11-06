/* jshint esversion: 6 */
class biomeAgent {
  findLakesShores (map) {
    /*
    Assigns water to be ocean or lake as appropriate for a whole map.
    Also assigns coastpoints as land adjacent to ocean.
    */
    this.approximateLakes(map);
    const lakes = map.getPointsOfType('lake');
    const visitedLakes = [];
    while (visitedLakes.length() < lakes) {
      const lakePoint = lakes[random(0, lakes.length())];
      if (this.findOcean(lakePoint, map, visitedLakes)) {
        const visitedNodes = [];
        this.assignOcean(lakePoint, map, visitedNodes);
      }
    }
  }

  approximateLakes (map) {
    /*
    Overestimates the number of lake points in the map
    */
    const beachPoints = map.getPointsOfType('beach');
    for (const b of beachPoints) {
      const oceanPoints = map.getNeighborsOfType(b, 'ocean', true);
      for (const o of oceanPoints) {
        const direction = b.dir(o);
        this._moveAlong(o, direction, map);
      }
    }
  }

  _moveAlong (point, direction, map) {
    /*
    Helper function for approximateLakes, recursively checks a line of water to determine if it's a set of lake or ocean points.
    */
    if (point === null) {
      return 'ocean';
    } else if (point.getBiome() === 'coast') {
      return 'lake';
    } else {
      const type = this.moveAlong(map.getNeighbor(point, direction));
      point.setBiome(type);
      return type;
    }
  }

  findOcean (point, map, visitedLakes) {
    /*
    Returns true if the point is connected to an ocean point, otherwise false.
    */
    if (point === null) {
      console.log('biomeAgent error in findOcean: point is null');
      return null;
    } else if (point.getBiome() === 'ocean') {
      return true;
    } else if (point.getBiome() === 'coast') {
      return false;
    } else {
      const successors = map.getNeighbors(point);
      let oceanBool = false;
      for (const s of successors) {
        oceanBool = oceanBool || this.findOcean(s);
        visitedLakes.append(s);
      }
      return oceanBool;
    }
  }

  assignOcean (point, map, visitedNodes) {
    /*
    Discovers and sets the biomes of all reachable lake points from point ocean.
    */
    if (point === null) {
      console.log('biomeAgent error in assignOcean: point is null');
      return null;
    } else if (point.getBiome() === 'lake') {
      point.setBiome('ocean');
      const successors = map.getNeighbors(point);
      for (const s of successors) {
        if (visitedNodes.includes(s)) {
          continue;
        } else {
          visitedNodes.append(s);
          this.assignOcean(s, map, visitedNodes);
        }
      }
    } else if (point.getBiome() === 'coast') {
      point.setBiome('shoreline');
    }
  }
}
