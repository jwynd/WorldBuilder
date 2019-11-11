/* jshint esversion: 6 */
/* global random */
import Point from './point.js';
import Map from './map.js';
class MountainAgent {
  constructor (numberOfMountains, tokens, width, heightMin, heightMax, turnPeriod, foothillPeriod, dropoff, minElevation, noiseAmount) {
    this.x = 0;
    this.y = 0;

    this.numberOfMountains = numberOfMountains;
    this.tokens = tokens;
    this.direction = 'north';
    this.width = width;
    this.heightMin = heightMin;
    this.heightMax = heightMax;
    this.turnPeriod = turnPeriod;
    this.foothillPeriod = foothillPeriod;
    this.dropoff = dropoff;
    this.minElevation = minElevation;
    this.noiseAmount = noiseAmount;
  }

  generate (map) {
    let mountainCount;
    for (mountainCount = 0; mountainCount < this.numberOfMountains; mountainCount++) {
      console.log('mountain: ' + mountainCount);
      this.pickRandomStart(map);
      this.direction = map.randomDirection();
      while (this.checkPoint(map, this.x, this.y) === null || map.point(this.x, this.y).getElevation() < this.minElevation) {
        // if our starting point is invalid pick a new one
        this.pickRandomStart(map);
      }

      let i;
      let reachedEdge = false;
      for (i = 0; i < this.tokens; i++) {
        reachedEdge = this.elevateWedge(map);
        this.noiseWedge(map);
        this.smoothWedge(map);
        if (this.foothillPeriod > 0 && (i + 1) % this.foothillPeriod === 0) {
          console.log('make foothill');
          this.makeFoothills(map);
        }
        if (this.turnPeriod > 0 && (i + 1) % this.turnPeriod === 0) {
          console.log('make turn ' + this.direction);
          this.rotateAgent();
          console.log(this.direction);
        }
        if (reachedEdge) {
          console.log('tokens finished before hitting edge: ' + i);
          break;
        }
        this.moveAgent();
      }
    }
  }

  runFoothill (map) {
    let i;
    let reachedEdge = false;
    for (i = 0; i < this.tokens; i++) {
      reachedEdge = this.elevateWedge(map);
      this.noiseWedge(map);
      this.smoothWedge(map);
      if (reachedEdge) break;
      this.moveAgent();
    }
  }

  pickRandomStart (map) {
    this.x = Math.floor(random(0, map.width - 1));
    this.y = Math.floor(random(0, map.height - 1));
  }

  elevateWedge (map) {
    const height = random(this.heightMin, this.heightMax);
    let reachedEdge = false;

    reachedEdge = reachedEdge || this.addElevation(map, this.x, this.y, height);

    if (this.direction === 'north' || this.direction === 'west' || this.direction === 'south' || this.direction === 'east') {
      let i;
      for (i = 1; i < this.width + 1; i++) {
        let j;
        for (j = 0; j < i + 1; j++) {
          reachedEdge = reachedEdge || this.addElevation(map, this.x + i - j, this.y + j, height * Math.pow(this.dropoff, i));
          if (i > 0 && i !== j) reachedEdge = reachedEdge || this.addElevation(map, this.x - i + j, this.y + j, height * Math.pow(this.dropoff, i));
          if (j > 0) reachedEdge = reachedEdge || this.addElevation(map, this.x + i - j, this.y - j, height * Math.pow(this.dropoff, i));
          if (j > 0 && i !== j) reachedEdge = reachedEdge || this.addElevation(map, this.x - i + j, this.y - j, height * Math.pow(this.dropoff, i));
        }
      }
    } else {
      let i;
      for (i = 1; i < this.width + 1; i++) {
        let j;
        for (j = -i; j < i; j++) {
          reachedEdge = reachedEdge || this.addElevation(map, this.x + i, this.y + j, height * Math.pow(this.dropoff, i));
          reachedEdge = reachedEdge || this.addElevation(map, this.x - j, this.y + i, height * Math.pow(this.dropoff, i));
          reachedEdge = reachedEdge || this.addElevation(map, this.x - i, this.y - j, height * Math.pow(this.dropoff, i));
          reachedEdge = reachedEdge || this.addElevation(map, this.x + j, this.y - i, height * Math.pow(this.dropoff, i));
        }
      }
    }
    return reachedEdge;
  }

  smoothWedge (map) {
    this.smoothPoint(map, this.x, this.y);
    if (this.direction === 'north' || this.direction === 'west' || this.direction === 'south' || this.direction === 'east') {
      let i;
      for (i = 0; i < this.width + 1; i++) {
        let j;
        for (j = 0; j < i + 1; j++) {
          this.smoothPoint(map, this.x + i - j, this.y + j);
          if (i > 0 && i !== j) {
            this.smoothPoint(map, this.x - i + j, this.y + j);
          }
          if (j > 0) {
            this.smoothPoint(map, this.x + i - j, this.y - j);
          }
          if (j > 0 && i !== j) {
            this.smoothPoint(map, this.x - i + j, this.y - j);
          }
        }
      }
    } else {
      let i;
      for (i = 0; i < this.width + 1; i++) {
        let j;
        for (j = -i; j < i; j++) {
          this.smoothPoint(map, this.x + i, this.y + j);
          this.smoothPoint(map, this.x - j, this.y + i);
          this.smoothPoint(map, this.x - i, this.y - j);
          this.smoothPoint(map, this.x + j, this.y - i);
        }
      }
    }
  }

  noiseWedge (map) {
    let reachedEdge = false;

    reachedEdge = reachedEdge || this.addElevation(map, this.x, this.y, random(0, this.noiseAmount));

    if (this.direction === 'north' || this.direction === 'west' || this.direction === 'south' || this.direction === 'east') {
      let i;
      for (i = 0; i < this.width + 1; i++) {
        let j;
        for (j = 0; j < i + 1; j++) {
          reachedEdge = reachedEdge || this.addElevation(map, this.x + i - j, this.y + j, random(0, this.noiseAmount));
          if (i > 0 && i !== j) reachedEdge = reachedEdge || this.addElevation(map, this.x - i + j, this.y + j, random(0, this.noiseAmount));
          if (j > 0) reachedEdge = reachedEdge || this.addElevation(map, this.x + i - j, this.y - j, random(0, this.noiseAmount));
          if (j > 0 && i !== j) reachedEdge = reachedEdge || this.addElevation(map, this.x - i + j, this.y - j, random(0, this.noiseAmount));
        }
      }
    } else {
      let i;
      for (i = 0; i < this.width + 1; i++) {
        let j;
        for (j = -i; j < i; j++) {
          reachedEdge = reachedEdge || this.addElevation(map, this.x + i, this.y + j, random(0, this.noiseAmount));
          reachedEdge = reachedEdge || this.addElevation(map, this.x - j, this.y + i, random(0, this.noiseAmount));
          reachedEdge = reachedEdge || this.addElevation(map, this.x - i, this.y - j, random(0, this.noiseAmount));
          reachedEdge = reachedEdge || this.addElevation(map, this.x + j, this.y - i, random(0, this.noiseAmount));
        }
      }
    }
    return reachedEdge;
  }

  addElevation (map, x, y, amount) {
    if (this.checkPoint(map, x, y) === null || map.point(x, y).getElevation() < this.minElevation) {
      return true;
    } else {
      map.point(x, y).setElevation(map.point(x, y).getElevation() + amount);
      map.point(x, y).setBiome('mountain');
    }
    return false;
  }

  moveAgent () {
    switch (this.direction) {
      case 'west':
        this.y--;
        break;
      case 'northwest':
        this.x++;
        this.y--;
        break;
      case 'north':
        this.x++;
        break;
      case 'northeast':
        this.x++;
        this.y++;
        break;
      case 'east':
        this.y++;
        break;
      case 'southeast':
        this.x--;
        this.y++;
        break;
      case 'south':
        this.x--;
        break;
      case 'southwest':
        this.x--;
        this.y--;
        break;
      default:
        console.log('move agent error:' + this.direction);
    }
    // check if we hit the edge
  }

  rotateAgent () {
    switch (Math.floor(random(0, 2))) {
      case 0:
        switch (this.direction) {
          case 'west':
            this.direction = 'northwest';
            break;
          case 'northwest':
            this.direction = 'north';
            break;
          case 'north':
            this.direction = 'northeast';
            break;
          case 'northeast':
            this.direction = 'east';
            break;
          case 'east':
            this.direction = 'southeast';
            break;
          case 'southeast':
            this.direction = 'south';
            break;
          case 'south':
            this.direction = 'southwest';
            break;
          case 'southwest':
            this.direction = 'west';
            break;
          default:
            console.log('rotate agent error:' + this.direction);
        }
        break;
      case 1:
        switch (this.direction) {
          case 'west':
            this.direction = 'southwest';
            break;
          case 'northwest':
            this.direction = 'west';
            break;
          case 'north':
            this.direction = 'northwest';
            break;
          case 'northeast':
            this.direction = 'north';
            break;
          case 'east':
            this.direction = 'northeast';
            break;
          case 'southeast':
            this.direction = 'east';
            break;
          case 'south':
            this.direction = 'southeast';
            break;
          case 'southwest':
            this.direction = 'south';
            break;
          default:
            console.log('rotate agent error:' + this.direction);
        }
        break;
      default:
        // error
    }
  }

  makeFoothills (map) {
    const leftFoothill = new MountainAgent(this.x, this.y, this.width * 2, this.get90DegreeOffset, Math.floor(this.wdith / 4), Math.floor(this.heightMin / 2), Math.floor(this.heightMax / 2), 0, 0, this.dropoff);
    const rightFoothill = new MountainAgent(this.x, this.y, this.width * 2, this.getNeg90DegreeOffset, Math.floor(this.wdith / 4), Math.floor(this.heightMin / 2), Math.floor(this.heightMax / 2), 0, 0, this.dropoff);
    leftFoothill.runFoothill(map);
    rightFoothill.runFoothill(map);
  }

  get90DegreeOffset () {
    switch (this.direction) {
      case 'west':
        return 'north';
      case 'northwest':
        return 'northeast';
      case 'north':
        return 'east';
      case 'northeast':
        return 'southeast';
      case 'east':
        return 'south';
      case 'southeast':
        return 'southwest';
      case 'south':
        return 'west';
      case 'southwest':
        return 'northwest';
      default:
        console.log('90 degree offest error:' + this.direction);
    }
  }

  getNeg90DegreeOffset () {
    switch (this.direction) {
      case 'west':
        return 'south';
      case 'northwest':
        return 'southwest';
      case 'north':
        return 'west';
      case 'northeast':
        return 'northwest';
      case 'east':
        return 'north';
      case 'southeast':
        return 'northeast';
      case 'south':
        return 'east';
      case 'southwest':
        return 'southeast';
      default:
        console.log('-90 degree offest error:' + this.direction);
    }
  }

  smoothPoint (map, x, y) {
    if (this.checkPoint(map, x, y) === null) return;

    let total = 0;
    let count = 3;
    total += map.point(x, y).getElevation() * 3;
    if (this.checkPoint(map, x + 1, y) !== null) {
      total += map.point(x + 1, y).getElevation();
      count++;
    }
    if (this.checkPoint(map, x - 1, y) !== null) {
      total += map.point(x - 1, y).getElevation();
      count++;
    }
    if (this.checkPoint(map, x + 2, y) !== null) {
      total += map.point(x + 2, y).getElevation();
      count++;
    }
    if (this.checkPoint(map, x - 2, y) !== null) {
      total += map.point(x - 2, y).getElevation();
      count++;
    }
    if (this.checkPoint(map, x, y + 1) !== null) {
      total += map.point(x, y + 1).getElevation();
      count++;
    }
    if (this.checkPoint(map, x, y - 1) !== null) {
      total += map.point(x, y - 1).getElevation();
      count++;
    }
    if (this.checkPoint(map, x, y + 2) !== null) {
      total += map.point(x, y + 2).getElevation();
      count++;
    }
    if (this.checkPoint(map, x, y - 2) !== null) {
      total += map.point(x, y - 2).getElevation();
      count++;
    }
    total /= count;
    map.point(x, y).setElevation(total);
  }

  checkPoint (map, x, y) {
    if (x < 0 || x > map.width - 1 || y < 0 || y > map.height - 1) {
      return null;
    } else {
      return map.point(x, y);
    }
  }
}
export default MountainAgent;
