
class MountainAgent{
    constructor(number_of_mountains, tokens, width, height_min, height_max, turn_period, foothill_period, dropoff, min_elevation, noise_amount){
        this.x = -1;
        this.y = -1;
        this.number_of_mountains = number_of_mountains;
        this.tokens = tokens;
        this.direction = "north";
        this.width = width;
        this.height_min = height_min;
        this.height_max = height_max;
        this.turn_period = turn_period;
        this.foothill_period = foothill_period;
        this.dropoff = dropoff;
        this.min_elevation = min_elevation;
        this.noise_amount = noise_amount;
    }
    generate(map){
        let mountain_count;
        for(mountain_count = 0; mountain_count < this.number_of_mountains; mountain_count++)
        {
            this.pick_random_start(map);
            this.direction = map.pick_random_direction();
            while(map.point(this.x, this.y) === null || map.point(this.x, this.y).getElevation() < this.min_elevation)
            {
                //if our starting point is invalid pick a new one
                this.pick_random_start(map);
            }

            let i;
            let reached_edge = false;
            for(i = 0; i < this.tokens; i++)
            {
                reached_edge = this.elevate_wedge(map);
                this.noise_wedge(map);
                this.smooth_wedge(map);
                if(this.foothill_period > 0 && i % this.foothill_period === 0)
                {
                    this.make_foothills(map);
                }
                if(this.turn_period > 0 && i % this.turn_period === 0)
                {
                    this.rotate_agent();
                }
                if(reached_edge)
                    break;
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
        let height = random(this.height_min, this.height_max);
        reached_edge = false;

        reached_edge = reached_edge || this.add_elevation(map, x, y, height);
        
        if(this.direction % 2 === 0)
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    reached_edge = reached_edge || this.add_elevation(map, x+i-j, y+j, height * Math.pow(this.dropoff, i));
                    if(i > 0 && i != j)
                        reached_edge = reached_edge || this.add_elevation(map, x-i+j, y+j, height * Math.pow(this.dropoff, i));
                    if(j > 0)
                        reached_edge = reached_edge || this.add_elevation(map, x+i-j, y-j, height * Math.pow(this.dropoff, i));
                    if(j > 0 && i != j)
                        reached_edge = reached_edge || this.add_elevation(map, x-i+j, y-j, height * Math.pow(this.dropoff, i));
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
                    reached_edge = reached_edge || this.add_elevation(map, x+i, y+j, height * Math.pow(this.dropoff, i));
                    reached_edge = reached_edge || this.add_elevation(map, x+i, y-j, height * Math.pow(this.dropoff, i));
                    reached_edge = reached_edge || this.add_elevation(map, x-i, y-j, height * Math.pow(this.dropoff, i));
                    reached_edge = reached_edge || this.add_elevation(map, x-i, y+j, height * Math.pow(this.dropoff, i));
                }
            }
        }
        return reached_edge;
    }
    smooth_wedge(map)
    {
        this.smooth_point(x, y);
        if(this.direction % 2 === 0)
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    this.smooth_point(x+i-j,y+j)
                    if(i > 0 && i != j)
                    {
                        this.smooth_point(x-i+j,y+j);
                    }
                    if(j > 0)
                    {
                        this.smooth_point(x+i-j,y-j);
                    }
                    if(j > 0 && i != j)
                    {
                        this.smooth_point(x-i+j,y-j);
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
                    this.smooth_point(x+i,y+j);
                    this.smooth_point(x+j,y-i);
                    this.smooth_point(x-i,y-j);
                    this.smooth_point(x-j,y+i);
                }
            }
        }
    }
    noise_wedge(map)
    {
        reached_edge = false;

        reached_edge = reached_edge || this.add_elevation(map, x, y, random(0, this.noise_amount));
        
        if(this.direction % 2 === 0)
        {
            let i;
            for(i = 0; i < this.width + 1; i++)
            {
                let j;
                for(j = 0; j < i + 1; j++)
                {
                    reached_edge = reached_edge || this.add_elevation(map, x+i-j, y+j, random(0, this.noise_amount));
                    if(i > 0 && i != j)
                        reached_edge = reached_edge || this.add_elevation(map, x-i+j, y+j, random(0, this.noise_amount));
                    if(j > 0)
                        reached_edge = reached_edge || this.add_elevation(map, x+i-j, y-j, random(0, this.noise_amount));
                    if(j > 0 && i != j)
                        reached_edge = reached_edge || this.add_elevation(map, x-i+j, y-j, random(0, this.noise_amount));
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
                    reached_edge = reached_edge || this.add_elevation(map, x+i, y+j, random(0, this.noise_amount));
                    reached_edge = reached_edge || this.add_elevation(map, x+i, y-j, random(0, this.noise_amount));
                    reached_edge = reached_edge || this.add_elevation(map, x-i, y-j, random(0, this.noise_amount));
                    reached_edge = reached_edge || this.add_elevation(map, x-i, y+j, random(0, this.noise_amount));
                }
            }
        }
        return reached_edge;
    }
    add_elevation(map, x, y, amount)
    {
        if(map.point(x, y) === null || map.point(x, y).getElevation() < this.min_elevation){
            return true;
        }
        else{
            map.point(x,y).setElevation(map.point(x,y).getElevation + amount);
            map.point(x,y).setBiome("mountain");
        }
        return false;
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
    smooth_point(map, x, y)
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