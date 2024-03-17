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

function Random(seed) {
  this.seed = seed;
  this.random = function () {
    let x = Math.sin(this.seed) * 10000;
    this.seed++;
    return x - Math.floor(x);
  };

  this.gaussian = function (mean, std) {
    var rand = 0;
    for (var i = 0; i < 6; i += 1) {
      rand += this.random();
    }

    return ((rand - 3) / 6) * std + mean;
  };

  this.unif = function (a, b) {
    return this.random() * (b - a) + a;
  };
}

// Uniform distribution helper function
function unif(min, max) {
  return Math.random() * (max - min) + min;
}

// Main function to generate branches
function generateBranch(x, y, angle, depth, config, Random) {
  console.log("i am depth!", depth);
  if (depth >= config.maxDepth) return;

  let _x = x;
  let _y = y;
  let _angle = angle;
  let length = Math.abs(
    Math.floor(
      (config.scale / (depth + 1)) * Random.gaussian(1, config.lengthVar)
    )
  ); // +1 to avoid div by 0

  let segments = Math.floor(length / 20);


  self.postMessage({
    type: "initiate",
    details: {
    iniLine:config.lineWidth/(Math.pow(config.lineWidthFalloff,depth))
    }
  })
  //   console.log("length, segments", length, segments);
  // Adjust the length calculation to ensure positive values
  // const baseLength = 50; // A base length to ensure minimum segment size
  // const length = Math.abs((config.scale / Math.pow(2, depth)) * gaussian(1, config.lengthVar)) + baseLength;
  // const segments = Math.floor(length / 10)
  let curve_dir = Random.unif(0, 1) < 0.5 ? -1 : 1;
  let curve = config.curveAmount * curve_dir;
  if (depth == 1) {
    curve *= 0.25;
  }

  for (let i = 0; i < segments; i++) {
    // if (i > 2) break;

    let up = angle < -Math.PI / 2 ? Math.PI / 2 - angle : angle - Math.PI / 2;

    _angle += curve + up * config.upAmount * depth;
    _x = x + 10 * Math.cos(_angle);
    _y = y + 10 * Math.sin(_angle);

    // Post line segment details
    self.postMessage({
      type: "line",
      details: {
        x: x,
        y: y,
        _x: _x,
        _y: _y,
        _angle: _angle,
        dir: Random.unif(0, 1) < 0.5 ? -1 : 1,
        lineWidth: config.lineWidth / Math.pow(config.lineWidthFalloff, depth),
        random: Random.unif(0, 1),
      },
    });

    x = _x;
    y = _y;
    angle = _angle;


    if (Random.unif(0, 1) < config.branchiness) {
      let dir = Random.unif(0, 1) < 0.5 ? -1 : 1;
      generateBranch(
        x,
        y,
        angle + (config.spread / 2) * dir,
        depth + 1,
        config,
        Random
      );
    }

    let dir = Random.unif(0, 1) < 0.5 ? -1 : 1;
    generateBranch(
      x,
      y,
      angle + config.spread * dir,
      depth + 1,
      config,
      Random
    );
    generateBranch(
      x,
      y,
      angle + config.spread * -dir,
      depth + 1,
      config,
      Random
    );

    console.log("depth >= config.maxDepth - 1......", depth,config.maxDepth - 1)
    // Inside generateBranch function, where you determine it's time to draw a leaf
    if (depth >= config.maxDepth - 1 && Random.unif(0, 1) < config.leafChance) {
    if (depth >= config.maxDepth - 1) {
      let h = Random.unif(160, 170);
      let s = Random.unif(65, 75);
      let l = Random.unif(60, 70); // Lightness
      let r = Random.gaussian(4, 1); // Radius, ensuring it's not negative

      console.log(`Drawing leaf at ${x},${y} with radius ${r} `, `hsl(${h}, ${s}%, ${l}%)` );
      self.postMessage({
        type: "leaf",
        details: { x, y, r, color: `hsl(${h}, ${s}%, ${l}%)` },
      });
    }
    }
    // Inside your for-loop in generateBranch
    // console.log(`Debugging segment: ${i}, _X: ${_x}, _Y: ${_y}`); // Assuming you have newX and newY calculated above

    // Then adjust the self.postMessage to include these logs
    self.postMessage({
      type: "debug", // Just an example, handle 'debug' type messages appropriately in your main thread
      details: { message: `Debugging segment: ${i}, _x: ${_x}, _y: ${_y}` },
    });


  }
}

self.onmessage = function (e) {
  const { x, y, angle, depth, config } = e.data;

  // Start branch generation from the initial position and configuration
  generateBranch(x, y, angle, depth, config, new Random(config.seed));

  // Signal the end of drawing calculations
  self.postMessage({ type: "end" });
};
