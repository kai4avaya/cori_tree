document.addEventListener("DOMContentLoaded", (event) => {

  
const config = {
  maxDepth: 10, // Not too high to prevent excessive detail that becomes visual noise
  scale: 100, // Depends on canvas size, but should be enough to give the tree height
  lengthVar: 22, // Slight randomness to length, but not too much
  lineWidth: 10.6, // Thicker trunk gives a strong base
  lineWidthFalloff: 1.2, // Quick tapering off to give finer branches
  curveAmount: 0.0004, // Slight curve to branches
  upAmount: 5.5, // Stronger upward growth
  branchiness: 0.020, // Fewer branches to reduce clutter
  spread: 0.000095, //Math.PI / 6, // Wide spread to avoid branches from looking too chaotic
  seed: 31,
};


  // Prepare the canvas
  const canvas = document.createElement("canvas");
  const canvasWidth = 1000;
  const canvasHeight = 700;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const container = document.getElementById("tree-container");
  container.appendChild(canvas);

  // Center the tree on the canvas
  const x = canvas.width / 2;
  const y = canvas.height - 300;

  const angle =  -Math.PI / 2
  const depth = 0
 
  tree(x,y,angle, depth, random,config,ctx)

  // initializeFractalTree({ maxDepth: 5 });
});

function Random(seed) {
  this.seed = seed
  this.random = function(){
     let x = Math.sin(this.seed) * 10000
     this.seed++
     return x - Math.floor(x)
   }
   
   this.gaussian = function(mean, std) {
     var rand = 0;
     for (var i = 0; i < 6; i += 1) {
       rand += this.random();
     }
 
       return ((rand - 3)/6) * std + mean;
     }
   
   this.unif = function(a,b){
     return this.random() * (b-a) + a
   }
 }
 const random = new Random(31)


function tree(x,y,angle, depth, random,config,ctx){
  if (depth >= config.maxDepth){return}
 
  let _x = x
  let _y = y
  let _angle = angle
  let length = (config.scale/depth) * random.gaussian(1,config.lengthVar)
  let segments = length/10
  
  ctx.lineWidth = config.lineWidth/(Math.pow(config.lineWidthFalloff,depth))
  ctx.strokeStyle = "rgb(60,60,60)"
  ctx.lineCap = "round"
                                
  let curve_dir = (random.unif(0,1) < .5)?-1:1
  let curve = config.curveAmount * curve_dir 
  if (depth == 1) {curve *= .25}
  
  for(let i = 0; i < segments; i++){
    
    let up =  (angle < -Math.PI/2)?  Math.PI/2 - angle : angle - Math.PI/2 
    
   _angle += curve + (up * config.upAmount * depth)  
    _x = x + 10 * Math.cos(angle)
    _y = y + 10 * Math.sin(angle)
    
 
    ctx.beginPath()
    ctx.moveTo(x,y)
    ctx.fillStyle = "black"
    ctx.lineTo(_x,_y)
    ctx.stroke()
    ctx.closePath()
    
    x = _x
    y = _y
    angle = _angle
  
    if (random.unif(0,1) < config.branchiness){
      let dir = (random.unif(0,1) < .5)?-1:1
      tree(x,y,angle + (config.spread/2 * dir), depth + 1, random,config,ctx)
      ctx.lineWidth = config.lineWidth/(Math.pow(config.lineWidthFalloff,depth))
    } 
  }
  
  let dir = (random.unif(0,1) < .5)?-1:1
  tree(x,y,angle + (config.spread * dir), depth + 1, random,config,ctx)
  tree(x,y,angle + (config.spread * -dir), depth + 1, random,config,ctx)
                                
  if (depth >= config.maxDepth - 2){
    
    let h = random.unif(160,170)
    let s = random.unif(65,75)
    let l = random.unif(60,70)
    ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`
    
    let r = random.gaussian(4,1)
    ctx.beginPath()
    ctx.arc(x,y,r,0, Math.PI *  2)
    ctx.fill()
 }
}