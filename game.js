import Board from "./board.js";
import CONFIG from "./config.js";
import SHAPES from "./shapes.js";
import Shape from "./shape.js";
const { BLOCKSIZE, ROWS, COLUMNS, INITIAL_SPEED_MS } = CONFIG;
let now, elapsed, then = Date.now();

class Game {
   constructor(sprites) {
      this.sprites = sprites;
      this.paused = false;
      this.ended = false;
      this.board = new Board(this, BLOCKSIZE, ROWS, COLUMNS, sprites);
   }

   start() {
      this.paused = false;
      this.loop();
   }

   pause() {
      this.paused = true;
   }

   loop(arg) {
      if (this.paused || this.ended) return;


      requestAnimationFrame(this.loop.bind(this));

      now = Date.now();
      elapsed = now - then;


      if (elapsed > INITIAL_SPEED_MS) {
         then = now - (elapsed % INITIAL_SPEED_MS);
         if (!this.board.currentShape.active) {
            this.generateShape();
            // if (!shapeAddedSuccessfully) this.ended = true;
         }
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
   }
};


export default Game;