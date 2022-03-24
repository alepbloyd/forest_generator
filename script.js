const gridContainer = document.querySelector(`#gridContainer`);

// function getOriginCell(e) {
//     originArray.push(e.target.id)
// }

let originArray = [];

let originRow = 0;

let originColumn = 0;

let hasBeenClicked = false;

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

let numberOfRows = minOfRowsOrColumns;
let numberOfColumns = minOfRowsOrColumns;

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

let greenArray = ['#45BF6C', '#259C4B','#2A964C','#18943F','#19BD4D'];  

function getRow(cell) {
    return Number((cell.id).substring(0,2));
}

function getColumn(cell) {
    return (Number((cell.id).substring(3)));
}


function setDistanceFromOrigin(cell) {
    cellRow = getRow(cell);
    cellColumn = getColumn(cell);
    cell.classList.add('distanceAssigned');
    columnDistance = (Math.abs(cellColumn - originArray[1]));
    rowDistance = (Math.abs(cellRow - originArray[0]));
    greaterDistance = Math.max(columnDistance,rowDistance);
    cell.classList.add(`.distance${greaterDistance}`);
    // cell.append(greaterDistance);
}

let wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
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
            if (i < 10 && i < 10) {
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
            // cell.textContent = `${i}-${j}`;
            gridRow.appendChild(cell);
            cell.addEventListener('click', e => {
                e.target.classList.add('originCell');
                e.target.classList.add('originDistance-0');
                originArray.push(Number((e.target.id).substring(0,2)));
                originArray.push(Number((e.target.id).substring(3)));
                originRow = originArray[0];
                originColumn = originArray[1];
                // console.log(originArray)
            })

            // run getDistanceFromOrigin over all cells here
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

gridContainer.addEventListener('click', (e) => {
    if (hasBeenClicked == true) {
        return;
    }
    hasBeenClicked = true;
    let cells = document.querySelectorAll(`.cell`).forEach(async (el) => {
        setDistanceFromOrigin(el);
        for (let i = 0; i <= Math.max(numberOfColumns,numberOfRows); i++) {
            if (el.classList.contains(`.distance${i}`)) {
                setGreen = getRandomGreen();
                el.style.backgroundColor = `${setGreen}`;
                el.style.filter = `brightness(${100-(i*2)}%)`; //need to set brightness so it gets to 0 at max of row or columns
            }
        await sleep(1);
        }
    });
});

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

makeGrid(numberOfRows,numberOfColumns);


// const clearGridButton = document.querySelector(`.clearGridButton`);

// clearGridButton.addEventListener('click', () => {
//     numberOfRows = prompt('How many rows?');
//     numberOfColumns = prompt('How many columns?');
//     const gridContainer = document.querySelector(`#gridContainer`);
//     removeAllChildNodes(gridContainer);
//     makeGrid(numberOfRows,numberOfColumns);
// });
