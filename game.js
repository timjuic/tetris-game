import Board from "./board.js";
import CONFIG from "./config.js";
import SHAPES from "./shapes.js";
import Shape from "./shape.js";
const { BLOCKSIZE, ROWS, COLUMNS, INITIAL_SPEED_MS, STARTING_FALL_DELAY } = CONFIG;
let now, elapsed, then = Date.now();

class Game {
   constructor(sprites) {
      this.sprites = sprites;
      this.paused = false;
      this.ended = false;
      this.score = 0;
      this.clearedRows = 0;
      this.scoreHTML = document.querySelector('.score .value')
      this.clearedRowsHTML = document.querySelector('.cleared-rows .value')
      this.levelHTML = document.querySelector('.level .value');
      this.level = 0;
      this.fallDelay = STARTING_FALL_DELAY;
      this.board = new Board(this, BLOCKSIZE, ROWS, COLUMNS, sprites);
   }

   start() {
      this.paused = false;
      this.loop();
   }

   pause() {
      this.paused = true;
   }

   loop() {
      if (this.ended) {
         this.endGame();
         return
      }
      if (this.paused) return;
      
      requestAnimationFrame(this.loop.bind(this));

      now = Date.now();
      elapsed = now - then;

      if (elapsed > this.fallDelay) {
         then = now - (elapsed % this.fallDelay);
         
         this.board.clearFilledRows();
         this.board.moveShapeDown();
         this.board.update();
      }
   }

   generateShape() {
      let randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
      let randomShapeMatrix = SHAPES[randomShapeIndex];
      let offsetX = Math.floor((this.board.matrix[0].length - randomShapeMatrix[0].length) / 2);
      let shape = new Shape(randomShapeMatrix, offsetX);
      this.board.currentShape = shape;
      then = Date.now() // Reseting the timer
   }

   endGame() {
      let endModal = document.querySelector('.end-modal');
      let highscoresModal = document.querySelector('.highscores-modal')
      let form = document.querySelector('.end-modal form')
      let submitBtn = form.querySelector('button');
      endModal.style.display = 'block';

      window.addEventListener('keydown', (e) => {
         if (e.code === 'enter') {
            submitBtn.click();
         }
      })

      form.addEventListener('submit', (e) => {
         e.preventDefault();
         endModal.style.display = 'none';
         let table = localStorage.getItem('highscores');
         highscoresModal.innerHTML = table;
         console.log(table);
         let username = endModal.querySelector('input').value
         let score = this.score;
         let date = new Date()
         let time = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
         let row = [username, score, time]
         let tableRow = document.createElement('tr');
         row.forEach(value => {
            let tableCell = document.createElement('td');
            tableCell.innerHTML = value;
            tableRow.appendChild(tableCell)
         })
         let tbody = document.createElement('tbody')
         tbody.appendChild(tableRow);
         highscoresModal.children[0].appendChild(tbody)
         let header = highscoresModal.children[0].children[0];
         let highscoreRows = Array.from(highscoresModal.children[0].children).filter(elem => {
            console.log(elem.children[0].children[0]);
            return elem.children[0].nodeName !== 'TH'
         });
         let sortedRows = highscoreRows.sort((row1, row2) => {
            return row2.children[0].children[1].innerHTML - row1.children[0].children[1].innerHTML
         })

         highscoresModal.children[0].innerHTML = "";
         highscoresModal.children[0].appendChild(header)
         sortedRows.forEach(row => {
            console.log('row' ,row);
            console.log('adding row');
            highscoresModal.children[0].appendChild(row)
         })
         console.log(highscoresModal);
         localStorage.setItem('highscores', highscoresModal.innerHTML);
         console.log(localStorage);
         highscoresModal.style.display = 'block';
      })
   }
};


export default Game;