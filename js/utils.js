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


function getEmptyLocationArr(mat){
    var newMat = []

    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
            newMat.push({j:j,i:i})
        }        
    }

    return newMat
}

function shuffleArray(array) {
    console.log("shuffling")
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}



function startTimer(){
    let startTime = Date.now()
    let time = '00:00:000'
    const elTimerText = document.querySelector('.timerText')
    clearInterval(gTimeInterval)

    gTimeInterval =  setInterval(()=>{
    let delta =  Date.now() - startTime 
    time = formatTime(delta)
    elTimerText.innerText = time

    },31)
}


function formatTime(ms){
    
    let sec = String(Math.floor((ms % 60000) / 1000)).padStart(2,'0')
    let min = String(Math.floor(ms / 60000)).padStart(2,'0')



 return `00:${min}:${sec}`
}
//console.log(formatTime(12451))

function stopTimer(){
    clearInterval(gTimeInterval)
}

function clearTimer(){
    const elTimerText = document.querySelector('.timerText')
    elTimerText.innerText = '00:00:00'
}