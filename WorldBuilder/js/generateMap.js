
/*
 * This file will create define a point
 * create an array of points which will define the map
 * call each individual agent from different files to actually
 * alter the point values
 */
"use strict";

// create a point of elevation e, biome b, created by agent a
class Point {
    constructor(e, b) {
        this.elevation = e;
        this.biome = b;
    }

    getElevation(){
        return this.elevation;
    }
    
    getBiome(){
        return this.biome;
    }

    setElevation(e){
        this.elevation = e;
    }

    setBiome(b){
        this.biome = b;
    }
}


class Map {
    constructor(x, y) {
        this.width = x;
        this.height = y;
        this.map = [];
        for(let i = 0; i < x*y; i++){
            this.map[this.map.length] = new Point(0, "Ocean");
        }
    }

    point(x, y){
        return this.map[(y*this.width) + x];
    }
}

