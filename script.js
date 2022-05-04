// narrative - starts at night, brightens to day after some time, dims back down, regenerates the background as something different, which is revealed at day
// as a mechanic, you could 'spend' to modify things for next generation (like greater chance of x appearing, new appearance possibilities)


// things to fix:

//running makePond repeatedly, and with speed increasing each time, gives a cool flooding effect

// I think fewer trees but bigger

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

let numberOfRows = minOfRowsOrColumns;
let numberOfColumns = minOfRowsOrColumns;

let subCellColorMap = new Map();

//sets the rows and columns to be a square, smaller than view window

// let numberOfRows = maxOfRowsOrColumns;
// let numberOfColumns = maxOfRowsOrColumns;

//sets the rows and columns to be a square, larger than view window.

// let numberOfRows = (Math.floor(documentHeight / 30));
// let numberOfColumns = (Math.floor(documentWidth / 30));

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
    cell.classList.add('dAssigned');
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
    setTrailStartAndEndCells();
    setTrailPath();
    makePond();
    generateTrees();
    placeRocks();
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

function getRowIntegerFromID(cell){
  return parseInt(cell.substr(0,cell.indexOf('-')),10);
};

function getColumnIntegerFromID(cell) {
  return parseInt(cell.toString().split(`-`)[1], 10);
}


gridContainer.addEventListener('click', (e) => {
    if (hasBeenClicked == true) {
        return;
    }
    hasBeenClicked = true;
 // need to adjust code below so pond doesn't get overwritten
    let treeSubCells = document.querySelectorAll(`.treeCellSubCell`);
    let treeSubCellArray = [];
    for (let t = 0; t <= treeSubCells.length-1; t++){
       //this is where i need parent cell distance
     treeSubCellArray.push(treeSubCells[t]);
    };

    let cells = document.querySelectorAll(`.cell`).forEach(async (el) => {
        setDistanceFromOrigin(el);
        createCloseCellsArray(el);

        if (el.classList.contains(`treeCell`)){
          // console.log(el.id);
            // console.log(el.children);
          let treeCellClassArray = el.classList;
          let treeCellDistance = findDistanceFromClassList(treeCellClassArray);

          for (let i = 1; i <= 3; i++){
            for (let j = 1; j <= 3; j++){
              let subCellID = document.getElementById(`${el.id}-s${i}${j}`)
              subCellID.classList.add(treeCellDistance);

            }
          }
        }

        if (el.classList.contains(`rockCell`)){
          // console.log(el.id);
            // console.log(el.children);
          let rockCellClassArray = el.classList;
          let rockCellDistance = findDistanceFromClassList(rockCellClassArray);

          for (let i = 1; i <= 3; i++){
            for (let j = 1; j <= 3; j++){
              let subCellID = document.getElementById(`${el.id}-s${i}${j}`)
              subCellID.classList.add(rockCellDistance);

            }
          }
        }

        if (el.classList.contains(`trailCell`)){
          // console.log(el.id);
            // console.log(el.children);
          let trailCellClassArray = el.classList;
          let trailCellDistance = findDistanceFromClassList(trailCellClassArray);

          for (let i = 1; i <= 3; i++){
            for (let j = 1; j <= 3; j++){
              let subCellID = document.getElementById(`${el.id}-s${i}${j}`)
              subCellID.classList.add(trailCellDistance);

            }
          }
        }


    });

    let cells2 = document.querySelectorAll(`.cell`).forEach(async (el) => {
      for (let i = 0; i <= getFurthestDistance(); i++) {
          if (el.classList.contains(`.distance0`)) {
              el.innerHTML = (String.fromCodePoint(0x1F525));
              el.style.fontSize = 'x-large';
              el.style.textAlign = 'center';
          }
          if (el.classList.contains(`.distance${i}`)) {
              if ((el.classList.contains(`pondCell`) == false) && (el.classList.contains(`trailCell`) == false)) {
                setGreen = getRandomGreen();
                el.style.backgroundColor = `${setGreen}`;
              };

              if (100-(i*7) < 0) { // the number multiplied by i has to be the same as the number multiplied by i in other part of if/else statement
                el.style.filter = `brightness(0%)`
                    // above option sets brightness to zero if above a certain distance, but makes the sparkle text disappear after set distance
              } else {
                  el.style.filter = `brightness(${100-(i*7)}%)`; // EDIT THE number after i * to adjust size fof light, bigger number = smaller circle
              }
          }


          if (el.classList.contains(`treeCell`) && (el.classList.contains(`.distance${i}`))){

            for (let i = 1; i <= 3; i++){
              for (let j = 1; j <= 3; j++){
                let subCellID = document.getElementById(`${el.id}-s${i}${j}`)
                subCellID.style.filter = `brightness(0%)`
                if (100-(i*7) < 0) { // the number multiplied by i has to be the same as the number multiplied by i in other part of if/else statement
                  subCellID.style.filter = `brightness(0%)`
                      // above option sets brightness to zero if above a certain distance, but makes the sparkle text disappear after set distance
                } else {
                    subCellID.style.filter = `brightness(${100-(i*2)}%)`; // EDIT THE number after i * to adjust size fof light, bigger number = smaller circle
                }
                // subCellID.style.filter = cellBrightness;

              }
            }
          }

          if (el.classList.contains(`rockCell`) && (el.classList.contains(`.distance${i}`))){

            for (let i = 1; i <= 3; i++){
              for (let j = 1; j <= 3; j++){
                let subCellID = document.getElementById(`${el.id}-s${i}${j}`)
                subCellID.style.filter = `brightness(0%)`
                if (100-(i*7) < 0) { // the number multiplied by i has to be the same as the number multiplied by i in other part of if/else statement
                  subCellID.style.filter = `brightness(0%)`
                      // above option sets brightness to zero if above a certain distance, but makes the sparkle text disappear after set distance
                } else {
                    subCellID.style.filter = `brightness(${100-(i*2)}%)`; // EDIT THE number after i * to adjust size fof light, bigger number = smaller circle
                }
                // subCellID.style.filter = cellBrightness;

              }
            }
          }

          if (el.classList.contains(`trailCell`) && (el.classList.contains(`.distance${i}`))){

            for (let i = 1; i <= 3; i++){
              for (let j = 1; j <= 3; j++){
                let subCellID = document.getElementById(`${el.id}-s${i}${j}`)
                subCellID.style.filter = `brightness(0%)`
                if (100-(i*7) < 0) { // the number multiplied by i has to be the same as the number multiplied by i in other part of if/else statement
                  subCellID.style.filter = `brightness(0%)`
                      // above option sets brightness to zero if above a certain distance, but makes the sparkle text disappear after set distance
                } else {
                    subCellID.style.filter = `brightness(${100-(i*2)}%)`; // EDIT THE number after i * to adjust size fof light, bigger number = smaller circle
                }
                // subCellID.style.filter = cellBrightness;

              }
            }
          }

      await sleep(15); // make sleep start slow and speed up as it goes?
      }
    });

// what about breaking up the foreach function below into two functions? One sets the distance and creates the closeCellArray and adds the distance to the tree cells, and then the next foreach loop does everything else?



        // console.log(treeSubCellArray);
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


let sparkleSubCells = [];

setInterval(sparkle, 200);

// just need to get the number of

let totalCells = numberOfRows * numberOfColumns;



async function sparkle() {

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

    if (randomCell.classList.contains(`treeCellBottom`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellMiddle`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellTop`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellTipTop`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellTipTopLeft`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellTipTopRight`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellMiddleLeft`)){
      return;
    };

    if (randomCell.classList.contains(`treeCellMiddleRight`)){
      return;
    };

    if (randomCell.classList.contains(`treeCell`)){
      return;
    };

    if (randomCell.classList.contains(`rockCell`)){
      return;
    }

    if (randomCell.classList.contains(`trailCell`)){
      return;
    }

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

function getRandomAdjacentCellAddress(cell) {
  let cellID = cell.id;
  let cellRow = parseInt(cellID.substr(0,cellID.indexOf('-')));
  let cellColumn = parseInt(cellID.split(`-`)[1]);

  let initialOptions = [];

  let topCenterCellAddress = `${cellRow-1}-${cellColumn}`;
  initialOptions.push(topCenterCellAddress);
  let middleLeftCellAddress = `${cellRow}-${cellColumn-1}`;
  initialOptions.push(middleLeftCellAddress);
  let middleRightCellAddress = `${cellRow}-${cellColumn+1}`;
  initialOptions.push(middleRightCellAddress);
  let bottomCenterCellAddress = `${cellRow+1}-${cellColumn}`;
  initialOptions.push(bottomCenterCellAddress);

  let viableOptions = [];

  for (let i = 0; i <= initialOptions.length-1; i++) {
    if (
      (getRowIntegerFromID(initialOptions[i]) >= 1) &&
      (getRowIntegerFromID(initialOptions[i]) <= numberOfRows) &&
      (getColumnIntegerFromID(initialOptions[i]) >= 1) &&
      (getColumnIntegerFromID(initialOptions[i]) <= numberOfColumns)
    )
     {
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
};


function getCellAboveID(cell){
  let initialCellID = cell.id;
  let initialCellRow = getRowIntegerFromID(initialCellID);
  let initialCellColumn = getColumnIntegerFromID(initialCellID);

  let topCenterCellAddress = `${initialCellRow-1}-${initialCellColumn}`;

  let address = topCenterCellAddress;

  let firstNumber = getRowIntegerFromID(address);
  let secondNumber = getColumnIntegerFromID(address);

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

};

function getCellLeftID(cell){
  let initialCellID = cell.id;
  let initialCellRow = getRowIntegerFromID(initialCellID);
  let initialCellColumn = getColumnIntegerFromID(initialCellID);

  let topCenterCellAddress = `${initialCellRow}-${initialCellColumn-1}`;

  let address = topCenterCellAddress;

  let firstNumber = getRowIntegerFromID(address);
  let secondNumber = getColumnIntegerFromID(address);

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

};

function getCellRightID(cell){
  let initialCellID = cell.id;
  let initialCellRow = getRowIntegerFromID(initialCellID);
  let initialCellColumn = getColumnIntegerFromID(initialCellID);

  let topCenterCellAddress = `${initialCellRow}-${initialCellColumn+1}`;

  let address = topCenterCellAddress;

  let firstNumber = getRowIntegerFromID(address);
  let secondNumber = getColumnIntegerFromID(address);

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

};

function getCellBelowID(cell){
  let initialCellID = cell.id;
  let initialCellRow = getRowIntegerFromID(initialCellID);
  let initialCellColumn = getColumnIntegerFromID(initialCellID);

  let topCenterCellAddress = `${initialCellRow+1}-${initialCellColumn}`;

  let address = topCenterCellAddress;

  let firstNumber = getRowIntegerFromID(address);
  let secondNumber = getColumnIntegerFromID(address);

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

};

function getRandomAdjacentAndDiagonalCellAddress(cell) {

  let cellID = cell.id;
  let cellRow = getRowIntegerFromID(cell);
  let cellColumn = getColumnIntegerFromID(cell);

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
      (getRowIntegerFromID(cell) >= 1) &&
      (getRowIntegerFromID(cell) <= numberOfRows) &&
      (getColumnIntegerFromID(cell) >= 1) &&
      (getColumnIntegerFromID(cell) <= numberOfColumns)
    ) {
      viableOptions.push(initialOptions[i]);
    };
  };
  //above checks if cell exists/is within the boundaries of the map

  address = viableOptions[randomNumber(0,viableOptions.length-1)];

  let firstNumber = getRowIntegerFromID(cell);
  let secondNumber = getColumnIntegerFromID(cell);

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

function getRandomPondCellAddress() {
  let pondCells = document.getElementsByClassName("pondCell");
  let pondCellAddressArray = [];
  for (let i = 0; i <= pondCells.length-1; i++) {
    pondCellAddressArray.push(pondCells[i].id);
  };
  return pondCellAddressArray[randomNumber(0,pondCellAddressArray.length-1)];
};

function makePond() {
    let randomCell = document.getElementById(`${getRandomCellID()}`);
    randomCell.classList.add('pondOrigin');
    randomCell.classList.add(`pondCell`);
    // randomCell.append("Pond Origin");
    let pondOrigin = randomCell.id; // sets pondOrigin to the xx-yy style cell address
    let pondSize = numberOfRows*randomNumber(25,40); // sets random pond size between two parameters
    // pondSize needs to be relative to totalCells (as like a percentage)
    randomCell.style.backgroundColor = `${getRandomBlue()}`;
    randomCell.style.filter = `brightness(0%)`
    for (let i = 1; i <= 4; i++) {
      let randomAdjacentCell = document.getElementById(`${getRandomAdjacentCellAddress(randomCell)}`);
      randomAdjacentCell.classList.add(`pondCell`);
      randomAdjacentCell.style.filter = `brightness(0%)`
      randomAdjacentCell.style.backgroundColor = `${getRandomBlue()}`;
    };

    for (let i = 0; i <= pondSize; i++){
      let randomPondCell = document.getElementById(`${getRandomPondCellAddress()}`);
      let randomAdjacentToPondCell = document.getElementById(`${getRandomAdjacentCellAddress(randomPondCell)}`);
      randomAdjacentToPondCell.classList.add(`pondCell`);
      randomAdjacentToPondCell.style.filter = `brightness(0%)`
      randomAdjacentToPondCell.style.backgroundColor = `${getRandomBlue()}`;
    };

    // need to get distance from pondOrigin cell
    // set starting point, like setting random version of origin point

    // set a random width for the pond based on distance
    // have a bit of randomness to the edge pieces (like if over a certain distance, there is a 30% chance a piece is still green)
    // sparkle should change that brightness of background slightly if above water

}

let treeTrunkColorArray = [`#B08968`,`#7F5539`,`#9C6644`];

function getRandomTreeTrunkColor() {
  return treeTrunkColorArray[Math.floor(Math.random() * treeTrunkColorArray.length)];
}

function setTreePattern() {
  return randomNumber(1,3);
}

let treeCounter = 0;

function findDistanceFromClassList(array) {
  for (let i = 0; i <= array.length-1; i++){
    if (array[i].includes("distance")) {
      return array[i];
    };
  };
};

// function getRandomElementsFromArray(array,n) {
//   let usedNumbers = [];
//   let returnArray = [];
//   for (let i = 0; i <= n ; i++){
//     let random = randomNumber(0,array.length-1);
//     if usedNumbers.includes(random){
//
//     }
//     returnArray.push(array[random]);
//     usedNumbers.push(random);
//   }
//   return returnArray;
// }

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let treeCellsArray = [];

let possibleTreeCells = [];

let possibleTreeZones = [`ttl`,`tt`,`ttr`,
                    `tl`,`t`,`tr`,
                    `ml`,`m`,`mr`,`b`];

let possibleSubCells = ["11", "21", "31",
                    "12", "22", "32",
                    "13", "23", "33"];

function getPossibleTreeCells(treezones,subcells){
  for (let i = 0; i <= treezones.length-1; i++){
    for (let j = 0; j <= subcells.length-1; j++){
      possibleTreeCells.push(`${subcells[j]}-${treezones[i]}`)
    }
  }
}

getPossibleTreeCells(possibleTreeZones,possibleSubCells);

function getOppositeCells(array){
  let oppositeArray = [];
  for (let i = 0; i <= possibleTreeCells.length-1; i++){
    if (array.includes(possibleTreeCells[i])){
    } else {
      oppositeArray.push(possibleTreeCells[i]);
    }
  }
  return oppositeArray;
}

let trunkPattern1 = [`11-m`,`12-m`,`13-m`,`22-m`,`23-m`,`11-b`,`12-b`,`13-b`,`21-b`,`22-b`,`23-b`];

let trunkPattern1Opposite = getOppositeCells(trunkPattern1);

let leafPattern1 = [`33-ttl`,`12-tt`,`22-tt`,`32-tt`,`13-tt`,`23-tt`,`33-tt`,`13-ttr`,`22-tl`,`31-tl`,`32-tl`,`33-tl`,`11-t`,`21-t`,`31-t`,`12-t`,`22-t`,`32-t`,`23-t`,`11-tr`,`21-tr`,`12-tr`,`22-tr`,`23-tr`,`33-tr`,`21-m`,`31-mr`,`32-mr`,`13-t`,`33-t`,`13-tr`,`21-mr`,`22-mr`,`33-mr`,`31-ml`];

let leafPattern1Opposite = getOppositeCells(leafPattern1);

let trunkPattern2 = [`31-b`,`32-b`,`33-b`,`32-m`,`33-m`,`22-m`,`13-mr`];

let trunkPattern2Opposite = getOppositeCells(trunkPattern2);

let trunkPattern3 = [`23-b`,`22-b`,`21-b`,`23-m`,`13-m`,`33-ml`,`32-ml`,`22-m`,`32-m`,`12-mr`,`21-m`,`31-mr`,`22-ml`,`22-mr`,`21-mr`];

let trunkPattern4 = [`23-b`,`22-b`,`21-b`,`23-m`];

let trunkPattern4Opposite = getOppositeCells(trunkPattern4);

let leafPattern4 = [`23-tt`,`33-tl`,`11-t`,`12-t`,`13-t`,`21-t`,`22-t`,`23-t`,`31-t`,`32-t`,`33-t`,`13-tr`,`22-ml`,`23-ml`,`31-ml`,`32-ml`,`33-ml`,`11-m`,`12-m`,`13-m`,`21-m`,`22-m`,`31-m`,`32-m`,`33-m`,`11-mr`,`12-mr`,`13-mr`,`22-mr`,`23-mr`];

let leafPattern4Opposite = getOppositeCells(leafPattern4);

let trunkPattern3Opposite = getOppositeCells(trunkPattern3);

let leafPattern2 = [`32-ttl`,`33-ttl`,`23-ttl`,`12-tt`,`21-tl`,`31-tl`,`32-tl`,`33-tl`,`11-t`,`21-t`,`12-t`,`22-t`,`13-t`,`23-t`,`33-t`,`31-ml`,`32-ml`,`11-m`,`21-m`,`31-m`,`11-mr`,`12-mr`,`23-ml`,`21-ml`,`22-ml`,`12-ml`,`31-t`];

let leafPattern2Opposite = getOppositeCells(leafPattern2);

let leafPattern3 = [`12-ml`,`11-ml`,`21-ml`,`31-ml`,`23-tl`,`33-tl`,`13-t`,`23-t`,`33-t`,`22-t`,`32-t`,`12-tr`,`13-tr`,`21-tr`,`22-tr`,`23-tr`,`32-tr`,`33-tr`];

let leafPattern3Opposite = getOppositeCells(leafPattern3);

let arrayOfTreePatterns = [leafPattern1, leafPattern2, leafPattern3];

let leafMainCellArray = [`ttl`,`tt`,`ttr`,`tl`,`t`,`tr`,`ml`,`m`,`mr`];

let trailPattern1 = [`11`,`12`,`13`,`21`,`22`,`23`,`31`,`32`,`33`];

let trailPattern1Opposite = [];

const leafColorArray = [`#F7D1CD`,`#E8C2CA`,`#D1B3C4`,`#f6bd60`,`#e26d5c`,`#ffaa00`];

function getRandomLeafColor() {
  return leafColorArray[Math.floor(Math.random() * leafColorArray.length)];
}

function getChanceOfEachTreePattern() {
  let randomChance = randomNumber(1,100);
  if (randomChance < 25){
    return 1;
  } else if (randomChance < 60) {
    return 2;
  } else if (randomChance < 75) {
    return 3;
  } else {
    return 4;
  }
}

function generateTrees() {
  for (let k = numberOfRows; k >= 4; k--){ //update to numberOfRows once working on one line
  // for (let k = 4; k <= numberOfRows; k++){
      // let chanceOfTree = 30;
      let initialCellOptions = document.getElementsByClassName(`row${k}`);

      initialCellOptions = Array.from(initialCellOptions);

      let cellOptionsIDArray = [];

      for (let o = 0; o <= initialCellOptions.length-1; o++){
        if (
          (initialCellOptions[o].classList.contains("pondCell") == false) &&
          (initialCellOptions[o].classList.contains("originCell") == false) &&
          (getColumnIntegerFromID(initialCellOptions[o].id) > 1) &&
          (getColumnIntegerFromID(initialCellOptions[o].id) < numberOfColumns) &&
          (initialCellOptions[o].classList.contains("trailCell") == false)
           // && (getColumnIntegerFromID(initialCellOptions[o].id) % 2 == 0)
        ) {
        cellOptionsIDArray.push(initialCellOptions[o].id)
      };
      }; //currently working

      let randomSelectionOfCellOptions = [];
      let numberOfCellsToSelect = (parseInt(cellOptionsIDArray.length-1)*.25);

      let shuffledCellOptionsIDArray = shuffleArray(cellOptionsIDArray);

      // cellOptionsIDArray.sort(() => .5 - Math.random());

      randomSelectionOfCellOptions = shuffledCellOptionsIDArray.slice(0,numberOfCellsToSelect);

      randomSelectionOfCellOptions.sort(function(a, b){return a-b});

      let treePattern = 1;

      for (let x = 0; x <= randomSelectionOfCellOptions.length-1; x++){
        treePattern = getChanceOfEachTreePattern();

        let bottomTreeCell = document.getElementById(`${randomSelectionOfCellOptions[x]}`);

        bottomTreeCellClassArray = bottomTreeCell.classList;
        treeCellDistance = findDistanceFromClassList(bottomTreeCellClassArray);


        treeCounter += 1;

        bottomTreeCell.classList.add(`treeCell`,`treeCellBottom`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);

        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            bottomTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${bottomTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellBottom`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-b`,`treePattern${treePattern}`);
            }
        }

        treeCellsArray.push(bottomTreeCell.id);

        let middleTreeCell;


        middleTreeCell = document.getElementById(getCellAboveID(bottomTreeCell));
        middleTreeCell.classList.add(`treeCell`,`treeCellMiddle`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            middleTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${middleTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellMiddle`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-m`,`treePattern${treePattern}`);
              }
        }

        treeCellsArray.push(middleTreeCell.id);

        let middleLeftTreeCell;

        middleLeftTreeCell = document.getElementById(getCellLeftID(middleTreeCell));
        middleLeftTreeCell.classList.add(`treeCell`,`treeCellMiddleLeft`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            middleLeftTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${middleLeftTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellMiddleLeft`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-ml`,`treePattern${treePattern}`);
              }
        }

        treeCellsArray.push(middleLeftTreeCell.id);

        let middleRightTreeCell;

        middleRightTreeCell = document.getElementById(getCellRightID(middleTreeCell));
        middleRightTreeCell.classList.add(`treeCell`,`treeCellMiddleRight`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            middleRightTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${middleRightTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellMiddleRight`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-mr`,`treePattern${treePattern}`);
              }
        }

        treeCellsArray.push(middleRightTreeCell.id);

        let topTreeCell;

        topTreeCell = document.getElementById(getCellAboveID(middleTreeCell));
        topTreeCell.classList.add(`treeCell`,`treeCellTop`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            topTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${topTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellTop`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-t`,`treePattern${treePattern}`);

              }
          }

        treeCellsArray.push(topTreeCell.id);

        let topLeftTreeCell;

        topLeftTreeCell = document.getElementById(getCellLeftID(topTreeCell));
        topLeftTreeCell.classList.add(`treeCell`,`treeCellTopRight`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            topLeftTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${topLeftTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellTopLeft`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-tl`,`treePattern${treePattern}`);
                        // need to add distance for lighting to work
                        // console.log(`sparkleCellSubCell${i+1}${j+1}`);
                        // sparkleCellSubCell.append("*");
                }
          }

          treeCellsArray.push(topLeftTreeCell.id);


          let topRightTreeCell;

          topRightTreeCell = document.getElementById(getCellRightID(topTreeCell));
          topRightTreeCell.classList.add(`treeCell`,`treeCellTopRight`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
          for (let i = 0; i < 3; i++) {
              let treeCellRow = document.createElement('div');
              topRightTreeCell.appendChild(treeCellRow);
              treeCellRow.classList.add(`treeCellRow`);

              for (let j = 0; j < 3; j++) {
                  let treeCellSubCell = document.createElement('div');
                  let parentCellDistance = "";
                  treeCellRow.appendChild(treeCellSubCell);
                  treeCellSubCell.setAttribute(`id`,`${topRightTreeCell.id}-s${i+1}${j+1}`);
                  treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellTopRight`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-tr`,`treePattern${treePattern}`);
                      // need to add distance for lighting to work
                      // console.log(`sparkleCellSubCell${i+1}${j+1}`);
                      // sparkleCellSubCell.append("*");
                }
            }

        treeCellsArray.push(topRightTreeCell.id);


        let tipTopTreeCell;

        tipTopTreeCell = document.getElementById(getCellAboveID(topTreeCell));
        tipTopTreeCell.classList.add(`treeCell`,`treeCellTipTop`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            tipTopTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${tipTopTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellTipTop`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-tt`,`treePattern${treePattern}`);

              }
          }

        treeCellsArray.push(tipTopTreeCell.id);

        let tipTopLeftTreeCell;

        tipTopLeftTreeCell = document.getElementById(getCellLeftID(tipTopTreeCell));
        tipTopLeftTreeCell.classList.add(`treeCell`,`treeCellTipTopLeft`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            tipTopLeftTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${tipTopLeftTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellTipTopLeft`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-ttl`,`treePattern${treePattern}`);

              }
          }

        treeCellsArray.push(tipTopLeftTreeCell.id);

        let tipTopRightTreeCell;

        tipTopRightTreeCell = document.getElementById(getCellRightID(tipTopTreeCell));
        tipTopRightTreeCell.classList.add(`treeCell`,`treeCellTipTopRight`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
        for (let i = 0; i < 3; i++) {
            let treeCellRow = document.createElement('div');
            tipTopRightTreeCell.appendChild(treeCellRow);
            treeCellRow.classList.add(`treeCellRow`);

            for (let j = 0; j < 3; j++) {
                let treeCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                treeCellRow.appendChild(treeCellSubCell);
                treeCellSubCell.setAttribute(`id`,`${tipTopRightTreeCell.id}-s${i+1}${j+1}`);
                treeCellSubCell.classList.add( `treeCellSubCell`,`treeCellTipTopRight`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-ttr`,`treePattern${treePattern}`);

              }
          }

        treeCellsArray.push(tipTopRightTreeCell.id);


      }

      // console.log(`tree pattern for tree ${treeCounter} is ${treePattern}`);

      let trunkColor = `${getRandomTreeTrunkColor()}`;
      let leafColor = `${getRandomLeafColor()}`;

      let treeCellSubCells1= document.querySelectorAll(`.treePattern1`).forEach((el) => {
            for (let p = 0; p <= leafPattern1.length-1; p++){
              if (
                (el.classList.contains(`treeCellSubCell${leafPattern1[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
              ) {
                el.style.backgroundColor = leafColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${leafColor}`);
                }

              }
            }

            for (let t = 0; t <= trunkPattern1.length-1; t++){
              if ((el.classList.contains(`treeCellSubCell${trunkPattern1[t]}`)) && (el.classList.contains(`colorAssigned`) == false)) {
                el.style.backgroundColor = trunkColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${trunkColor}`);
                }

              }
            }

            for (let x = 0; x <= leafPattern1Opposite.length-1; x++){
              if (el.classList.contains(`treeCellSubCell${leafPattern1Opposite[x]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }

            for (let y = 0; y <= trunkPattern1Opposite.length-1; y++){
              if (el.classList.contains(`treeCellSubCell${trunkPattern1Opposite[y]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }
      });

      let treeCellSubCells2= document.querySelectorAll(`.treePattern2`).forEach((el) => {
            for (let p = 0; p <= leafPattern2.length-1; p++){
              if (
                (el.classList.contains(`treeCellSubCell${leafPattern2[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
              ) {
                el.style.backgroundColor = leafColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${leafColor}`);
                }

              }
            }

            for (let t = 0; t <= trunkPattern2.length-1; t++){
              if ((el.classList.contains(`treeCellSubCell${trunkPattern2[t]}`)) && (el.classList.contains(`colorAssigned`) == false)) {
                el.style.backgroundColor = trunkColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${trunkColor}`);
                }

              }
            }

            for (let x = 0; x <= leafPattern2Opposite.length-1; x++){
              if (el.classList.contains(`treeCellSubCell${leafPattern2Opposite[x]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }

            for (let y = 0; y <= trunkPattern2Opposite.length-1; y++){
              if (el.classList.contains(`treeCellSubCell${trunkPattern2Opposite[y]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }
      });

      let treeCellSubCells3= document.querySelectorAll(`.treePattern3`).forEach((el) => {
            for (let p = 0; p <= leafPattern3.length-1; p++){
              if (
                (el.classList.contains(`treeCellSubCell${leafPattern3[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
              ) {
                el.style.backgroundColor = leafColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${leafColor}`);
                }

              }
            }

            for (let t = 0; t <= trunkPattern3.length-1; t++){
              if ((el.classList.contains(`treeCellSubCell${trunkPattern3[t]}`)) && (el.classList.contains(`colorAssigned`) == false)) {
                el.style.backgroundColor = trunkColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${trunkColor}`);
                }

              }
            }

            for (let x = 0; x <= leafPattern3Opposite.length-1; x++){
              if (el.classList.contains(`treeCellSubCell${leafPattern3Opposite[x]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }

            for (let y = 0; y <= trunkPattern3Opposite.length-1; y++){
              if (el.classList.contains(`treeCellSubCell${trunkPattern3Opposite[y]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }
      });

      let treeCellSubCells4= document.querySelectorAll(`.treePattern4`).forEach((el) => {
            for (let p = 0; p <= leafPattern4.length-1; p++){
              if (
                (el.classList.contains(`treeCellSubCell${leafPattern4[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
              ) {
                el.style.backgroundColor = leafColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${leafColor}`);
                }

              }
            }

            for (let t = 0; t <= trunkPattern4.length-1; t++){
              if ((el.classList.contains(`treeCellSubCell${trunkPattern4[t]}`)) && (el.classList.contains(`colorAssigned`) == false)) {
                el.style.backgroundColor = trunkColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${trunkColor}`);
                }

              }
            }

            for (let x = 0; x <= leafPattern4Opposite.length-1; x++){
              if (el.classList.contains(`treeCellSubCell${leafPattern4Opposite[x]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }

            for (let y = 0; y <= trunkPattern4Opposite.length-1; y++){
              if (el.classList.contains(`treeCellSubCell${trunkPattern4Opposite[y]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }
      });

    }
    reassignSubCellColors();
};

function reassignSubCellColors(){
  subCellColorMap.forEach(function(value,key) {
    let cellToReassign = document.getElementById(`${key}`);
    cellToReassign.style.backgroundColor = `${value}`;
    cellToReassign.classList.add(`colorAssigned`);
  })


}

// function getNonSparkleSubCells(){
//
// }

function checkForChildNodes(cell) {
  return cell.hasChildNodes();
}

function placeFlowers() {
}

let rockColorArray = [`#414833`,`#283618`];

let rockPattern1 = [`22`,`13`,`23`,`33`];

let rockPattern1Opposite = [`11`,`21`,`31`,`12`,`32`];

let rockCounter = 1;

let rockCellsArray = [];

function getRandomRockColor() {
  return rockColorArray[Math.floor(Math.random() * rockColorArray.length)];
}

function placeRocks() {
  // this should essentially function the same as the generateTrees function, but need to also check that cell has no child cells to be a viable option
  // rocks of a few different shapes and colors
  for (let k = numberOfRows-1; k >= 2; k--){ //update to numberOfRows once working on one line
  // for (let k = 4; k <= numberOfRows; k++){
      // let chanceOfTree = 30;
      let initialCellOptions = document.getElementsByClassName(`row${k}`);

      initialCellOptions = Array.from(initialCellOptions);

      let cellOptionsIDArray = [];

      for (let o = 0; o <= initialCellOptions.length-1; o++){
        if (
          (initialCellOptions[o].classList.contains("pondCell") == false) &&
          (initialCellOptions[o].classList.contains("originCell") == false) &&
          (getColumnIntegerFromID(initialCellOptions[o].id) > 1) &&
          (getColumnIntegerFromID(initialCellOptions[o].id) < numberOfColumns) && (initialCellOptions[o].hasChildNodes() == false)
           // && (getColumnIntegerFromID(initialCellOptions[o].id) % 2 == 0)
        ) {
        cellOptionsIDArray.push(initialCellOptions[o].id)
      };
      }; //currently working

      let randomSelectionOfCellOptions = [];
      let numberOfCellsToSelect = (parseInt(cellOptionsIDArray.length-1)*.1);

      let shuffledCellOptionsIDArray = shuffleArray(cellOptionsIDArray);

      // cellOptionsIDArray.sort(() => .5 - Math.random());

      randomSelectionOfCellOptions = shuffledCellOptionsIDArray.slice(0,numberOfCellsToSelect);

      randomSelectionOfCellOptions.sort(function(a, b){return a-b});

      let rockPattern = 1;

      for (let x = 0; x <= randomSelectionOfCellOptions.length-1; x++){
        rockPattern = randomNumber(1,1);

        let rockCell = document.getElementById(`${randomSelectionOfCellOptions[x]}`);

        rockCellClassArray = rockCell.classList;
        rockCellDistance = findDistanceFromClassList(rockCellClassArray);


        rockCounter += 1;

        rockCell.classList.add(`rockCell`,`rockCounter${rockCounter}`,`rockPattern${rockPattern}`);

        for (let i = 0; i < 3; i++) {
            let rockCellRow = document.createElement('div');
            rockCell.appendChild(rockCellRow);
            rockCellRow.classList.add(`rockCellRow`);

            for (let j = 0; j < 3; j++) {
                let rockCellSubCell = document.createElement('div');
                let parentCellDistance = "";
                rockCellRow.appendChild(rockCellSubCell);
                rockCellSubCell.setAttribute(`id`,`${rockCell.id}-s${i+1}${j+1}`);
                rockCellSubCell.classList.add( `rockCellSubCell`,`rockCell`,`rockCounter${rockCounter}`,`rockCellSubCell${i+1}${j+1}`,`rockPattern${rockPattern}`);
            }
        }

        rockCellsArray.push(rockCell.id);

      }

      // console.log(`tree pattern for tree ${treeCounter} is ${treePattern}`);

      let rockColor = `${getRandomRockColor()}`;

      let rockCellSubCells1= document.querySelectorAll(`.rockPattern1`).forEach((el) => {
            for (let p = 0; p <= rockPattern1.length-1; p++){
              if (
                (el.classList.contains(`rockCellSubCell${rockPattern1[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
              ) {
                el.style.backgroundColor = rockColor;
                el.style.filter = `brightness(0%)`;
                el.classList.add(`colorAssigned`);
                if(subCellColorMap.has(`${el.id}`)) {
                  // console.log("already assigned")
                } else {
                  subCellColorMap.set(`${el.id}`,`${rockColor}`);
                }

              }
            }

            for (let x = 0; x <= rockPattern1Opposite.length-1; x++){
              if (el.classList.contains(`rockCellSubCell${rockPattern1Opposite[x]}`)) {
                // el.style.backgroundColor = getRandomGreen();
                el.style.filter = `brightness(0%)`;
                // el.classList.add(`colorAssigned`);
              }
            }
      });

    }
    reassignSubCellColors();
}

let choicesArray = [];

function setTrailStartAndEndQuadrants() {
  choicesArray = [1,2,3,4,5,6,7,8]; //change back to 1 - 8 when not testing
  shuffleArray(choicesArray);

  if (choicesArray[0] == 1){
    choicesArray.splice(choicesArray.indexOf(2),1)
  } else if (choicesArray[0] == 2) {
    choicesArray.splice(choicesArray.indexOf(1),1)
  } else if (choicesArray[0] == 3) {
    choicesArray.splice(choicesArray.indexOf(4),1)
  } else if (choicesArray[0] == 4) {
    choicesArray.splice(choicesArray.indexOf(3),1)
  } else if (choicesArray[0] == 5) {
    choicesArray.splice(choicesArray.indexOf(6),1)
  } else if (choicesArray[0] == 6) {
    choicesArray.splice(choicesArray.indexOf(5),1)
  } else if (choicesArray[0] == 7) {
    choicesArray.splice(choicesArray.indexOf(8),1)
  } else if (choicesArray[0] == 8) {
    choicesArray.splice(choicesArray.indexOf(7),1)
  }
  console.log(choicesArray);
  return choicesArray.slice(0,2);
}

let trailStartEndArray = setTrailStartAndEndQuadrants();

let startingCell;
let endingCell;

function setTrailStartAndEndCells() {
  // let initialStartingCellOptions = [];
  let initialStartingCellOptionsIDArray = [];
  let initialEndingCellOptionsIDArray = [];

  let startingCellOptionsIDArray = [];
  let endingCellOptionsIDArray = [];

  let viableStartingCellArray = [];
  let viableEndingCellArray = [];

  let startingQuadrantNumber = trailStartEndArray[0];
  let endingQuadrantNumber = trailStartEndArray[1];

  if (startingQuadrantNumber == 1){ //working
    startingQuadrant = 'top-left';
    let initialStartingCellOptions = document.getElementsByClassName(`row1`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialStartingCellOptions[i].id) < (numberOfColumns/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 2) { //working
    startingQuadrant = 'top-right';
    let initialStartingCellOptions = document.getElementsByClassName(`row1`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialStartingCellOptions[i].id) > (numberOfColumns/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 3) { //working
    startingQuadrant = 'right-top';
    let initialStartingCellOptions = document.getElementsByClassName(`column${numberOfColumns}`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialStartingCellOptions[i].id) < (numberOfRows/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 4) { //working
    startingQuadrant = 'right-bottom';
    let initialStartingCellOptions = document.getElementsByClassName(`column${numberOfColumns}`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialStartingCellOptions[i].id) > (numberOfRows/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 5) { //working
    startingQuadrant = 'bottom-right';
    let initialStartingCellOptions = document.getElementsByClassName(`row${numberOfRows}`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialStartingCellOptions[i].id) > (numberOfColumns/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 6) { //working
    startingQuadrant = 'bottom-left';
    let initialStartingCellOptions = document.getElementsByClassName(`row${numberOfRows}`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialStartingCellOptions[i].id) < (numberOfColumns/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 7) { //working
    startingQuadrant = 'left-bottom';
    let initialStartingCellOptions = document.getElementsByClassName(`column1`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialStartingCellOptions[i].id) > (numberOfRows/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (startingQuadrantNumber == 8) { //working
    startingQuadrant = 'left-top';
    let initialStartingCellOptions = document.getElementsByClassName(`column1`);
    for (let i = 0; i <= initialStartingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialStartingCellOptions[i].id) < (numberOfRows/2)){
      initialStartingCellOptionsIDArray.push(initialStartingCellOptions[i].id);
      }
    }
  }

  for (let i = 0; i <= initialStartingCellOptionsIDArray.length-1; i++){
    let cell = document.getElementById(initialStartingCellOptionsIDArray[i]);
    if (
      (cell.classList.contains("pondCell") == false) &&
      (cell.classList.contains("originCell") == false) &&
      (cell.hasChildNodes() == false)
       // && (getColumnIntegerFromID(initialCellOptions[o].id) % 2 == 0)
    ) {
    viableStartingCellArray.push(cell)
    };
  };

  startingCell = viableStartingCellArray[randomNumber(0,viableStartingCellArray.length)];


  if (endingQuadrantNumber == 1){ //working
    endingQuadrant = 'top-left';
    let initialEndingCellOptions = document.getElementsByClassName(`row1`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialEndingCellOptions[i].id) < (numberOfColumns/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 2) { //working
    endingQuadrant = 'top-right';
    let initialEndingCellOptions = document.getElementsByClassName(`row1`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialEndingCellOptions[i].id) > (numberOfColumns/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 3) { //working
    endingQuadrant = 'right-top';
    let initialEndingCellOptions = document.getElementsByClassName(`column${numberOfColumns}`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialEndingCellOptions[i].id) < (numberOfRows/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 4) { //working
    endingQuadrant = 'right-bottom';
    let initialEndingCellOptions = document.getElementsByClassName(`column${numberOfColumns}`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialEndingCellOptions[i].id) > (numberOfRows/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 5) { //working
    endingQuadrant = 'bottom-right';
    let initialEndingCellOptions = document.getElementsByClassName(`row${numberOfRows}`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialEndingCellOptions[i].id) > (numberOfColumns/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 6) { //working
    endingQuadrant = 'bottom-left';
    let initialEndingCellOptions = document.getElementsByClassName(`row${numberOfRows}`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getColumnIntegerFromID(initialEndingCellOptions[i].id) < (numberOfColumns/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 7) { //working
    endingQuadrant = 'left-bottom';
    let initialEndingCellOptions = document.getElementsByClassName(`column1`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialEndingCellOptions[i].id) > (numberOfRows/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  } else if (endingQuadrantNumber == 8) { //working
    endingQuadrant = 'left-top';
    let initialEndingCellOptions = document.getElementsByClassName(`column1`);
    for (let i = 0; i <= initialEndingCellOptions.length-1; i++){
      if (getRowIntegerFromID(initialEndingCellOptions[i].id) < (numberOfRows/2)){
      initialEndingCellOptionsIDArray.push(initialEndingCellOptions[i].id);
      }
    }
    // console.log(initialStartingCellOptionsIDArray);
  }

  for (let i = 0; i <= initialEndingCellOptionsIDArray.length-1; i++){
    let cell = document.getElementById(initialEndingCellOptionsIDArray[i]);
    if (
      (cell.classList.contains("pondCell") == false) &&
      (cell.classList.contains("originCell") == false) &&
      (cell.hasChildNodes() == false)
       // && (getColumnIntegerFromID(initialCellOptions[o].id) % 2 == 0)
    ) {
    viableEndingCellArray.push(cell)
    };
  };

  endingCell = viableEndingCellArray[randomNumber(0,viableEndingCellArray.length)];

  console.log(startingQuadrant);
  console.log(startingCell);
  // console.log(endingQuadrant);
  // console.log(endingCell);
};

let trailCounter = 1;

let trailCellsArray = [];

function getArrayOfAdjacentCells(cell) {
  let returnArray = [];
  returnArray.push(getCellAboveID(cell));
  returnArray.push(getCellLeftID(cell));
  returnArray.push(getCellRightID(cell));
  returnArray.push(getCellBelowID(cell));
  return returnArray
}



function setTrailPath() {

  let startCell = document.getElementById(`${startingCell.id}`);
  startCell.classList.add(`trailStart`);
  startCell.classList.add(`trailCell`);

  startCell.style.backgroundColor = `#008080`;


  let startingSide = startingQuadrant.substr(0,startingQuadrant.indexOf(`-`));

  let startingSideSecondary = startingQuadrant.substr(startingQuadrant.indexOf(`-`) + 1);

  let startingCellColumn = getColumnIntegerFromID(startCell.id)

  let startingCellRow = getRowIntegerFromID(startCell.id)

  let startPathValue;
  let trailLength;


  let trailOptionsGenerationDirections = [`U`,`R`,`D`,`L`];

  if (startingSide == `top`){
    trailOptionsGenerationDirections.splice(trailOptionsGenerationDirections.indexOf(`U`),1);
    trailLength = numberOfRows;
  } else if (startingSide == `right`) {
    trailOptionsGenerationDirections.splice(trailOptionsGenerationDirections.indexOf(`R`),1);
    trailLength = numberOfColumns;
  } else if (startingSide == `bottom`) {
    trailOptionsGenerationDirections.splice(trailOptionsGenerationDirections.indexOf(`D`),1);
    trailLength = numberOfRows;
  } else if (startingSide == `left`) {
    trailOptionsGenerationDirections.splice(trailOptionsGenerationDirections.indexOf(`L`),1);
    trailLength = numberOfColumns;
  }

  console.log(`Trail length is ${trailLength} and starts at the ${startingSide} ${startingSideSecondary}`)

  let trailOptionsGenerationNumbers = [];

  let numberOfTrailSegments = randomNumber(5,8);

  for (let i = 0; i <= numberOfTrailSegments; i++){
    let randomValue = randomNumber(3,6);
    trailLength -= randomValue;
    trailOptionsGenerationNumbers.push(randomValue);
    // console.log(trailLength)
  }

  trailOptionsGenerationNumbers = trailOptionsGenerationNumbers.filter( x => x > 0);

  let trailOptionsGenerationCombined = [];

  for (let i = 0; i <= trailOptionsGenerationNumbers.length-1; i++){
    //add in the secondary movement here under each startement
    //means I need to double the if statements with &&s for startingSideSecondary
    if (startingSide == `top` && startingSideSecondary == `left`){
      trailOptionsGenerationCombined.push(`D${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`R${randomNumber(2,4)}`);
    } else if (startingSide == `top` && startingSideSecondary == `right`){
      trailOptionsGenerationCombined.push(`D${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`L${randomNumber(2,4)}`);
    } else if (startingSide == `right` && startingSideSecondary == `top`){
      trailOptionsGenerationCombined.push(`L${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`D${randomNumber(2,4)}`);
    } else if (startingSide == `right` && startingSideSecondary == `bottom`){
      trailOptionsGenerationCombined.push(`L${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`U${randomNumber(2,4)}`);
    } else if (startingSide == `bottom` && startingSideSecondary == `right`){
      trailOptionsGenerationCombined.push(`U${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`L${randomNumber(2,4)}`);
    } else if (startingSide == `bottom` && startingSideSecondary == `left`){
      trailOptionsGenerationCombined.push(`U${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`R${randomNumber(2,4)}`);
    } else if (startingSide == `left` && startingSideSecondary == `bottom`){
      trailOptionsGenerationCombined.push(`R${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`U${randomNumber(2,4)}`);
    } else if (startingSide == `left` && startingSideSecondary == `top`){
      trailOptionsGenerationCombined.push(`R${trailOptionsGenerationNumbers[i]}`)
      trailOptionsGenerationCombined.push(`D${randomNumber(2,4)}`);
    }
  }



  // for (let i = 0; i <= 10; i++){
  //   trailOptionsGenerationCombined.push(`${trailOptionsGeneration2[randomNumber(0,trailOptionsGeneration2.length-1)]}${trailOptionsGeneration1[randomNumber(0,trailOptionsGeneration1.length-1)]}`);
  // }

  console.log(trailOptionsGenerationCombined);



  let trailArray = [];

  startingCellColumn = getColumnIntegerFromID(startCell.id)

  startingCellRow = getRowIntegerFromID(startCell.id)

  let cell1 = startCell;


  let startRow = getRowIntegerFromID(cell1.id);
  let startColumn = getColumnIntegerFromID(cell1.id);

  for (let i = 0; i <= trailOptionsGenerationCombined.length-1; i++){
    let directionValue = trailOptionsGenerationCombined[i].charAt(0);
    let lengthValue = trailOptionsGenerationCombined[i].charAt(1);


    // trailArray.push(cell1.id);

    // let cell2;




    if (directionValue == `U`) {
      for (let j = 1; j <= lengthValue; j++) {
        trailArray.push(`${startRow-j}-${startColumn}`)
      }
      // console.log(parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10));
      //
      // console.log(parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10));
      //
      // console.log(trailArray[trailArray.length-1]);

      startRow = parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10);

      startColumn = parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10);
      //outside of the above loop, set new starting values? last value in trailArray
      // reset cell1 to equal last value in trailArray
    } else if (directionValue == `R`) {
      for (let j = 1; j <= lengthValue; j++) {
        // let startRow = getRowIntegerFromID(cell1.id);
        // let startColumn = getColumnIntegerFromID(cell1.id);

        trailArray.push(`${startRow}-${startColumn+j}`)

      }

      // console.log(parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10));
      //
      // console.log(parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10));
      //
      //
      // console.log(trailArray[trailArray.length-1]);

      startRow = parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10);

      startColumn = parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10);


    } else if (directionValue == `D`) {
      for (let j = 1; j <= lengthValue; j++) {

        // let startRow = getRowIntegerFromID(cell1.id);
        // let startColumn = getColumnIntegerFromID(cell1.id);

        trailArray.push(`${startRow+j}-${startColumn}`)

      }
      // console.log(parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10));
      //
      // console.log(parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10));

      startRow = parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10);

      startColumn = parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10);

    } else if (directionValue == `L`) {
      for (let j = 1; j <= lengthValue; j++) {

        // let startRow = getRowIntegerFromID(cell1.id);
        // let startColumn = getColumnIntegerFromID(cell1.id);

        trailArray.push(`${startRow}-${startColumn-j}`)

      }

      // console.log(parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10));
      //
      // console.log(parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10));
      //
      // console.log(trailArray[trailArray.length-1]);

      startRow = parseInt(trailArray[trailArray.length-1].substr(0,trailArray[trailArray.length-1].indexOf('-')),10);

      startColumn = parseInt(trailArray[trailArray.length-1].toString().split(`-`)[1], 10);

    }
  }

  console.log(trailArray);

  for (let x = 0; x <= trailCellsArray.length-1; x++){
    trailPattern = randomNumber(1,1);

    let trailCell = document.getElementById(`${trailCellsArray[x]}`);

    trailCellClassArray = trailCell.classList;
    trailCellDistance = findDistanceFromClassList(trailCellClassArray);


    trailCounter += 1;

    trailCell.classList.add(`trailCell`,`trailCounter${trailCounter}`,`trailPattern${trailPattern}`);

    for (let i = 0; i < 3; i++) {
        let trailCellRow = document.createElement('div');
        trailCell.appendChild(trailCellRow);
        trailCellRow.classList.add(`trailCellRow`);

        for (let j = 0; j < 3; j++) {
            let trailCellSubCell = document.createElement('div');
            let parentCellDistance = "";
            trailCellRow.appendChild(trailCellSubCell);
            trailCellSubCell.setAttribute(`id`,`${trailCell.id}-s${i+1}${j+1}`);
            trailCellSubCell.classList.add( `trailCellSubCell`,`trailCell`,`trailCounter${trailCounter}`,`trailCellSubCell${i+1}${j+1}`,`trailPattern${trailPattern}`);
        }
    }

    // rockCellsArray.push(rockCell.id);

  }

  let trailCellSubCells1= document.querySelectorAll(`.trailPattern1`).forEach((el) => {
        for (let p = 0; p <= trailPattern1.length-1; p++){
          if (
            (el.classList.contains(`trailCellSubCell${trailPattern1[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
          ) {
            el.style.backgroundColor = `#a8329b`;
            el.style.filter = `brightness(0%)`;
            el.classList.add(`colorAssigned`);
            if(subCellColorMap.has(`${el.id}`)) {
              // console.log("already assigned")
            } else {
              // subCellColorMap.set(`${el.id}`,`#008080`);
            }

          }
        }

        for (let x = 0; x <= trailPattern1Opposite.length-1; x++){
          if (el.classList.contains(`trailCellSubCell${trailPattern1Opposite[x]}`)) {
            // el.style.backgroundColor = getRandomGreen();
            el.style.filter = `brightness(0%)`;
            // el.classList.add(`colorAssigned`);
          }
        }
  });
  reassignSubCellColors();
}

// currentCell.style.backgroundColor = `#8338ec`;


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
