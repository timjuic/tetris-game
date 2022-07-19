import Field from "./field.js";

const BLOCKSIZE = 30;
const ROWS = 20;
const COLUMNS = 10

class Game {
   constructor() {
      this.fieldBgCanvas = document.createElement('canvas')
      document.body.appendChild(this.fieldBgCanvas);
      this.fieldBgCtx = this.fieldBgCanvas.getContext('2d');

      this.fieldShapesCanvas = document.createElement('canvas')
      document.body.appendChild(this.fieldShapesCanvas);
      this.fieldShapesCtx = this.fieldShapesCanvas.getContext('2d');

      this.sprites;
      this.field = new Field(BLOCKSIZE, ROWS, COLUMNS);
   }

   
   async loadSprites() {
      const spriteAmount = 7;
      let promises = []
      for (let i = 1; i <= spriteAmount; i++){
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