"use strict";

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

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const cell = board[i][j];
      if (cell.isMine) continue;
      cell.minesAround = countMineAround(board, i, j);
    }
  }
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

function steppedOnMine(cell, i, j) {
  gGame.lives--;
  LIVES.innerHTML = gGame.lives;
  if (!gGame.lives) gameOver(false);
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

function setDiff(num) {
  if (num === 1) {
    gLevel.mines = 2;
    gLevel.size = 4
    SIZE = 4;
  } else if (num === 2) {
    gLevel.mines = 14;
    SIZE = 8;
    gLevel.size = 8
  } else {
    gLevel.mines = 32;
    SIZE = 12;
    gLevel.size = 12
  }

  onInit();
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
