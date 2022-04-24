// narrative - starts at night, brightens to day after some time, dims back down, regenerates the background as something different, which is revealed at day
// as a mechanic, you could 'spend' to modify things for next generation (like greater chance of x appearing, new appearance possibilities)


// things to fix:
// or is the sparkle good while screen is still black? like maybe just less frequent? Since less light before fire starts
// change the sparkle function to append asterisks instead of generating random colors

const gridContainer = document.querySelector(`#gridContainer`);


let originArray = [];

let originRow = 0;

let originColumn = 0;

let sparkleCounter = 0;

let hasBeenClicked = false; // keeps track of if the grid has been clicked and activated already, and then if true, stops function from running again

function getWidth() { // returns width of browser window
    if (self.innerWidth) {
      return self.innerWidth;
    }
    if (document.documentElement && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    }
    if (document.body) {
      return document.body.clientWidth;
    }
};

function getHeight() { // returns height of browser window
    if (self.innerHeight) {
      return self.innerHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight) {
      return document.documentElement.clientHeight;
    }
    if (document.body) {
      return document.body.clientHeight;
    }
};

const documentWidth = getWidth();
const documentHeight = getHeight();

let minOfRowsOrColumns = Math.min((Math.floor(documentHeight / 30)),(Math.floor(documentWidth / 30))); // gets the height/width of the view screen, and then caps number of rows/columns at whichever is smaller, so it makes a square

let maxOfRowsOrColumns = Math.max((Math.floor(documentHeight / 30)),(Math.floor(documentWidth / 30)));

// let numberOfRows = minOfRowsOrColumns;
// let numberOfColumns = minOfRowsOrColumns;

//sets the rows and columns to be a square, smaller than view window

// let numberOfRows = maxOfRowsOrColumns;
// let numberOfColumns = maxOfRowsOrColumns;

//sets the rows and columns to be a square, larger than view window.

let numberOfRows = (Math.floor(documentHeight / 30));
let numberOfColumns = (Math.floor(documentWidth / 30));

// sets at browser width
// this one looks best


function randomNumber(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomColor() {
    let redValue = randomNumber(0,255);
    let greenValue = randomNumber(0,255);
    let blueValue = randomNumber(0,255);
    return `rgb(${redValue},${greenValue},${blueValue})`
}

function getRandomGreen() {
    return greenArray[Math.floor(Math.random() * greenArray.length)];
}

function getRandomPink() {
    return pinkArray[Math.floor(Math.random() * pinkArray.length)];
}

function getRandomBlue() {
    return pondColorArray[Math.floor(Math.random() * greenArray.length)];
}

let greenArray = ['#45BF6C', '#259C4B','#2A964C','#18943F','#19BD4D'];

let pinkArray = [`#FFDDE2`,`#D6949E`,`#E69CA7`,`#F5A2AE`,`#D67A88`];

function getRow(cell) {
    return Number((cell.id).substring(0,2));
}

function getColumn(cell) {
    return (Number((cell.id).substring(3)));
}

let distanceArray = [];

function setDistanceFromOrigin(cell) {
    cellRow = getRow(cell);
    cellColumn = getColumn(cell);
    cell.classList.add('distanceAssigned');
    columnDistance = (Math.abs(cellColumn - originArray[1]));
    // should this calc be different, some way of averaging the row/column distance and rounding - so you get more circle going out instead of square
    rowDistance = (Math.abs(cellRow - originArray[0]));
    greaterDistance = Math.max(columnDistance,rowDistance);
    averageDistance = Math.floor((columnDistance+rowDistance)/2);
    cell.classList.add(`.distance${averageDistance+greaterDistance}`);
    distanceArray.push(averageDistance+greaterDistance);

    // cell.append(averageDistance+greaterDistance);

    // adjusting formula above changes shape?
}

function getFurthestDistance() { // return distance number of furthest cell
    return Math.max(...distanceArray);
}

function makeGrid(numberOfRows,numberOfColumns) { // generates a grid
    for (let i = 1; i <= numberOfRows; i++) {
        let gridRow = document.createElement('div');
        gridRow.classList.add('gridRow');
        // gridRow.setAttribute('id',`gridRow${i}`)
        // gridRow.textContent = i;
        gridContainer.appendChild(gridRow);
        for (let j = 1; j <= numberOfColumns; j++){
            let cell = document.createElement('div');
            cell.classList.add(`cell`,`row${i}`,`column${j}`);
            cell.style.backgroundColor = 'black';
            if (i < 10 && j < 10) {
                cell.setAttribute('id',`0${i}-0${j}`)
            }
            if (i < 10 && j >= 10) {
                cell.setAttribute(`id`,`0${i}-${j}`)
            }
            if (i >= 10 && j < 10) {
                cell.setAttribute(`id`,`${i}-0${j}`)
            }
            if (i >= 10 && j >= 10) {
                cell.setAttribute('id',`${i}-${j}`)
            }
            // cell.setAttribute(`id`,`${parseInt(i)}-${parseInt(j)}`);
            gridRow.appendChild(cell);
            cell.addEventListener('click', e => {
                e.target.classList.add('originCell');
                e.target.classList.add('originDistance-0');
                originArray.push(Number((e.target.id).substring(0,2)));
                originArray.push(Number((e.target.id).substring(3)));
                originRow = originArray[0];
                originColumn = originArray[1];
            })
        }
    }
}

function sleep(ms) {
    return new Promise((accept) => {
        setTimeout(() => {
            accept();
        }, ms);
    });
}

let closeCells = [];

function createCloseCellsArray(el) {
  for (let i = 1; i <= 4; i++) {
      if (el.classList.contains(`.distance${i}`)) {
        closeCells.push(el.id);
      }
  }
};

gridContainer.addEventListener('click', (e) => {
    if (hasBeenClicked == true) {
        return;
    }
    hasBeenClicked = true;
    let cells = document.querySelectorAll(`.cell`).forEach(async (el) => {
        setDistanceFromOrigin(el);
        createCloseCellsArray(el);
        for (let i = 0; i <= getFurthestDistance(); i++) {
            if (el.classList.contains(`.distance0`)) {
                el.innerHTML = (String.fromCodePoint(0x1F525));
                el.style.fontSize = 'x-large';
                el.style.textAlign = 'center';
            }
            if (el.classList.contains(`.distance${i}`)) {
                setGreen = getRandomGreen();
                el.style.backgroundColor = `${setGreen}`;
                if (100-(i*7) < 0) { // the number multiplied by i has to be the same as the number multiplied by i in other part of if/else statement
                    el.style.filter = `brightness(0%)`
                    // above option sets brightness to zero if above a certain distance, but makes the sparkle text disappear after set distance
                } else {
                    el.style.filter = `brightness(${100-(i*7)}%)`; // EDIT THE number after i * to adjust size fof light, bigger number = smaller circle
                }
                //need to set brightness so it gets to 0 at max of row or columns
                // the multiplier of i adjusts size of circle - higher number == smalelr circle
                // how to make the fading more circular than square?
                // if (rowDistance >= 12 && columnDistance >= 12) {
                //     el.style.filter = `brightness(${parseInt(el.style.filter.split('(').pop().split('%')[0])+90}%)`;
                //     // el.style.backgroundColor = "red"; could make spooky around the edge?
                // }
            }
            if (el.classList.contains(`.distance0`) || el.classList.contains(`.distance1`) || el.classList.contains(`.distance2`)) {
                // el.style.backgroundColor = "darkred";
            }
        await sleep(15); // make sleep start slow and speed up as it goes?
        }
        // dayNightCycle();
    });
    dayNightCycle();
});

async function startingFire() {
  if (el.classList.contains(`.distance1`)) {
    el.style.filter = `brightness(${100-(1*7)}%)`;
    await sleep(15);
  }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function getRandomCellID() {
    let firstNumber = randomNumber(1,numberOfRows); // this should be updated to reflect change in window size - no more square display
    let secondNumber = randomNumber(1,numberOfColumns);
    if (firstNumber < 10 && secondNumber < 10) {
        return `0${firstNumber}-0${secondNumber}`;
    }
    if (firstNumber < 10 && secondNumber >= 10) {
        return `0${firstNumber}-${secondNumber}`;
    }
    if (firstNumber >= 10 && secondNumber < 10) {
        return `${firstNumber}-0${secondNumber}`;
    }
    if (firstNumber >= 10 && secondNumber >= 10) {
        return `${firstNumber}-${secondNumber}`;
    }
    // return `${parseInt(firstNumber)}-${parseInt(secondNumber)}`;
}

// parseInt

// could set a radius around the fire, and anything outside that radius (got by > distance), has the day/night dimming/brightening cycle so it doesn't show up close to the fire

function generateTrees() {
    let randomCell = document.getElementById(`${getRandomCellID()}`);
    // should check if it is within set distance radius of origin, and if yes, skip placing start of tree there
    // maybe if distance < 7?
}

let sparkleSubCells = [];

setInterval(sparkle, 200);

// just need to get the number of

let totalCells = numberOfRows * numberOfColumns;



async function sparkle() {
    // the speed of this is impacted by ratio of width/height, since there are fewer random cell possibilities in a smaller grid
    // I like the speed that it goes when screen is like half width - how to calculate what it should be set to for about this speed?
    //
    // we need like a "target number" - something that has the speed right
    // and we get it by multiplying the chance number by the total cells
    // x = 1500
    // c*t = x
    // c*t = 1500
    // c = 500
    // t = 3

    // 3000
    // 500
    // 6

    // 9000
    // 500
    // 18

    // could also just do this with setting the chance number with a case statement based on total number of cells
    // e.g. if cells > 500 && cells < 1000, chance == x. if cells > 1000 && cells < 1500, chance == y

    if (randomNumber(0,1000) <= 500) { //this is chance of it running every 100 ms
        return;
    };

    sparkleCounter += 1;

    let randomCell = document.getElementById(`${getRandomCellID()}`);

    // if ((parseInt((randomCell.id).substring(0,2)) == originRow) && (parseInt((randomCell.id).slice(-2)) == originColumn)) {
    //   return;
    // }; // checks if randomeCell is the origin cell, and ignores it if so, so it doesn't overwrite the fire

    // console.log(randomCell.classList);
    //
    if (randomCell.classList.contains("originCell")){
      return;
    };

    randomCell.classList.add('sparkleCell');
    // randomCell.style.filter = "brightness(100%)"
    let randomCellStoredColor = randomCell.style.backgroundColor;
    // console.log(randomCellStoredColor);


    for (let i = 0; i < 3; i++) {
        let sparkleCellRow = document.createElement('div');
        randomCell.appendChild(sparkleCellRow);
        sparkleCellRow.classList.add(`sparkleCellRow`);
        for (let j = 0; j < 3; j++) {
            let sparkleCellSubCell = document.createElement('div');
            sparkleCellRow.appendChild(sparkleCellSubCell);
            sparkleCellSubCell.classList.add(`sparkleCellSubCell`,`sparkleCounter${sparkleCounter}`,`sparkleCellSubCell${i+1}${j+1}`);
            // console.log(`sparkleCellSubCell${i+1}${j+1}`);
            // sparkleCellSubCell.append("*");
        }
    }
    let sparklePatternArray = setSparklePatternOption1();
    let startingPink = getRandomPink(); // try having it be a redder or deeper color closer to the fire, more washed out further away
    let sparkleSubCells = document.querySelectorAll(`.sparkleCounter${sparkleCounter}`).forEach(async (el) => {
        // the waiting portion isn't working
        if (el.classList.contains(`sparkleCellSubCell${sparklePatternArray[0]}3`) && el.classList.contains(`sparkleCounter${sparkleCounter}`)) {
            el.style.color = `${startingPink}`;
            el.textContent = "*";
        }
        await sleep(250)
        // removeAllChildNodes(el);
        if (el.classList.contains(`sparkleCellSubCell${sparklePatternArray[1]}2`) && el.classList.contains(`sparkleCounter${sparkleCounter}`)) {
            el.style.color = `${startingPink}`;
            el.textContent = "*";
        }
        await sleep(250)
        // removeAllChildNodes(el);
        if (el.classList.contains(`sparkleCellSubCell${sparklePatternArray[2]}1`) && el.classList.contains(`sparkleCounter${sparkleCounter}`)) {
            el.style.color = `${startingPink}`;
            el.textContent = "*";
        }
        // await sleep(500)
    });

    await sleep(2500); // set to 10000 when not testing

    removeAllChildNodes(randomCell);

    // randomCell.style.filter = randomCellStoredBrightness;


    randomCell.classList.remove('sparkleCell');
}

function setSparklePatternOption1(){ // sets the pattern from bottom to top of the sparkleSubCells
    bottomRow = randomNumber(1,3);
    if (bottomRow == 1){
        middleRow = randomNumber(1,2);
        if (middleRow == 1) {
            topRow = randomNumber(1,2);
        }
        if (middleRow == 2) {
            topRow = randomNumber(1,3);
        }
    }
    if (bottomRow == 2){
        middleRow = randomNumber(1,3);
        if (middleRow == 1){
            topRow = randomNumber(1,2);
        }
        if (middleRow == 2){
            topRow = randomNumber(1,3);
        }
        if (middleRow == 3){
            topRow = randomNumber(2,3);
        }
    }
    if (bottomRow == 3) {
        middleRow = randomNumber(2,3);
        if (middleRow == 2){
            topRow = randomNumber(1,3);
        }
        if (middleRow == 3){
            topRow = randomNumber(2,3);
        }
    }
    return [bottomRow,middleRow,topRow];
}

function setSparkleBrightness() {

}

const pondColorArray = [`#007AB8`, `#0582CA`, `#006494`, `#005A8F`, `#176999`];

function getAdjacentCells(cell) {
  let cellID = cell.id;
  let cellRow = parseInt(cellID.substr(0,cellID.indexOf('-')));
  let cellColumn = parseInt(cellID.split(`-`)[1]);
  let topLeftCellAddress = `${cellRow-1}-${cellColumn-1}`;
  let topCenterCellAddress = `${cellRow-1}-${cellColumn}`;
  let topRightCellAddress = `${cellRow-1}-${cellColumn+1}`;
  let middleLeftCellAddress = `${cellRow}-${cellColumn-1}`;
  let middleRightCellAddress = `${cellRow}-${cellColumn+1}`;
  let bottomLeftCellAddress = `${cellRow+1}-${cellColumn-1}`;
  let bottomCenterCellAddress = `${cellRow+1}-${cellColumn}`;
  let bottomRightCellAddress = `${cellRow+1}-${cellColumn+1}`;
}



function getRandomAdjacentAndDiagonalCellAddress(cell) {

  let cellID = cell.id;
  let cellRow = parseInt(cellID.substr(0,cellID.indexOf('-')));
  let cellColumn = parseInt(cellID.split(`-`)[1]);

  let initialOptions = [];

  let topLeftCellAddress = `${cellRow-1}-${cellColumn-1}`;
  initialOptions.push(topLeftCellAddress);
  let topCenterCellAddress = `${cellRow-1}-${cellColumn}`;
  initialOptions.push(topCenterCellAddress);
  let topRightCellAddress = `${cellRow-1}-${cellColumn+1}`;
  initialOptions.push(topRightCellAddress);
  let middleLeftCellAddress = `${cellRow}-${cellColumn-1}`;
  initialOptions.push(middleLeftCellAddress);
  let middleRightCellAddress = `${cellRow}-${cellColumn+1}`;
  initialOptions.push(middleRightCellAddress);
  let bottomLeftCellAddress = `${cellRow+1}-${cellColumn-1}`;
  initialOptions.push(bottomLeftCellAddress);
  let bottomCenterCellAddress = `${cellRow+1}-${cellColumn}`;
  initialOptions.push(bottomCenterCellAddress);
  let bottomRightCellAddress = `${cellRow+1}-${cellColumn+1}`;
  initialOptions.push(bottomRightCellAddress);
  let address = ``;

  let viableOptions = [];

  for (let i = 0; i <= initialOptions.length-1; i++) {
    if (
      (parseInt(initialOptions[i].substr(0,initialOptions[i].indexOf('-'))) >= 1) &&
      (parseInt(initialOptions[i].substr(0,initialOptions[i].indexOf('-'))) <= numberOfRows) &&
      (parseInt(initialOptions[i].split(`-`)[1]) >= 1) &&
      (parseInt(initialOptions[i].split(`-`)[1]) <= numberOfColumns)
    ) {
      viableOptions.push(initialOptions[i]);
    };
  };
  //above checks if cell exists/is within the boundaries of the map

  address = viableOptions[randomNumber(0,viableOptions.length-1)];

  let firstNumber = parseInt(address.substr(0,address.indexOf('-')));
  let secondNumber = parseInt(address.split(`-`)[1]);

  if (firstNumber < 10 && secondNumber < 10) {
      return `0${firstNumber}-0${secondNumber}`;
  }
  if (firstNumber < 10 && secondNumber >= 10) {
      return `0${firstNumber}-${secondNumber}`;
  }
  if (firstNumber >= 10 && secondNumber < 10) {
      return `${firstNumber}-0${secondNumber}`;
  }
  if (firstNumber >= 10 && secondNumber >= 10) {
      return `${firstNumber}-${secondNumber}`;
  }
}

function makePond() {
    let randomCell = document.getElementById(`${getRandomCellID()}`);
    randomCell.classList.add('pondOrigin');
    randomCell.append("Pond Origin");
    setBlue = getRandomBlue();
    let pondOrigin = randomCell.id; // sets pondOrigin to the xx-yy style cell address
    let pondSize = randomNumber(2,4); // sets random pond size between two parameters
    randomCell.style.backgroundColor = `${setBlue}`;
    for (let i = 1; i <= pondSize; i++) {
      let randomAdjacentCell = document.getElementById(`${getRandomAdjacentAndDiagonalCellAddress(randomCell)}`);
      randomAdjacentCell.style.backgroundColor = `${setBlue}`;
    }

    // need to get distance from pondOrigin cell
    // set starting point, like setting random version of origin point

    // set a random width for the pond based on distance
    // have a bit of randomness to the edge pieces (like if over a certain distance, there is a 30% chance a piece is still green)
    // sparkle should change that brightness of background slightly if above water

}

function setRiverStart() {
    // set starting pixels by
    // 1. picking the starting side
    // 2. randomly picking the left (or top, depending on if start is side or top/bottom) square and selecting other square based on that
    // 3. setting the path - this wouid be based on picking one of the adjacent squares (that isn't to the right because that's for width), and
    // then expanding until it hits another wall (check by the address of each cell, and it's hit a wall when either the x or y is over the max)
}

// const dayNightButton = document.getElementById("DayNightCycleButton");
// dayNightButton.addEventListener("click", dayNightCycle)

let dayTime = false;
let nightTime = true;

function dayNightCycle() {
    if (nightTime) {
        transitionToDayTime();
    };
    if (dayTime) {
        transitionToNightTime();
    };

// async function dayNightCycle() {
//     let cells = document.querySelectorAll(`.cell`).forEach(async (el) => {
//         for (let i = 0; i <= 100; i++) {
//             el.style.filter = `brightness(${parseInt(el.style.filter.split('(').pop().split('%')[0])+1}%)`;
//             i += 1;
//             // await sleep (100000000);
//         }
//     })
// }
}

let brightnessLimit = 75;

let dayNightCycleSpeed = 500; //set to 500 for testing, 3000 for normal

function transitionToDayTime() {
    dayTime = true;
    nightTime = false;
    let fullGrid = document.getElementById(`gridContainer`);
    let cells = document.querySelectorAll(`.cell`).forEach(async (el) => {
      for (let i = 0; i < 10; i++) {
        if ((parseInt(el.style.filter.split('(').pop().split('%')[0])+(i*1)) >= brightnessLimit){
          el.style.filter = `brightness(${brightnessLimit}%)`;
        } else {
          el.style.filter = `brightness(${parseInt(el.style.filter.split('(').pop().split('%')[0])+(i*1)}%)`;
        };
        await sleep(dayNightCycleSpeed); //increase this to slow down day/night cycle - could be cool to set this as a variable that can change depending on something user does
      };
    });
};

function transitionToNightTime() {
    dayTime = false;
    nightTime = true;
};


makeGrid(numberOfRows,numberOfColumns);
