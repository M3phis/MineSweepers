"use strict"

function revealCellAndNegs(location,board){
    var orginCell = board[location.i][location.j]
    if (orginCell.isMine) renderCell(location,MINE)
    else renderCell(location,getNumberPic(orginCell.minesAround))

    for(var i = location.i - 1; i <= location.i + 1; i++){
        if(i < 0 || i >= board.length) continue

        for(var j = location.j - 1; j <= location.j + 1; j++){
            const cell = board[i][j]
            if(j < 0 || j >= board[i].length) continue
            if(i === location.i && j === location.j) continue
            
            
           // console.log(i, j)
           if (cell.isShown || cell.isMarked) continue
           
           else {
            if (cell.isMine){
                renderCell({i:i,j:j},MINE)
            }
            else {
                renderCell({i:i,j:j},getNumberPic(board[i][j].minesAround))
            }
           }
        }
    }
}


function hideCellAndNegs(location,board){
    var orginCell = board[location.i][location.j]
    renderCell(location,EMPTY)

    for(var i = location.i - 1; i <= location.i + 1; i++){
        if(i < 0 || i >= board.length) continue

        for(var j = location.j - 1; j <= location.j + 1; j++){
            const cell = board[i][j]
            if(j < 0 || j >= board[i].length) continue
            if(i === location.i && j === location.j) continue
            
            
           // console.log(i, j)
           if (cell.isShown || cell.isMarked) continue
           
           else {
             renderCell({i:i,j:j},EMPTY)
           }
        }
    }
}

function safeClick(){
    //check how many safeClicks remain
    if (gGame.safeClicks){
    //do safe click
        //update modal and Dom
        const elSafeSpan = document.querySelector('.safeClicks span')
        gGame.safeClicks--
        elSafeSpan.innerText = gGame.safeClicks
        gGame.safeClick = true;

        var foundCell = false;
        while (!foundCell){
            const iIdx = getRandomInt(0,gLevel.size)
            const jIdx = getRandomInt(0,gLevel.size)
            const cell = gBoard[iIdx][jIdx]
            if (!cell.isShown && !cell.isMine && !cell.isMarked){
                foundCell = true
                renderCell({i:iIdx,j:jIdx},SAFE)
                setTimeout(() => {
                    if (cell.isShown) return
                    renderCell({i:iIdx,j:jIdx},EMPTY)
                }, 3000);
            }    
         }
    }
    else return
}

function undo(){
    if (!gStoredMoves.length || !gGame.isOn) return
    //get last move
    // console.log('gGame: ', gGame)
    // console.log('last move stored: ' , gStoredMoves[gStoredMoves.length-1].gGame)

    var stringGame = JSON.stringify({gBoard,gLevel,gGame,gTimeInterval})
    var stringMove = JSON.stringify(gStoredMoves[gStoredMoves.length-1])

    if (stringGame === stringMove){
        gStoredMoves.pop()
    }
    if (!gStoredMoves.length) return
    const lastMove = gStoredMoves.pop()
    //update modal everywhere to prev stats
    gBoard = lastMove.gBoard
    gGame = lastMove.gGame
    gLevel = lastMove.gLevel

    //update Dom
    renderBoard(gBoard)
    LIVES.innerHTML = gGame.lives


}

function undo2(){
    if (!gStoredMoves.length || !gGame.isOn) return
    //get last move
    // console.log('gGame: ', gGame)
    // console.log('last move stored: ' , gStoredMoves[gStoredMoves.length-1].gGame)

    gCurrMove = JSON.parse(JSON.stringify(gStoredMoves.pop()))

    //update modal everywhere to prev stats
    gBoard =  JSON.parse(JSON.stringify(gCurrMove.gBoard))
    gGame = JSON.parse(JSON.stringify(gCurrMove.gGame))


    //update Dom
    renderBoard(gBoard)
    LIVES.innerHTML = gGame.lives


}


function storeMove(){
    var currState = JSON.stringify({gBoard,gGame})
    currState = JSON.parse(currState)


    gStoredMoves.push(currState)
}

function storeMove2(){
    var lastStep = JSON.stringify(gCurrMove)
    lastStep = JSON.parse(lastStep)

    var currState = JSON.stringify({gBoard,gGame})
    currState = JSON.parse(currState)
    //save last move
  

    //update current move
    gCurrMove = currState
    
    //push last move to stored array
    gStoredMoves.push(lastStep)

}


function manualMode(){
    if (!gGame.firstClick) return
    const elManualModal = document.querySelector('.manualModal')
    const elManualSpan = document.querySelector('.manualModal span')
    elManualModal.classList.remove('hidden')
    elManualSpan.innerText = gLevel.mines
    console.log("Putting manual mines")

    gGame.manual = true;
}

function enterDarkMode(){
    document.body.classList.toggle('darkMode')
    const elBtns = Array.from(document.querySelectorAll('button'))
    for (let i = 0; i < elBtns.length; i++) {
        elBtns[i].classList.toggle('darkModeBtns')        
    }
    if (document.body.classList.contains('darkMode')){
        document.querySelector('.darkModeBtn').innerText = 'Light Mode'
    }
    else {
        document.querySelector('.darkModeBtn').innerText = 'Dark Mode'

    }

}


function useHint(el){
    if (gGame.firstClick) return
    if (el.classList.contains('active')) return
  
  
    if (gGame.hintsUsed < 3){
        gGame.hintsUsed++
        el.innerHTML = HINTON
        el.classList.add('active')
        gGame.hint = true;
        console.log("using hint")
    }
   else return
  }


  function isHighScore(currScore){
    var highScore;

    switch (gLevel.size) {
        case 4:
             highScore = +localStorage.getItem('ScoreEz')
            break;
        case 8:
             highScore = +localStorage.getItem('ScoreMed')
            break;
        case 12:
             highScore = +localStorage.getItem('ScoreHard')
            break;
    
        default:
            break;
    }
    return currScore < highScore
  }


  function setHighScore(score){

    switch (gLevel.size) {
        case 4:
            localStorage.setItem('ScoreEz',`${score}`)
            break;
        case 8:
            localStorage.setItem('ScoreMed',`${score}`)

            break;
        case 12:
            localStorage.setItem('ScoreHard',`${score}`)
             
            break;
    
        default:
            break;
    }
    document.querySelector('.scoreText span').innerText = score
  }


  function activateMegaHint (el)
  {
    if (el.classList.contains('activated')) return
    if (gGame.firstClick) return
    el.classList.add('activated')
    console.log("about to activate mega hint")
    gMegaHint = true
  }

  function megaHint(firstLocation,secondLocation){

    for (let i = firstLocation.i; i <= secondLocation.i; i++) {
        for (let j = firstLocation.j; j <= secondLocation.j; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine) renderCell({i:i,j:j},MINE)           
            else if (cell.isShown) continue
            else renderCell({i:i,j:j},getNumberPic(gBoard[i][j].minesAround))
        }
    }

    setTimeout(()=>{
        for (let i = firstLocation.i; i <= secondLocation.i; i++) {
            for (let j = firstLocation.j; j <= secondLocation.j; j++) {
                const cell = gBoard[i][j]
                if (cell.isMine && cell.isShown) renderCell({i:i,j:j},MINE)           
                else if (cell.isMine && !cell.isShown && !cell.isMarked) renderCell({i:i,j:j},EMPTY)           
                else if (cell.isShown) continue
                else if (cell.isMarked) renderCell({i:i,j:j},FLAG)
                else renderCell({i:i,j:j},EMPTY)

            }
        }
        gMegaHint = false;
        gMegaFirst = false;
        gMegaSecond = false;
    },3000)

  }


  function exterminateMines(el){
        if (el.classList.contains('activated'))return
        //get all current mines
        el.classList.add('activated')
        var mineLocations = []

        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) mineLocations.push({i:i,j:j})                
            }            
        }


        shuffleArray(mineLocations)

         console.log(mineLocations)
        for (let i = 0; i < 3; i++) {
            if (!mineLocations.length) continue
            var mineLocation = mineLocations.pop()
            console.log(mineLocation)
            gBoard[mineLocation.i][mineLocation.j].isMine = false
        }

        setMinesNegsCount(gBoard);
        renderBoard(gBoard);

        //iterate and remove 3 of them if you can
  }