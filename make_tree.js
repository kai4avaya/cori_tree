document.addEventListener("DOMContentLoaded", (event) => {
  initializeFractalTree({ maxDepth: 5 });
});


// function Random(seed) {
//     this.seed = seed
//     this.random = function(){
//        let x = Math.sin(this.seed) * 10000
//        this.seed++
//        return x - Math.floor(x)
//      }
     
//      this.gaussian = function(mean, std) {
//        var rand = 0;
//        for (var i = 0; i < 6; i += 1) {
//          rand += this.random();
//        }
   
//          return ((rand - 3)/6) * std + mean;
//        }
     
//      this.unif = function(a,b){
//        return this.random() * (b-a) + a
//      }
//    }
// Assuming 'fractalTreeWorker.js' is the worker script that handles the drawing logic
const worker = new Worker("fractalTreeWorker.js");

function initializeFractalTree(params_tree) {
  const { maxDepth } = params_tree;
//   console.log("i am maxDept", maxDepth);

const config = {
    maxDepth: 12, // Not too high to prevent excessive detail that becomes visual noise
    scale: 100, // Depends on canvas size, but should be enough to give the tree height
    lengthVar: 22, // Slight randomness to length, but not too much
    lineWidth: 1.6, // Thicker trunk gives a strong base
    lineWidthFalloff: 3.8, // Quick tapering off to give finer branches
    curveAmount: 0.044, // Slight curve to branches
    upAmount: 0.5, // Stronger upward growth
    branchiness: 0.000, // Fewer branches to reduce clutter
    spread: 0.0095, //Math.PI / 6, // Wide spread to avoid branches from looking too chaotic
    leafChance: 1, // Less chance of leaves to allow branches to be seen
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
  const startX = canvas.width / 2;
  const startY = canvas.height - 300;
 

//   const Random = new Random(config.seed);

  // Send the initial parameters to the worker to start the drawing process
  worker.postMessage({
    x: startX,
    y: startY,
    angle: -Math.PI / 2,
    depth: 0,
    config: config,
    // Random: Random,
    // seed : seed,
  });

  ctx.lineWidth = config.lineWidth/(Math.pow(config.lineWidthFalloff,config.maxDepth))
  ctx.strokeStyle = "rgb(60,60,60)"
  ctx.lineCap = "round"

  // Handle messages from the worker (e.g., for drawing lines)
  worker.onmessage = function (e) {
    const { type, details } = e.data;
    // console.log("Received message of type: ", type); // For debugging

    if (type === "line") {
        // Ensure you are correctly accessing the 'details'
        const { x, y, _x, _y, lineWidth, random } = details; // Correct variable names based on your worker's postMessage

        ctx.beginPath()
        ctx.moveTo(x,y)
        ctx.lineTo(_x,_y)
        // ctx.strokeStyle = 'black'; 
        ctx.stroke()
        ctx.closePath()

        if (random < config.branchiness)
            ctx.lineWidth = lineWidth;

        

        // console.log (x1, y1, x2, y2, lineWidth)
    } else if (type==='initiate'){
        const { iniLine } = details; // Correct variable names based on your worker's postMessage

        ctx.lineWidth = iniLine
        ctx.strokeStyle = "rgb(60,60,60)"
        ctx.lineCap = "round"
        // console.log("iniLine", iniLine)

    }else if (type === "leaf") {
        // Drawing leaf logic (seems correct as provided)
        const { x, y, r, color } = details;
        console.log("x, y, r, color", x, y, r, color)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    } else if (type === "end") {
        console.log("Drawing complete");
    } else if (type === "debug") {
        // console.log(details.message); // Correct usage for debug messages
    }
};
}
