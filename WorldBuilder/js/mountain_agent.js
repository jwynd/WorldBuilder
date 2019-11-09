
/*
#           #
  #          #
    #         #
      #         #
        #          #
          #            #
*/
const NO = "no";
const HIT_LEFT = "hit left";
const HIT_RIGHT = "hit right";
const HIT_FRONT_L = "hit front l";
const HIT_FRONT_R = "hit front r";
const MULTI_HIT_LEFT = "mulit hit left";
const MULTI_HIT_RIGHT = "mulit hit right";

class MountainAgent{
    

    /*constructor(numberOfMountains, tokens, width, heightMin, heightMax, turnPeriod, foothillPeriod, dropoff, minElevation, noiseAmount){
        this.x = 0;
        this.y = 0;

        this.numberOfMountains = numberOfMountains;
        this.tokens = tokens;
        this.direction = "north";
        this.width = width;
        this.heightMin = heightMin;
        this.heightMax = heightMax;
        this.turnPeriod = turnPeriod;
        this.foothillPeriod = foothillPeriod;
        this.dropoff = dropoff;
        this.minElevation = minElevation;
        this.noiseAmount = noiseAmount;
    }*/
    constructor(dropoff, turnPeriod)
    {
        this.x = 10;
        this.y = 10;
        this.width = 30;
        this.direction = 25;
        this.heightMin = 200;
        this.heightMax = 120;
        this.turnPeriod = turnPeriod;
        this.turnMin = 10;
        this.turnMax = 45;
        this.dropoff = (.2 * dropoff / 100) + .8; //0-100 -> .8-1
    }
    generate(map){
        let mountainCount;
        for(mountainCount = 0; mountainCount < this.numberOfMountains; mountainCount++)
        {
            console.log('mountain: ' + mountainCount);
            this.pickRandomStart(map);
            this.direction = Map.randomDirection();
            while(this.checkPoint(map, this.x, this.y) === null || map.point(this.x, this.y).getElevation() < this.minElevation)
            {
                //if our starting point is invalid pick a new one
                this.pickRandomStart(map);
            }

            let i;
            let reachedEdge = false;
            for(i = 0; i < this.tokens; i++)
            {
                reachedEdge = this.elevateWedge(map);
                this.noiseWedge(map);
                this.smoothWedge(map);
                if(this.foothillPeriod > 0 && (i+1) % this.foothillPeriod === 0)
                {
                    console.log('make foothill');
                    this.makeFoothills(map);
                }
                if(this.turnPeriod > 0 && (i+1) % this.turnPeriod === 0)
                {
                    console.log('make turn ' + this.direction);
                    this.rotateAgent();
                    console.log(this.direction);
                }
                if(reachedEdge)
                {
                    console.log('tokens finished before hitting edge: ' + i);
                    break;
                }
                this.moveAgent();
            }
        }
        let w;
        for(w = 0; w < map.width; w++)
        {
            let h;
            for(h = 0; h < map.height; h++)
            {
                this.smoothPoint(map, w, h);
            }
        }
    }
    testMountainAgent(map, startx, starty, direction)
    {
        let mountainCount;
        for(mountainCount = 0; mountainCount < this.numberOfMountains; mountainCount++)
        {
            console.log('mountain: ' + mountainCount);
            
            this.direction = direction;
            this.x = startx;
            this.y = starty;

            let i;
            let reachedEdge = false;
            for(i = 0; i < this.tokens; i++)
            {
                reachedEdge = this.elevateWedge(map);
                this.noiseWedge(map);
                this.smoothWedge(map);
                if(this.foothillPeriod > 0 && (i+1) % this.foothillPeriod === 0)
                {
                    console.log('make foothill');
                    this.makeFoothills(map);
                }
                if(this.turnPeriod > 0 && (i+1) % this.turnPeriod === 0)
                {
                    console.log('make turn ' + this.direction);
                    this.rotateAgent();
                    console.log(this.direction);
                }
                if(reachedEdge)
                {
                    console.log('tokens finished before hitting edge: ' + i);
                    break;
                }
                this.moveAgent();
            }
        }
    }
    runFoothill(map, direction, x, y)
    {
        let i;
        let reachedEdge = false;
        this.direction = direction;
        this.x = x;
        this.y = y;
        console.log(this.direction + ' ' + this.x + ' ' + this.y + ' ' + this.width + ' ' + this.tokens);
        for(i = 0; i < this.tokens; i++)
        {
            reachedEdge = this.elevateWedge(map);
            this.noiseWedge(map);
            this.smoothWedge(map);
            if(reachedEdge)
                break;
            this.moveAgent();
        }
    }
    pickRandomStart(map)
    {
        this.x = Math.floor(random(0, map.width - 1));
        this.y = Math.floor(random(0, map.height - 1));
    }
    elevateWedge(map)
    {
        let height = random(this.heightMin, this.heightMax);
        let reachedEdge = false;

        reachedEdge = reachedEdge || this.addElevation(map, this.x, this.y, height);
        
        if(this.direction === 'north' || this.direction === 'west' || this.direction === 'south' || this.direction === 'east')
        {
            let i;
            for(i = 1; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, this.x+i-j, this.y+j, height * Math.pow(this.dropoff, i));
                    if(i > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, this.x-i+j, this.y+j, height * Math.pow(this.dropoff, i));
                    if(j > 0)
                        reachedEdge = reachedEdge || this.addElevation(map, this.x+i-j, this.y-j, height * Math.pow(this.dropoff, i));
                    if(j > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, this.x-i+j, this.y-j, height * Math.pow(this.dropoff, i));
                }
            }
        }
        else
        {
            let i;
            for(i = 1; i < this.width + 1; i++)
            {
                let j;
                for(j = -i; j < i; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, this.x+i, this.y+j, height * Math.pow(this.dropoff, i));
                    reachedEdge = reachedEdge || this.addElevation(map, this.x-j, this.y+i, height * Math.pow(this.dropoff, i));
                    reachedEdge = reachedEdge || this.addElevation(map, this.x-i, this.y-j, height * Math.pow(this.dropoff, i));
                    reachedEdge = reachedEdge || this.addElevation(map, this.x+j, this.y-i, height * Math.pow(this.dropoff, i));
                }
            }
        }
        return reachedEdge;
    }
    smoothWedge(map)
    {
        this.smoothPoint(map, this.x, this.y);
        if(this.direction === 'north' || this.direction === 'west' || this.direction === 'south' || this.direction === 'east')
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    this.smoothPoint(map, this.x+i-j, this.y+j)
                    if(i > 0 && i != j)
                    {
                        this.smoothPoint(map, this.x-i+j, this.y+j);
                    }
                    if(j > 0)
                    {
                        this.smoothPoint(map, this.x+i-j, this.y-j);
                    }
                    if(j > 0 && i != j)
                    {
                        this.smoothPoint(map, this.x-i+j, this.y-j);
                    }
                }
            }
        }
        else
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = -i; j < i; j++)
                {
                    this.smoothPoint(map, this.x+i, this.y+j);
                    this.smoothPoint(map, this.x-j, this.y+i);
                    this.smoothPoint(map, this.x-i, this.y-j);
                    this.smoothPoint(map, this.x+j, this.y-i);
                }
            }
        }
    }
    noiseWedge(map)
    {
        let reachedEdge = false;

        reachedEdge = reachedEdge || this.addElevation(map, this.x, this.y, random(0, this.noiseAmount));
        
        if(this.direction === 'north' || this.direction === 'west' || this.direction === 'south' || this.direction === 'east')
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, this.x+i-j, this.y+j, random(0, this.noiseAmount));
                    if(i > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, this.x-i+j, this.y+j, random(0, this.noiseAmount));
                    if(j > 0)
                        reachedEdge = reachedEdge || this.addElevation(map, this.x+i-j, this.y-j, random(0, this.noiseAmount));
                    if(j > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, this.x-i+j, this.y-j, random(0, this.noiseAmount));
                }
            }
        }
        else
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = -i; j < i; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, this.x+i, this.y+j, random(0, this.noiseAmount));
                    reachedEdge = reachedEdge || this.addElevation(map, this.x-j, this.y+i, random(0, this.noiseAmount));
                    reachedEdge = reachedEdge || this.addElevation(map, this.x-i, this.y-j, random(0, this.noiseAmount));
                    reachedEdge = reachedEdge || this.addElevation(map, this.x+j, this.y-i, random(0, this.noiseAmount));
                }
            }
        }
        return reachedEdge;
    }
    addElevation(map, x, y, amount)
    {
        if(this.checkPoint(map, x, y) === null || map.point(x, y).getElevation() < this.minElevation)
        {
            return true;
        }
        else
        {
            map.point(x, y).setElevation(map.point(x, y).getElevation() + amount);
            map.point(x, y).setBiome("mountain");
        }
        return false;
    }
    moveAgent()
    {
        switch(this.direction)
        {
            case "west":
                this.y--;
                break;
            case "northwest":
                this.x++;
                this.y--;
                break;
            case "north":
                this.x++;
                break;
            case "northeast":
                this.x++;
                this.y++;
                break;
            case "east":
                this.y++;
                break;
            case "southeast":
                this.x--;
                this.y++;
                break;
            case "south":
                this.x--;
                break;
            case "southwest":
                this.x--;
                this.y--;
                break;
            default:
                console.log('move agent error:' + this.direction);
        }
        //check if we hit the edge
    }
    rotateAgent()
    {
        switch(Math.floor(random(0,2)))
        {
            case 0:
                switch(this.direction)
                {
                    case "west":
                        this.direction = "northwest";
                        break;
                    case "northwest":
                        this.direction = "north";
                        break;
                    case "north":
                        this.direction = "northeast";
                        break;
                    case "northeast":
                        this.direction = "east";
                        break;
                    case "east":
                        this.direction = "southeast";
                        break;
                    case "southeast":
                        this.direction = "south";
                        break;
                    case "south":
                        this.direction = "southwest";
                        break;
                    case "southwest":
                        this.direction = "west";
                        break;
                    default:
                        console.log('rotate agent error:' + this.direction);
                }
                break;
            case 1:
                switch(this.direction)
                {
                    case "west":
                        this.direction = "southwest";
                        break;
                    case "northwest":
                        this.direction = "west";
                        break;
                    case "north":
                        this.direction = "northwest";
                        break;
                    case "northeast":
                        this.direction = "north";
                        break;
                    case "east":
                        this.direction = "northeast";
                        break;
                    case "southeast":
                        this.direction = "east";
                        break;
                    case "south":
                        this.direction = "southeast";
                        break;
                    case "southwest":
                        this.direction = "south";
                        break;
                    default:
                        console.log('rotate agent error:' + this.direction);
                }
                break;
            default:
                //error
        }
    }
    makeFoothills(map)
    {
        let foothills = new MountainAgent(1, this.width * 2, Math.floor(this.width / 2), Math.floor(this.heightMin / 2), Math.floor(this.heightMax / 2), 0, 0, this.dropoff, this.minElevation, this.noiseAmount / 2);
        foothills.runFoothill(map, this.get90DegreeOffset(), this.x, this.y);
        foothills.runFoothill(map, this.getNeg90DegreeOffset(), this.x, this.y);
    }
    get90DegreeOffset()
    {
        switch(this.direction)
        {
            case "west":
                return "north";
            case "northwest":
                return "northeast";
            case "north":
                return "east";
            case "northeast":
                return "southeast";
            case "east":
                return "south";
            case "southeast":
                return "southwest";
            case "south":
                return "west";
            case "southwest":
                return "northwest";
            default:
                console.log('90 degree offest error:' + this.direction);
        }
    }
    getNeg90DegreeOffset()
    {
        switch(this.direction)
        {
            case "west":
                return "south";
            case "northwest":
                return "southwest";
            case "north":
                return "west";
            case "northeast":
                return "northwest";
            case "east":
                return "north";
            case "southeast":
                return "northeast";
            case "south":
                return "east";
            case "southwest":
                return "southeast";
            default:
                console.log('-90 degree offest error:' + this.direction);
        }
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



    newTestMountainAgent(map, startx, starty, direction, tokens)
    {
        this.direction = direction;
        this.x = startx;
        this.y = starty;
        this.tokens = tokens;

        let i;
        let reachedEdge = NO;
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
            /*this.noiseWedge(map);
            this.smoothWedge(map);
            if(this.foothillPeriod > 0 && (i+1) % this.foothillPeriod === 0)
            {
                console.log('make foothill');
                this.makeFoothills(map);
            }*/
            if(this.turnPeriod > 0 && (i+1) % this.turnPeriod === 0)
            {
                let turnAmount = this.newGetTurn();
                this.newRotateAgent(turnAmount);
                console.log(this.direction);
            }/*
            if(reachedEdge)
            {
                console.log('tokens finished before hitting edge: ' + i);
                break;
            }*/
            this.newMoveAgent();
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
        

        console.log(this.width);
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
        /*console.log("width: " + this.width);
        console.log("distance: " + distance);
        console.log("dropoff: " + this.dropoff);
        console.log("height: " + height);
        console.log((this.width - distance) * pow(this.dropoff, distance) * height / this.width);*/
        return (this.width - distance) * pow(this.dropoff, distance) * height / this.width;
    }
    newSetHeight(map, x, y, height)
    {
        if(this.checkPoint(map, x, y) === null || map.point(x, y).getElevation() < this.minElevation)
        {
            console.log("point");
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
        console.log('make turn ' + amount);
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
    newFindStart(map)
    {
        this.x = random(0, map.width - 1);
        this.y = random(0, map.height - 1);
    }
    distance(x1, y1, x2, y2)
    {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }


}