class Field {
   constructor(blockSize, height, width) {
      this.bgCanvas = document.createElement('canvas');
      this.shapeCanvas = document.createElement('canvas');
      this.bgCtx = this.bgCanvas.getContext('2d');
      this.shapeCtx = this.shapeCanvas.getContext('2d');
      document.body.appendChild(this.bgCanvas)
      document.body.appendChild(this.shapeCanvas);
      this.blockSize = blockSize;
      this.bgCanvas.height = this.shapeCanvas.height = blockSize * height;
      this.bgCanvas.width = this.shapeCanvas.width = blockSize * width;
      this.fieldMap = [];
      for (let i = 0; i < height; i++) {
         this.fieldMap.push([]);
         for (let j = 0; j < width; j++) {
            this.fieldMap[i].push(0);
         }
      }
      this.currentShape;
   }

   renderBackground(bgImage) {
      this.bgCtx.fillStyle = 'black';
      this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

      this.fieldMap.forEach((row, i) => {
         row.forEach((_, j) => {
            this.bgCtx.drawImage(bgImage, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
         })
      })
   }

   addShape(shape) {
      this.currentShape = shape;
      let startX = shape.offsetX;
      let startY = shape.offsetY;
      let rows = shape.matrix.length;
      let cols = shape.matrix[0].length;
      for (let i = 0; i < rows; i++) {
         for (let j = 0; j < cols; j++) {
            if (shape.matrix[i][j] !== 0)  {
               this.fieldMap[i + startY][j + startX] = shape.imageIndex;
            };
         }
      }
   }

   moveShapeDown() {
      for (let i = this.currentShape.matrix.length - 1; i >= 0; i--) {
         for (let j = 0; j < this.currentShape.matrix[0].length; j++) {
            if (this.currentShape.matrix[i][j] !== 0) {
               if (this.fieldMap[i + this.currentShape.offsetY + 1] === undefined ||
                  this.fieldMap[i + this.currentShape.offsetY + 1][j + this.currentShape.offsetX] !== 0 && 
                  (this.currentShape.matrix[i + 1] === undefined || this.currentShape.matrix[i + 1][j] === 0)) {
                     this.currentShape.active = false;
                     return false;
                  };
            }
         }
      }

      for (let i = this.currentShape.matrix.length - 1; i >= 0; i--) {
         for (let j = 0; j < this.currentShape.matrix[0].length; j++) {
            if (this.currentShape.matrix[i][j] !== 0) {
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX] = 0;
               this.fieldMap[i + this.currentShape.offsetY + 1][j + this.currentShape.offsetX] = this.currentShape.imageIndex;
            }
         }
      }
      this.currentShape.offsetY++;
   }

   moveShapeLeft() {
      for (let i = 0; i < this.currentShape.matrix.length; i++) {
         for (let j = 0; j < this.currentShape.matrix[0].length; j++) {
            if (this.currentShape.matrix[i][j] !== 0) {
               console.log(this.currentShape.matrix[i][j - 1]);
               if (this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX - 1] === undefined ||
                  this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX - 1] !== 0 && 
                  (this.currentShape.matrix[i][j - 1] === undefined || this.currentShape.matrix[i][j - 1] === 0)
                   ) return;
            }
         }
      }

      console.log('moving left');
      for (let i = 0; i < this.currentShape.matrix.length; i++) {
         for (let j = 0; j < this.currentShape.matrix[0].length; j++) {
            if (this.currentShape.matrix[i][j] !== 0) {
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX] = 0;
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX - 1] = this.currentShape.imageIndex;
            }
         }
      }
      this.currentShape.offsetX--;
   }

   moveShapeRight() {
      for (let i = 0; i < this.currentShape.matrix.length; i++) {
         for (let j = this.currentShape.matrix[0].length - 1; j >= 0; j--) {
            if (this.currentShape.matrix[i][j] !== 0) {
               if (this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX + 1] === undefined ||
                  this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX + 1] !== 0 && 
                  (this.currentShape.matrix[i][j + 1] === undefined || this.currentShape.matrix[i][j + 1] === 0)
                   ) return;
            }
         }
      }
      
      console.log('moving right');
      for (let i = 0; i < this.currentShape.matrix.length; i++) {
         for (let j = this.currentShape.matrix[0].length - 1; j >= 0; j--) {
            if (this.currentShape.matrix[i][j] !== 0) {
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX] = 0;
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX + 1] = this.currentShape.imageIndex;
            }
         }
      }
      this.currentShape.offsetX++;
   }

   dropShape() {
      let canMoveDown;
      while (canMoveDown !== false) {
         canMoveDown = this.moveShapeDown();
      }
   }

   rotateShape() {
      for (let i = 0; i < this.currentShape.matrix.length; i++) {
         for (let j = 0; j < this.currentShape.matrix[0].length; j++) {
            if (this.currentShape.matrix[i][j] === 1) {
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX] = 0;
            }
         }
      }

      let rotatedMatrix = this.currentShape.matrix[0]
         .map((val, index) => this.currentShape.matrix.map(row => row[index]).reverse())

      for (let i = 0; i < rotatedMatrix.length; i++) {
         for (let j = 0; j < rotatedMatrix[0].length; j++) {
            if (rotatedMatrix[i][j] === 1 &&
               this.fieldMap[i + this.currentShape.offsetY][j + this.currentShape.offsetX] !== 0) {
               this.addShape(this.currentShape); // adding the shape back
               return;
            }
         }
      }      

      this.currentShape.matrix = rotatedMatrix
      this.addShape(this.currentShape);
   }

   draw(sprites) {
      this.fieldMap.forEach((row, i) => {
         row.forEach((value, j) => {
            if (value === 0) return;
            this.shapeCtx.drawImage(sprites[value], j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
         })
      })
   }
}

export default Field;