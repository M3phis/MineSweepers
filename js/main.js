"use strict"



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
const SAD = '<img src="Img/64x64/lose.png" class="img"></img>'
const NEUTRAL = '<img src="Img/64x64/idle.png" class="img"></img>'
const HAPPY = '<img src="Img/64x64/win.png" class="img"></img>'
const HINTON = `<img src="Img/64x64/hintOn(2).png" class="img"></img>`
const HINTOFF = `<img src="Img/64x64/hintOff(2).png" class="img"></img>`
const SMILEY = document.querySelector('.smiley')
const LIVES = document.querySelector('.lives span')
const SAFE = '🔲'
const HIGH_SCORE_EZ = +localStorage.getItem('ScoreEz')
const HIGH_SCORE_MED = +localStorage.getItem('ScoreMed')
const HIGH_SCORE_HARD = +localStorage.getItem('ScoreHard')

//global vars
var gTimeInterval;
var gBoard;
var gLevel = {
  size: SIZE,
  mines: 2,
};
var gGame = {
  isOn: false,
  showCount: 0,
  markedCount: 0,
  secsPassed: 0,
  safeClicks: 3,
  safeClick: false,
  lives:3,
  firstClick: true,
  hintsUsed: 0,
  hint: false,
  manual: false,
  manualMineCount:2 
};

var gMegaHint = false
var gMegaFirst;
var gMegaSecond;

var gHighScore;

var gStoredMoves = []
var gCurrMove = {}

console.log("connected");

function onInit() {
  document.querySelector('.manualModal').classList.add('hidden')
  stopTimer()
  clearTimer()
  resetgGame()
  loadHighScore()
  
  LIVES.innerHTML = gGame.lives
  SMILEY.innerHTML = NEUTRAL

  renderBoard(gBoard);
  console.table(gBoard);
  console.log(gBoard);
  
}

function checkVictory() {
  console.log("checking victory");
  return gGame.markedCount + gGame.showCount === SIZE * SIZE;
}

function gameOver(win) {
  gGame.isOn = false;
  stopTimer()
  console.log("Ending game");
  if (!win) loseGame();
  else winGame();

  //change smiley to sad
}

function winGame() {
  //win module
  //

  console.log("YOU WIN")
  SMILEY.innerHTML = HAPPY
   const elTimerText = document.querySelector('.timerText')

   console.log(elTimerText.innerText)
   var currScoreNum = unFormatTime(elTimerText.innerText)

  //if no curr highscore, set highscore
  if (gLevel.size === 4){
      if (!HIGH_SCORE_EZ) setHighScore(currScoreNum)
        return
  }
  else if (gLevel.size === 8){
    if (!HIGH_SCORE_MED) setHighScore(currScoreNum)
      return
  } 
  else if (gLevel.size === 12){
   if (!HIGH_SCORE_HARD) setHighScore(currScoreNum)
    return
}
  //check if to update high score
  if (isHighScore(currScoreNum)) setHighScore(currScoreNum)

   console.log(currScoreNum)

  
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


function resetgGame(){
  gGame.safeClicks = 3;
  gGame.markedCount=0;
  gGame.showCount=0;
  gGame.isOn = true;
  gGame.lives = 3;
  gGame.firstClick = true;
  gGame.manual = false;
  gGame.manualMineCount = gLevel.mines
  gBoard = buildBoard();
  

  gGame.hintsUsed = 0
  var hints = Array.from(document.querySelectorAll('.hint'))




  for (var i = 0; i < hints.length;i++){
      hints[i].innerHTML = HINTOFF
      hints[i].classList.remove('active')
  }

  document.querySelector('.megaHint').classList.remove('activated')


  document.querySelector('.Ext').classList.remove('activated')

  console.log("gBoard: " ,gBoard)
  gCurrMove = JSON.stringify({gBoard,gGame})
  gCurrMove = JSON.parse(gCurrMove)
  gStoredMoves=[]
}


