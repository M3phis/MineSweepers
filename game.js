'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '

const gGame = {
    score: 0,
    isOn: false
}

var gBoard

function onInit() {
    
    updateScore(0)
    gBoard = buildBoard()

    createGhosts(gBoard)
    createPacman(gBoard)

    renderBoard(gBoard)
    gGame.isOn = true
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}


// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // DONE: update model
    if (diff) {
        gGame.score += diff
    } else {
        gGame.score = 0
    }
    // DONE and dom
    document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over')
    // TODO
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, '🪦')
    gGame.isOn = false
}