'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}


function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function countMineAround(mat, rowIdx, colIdx) {
    var mineCount = 0

    for(var i = rowIdx - 1; i <= rowIdx + 1; i++){
        if(i < 0 || i >= mat.length) continue

        for(var j = colIdx - 1; j <= colIdx + 1; j++){
            if(j < 0 || j >= mat[i].length) continue
            if(i === rowIdx && j === colIdx) continue
        
           // console.log(i, j)
            if(mat[i][j].isMine) mineCount++
        }
    }
    return mineCount
}


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function playSound(sound) {
    const audioPop = new Audio(sound)
    audioPop.play()
}

function getCellClass(i,j){
    return `cell-${i}-${j}`
}