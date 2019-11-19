const NO = "no";
const HIT_LEFT = "hit left";
const HIT_RIGHT = "hit right";
const HIT_FRONT_L = "hit front l";
const HIT_FRONT_R = "hit front r";
const MULTI_HIT_LEFT = "mulit hit left";
const MULTI_HIT_RIGHT = "mulit hit right";

class MountainAgent{
    

    constructor(numberOfMountains, tokens, width, heightMin, heightMax, turnPeriodMin, turnPeriodMax, turnMin, turnMax, dropoff, minElevation){
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
        this.dropoff = dropoff / 100 * .2 + .8;
        this.minElevation = minElevation;
    }
    pickRandomStart(map)
    {
        this.x = Math.floor(random(0, map.width - 1));
        this.y = Math.floor(random(0, map.height - 1));
    }
    checkPoint(map, x, y)
    {
        if(x < 0 || x > map.width - 1 || y < 0 || y > map.height - 1)
        {
            return null;
        }
        else
        {
            return map.point(x, y);
        }
    }

    resetTurnTimer()
    {
        this.turnTime = random(this.turnPeriodMin, this.turnPeriodMax);
    }

    generate(map)
    {
        let mountainCount;
        for(mountainCount = 0; mountainCount < this.numberOfMountains; mountainCount++)
        {
            this.pickRandomStart(map);
            this.direction = random(0, 360);
            while(this.checkPoint(map, this.x, this.y) === null || map.point(this.x, this.y).getElevation() < this.minElevation)
            {
                //if our starting point is invalid pick a new one
                this.pickRandomStart(map);
            }

            let i;
            let reachedEdge = NO;
            this.resetTurnTimer();
            let timeSinceTurn = 0;
            for(i = 0; i < this.tokens; i++)
            {
                reachedEdge = this.newElevateWedge(map);
                switch(reachedEdge)
                {
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
                        console.log("ERROR: reachedEdge has illegal value");
                        break;
                }
                console.log(this.turnTime + " " + timeSinceTurn);
                if(this.turnTime > 0 && timeSinceTurn > this.turnTime)
                {
                    let turnAmount = this.newGetTurn();
                    this.newRotateAgent(turnAmount);
                    this.resetTurnTimer();
                    timeSinceTurn = 0;
                }
                this.newMoveAgent();
                timeSinceTurn++;
            }
        }
    }
    
    newElevateWedge(map)
    {
        let direction2 = (this.direction + 90) % 360;
        let directionRad = Math.PI * this.direction / 180;
        let direction2Rad = Math.PI * direction2 / 180;
        let height = random(this.heightMin, this.heightMax);
        let reachedEdge = NO;
        this.newSetHeight(map, Math.floor(this.x), Math.floor(this.y), height);
        this.newSetHeight(map, Math.ceil(this.x), Math.ceil(this.y), height);
        

        let i;
        for(i = 0; i <= this.width; i++)
        {
            let j;
            for(j = 0; j <= this.width - i; j++)
            {
                
                //front right
                let pointX = this.x + i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
                let pointY = this.y + i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
                if(this.newSetHeight(map, floor(pointX), floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height)) ||
                    this.newSetHeight(map, ceil(pointX), ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height)))
                    {
                        //hit on the right
                        switch(reachedEdge)
                        {
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
                //front left
                pointX = this.x + i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
                pointY = this.y + i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
                if(this.newSetHeight(map, floor(pointX), floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height)) ||
                    this.newSetHeight(map, ceil(pointX), ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height)))
                    {
                        //hit on the left
                        switch(reachedEdge)
                        {
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
                //back left
                pointX = this.x - i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
                pointY = this.y - i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
                this.newSetHeight(map, floor(pointX), floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
                this.newSetHeight(map, ceil(pointX), ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
                //back right
                pointX = this.x - i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
                pointY = this.y - i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
                this.newSetHeight(map, floor(pointX), floor(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
                this.newSetHeight(map, ceil(pointX), ceil(pointY), this.newHeightWithDropoff(this.x, this.y, pointX, pointY, height));
            }
        }
        return reachedEdge;
    }
    newHeightWithDropoff(centerX, centerY, x, y, height)
    {
        let distance = this.distance(centerX, centerY, x, y);
        if(distance > this.width)
        {
            distance = this.width;
        }
        return (this.width - distance) * pow(this.dropoff, distance) * height / this.width + random(0, this.heightMax / 5);
    }
    newSetHeight(map, x, y, height)
    {
        if(this.checkPoint(map, x, y) === null || map.point(x, y).getElevation() < this.minElevation)
        {
            return true;
        }
        else
        {
            if(map.point(x, y).getElevation() < height)
            {
                map.point(x, y).setElevation(height);
                map.point(x, y).setBiome("mountain");
            }
        }
        return false;
    }
    newTurnLeft(hard)
    {
        let min;
        if(hard)
        {
            min = (this.turnMin + this.turnMax) / 2;
        }
        else
        {
            min = this.turnMin;
        }
        let turn = random(min, this.turnMax);
        this.newRotateAgent(turn * -1);
    }
    newTurnRight(hard)
    {
        let min;
        if(hard)
        {
            min = (this.turnMin + this.turnMax) / 2;
        }
        else
        {
            min = this.turnMin;
        }
        let turn = random(min, this.turnMax);
        this.newRotateAgent(turn);
    }
    newRotateAgent(amount)
    {
        this.direction = (this.direction + amount) % 360;
    }
    newGetTurn()
    {
        let turn = random(this.turnMin, this.turnMax);
        if(random(0,1) > .5)
        {
            return turn;
        }
        else
        {
            return turn * -1;
        }
    }
    newMoveAgent()
    {
        let direction2 = (this.direction + 90) % 360;
        let directionRad = Math.PI * this.direction / 180;
        let direction2Rad = Math.PI * direction2 / 180;
        
        let newX = this.x + Math.cos(directionRad);
        let newY = this.y + Math.sin(directionRad);
        this.x = newX;
        this.y = newY;
    }
    distance(x1, y1, x2, y2)
    {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    smoothPoint(map, x, y)
    {
        if(this.checkPoint(map, x, y) === null)
            return;
    
        let total = 0, count = 3;
        total += map.point(x, y).getElevation() * 3;
        if(this.checkPoint(map, x+1, y) !== null)
        {
            total += map.point(x + 1, y).getElevation();
            count++;
        }
        if(this.checkPoint(map, x-1, y) !== null)
        {
            total += map.point(x - 1, y).getElevation();
            count++;
        }
        if(this.checkPoint(map, x+2, y) !== null)
        {
            total += map.point(x + 2, y).getElevation();
            count++;
        }
        if(this.checkPoint(map, x-2, y) !== null)
        {
            total += map.point(x - 2, y).getElevation();
            count++;
        }
        if(this.checkPoint(map, x, y+1) !== null)
        {
            total += map.point(x, y + 1).getElevation();
            count++;
        }
        if(this.checkPoint(map, x, y-1) !== null)
        {
            total += map.point(x, y - 1).getElevation();
            count++;
        }
        if(this.checkPoint(map, x, y+2) !== null)
        {
            total += map.point(x, y + 2).getElevation();
            count++;
        }
        if(this.checkPoint(map, x, y-2) !== null)
        {
            total += map.point(x, y - 2).getElevation();
            count++;
        }
        total /= count;
        map.point(x, y).setElevation(total);
    
    }

    smoothWedge(map)
    {
        let direction2 = (this.direction + 90) % 360;
        let directionRad = Math.PI * this.direction / 180;
        let direction2Rad = Math.PI * direction2 / 180;
    
        this.smoothPoint(map, Math.floor(this.x), Math.floor(this.y));
        this.smoothPoint(map, Math.ceil(this.x), Math.ceil(this.y));
        
        let i;
        for(i = 0; i <= this.width; i++)
        {
            let j;
            for(j = 0; j <= this.width - i; j++)
            {
                let pointX = this.x + i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
                let pointY = this.y + i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
                this.smoothPoint(map, floor(pointX), floor(pointY));
                this.smoothPoint(map, ceil(pointX), ceil(pointY));

                pointX = this.x + i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
                pointY = this.y + i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
                this.smoothPoint(map, floor(pointX), floor(pointY));
                this.smoothPoint(map, ceil(pointX), ceil(pointY));
                    
                pointX = this.x - i * Math.cos(directionRad) + j * Math.cos(direction2Rad);
                pointY = this.y - i * Math.sin(directionRad) + j * Math.sin(direction2Rad);
                this.smoothPoint(map, floor(pointX), floor(pointY));
                this.smoothPoint(map, ceil(pointX), ceil(pointY));
                
                pointX = this.x - i * Math.cos(directionRad) - j * Math.cos(direction2Rad);
                pointY = this.y - i * Math.sin(directionRad) - j * Math.sin(direction2Rad);
                this.smoothPoint(map, floor(pointX), floor(pointY));
                this.smoothPoint(map, ceil(pointX), ceil(pointY));
            }
        }
    }
}