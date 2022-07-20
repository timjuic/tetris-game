import Field from "./field.js";
import CONFIG from "./config.js";
import SHAPES from "./shapes.js";
import Shape from "./shape.js";
const { BLOCKSIZE, ROWS, COLUMNS, INITIAL_SPEED_MS } = CONFIG;
let now, elapsed, then = Date.now();

class Game {
   constructor() {
      this.sprites;
      this.field = new Field(BLOCKSIZE, ROWS, COLUMNS);
   }

   loop(arg, immediate = false) {
      if (!immediate) requestAnimationFrame(this.loop.bind(this))
      else {
         this.field.shapeCtx.clearRect(0,0, this.field.shapeCanvas.width, this.field.shapeCanvas.height);
         this.field.draw(this.sprites);
      }

      now = Date.now();
      elapsed = now - then;


      if (elapsed > INITIAL_SPEED_MS) {
         then = now - (elapsed % INITIAL_SPEED_MS);
         if (!this.field.currentShape.active) {
            let randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
            let randomShapeMatrix = SHAPES[randomShapeIndex];
            let offsetX = Math.floor((this.field.fieldMap[0].length - randomShapeMatrix[0].length) / 2);
            let newShape = new Shape(randomShapeMatrix, randomShapeIndex + 1, offsetX)
            this.field.addShape(newShape);
         }
         this.field.shapeCtx.clearRect(0,0, this.field.shapeCanvas.width, this.field.shapeCanvas.height);
         this.field.moveShapeDown();
         this.field.draw(this.sprites);
      }      
   }
   
   async loadSprites() {
      const spriteAmount = 8;
      let promises = []
      for (let i = 0; i < spriteAmount; i++){
         const imagePath = `./sprites/${i}.png`;
         let promise = new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(`Error while loading image ${i}`);
            image.src = imagePath;
         })
         promises.push(promise);
      }
      this.sprites = await Promise.all(promises);
   }
};


export default Game;