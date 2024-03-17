function getNextColorComponent(component) {
    const baseValue = 127; // Base value for pastel colors
    const range = 127; // Range for shifting colors to keep them pastel
    return baseValue + (component % range);
}

let count = 0

function updateYearAndColor(startYear, currentYear) {
    const yearIncrement = currentYear - startYear;
    const yearDisplay = startYear + yearIncrement;

    // Display the year
    document.getElementById('dateText').innerText = `Cori day forever: March 19, ${yearDisplay}`;
    
    const alpha = 0.1;
    // Shift the background color to be pastel
    const colorComponent = yearIncrement % 256;
    const red = getNextColorComponent(colorComponent);
    const green = getNextColorComponent((colorComponent + 85) % 256); // Offset green
    const blue = getNextColorComponent((colorComponent + 170) % 256); // Offset blue

    // Apply the transition style for the background color
    document.body.style.transition = 'background-color 5s ease';
    document.body.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

// Starting year is 1979
const startYear = 1979;
let currentYear = startYear;

function startDisplay() {
    updateYearAndColor(startYear, currentYear);
    currentYear++; // Increment the year

    count = (count + 1) % 20;

    
    const params = {
        maxDepth: count,
        branchiness: Math.random() * (0.07 - 0.01) + 0.01
    }

    initializeFractalTree(params);


    // Adjust the timeout to your required frequency of update, e.g., once a year
    setTimeout(startDisplay, 5000); // This is currently set to update every 5 seconds for demonstration purposes
}

startDisplay();
