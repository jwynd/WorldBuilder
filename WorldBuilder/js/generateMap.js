
/*
 * This file will create define a point
 * create an array of points which will define the map
 * call each individual agent from different files to actually
 * alter the point values
 */
/* jshint esversion: 6 */
/* global sqrt random */
// create a point of elevation e, biome b, created by agent a
class Point {
  constructor (e, b, xpos, ypos) {
    this.elevation = e;
    this.biome = b;
    this.x = xpos;
    this.y = ypos;
  }

  getX () {
    return this.x;
  }

  getY () {
    return this.y;
  }

  getElevation () {
    return this.elevation;
  }

  getBiome () {
    return this.biome;
  }

  setElevation (e) {
    this.elevation = e;
  }

  setBiome (b) {
    this.biome = b;
  }

  dist (p) {
    const x1 = this.getX();
    const y1 = this.getY();
    const x2 = p.getX();
    const y2 = p.getY();
    return sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
  }

  toString () {
    return 'Point: (' + this.x + ', ' + this.y + ')\nElevation: ' + this.elevation + '\nBiome: ' + this.biome;
  }
}

class Map {
  constructor (x, y) {
    this.width = x;
    this.height = y;
    this.map = [];
    let xpos;
    let ypos = -1;// will be incremented on first pass
    for (let i = 0; i < x * y; i++) {
      xpos = i % this.width;
      if (xpos === 0) ypos++;
      this.map[this.map.length] = new Point(0, 'ocean', xpos, ypos);
    }
  }

  point (x, y) {
    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
      console.error('Map Error: Attempted to access non existant point (' + x + ', ' + y + ')');
      return null;
    }
    return this.map[(y * this.width) + x];
  }

  // will return a list of the neighbors.
  // points are listed clockwise starting from the left
  getNeighbors (point, onlyOrthogonal = false) {
    const neighbors = [
      this.getNeighbor(point, 'west'),
      this.getNeighbor(point, 'northwest'),
      this.getNeighbor(point, 'north'),
      this.getNeighbor(point, 'northeast'),
      this.getNeighbor(point, 'east'),
      this.getNeighbor(point, 'southeast'),
      this.getNeighbor(point, 'south'),
      this.getNeighbor(point, 'southwest')
    ];

    const result = [];
    for (let i = 0; i < neighbors.length; i++) {
      if (onlyOrthogonal && i % 2 === 1) continue;
      if (neighbors[i] !== null) result.push(neighbors[i]);
    }
    return result;
  }

  getNeighbor (point, dir) {
    let onLeft = false;
    let onRight = false;
    let onTop = false;
    let onBottom = false;
    const x = point.getX();
    const y = point.getY();
    if (x === 0) onLeft = true;
    if (x === this.width - 1) onRight = true;
    if (y === 0) onTop = true;
    if (y === this.height - 1) onBottom = true;
    if (dir === 'west' && !onLeft) return this.point(x - 1, y);
    if (dir === 'north' && !onTop) return this.point(x, y - 1);
    if (dir === 'east' && !onRight) return this.point(x + 1, y);
    if (dir === 'south' && !onBottom) return this.point(x, y + 1);
    if (dir === 'northwest' && (!onLeft && !onTop)) return this.point(x - 1, y - 1);
    if (dir === 'northeast' && (!onTop && !onRight)) return this.point(x + 1, y - 1);
    if (dir === 'southeast' && (!onRight && !onBottom)) return this.point(x + 1, y + 1);
    if (dir === 'southwest' && (!onBottom && !onLeft)) return this.point(x - 1, y + 1);
    return null;
  }

  getRandomNeighbor (point, onlyOrthogonal = false) {
    const n = this.getNeighbors(point, onlyOrthogonal);
    const result = random(n);
    return result;
  }

  getNeighborsOfType (point, biome, onlyOrthogonal = false) {
    const n = this.getNeighbors(point, onlyOrthogonal);
    const result = [];
    for (let i = 0; i < n.length; i++) {
      if (n[i].getBiome() === biome) {
        result.push(n[i]);
      }
    }
    return result;
  }

  getPointsOfType (biome) {
    const result = [];
    for (let i = 0; i < this.map.length; ++i) {
      if (this.map[i].getBiome() === biome) {
        result.push(this.map[i]);
      }
    }
    return result;
  }

  getRandomPointOfType (biome) {
    const b = this.getPointsOfType(biome);
    return random(b);
  }

  static randomDirection () {
    const dir = ['west', 'northwest', 'north', 'northeast', 'east', 'southeast', 'south', 'southwest'];
    return random(dir);
  }
}
