/* jshint esversion: 6 */
import Point from './point.js';
import Map from './map.js';

const NO = 'no';
const HIT_LEFT = 'hit left';
const HIT_RIGHT = 'hit right';
const HIT_FRONT_L = 'hit front l';
const HIT_FRONT_R = 'hit front r';
const MULTI_HIT_LEFT = 'mulit hit left';
const MULTI_HIT_RIGHT = 'mulit hit right';

class MountainAgent {
  constructor (numberOfMountains, tokens, width, heightMin, heightMax, turnPeriodMin, turnPeriodMax, turnMin, turnMax, dropoff, minElevation, rand) {
    this.x = 0;
    this.y = 0;

    this.numberOfMountains = numberOfMountains;
    this.tokens = tokens;
    this.direction = 0;
    this.width = width;
    this.heightMin = heightMin;
    this.heightMax = heightMax;
    this.turnPeriodMin = turnPeriodMin;
    this.turnPeriodMax = turnPeriodMax;
    this.turnMin = turnMin;
    this.turnMax = turnMax;
    this.dropoff = dropoff / 100 * 0.2 + 0.8;
    this.minElevation = minElevation;
    this.rand = rand;
  }

  pickRandomStart (map) {
    this.x = Math.floor(this.rand.callRandom(0, map.width - 1));
    this.y = Math.floor(this.rand.callRandom(0, map.height - 1));
  }

  checkPoint (map, x, y) {
    if (x < 0 || x > map.width - 1 || y < 0 || y > map.height - 1) {
      return null;
    } else {
      return map.point(x, y);
    }
  }

  resetTurnTimer () {
    this.turnTime = this.rand.callRandom(this.turnPeriodMin, this.turnPeriodMax);
  }

  generate (map) {
    let mountainCount;
    for (mountainCount = 0; mountainCount < this.numberOfMountains; mountainCount++) {
      this.pickRandomStart(map);
      this.direction = this.rand.callRandom(0, 360);
      while (this.checkPoint(map, this.x, this.y) === null || map.point(this.x, this.y).getElevation() < this.minElevation) {
        // if our starting point is invalid pick a new one
        this.pickRandomStart(map);
      }

      let i;
      let reachedEdge = NO;
      this.resetTurnTimer();
      let timeSinceTurn = 0;
      for (i = 0; i < this.tokens; i++) {
        reachedEdge = this.newElevateWedge(map);
        switch (reachedEdge) {
          case NO:
            break;
          case HIT_RIGHT:
            this.newTurnLeft(false);
            break;
          case HIT_LEFT:
            this.newTurnRight(false);
            break;
          case MULTI_HIT_RIGHT:
            this.newTurnLeft(true);
            break;
          case MULTI_HIT_LEFT:
            this.newTurnRight(true);
            break;
          case HIT_FRONT_R:
            this.newTurnLeft(true);
            this.newTurnLeft(false);
            break;
          case HIT_FRONT_L:
            this.newTurnRight(true);
            this.newTurnRight(false);
            break;
          default:
            console.log('ERROR: reachedEdge has illegal value');
            break;
        }
        // console.log(this.turnTime + ' ' + timeSinceTurn);
        if (this.turnTime > 0 && timeSinceTurn > this.turnTime) {
          const turnAmount = this.newGetTurn();
          this.newRotateAgent(turnAmount);
          this.resetTurnTimer();
          timeSinceTurn = 0;
        }
        this.newMoveAgent();
        timeSinceTurn++;
      }
    }
  }

  newElevateWedge (map) {
    const direction2 = (this.direction + 90) % 360;
    const directionRad = Math.PI * this.direction / 180;
    const direction2Rad = Math.PI * direction2 / 180;
    const height = this.rand.callRandom(this.heightMin, this.heightMax);
    let reachedEdge = NO;
    this.newSetHeight(map, Math.floor(this.x), Math.floor(this.y), height);
    this.newSetHeight(map, Math.ceil(this.x), Math.ceil(this.y), height);

    let i;
    for (i = 0; i <= this.width; i++) {
      let j;
      for (j = 0; j <= this.width - i; j++) {
        // front right
        let pointX = this.x + i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
        let pointY = this.y + i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
        if (this.newSetHeight(map, Math.floor(pointX), Math.floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height)) ||
          this.newSetHeight(map, Math.ceil(pointX), Math.ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height))) {
          // hit on the right
          switch (reachedEdge) {
            case NO:
              reachedEdge = HIT_RIGHT;
              break;
            case HIT_RIGHT:
              reachedEdge = MULTI_HIT_RIGHT;
              break;
            case HIT_LEFT:
              reachedEdge = HIT_FRONT_L;
              break;
            case MULTI_HIT_LEFT:
              reachedEdge = HIT_FRONT_L;
              break;
            default:
              break;
          }
        }
        // front left
        pointX = this.x + i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
        pointY = this.y + i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
        if (this.newSetHeight(map, Math.floor(pointX), Math.floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height)) ||
          this.newSetHeight(map, Math.ceil(pointX), Math.ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height))) {
          // hit on the left
          switch (reachedEdge) {
            case NO:
              reachedEdge = HIT_LEFT;
              break;
            case HIT_LEFT:
              reachedEdge = MULTI_HIT_LEFT;
              break;
            case HIT_RIGHT:
              reachedEdge = HIT_FRONT_R;
              break;
            case MULTI_HIT_RIGHT:
              reachedEdge = HIT_FRONT_R;
              break;
            default:
              break;
          }
        }
        // back left
        pointX = this.x - i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
        pointY = this.y - i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
        this.newSetHeight(map, Math.floor(pointX), Math.floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
        this.newSetHeight(map, Math.ceil(pointX), Math.ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
        // back right
        pointX = this.x - i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
        pointY = this.y - i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
        this.newSetHeight(map, Math.floor(pointX), Math.floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
        this.newSetHeight(map, Math.ceil(pointX), Math.ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
      }
    }
    return reachedEdge;
  }

  newHeightWithDropoff (centerX, centerY, x, y, height) {
    let distance = this.distance(centerX, centerY, x, y);
    if (distance > this.width) {
      distance = this.width;
    }
    return (this.width - distance) * Math.pow(this.dropoff, distance) * height / this.width + this.rand.callRandom(0, this.heightMax / 5);
  }

  newSetHeight (map, x, y, height) {
    if (this.checkPoint(map, x, y) === null || map.point(x, y).getElevation() < this.minElevation) {
      return true;
    }
    if (map.point(x, y).getElevation() < height) {
      map.point(x, y).setElevation(height);
      map.point(x, y).setBiome('mountain');
    }
    return false;
  }

  newTurnLeft (hard) {
    let min;
    if (hard) {
      min = (this.turnMin + this.turnMax) / 2;
    } else {
      min = this.turnMin;
    }
    const turn = this.rand.callRandom(min, this.turnMax);
    this.newRotateAgent(turn * -1);
  }

  newTurnRight (hard) {
    let min;
    if (hard) {
      min = (this.turnMin + this.turnMax) / 2;
    } else {
      min = this.turnMin;
    }
    const turn = this.rand.callRandom(min, this.turnMax);
    this.newRotateAgent(turn);
  }

  newRotateAgent (amount) {
    this.direction = (this.direction + amount) % 360;
  }

  newGetTurn () {
    const turn = this.rand.callRandom(this.turnMin, this.turnMax);
    if (this.rand.callRandom(0, 1) > 0.5) {
      return turn;
    } else {
      return turn * -1;
    }
  }

  newMoveAgent () {
    // const direction2 = (this.direction + 90) % 360;
    const directionRad = Math.PI * this.direction / 180;
    // const direction2Rad = Math.PI * direction2 / 180; // George did you intend to use this?

    const newX = this.x + Math.cos(directionRad);
    const newY = this.y + Math.sin(directionRad);
    this.x = newX;
    this.y = newY;
  }

  distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
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

  smoothWedge (map) {
    const direction2 = (this.direction + 90) % 360;
    const directionRad = Math.PI * this.direction / 180;
    const direction2Rad = Math.PI * direction2 / 180;

    this.smoothPoint(map, Math.floor(this.x), Math.floor(this.y));
    this.smoothPoint(map, Math.ceil(this.x), Math.ceil(this.y));

    let i;
    for (i = 0; i <= this.width; i++) {
      let j;
      for (j = 0; j <= this.width - i; j++) {
        let pointX = this.x + i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
        let pointY = this.y + i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
        this.smoothPoint(map, Math.floor(pointX), Math.floor(pointY));
        this.smoothPoint(map, Math.ceil(pointX), Math.ceil(pointY));

        pointX = this.x + i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
        pointY = this.y + i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
        this.smoothPoint(map, Math.floor(pointX), Math.floor(pointY));
        this.smoothPoint(map, Math.ceil(pointX), Math.ceil(pointY));

        pointX = this.x - i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
        pointY = this.y - i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
        this.smoothPoint(map, Math.floor(pointX), Math.floor(pointY));
        this.smoothPoint(map, Math.ceil(pointX), Math.ceil(pointY));

        pointX = this.x - i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
        pointY = this.y - i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
        this.smoothPoint(map, Math.floor(pointX), Math.floor(pointY));
        this.smoothPoint(map, Math.ceil(pointX), Math.ceil(pointY));
      }
    }
  }
}
export default MountainAgent;
