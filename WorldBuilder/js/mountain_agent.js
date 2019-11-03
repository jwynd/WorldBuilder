
class MountainAgent{
    constructor(numberOfMountains, tokens, width, heightMin, heightMax, turnPeriod, foothillPeriod, dropoff, minElevation, noiseAmount){
        this.x = -1;
        this.y = -1;

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
    }
    generate(map){
        let mountainCount;
        for(mountainCount = 0; mountainCount < this.numberOfMountains; mountainCount++)
        {
            this.pickRandomStart(map);
            this.direction = map.randomDirection();
            while(map.point(this.x, this.y) === null || map.point(this.x, this.y).getElevation() < this.minElevation)
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
                if(this.foothillPeriod > 0 && i % this.foothillPeriod === 0)
                {
                    this.makeFoothills(map);
                }
                if(this.turnPeriod > 0 && i % this.turnPeriod === 0)
                {
                    this.rotateAgent();
                }
                if(reachedEdge)
                    break;
                this.moveAgent();
            }
        }
    }
    pickRandomStart(map)
    {
        this.x = random(0, map.width - 1);
        this.y = random(0, map.height - 1);
    }
    elevateWedge(map)
    {
        let height = random(this.heightMin, this.heightMax);
        let reachedEdge = false;

        reachedEdge = reachedEdge || this.addElevation(map, x, y, height);
        
        if(this.direction % 2 === 0)
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, x+i-j, y+j, height * Math.pow(this.dropoff, i));
                    if(i > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, x-i+j, y+j, height * Math.pow(this.dropoff, i));
                    if(j > 0)
                        reachedEdge = reachedEdge || this.addElevation(map, x+i-j, y-j, height * Math.pow(this.dropoff, i));
                    if(j > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, x-i+j, y-j, height * Math.pow(this.dropoff, i));
                }
            }
        }
        else
        {
            let i;
            for(i = 0; i < width + 1; i++)
            {
                let j;
                for(j = -i; j < i; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, x+i, y+j, height * Math.pow(this.dropoff, i));
                    reachedEdge = reachedEdge || this.addElevation(map, x+i, y-j, height * Math.pow(this.dropoff, i));
                    reachedEdge = reachedEdge || this.addElevation(map, x-i, y-j, height * Math.pow(this.dropoff, i));
                    reachedEdge = reachedEdge || this.addElevation(map, x-i, y+j, height * Math.pow(this.dropoff, i));
                }
            }
        }
        return reachedEdge;
    }
    smoothWedge(map)
    {
        this.smoothPoint(x, y);
        if(this.direction % 2 === 0)
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    this.smoothPoint(x+i-j,y+j)
                    if(i > 0 && i != j)
                    {
                        this.smoothPoint(x-i+j,y+j);
                    }
                    if(j > 0)
                    {
                        this.smoothPoint(x+i-j,y-j);
                    }
                    if(j > 0 && i != j)
                    {
                        this.smoothPoint(x-i+j,y-j);
                    }
                }
            }
        }
        else
        {
            let i;
            for(i = 0; i < width + 1; i++)
            {
                let j;
                for(j = -i; j < i; j++)
                {
                    this.smoothPoint(x+i,y+j);
                    this.smoothPoint(x+j,y-i);
                    this.smoothPoint(x-i,y-j);
                    this.smoothPoint(x-j,y+i);
                }
            }
        }
    }
    noiseWedge(map)
    {
        let reachedEdge = false;

        reachedEdge = reachedEdge || this.addElevation(map, x, y, random(0, this.noiseAmount));
        
        if(this.direction % 2 === 0)
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, x+i-j, y+j, random(0, this.noiseAmount));
                    if(i > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, x-i+j, y+j, random(0, this.noiseAmount));
                    if(j > 0)
                        reachedEdge = reachedEdge || this.addElevation(map, x+i-j, y-j, random(0, this.noiseAmount));
                    if(j > 0 && i != j)
                        reachedEdge = reachedEdge || this.addElevation(map, x-i+j, y-j, random(0, this.noiseAmount));
                }
            }
        }
        else
        {
            let i;
            for(i = 0; i < width + 1; i++)
            {
                let j;
                for(j = -i; j < i; j++)
                {
                    reachedEdge = reachedEdge || this.addElevation(map, x+i, y+j, random(0, this.noiseAmount));
                    reachedEdge = reachedEdge || this.addElevation(map, x+i, y-j, random(0, this.noiseAmount));
                    reachedEdge = reachedEdge || this.addElevation(map, x-i, y-j, random(0, this.noiseAmount));
                    reachedEdge = reachedEdge || this.addElevation(map, x-i, y+j, random(0, this.noiseAmount));
                }
            }
        }
        return reachedEdge;
    }
    addElevation(map, x, y, amount)
    {
        if(map.point(x, y) === null || map.point(x, y).getElevation() < this.minElevation){
            return true;
        }
        else{
            map.point(x,y).setElevation(map.point(x,y).getElevation + amount);
            map.point(x,y).setBiome("mountain");
        }
        return false;
    }
    moveAgent()
    {
        switch(this.direction)
        {
            case "west":
                this.yPos--;
                break;
            case "northwest":
                this.xPos++;
                this.yPos--;
                break;
            case "north":
                this.xPos++;
                break;
            case "northeast":
                this.xPos++;
                this.yPos++;
                break;
            case "east":
                this.yPos++;
                break;
            case "southeast":
                this.xPos--;
                this.yPos++;
                break;
            case "south":
                this.xPos--;
                break;
            case "southwest":
                this.xPos--;
                this.yPos--;
                break;
            default:
                //error
        }
        //check if we hit the edge
    }
    rotateAgent()
    {
        switch(random(0,2))
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
                        //error
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
                        //error
                }
                break;
            default:
                //error
        }
    }
    makeFoothills(map)
    {
        let left_foothill = new Mountain_Agent(this.xPos, this.yPos, this.width * 2, this.get90DegreeOffset, this.wdith / 4, this.heightMin / 2, this.heightMax / 2, 0, 0, this.dropoff);
        let right_foothill = new Mountain_Agent(this.xPos, this.yPos, this.width * 2, this.getNeg90DegreeOffset, this.wdith / 4, this.heightMin / 2, this.heightMax / 2, 0, 0, this.dropoff);
        left_foothill.run_agent(map);
        right_foothill.run_agent(map);
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
                //error
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
                //error
        }
    }
    smoothPoint(map, x, y)
    {
        if(map.point(x, y) === null)
            return;
    
        let total = 0, count = 3;
        total += map.point(x, y).getElevation() * 3;
        if(map.point(x + 1, y) !== null)
        {
            total += map.point(x + 1, y).getElevation();
            count++;
        }
        if(map.point(x - 1, y) !== null)
        {
            total += map.point(x - 1, y).getElevation();
            count++;
        }
        if(map.point(x + 2, y) !== null)
        {
            total += map.point(x + 2, y).getElevation();
            count++;
        }
        if(map.point(x - 2, y) !== null)
        {
            total += map.point(x - 2, y).getElevation();
            count++;
        }
        if(map.point(x, y + 1) !== null)
        {
            total += map.point(x, y + 1).getElevation();
            count++;
        }
        if(map.point(x, y - 1) !== null)
        {
            total += map.point(x, y - 1).getElevation();
            count++;
        }
        if(map.point(x, y + 2) !== null)
        {
            total += map.point(x, y + 2).getElevation();
            count++;
        }
        if(map.point(x, y - 2) !== null)
        {
            total += map.point(x, y - 2).getElevation();
            count++;
        }
        total /= count;
        map.point(x, y).setElevation(total);
    
    }
}