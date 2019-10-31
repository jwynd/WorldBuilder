/* This is based off of code by playfuljs-demos
 * https://github.com/hunterloftis/playfuljs-demos/blob/gh-pages/terrain/index.html
 */
/*global
  createCanvas
  background
  createImage
  map
  image
  lerpColor
  color
*/

let heightmap;
let m;
let c;
let mWidth = 1280;
let mHeight = 720;
let tokens = 1000;
let limit = 100;
let worldSeed = 0xa12413adff;
function setup(){
  createCanvas(mWidth, mHeight);
  m = new Map(mWidth, mHeight);
  randomSeed(worldSeed);
  let sPointX = floor(mWidth/2);
  let sPointY = floor(mHeight/2);
  let p = m.point(sPointX, sPointY);
  c = new CoastAgent(p, tokens, limit);
  c.generate(m);
  makeHeightmap(m);
}

function makeHeightmap(m){
  heightmap = createImage(mWidth, mHeight);
  heightmap.loadPixels();
  let pixIndex = 0;
  for(let i = 0; i < heightmap.width; ++i){
    for(let j = 0; j < heightmap.height; ++j){
      let raw = m.point(i, j).getElevation();
      let col = 0;
      if(raw == 0){
        col = color(0, 0, 255);
      } else if(raw == 1){
        col = color(0, 255, 0);
      } else {
        col = color(255, 0, 0);
      }
      heightmap.set(i, j, col);
    }
  }
  heightmap.updatePixels();
}

function mousePressed(){
  
}

function draw(){
  image(heightmap, 0, 0);
}


// function makeHeightmap(roughness, seaLevel){
//   terrain.generate(roughness);
//   let min = 0, max = 0;
//   for(let i = 0; i < terrain.map.length; ++i){
//     if(terrain.map[i] < min) min = terrain.map[i];
//     if(terrain.map[i] > max) max = terrain.map[i];
//   }
//   //console.log("min = "+min+"max = "+max);
  
//   heightmap = createImage(512, 512);
//   heightmap.loadPixels();
//   let pixIndex = 0;
//   for(let i = 0; i < heightmap.width; ++i){
//     for(let j = 0; j < heightmap.height; ++j){
//       //heightmap.set(i, j, map(terrain.map[i*j+j], -100, 512, 0, 255, true))
//       let c;
//       let greyscale = map(terrain.get(i, j), min, max, 0, 255, true);
//       if(greyscale < seaLevel) c = color(30,60,200); // ocean
//       else{
//         // lerp between two colors
//         let from = color(30,200,30);
//         let to = color(200, 30, 30);
//         c = lerpColor(from, to, map(greyscale, seaLevel, 255, 0, 1));
//       }
//       heightmap.set(i, j, c);
//     }
//   }
//   heightmap.updatePixels();
// }



// function Terrain(detail) {
//   this.size = Math.pow(2, detail) + 1;
//   this.max = this.size - 1;
//   this.map = new Float32Array(this.size * this.size);
// }
// Terrain.prototype.get = function(x, y) {
//   if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
//   return this.map[x + this.size * y];
// };
// Terrain.prototype.set = function(x, y, val) {
//   this.map[x + this.size * y] = val;
// };
// Terrain.prototype.generate = function(roughness) {
//   var self = this;
//   this.set(0, 0, self.max);
//   this.set(this.max, 0, self.max / 2);
//   this.set(this.max, this.max, 0);
//   this.set(0, this.max, self.max / 2);
//   divide(this.max);
//   function divide(size) {
//     var x,
//       y,
//       half = size / 2;
//     var scale = roughness * size;
//     if (half < 1) return;
//     for (y = half; y < self.max; y += size) {
//       for (x = half; x < self.max; x += size) {
//         square(x, y, half, Math.random() * scale * 2 - scale);
//       }
//     }
//     for (y = 0; y <= self.max; y += half) {
//       for (x = (y + half) % size; x <= self.max; x += size) {
//         diamond(x, y, half, Math.random() * scale * 2 - scale);
//       }
//     }
//     divide(size / 2);
//   }
//   function average(values) {
//     var valid = values.filter(function(val) {
//       return val !== -1;
//     });
//     var total = valid.reduce(function(sum, val) {
//       return sum + val;
//     }, 0);
//     return total / valid.length;
//   }
//   function square(x, y, size, offset) {
//     var ave = average([
//       self.get(x - size, y - size), // upper left
//       self.get(x + size, y - size), // upper right
//       self.get(x + size, y + size), // lower right
//       self.get(x - size, y + size) // lower left
//     ]);
//     self.set(x, y, ave + offset);
//   }
//   function diamond(x, y, size, offset) {
//     var ave = average([
//       self.get(x, y - size), // top
//       self.get(x + size, y), // right
//       self.get(x, y + size), // bottom
//       self.get(x - size, y) // left
//     ]);
//     self.set(x, y, ave + offset);
//   }
// };


