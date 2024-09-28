"use strict"


function onCellClicked(elCell, i, j) {
    if (gMegaHint&&gMegaFirst&&gMegaSecond) return

    if (gMegaHint && !gMegaFirst){
        gMegaFirst = {i:i,j:j}
        return
    } 

    else if (gMegaFirst && !gMegaSecond){
        gMegaSecond = {i:i,j:j}
        megaHint(gMegaFirst,gMegaSecond)
        return
    } 
    ///manual mode
     if (gGame.manual && gGame.manualMineCount && !gBoard[i][j].isMine){
        console.log("hi")
        gBoard[i][j].isMine = true
        gGame.manualMineCount--
        document.querySelector(".manualModal span").innerText = gGame.manualMineCount
        //reduce mine count
        return
     }
    
    if (gGame.manual && gGame.manualMineCount) return
    
     else if (gGame.manual){
        startTimer()
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
        gGame.firstClick = false;
     }
    
    
      if (!gGame.isOn) return;
    
    // activate if hint
       if (gGame.hint){
    
        revealCellAndNegs({i:i,j:j},gBoard)
        setTimeout(()=>{
            hideCellAndNegs({i:i,j:j},gBoard)
        },1000)
    
        gGame.hint = false;
        return
       }
    
      const cell = gBoard[i][j];
    
      if (cell.isShown) return;
    
      //make sure first click isn't on mine
      if (gGame.firstClick) {
        startTimer()
        setMines(gLevel.mines, gBoard, { i, j });
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
        gGame.firstClick = false;
      }
    
      if (!cell.isShown && !cell.minesAround && !cell.isMine) {
        reveal(gBoard, i, j);
         if (checkVictory()) gameOver(true);
         storeMove2()
        return;
      }
      //check if marked
      console.log(i, j);
      if (gBoard[i][j].isMarked) {
        // console.log("marked")
        return;
      }
    
      //CLICKED ON MINE
      if (cell.isMine) {
        steppedOnMine(cell,i,j)
        storeMove2()
        return
      }
    //numbered cell
      console.log(elCell.innerHTML + "");
      //update modal
      cell.isShown = true;
      //update DOM
      gGame.showCount++;
      if (!cell.isMine) renderCell({ i, j }, getNumberPic(cell.minesAround));
      else elCell.innerHTML = MINE;
    
      if (checkVictory()) gameOver(true);
      storeMove2()
    }
    
    
function onCellMarked(elCell, i, j) {
    if (gMegaHint&&gMegaFirst&&gMegaSecond) return

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
      storeMove2()
    }
    