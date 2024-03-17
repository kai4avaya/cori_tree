// Gaussian distribution helper function
function gaussian(mean, variance) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Avoid zero
  while (v === 0) v = Math.random();
  return (
    mean +
    Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * variance
  );
}

// Uniform distribution helper function
function unif(min, max) {
  return Math.random() * (max - min) + min;
}

// Main function to generate branches
function generateBranch(x, y, angle, depth, config) {
  if (depth >= config.maxDepth) return;

    // Adjust the length calculation to ensure positive values
    const baseLength = 50; // A base length to ensure minimum segment size
    const length = Math.abs((config.scale / Math.pow(2, depth)) * gaussian(1, config.lengthVar)) + baseLength;
    const segments = Math.floor(length / 10)
    const iniLine = config.lineWidth/(Math.pow(config.lineWidthFalloff,depth))
  console.log("length, segments", length, segments)
  self.postMessage({
    type: "line",

  })
  
  for (let i = 0; i < segments; i++) {
    const curve = config.curveAmount * (Math.random() < 0.5 ? -1 : 1);
    const newX = x + Math.cos(angle) * 10; // Length of segment is 10
    const newY = y + Math.sin(angle) * 10;


    // Post line segment details
    self.postMessage({
      type: "line",
      details: {
        x1: x,
        y1: y,
        x2: newX,
        y2: newY,
        lineWidth: config.lineWidth / Math.pow(config.lineWidthFalloff, depth),
      },
    });

    

    // Inside generateBranch function, where you determine it's time to draw a leaf
if (depth >= config.maxDepth - 1) {
    let h = Math.floor(unif(160, 170)); // Hue
    let s = Math.floor(unif(65, 75)); // Saturation
    let l = Math.floor(unif(60, 70)); // Lightness
    let r = Math.max(gaussian(4, 1), 0.1); // Radius, ensuring it's not negative
  
    self.postMessage({
      type: 'leaf',
      details: { x, y, r, color: `hsl(${h}, ${s}%, ${l}%)` }
    });
  }
  

    // Inside your for-loop in generateBranch
    console.log(`Debugging segment: ${i}, X: ${newX}, Y: ${newY}`); // Assuming you have newX and newY calculated above

    // Then adjust the self.postMessage to include these logs
    self.postMessage({
      type: "debug", // Just an example, handle 'debug' type messages appropriately in your main thread
      details: { message: `Debugging segment: ${i}, X: ${newX}, Y: ${newY}` },
    });

    x = newX;
    y = newY;
    angle += curve + config.upAmount * (depth * 0.1); // Adding variability to the angle for each segment

    // Branching logic
    if (i === segments - 1 || Math.random() < config.branchiness) {
      // At end of segment or randomly branching
      const newDepth = depth + 1;
      const spread = config.spread;
      generateBranch(x, y, angle + spread, newDepth, config); // Right branch
      generateBranch(x, y, angle - spread, newDepth, config); // Left branch
    }
  }
}

self.onmessage = function (e) {
  const { x, y, angle, depth, config } = e.data;

  // Start branch generation from the initial position and configuration
  generateBranch(x, y, angle, depth, config);

  // Signal the end of drawing calculations
  self.postMessage({ type: "end" });
};
