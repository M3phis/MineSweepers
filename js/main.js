"use strict";

window.addEventListener("contextmenu", (e) => e.preventDefault());
//consts
var SIZE = 4;
const MINE = `<img src="Img/64x64/bomb.png" class="img"></img>`;
const EMPTY = `<img src="Img/64x64/unchecked.png" class="img"></img>`;
const ZERO = `<img src="Img/64x64/empty.png" class="img"></img>`;
const ONE = `<img src="Img/64x64/1.png" class="img"></img>`;
const TWO = `<img src="Img/64x64/2.png" class="img"></img>`;
const THREE = `<img src="Img/64x64/3.png" class="img"></img>`;
const FOUR = `<img src="Img/64x64/4.png" class="img"></img>`;
const FIVE = `<img src="Img/64x64/5.png" class="img"></img>`;
const SIX = `<img src="Img/64x64/6.png" class="img"></img>`;
const SEVEN = `<img src="Img/64x64/7.png" class="img"></img>`;
const EIGHT = `<img src="Img/64x64/8.png" class="img"></img>`;
const FLAG = `<img src="Img/64x64/flag.png" class="img"></img>`;
const SAD = '😞'
const NEUTRAL = '😐'
const HAPPY = '😄'
const HINTON = `<img src="Img/64x64/hintOn.png" class="img"></img>`
const HINTOFF = `<img src="Img/64x64/hintOff.png" class="img"></img>`
const SMILEY = document.querySelector('.smiley')
const LIVES = document.querySelector('.lives span')

//global vars
var gHintsUsed = 0;
var gHint = false;
var gTimeInterval;
var gFirstClick;
var gBoard;
var gLives;
var gLevel = {
  size: SIZE,
  mines: 2,
};
var gGame = {
  isOn: false,
  showCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

/*

cell is - 
  {
    minesAround : num,
    isShown: bool,
    isMine: bool,
    isMarked: bool
  }


*/

console.log("connected");

function buildBoard() {
  var board = [];

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      board[i][j] = {
        minesAround: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      //console.log(board[i][j])
    }
  }

  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (let i = 0; i < SIZE; i++) {
    strHTML += `<tr>`;
    for (let j = 0; j < SIZE; j++) {
      var cell = board[i][j];
      var content;
      if (cell.isShown) {
        content = cell.isMine
          ? MINE
          : getNumberPic(cell.minesAround)
         
      } else content = EMPTY;
      var cellClass = getCellClass(i, j);
      strHTML += `<td onclick="onCellClicked(this,${i},${j})"
                    oncontextmenu="onCellMarked(this, ${i},${j})" class="cell ${cellClass}">${content}</td>`;
    }
    strHTML += `</tr>`;
  }
  const elContainer = document.querySelector(".container");
  elContainer.innerHTML = strHTML;
}

function onInit() {
  stopTimer()
  clearTimer()
  gGame.markedCount=0;
  gGame.showCount=0;
  gGame.isOn = true;
  gFirstClick = true;
  gLives = 3;
  LIVES.innerHTML = gLives
  gBoard = buildBoard();
  SMILEY.innerHTML = NEUTRAL
  renderBoard(gBoard);
  console.table(gBoard);
  console.log(gBoard);
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const cell = board[i][j];
      if (cell.isMine) continue;
      cell.minesAround = countMineAround(board, i, j);
    }
  }
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return;

// activate if hint
   if (gHint){

    revealCellAndNegs({i:i,j:j})
    setTimeout(()=>{
        hideCellAndNegs({i:i,j:j})
    },1000)

    gHint = false;
    return
   }

  const cell = gBoard[i][j];

  //make sure first click isn't on mine
  if (gFirstClick) {
    startTimer()
    setMines(gLevel.mines, gBoard, { i, j });
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    gFirstClick = false;
  }

  if (!cell.isShown && !cell.minesAround && !cell.isMine) {
    reveal(gBoard, i, j);
     if (checkVictory()) gameOver(true);
    return;
  }
  //check if marked
  console.log(i, j);
  if (gBoard[i][j].isMarked) {
    // console.log("marked")
    return;
  }

  //check for loss
  if (cell.isMine) {
    // console.log("GAME OVER")
    gLives--;
    LIVES.innerHTML = gLives
    if (!gLives) gameOver(false);
    else {
      cell.isShown = true;
      renderCell({ i: i, j: j }, MINE);
      setTimeout(() => {
        cell.isShown = false;
        renderCell({ i: i, j: j }, EMPTY);
      }, 2000);
    }
    return;
  }

  console.log(elCell.innerHTML + "");
  //update modal
  cell.isShown = true;
  //update DOM
  gGame.showCount++;
  if (!cell.isMine) renderCell({ i, j }, getNumberPic(cell.minesAround));
  else elCell.innerHTML = MINE;

  if (checkVictory()) gameOver(true);
}

function onCellMarked(elCell, i, j) {
  if (!gGame.isOn) return;

  const cell = gBoard[i][j];

  if (cell.isShown) return;

  if (cell.isMarked) {
    cell.isMarked = false;
    elCell.innerHTML = EMPTY;
    if (cell.isMine) {
      gGame.markedCount--;
    }
  } else {
    elCell.innerHTML = FLAG;
    cell.isMarked = true;
    if (cell.isMine) {
      gGame.markedCount++
      if (checkVictory()) {
        gameOver(true);
      }
    }
  }
  if (checkVictory()) gameOver(true);
}

function getNumberPic(num) {
  switch (num) {
    case 0:
      return ZERO;
    case 1:
      return ONE;
      break;
    case 2:
      return TWO;
      break;
    case 3:
      return THREE;

    case 4:
      return FOUR;
    case 5:
      return FIVE;
    case 6:
      return SIX;
    case 7:
      return SEVEN;
    case 8:
      return EIGHT;
    default:
      return;
      break;
  }
}

function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function reveal(board, i, j) {
  if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return;
  if (board[i][j].isShown || board[i][j].isMarked || board[i][j].isMine) return;
  const cell = board[i][j];

  //base conditions

  //open number and return
  if (cell.minesAround) {
    cell.isShown = true;
    renderCell({ i: i, j: j }, getNumberPic(+cell.minesAround));
    gGame.showCount++;
    //   console.log("found number")
    return;
  }

  if (cell.isMine) {
    //  console.log("found mine")
    return;
  }

  if (!cell.isMine && !cell.minesAround && !cell.isShown) {
    //  console.log("found empty ")
    cell.isShown = true;
    gGame.showCount++;
    renderCell({ i: i, j: j }, getNumberPic(+cell.minesAround));
  }
  //UPP
  reveal(board, i - 1, j);
  //DOWN
  reveal(board, i + 1, j);
  //LEFT
  reveal(board, i, j - 1);
  //RIGHT
  reveal(board, i, j + 1);
  // diagonals
  reveal(board, i + 1, j + 1);
  reveal(board, i + 1, j - 1);
  reveal(board, i - 1, j - 1);
  reveal(board, i - 1, j + 1);
}

function setMines(num, board, bannedLocation) {
  var potentialLocations = getEmptyLocationArr(board);
  shuffleArray(potentialLocations);

  for (let i = 0; i < num; i++) {
    setRandomMine(potentialLocations, board, bannedLocation);
  }
}

function setRandomMine(locations, board, bannedLocation) {
  var location = locations.pop();
  if (location.i === bannedLocation.i && location.j === bannedLocation.j) {
    location = locations.pop();
  }

  const cell = board[location.i][location.j];
  cell.isMine = true;
}

function setDiff(num) {
  if (num === 1) {
    gLevel.mines = 2;
    SIZE = 4;
  } else if (num === 2) {
    gLevel.mines = 14;
    SIZE = 8;
  } else {
    gLevel.mines = 32;
    SIZE = 12;
  }

  onInit();
}

function checkVictory() {
  console.log("checking victory");
  //  console.log("Flagged mines:" , gFlaggedMines)
  // console.log("showed:" , gShownCells)
  return gGame.markedCount + gGame.showCount === SIZE * SIZE;
}

function gameOver(win) {
  stopTimer()
  console.log("Ending game");
  if (!win) loseGame();
  else winGame();

  //change smiley to sad
}

function winGame() {
  //stop timer
  //win module
  //

  console.log("YOU WIN")
  SMILEY.innerHTML = HAPPY
  gGame.isOn = false;
}
function loseGame() {
  //reveal mines

  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        renderCell({ i, j }, MINE);
      }
    }
  }

  console.log("You lose");
  SMILEY.innerHTML = SAD
  gGame.isOn = false;
}


function useHint(el){
    if (gFirstClick) return
    console.log(''+el.innerHTML === HINTON)
    if (el.classList.contains('active')) return


    if (gHintsUsed < 3){
        gHintsUsed++
        el.innerHTML = HINTON
        el.classList.add('active')
        gHint = true;
    }
   else return
}

var hints = Array.from(document.querySelectorAll('.hint'))

for (var i = 0; i < hints.length;i++){
    console.log("hi")
    hints[i].innerHTML = HINTOFF
    
}


//console.log(checkVictory())

function revealCellAndNegs(location){
    var orginCell = gBoard[location.i][location.j]
    if (orginCell.isMine) renderCell(location,MINE)
    else renderCell(location,getNumberPic(orginCell.minesAround))

    for(var i = location.i - 1; i <= location.i + 1; i++){
        if(i < 0 || i >= gBoard.length) continue

        for(var j = location.j - 1; j <= location.j + 1; j++){
            const cell = gBoard[i][j]
            if(j < 0 || j >= gBoard[i].length) continue
            if(i === location.i && j === location.j) continue
            
            
           // console.log(i, j)
           if (cell.isShown) continue
           
           else {
            if (cell.isMine){
                renderCell({i:i,j:j},MINE)
            }
            else {
                renderCell({i:i,j:j},getNumberPic(gBoard[i][j].minesAround))
            }
           }
        }
    }
}


function hideCellAndNegs(location){
    var orginCell = gBoard[location.i][location.j]
    renderCell(location,EMPTY)

    for(var i = location.i - 1; i <= location.i + 1; i++){
        if(i < 0 || i >= gBoard.length) continue

        for(var j = location.j - 1; j <= location.j + 1; j++){
            const cell = gBoard[i][j]
            if(j < 0 || j >= gBoard[i].length) continue
            if(i === location.i && j === location.j) continue
            
            
           // console.log(i, j)
           if (cell.isShown) continue
           
           else {
             renderCell({i:i,j:j},EMPTY)
           }
        }
    }
}


