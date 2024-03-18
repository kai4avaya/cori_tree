document.addEventListener('DOMContentLoaded', (event) => {

    const params = {
        maxDepth: 1, //12,
        branchiness: Math.random() * (0.07 - 0.01) + 0.01
    }
    initializeFractalTree(params);
  });
  
  function initializeFractalTree(params_tree) {

    const {maxDepth, branchiness} = params_tree
    console.log("i am maxDept", maxDepth)
    // Set up default configurations for the tree
    const config = {
      maxDepth:maxDepth,
      scale: 50,
      lengthVar: 6.2,
      lineWidth: 6,
      lineWidthFalloff: 1.62,
      curveAmount: 0.15,
      upAmount: 0.2,
      branchiness: branchiness, // 0.01,
      spread: Math.PI / 4
    };

    
    // const config = {
    //     maxDepth:14,
    //     scale: 50,
    //     lengthVar: 6.2,
    //     lineWidth: 4,
    //     lineWidthFalloff: 1.62,
    //     curveAmount: 0.19,
    //     upAmount: 0.2,
    //     branchiness: 0.01,
    //     spread: Math.PI / 4
    //   };
  
    // Set up randomization functions
    const random = {
      unif: (min, max) => Math.random() * (max - min) + min,
      gaussian: (mean, variance) => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * variance;
      }
    };


  
    // Set up canvas
    const canvas = document.createElement('canvas');
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
      // Set up canvas with specific dimensions
  const canvasWidth = 1200; // Example width
  const canvasHeight = 1000; // Example height
  canvas.width = canvasWidth
  canvas.height =canvasHeight
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);


    // const container = document.getElementById('tree-container');
    // container.appendChild(canvas);

    const container = document.getElementById('tree-container');

// Remove all child nodes from the container
while (container.firstChild) {
    container.removeChild(container.firstChild);
}

// Append the canvas after clearing the container
container.appendChild(canvas);

    // Clear the entire canvas
   
      // Center the tree on the canvas
  const startX = canvas.width / 2;
  const startY = canvas.height - 500;
  
    // Draw the tree
    tree(startX, startY, -Math.PI / 2, 0, random, config, ctx);
  }
  
  function tree(x, y, angle, depth, random, config, ctx) {
    if (depth >= config.maxDepth) {
      return;
    }
  
    const length = (config.scale / (depth + 1)) * random.gaussian(1, config.lengthVar);
    const segments = length / 10;
  
    ctx.lineWidth = config.lineWidth / Math.pow(config.lineWidthFalloff, depth);
    ctx.strokeStyle = 'rgb(60,60,60)';
    ctx.lineCap = 'round';
  
    let newX = x;
    let newY = y;
    let newAngle = angle;
  
    for (let i = 0; i < segments; i++) {
      const deltaAngle = config.curveAmount * (random.unif(0, 1) < 0.5 ? -1 : 1);
      newAngle += deltaAngle;
      newX += Math.cos(newAngle) * 10;
      newY += Math.sin(newAngle) * 10;
  
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(newX, newY);
      ctx.stroke();
  
      x = newX;
      y = newY;
    }
  
    if (depth < config.maxDepth - 1) {
      const branchFactor = random.unif(0, 1) < config.branchiness ? 1 : 0;
      for (let j = 0; j < 2; j++) {
        const dir = j === 0 ? 1 : -1;
        tree(newX, newY, newAngle + config.spread * dir * branchFactor, depth + 1, random, config, ctx);
      }
    } else {
      ctx.fillStyle = random.unif(0, 1) < 0.5 ? '#a9f6ff' : '#ee2947';
      ctx.beginPath();
      ctx.arc(newX, newY, random.unif(3, 6), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  