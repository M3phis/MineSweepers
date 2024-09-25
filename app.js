"use strict";

const WALL = "WALL";
const FLOOR = "FLOOR";
const BALL = "BALL";
const GAMER = "GAMER";
const SECRET_WALL = "SECRET_WALL";
const GLUE = "GLUE";

const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';
const GLUE_IMG = '<img src="img/glue.png">';

const audio = new Audio("coin.mp3");

const gameOverModal = document.querySelector(".gameOverModal");
console.log(gameOverModal);
gameOverModal.classList.add("hidden");
// Model:
var gBoard;
var gGamerPos;
var gIsGlued = false;

let gBallsCollected;
let gBallsCount;
let interval;
let interval2;

function onInitGame() {
  gGamerPos = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);
  gBallsCollected = 0;
  gBallsCount = 2;
  interval = setInterval(generateBall, 4000);
  interval2 = setInterval(generateGlue, 5000);
}

function buildBoard() {
  // DONE: Create the Matrix 10 * 12
  const board = [];
  const rowsCount = 10;
  const colsCount = 12;
  // DONE: Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < rowsCount; i++) {
    board[i] = [];
    for (var j = 0; j < colsCount; j++) {
      board[i][j] = { type: FLOOR, gameElement: null };
      if (i === 0 || i === rowsCount - 1 || j === 0 || j === colsCount - 1) {
        board[i][j].type = WALL;
      }
    }
  }
  // DONE: Place the gamer and two balls
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
  board[5][5].gameElement = BALL;
  board[7][2].gameElement = BALL;

  //secret walls
  board[board.length / 2][0].type = SECRET_WALL;
  board[board.length / 2][board[0].length - 1].type = SECRET_WALL;
  board[board.length - 1][board[0].length / 2].type = SECRET_WALL;
  board[0][board[0].length / 2].type = SECRET_WALL;
  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j];
      // console.log('currCell:', currCell)
      var cellClass = getClassName({ i: i, j: j });

      if (currCell.type === FLOOR) cellClass += " floor";
      else if (currCell.type === WALL) cellClass += " wall";
      else if (currCell.type === SECRET_WALL) cellClass += " secret_wall";
      strHTML += `<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >`;

      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG;
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG;
      }

      strHTML += "</td>";
    }
    strHTML += "</tr>";
  }

  const elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j, isPortal) {
  if (gIsGlued) return;                      
  console.log({ i, j });

  const targetCell = gBoard[i][j];
  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  const iAbsDiff = Math.abs(i - gGamerPos.i);
  const jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0) || isPortal
  ) {
    if (targetCell.gameElement === BALL) {
      gBallsCollected++;
      let elBallsCounter = document.querySelector(".ballNum");
      elBallsCounter.innerText = gBallsCollected;
      console.log("Collecting!");
      audio.play();
      gBallsCount--;
    
      if (isGameOver()) {
        clearInterval(interval);
        clearInterval(interval2);
        gameOverModal.classList.remove("hidden");
        console.log("GAME OVER");
      }
    }

    if (targetCell.gameElement === GLUE) {
      gIsGlued = true;
      console.log("player is GLUED");
      setTimeout(() => {
        gIsGlued = false;
        console.log("Player is free");
      }, 3000);
    }
    // DONE: Move the gamer
    //* REMOVE FROM LAST CELL
    // update the MODEl
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // update the DOM
    renderCell(gGamerPos, "");

    //* ADD TO NEXT CELL
    // update the MODEl
    gBoard[i][j].gameElement = GAMER;
    gGamerPos.i = i;
    gGamerPos.j = j;
    // update the DOM
    renderCell(gGamerPos, GAMER_IMG);
    let elNeigBalls = document.querySelector(".neigBalls");

    console.log(elNeigBalls.innerText);
    elNeigBalls.innerText = countBallsAround(gBoard, gGamerPos.i, gGamerPos.j);
    console.log(elNeigBalls.innerText);

    console.log(countBallsAround(gBoard, gGamerPos.i, gGamerPos.j));
  } else {
    console.log("TOO FAR", iAbsDiff, jAbsDiff);
  }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  const cellSelector = "." + getClassName(location);
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function onKey(ev) {
  var i = gGamerPos.i;
  var j = gGamerPos.j;
  var isPortal = false;
  switch (ev.key) {
    case "ArrowLeft":
      if (i === 5 && j === 0) {
        isPortal = true;
        j = 11
      }
      else j =  (j -1)
      break;
    case "ArrowRight":
      if (i === 5 && j === 11) {
        isPortal = true; 
        j = 0
      }
      else j = (j + 1)
      break;
    case "ArrowUp":
      if (i === 0 && j === 6) {
        
        isPortal = true;
        i = 9 
      }
      else i = i -1
      break;
    case "ArrowDown":
        if (i === 9 && j === 6){
            isPortal = true;
            i = 0
        }  
        else i = (i +1)
      break;
  }
 console.log(isPortal)
 console.log("i: " + i+" j :" + j)
  moveTo(i,j, isPortal)
}

// Returns the class name for a specific cell
function getClassName(location) {
  const cellClass = `cell-${location.i}-${location.j}`;
  return cellClass;
}

function generateBall() {
  let ballCell = findRandomEmptyCell();
  if (ballCell) {
    gBoard[ballCell.i][ballCell.j].gameElement = BALL;
    console.log(gBoard[ballCell.i][ballCell.j]);
    renderCell(ballCell, BALL_IMG);
    console.log("generating blal");
    gBallsCount++;

    let elNeigBalls = document.querySelector(".neigBalls");
    elNeigBalls.innerText = countBallsAround(gBoard, gGamerPos.i, gGamerPos.j);
  }
}

function generateGlue() {
  let glueCell = findRandomEmptyCell();
  if (glueCell) {
    gBoard[glueCell.i][glueCell.j].gameElement = GLUE;
    console.log(gBoard[glueCell.i][glueCell.j]);
    renderCell({ i: glueCell.i, j: glueCell.j }, GLUE_IMG);
    console.log("generating glue");

    setTimeout(() => {
      gBoard[glueCell.i][glueCell.j].gameElement = null;
      renderCell({ i: glueCell.i, j: glueCell.j }, "");
    }, 3000);
  }
}

function findRandomEmptyCell() {
  let emptyCell = {};
  let emptyArr = [];
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      let currCell = gBoard[i][j];
      if (
        !currCell.gameElement &&
        currCell.type !== WALL &&
        currCell.type !== SECRET_WALL
      ) {
        emptyArr.push({ i: i, j: j });
      }
    }
  }
  emptyCell = emptyArr[Math.floor(Math.random() * emptyArr.length - 1)];
  //console.log(emptyArr)
  console.log(emptyCell);
  return emptyCell;
}

function isGameOver() {
  return gBallsCount === 0;
}

function restartGame() {
  clearInterval(interval);
  clearInterval(interval2);

  gBallsCollected = 0;
  gBallsCount = 2;
  gameOverModal.classList.add("hidden");
  onInitGame();
}

function countBallsAround(board, posI, posJ) {
  var ballCount = 0;

  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === posI && j === posJ) continue;

      //  console.log(i, j)
      if (board[i][j].gameElement === "BALL") ballCount++;
    }
  }
  return ballCount;
}

// Make functions global

