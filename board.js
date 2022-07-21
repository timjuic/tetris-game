import Utils from "./Utils.js";

class Board {
   constructor(game, blockSize, height, width, sprites) {
      this.game = game
      this.bgCanvas = document.createElement('canvas');
      this.shapeCanvas = document.createElement('canvas');
      this.bgCtx = this.bgCanvas.getContext('2d');
      this.shapeCtx = this.shapeCanvas.getContext('2d');
      document.body.appendChild(this.bgCanvas)
      document.body.appendChild(this.shapeCanvas);
      this.blockSize = blockSize;
      this.bgCanvas.height = this.shapeCanvas.height = blockSize * height;
      this.bgCanvas.width = this.shapeCanvas.width = blockSize * width;
      this.sprites = sprites;

      this.matrix = [];      

      for (let i = 0; i < height; i++) {
         this.matrix.push([]);
         for (let j = 0; j < width; j++) {
            this.matrix[i].push(0);
         }
      }
      this.currentShape;
   }

   renderBackground(bgImage) {
      this.bgCtx.fillStyle = 'black';
      this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

      this.matrix.forEach((row, i) => {
         row.forEach((_, j) => {
            this.bgCtx.drawImage(bgImage, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
         })
      })
   }


   fixateShape() {
      for (let i = 0; i < this.currentShape.matrix.length; i++) {
         for (let j = 0; j < this.currentShape.matrix[0].length; j++) {
            if (this.currentShape.matrix[i][j] !== 0) {
               if (this.matrix[i + this.currentShape.offsetY][j + this.currentShape.offsetX] !== 0) {
                  this.game.ended = true;
                  return;
               }
               this.matrix[i + this.currentShape.offsetY][j + this.currentShape.offsetX] = this.currentShape.matrix[i][j]
            }
         }
      }
      this.currentShape.active = false;
   }

   moveShapeDown() {
      this.currentShape.offsetY++;
      if (this.checkIfColliding()) {
         this.currentShape.offsetY--;
         if (this.currentShape.hitBottom < 2) this.currentShape.hitBottom++;
         else this.fixateShape();
      } else this.currentShape.hitBottom = 0;
   }

   moveShapeLeft() {
      this.currentShape.offsetX--;
      if (this.checkIfColliding()) this.currentShape.offsetX++;
   }

   moveShapeRight() {
      this.currentShape.offsetX++;
      if (this.checkIfColliding()) this.currentShape.offsetX--;
   }

   dropShape() {
      while (!this.checkIfColliding()) {
         this.currentShape.offsetY++;
      }
      this.currentShape.offsetY--;
      this.fixateShape();
   }

   rotateShape() {
      let rotatedMatrix = Utils.rotateMatrix(this.currentShape.matrix);
      if (!this.checkIfColliding(rotatedMatrix)) {
         this.currentShape.matrix = rotatedMatrix
      }
   }

   clearFilledRows() {
      let fullRows = this.matrix.filter(row => row.every(value => value !== 0));
      let rowIndexes = fullRows.map(row => this.matrix.indexOf(row));
      rowIndexes.forEach(rowIndex => {
         this.matrix[rowIndex].fill(0);
         for (let i = rowIndex; i >= 0; i--) {
            for (let j = 0; j < this.matrix[0].length; j++) {
               if (this.matrix[i][j] !== 0 && this.matrix[i + 1] !== undefined) {
                  let value = this.matrix[i][j];
                  this.matrix[i][j] = 0;
                  this.matrix[i + 1][j] = value;
               }
            }
         }
      })
   }

   checkIfColliding(matrix = this.currentShape.matrix) {
      console.log(this.currentShape.offsetY);
      let offsetX = this.currentShape.offsetX;
      let offsetY = this.currentShape.offsetY;
      for (let i = 0; i < matrix.length; i++) {
         for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] !== 0) {
               if (this.matrix[i + offsetY] === undefined || this.matrix[i + offsetY][j + offsetX] !== 0) {
                    return true; // Colliding
                  }
            }
         }
      }
      return false; // Not colliding
   }
   

   draw() {
      this.matrix.forEach((row, i) => {
         row.forEach((value, j) => {
            if (value === 0) return;
            this.shapeCtx.drawImage(this.sprites[value], j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
         })
      })

      this.currentShape.matrix.forEach((row, i) => {
         row.forEach((value, j) => {
            if (value === 0) return;
            this.shapeCtx.drawImage(this.sprites[value], (j + this.currentShape.offsetX) * this.blockSize, (i + this.currentShape.offsetY) * this.blockSize, this.blockSize, this.blockSize);
         })
      })
   }

   update() {
      this.shapeCtx.clearRect(0,0, this.shapeCanvas.width, this.shapeCanvas.height);
      this.draw();
   }
}

export default Board;