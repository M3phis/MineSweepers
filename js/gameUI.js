"use strict"


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
           
        }
        else if (cell.isMarked) content = FLAG
        else content = EMPTY;
        var cellClass = getCellClass(i, j);
        strHTML += `<td onclick="onCellClicked(this,${i},${j})"
                      oncontextmenu="onCellMarked(this, ${i},${j})" class="cell ${cellClass}">${content}</td>`;
      }
      strHTML += `</tr>`;
    }
    const elContainer = document.querySelector(".container");
    elContainer.innerHTML = strHTML;
  }

  
  function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }


  var hints = Array.from(document.querySelectorAll('.hint'))


for (var i = 0; i < hints.length;i++){
    hints[i].innerHTML = HINTOFF
}



function  loadHighScore(){
    console.log("Hi")
    const elHighScore = document.querySelector('.scoreText span')
    console.log(elHighScore)
    if (gLevel.size ===4){
        elHighScore.innerText = localStorage.getItem('ScoreEz')
    }

    else if (gLevel.size ===8){
        elHighScore.innerText = localStorage.getItem('ScoreMed')

    }
    else {
        elHighScore.innerText = localStorage.getItem('ScoreHard')
    }
}