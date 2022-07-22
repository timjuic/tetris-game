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
      if (this.paused || this.ended) return;
      
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
};


export default Game;