
class Mountain_Agent 
{
    constructor(number_of_mountains, tokens, direction, width, height_min, height_max, turn_period, foothill_period, dropoff_min, dropoff_max, min_elevation)
    {
        this.x = -1;
        this.y = -1;
        this.number_of_mountains = number_of_mountains;
        this.tokens = tokens;
        this.direction = direction;
        this.width = width;
        this.height_min = height_min;
        this.height_max = height_max;
        this.turn_period = turn_period;
        this.foothill_period = foothill_period;
        this.dropoff_min = dropoff_min;
        this.dropoff_max = dropoff_max;
        this.min_elevation = min_elevation;
    }
    generate(map)
    {
        var mountain_count;
        for(mountain_count = 0; mountain_count < this.number_of_mountains)
        {
            this.pick_random_start(map);
            if()
            var i;
            for(i = 0; i < this.tokens; i++)
            {
                this.elevate_wedge(map);
                if(this.foothill_period > 0 && i % this.foothill_period === 0)
                {
                    this.make_foothills(map);
                }
                if(this.turn_period > 0 && i % this.turn_period === 0)
                {
                    this.rotate_agent();
                }
                this.move_agent();
            }
        }
    }
    pick_random_start(map)
    {
        this.x = random(0, map.width - 1);
        this.y = random(0, map.height - 1);
    }
    elevate_wedge(map)
    {
        var height = random(this.height_min, this.height_max);

        if(this.direction % 2 === 0)
        {
            var i;
            for(i = 0; i < this.width + 1; i++)
            {
                var j;
                for(j = 0; j < i + 1; j++)
                {
                    if(map.point(x+i-j, y+j).getElevation() < this.min_elevation)
                    {

                    }
                    map.point(x+i-j,y+j).setElevation(map.point(x+i-j,y+j).getElevation() += height * Math.pow(this.dropoff, i));
                    if(i > 0 && i != j)
                    {
                        map.point(x-i+j,y+j).setElevation(map.point(x-i+j,y+j).getElevation() += height * Math.pow(this.dropoff, i));
                    }
                    if(j > 0)
                    {
                        map.point(x+i-j,y-j).setElevation(map.point(x+i-j,y-j).getElevation() += height * Math.pow(this.dropoff, i));
                    }
                    if(j > 0 && i != j)
                    {
                        map.point(x-i+j,y-j).setElevation(map.point(x-i+j,y-j).getElevation += height * Math.pow(this.dropoff, i));
                    }
                }
            }
        }
        else
        {
            map[x,y] += height;
            var i;
            for(i = 0; i < width + 1; i++)
            {
                var j;
                for(j = -i; j < i; j++)
                {
                    map.point(x+i,y+j).setElevation(map.point(x+i,y+j).getElevation += height * Math.pow(this.dropoff, i));
                    map.point(x+j,y-i).setElevation(map.point(x+j,y-i).getElevation += height * Math.pow(this.dropoff, i));
                    map.point(x-i,y-j).setElevation(map.point(x-i,y-j).getElevation += height * Math.pow(this.dropoff, i));
                    map.point(x-j,y+i).setElevation(map.point(x-j,y+i).getElevation += height * Math.pow(this.dropoff, i));
                }
            }
        }
        
    }
    move_agent()
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
    rotate_agent()
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
    make_foothills(map)
    {
        let left_foothill = new Mountain_Agent(this.xPos, this.yPos, this.width * 2, this.get_90_degree_offset, this.wdith / 4, this.height_min / 2, this.height_max / 2, 0, 0, this.dropoff);
        let right_foothill = new Mountain_Agent(this.xPos, this.yPos, this.width * 2, this.get_neg_90_degree_offset, this.wdith / 4, this.height_min / 2, this.height_max / 2, 0, 0, this.dropoff);
        left_foothill.run_agent(map);
        right_foothill.run_agent(map);
    }
    get_90_degree_offset()
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
    get_neg_90_degree_offset()
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
}