/* jshint esversion: 6 */
class BiomeAgent {
  generate (map) {
    /*
    Assigns water to be ocean or lake as appropriate for a whole map.
    Also assigns coastpoints as land adjacent to ocean.
    */
    this.defineBeach(map);
    this.approximateLakes(map);
    const unvisitedLakes = map.getPointsOfType('lake');
    const visitedLakes = [];
    while (unvisitedLakes.length > 0) {
      const lakePoint = unvisitedLakes.pop();
      visitedLakes.push(lakePoint);
      if (this.findOcean(lakePoint, map, visitedLakes)) {
        this.assignOcean(lakePoint, map);
      }
    }
  }

  defineBeach (map) {
    const c = map.getPointsOfType('coast');
    for (const p of c) {
      if (map.getNeighborsOfType(p, 'ocean').length > 0) {
        p.setBiome('beach');
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
      const type = this._moveAlong(map.getNeighbor(point, direction), direction, map);
      point.setBiome(type);
      return type;
    }
  }

  findOcean (point, map, visitedLakes) {
    /*
    Returns true if the point is connected to an ocean point, otherwise false.
    */
    const fringe = [];
    let oceanBool = false;
    fringe.push(point);
    while (fringe.length > 0) {
      const parent = fringe.pop();
      if (parent === null) {
        console.log('biomeAgent error in findOcean: point is null');
        return null;
      } else if (parent.getBiome() === 'ocean') {
        oceanBool = true;
      } else if (parent.getBiome() === 'lake') {
        const successors = map.getNeighbors(parent);
        for (const s of successors) {
          if (!visitedLakes.includes(s)) {
            fringe.push(s);
            visitedLakes.push(s);
          }
        }
      }
    }
    return oceanBool;
  }

  assignOcean (point, map) {
    /*
    Discovers and sets the biomes of all reachable lake points from point ocean.
    */
    const fringe = [];
    const visitedNodes = [];
    fringe.push(point);
    while (fringe.length > 0) {
      const parent = fringe.pop();
      if (parent === null) {
        console.log('biomeAgent error in findOcean: point is null');
        return null;
      } else if (parent.getBiome() === 'coast') {
        parent.setBiome('beach');
      } else if (parent.getBiome() === 'lake') {
        parent.setBiome('ocean');
        const successors = map.getNeighbors(parent);
        for (const s of successors) {
          if (!visitedNodes.includes(s)) {
            fringe.push(s);
            visitedNodes.push(s);
          }
        }
      }
    }
  }
}
