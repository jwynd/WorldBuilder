// River agent file
// Contains class definition and generate function
// a river agent will create max agent or fewer rivers

class RiverAgent{
    constructor(maxRivers = 1){
        this.maxRivers = maxRivers;
    }

    // will generate maxRivers or fewer rivers
    generate(map){
        for(let i = 0; i < this.maxRivers; ++i){
            generateRiver(map);
        }
    }
    
    // will generate 0 or 1 rivers
    generateRiver(map){

    }
}