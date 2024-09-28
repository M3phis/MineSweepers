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

function storeMove(){
    var currState = JSON.stringify({gBoard,gLevel,gGame,gTimeInterval})
    currState = JSON.parse(currState)

    gStoredMoves.push(currState)
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