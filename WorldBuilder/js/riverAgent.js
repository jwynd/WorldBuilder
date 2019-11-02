// River agent file
// Contains class definition and generate function

class RiverAgent{
    constructor(maxRivers = 1){
        this.maxRivers = maxRivers;
    }

    // will generate maxRivers
    generate(map){
        let altered = [];
        for(let i = 0; i < this.maxRivers; ++i){
            Array.prototype.push.apply(altered, generateRiver(map)); // only way I found to concatinate arrays
        }
        return altered;
    }
    
    // will generate 1 river
    generateRiver(map){
        defineBeach(map);
        let b = getRandomPointOfType("beach");
        let m = getRandomPointOfType("mountain");
        let p = b;
        let d = b.dist(m); // want to reduce the distance between b and m
        let altered = []
        while(p.getBiome() !== "mountain"){
            // move towards a mountain
            p.setBiome("river");
            altered.push(p);
            let nRaw = map.getNeighbors(p);
            let n = [];
            for(point of nRaw){
                let biome = point.getBiome();
                if(biome === "ocean" || biome === "river" || biome === "beach"){
                    continue;
                }
                if(point.dist(m) > d){
                    continue;
                }
                n.push(point);
            }
            if(n.length === 0){
                console.error("failed river");
                for(point of altered){
                    point.setBiome("xriver");
                }
            }
            p = random(n);
        }
        return altered;
    }

    defineBeach(map){
        let o = map.getPointsOfType("ocean");
        for(p of o){
            let n = map.getNeighborsOfType(p, "coast");
            n.forEach(function(point, index){point.setBiome("beach")});
        }
    }
}