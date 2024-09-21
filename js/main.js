"use strict"

window. addEventListener("contextmenu", e => e. preventDefault());
//consts
const SIZE = 8 
const MINE = `<img src="Img/64x64/bomb.png" class="img"></img>`

const EMPTY = `<img src="../Img/64x64/empty.png" class="img"></img>`
const ZERO = `<img src="../Img/64x64/empty.png" class="img"></img>`
const ONE = `<img src="../Img/64x64/1.png" class="img"></img>`
const TWO = `<img src="../Img/64x64/2.png" class="img"></img>`
const THREE = `<img src="../Img/64x64/3.png" class="img"></img>`
const FOUR = `<img src="../Img/64x64/4.png" class="img"></img>`
const FIVE = `<img src="../Img/64x64/5.png" class="img"></img>`
const SIX = `<img src="../Img/64x64/6.png" class="img"></img>`
const FLAG = `<img src="../Img/64x64/flag.png" class="img"></img>`



//global vars
var gBoard;
var gLevel; 
var gLevel = {
    size: SIZE,
    mines: 2
}
var gGame = {
    isOn: false,
    showCount : 0,
    markedCount :0,
    secsPassed: 0
}


/*

cell is - 
  {
    minesAround : num,
    isShown: bool,
    isMine: bool,
    isMarked: bool
  }


*/

console.log("connected")


function buildBoard(){
    var board = []

    for (let i = 0; i < SIZE; i++) {
        board[i] = []
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = 
                {
                    minesAround : 0,
                    isShown: false,
                    isMine: false,
                    isMarked: false
                  }
           //console.log(board[i][j])
        }        
    }
   setMines(SIZE * 2,board)

    return board
}


function renderBoard(board){
        var strHTML = ''
    for (let i = 0; i < SIZE; i++) {
        strHTML += `<tr>`
        for (let j = 0; j < SIZE; j++) {
            var cell = board[i][j]
            var content;
            if (cell.isShown){ 
             content = cell.isMine ? MINE :
                     cell.minesAround ? getNumberPic(cell.minesAround) 
                     : EMPTY
            }
            else content = EMPTY
            var cellClass = getCellClass(i,j)
           strHTML +=`<td onclick="onCellClicked(this,${i},${j})"
                    oncontextmenu="onCellMarked(this, ${i},${j})" class="cell ${cellClass}">${content}</td>`
        }
        strHTML += `</tr>`
    }
    const elContainer = document.querySelector(".container")
    elContainer.innerHTML = strHTML

}


function onInit(){
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard)
    console.log(gBoard)
}


function setMinesNegsCount(board){
    
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const cell = board[i][j]
            if (cell.isMine) continue
            cell.minesAround = countMineAround(board,i,j)
            
        }        
    }
    
}


function onCellClicked(elCell,i , j){
    const cell =  gBoard[i][j]

if (!cell.isShown && !cell.minesAround && !cell.isMine ){
    reveal(gBoard,i,j)
}



//check if marked
    console.log(i, j)
    if (gBoard[i][j].isMarked) {
        console.log("marked")
        return;
    }

    //check for loss
    if (cell.isMine){
        console.log("GAME OVER")
        gameOver()
    }

    console.log(elCell.innerHTML+ '')
    //update modal
    cell.isShown = true;
    //update DOM
    if (!cell.isMine) renderCell({i,j},getNumberPic(cell.minesAround))
    else elCell.innerHTML = MINE
}

function onCellMarked(elCell,i,j){
    const cell = gBoard[i][j]

    if (cell.isShown) return

    if (cell.isMarked){
        cell.isMarked = false
        elCell.innerHTML = EMPTY
    }
    else {
    elCell.innerHTML = FLAG
    cell.isMarked = true;
    }
}


function checkGameOver(){

}


function expandShown(board, elCell, i , j){

}


function getNumberPic(num){

    switch (num) {
        case 0:
            return EMPTY
        case 1:
            return ONE
            break;
        case 2: return TWO
            break;
        case 3: return THREE

        case 4: return THREE
        case 5: return THREE
        case 6: return THREE
       default: return
            break;
    }

}


function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function gameOver(){

    //change smiley to sad

    // show all mines
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine ){
                gBoard[i][j].isShown = true
                renderCell({i,j},MINE)
            }           
        }        
    }


}





function reveal(board,i,j){

    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return
    if (board[i][j].isShown || board[i][j].isMarked || board[i][j].isMine) return
    const cell = board[i][j]

//base conditions

//open number and return
if (cell.minesAround){
    cell.isShown = true
    renderCell({i:i,j:j},getNumberPic(+cell.minesAround))
    console.log("found number")
    return
}

if (cell.isMine){
    console.log("found mine")
    return
}

if (!cell.isMine && !cell.minesAround && !cell.isShown){
    console.log("found empty ")
    cell.isShown = true
    renderCell({i:i,j:j},getNumberPic(+cell.minesAround))
}


//edges
//UPP
    console.log("going up")
    reveal(board, i-1,j)
//DOWN
    console.log("going downm")

    reveal(board, i+1,j)
//LEFT
    console.log("going left")

    reveal(board, i,j-1)
//RIGHT
        console.log("going right")
        reveal(board, i,j+1)

// diagonals

    reveal(board,i+1,j+1)
    reveal(board,i+1,j-1)
    reveal(board,i-1,j-1)
    reveal(board,i-1,j+1)



}


function setMines(num,board){

    for (let i = 0; i < num; i++) {
        setRandomMine(board)        
    }
}


function setRandomMine(board){
    const randomI = getRandomInt(0,board.length)
    const randomJ = getRandomInt(0,board[0].length)

    const cell =  board[randomI][randomJ]
    cell.isMine = true

}