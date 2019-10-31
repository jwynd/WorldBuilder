
class CoastAgent{
    constructor(seedpoint, tokens, limit){
        /*
        seedpoint is a point, where the first agent will begin and the landmass will center around.
        tokens determines how many tokens the first agent starts with, and determines the size
        of the landmass.
        limit defines the threshold above which an agent will split into two smaller agents to divide work, and
        determines the jaggedness of the landscape.
        The agent's preferred direction is randomly assigned.
        */
        this.seed = seedpoint;
        this.tokens = tokens;
        this.limit = limit;
        this.direction = Map.randomDirection();
    }

    getSeed(){
        /*
        Returns the seed point of the agent
        */
        return this.seed;
    }

    setSeed(newSeed){
        /*
        Sets the seed point of the agent
        newSeed must be a Point object
        */
        this.seed = newSeed;
    }

    getTokens(){
        /*
        Returns the number of tokens of the agent
        */
        return this.tokens;
    }

    setTokens(newTokens){
        /*
        Sets the number of tokens of the agent
        newTokens must be an integer
        */
        this.tokens = newTokens;
    }

    getDirection(){
        /*
        Returns the direction of the agent
        */
        return this.direction;
    }

    setDirection(newDirection){
        /*
        Sets the direction of the agent.
        newDirection must be a string denoting a legal direction.
        */
        this.direction = newDirection;
    }

    randDirection(){
        /*
        Sets the direction of the agent to a new random direction.
        */
        this.direction = Map.randomDirection();
    }

    generate(map){
        /*
        Generates a new landmass centered around this agent on map.
        */
        map.nothing();
        this.recurCoast(this, map);
    }

    recurCoast(agent, map){
        /*
        Recursively divides agents into child agents until all child agents are at or below the specified limit.
        Child agents then procedurally move around the map and raise points out of the ocean.
        */
        map.nothing();
        if(agent.tokens > agent.limit){
            let child1 = new CoastAgent(map.getRandomNeighbor(agent.seed), Math.floor(agent.tokens/2), agent.limit);
            let child2 = new CoastAgent(map.getRandomNeighbor(agent.seed), Math.floor(agent.tokens/2), agent.limit);
            this.recurCoast(child1);
            this.recurCoast(child2);
        }
        else{
            while(agent.tokens > 0){
                agent.seed = map.getRandomNeighbor(agent.seed);
                this.moveAgent(agent, map);
                if(agent.seed === null){
                    break;
                }
                let beacons = this.assignBeacons(agent.seed, map);
                let scoreSet = [];
                for(let p of map.getNeighbors(agent.seed)){
                    scoreSet.push(score(p, beacons));
                }
                this.raisePoint(Math.max(scoreSet));
                agent.tokens--;
            }
        }
    }
    
    raisePoint(point){
        /*
        Raises a point out of the ocean and sets its biome to coast.
        */
        point.setElevation(1);
        point.setBiome("coast");
        return point;
    }

    assignBeacons(point, map){
        /*
        Creates an attractor and a repulsor near a specified point on a map.
        */
        let repulsor = map.getRandomNeighbor(point);
        let attractor = map.getRandomNeighbor(point);
        while(repulsor === attractor){
            repulsor = map.getRandomNeighbor(point);
            attractor = map.getRandomNeighbor(point);
        }
        return [repulsor, attractor];
    }

    moveAgent(agent, map){
        /*
        Moves an agent in its preferred direction until it falls off the map or finds a non-landlocked point.
        */
        while(map.getNeighborsOfType(agent.seed, ocean).length == 0){
            agent.seed = getNeighbor(agent.seed, map.getNeighbor(agent.seed, agent.direction));
            if (agent.seed === null){
                return;
            }
        }
    }

    score(point, beacons, map){
        /*
        Scores a point relative to an attractor and a repulsor.
        */
        let repulsor = beacons[0];
        let attractor = beacons[1];
        let dR = point.dist(repulsor);
        let dA = point.dist(attractor);
        let dE = min[(map.width-1 - point.getX()), (point.getX()), (map.height-1 - point.getY()), (point.getY())];
        return Math.pow(dR, 2) - Math.pow(dA, 2) + 3 * Math.pow(dE, 2);
    }
}